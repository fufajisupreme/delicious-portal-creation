import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

// Expanded restaurant data with more options
const allRestaurants = [
  {
    id: 1,
    name: 'Fresh Harvest',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Healthy',
    tags: ['Salads', 'Bowls', 'Organic'],
    rating: 4.8,
    deliveryTime: '15-30 min',
    distance: '0.8 mi',
    priceRange: '$$',
    featured: true,
  },
  {
    id: 2,
    name: 'Italiano Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Italian',
    tags: ['Pasta', 'Pizza', 'Wine'],
    rating: 4.6,
    deliveryTime: '20-35 min',
    distance: '1.2 mi',
    priceRange: '$$$',
    featured: false,
  },
  {
    id: 3,
    name: 'Sushi Palace',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Japanese',
    tags: ['Sushi', 'Asian', 'Seafood'],
    rating: 4.9,
    deliveryTime: '25-40 min',
    distance: '1.5 mi',
    priceRange: '$$$',
    featured: true,
  },
  {
    id: 4,
    name: 'Burger Joint',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'American',
    tags: ['Burgers', 'Fries', 'Shakes'],
    rating: 4.7,
    deliveryTime: '15-25 min',
    distance: '0.5 mi',
    priceRange: '$$',
    featured: false,
  },
  {
    id: 5,
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Mexican',
    tags: ['Tacos', 'Burritos', 'Quesadillas'],
    rating: 4.5,
    deliveryTime: '20-30 min',
    distance: '1.1 mi',
    priceRange: '$$',
    featured: false,
  },
  {
    id: 6,
    name: 'Pho Delight',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Vietnamese',
    tags: ['Pho', 'Noodles', 'Spring Rolls'],
    rating: 4.7,
    deliveryTime: '25-35 min',
    distance: '1.8 mi',
    priceRange: '$$',
    featured: false,
  },
  {
    id: 7,
    name: 'Greek Taverna',
    image: 'https://images.unsplash.com/photo-1576749872435-ff47dc8b63b4?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Greek',
    tags: ['Gyros', 'Souvlaki', 'Hummus'],
    rating: 4.4,
    deliveryTime: '30-45 min',
    distance: '2.0 mi',
    priceRange: '$$',
    featured: false,
  },
  {
    id: 8,
    name: 'Curry House',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Indian',
    tags: ['Curry', 'Naan', 'Tandoori'],
    rating: 4.8,
    deliveryTime: '30-40 min',
    distance: '1.7 mi',
    priceRange: '$$',
    featured: true,
  },
  {
    id: 9,
    name: 'Beijing Garden',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'Chinese',
    tags: ['Dumplings', 'Noodles', 'Stir Fry'],
    rating: 4.6,
    deliveryTime: '25-35 min',
    distance: '1.3 mi',
    priceRange: '$$',
    featured: false,
  },
  {
    id: 10,
    name: 'BBQ Smokehouse',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400&h=250',
    cuisine: 'BBQ',
    tags: ['Ribs', 'Brisket', 'Pulled Pork'],
    rating: 4.9,
    deliveryTime: '35-50 min',
    distance: '2.2 mi',
    priceRange: '$$$',
    featured: true,
  }
];

// Unique cuisines for filter options
const cuisineOptions = [...new Set(allRestaurants.map(r => r.cuisine))];

const RestaurantCard = ({ restaurant }: { restaurant: typeof allRestaurants[0] }) => {
  const { id, name, image, cuisine, tags, rating, deliveryTime, distance, priceRange, featured } = restaurant;
  
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-food-100 shadow-soft hover-lift transition-all hover:shadow-md">
      {/* Featured tag */}
      {featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary text-white">
            Featured
          </span>
        </div>
      )}
      
      {/* Restaurant image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* Restaurant info */}
      <div className="p-5">
        <div className="flex justify-between mb-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="text-sm text-muted-foreground">{priceRange}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-2">{cuisine} • {tags.join(' • ')}</p>
        
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-food-yellow fill-food-yellow" />
            <span className="font-medium">{rating}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-food-orange" />
            <span>{deliveryTime}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-food-blue" />
            <span>{distance}</span>
          </div>
        </div>
      </div>
      
      {/* Button */}
      <div className="p-4 pt-0">
        <Link to={`/restaurants/${id}`}>
          <Button variant="outline" className="w-full">View Menu</Button>
        </Link>
      </div>
    </div>
  );
};

const RatingFilter = ({ selectedRating, onChange }: { 
  selectedRating: number | null, 
  onChange: (rating: number | null) => void 
}) => {
  const ratings = [4, 4.5, 4.8];
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-2">Rating</h3>
      <div className="space-y-2">
        {ratings.map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(selectedRating === rating ? null : rating)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-md",
              selectedRating === rating 
                ? "bg-primary/10 text-primary"
                : "hover:bg-secondary"
            )}
          >
            <Star className={cn(
              "w-4 h-4 mr-2",
              selectedRating === rating ? "fill-food-yellow text-food-yellow" : ""
            )} />
            {rating}+ Stars
          </button>
        ))}
        {selectedRating !== null && (
          <button
            onClick={() => onChange(null)}
            className="text-sm text-primary hover:underline mt-1"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};

const CuisineFilter = ({ 
  cuisines, 
  selectedCuisine, 
  onChange 
}: { 
  cuisines: string[], 
  selectedCuisine: string | null, 
  onChange: (cuisine: string | null) => void 
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-2">Cuisine Type</h3>
      <div className="space-y-2">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => onChange(selectedCuisine === cuisine ? null : cuisine)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-md",
              selectedCuisine === cuisine 
                ? "bg-primary/10 text-primary"
                : "hover:bg-secondary"
            )}
          >
            {cuisine}
          </button>
        ))}
        {selectedCuisine !== null && (
          <button
            onClick={() => onChange(null)}
            className="text-sm text-primary hover:underline mt-1"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const restaurantsPerPage = 6;
  
  // Filter restaurants based on search and filters
  const filteredRestaurants = allRestaurants.filter(restaurant => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Cuisine filter
    const matchesCuisine = selectedCuisine === null || restaurant.cuisine === selectedCuisine;
    
    // Rating filter
    const matchesRating = selectedRating === null || restaurant.rating >= selectedRating;
    
    return matchesSearch && matchesCuisine && matchesRating;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCuisine, selectedRating]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">All Restaurants</h1>
            <p className="text-muted-foreground">Discover the best food delivery options in your area</p>
          </div>
          
          {/* Search and filter section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search restaurants, cuisines, dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                variant="outline" 
                className="md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(selectedCuisine || selectedRating) && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-white">
                    {(selectedCuisine ? 1 : 0) + (selectedRating ? 1 : 0)}
                  </span>
                )}
              </Button>
            </div>
            
            {/* Filter options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-background rounded-lg border mb-6">
                <CuisineFilter 
                  cuisines={cuisineOptions} 
                  selectedCuisine={selectedCuisine} 
                  onChange={setSelectedCuisine}
                />
                <RatingFilter 
                  selectedRating={selectedRating} 
                  onChange={setSelectedRating}
                />
              </div>
            )}
            
            {/* Results count */}
            <div className="text-muted-foreground text-sm">
              {filteredRestaurants.length} restaurants found
              {(searchQuery || selectedCuisine || selectedRating) && " matching your criteria"}
            </div>
          </div>
          
          {/* Restaurant grid */}
          {currentRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No restaurants found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCuisine(null);
                setSelectedRating(null);
              }}>
                Clear all filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredRestaurants.length > 0 && totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Restaurants;
