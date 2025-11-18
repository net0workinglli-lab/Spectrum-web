'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  X,
  Car,
  BatteryCharging,
  Leaf,
  Users,
  Zap,
  Shield,
  Star,
  Gauge,
  ArrowRight,
  Truck,
  CheckCircle,
  Award,
  TrendingUp,
  Activity,
  Target,
  Heart,
  Globe,
  Building,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface StatItem {
  icon: string;
  value: string;
  label: string;
}

interface StatsManagerProps {
  title: string;
  items: StatItem[];
  onItemsChange: (items: StatItem[]) => void;
  maxItems?: number;
}

// Icon component to render the correct icon based on name
const IconRenderer = ({ iconName, className = "h-5 w-5" }: { iconName: string; className?: string }) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Car': Car,
    'BatteryCharging': BatteryCharging,
    'Leaf': Leaf,
    'Users': Users,
    'Zap': Zap,
    'Shield': Shield,
    'Star': Star,
    'Gauge': Gauge,
    'ArrowRight': ArrowRight,
    'Truck': Truck,
    'CheckCircle': CheckCircle,
    'Award': Award,
    'TrendingUp': TrendingUp,
    'Activity': Activity,
    'Target': Target,
    'Heart': Heart,
    'Globe': Globe,
    'Building': Building,
    'DollarSign': DollarSign,
    'Clock': Clock,
    'MapPin': MapPin,
    'Phone': Phone,
    'Mail': Mail,
    'Facebook': Facebook,
    'Twitter': Twitter,
    'Instagram': Instagram,
    'Youtube': Youtube,
    'TrendingDown': TrendingDown,
    'BarChart3': BarChart3,
    'PieChart': PieChart,
    'LineChart': LineChart,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : <Car className={className} />;
};

const availableIcons = [
  'Car', 'BatteryCharging', 'Leaf', 'Users', 'Zap', 'Shield', 'Star', 
  'Gauge', 'Truck', 'CheckCircle', 'Award', 'TrendingUp', 'Activity', 
  'Target', 'Heart', 'Globe', 'Building', 'DollarSign', 'Clock',
  'TrendingDown', 'BarChart3', 'PieChart', 'LineChart'
];

export default function StatsManager({ 
  title, 
  items = [], 
  onItemsChange, 
  maxItems = 10 
}: StatsManagerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addItem = () => {
    if (items.length >= maxItems) {
      alert(`Maximum ${maxItems} items allowed`);
      return;
    }
    const newItem: StatItem = {
      icon: 'Car',
      value: '',
      label: ''
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const updateItem = (index: number, field: keyof StatItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onItemsChange(newItems);
  };

  return (
    <Card>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {items.length} / {maxItems}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No stats items yet</p>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First Stat
              </Button>
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Stat #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <select
                          value={item.icon}
                          onChange={(e) => updateItem(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {availableIcons.map((iconName) => (
                            <option key={iconName} value={iconName}>
                              {iconName}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">Preview:</span>
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
                            <IconRenderer iconName={item.icon} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={item.value}
                          onChange={(e) => updateItem(index, 'value', e.target.value)}
                          placeholder="e.g., 500+, 1000+, 50K+"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateItem(index, 'label', e.target.value)}
                          placeholder="e.g., EVs Delivered, Charging Stations"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {items.length < maxItems && (
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stat Item
                </Button>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

