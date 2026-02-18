import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ImageIcon, Download, Sparkles } from 'lucide-react';
import { useAIImageGenerator } from '../hooks/useAIImageGenerator';

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

export default function AIImageGeneratorScreen() {
  const [prompt, setPrompt] = useState('');
  const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
  const [subjectType, setSubjectType] = useState<SubjectType>('abstract');
  const [mood, setMood] = useState<Mood>('happy');
  const [colorPreference, setColorPreference] = useState<ColorPreference>('vibrant');
  const [lighting, setLighting] = useState<Lighting>('natural');
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('wide');
  const [background, setBackground] = useState<Background>('plain');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('high');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium');
  const [creativityLevel, setCreativityLevel] = useState<CreativityLevel>('balanced');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted face, extra fingers, watermark, text, logo, noise');

  const { generateImage, isGenerating, error, generatedImage } = useAIImageGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    await generateImage({
      prompt,
      artStyle,
      subjectType,
      mood,
      colorPreference,
      lighting,
      cameraAngle,
      background,
      imageQuality,
      aspectRatio,
      detailLevel,
      creativityLevel,
      negativePrompt,
    });
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-${artStyle}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '4:5':
        return 'aspect-[4/5]';
      case '16:9':
        return 'aspect-video';
      case '9:16':
        return 'aspect-[9/16]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
          <ImageIcon className="h-4 w-4" />
          <span>AI Image Generator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Generate High-Quality Images
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create stunning images with full control over style, quality, and creative output
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Image Settings
            </CardTitle>
            <CardDescription>
              Configure all parameters to generate your perfect image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Main Prompt / Idea</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Art Style */}
            <div className="space-y-2">
              <Label htmlFor="artStyle">Art Style</Label>
              <Select value={artStyle} onValueChange={(value) => setArtStyle(value as ArtStyle)}>
                <SelectTrigger id="artStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="3d">3D</SelectItem>
                  <SelectItem value="oil-painting">Oil Painting</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="pixel-art">Pixel Art</SelectItem>
                  <SelectItem value="sketch">Sketch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject Type */}
            <div className="space-y-2">
              <Label htmlFor="subjectType">Subject Type</Label>
              <Select value={subjectType} onValueChange={(value) => setSubjectType(value as SubjectType)}>
                <SelectTrigger id="subjectType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="animal">Animal</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="logo">Logo</SelectItem>
                  <SelectItem value="illustration">Illustration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mood & Emotion */}
            <div className="space-y-2">
              <Label htmlFor="mood">Mood & Emotion</Label>
              <Select value={mood} onValueChange={(value) => setMood(value as Mood)}>
                <SelectTrigger id="mood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Preference */}
            <div className="space-y-2">
              <Label htmlFor="colorPreference">Color Preference</Label>
              <Select value={colorPreference} onValueChange={(value) => setColorPreference(value as ColorPreference)}>
                <SelectTrigger id="colorPreference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lighting */}
            <div className="space-y-2">
              <Label htmlFor="lighting">Lighting</Label>
              <Select value={lighting} onValueChange={(value) => setLighting(value as Lighting)}>
                <SelectTrigger id="lighting">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Camera / Angle */}
            <div className="space-y-2">
              <Label htmlFor="cameraAngle">Camera / Angle</Label>
              <Select value={cameraAngle} onValueChange={(value) => setCameraAngle(value as CameraAngle)}>
                <SelectTrigger id="cameraAngle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="close-up">Close-up</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="top-view">Top View</SelectItem>
                  <SelectItem value="isometric">Isometric</SelectItem>
                  <SelectItem value="macro">Macro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <Label htmlFor="background">Background</Label>
              <Select value={background} onValueChange={(value) => setBackground(value as Background)}>
                <SelectTrigger id="background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Quality */}
            <div className="space-y-2">
              <Label htmlFor="imageQuality">Image Quality</Label>
              <Select value={imageQuality} onValueChange={(value) => setImageQuality(value as ImageQuality)}>
                <SelectTrigger id="imageQuality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="aspectRatio">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as AspectRatio)}>
                <SelectTrigger id="aspectRatio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:5">4:5 (Portrait)</SelectItem>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Level of Detail */}
            <div className="space-y-2">
              <Label htmlFor="detailLevel">Level of Detail</Label>
              <Select value={detailLevel} onValueChange={(value) => setDetailLevel(value as DetailLevel)}>
                <SelectTrigger id="detailLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Creativity Level */}
            <div className="space-y-2">
              <Label htmlFor="creativityLevel">Creativity Level</Label>
              <Select value={creativityLevel} onValueChange={(value) => setCreativityLevel(value as CreativityLevel)}>
                <SelectTrigger id="creativityLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2">
              <Label htmlFor="negativePrompt">Negative Prompt (Things to Avoid)</Label>
              <Textarea
                id="negativePrompt"
                placeholder="Enter things to avoid in the image..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your generated image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedImage ? (
              <>
                <div className={`w-full ${getAspectRatioClass()} bg-muted rounded-lg overflow-hidden border-2 border-border`}>
                  <img
                    src={generatedImage}
                    alt="Generated AI Image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </>
            ) : (
              <div className={`w-full ${getAspectRatioClass()} bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border`}>
                <div className="text-center space-y-2 p-6">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    {isGenerating ? 'Generating your image...' : 'Configure settings and click Generate Image'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
