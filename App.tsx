
import React, { useState, useCallback } from 'react';
import { generateWallpapers } from './services/geminiService';
import ImageModal from './components/ImageModal';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || !apiKey.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const generatedImages = await generateWallpapers(prompt, apiKey);
      setImages(generatedImages);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, apiKey, isLoading]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleRemix = () => {
    setSelectedImage(null);
    // The user is already on the main screen with the prompt,
    // so they can edit and generate again.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-lg text-center my-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AI 배경화면 생성기
        </h1>
        <p className="text-gray-400 mt-2">
          나만의 특별한 휴대폰 배경화면을 만들어보세요.
        </p>
      </header>

      <main className="w-full max-w-lg flex-grow">
        <div className="sticky top-4 bg-gray-900/80 backdrop-blur-sm z-10 p-2 -m-2 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="api-key" className="text-sm font-medium text-gray-400">Google AI Studio API 키</label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API 키를 여기에 붙여넣으세요"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-300"
                disabled={isLoading}
              />
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="어떤 분위기의 배경화면을 원하시나요? (예: 비 오는 서정적인 도시 풍경)"
              className="w-full h-24 p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-300"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim() || !apiKey.trim()}
              className="w-full py-3 px-4 bg-purple-600 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>생성 중...</span>
                </>
              ) : (
                '배경화면 생성하기'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 text-center bg-red-900/50 text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[9/16] bg-gray-800 rounded-lg animate-pulse flex items-center justify-center"
              >
                <Loader />
              </div>
            ))}
          {!isLoading && images.length > 0 &&
            images.map((src, index) => (
              <div
                key={index}
                className="aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group relative"
                onClick={() => handleImageClick(src)}
              >
                <img
                  src={src}
                  alt={`Generated wallpaper ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
        </div>
         {!isLoading && images.length === 0 && !error && (
            <div className="mt-16 text-center text-gray-500">
                <p>생성된 배경화면이 여기에 표시됩니다.</p>
            </div>
        )}
      </main>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={handleCloseModal}
          onRemix={handleRemix}
        />
      )}
    </div>
  );
};

export default App;
