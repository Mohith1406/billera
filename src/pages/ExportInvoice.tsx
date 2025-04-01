
import { useEffect, useState, useRef } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { Download, Printer, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,  // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      // Restore original style
      invoiceRef.current.style.background = originalStyle;
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions based on canvas aspect ratio
      const imgWidth = 210;  // A4 width in mm (210mm)
      const pageHeight = 297;  // A4 height in mm (297mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if the invoice is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Generate filename
      const fileName = `Invoice-${invoiceData.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Generate & Export Invoice</h1>
          <p className="text-muted-foreground">
            Finalize your invoice details and export it in your preferred format.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                
                <div 
                  ref={invoiceRef} 
                  className="border rounded-md p-6 bg-white scale-100 transform origin-top-left overflow-auto max-h-[calc(100vh-12rem)] shadow-md"
                >
                  <div className="flex justify-between mb-8">
                    <div>
                      {invoiceData.businessInfo.logo ? (
                        <img 
                          src={invoiceData.businessInfo.logo} 
                          alt="Business Logo" 
                          className="h-16 mb-4 object-contain"
                        />
                      ) : (
                        <div className="h-16 mb-4 font-bold text-xl text-primary">
                          {invoiceData.businessInfo.name || "Your Business Name"}
                        </div>
                      )}
                      <div className="text-sm space-y-1">
                        <p className="font-semibold">{invoiceData.businessInfo.name || "Your Business Name"}</p>
                        <p>{invoiceData.businessInfo.address || "Business Address"}</p>
                        <p>
                          {invoiceData.businessInfo.city ? invoiceData.businessInfo.city + ", " : ""}
                          {invoiceData.businessInfo.state || ""}
                          {invoiceData.businessInfo.zip ? " " + invoiceData.businessInfo.zip : ""}
                        </p>
                        <p>{invoiceData.businessInfo.country || ""}</p>
                        <p>{invoiceData.businessInfo.phone || ""}</p>
                        <p>{invoiceData.businessInfo.email || ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-4">INVOICE</div>
                      <div className="text-sm space-y-1">
                        <p><span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}</p>
                        <p><span className="font-semibold">Date:</span> {invoiceData.invoiceDate}</p>
                        <p><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="font-semibold mb-2">Bill To:</div>
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">{invoiceData.clientInfo.name || "Client Name"}</p>
                      <p>{invoiceData.clientInfo.address || "Client Address"}</p>
                      <p>
                        {invoiceData.clientInfo.city ? invoiceData.clientInfo.city + ", " : ""}
                        {invoiceData.clientInfo.state || ""}
                        {invoiceData.clientInfo.zip ? " " + invoiceData.clientInfo.zip : ""}
                      </p>
                      <p>{invoiceData.clientInfo.country || ""}</p>
                      <p>{invoiceData.clientInfo.phone || ""}</p>
                      <p>{invoiceData.clientInfo.email || ""}</p>
                    </div>
                  </div>

                  <table className="w-full text-sm mb-8">
                    <thead>
                      <tr className="bg-muted/30 border-t border-b">
                        {invoiceData.columnVisibility.description && <th className="text-left py-2 px-2">Description</th>}
                        {invoiceData.columnVisibility.quantity && <th className="text-right py-2 px-2">Qty</th>}
                        {invoiceData.columnVisibility.unitPrice && <th className="text-right py-2 px-2">Price</th>}
                        {invoiceData.columnVisibility.taxRate && <th className="text-right py-2 px-2">Tax %</th>}
                        {invoiceData.columnVisibility.discount && <th className="text-right py-2 px-2">Disc %</th>}
                        {invoiceData.columnVisibility.category && <th className="text-left py-2 px-2">Category</th>}
                        {invoiceData.columnVisibility.total && <th className="text-right py-2 px-2">Total</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.length > 0 ? (
                        invoiceData.lineItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            {invoiceData.columnVisibility.description && <td className="py-2 px-2">{item.description}</td>}
                            {invoiceData.columnVisibility.quantity && <td className="py-2 px-2 text-right">{item.quantity}</td>}
                            {invoiceData.columnVisibility.unitPrice && <td className="py-2 px-2 text-right">{formatCurrency(item.unitPrice)}</td>}
                            {invoiceData.columnVisibility.taxRate && <td className="py-2 px-2 text-right">{item.taxRate}%</td>}
                            {invoiceData.columnVisibility.discount && <td className="py-2 px-2 text-right">{item.discount}%</td>}
                            {invoiceData.columnVisibility.category && <td className="py-2 px-2">{item.category || "-"}</td>}
                            {invoiceData.columnVisibility.total && <td className="py-2 px-2 text-right">{formatCurrency(item.total)}</td>}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td 
                            colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                            className="py-4 text-center text-muted-foreground"
                          >
                            No items to display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(invoiceData.subtotal)}</span>
                      </div>
                      {invoiceData.discountTotal > 0 && (
                        <div className="flex justify-between py-2">
                          <span>Discount:</span>
                          <span>-{formatCurrency(invoiceData.discountTotal)}</span>
                        </div>
                      )}
                      {invoiceData.taxTotal > 0 && (
                        <div className="flex justify-between py-2">
                          <span>Tax:</span>
                          <span>{formatCurrency(invoiceData.taxTotal)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between py-2 font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(invoiceData.grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {(invoiceData.notes || invoiceData.terms) && (
                    <div className="space-y-4 mt-8 text-sm">
                      {invoiceData.notes && (
                        <div>
                          <h3 className="font-semibold mb-1">Notes</h3>
                          <p className="text-muted-foreground">{invoiceData.notes}</p>
                        </div>
                      )}
                      {invoiceData.terms && (
                        <div>
                          <h3 className="font-semibold mb-1">Terms & Conditions</h3>
                          <p className="text-muted-foreground">{invoiceData.terms}</p>
                        </div>
                      )}
                    </div>
                  )}
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
