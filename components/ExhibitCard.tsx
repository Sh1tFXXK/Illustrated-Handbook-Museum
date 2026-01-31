import React, { useState } from 'react';
import { Exhibit, Category } from '../types';

interface ExhibitCardProps {
  exhibit: Exhibit;
  onClick: (exhibit: Exhibit) => void;
}

const CategoryIcon: React.FC<{ category: Category }> = ({ category }) => {
  switch (category) {
    case Category.LITERATURE: return <span>📖</span>;
    case Category.MUSIC: return <span>🎵</span>;
    case Category.ARCHITECTURE: return <span>🏛️</span>;
    default: return <span>✨</span>;
  }
};

const ExhibitCard: React.FC<ExhibitCardProps> = ({ exhibit, onClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="group relative break-inside-avoid rounded-xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-stone-600 transition-all duration-300 cursor-pointer mb-6 shadow-lg hover:shadow-2xl hover:-translate-y-1"
      onClick={() => onClick(exhibit)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={exhibit.imageUrl} 
          alt={exhibit.title} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 ${isPlaying ? 'scale-105 opacity-100' : ''}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {exhibit.subcategory && (
              <span className="bg-stone-950/60 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium text-stone-300 border border-stone-800">
                {exhibit.subcategory}
              </span>
            )}
            <div className="bg-stone-950/60 backdrop-blur-md px-2 py-1 rounded-full text-xs font-medium text-stone-300 flex items-center gap-1 border border-stone-800">
              <CategoryIcon category={exhibit.category} />
            </div>
        </div>

        {exhibit.audioUrl && (
          <button 
            onClick={toggleAudio}
            className={`absolute bottom-20 right-4 p-3 rounded-full text-white shadow-lg backdrop-blur-sm border transition-all transform duration-300 ${
              isPlaying 
                ? 'bg-rose-600 border-rose-500 scale-100 opacity-100' 
                : 'bg-black/40 border-white/20 hover:bg-rose-600 hover:border-rose-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
            }`}
          >
             {isPlaying ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             ) : (
               <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             )}
          </button>
        )}
        
        {exhibit.audioUrl && (
          <audio 
            ref={audioRef} 
            src={exhibit.audioUrl} 
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="serif text-xl font-bold text-white mb-1 leading-tight group-hover:text-rose-400 transition-colors">
          {exhibit.title}
        </h3>
        {exhibit.details && (
          <p className="text-stone-400 text-xs uppercase tracking-widest mb-2 font-medium">
            {exhibit.details} {exhibit.year && <span className="opacity-50">| {exhibit.year}</span>}
          </p>
        )}
        <p className="text-stone-300 text-sm line-clamp-3 leading-relaxed opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto transition-all duration-300 delay-75 transform translate-y-4 group-hover:translate-y-0">
          {exhibit.description}
        </p>
      </div>
    </div>
  );
};

export default ExhibitCard;