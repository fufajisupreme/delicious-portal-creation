
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardCard 
            title="Total Orders" 
            value="156" 
            description="12% increase from last week" 
            icon={<ShoppingBag className="h-5 w-5" />} 
          />
          <DashboardCard 
            title="Revenue" 
            value="$4,389" 
            description="8% increase from last week" 
            icon={<DollarSign className="h-5 w-5" />} 
          />
          <DashboardCard 
            title="Customers" 
            value="2,431" 
            description="5% increase from last week" 
            icon={<Users className="h-5 w-5" />} 
          />
          <DashboardCard 
            title="Growth" 
            value="11%" 
            description="3% increase from last week" 
            icon={<TrendingUp className="h-5 w-5" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders from your restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">2 items - $24.99</p>
                  </div>
                  <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded">Preparing</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Alice Smith</p>
                    <p className="text-sm text-muted-foreground">3 items - $38.50</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Ready</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">1 item - $12.99</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">Delivered</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Emma Williams</p>
                    <p className="text-sm text-muted-foreground">4 items - $52.75</p>
                  </div>
                  <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded">Preparing</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">David Brown</p>
                    <p className="text-sm text-muted-foreground">2 items - $27.50</p>
                  </div>
                  <span className="text-sm bg-red-100 text-red-800 py-1 px-2 rounded">Cancelled</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
              <CardDescription>Most ordered items this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Margherita Pizza</p>
                    <p className="text-sm text-muted-foreground">63 orders</p>
                  </div>
                  <p className="font-medium">$14.99</p>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Chicken Burger</p>
                    <p className="text-sm text-muted-foreground">57 orders</p>
                  </div>
                  <p className="font-medium">$12.99</p>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Caesar Salad</p>
                    <p className="text-sm text-muted-foreground">45 orders</p>
                  </div>
                  <p className="font-medium">$8.99</p>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Tiramisu</p>
                    <p className="text-sm text-muted-foreground">32 orders</p>
                  </div>
                  <p className="font-medium">$6.99</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Pasta Carbonara</p>
                    <p className="text-sm text-muted-foreground">28 orders</p>
                  </div>
                  <p className="font-medium">$13.99</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const DashboardCard = ({ title, value, description, icon }: DashboardCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 bg-secondary rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
