
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import StepNavigation from "@/components/StepNavigation";
import { FileText, Moon, Sun, LayoutDashboard } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showStepNav?: boolean;
}

const Layout = ({ children, showStepNav = true }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center text-2xl font-bold text-primary"
          >
            <FileText className="mr-2" />
            Billera
          </button>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {showStepNav && <StepNavigation />}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Billera Invoice Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
