import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Video, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  onUpload: (file: File) => void;
  isProcessing?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload, isProcessing = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => 
      file.type.includes('video/') && 
      (file.type.includes('mp4') || file.type.includes('webm'))
    );
    
    if (videoFile) {
      setSelectedFile(videoFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Upload Product Video</h2>
        <p className="text-muted-foreground">
          Upload your product video (MP4 or WebM, max 100MB, 5 minutes) to generate AI-powered descriptions
        </p>
      </div>

      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-300 cursor-pointer card-gradient",
          isDragOver ? "border-primary bg-primary/5 shadow-processing" : "border-border",
          isProcessing && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-8 text-center space-y-4">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
              {!isProcessing && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="hero-gradient text-white border-0 hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Description
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {isProcessing ? 'Processing your video...' : 'Drop your video here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP4 and WebM formats up to 100MB
                </p>
              </div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
      </Card>

      {isProcessing && (
        <Card className="p-4 bg-processing/5 border-processing/20">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-processing animate-spin" />
            <div className="flex-1">
              <p className="font-medium text-processing">Processing Video</p>
              <p className="text-sm text-muted-foreground">
                Extracting audio, analyzing frames, and generating product description...
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};