import React from 'react';
import { usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PwaInstallBanner() {
  const { deferredPrompt, promptInstall, dismissPrompt, isStandalone } = usePwaInstallPrompt();

  if (isStandalone || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-card border border-border rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">Install Wrapper AI</p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">
            Add to home screen for quick access
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            size="sm"
            onClick={promptInstall}
            className="h-8 px-3 text-xs font-semibold gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={dismissPrompt}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
