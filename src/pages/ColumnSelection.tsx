
import { useEffect } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";

const ColumnSelection = () => {
  const { invoiceData, updateColumnVisibility, setCurrentStep } = useInvoice();
  
  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleColumnToggle = (column: keyof typeof invoiceData.columnVisibility) => {
    updateColumnVisibility({ [column]: !invoiceData.columnVisibility[column] });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Select Columns to Display</h1>
          <p className="text-muted-foreground">
            Customize which columns appear in your final invoice.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Line Item Columns</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="description" 
                      checked={invoiceData.columnVisibility.description}
                      onCheckedChange={() => handleColumnToggle("description")}
                      disabled // Description should always be visible
                    />
                    <Label htmlFor="description" className="cursor-pointer">
                      Description <span className="text-sm text-muted-foreground">(Required)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="quantity" 
                      checked={invoiceData.columnVisibility.quantity}
                      onCheckedChange={() => handleColumnToggle("quantity")}
                    />
                    <Label htmlFor="quantity" className="cursor-pointer">
                      Quantity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unitPrice" 
                      checked={invoiceData.columnVisibility.unitPrice}
                      onCheckedChange={() => handleColumnToggle("unitPrice")}
                    />
                    <Label htmlFor="unitPrice" className="cursor-pointer">
                      Unit Price
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="taxRate" 
                      checked={invoiceData.columnVisibility.taxRate}
                      onCheckedChange={() => handleColumnToggle("taxRate")}
                    />
                    <Label htmlFor="taxRate" className="cursor-pointer">
                      Tax Rate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="discount" 
                      checked={invoiceData.columnVisibility.discount}
                      onCheckedChange={() => handleColumnToggle("discount")}
                    />
                    <Label htmlFor="discount" className="cursor-pointer">
                      Discount
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="total" 
                      checked={invoiceData.columnVisibility.total}
                      onCheckedChange={() => handleColumnToggle("total")}
                      disabled // Total should always be visible
                    />
                    <Label htmlFor="total" className="cursor-pointer">
                      Total <span className="text-sm text-muted-foreground">(Required)</span>
                    </Label>
                  </div>
                  {invoiceData.lineItems.some(item => item.category) && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="category" 
                        checked={invoiceData.columnVisibility.category}
                        onCheckedChange={() => handleColumnToggle("category")}
                      />
                      <Label htmlFor="category" className="cursor-pointer">
                        Category
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        {invoiceData.columnVisibility.description && <th className="text-left p-2 border-b">Description</th>}
                        {invoiceData.columnVisibility.quantity && <th className="text-right p-2 border-b">Qty</th>}
                        {invoiceData.columnVisibility.unitPrice && <th className="text-right p-2 border-b">Price</th>}
                        {invoiceData.columnVisibility.taxRate && <th className="text-right p-2 border-b">Tax %</th>}
                        {invoiceData.columnVisibility.discount && <th className="text-right p-2 border-b">Disc %</th>}
                        {invoiceData.columnVisibility.category && <th className="text-left p-2 border-b">Category</th>}
                        {invoiceData.columnVisibility.total && <th className="text-right p-2 border-b">Total</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.length > 0 ? (
                        invoiceData.lineItems.slice(0, 3).map((item) => (
                          <tr key={item.id} className="border-b">
                            {invoiceData.columnVisibility.description && <td className="p-2">{item.description}</td>}
                            {invoiceData.columnVisibility.quantity && <td className="p-2 text-right">{item.quantity}</td>}
                            {invoiceData.columnVisibility.unitPrice && <td className="p-2 text-right">${item.unitPrice.toFixed(2)}</td>}
                            {invoiceData.columnVisibility.taxRate && <td className="p-2 text-right">{item.taxRate}%</td>}
                            {invoiceData.columnVisibility.discount && <td className="p-2 text-right">{item.discount}%</td>}
                            {invoiceData.columnVisibility.category && <td className="p-2">{item.category || "-"}</td>}
                            {invoiceData.columnVisibility.total && <td className="p-2 text-right">${item.total.toFixed(2)}</td>}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td 
                            colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                            className="p-4 text-center text-muted-foreground"
                          >
                            No items to display
                          </td>
                        </tr>
                      )}
                      {invoiceData.lineItems.length > 3 && (
                        <tr>
                          <td 
                            colSpan={Object.values(invoiceData.columnVisibility).filter(Boolean).length} 
                            className="p-2 text-center text-muted-foreground"
                          >
                            ...and {invoiceData.lineItems.length - 3} more items
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Note: The final invoice will include totals for subtotal, tax, discounts, and grand total regardless of column visibility settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ColumnSelection;
