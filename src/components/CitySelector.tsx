
import React from 'react';
import { MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useCity } from '@/contexts/CityContext';
import { cn } from '@/lib/utils';

const CitySelector: React.FC<{
  className?: string;
  variant?: 'default' | 'compact';
}> = ({ className, variant = 'default' }) => {
  const { selectedCity, setSelectedCity, availableCities } = useCity();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-muted hover:bg-food-100/50 text-sm font-medium",
            className
          )}
        >
          <MapPin className="h-4 w-4 text-primary" />
          {variant === 'default' ? (
            <>
              <span className="text-muted-foreground">Delivering to:</span>
              <span className="font-semibold text-foreground">{selectedCity}</span>
            </>
          ) : (
            <span className="font-medium">{selectedCity}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableCities.map((city) => (
          <DropdownMenuItem 
            key={city}
            className={cn(
              "cursor-pointer",
              selectedCity === city && "font-medium bg-primary/5"
            )}
            onClick={() => setSelectedCity(city)}
          >
            {city}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CitySelector;
