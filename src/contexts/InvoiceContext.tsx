import React, { createContext, useState, useContext, ReactNode } from "react";

// Define types for our context
export type InvoiceTemplate = {
  id: string;
  name: string;
  image: string;
  description?: string;
};

export type BusinessInfo = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo: string | null;
};

export type ClientInfo = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
  category?: string;
};

export type ColumnVisibility = {
  description: boolean;
  quantity: boolean;
  unitPrice: boolean;
  taxRate: boolean;
  discount: boolean;
  total: boolean;
  category: boolean;
};

export type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  language: string;
  locale: string;
  notes: string;
  terms: string;
  template: InvoiceTemplate | null;
  businessInfo: BusinessInfo;
  clientInfo: ClientInfo;
  lineItems: LineItem[];
  columnVisibility: ColumnVisibility;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  separateCategories: boolean;
};

export type InvoiceBatch = {
  currentIndex: number;
  invoices: InvoiceData[];
};

interface InvoiceContextType {
  invoiceData: InvoiceData;
  currentStep: number;
  availableTemplates: InvoiceTemplate[];
  invoiceBatch: InvoiceBatch | null;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  updateClientInfo: (info: Partial<ClientInfo>) => void;
  addLineItem: (item: Omit<LineItem, "id" | "total">) => void;
  updateLineItem: (id: string, item: Partial<Omit<LineItem, "id">>) => void;
  removeLineItem: (id: string) => void;
  updateColumnVisibility: (columns: Partial<ColumnVisibility>) => void;
  calculateTotals: () => void;
  resetInvoice: () => void;
  toggleCategorySeparation: () => void;
  createMultipleInvoices: (invoices: Array<{clientInfo: Partial<ClientInfo>, lineItems: Omit<LineItem, "id" | "total">[]}>) => void;
  selectNextInvoice: () => void;
  selectPreviousInvoice: () => void;
}

// Available templates
export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: "professional",
    name: "Professional",
    image: "/placeholder.svg",
    description: "A clean, professional template suitable for most businesses"
  },
  {
    id: "modern",
    name: "Modern",
    image: "/placeholder.svg",
    description: "A contemporary design with a fresh, modern look"
  },
  {
    id: "classic",
    name: "Classic",
    image: "/placeholder.svg",
    description: "Traditional invoice layout with bordered tables"
  },
  {
    id: "minimal",
    name: "Minimal",
    image: "/placeholder.svg",
    description: "Simple, elegant design with minimal decorative elements"
  },
  {
    id: "creative",
    name: "Creative",
    image: "/placeholder.svg",
    description: "Stylish design with decorative elements and color accents"
  },
];

// Initial state
const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "USD",
  language: "en",
  locale: "en-US",
  notes: "",
  terms: "Payment is due within 30 days",
  template: null,
  businessInfo: {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    logo: null,
  },
  clientInfo: {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "",
  },
  lineItems: [],
  columnVisibility: {
    description: true,
    quantity: true,
    unitPrice: true,
    taxRate: true,
    discount: true,
    total: true,
    category: false,
  },
  subtotal: 0,
  taxTotal: 0,
  discountTotal: 0,
  grandTotal: 0,
  separateCategories: false,
};

