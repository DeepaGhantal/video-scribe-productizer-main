import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description?: string;
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  currentStep?: string;
  progress?: number;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  steps,
  currentStep,
  progress = 0
}) => {
  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-processing animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepStyles = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 border-success/20';
      case 'processing':
        return 'bg-processing/10 border-processing/20 animate-pulse-glow';
      case 'error':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Processing Your Video</h2>
        <p className="text-muted-foreground">
          AI is analyzing your video to generate the perfect product description
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="p-6 card-gradient">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>
      </Card>

      {/* Processing Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className={cn(
              "p-4 transition-all duration-300",
              getStepStyles(step.status)
            )}
          >
            <div className="flex items-start space-x-4">
              <div className="mt-0.5">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{step.label}</h3>
                  <span className="text-xs text-muted-foreground">
                    Step {index + 1} of {steps.length}
                  </span>
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                )}
                {step.status === 'processing' && step.id === currentStep && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-processing rounded-full animate-pulse"></div>
                      <span className="text-xs text-processing font-medium">Processing...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Processing Animation */}
      <Card className="p-6 text-center processing-gradient animate-gradient">
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">AI at Work</h3>
            <p className="text-white/80 text-sm">
              Our advanced AI is analyzing your video content to create the perfect product description
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};