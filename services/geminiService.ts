
import { GoogleGenAI } from "@google/genai";

export async function generateWallpapers(prompt: string, apiKey: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("Google AI Studio API 키를 입력해주세요.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    // Enhance prompt for better wallpaper generation
    const enhancedPrompt = `${prompt}, phone wallpaper, vertical, 9:16 aspect ratio, high detail, cinematic`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 4,
          aspectRatio: '9:16',
          outputMimeType: 'image/jpeg',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("API에서 이미지를 생성하지 못했습니다. 프롬프트를 수정하여 다시 시도해보세요.");
    }

    const imageUrls = response.generatedImages.map(img => {
        const base64ImageBytes: string = img.image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    });

    return imageUrls;
  } catch (error) {
    console.error("Error generating wallpapers with Gemini:", error);
    if (error instanceof Error) {
        // Provide a more specific error message if the key is likely invalid.
        if (error.message.includes('API key not valid')) {
            throw new Error('API 키가 유효하지 않습니다. 올바른 키를 입력했는지 확인해주세요.');
        }
        throw new Error(`이미지 생성 실패: ${error.message}`);
    }
    throw new Error("알 수 없는 오류로 인해 이미지 생성에 실패했습니다.");
  }
}
