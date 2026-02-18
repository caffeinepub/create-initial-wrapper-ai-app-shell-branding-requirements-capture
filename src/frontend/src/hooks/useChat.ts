import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Message, ChatRole } from '../backend';
import {
  fileToUint8Array,
  isValidImageType,
  isValidImageSize,
  getImageDimensions,
} from '../utils/imageAttachment';
import { isInsufficientCoinsError, getCoinErrorMessage } from '../utils/coinErrors';
import { coinQueryKeys } from './coinQueryKeys';

export interface AttachmentData {
  file: File;
  bytes: Uint8Array;
  width: number;
  height: number;
}

export function useChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [insufficientCoins, setInsufficientCoins] = useState(false);

  const sendMessage = async (
    prompt: string,
    attachment?: AttachmentData
  ): Promise<void> => {
    // Clear any previous validation errors
    setValidationError(null);
    setInsufficientCoins(false);

    // Validate that either text or attachment is present
    if (!prompt.trim() && !attachment) {
      setValidationError('Please enter a message or attach an image');
      return;
    }

    // Validate attachment if present
    if (attachment) {
      if (!isValidImageType(attachment.file)) {
        setValidationError('Only image files are supported');
        return;
      }

      if (!isValidImageSize(attachment.file, 1)) {
        setValidationError('Image size must be less than 1 MB');
        return;
      }
    }

    // Create user message
    const userMessage: Message = {
      role: ChatRole.user,
      content: prompt.trim() || '(Image attached)',
      imageBytes: attachment ? attachment.bytes : undefined,
      width: attachment ? BigInt(attachment.width) : undefined,
      height: attachment ? BigInt(attachment.height) : undefined,
      timestamp: BigInt(Date.now()),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (!actor) {
      const errorMessage: Message = {
        role: ChatRole.assistant,
        content: 'Please wait while the connection is being established...',
        timestamp: BigInt(Date.now()),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    setIsLoading(true);
    try {
      // Call the backend chat method
      const responseMessages = await actor.processChatMessage(userMessage);

      // Replace all messages with the full conversation from backend
      setMessages(responseMessages);

      // Invalidate coin balance and transaction history
      queryClient.invalidateQueries({ queryKey: coinQueryKeys.balance });
      queryClient.invalidateQueries({ queryKey: coinQueryKeys.transactions });
    } catch (error) {
      console.error('Chat error:', error);

      if (isInsufficientCoinsError(error)) {
        setInsufficientCoins(true);
        setValidationError(getCoinErrorMessage(error));
      } else {
        const errorMessage: Message = {
          role: ChatRole.assistant,
          content:
            'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: BigInt(Date.now()),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    validationError,
    insufficientCoins,
    clearValidationError: () => setValidationError(null),
  };
}
