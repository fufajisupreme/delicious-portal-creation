
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const navigationItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5 mr-2" /> 
    },
    { 
      name: "Restaurant Details", 
      path: "/dashboard/restaurant", 
      icon: <Store className="h-5 w-5 mr-2" /> 
    },
    { 
      name: "Orders", 
      path: "/dashboard/orders", 
      icon: <ShoppingBag className="h-5 w-5 mr-2" /> 
    },
    { 
      name: "Settings", 
      path: "/dashboard/settings", 
      icon: <Settings className="h-5 w-5 mr-2" /> 
    }
  ];
  
  const NavLink = ({ item }: { item: typeof navigationItems[0] }) => (
    <Link 
      to={item.path} 
      onClick={() => setIsOpen(false)}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary",
        location.pathname === item.path 
          ? "bg-secondary text-primary" 
          : "text-muted-foreground"
      )}
    >
      {item.icon}
      {item.name}
    </Link>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="md:hidden border-b sticky top-0 z-30 bg-white">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="font-display font-bold text-xl">
            Delish Owner
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="px-2 py-6">
                <div className="mb-8 flex items-center">
                  <Link to="/" className="font-display font-bold text-xl">
                    Delish Owner
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto" 
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r">
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <Link to="/" className="font-display font-bold text-xl">
                Delish Owner
              </Link>
            </div>
            <div className="flex-1 flex flex-col p-4 space-y-1">
              {navigationItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 md:pl-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
