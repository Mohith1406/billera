
import { useEffect, useState, useRef } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { Download, Printer, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import { 
  ProfessionalTemplate, 
  ModernTemplate, 
  ClassicTemplate, 
  MinimalTemplate, 
  CreativeTemplate 
} from "@/templates/InvoiceTemplates";

const ExportInvoice = () => {
  const { invoiceData, setInvoiceData, setCurrentStep } = useInvoice();
  const { toast } = useToast();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
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
  }, [setCurrentStep, invoiceData.invoiceNumber, setInvoiceData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoiceData.currency || 'USD',
    }).format(amount);
  };

  const handleGeneratePdf = async () => {
    if (!invoiceRef.current) return;
    
    setIsPdfGenerating(true);
    
    try {
      // Apply white background style temporarily for PDF generation
      const originalStyle = invoiceRef.current.style.background;
      invoiceRef.current.style.background = "white";
      
      // Generate filename
      const fileName = `Invoice-${invoiceData.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      await html2pdf()
        .from(invoiceRef.current)
        .set({
          filename: fileName,
          margin: [10, 10, 10, 10], // Add margins [top, right, bottom, left] in mm
          html2canvas: {
            scale: 4,  // Increased scale for higher quality
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            letterRendering: true, // Improves text rendering
            dpi: 300, // Higher DPI for better resolution
            imageTimeout: 0, // No timeout for image loading
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: false, // No compression for better quality
            precision: 16, // Higher precision for vector graphics
            hotfixes: ["px_scaling"], // Fix scaling issues
          },
          pagebreak: { mode: 'avoid-all' }
        })
        .save();
      
      // Restore original style
      invoiceRef.current.style.background = originalStyle;
      
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been generated and downloaded successfully."
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Generating PDF", 
        description: "There was a problem generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleEmailInvoice = () => {
    toast({
      title: "Email Feature Coming Soon",
      description: "The email functionality will be available in a future update."
    });
  };

  const handlePrintInvoice = () => {
    toast({
      title: "Print Feature Coming Soon",
      description: "The print functionality will be available in a future update."
    });
  };

  // Render the appropriate template based on the selected template
  const renderTemplate = () => {
    if (!invoiceData.template) {
      return (
        <div className="p-8 border rounded-md bg-gray-50 flex items-center justify-center min-h-[500px]">
          <p className="text-muted-foreground">Please select a template to preview your invoice</p>
        </div>
      );
    }

    const templateProps = {
      invoiceData,
      formatCurrency,
      innerRef: invoiceRef
    };

    switch (invoiceData.template.id) {
      case "professional":
        return <ProfessionalTemplate {...templateProps} />;
      case "modern":
        return <ModernTemplate {...templateProps} />;
      case "classic":
        return <ClassicTemplate {...templateProps} />;
      case "minimal":
        return <MinimalTemplate {...templateProps} />;
      case "creative":
        return <CreativeTemplate {...templateProps} />;
      default:
        return <ProfessionalTemplate {...templateProps} />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Generate & Export Invoice</h1>
          <p className="text-muted-foreground">
            Finalize your invoice details and export it in your preferred format.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInputChange}
                        placeholder="INV-123456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        name="currency"
                        value={invoiceData.currency}
                        onChange={(e) => handleInputChange(e as any)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="GBP">GBP (British Pound)</option>
                        <option value="CAD">CAD (Canadian Dollar)</option>
                        <option value="AUD">AUD (Australian Dollar)</option>
                        <option value="INR">INR (Indian Rupee)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceDate">Invoice Date</Label>
                      <Input
                        id="invoiceDate"
                        name="invoiceDate"
                        type="date"
                        value={invoiceData.invoiceDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={invoiceData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional notes for the client..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      value={invoiceData.terms}
                      onChange={handleInputChange}
                      placeholder="Payment terms and conditions..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Export Options</h2>
                <div className="space-y-4">
                  <Button 
                    onClick={handleGeneratePdf} 
                    className="w-full flex items-center justify-center gap-2 py-6"
                    disabled={isPdfGenerating}
                  >
                    {isPdfGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleEmailInvoice}
                      className="flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email Invoice
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handlePrintInvoice}
                      className="flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Print Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardContent className="pt-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
                
                <div className="border rounded-md bg-gray-50 overflow-auto max-h-[calc(100vh-12rem)] shadow-md w-full md:min-w-[500px] lg:min-w-[600px]">
                  {renderTemplate()}
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>This is a preview. The actual PDF may look slightly different.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExportInvoice;
