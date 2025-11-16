
import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  onRemix: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const RemixIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, onRemix }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <CloseIcon />
      </button>

      <div className="h-[75vh] w-auto max-w-full aspect-[9/16] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
         <img src={imageUrl} alt="Full screen wallpaper" className="max-h-full max-w-full object-contain rounded-lg shadow-2xl shadow-purple-500/20" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4" onClick={(e) => e.stopPropagation()}>
        <a
          href={imageUrl}
          download={`ai-wallpaper-${Date.now()}.jpg`}
          className="flex items-center gap-2 py-3 px-6 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
        >
          <DownloadIcon/>
          <span>다운로드</span>
        </a>
        <button
          onClick={onRemix}
          className="flex items-center gap-2 py-3 px-6 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          <RemixIcon/>
          <span>리믹스</span>
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
