
import { useState, useRef, useEffect } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2pdf from "html2pdf.js";
import { ArrowLeft, ArrowRight, Download, FileArchive, Mail, Printer } from "lucide-react";
import { InvoiceTemplates } from "@/templates/InvoiceTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ExportInvoice = () => {
  const { 
    invoiceData, 
    setCurrentStep,
    invoiceBatch,
    selectNextInvoice,
    selectPreviousInvoice,
    setInvoiceData
  } = useInvoice();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  useEffect(() => {
    setCurrentStep(5);
    
    // Generate a random invoice number if not already set
    if (!invoiceData.invoiceNumber) {
      const randomInvoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: randomInvoiceNumber
      }));
    }
  }, [invoiceData.invoiceNumber, setCurrentStep, setInvoiceData]);

  const generatePDF = async (forDownload = true) => {
    if (!invoiceRef.current) {
      console.error("Invoice reference is null, cannot generate PDF");
      return null;
    }
    
    try {
      const element = invoiceRef.current.cloneNode(true) as HTMLElement;
      console.log("Generating PDF from element:", element);
      
      const pdfOptions = {
        margin: 10,
        filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      if (!forDownload) {
        return html2pdf()
          .set(pdfOptions)
          .from(element)
          .outputPdf('blob');
      }
      
      const pdf = await html2pdf().set(pdfOptions).from(element).save();
      
      toast({
        title: "PDF Generated",
        description: "Your invoice PDF has been created successfully",
      });
      
      return pdf;
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating your PDF",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    await generatePDF();
    setIsGenerating(false);
  };

  const generateBatchZip = async () => {
    if (!invoiceBatch || !invoiceBatch.invoices.length) {
      toast({
        title: "No Batch Found",
        description: "No invoice batch was found to process",
        variant: "destructive"
      });
      return;
    }
    
    setIsBatchGenerating(true);
    const zip = new JSZip();
    const currentIndex = invoiceBatch.currentIndex;
    const toastId = toast({
      title: "Generating Batch",
      description: "Creating PDFs for all invoices...",
    });
    
    try {
      for (let i = 0; i < invoiceBatch.invoices.length; i++) {
        if (i !== currentIndex) {
          selectNextInvoice();
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        const pdfBlob = await generatePDF(false);
        if (pdfBlob) {
          const filename = `Invoice_${invoiceBatch.invoices[i].invoiceNumber}.pdf`;
          zip.file(filename, pdfBlob);
        }
      }
      
      while (invoiceBatch.currentIndex !== currentIndex) {
        if (invoiceBatch.currentIndex > currentIndex) {
          selectPreviousInvoice();
        } else {
          selectNextInvoice();
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Invoices.zip");
      
      toast({
        title: "Batch Download Complete",
        description: `Successfully created a ZIP file with ${invoiceBatch.invoices.length} invoices`,
      });
    } catch (error) {
      console.error("Error generating batch ZIP:", error);
      toast({
        title: "Batch Processing Error",
        description: "There was a problem creating the invoice batch ZIP file",
        variant: "destructive"
      });
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const printInvoice = () => {
    if (!invoiceRef.current) return;
    
    const content = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              @media print {
                body {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      toast({
        title: "Print Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive"
      });
    }
  };

  const sendInvoiceByEmail = () => {
    toast({
      title: "Preparing Email",
      description: "Email functionality would send the invoice to the client",
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Export Invoice</h1>
          <p className="text-muted-foreground">
            Preview your invoice and export it in various formats.
          </p>
        </div>

        {invoiceBatch && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Multiple Invoices</h2>
                  <p className="text-muted-foreground">
                    Viewing invoice {invoiceBatch.currentIndex + 1} of {invoiceBatch.invoices.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={invoiceBatch.currentIndex === 0}
                    onClick={selectPreviousInvoice}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={invoiceBatch.currentIndex === invoiceBatch.invoices.length - 1}
                    onClick={selectNextInvoice}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="actions">Export Options</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="mt-0">
            <Card className="mb-6 border border-gray-200">
              <CardContent className="p-0 overflow-auto">
                <div className="p-8">
                  {invoiceData.template ? (
                    <InvoiceTemplates 
                      templateId={invoiceData.template.id} 
                      invoice={invoiceData}
                      innerRef={invoiceRef}
                    />
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        No template selected. Please go back and select a template.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Download className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-medium mb-2">Download PDF</h3>
                    <p className="text-muted-foreground mb-4">
                      Save your invoice as a PDF file to your device.
                    </p>
                    <Button 
                      onClick={handleGeneratePDF} 
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Download PDF"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Printer className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-medium mb-2">Print Invoice</h3>
                    <p className="text-muted-foreground mb-4">
                      Print your invoice directly from your browser.
                    </p>
                    <Button onClick={printInvoice} className="w-full">
                      Print Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Mail className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-medium mb-2">Email Invoice</h3>
                    <p className="text-muted-foreground mb-4">
                      Send the invoice directly to your client's email.
                    </p>
                    <Button onClick={sendInvoiceByEmail} className="w-full">
                      Send by Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {invoiceBatch && invoiceBatch.invoices.length > 1 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2">Batch Operations</h3>
                  <p className="text-muted-foreground mb-4">
                    Apply actions to all {invoiceBatch.invoices.length} invoices at once.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={generateBatchZip}
                      disabled={isBatchGenerating}
                      className="flex items-center gap-2"
                    >
                      <FileArchive className="h-4 w-4" />
                      {isBatchGenerating ? "Creating ZIP..." : "Download All as ZIP"}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: "Batch Email",
                        description: `Sending all ${invoiceBatch.invoices.length} invoices to respective clients`,
                      });
                    }}>
                      Email All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExportInvoice;
