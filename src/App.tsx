
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import TemplateSelection from "./pages/TemplateSelection";
import BusinessClientInfo from "./pages/BusinessClientInfo";
import LineItems from "./pages/LineItems";
import ColumnSelection from "./pages/ColumnSelection";
import ExportInvoice from "./pages/ExportInvoice";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="billera-theme">
      <TooltipProvider>
        <InvoiceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<InvoiceGenerator />} />
              <Route path="/templates" element={<TemplateSelection />} />
              <Route path="/business-client-info" element={<BusinessClientInfo />} />
              <Route path="/line-items" element={<LineItems />} />
              <Route path="/column-selection" element={<ColumnSelection />} />
              <Route path="/export" element={<ExportInvoice />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </InvoiceProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
