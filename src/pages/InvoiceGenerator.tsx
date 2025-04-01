
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, FileText, Clock, Download } from "lucide-react";

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Generate a random invoice number with prefix "INV-" followed by 6 digits
    const randomInvoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    // We could set this in the invoice context if needed
  }, []);

  return (
    <Layout showStepNav={false}>
      <div className="max-w-5xl mx-auto pt-10 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Professional Invoice Generator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional, customizable invoices in minutes. Perfect for businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-4">
                <FileText className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Professional Templates</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose from multiple professional invoice templates that meet your brand standards.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-4">
                <Clock className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Save Time</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Import business & client data via CSV, map columns, and generate invoices in seconds.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-4">
                <Download className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Easy Export</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Export your invoices as professional PDFs ready to share with your clients.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/templates")}
            className="text-lg px-8 py-6 h-auto"
          >
            Create New Invoice
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceGenerator;
