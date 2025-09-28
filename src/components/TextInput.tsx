import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Type } from 'lucide-react';

interface TextInputProps {
  onResult: (result: any) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onResult }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    company_name: '',
    manufacturing_country: '',
    keywords: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CNY', 'AUD', 'CAD'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-from-text', {
        body: {
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
        }
      });

      if (error) throw error;

      onResult(data);
      toast({
        title: "Success",
        description: "Product information processed successfully!"
      });
    } catch (error) {
      console.error('Error processing text input:', error);
      toast({
        title: "Error",
        description: "Failed to process product information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Text Input Mode
        </CardTitle>
        <CardDescription>
          Enter product details manually to test the pipeline without video recording
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                placeholder="SmartSpeaker 5"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="SoundWave Inc."
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Portable Bluetooth speaker with deep bass and long battery life"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="99.99"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturing_country">Country</Label>
              <Input
                id="manufacturing_country"
                placeholder="India"
                value={formData.manufacturing_country}
                onChange={(e) => handleInputChange('manufacturing_country', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="bluetooth, speaker, portable, bass"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Generate Product Info'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};