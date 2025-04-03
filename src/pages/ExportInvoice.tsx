
import { useEffect, useState, useRef } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const ExportInvoice = () => {
  const { invoiceData, setCurrentStep } = useInvoice();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    
    setIsGeneratingPdf(true);
    
    try {
      const options = {
        margin: 10,
        filename: `Invoice-${invoiceData.invoiceNumber || 'Draft'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(invoiceRef.current).set(options).save();
      
      toast({
        title: "PDF Downloaded",
        description: "Your invoice has been downloaded as a PDF"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was a problem generating your PDF",
        variant: "destructive"
      });
      console.error("PDF generation error:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoiceData.currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Group line items by category if separateCategories is enabled
  const getGroupedLineItems = () => {
    if (!invoiceData.separateCategories) {
      return [{ category: '', items: invoiceData.lineItems }];
    }

    const groupedItems: { category: string, items: typeof invoiceData.lineItems }[] = [];
    const itemsByCategory: Record<string, typeof invoiceData.lineItems> = {};

    // Group items by category
    invoiceData.lineItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!itemsByCategory[category]) {
        itemsByCategory[category] = [];
      }
      itemsByCategory[category].push(item);
    });

    // Convert to array format
    Object.entries(itemsByCategory).forEach(([category, items]) => {
      groupedItems.push({ category, items });
    });

    return groupedItems;
  };

  const groupedLineItems = getGroupedLineItems();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Export Invoice</h1>
          <p className="text-muted-foreground">
            Preview your invoice and download it as a PDF or print it.
          </p>
        </div>

        <div className="flex justify-end gap-4 mb-6">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button 
            className="gap-2"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            <Download className="w-4 h-4" />
            {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>

        <Card className="mb-8 w-full">
          <CardContent className="p-8">
            <div ref={invoiceRef} className="bg-white text-black p-8 max-w-4xl mx-auto">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  {invoiceData.businessInfo.logo && (
                    <img 
                      src={invoiceData.businessInfo.logo} 
                      alt="Business Logo" 
                      className="mb-4 max-h-16 max-w-48 object-contain"
                    />
                  )}
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                  {invoiceData.invoiceNumber && (
                    <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                  )}
                </div>

                <div className="text-right">
                  <h2 className="font-bold text-xl mb-1">{invoiceData.businessInfo.name}</h2>
                  <p>{invoiceData.businessInfo.address}</p>
                  <p>{invoiceData.businessInfo.city}, {invoiceData.businessInfo.state} {invoiceData.businessInfo.zip}</p>
                  <p>{invoiceData.businessInfo.country}</p>
                  <p>{invoiceData.businessInfo.phone}</p>
                  <p>{invoiceData.businessInfo.email}</p>
                  {invoiceData.businessInfo.website && (
                    <p>{invoiceData.businessInfo.website}</p>
                  )}
                  {invoiceData.businessInfo.taxId && (
                    <p>Tax ID: {invoiceData.businessInfo.taxId}</p>
                  )}
                </div>
              </div>

              {/* Invoice Info & Client Info */}
              <div className="flex justify-between mb-12">
                <div>
                  <h3 className="font-bold mb-2 text-gray-700">Bill To:</h3>
                  <h4 className="font-semibold">{invoiceData.clientInfo.name}</h4>
                  <p>{invoiceData.clientInfo.address}</p>
                  <p>{invoiceData.clientInfo.city}, {invoiceData.clientInfo.state} {invoiceData.clientInfo.zip}</p>
                  <p>{invoiceData.clientInfo.country}</p>
                  <p>{invoiceData.clientInfo.phone}</p>
                  <p>{invoiceData.clientInfo.email}</p>
                </div>

                <div className="text-right">
                  <div className="mb-2">
                    <span className="font-bold text-gray-700">Invoice Date:</span>
                    <span className="ml-2">{formatDate(invoiceData.invoiceDate)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-gray-700">Due Date:</span>
                    <span className="ml-2">{formatDate(invoiceData.dueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              {groupedLineItems.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-8">
                  {group.category && invoiceData.separateCategories && (
                    <h3 className="font-bold text-lg mb-2">{group.category}</h3>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        {invoiceData.columnVisibility.description && <TableHead>Description</TableHead>}
                        {invoiceData.columnVisibility.quantity && <TableHead className="text-right">Qty</TableHead>}
                        {invoiceData.columnVisibility.unitPrice && <TableHead className="text-right">Price</TableHead>}
                        {invoiceData.columnVisibility.taxRate && <TableHead className="text-right">Tax %</TableHead>}
                        {invoiceData.columnVisibility.discount && <TableHead className="text-right">Disc %</TableHead>}
                        {invoiceData.columnVisibility.category && !invoiceData.separateCategories && (
                          <TableHead>Category</TableHead>
                        )}
                        {invoiceData.columnVisibility.total && <TableHead className="text-right">Total</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.items.map((item) => (
                        <TableRow key={item.id}>
                          {invoiceData.columnVisibility.description && <TableCell>{item.description}</TableCell>}
                          {invoiceData.columnVisibility.quantity && <TableCell className="text-right">{item.quantity}</TableCell>}
                          {invoiceData.columnVisibility.unitPrice && <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>}
                          {invoiceData.columnVisibility.taxRate && <TableCell className="text-right">{item.taxRate}%</TableCell>}
                          {invoiceData.columnVisibility.discount && <TableCell className="text-right">{item.discount}%</TableCell>}
                          {invoiceData.columnVisibility.category && !invoiceData.separateCategories && (
                            <TableCell>{item.category || ''}</TableCell>
                          )}
                          {invoiceData.columnVisibility.total && <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t">
                    <span className="font-medium">Subtotal:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  {invoiceData.discountTotal > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Discount:</span>
                      <span>-{formatCurrency(invoiceData.discountTotal)}</span>
                    </div>
                  )}
                  {invoiceData.taxTotal > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Tax:</span>
                      <span>{formatCurrency(invoiceData.taxTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-t-2 font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(invoiceData.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {(invoiceData.notes || invoiceData.terms) && (
                <div className="mt-12 border-t pt-4">
                  {invoiceData.notes && (
                    <div className="mb-4">
                      <h4 className="font-bold mb-2">Notes</h4>
                      <p className="text-gray-700">{invoiceData.notes}</p>
                    </div>
                  )}
                  {invoiceData.terms && (
                    <div>
                      <h4 className="font-bold mb-2">Terms & Conditions</h4>
                      <p className="text-gray-700">{invoiceData.terms}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ExportInvoice;
