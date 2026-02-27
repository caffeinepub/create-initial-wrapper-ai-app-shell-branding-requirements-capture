# Specification

## Summary
**Goal:** Add a complete AI image generation feature with coin-based usage system and Internet Identity authentication.

**Planned changes:**
- Add new AIImageGeneratorScreen with single text input ('Enter your idea...') and 'Generate Image' button
- Implement auto-enhanced prompts that append professional settings (4K, cinematic lighting, ultra-detailed, sharp focus, masterpiece) to user input
- Add coin system where each generation costs 10 coins
- Initialize new users with 50 free coins on first login
- Display loading animation during image generation
- Show generated image with download button
- Display 'Please recharge to generate more images' message when coins reach 0
- Configure frontend to call external AI image generation API with configurable endpoint and authentication
- Ensure mobile-friendly, responsive design with clean minimal aesthetic
- Integrate with existing Internet Identity authentication
- Add navigation route and menu item for AI Image Generator

**User-visible outcome:** Authenticated users can generate AI images by entering prompts, with automatic professional enhancement, coin-based usage tracking (starting with 50 free coins, 10 coins per generation), and ability to download generated images.
