
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, ShoppingBag, DollarSign, Users, Clock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Define order status type
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

// Define order interface
interface Order {
  id: string;
  customer: string;
  date: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
}

const Dashboard: React.FC = () => {
  // Mock data - would be fetched from API in real app
  const stats = {
    totalOrders: 124,
    pendingOrders: 8,
    totalRevenue: 4582.50,
    customers: 96
  };

  // Mock recent orders with real-looking data
  const [recentOrders, setRecentOrders] = useState<Order[]>([
    {
      id: 'ORD-1001',
      customer: 'John Doe',
      date: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
        { name: 'Garlic Breadsticks', quantity: 1, price: 4.99 }
      ],
      total: 30.97,
      status: 'pending'
    },
    {
      id: 'ORD-1002',
      customer: 'Jane Smith',
      date: new Date(Date.now() - 65 * 60000).toISOString(), // 65 minutes ago
      items: [
        { name: 'Chicken Alfredo', quantity: 1, price: 14.99 },
        { name: 'Caesar Salad', quantity: 1, price: 8.99 }
      ],
      total: 23.98,
      status: 'preparing'
    },
    {
      id: 'ORD-1003',
      customer: 'Robert Johnson',
      date: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
      items: [
        { name: 'Pepperoni Pizza', quantity: 1, price: 13.99 },
        { name: 'Buffalo Wings', quantity: 1, price: 9.99 }
      ],
      total: 23.98,
      status: 'ready'
    },
    {
      id: 'ORD-1004',
      customer: 'Emily Williams',
      date: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
      items: [
        { name: 'Vegetarian Pizza', quantity: 1, price: 13.99 }
      ],
      total: 13.99,
      status: 'completed'
    },
    {
      id: 'ORD-1005',
      customer: 'Michael Brown', 
      date: new Date(Date.now() - 240 * 60000).toISOString(), // 4 hours ago
      items: [
        { name: 'Supreme Pizza', quantity: 1, price: 15.99 }
      ],
      total: 15.99,
      status: 'cancelled'
    }
  ]);

  // Function to update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setRecentOrders(orders => 
      orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Show notification
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'preparing':
        return <Badge className="bg-blue-500">Preparing</Badge>;
      case 'ready':
        return <Badge className="bg-purple-500">Ready</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'preparing':
        return <UtensilsCrossed className="h-4 w-4 text-blue-500" />;
      case 'ready':
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your restaurant performance</p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 20)}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <Link to="/dashboard/orders" className="text-xs text-primary hover:underline">
                View pending orders
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 15)}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customers}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 10)}% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Overview of the latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-muted-foreground">
                    <th className="h-10 px-4 text-left font-medium">Order ID</th>
                    <th className="h-10 px-4 text-left font-medium">Customer</th>
                    <th className="h-10 px-4 text-left font-medium">Date</th>
                    <th className="h-10 px-4 text-right font-medium">Amount</th>
                    <th className="h-10 px-4 text-center font-medium">Status</th>
                    <th className="h-10 px-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-4 align-middle">{order.id}</td>
                      <td className="p-4 align-middle">{order.customer}</td>
                      <td className="p-4 align-middle">{formatDate(order.date)}</td>
                      <td className="p-4 text-right align-middle">${order.total.toFixed(2)}</td>
                      <td className="p-4 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </td>
                      <td className="p-4 text-right align-middle">
                        {(order.status === 'pending' || order.status === 'preparing' || order.status === 'ready') && (
                          <div className="flex justify-end gap-2">
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="bg-blue-500 hover:bg-blue-600"
                              >
                                Prepare
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="bg-purple-500 hover:bg-purple-600"
                              >
                                Ready
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Complete
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Link to="/dashboard/orders">
                <button className="text-sm text-primary hover:underline">View all orders</button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
