'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  Sun,
  Glasses,
  BookOpen,
  Eye,
  Shield,
  Zap,
  Star,
  Heart,
  Crown,
  Gem,
  Target,
  Aperture,
  Circle,
  Camera,
  Hexagon,
  Triangle,
  Clock,
  Square,
  Sparkles,
  Diamond,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import LinkSuggestions from './LinkSuggestions';

interface DropdownItem {
  id: string;
  name: string;
  href: string;
  icon?: string;
  position?: 'before' | 'after';
}

interface DropdownManagerProps {
  title: string;
  items: DropdownItem[];
  onItemsChange: (items: DropdownItem[]) => void;
  placeholder?: string;
  maxItems?: number;
  category?: 'products' | 'brands' | 'lenses' | 'general' | 'social' | 'navigation';
  showPositionControl?: boolean;
}

// Icon component to render the correct icon based on name
const IconRenderer = ({ iconName, className = "h-4 w-4" }: { iconName: string; className?: string }) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Sun': Sun,
    'Glasses': Glasses,
    'BookOpen': BookOpen,
    'Eye': Eye,
    'Shield': Shield,
    'Zap': Zap,
    'Star': Star,
    'Heart': Heart,
    'Crown': Crown,
    'Gem': Gem,
    'Diamond': Diamond,
    'Sparkles': Sparkles,
    'Target': Target,
    'Aperture': Aperture,
    'Circle': Circle,
    'Camera': Camera,
    'Hexagon': Hexagon,
    'Triangle': Triangle,
    'Clock': Clock,
    'Square': Square,
    'Facebook': Facebook,
    'Twitter': Twitter,
    'Instagram': Instagram,
    'Youtube': Youtube,
    'Linkedin': Linkedin,
    'Github': Github,
    'Mail': Mail,
    'Phone': Phone,
    'MapPin': MapPin,
    'Globe': Globe,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default function DropdownManager({
  title,
  items,
  onItemsChange,
  placeholder = "Enter item name",
  maxItems = 10,
  category = 'general',
  showPositionControl = false
}: DropdownManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const addItem = () => {
    if (items.length >= maxItems) return;
    
    const newItem: DropdownItem = {
      id: `item-${Date.now()}`,
      name: '',
      href: '#',
      icon: ''
    };
    
    try {
      console.log('[DropdownManager] addItem', { hasOnItemsChange: typeof onItemsChange === 'function' });
      if (typeof onItemsChange === 'function') {
        onItemsChange([...items, newItem]);
      } else {
        console.error('DropdownManager: onItemsChange prop is not a function', onItemsChange);
      }
    } catch (error) {
      console.error('DropdownManager: Error in addItem:', error);
    }
  };

  const removeItem = (id: string) => {
    try {
      console.log('[DropdownManager] removeItem', { id, hasOnItemsChange: typeof onItemsChange === 'function' });
      if (typeof onItemsChange === 'function') {
        onItemsChange(items.filter(item => item.id !== id));
      } else {
        console.error('DropdownManager: onItemsChange prop is not a function', onItemsChange);
      }
    } catch (error) {
      console.error('DropdownManager: Error in removeItem:', error);
    }
  };

  const updateItem = (id: string, field: keyof DropdownItem, value: string) => {
    try {
      console.log('[DropdownManager] updateItem', { id, field, valueSample: value?.slice?.(0, 20), hasOnItemsChange: typeof onItemsChange === 'function' });
      if (typeof onItemsChange === 'function') {
        onItemsChange(items.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
      } else {
        console.error('DropdownManager: onItemsChange prop is not a function', onItemsChange);
      }
    } catch (error) {
      console.error('DropdownManager: Error in updateItem:', error);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    try {
      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      console.log('[DropdownManager] moveItem', { fromIndex, toIndex, hasOnItemsChange: typeof onItemsChange === 'function' });
      if (typeof onItemsChange === 'function') {
        onItemsChange(newItems);
      } else {
        console.error('DropdownManager: onItemsChange prop is not a function', onItemsChange);
      }
    } catch (error) {
      console.error('DropdownManager: Error in moveItem:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Preview
            </Label>
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-6">{index + 1}.</span>
                  {item.icon && (
                    <IconRenderer iconName={item.icon} className="h-4 w-4 text-gray-600" />
                  )}
                  <span className="font-medium">{item.name || 'Untitled'}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-600">{item.href}</span>
                  {showPositionControl && item.position && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.position === 'before' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.position}
                    </span>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-gray-400 text-sm italic">No items yet</div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-600">
                    Item {index + 1}
                  </span>
                  <div className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder={placeholder}
                      className="mt-1"
                    />
                  </div>
                  
                  <LinkSuggestions
                    value={item.href}
                    onChange={(value) => updateItem(item.id, 'href', value)}
                    placeholder="/products/category"
                    category={category}
                  />
                  
                  <div>
                    <Label className="text-sm font-medium">Icon (optional)</Label>
                    <div className="relative">
                      <select
                        value={item.icon || ''}
                        onChange={(e) => updateItem(item.id, 'icon', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">No Icon</option>
                        {category === 'social' ? (
                          <optgroup label="Social Media">
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Youtube">YouTube</option>
                            <option value="Linkedin">LinkedIn</option>
                            <option value="Github">GitHub</option>
                            <option value="Mail">Email</option>
                            <option value="Phone">Phone</option>
                            <option value="MapPin">Location</option>
                            <option value="Globe">Website</option>
                          </optgroup>
                        ) : category === 'navigation' ? (
                          <optgroup label="Navigation">
                            <option value="Sun">Sun</option>
                            <option value="Glasses">Glasses</option>
                            <option value="BookOpen">Book Open</option>
                            <option value="Eye">Eye</option>
                            <option value="Shield">Shield</option>
                            <option value="Zap">Zap</option>
                            <option value="Star">Star</option>
                            <option value="Heart">Heart</option>
                            <option value="Crown">Crown</option>
                            <option value="Gem">Gem</option>
                            <option value="Diamond">Diamond</option>
                            <option value="Sparkles">Sparkles</option>
                            <option value="Target">Target</option>
                            <option value="Aperture">Aperture</option>
                            <option value="Circle">Circle</option>
                            <option value="Camera">Camera</option>
                            <option value="Hexagon">Hexagon</option>
                            <option value="Triangle">Triangle</option>
                            <option value="Clock">Clock</option>
                            <option value="Square">Square</option>
                          </optgroup>
                        ) : (
                          <>
                            <optgroup label="Products">
                              <option value="Sun">Sun</option>
                              <option value="Glasses">Glasses</option>
                              <option value="BookOpen">Book Open</option>
                              <option value="Eye">Eye</option>
                            </optgroup>
                            <optgroup label="Brands">
                              <option value="Shield">Shield</option>
                              <option value="Zap">Zap</option>
                              <option value="Star">Star</option>
                              <option value="Heart">Heart</option>
                              <option value="Crown">Crown</option>
                              <option value="Gem">Gem</option>
                              <option value="Diamond">Diamond</option>
                              <option value="Sparkles">Sparkles</option>
                            </optgroup>
                            <optgroup label="Lenses">
                              <option value="Target">Target</option>
                              <option value="Aperture">Aperture</option>
                              <option value="Circle">Circle</option>
                              <option value="Camera">Camera</option>
                              <option value="Hexagon">Hexagon</option>
                              <option value="Triangle">Triangle</option>
                              <option value="Clock">Clock</option>
                              <option value="Square">Square</option>
                            </optgroup>
                          </>
                        )}
                      </select>
                      {item.icon && (
                        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <IconRenderer iconName={item.icon} className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose an icon that represents this menu item
                    </p>
                  </div>

                  {/* Position Control for Navigation Items */}
                  {showPositionControl && (
                    <div>
                      <Label className="text-sm font-medium">Position</Label>
                      <div className="mt-1 space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`position-${item.id}`}
                            value="before"
                            checked={item.position === 'before'}
                            onChange={(e) => updateItem(item.id, 'position', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Before Products/Brands/Lenses dropdowns
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`position-${item.id}`}
                            value="after"
                            checked={item.position === 'after'}
                            onChange={(e) => updateItem(item.id, 'position', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            After Products/Brands/Lenses dropdowns
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Choose where this navigation item appears in the header
                      </p>
                    </div>
                  )}
                </div>

                {/* Move buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    className="text-xs"
                  >
                    Move Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === items.length - 1}
                    className="text-xs"
                  >
                    Move Down
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <Button
            onClick={addItem}
            disabled={items.length >= maxItems}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
            {items.length >= maxItems && (
              <span className="ml-2 text-xs text-gray-500">
                (Max {maxItems} items)
              </span>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
