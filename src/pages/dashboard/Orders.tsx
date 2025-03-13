
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Order, OrderStatus } from '@/types/order';

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  preparing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  ready: "bg-green-100 text-green-800 hover:bg-green-100",
  delivered: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100"
};

const OrderDetails = ({ order }: { order: Order }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status);

  // Status change handler with proper type
  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    // In a real app, we would update the order status in the database here
  };

  return (
    <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Order #{order.id}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div>
          <h3 className="font-medium mb-2">Customer Information</h3>
          <p>{order.customer}</p>
          <p className="text-sm text-muted-foreground">{order.phone}</p>
          <p className="text-sm text-muted-foreground mt-1">{order.address}</p>
          
          <h3 className="font-medium mt-4 mb-2">Order Status</h3>
          <Select value={status} onValueChange={(value: OrderStatus) => handleStatusChange(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready for Pickup</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="mt-6">
            <Label htmlFor="notes">Add Note</Label>
            <Input id="notes" placeholder="Add a note about this order" className="mt-2" />
            <Button size="sm" className="mt-2">Add Note</Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Order Items</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

const Orders = () => {
  const [filter, setFilter] = useState<string>("all");
  
  // Sample data with proper OrderStatus type
  const sampleOrders: Order[] = [
    {
      id: "ORD-001",
      customer: "John Smith",
      date: "2023-10-15T14:30:00",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 12.99 },
        { name: "Garlic Bread", quantity: 1, price: 4.99 }
      ],
      total: 17.98,
      status: "pending",
      address: "123 Main St, Apt 4B, New York, NY 10001",
      phone: "(555) 123-4567"
    },
    {
      id: "ORD-002",
      customer: "Emma Johnson",
      date: "2023-10-15T15:45:00",
      items: [
        { name: "Chicken Caesar Salad", quantity: 1, price: 10.99 },
        { name: "Iced Tea", quantity: 1, price: 2.99 }
      ],
      total: 13.98,
      status: "preparing",
      address: "456 Park Ave, Suite 201, New York, NY 10022",
      phone: "(555) 987-6543"
    },
    {
      id: "ORD-003",
      customer: "Michael Brown",
      date: "2023-10-15T16:20:00",
      items: [
        { name: "Double Cheeseburger", quantity: 1, price: 9.99 },
        { name: "French Fries", quantity: 1, price: 3.99 },
        { name: "Chocolate Milkshake", quantity: 1, price: 4.99 }
      ],
      total: 18.97,
      status: "ready",
      address: "789 Broadway, New York, NY 10003",
      phone: "(555) 246-8102"
    },
    {
      id: "ORD-004",
      customer: "Sophia Garcia",
      date: "2023-10-15T12:15:00",
      items: [
        { name: "Vegetarian Pasta", quantity: 1, price: 14.99 },
        { name: "Sparkling Water", quantity: 1, price: 1.99 }
      ],
      total: 16.98,
      status: "delivered",
      address: "321 5th Ave, New York, NY 10016",
      phone: "(555) 369-7415"
    },
    {
      id: "ORD-005",
      customer: "William Taylor",
      date: "2023-10-15T11:30:00",
      items: [
        { name: "Breakfast Burrito", quantity: 1, price: 8.99 },
        { name: "Coffee", quantity: 1, price: 2.49 }
      ],
      total: 11.48,
      status: "cancelled",
      address: "654 Madison Ave, New York, NY 10065",
      phone: "(555) 852-9631"
    }
  ];
  
  // Filter orders based on status
  const filteredOrders = filter === "all" 
    ? sampleOrders 
    : sampleOrders.filter(order => order.status === filter);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="mt-4 md:mt-0">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready for Pickup</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Details</Button>
                        </DialogTrigger>
                        <OrderDetails order={order} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
