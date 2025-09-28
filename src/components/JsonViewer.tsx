import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonViewerProps {
  data: any;
  title?: string;
  description?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ 
  data, 
  title = "JSON Output", 
  description = "Generated product information in JSON format" 
}) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({
      title: "Copied!",
      description: "JSON data copied to clipboard"
    });
  };

  const downloadAsJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy JSON
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadAsJson}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="bg-muted rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-sm">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};