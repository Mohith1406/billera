
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/contexts/InvoiceContext";
import Layout from "@/components/Layout";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TemplateSelection = () => {
  const { invoiceData, setInvoiceData, setCurrentStep, availableTemplates } = useInvoice();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const selectTemplate = (template: typeof availableTemplates[0]) => {
    setInvoiceData((prev) => ({
      ...prev,
      template: template,
    }));
  };

  const handleNext = () => {
    if (invoiceData.template) {
      navigate("/business-client-info");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Select Invoice Template</h1>
          <p className="text-muted-foreground">
            Choose a template that matches your brand and style. Each template offers a different layout and design aesthetic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                invoiceData.template?.id === template.id 
                  ? "ring-2 ring-primary" 
                  : "hover:ring-1 hover:ring-primary/30"
              }`}
              onClick={() => selectTemplate(template)}
            >
              <div className="relative">
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="w-full h-48 object-cover border-b"
                />
                {invoiceData.template?.id === template.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            size="lg" 
            onClick={handleNext}
            disabled={!invoiceData.template}
          >
            Continue
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateSelection;
