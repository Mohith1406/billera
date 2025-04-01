
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/contexts/InvoiceContext";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

type StepInfo = {
  number: number;
  title: string;
  path: string;
};

const steps: StepInfo[] = [
  { number: 1, title: "Template", path: "/templates" },
  { number: 2, title: "Business/Client Info", path: "/business-client-info" },
  { number: 3, title: "Line Items", path: "/line-items" },
  { number: 4, title: "Column Selection", path: "/column-selection" },
  { number: 5, title: "Export", path: "/export" },
];

const StepNavigation = () => {
  const { currentStep, setCurrentStep } = useInvoice();
  const navigate = useNavigate();

  const goToStep = (step: StepInfo) => {
    // Only allow going to steps that are completed or the next step
    if (step.number <= currentStep) {
      setCurrentStep(step.number);
      navigate(step.path);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      const prevStep = steps.find((step) => step.number === currentStep - 1);
      if (prevStep) {
        setCurrentStep(prevStep.number);
        navigate(prevStep.path);
      }
    } else {
      navigate("/");
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      const nextStep = steps.find((step) => step.number === currentStep + 1);
      if (nextStep) {
        setCurrentStep(nextStep.number);
        navigate(nextStep.path);
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <ul className="flex space-x-2 md:space-x-4">
          {steps.map((step) => (
            <li key={step.number} className="flex items-center">
              <button
                onClick={() => goToStep(step)}
                className={`flex items-center space-x-1 transition-colors ${
                  step.number === currentStep
                    ? "step-active"
                    : step.number < currentStep
                    ? "step-completed"
                    : "step-inactive"
                }`}
                disabled={step.number > currentStep}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                    step.number === currentStep
                      ? "bg-primary text-white border-primary"
                      : step.number < currentStep
                      ? "bg-green-100 border-green-600 text-green-600"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="hidden md:inline">{step.title}</span>
              </button>
              {step.number < steps.length && (
                <div className="mx-1 md:mx-2 text-gray-300">—</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        {currentStep < steps.length && (
          <Button onClick={goToNextStep} className="flex items-center gap-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
