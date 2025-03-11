
import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RestaurantFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
}

const cuisineTypes = ['All', 'Healthy', 'Italian', 'Japanese', 'American'];
const ratings = [0, 4, 4.5];

export const RestaurantFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCuisine,
  setSelectedCuisine,
  minRating,
  setMinRating,
}: RestaurantFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 mb-8 animate-fade-down">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {cuisineTypes.map((cuisine) => (
            <Button
              key={cuisine}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCuisine(cuisine)}
              className={cn(
                selectedCuisine === cuisine && "bg-primary text-primary-foreground"
              )}
            >
              {cuisine}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {ratings.map((rating) => (
            <Button
              key={rating}
              variant="outline"
              size="sm"
              onClick={() => setMinRating(rating)}
              className={cn(
                minRating === rating && "bg-primary text-primary-foreground"
              )}
            >
              {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
