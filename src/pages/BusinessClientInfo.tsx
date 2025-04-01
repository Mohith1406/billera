
import { useEffect, useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Upload, Building, User, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessClientInfo = () => {
  const { invoiceData, updateBusinessInfo, updateClientInfo, setCurrentStep } = useInvoice();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo image must be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        updateBusinessInfo({ logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateBusinessInfo({ [name]: value });
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateClientInfo({ [name]: value });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        
        // Very simple CSV parsing - in a real app you'd use a proper CSV parser
        try {
          const rows = csvData.split('\n');
          if (rows.length > 1) {
            const headers = rows[0].split(',');
            const values = rows[1].split(',');
            
            // Map CSV fields to form fields - this is a simplistic approach
            const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
            const addressIndex = headers.findIndex(h => h.toLowerCase().includes('address'));
            const cityIndex = headers.findIndex(h => h.toLowerCase().includes('city'));
            const stateIndex = headers.findIndex(h => h.toLowerCase().includes('state'));
            const zipIndex = headers.findIndex(h => h.toLowerCase().includes('zip'));
            const countryIndex = headers.findIndex(h => h.toLowerCase().includes('country'));
            const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone'));
            const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
            
            // Update client info with CSV data
            updateClientInfo({
              name: nameIndex >= 0 ? values[nameIndex].trim() : '',
              address: addressIndex >= 0 ? values[addressIndex].trim() : '',
              city: cityIndex >= 0 ? values[cityIndex].trim() : '',
              state: stateIndex >= 0 ? values[stateIndex].trim() : '',
              zip: zipIndex >= 0 ? values[zipIndex].trim() : '',
              country: countryIndex >= 0 ? values[countryIndex].trim() : '',
              phone: phoneIndex >= 0 ? values[phoneIndex].trim() : '',
              email: emailIndex >= 0 ? values[emailIndex].trim() : '',
            });
            
            toast({
              title: "CSV Imported",
              description: "Client data imported successfully",
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Business & Client Information</h1>
          <p className="text-muted-foreground">
            Enter your business details and your client's information.
          </p>
        </div>

        <Tabs defaultValue="business" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Your Business
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Client Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="mb-4 w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Business logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <Button variant="outline" className="gap-2" asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="name"
                      value={invoiceData.businessInfo.name}
                      onChange={handleBusinessInfoChange}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Email</Label>
                    <Input
                      id="businessEmail"
                      name="email"
                      type="email"
                      value={invoiceData.businessInfo.email}
                      onChange={handleBusinessInfoChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessPhone">Phone</Label>
                    <Input
                      id="businessPhone"
                      name="phone"
                      value={invoiceData.businessInfo.phone}
                      onChange={handleBusinessInfoChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessWebsite">Website</Label>
                    <Input
                      id="businessWebsite"
                      name="website"
                      value={invoiceData.businessInfo.website}
                      onChange={handleBusinessInfoChange}
                      placeholder="www.yourcompany.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessTaxId">Tax ID / VAT Number</Label>
                    <Input
                      id="businessTaxId"
                      name="taxId"
                      value={invoiceData.businessInfo.taxId}
                      onChange={handleBusinessInfoChange}
                      placeholder="Tax ID / VAT Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessAddress">Street Address</Label>
                    <Input
                      id="businessAddress"
                      name="address"
                      value={invoiceData.businessInfo.address}
                      onChange={handleBusinessInfoChange}
                      placeholder="123 Business Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessCity">City</Label>
                    <Input
                      id="businessCity"
                      name="city"
                      value={invoiceData.businessInfo.city}
                      onChange={handleBusinessInfoChange}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessState">State / Province</Label>
                    <Input
                      id="businessState"
                      name="state"
                      value={invoiceData.businessInfo.state}
                      onChange={handleBusinessInfoChange}
                      placeholder="State / Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessZip">ZIP / Postal Code</Label>
                    <Input
                      id="businessZip"
                      name="zip"
                      value={invoiceData.businessInfo.zip}
                      onChange={handleBusinessInfoChange}
                      placeholder="ZIP / Postal Code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessCountry">Country</Label>
                    <Input
                      id="businessCountry"
                      name="country"
                      value={invoiceData.businessInfo.country}
                      onChange={handleBusinessInfoChange}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="client">
            <Card className="p-6">
              <div className="flex justify-end mb-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    name="name"
                    value={invoiceData.clientInfo.name}
                    onChange={handleClientInfoChange}
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    name="email"
                    type="email"
                    value={invoiceData.clientInfo.email}
                    onChange={handleClientInfoChange}
                    placeholder="client@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input
                    id="clientPhone"
                    name="phone"
                    value={invoiceData.clientInfo.phone}
                    onChange={handleClientInfoChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="clientAddress">Street Address</Label>
                  <Input
                    id="clientAddress"
                    name="address"
                    value={invoiceData.clientInfo.address}
                    onChange={handleClientInfoChange}
                    placeholder="123 Client Street"
                  />
                </div>
                <div>
                  <Label htmlFor="clientCity">City</Label>
                  <Input
                    id="clientCity"
                    name="city"
                    value={invoiceData.clientInfo.city}
                    onChange={handleClientInfoChange}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="clientState">State / Province</Label>
                  <Input
                    id="clientState"
                    name="state"
                    value={invoiceData.clientInfo.state}
                    onChange={handleClientInfoChange}
                    placeholder="State / Province"
                  />
                </div>
                <div>
                  <Label htmlFor="clientZip">ZIP / Postal Code</Label>
                  <Input
                    id="clientZip"
                    name="zip"
                    value={invoiceData.clientInfo.zip}
                    onChange={handleClientInfoChange}
                    placeholder="ZIP / Postal Code"
                  />
                </div>
                <div>
                  <Label htmlFor="clientCountry">Country</Label>
                  <Input
                    id="clientCountry"
                    name="country"
                    value={invoiceData.clientInfo.country}
                    onChange={handleClientInfoChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessClientInfo;
