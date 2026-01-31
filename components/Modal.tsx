import React, { useMemo } from 'react';
import { Exhibit, Category } from '../types';

interface ModalProps {
  exhibit: Exhibit | null;
  allExhibits: Exhibit[];
  onClose: () => void;
  onSelectExhibit: (exhibit: Exhibit) => void;
}

const Modal: React.FC<ModalProps> = ({ exhibit, allExhibits, onClose, onSelectExhibit }) => {
  if (!exhibit) return null;

  // Simple recommendation engine based on tags overlap
  const relatedExhibits = useMemo(() => {
    return allExhibits
      .filter(e => e.id !== exhibit.id)
      .map(e => {
        const intersection = e.tags.filter(tag => exhibit.tags.includes(tag));
        return { ...e, score: intersection.length };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [exhibit, allExhibits]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-stone-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-stone-800 shadow-2xl flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-5/12 h-64 md:h-auto relative shrink-0">
          <img 
            src={exhibit.imageUrl} 
            alt={exhibit.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent md:hidden" />
          
          {/* Audio Player in Image section for better layout */}
          {exhibit.audioUrl && (
            <div className="absolute bottom-4 left-4 right-4 bg-stone-950/80 backdrop-blur-md rounded-xl p-3 border border-stone-800">
               <div className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                 试听片段 (Preview)
               </div>
               <audio controls className="w-full h-8" src={exhibit.audioUrl} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-2 py-1 rounded bg-stone-800 text-stone-400 text-xs font-bold uppercase tracking-wider">
               {exhibit.category}
             </span>
             {exhibit.subcategory && (
               <span className="px-2 py-1 rounded border border-rose-900/50 bg-rose-900/10 text-rose-400 text-xs font-medium">
                 {exhibit.subcategory}
               </span>
             )}
             {exhibit.year && (
               <span className="px-2 py-1 rounded border border-stone-700 text-stone-500 text-xs font-mono">
                 {exhibit.year}
               </span>
             )}
          </div>

          <h2 className="serif text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {exhibit.title}
          </h2>
          {exhibit.details && (
             <p className="text-rose-400 font-medium mb-6 text-lg">{exhibit.details}</p>
          )}

          <div className="prose prose-invert prose-stone max-w-none mb-8">
            <p className="text-stone-300 text-lg leading-relaxed">
              {exhibit.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {exhibit.tags.map((tag, i) => (
              <span key={i} className="text-xs text-stone-500 border border-stone-800 px-3 py-1 rounded-full hover:border-stone-600 hover:text-stone-300 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>

          {/* Recommendations Engine Section */}
          <div className="mt-auto border-t border-stone-800 pt-6">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
              {relatedExhibits.length > 0 ? "猜你喜欢 (Related Exhibits)" : "更多藏品"}
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              {relatedExhibits.map(rel => (
                <div 
                  key={rel.id} 
                  className="group cursor-pointer"
                  onClick={() => onSelectExhibit(rel)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 relative">
                    <img 
                      src={rel.imageUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-100" 
                      alt={rel.title}
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
                    {rel.subcategory && (
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {rel.subcategory}
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-medium text-stone-300 group-hover:text-rose-400 truncate">
                    {rel.title}
                  </h5>
                  <p className="text-[10px] text-stone-500 truncate">{rel.details}</p>
                </div>
              ))}
              {relatedExhibits.length === 0 && (
                 <p className="text-stone-600 text-sm col-span-3">
                   暂无高度关联的藏品，去生成一些新的吧！
                 </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;