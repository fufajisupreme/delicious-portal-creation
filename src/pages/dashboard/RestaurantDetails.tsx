
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState({
    name: "Delicious Bites",
    description: "A cozy restaurant serving a variety of international cuisines with focus on fresh ingredients and authentic flavors.",
    phone: "+1 (555) 123-4567",
    email: "contact@deliciousbites.com",
    address: "123 Culinary Street, Foodville, NY 10001",
    openingHours: "Mon-Fri: 11:00 AM - 10:00 PM, Sat-Sun: 10:00 AM - 11:00 PM",
    website: "https://deliciousbites.com",
    deliveryFee: "2.99",
    minOrder: "15.00",
    averageTime: "30-45",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Restaurant details updated",
      description: "Your restaurant information has been saved successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Restaurant Details</h1>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="hours">Hours & Delivery</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Manage your restaurant's basic details that will be displayed to customers.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSave}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={restaurant.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={restaurant.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={restaurant.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={restaurant.website}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={restaurant.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={restaurant.description}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Hours & Delivery Settings</CardTitle>
                <CardDescription>
                  Manage your restaurant's operating hours and delivery details.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSave}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingHours">Opening Hours</Label>
                    <Input
                      id="openingHours"
                      name="openingHours"
                      value={restaurant.openingHours}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                      <Input
                        id="deliveryFee"
                        name="deliveryFee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={restaurant.deliveryFee}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minOrder">Minimum Order ($)</Label>
                      <Input
                        id="minOrder"
                        name="minOrder"
                        type="number"
                        min="0"
                        step="0.01"
                        value={restaurant.minOrder}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="averageTime">Average Delivery Time (mins)</Label>
                      <Input
                        id="averageTime"
                        name="averageTime"
                        value={restaurant.averageTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Gallery</CardTitle>
                <CardDescription>
                  Upload images of your restaurant, food, and atmosphere to attract customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-dashed rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-muted-foreground">
                      Drag and drop images here, or click to select files
                    </div>
                    <Button>Upload Images</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-md bg-muted relative overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="destructive" size="sm">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Gallery</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantDetails;