export const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceBatch, setInvoiceBatch] = useState<InvoiceBatch | null>(null);

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setInvoiceData((prev) => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, ...info },
    }));
  };

  const updateClientInfo = (info: Partial<ClientInfo>) => {
    setInvoiceData((prev) => ({
      ...prev,
      clientInfo: { ...prev.clientInfo, ...info },
    }));
  };

  const addLineItem = (item: Omit<LineItem, "id" | "total">) => {
    const id = crypto.randomUUID();
    const total = calculateItemTotal(item);
    
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...item, id, total }],
    }));
    
    calculateTotals();
  };

  const updateLineItem = (id: string, item: Partial<Omit<LineItem, "id">>) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.lineItems.map((lineItem) => {
        if (lineItem.id === id) {
          const updatedItem = { ...lineItem, ...item };
          updatedItem.total = calculateItemTotal(updatedItem);
          return updatedItem;
        }
        return lineItem;
      });
      
      return { ...prev, lineItems: updatedItems };
    });
    
    calculateTotals();
  };

  const removeLineItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
    
    calculateTotals();
  };

  const updateColumnVisibility = (columns: Partial<ColumnVisibility>) => {
    setInvoiceData((prev) => ({
      ...prev,
      columnVisibility: { ...prev.columnVisibility, ...columns },
    }));
  };

  const calculateItemTotal = (item: Omit<LineItem, "id" | "total"> | LineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const taxAmount = (subtotal - discountAmount) * (item.taxRate / 100);
    return subtotal - discountAmount + taxAmount;
  };

  const calculateTotals = () => {
    setInvoiceData((prev) => {
      const subtotal = prev.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      
      const discountTotal = prev.lineItems.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice * (item.discount / 100)),
        0
      );
      
      const taxableAmount = subtotal - discountTotal;
      
      const taxTotal = prev.lineItems.reduce(
        (sum, item) => {
          const itemSubtotal = item.quantity * item.unitPrice;
          const itemDiscount = itemSubtotal * (item.discount / 100);
          return sum + ((itemSubtotal - itemDiscount) * (item.taxRate / 100));
        },
        0
      );
      
      const grandTotal = subtotal - discountTotal + taxTotal;
      
      return {
        ...prev,
        subtotal,
        discountTotal,
        taxTotal,
        grandTotal,
      };
    });
  };

  const toggleCategorySeparation = () => {
    setInvoiceData(prev => ({
      ...prev,
      separateCategories: !prev.separateCategories
    }));
  };

  const resetInvoice = () => {
    setInvoiceData(defaultInvoiceData);
    setCurrentStep(1);
    setInvoiceBatch(null);
  };

  const createMultipleInvoices = (invoices: Array<{clientInfo: Partial<ClientInfo>, lineItems: Omit<LineItem, "id" | "total">[]}>) => {
    const { businessInfo, template, currency, language, locale, terms, notes, invoiceDate, dueDate, columnVisibility, separateCategories } = invoiceData;
    
    const completeInvoices: InvoiceData[] = invoices.map((invoice, index) => {
      const lineItemsWithIds = invoice.lineItems.map(item => {
        const id = crypto.randomUUID();
        const total = calculateItemTotal(item);
        return { ...item, id, total };
      });
      
      const subtotal = lineItemsWithIds.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      
      const discountTotal = lineItemsWithIds.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice * (item.discount / 100)),
        0
      );
      
      const taxTotal = lineItemsWithIds.reduce(
        (sum, item) => {
          const itemSubtotal = item.quantity * item.unitPrice;
          const itemDiscount = itemSubtotal * (item.discount / 100);
          return sum + ((itemSubtotal - itemDiscount) * (item.taxRate / 100));
        },
        0
      );
      
      const grandTotal = subtotal - discountTotal + taxTotal;
      
      const completeClientInfo: ClientInfo = {
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
        email: "",
        ...invoice.clientInfo
      };
      
      const invoiceNumber = `INV-${(index + 1).toString().padStart(3, '0')}`;
      
      return {
        invoiceNumber,
        invoiceDate,
        dueDate,
        currency,
        language,
        locale,
        notes,
        terms,
        template,
        businessInfo,
        clientInfo: completeClientInfo,
        lineItems: lineItemsWithIds,
        columnVisibility,
        subtotal,
        taxTotal,
        discountTotal,
        grandTotal,
        separateCategories,
      };
    });
    
    if (completeInvoices.length > 0) {
      setInvoiceData(completeInvoices[0]);
      
      if (completeInvoices.length > 1) {
        setInvoiceBatch({
          currentIndex: 0,
          invoices: completeInvoices
        });
      } else {
        setInvoiceBatch(null);
      }
    }
  };

  const selectNextInvoice = () => {
    if (invoiceBatch && invoiceBatch.currentIndex < invoiceBatch.invoices.length - 1) {
      const nextIndex = invoiceBatch.currentIndex + 1;
      setInvoiceData(invoiceBatch.invoices[nextIndex]);
      setInvoiceBatch({
        ...invoiceBatch,
        currentIndex: nextIndex
      });
    }
  };

  const selectPreviousInvoice = () => {
    if (invoiceBatch && invoiceBatch.currentIndex > 0) {
      const prevIndex = invoiceBatch.currentIndex - 1;
      setInvoiceData(invoiceBatch.invoices[prevIndex]);
      setInvoiceBatch({
        ...invoiceBatch,
        currentIndex: prevIndex
      });
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        currentStep,
        availableTemplates: invoiceTemplates,
        invoiceBatch,
        setInvoiceData,
        setCurrentStep,
        updateBusinessInfo,
        updateClientInfo,
        addLineItem,
        updateLineItem,
        removeLineItem,
        updateColumnVisibility,
        calculateTotals,
        resetInvoice,
        toggleCategorySeparation,
        createMultipleInvoices,
        selectNextInvoice,
        selectPreviousInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};
