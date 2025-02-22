import * as React from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FilterIcon } from 'lucide-react';
import { categoryBrands } from "../../constants/index";

interface SearchAuctionProps {
  onFilterChange: (filters: {
    title?: string;
    category?: string;
    priceRange?: [number, number];
    brand?: string[];
    rating?: number | null;
  }) => void;
  initialFilters?: {
    title?: string;
    category?: string;
    priceRange?: [number, number];
    brand?: string[];
    rating?: number | null;
  };
}

export default function SearchAuction({
  onFilterChange,
  initialFilters,
}: SearchAuctionProps) {
  const [category, setCategory] = React.useState<string>(initialFilters?.category || '');
  const [priceRange, setPriceRange] = React.useState<number[]>(initialFilters?.priceRange || [0, 1000]);
  const [title, setTitle] = React.useState(initialFilters?.title || '');
  const [brand, setBrand] = React.useState<string[]>(initialFilters?.brand || []);
  const [rating, setRating] = React.useState<number | null>(initialFilters?.rating || null);
  const [activeFiltersCount, setActiveFiltersCount] = React.useState(0);

  React.useEffect(() => {
    let count = 0;
    if (title) count++;
    if (category) count++;
    if (brand.length > 0) count++;
    if (rating) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) count++;
    setActiveFiltersCount(count);
  }, [title, category, brand, rating, priceRange]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setBrand([]);
  };

  const handleBrandChange = (value: string) => {
    const currentBrands = [...brand];
    const index = currentBrands.indexOf(value);
    
    if (index === -1) {
      currentBrands.push(value);
    } else {
      currentBrands.splice(index, 1);
    }
    
    setBrand(currentBrands);
  };

  const handleSearch = () => {
    onFilterChange({
      title,
      category,
      priceRange: priceRange as [number, number],
      brand,
      rating,
    });
  };

  const handleReset = () => {
    setTitle('');
    setCategory('');
    setPriceRange([0, 1000]);
    setBrand([]);
    setRating(null);
    onFilterChange({
      title: '',
      category: '',
      priceRange: [0, 1000],
      brand: [],
      rating: null,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Auctions</SheetTitle>
          <SheetDescription>Set your desired search criteria to filter the auctions.</SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Title</label>
            <Input
              placeholder="Search by title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categoryBrands).map((categoryName) => (
                  <SelectItem key={categoryName} value={categoryName}>
                    {categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Brands</label>
              <div className="flex flex-wrap gap-2">
                {categoryBrands[category]?.map((brandName) => (
                  <Badge
                    key={brandName}
                    variant={brand.includes(brandName) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleBrandChange(brandName)}
                  >
                    {brandName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider
              defaultValue={priceRange}
              max={1000}
              step={1}
              onValueChange={(value) => setPriceRange(value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              Search
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}