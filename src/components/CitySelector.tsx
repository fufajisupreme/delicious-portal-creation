
import React from 'react';
import { MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useCity } from '@/contexts/CityContext';

// List of available cities
const cities = [
  'All Cities',
  'New York',
  'Los Angeles',
  'Chicago',
  'Miami',
  'San Francisco',
  'Seattle',
  'Boston',
  'Austin',
  'Denver'
];

interface CitySelectorProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ variant = 'default', className = '' }) => {
  const { selectedCity, setSelectedCity } = useCity();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={variant === 'minimal' ? 'sm' : 'default'} 
          className={`flex items-center gap-2 ${className}`}
        >
          <MapPin className="h-4 w-4" />
          <span>{selectedCity}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {cities.map((city) => (
          <DropdownMenuItem 
            key={city} 
            onClick={() => setSelectedCity(city)}
            className={selectedCity === city ? 'bg-accent font-medium' : ''}
          >
            {city}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CitySelector;
