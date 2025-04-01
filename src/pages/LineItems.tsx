
import { useEffect, useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Plus, Trash2, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const LineItems = () => {
  const { 
    invoiceData, 
    addLineItem, 
    updateLineItem, 
    removeLineItem, 
    calculateTotals, 
    setCurrentStep 
  } = useInvoice();
  const { toast } = useToast();
  
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
    discount: 0,
    category: "",
  });

  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headerMapping, setHeaderMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    setCurrentStep(3);
    calculateTotals();
  }, [setCurrentStep, calculateTotals]);

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === "description" || name === "category" ? value : Number(value)
    }));
  };

  const handleAddItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      toast({
        title: "Invalid item",
        description: "Please provide a description, quantity and price",
        variant: "destructive"
      });
      return;
    }
    
    addLineItem(newItem);
    
    // Reset form
    setNewItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discount: 0,
      category: "",
    });
  };

  const handleUpdateItem = (id: string, field: string, value: string | number) => {
    updateLineItem(id, { 
      [field]: typeof value === "string" ? value : Number(value) 
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        
        try {
          // Simple CSV parsing
          const rows = csvText.split('\n').map(row => 
            row.split(',').map(cell => cell.trim())
          );
          
          if (rows.length > 1) {
            const headers = rows[0];
            setCsvHeaders(headers);
            setCsvData(rows.slice(1));
            
            // Initialize default mappings
            const initialMapping: Record<string, string> = {};
            headers.forEach(header => {
              const lowerHeader = header.toLowerCase();
              if (lowerHeader.includes('desc')) initialMapping[header] = 'description';
              else if (lowerHeader.includes('quant')) initialMapping[header] = 'quantity';
              else if (lowerHeader.includes('price') || lowerHeader.includes('rate')) initialMapping[header] = 'unitPrice';
              else if (lowerHeader.includes('tax')) initialMapping[header] = 'taxRate';
              else if (lowerHeader.includes('disc')) initialMapping[header] = 'discount';
              else if (lowerHeader.includes('cat')) initialMapping[header] = 'category';
            });
            
            setHeaderMapping(initialMapping);
            setIsImportingCsv(true);
          } else {
            toast({
              title: "Invalid CSV",
              description: "CSV file must have at least one header row and one data row",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "CSV Import Failed",
            description: "Could not parse the CSV file",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleMappingChange = (header: string, invoiceField: string) => {
    setHeaderMapping(prev => ({
      ...prev,
      [header]: invoiceField
    }));
  };

  const importCsvItems = () => {
    // Import items based on the mapping
    csvData.forEach(row => {
      const item: any = {
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        discount: 0,
        category: "",
      };
      
      csvHeaders.forEach((header, index) => {
        const field = headerMapping[header];
        if (field && row[index]) {
          if (field === 'description' || field === 'category') {
            item[field] = row[index];
          } else {
            item[field] = parseFloat(row[index]) || 0;
          }
        }
      });
      
      if (item.description) {
        addLineItem(item);
      }
    });
    
    setIsImportingCsv(false);
    toast({
      title: "CSV Import Successful",
      description: `Imported ${csvData.length} line items`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoiceData.currency || 'USD',
    }).format(amount);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Invoice Line Items</h1>
          <p className="text-muted-foreground">
            Add the products or services you're billing for.
          </p>
        </div>

        {isImportingCsv ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Map CSV Headers to Invoice Fields</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">CSV Header</th>
                      <th className="text-left pb-2">Maps to Invoice Field</th>
                      <th className="text-left pb-2">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvHeaders.map((header, index) => (
                      <tr key={header} className="border-t">
                        <td className="py-2 pr-4">{header}</td>
                        <td className="py-2 pr-4">
                          <select
                            className="w-full p-2 border rounded"
                            value={headerMapping[header] || ""}
                            onChange={(e) => handleMappingChange(header, e.target.value)}
                          >
                            <option value="">-- Ignore this column --</option>
                            <option value="description">Description</option>
                            <option value="quantity">Quantity</option>
                            <option value="unitPrice">Unit Price</option>
                            <option value="taxRate">Tax Rate (%)</option>
                            <option value="discount">Discount (%)</option>
                            <option value="category">Category</option>
                          </select>
                        </td>
                        <td className="py-2">
                          {csvData[0] && (
                            <span className="text-sm text-gray-600">
                              {csvData[0][index]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-6">
                <Button onClick={importCsvItems}>Import Items</Button>
                <Button variant="outline" onClick={() => setIsImportingCsv(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Add New Item</h2>
                  <Button variant="outline" className="gap-2" asChild>
                    <label className="cursor-pointer">
                      <FileUp className="w-4 h-4" />
                      Import from CSV
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv"
                        onChange={handleCsvUpload}
                      />
                    </label>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={newItem.description}
                      onChange={handleNewItemChange}
                      placeholder="Item or service description"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label htmlFor="quantity">Qty</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={handleNewItemChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input
                      id="unitPrice"
                      name="unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.unitPrice}
                      onChange={handleNewItemChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label htmlFor="taxRate">Tax %</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      value={newItem.taxRate}
                      onChange={handleNewItemChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label htmlFor="discount">Disc %</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={newItem.discount}
                      onChange={handleNewItemChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={newItem.category}
                      onChange={handleNewItemChange}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      onClick={handleAddItem}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {invoiceData.lineItems.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Line Items</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Description</th>
                          <th className="text-right pb-2">Qty</th>
                          <th className="text-right pb-2">Unit Price</th>
                          <th className="text-right pb-2">Tax %</th>
                          <th className="text-right pb-2">Disc %</th>
                          <th className="text-right pb-2">Total</th>
                          <th className="text-center pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.lineItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-3 pr-4">
                              <Input
                                value={item.description}
                                onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                                className="border-0 p-0 h-auto bg-transparent"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                                className="border-0 p-0 h-auto bg-transparent text-right"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => handleUpdateItem(item.id, "unitPrice", e.target.value)}
                                className="border-0 p-0 h-auto bg-transparent text-right"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={item.taxRate}
                                onChange={(e) => handleUpdateItem(item.id, "taxRate", e.target.value)}
                                className="border-0 p-0 h-auto bg-transparent text-right"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={(e) => handleUpdateItem(item.id, "discount", e.target.value)}
                                className="border-0 p-0 h-auto bg-transparent text-right"
                              />
                            </td>
                            <td className="py-3 pr-4 text-right font-medium">
                              {formatCurrency(item.total)}
                            </td>
                            <td className="py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLineItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(invoiceData.subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-medium">-{formatCurrency(invoiceData.discountTotal)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Tax:</span>
                        <span className="font-medium">{formatCurrency(invoiceData.taxTotal)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">{formatCurrency(invoiceData.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <p className="mb-4">No line items added yet.</p>
                    <p>Add items above or import from CSV.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default LineItems;
