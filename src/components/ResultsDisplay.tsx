import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  DollarSign, 
  Globe, 
  Building, 
  Copy, 
  Download,
  Image as ImageIcon,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductInfo {
  title: string;
  description: string;
  pricing: {
    amount: number;
    currency: string;
  };
  category: string;
  company_name: string;
  manufacturing_country: string;
}

interface ProcessingResult {
  video_id: string;
  status: 'COMPLETED' | 'PROCESSING' | 'ERROR';
  product_info: ProductInfo;
  extracted_frames: string[];
  transcript: string;
  keywords_detected: string[];
  processing_time: number;
}

interface ResultsDisplayProps {
  result: ProcessingResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { product_info, extracted_frames, transcript, keywords_detected, processing_time } = result;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadAsJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `product-description-${result.video_id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-success font-medium">Processing Complete</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">AI-Generated Product Description</h2>
        <p className="text-muted-foreground">
          Processing completed in {processing_time}s • {keywords_detected.length} keywords detected
        </p>
      </div>

      {/* Product Info Card */}
      <Card className="p-6 card-gradient shadow-card">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
              Product Information
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(product_info, null, 2))}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsJSON}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Product Title</label>
                <h4 className="text-lg font-semibold text-foreground mt-1">{product_info.title}</h4>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1 leading-relaxed">{product_info.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Price</span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {product_info.pricing.amount > 0 
                      ? `${product_info.pricing.currency} ${product_info.pricing.amount}`
                      : 'Price not detected'
                    }
                  </p>
                </div>

                <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingBag className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">Category</span>
                  </div>
                  <p className="font-semibold text-accent">{product_info.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Company</span>
                  </div>
                  <p className="font-medium text-foreground">{product_info.company_name}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Origin</span>
                  </div>
                  <p className="font-medium text-foreground">{product_info.manufacturing_country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Extracted Frames */}
      {extracted_frames.length > 0 && (
        <Card className="p-6 card-gradient shadow-card">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-primary" />
              Extracted Frames ({extracted_frames.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {extracted_frames.map((frame, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                    <img
                      src={frame}
                      alt={`Extracted frame ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 left-2 text-xs"
                  >
                    Frame {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Keywords and Transcript */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Keywords */}
        {keywords_detected.length > 0 && (
          <Card className="p-6 card-gradient shadow-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Keywords Detected
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywords_detected.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="border-primary/20 text-primary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Transcript */}
        {transcript && (
          <Card className="p-6 card-gradient shadow-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Audio Transcript
              </h3>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};