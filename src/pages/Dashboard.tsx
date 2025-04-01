
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search, Download, ArrowUp, ArrowDown, Calendar } from "lucide-react";

// Mock data for invoices
const mockInvoices = [
  {
    id: "INV-783901",
    client: "Acme Corporation",
    date: "2023-09-15",
    amount: 2750.00,
    status: "Paid",
  },
  {
    id: "INV-783902",
    client: "Globex Industries",
    date: "2023-09-10",
    amount: 1200.50,
    status: "Pending",
  },
  {
    id: "INV-783903",
    client: "Stark Enterprises",
    date: "2023-09-05",
    amount: 5000.00,
    status: "Paid",
  },
  {
    id: "INV-783904",
    client: "Wayne Industries",
    date: "2023-08-28",
    amount: 3200.75,
    status: "Overdue",
  },
  {
    id: "INV-783905",
    client: "LexCorp",
    date: "2023-08-20",
    amount: 1800.00,
    status: "Paid",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key as keyof typeof a;
    
    if (a[key] < b[key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout showStepNav={false}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoice Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and track all your invoices in one place.
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Total Invoices</p>
                  <h3 className="text-3xl font-bold mt-1">5</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <h3 className="text-3xl font-bold mt-1">$13,951.25</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                  <Download className="w-6 h-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">Recent Activity</p>
                  <h3 className="text-3xl font-bold mt-1">Today</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                  <Calendar className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <h2 className="text-2xl font-semibold mb-4 md:mb-0">Recent Invoices</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('id')}
                      >
                        Invoice
                        {sortConfig?.key === 'id' && (
                          sortConfig.direction === 'ascending' ? 
                            <ArrowUp className="ml-1 h-3 w-3" /> : 
                            <ArrowDown className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left pb-4">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('client')}
                      >
                        Client
                        {sortConfig?.key === 'client' && (
                          sortConfig.direction === 'ascending' ? 
                            <ArrowUp className="ml-1 h-3 w-3" /> : 
                            <ArrowDown className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left pb-4">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('date')}
                      >
                        Date
                        {sortConfig?.key === 'date' && (
                          sortConfig.direction === 'ascending' ? 
                            <ArrowUp className="ml-1 h-3 w-3" /> : 
                            <ArrowDown className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-right pb-4">
                      <button 
                        className="flex items-center justify-end focus:outline-none"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        {sortConfig?.key === 'amount' && (
                          sortConfig.direction === 'ascending' ? 
                            <ArrowUp className="ml-1 h-3 w-3" /> : 
                            <ArrowDown className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left pb-4">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('status')}
                      >
                        Status
                        {sortConfig?.key === 'status' && (
                          sortConfig.direction === 'ascending' ? 
                            <ArrowUp className="ml-1 h-3 w-3" /> : 
                            <ArrowDown className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-right pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.length > 0 ? (
                    sortedInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-primary" />
                            {invoice.id}
                          </div>
                        </td>
                        <td className="py-4">{invoice.client}</td>
                        <td className="py-4">{formatDate(invoice.date)}</td>
                        <td className="py-4 text-right font-medium">{formatCurrency(invoice.amount)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-primary">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
