import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, Paperclip, X, Download, ExternalLink, Coins } from 'lucide-react';
import { useChat, AttachmentData } from '../hooks/useChat';
import { ChatRole, Message } from '../backend';
import {
  fileToUint8Array,
  uint8ArrayToBlobUrl,
  revokeBlobUrl,
  getImageDimensions,
} from '../utils/imageAttachment';
import { toast } from 'sonner';
import { CoinPurchaseDialog } from '../components/CoinPurchaseDialog';

export default function AIChatScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<AttachmentData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, isLoading, validationError, insufficientCoins, clearValidationError } = useChat();

  // Clean up preview URL on unmount or when attachment changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeBlobUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  // Show validation errors as toast
  useEffect(() => {
    if (validationError && !insufficientCoins) {
      toast.error(validationError);
      clearValidationError();
    }
  }, [validationError, insufficientCoins, clearValidationError]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Convert file to bytes
      const bytes = await fileToUint8Array(file);

      // Get image dimensions
      const { width, height } = await getImageDimensions(file);

      // Create preview URL
      const url = URL.createObjectURL(file);

      // Clean up old preview
      if (previewUrl) {
        revokeBlobUrl(previewUrl);
      }

      setSelectedAttachment({ file, bytes, width, height });
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = () => {
    if (previewUrl) {
      revokeBlobUrl(previewUrl);
    }
    setSelectedAttachment(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!prompt.trim() && !selectedAttachment) || isLoading) return;

    await sendMessage(prompt, selectedAttachment || undefined);
    setPrompt('');
    handleRemoveAttachment();
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>AI Chat Assistant</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Chat with AI
        </h2>
        <p className="text-muted-foreground">
          Ask questions and get instant responses from your AI assistant
        </p>
      </div>

      {/* Insufficient Coins Alert */}
      {insufficientCoins && validationError && (
        <Card className="shadow-sm border-2 border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium mb-2">{validationError}</p>
                <p className="text-xs text-muted-foreground">
                  Each chat message costs 20 coins. Purchase more coins to continue chatting.
                </p>
              </div>
              <Button
                onClick={() => setPurchaseDialogOpen(true)}
                size="sm"
                className="flex-shrink-0"
              >
                <Coins className="h-4 w-4 mr-2" />
                Buy Coins
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="shadow-lg border-2">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages Area */}
          <ScrollArea className="h-[400px] sm:h-[500px] p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">Start a conversation</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Type your message below and press send to begin chatting with your AI assistant.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4 sm:p-6">
            {/* Attachment Preview */}
            {selectedAttachment && previewUrl && (
              <div className="mb-3 p-3 bg-muted rounded-lg flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Attachment preview"
                  className="h-16 w-16 object-cover rounded border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedAttachment.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedAttachment.file.size / 1024).toFixed(1)} KB •{' '}
                    {selectedAttachment.width} × {selectedAttachment.height}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveAttachment}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-[60px] w-[60px] flex-shrink-0"
                onClick={handleAttachClick}
                disabled={isLoading}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-[60px] w-[60px] flex-shrink-0"
                disabled={(!prompt.trim() && !selectedAttachment) || isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coin Purchase Dialog */}
      <CoinPurchaseDialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen} />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (message.imageBytes) {
      const url = uint8ArrayToBlobUrl(
        new Uint8Array(message.imageBytes),
        'image/jpeg'
      );
      setImageUrl(url);

      return () => {
        revokeBlobUrl(url);
      };
    }
  }, [message.imageBytes]);

  const handleOpenImage = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  const handleDownloadImage = () => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `chat-image-${Date.now()}.jpg`;
      a.click();
    }
  };

  return (
    <div
      className={`flex gap-3 ${
        message.role === ChatRole.user ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === ChatRole.assistant && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
          message.role === ChatRole.user
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        {/* Text Content */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Image Attachment */}
        {message.imageBytes && imageUrl && (
          <div className="mt-2 space-y-2">
            <img
              src={imageUrl}
              alt="Attached image"
              className="rounded-lg max-w-full h-auto border"
              style={{ maxHeight: '300px' }}
            />
            <div className="flex gap-2">
              <Button
                variant={message.role === ChatRole.user ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleOpenImage}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
              <Button
                variant={message.role === ChatRole.user ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleDownloadImage}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
      {message.role === ChatRole.user && (
        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-accent" />
        </div>
      )}
    </div>
  );
}
