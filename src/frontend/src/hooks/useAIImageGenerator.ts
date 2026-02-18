import { useState } from 'react';
import { useActor } from './useActor';

type ArtStyle = 'realistic' | 'cinematic' | 'anime' | 'cartoon' | '3d' | 'oil-painting' | 'watercolor' | 'pixel-art' | 'sketch';
type SubjectType = 'human' | 'product' | 'landscape' | 'animal' | 'abstract' | 'logo' | 'illustration';
type Mood = 'happy' | 'dramatic' | 'dark' | 'soft' | 'luxury' | 'futuristic' | 'minimal';
type ColorPreference = 'vibrant' | 'pastel' | 'monochrome' | 'warm' | 'cool' | 'custom';
type Lighting = 'natural' | 'studio' | 'cinematic' | 'neon' | 'soft' | 'dramatic';
type CameraAngle = 'close-up' | 'wide' | 'portrait' | 'top-view' | 'isometric' | 'macro';
type Background = 'plain' | 'studio' | 'outdoor' | 'custom';
type ImageQuality = 'standard' | 'high' | 'ultra' | '4k';
type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';
type DetailLevel = 'low' | 'medium' | 'high';
type CreativityLevel = 'low' | 'balanced' | 'high';

interface ImageGenerationRequest {
  prompt: string;
  artStyle: ArtStyle;
  subjectType: SubjectType;
  mood: Mood;
  colorPreference: ColorPreference;
  lighting: Lighting;
  cameraAngle: CameraAngle;
  background: Background;
  imageQuality: ImageQuality;
  aspectRatio: AspectRatio;
  detailLevel: DetailLevel;
  creativityLevel: CreativityLevel;
  negativePrompt: string;
}

export function useAIImageGenerator() {
  const { actor } = useActor();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async (request: ImageGenerationRequest) => {
    if (!actor) {
      setError('Backend actor not available. Please try again.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Map art style to placeholder image
      const styleImageMap: Record<ArtStyle, string> = {
        'realistic': '/assets/generated/ai-image-realistic.dim_1024x1024.png',
        'cinematic': '/assets/generated/ai-image-cinematic.dim_1024x1024.png',
        'anime': '/assets/generated/ai-image-anime.dim_1024x1024.png',
        'cartoon': '/assets/generated/ai-image-cartoon.dim_1024x1024.png',
        '3d': '/assets/generated/ai-image-3d.dim_1024x1024.png',
        'oil-painting': '/assets/generated/ai-image-oil-painting.dim_1024x1024.png',
        'watercolor': '/assets/generated/ai-image-watercolor.dim_1024x1024.png',
        'pixel-art': '/assets/generated/ai-image-pixel-art.dim_1024x1024.png',
        'sketch': '/assets/generated/ai-image-sketch.dim_1024x1024.png',
      };

      // Build deterministic parameters for backend
      const params = {
        prompt: request.prompt,
        negativePrompt: request.negativePrompt,
        seed: BigInt(Math.floor(Math.random() * 1000000)),
        steps: BigInt(50),
        guidanceScale: 7.5,
        samplerMethod: 'euler',
        model: `${request.artStyle}-model`,
        imageBase64: styleImageMap[request.artStyle],
      };

      // Submit to backend
      await actor.submitImageGenerationParams(params);

      // Set the generated image path
      setGeneratedImage(styleImageMap[request.artStyle]);
    } catch (err: any) {
      console.error('Image generation error:', err);
      
      // Handle authorization errors
      if (err.message && err.message.includes('Unauthorized')) {
        setError('You do not have permission to generate images. Please log in.');
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    isGenerating,
    error,
    generatedImage,
  };
}
