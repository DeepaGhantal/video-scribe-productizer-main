import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { VideoUpload } from '@/components/VideoUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { TextInput } from '@/components/TextInput';
import { JsonViewer } from '@/components/JsonViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Brain, 
  Video, 
  Zap, 
  ShoppingBag, 
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  LogOut,
  User,
  Type
} from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

// Mock processing steps
const processingSteps = [
  {
    id: 'upload',
    label: 'Video Upload',
    status: 'completed' as const,
    description: 'Video successfully uploaded and validated'
  },
  {
    id: 'audio',
    label: 'Audio Extraction',
    status: 'processing' as const,
    description: 'Extracting and processing audio track using ffmpeg'
  },
  {
    id: 'transcription',
    label: 'AI Transcription',
    status: 'pending' as const,
    description: 'Converting speech to text using OpenAI Whisper'
  },
  {
    id: 'frames',
    label: 'Frame Analysis',
    status: 'pending' as const,
    description: 'Extracting key frames and analyzing visual content'
  },
  {
    id: 'ocr',
    label: 'Text Recognition',
    status: 'pending' as const,
    description: 'Performing OCR on extracted frames'
  },
  {
    id: 'ai_generation',
    label: 'AI Description Generation',
    status: 'pending' as const,
    description: 'Generating product description using GPT-4'
  }
];

// Mock result data
const mockResult = {
  video_id: 'demo-12345',
  status: 'COMPLETED' as const,
  product_info: {
    title: 'Premium Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones featuring advanced noise cancellation technology, premium materials, and exceptional sound quality. Perfect for music lovers, professionals, and anyone seeking superior audio experience with comfort and style.',
    pricing: {
      amount: 299.99,
      currency: 'USD'
    },
    category: 'Electronics - Audio',
    company_name: 'TechSound Pro',
    manufacturing_country: 'Germany'
  },
  extracted_frames: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1524678714924-3d0d74aa4577?w=400&h=300&fit=crop'
  ],
  transcript: 'Welcome to our premium wireless headphones review. These headphones feature advanced noise cancellation technology and deliver exceptional sound quality. The build quality is outstanding with premium materials throughout. Perfect for both professional use and everyday listening.',
  keywords_detected: ['premium', 'wireless', 'headphones', 'noise cancellation', 'sound quality'],
  processing_time: 45.2
};

const Index = () => {
  const [currentView, setCurrentView] = useState<'upload' | 'processing' | 'results' | 'text-input'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'video' | 'text'>('video');
  const [result, setResult] = useState(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Signed out successfully'
      });
      navigate('/auth');
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Video className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleVideoUpload = (file: File) => {
    console.log('Uploading video:', file.name);
    setIsProcessing(true);
    setCurrentView('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentView('results');
    }, 8000);
  };

  const handleStartOver = () => {
    setCurrentView(inputMode === 'video' ? 'upload' : 'text-input');
    setIsProcessing(false);
    setResult(null);
  };

  const handleTextResult = (data: any) => {
    setResult(data);
    setCurrentView('results');
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your video content using computer vision and natural language processing'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get professional product descriptions in minutes, not hours'
    },
    {
      icon: Target,
      title: 'Precise Detection',
      description: 'Automatically detects product details, pricing, and key features from your video'
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce Ready',
      description: 'Generate structured data perfect for online stores and marketplaces'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with User Info */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-primary" />
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                Video Scribe AI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={inputMode === 'video' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setInputMode('video');
                    setCurrentView('upload');
                    setResult(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Video Mode
                </Button>
                <Button
                  variant={inputMode === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setInputMode('text');
                    setCurrentView('text-input');
                    setResult(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <Type className="h-4 w-4" />
                  Text Mode
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      {(currentView === 'upload' || currentView === 'text-input') && (
        <section className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroBanner} 
              alt="AI-powered video processing"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 hero-gradient opacity-90"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <Badge variant="outline" className="border-white/20 text-white bg-white/10 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI-Powered Product Analysis
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Transform {inputMode === 'video' ? 'Videos' : 'Text'} into 
                  <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Perfect Product Descriptions
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {inputMode === 'video' 
                    ? 'Upload your product videos and let our advanced AI analyze content, extract key information, and generate compelling e-commerce descriptions automatically.'
                    : 'Enter your product details and let our AI enhance descriptions, categorize products, and structure data for e-commerce platforms.'
                  }
                </p>
              </div>

              <div className="flex items-center justify-center space-x-8 text-white/80">
                {inputMode === 'video' ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Video className="w-5 h-5" />
                      <span>MP4/WebM Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Minutes Processing</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Type className="w-5 h-5" />
                      <span>Text Input</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Instant Results</span>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI-Powered</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg"
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {(currentView === 'upload' || currentView === 'text-input') && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Our AI Service?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by cutting-edge AI technology including OpenAI Whisper, computer vision, 
                and advanced natural language processing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="upload-section" className="py-20">
        <div className="container mx-auto px-4">
          {currentView === 'upload' && (
            <VideoUpload onUpload={handleVideoUpload} isProcessing={isProcessing} />
          )}

          {currentView === 'text-input' && (
            <TextInput onResult={handleTextResult} />
          )}

          {currentView === 'processing' && (
            <ProcessingStatus 
              steps={processingSteps}
              currentStep="audio"
              progress={35}
            />
          )}

          {currentView === 'results' && (
            <div className="space-y-8">
              {result ? (
                <JsonViewer data={result} />
              ) : (
                <ResultsDisplay result={mockResult} />
              )}
              <div className="text-center">
                <Button 
                  onClick={handleStartOver}
                  variant="outline"
                  size="lg"
                >
                  {inputMode === 'video' ? 'Process Another Video' : 'Try Another Product'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Powered by OpenAI Whisper, Computer Vision AI, and Advanced NLP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;