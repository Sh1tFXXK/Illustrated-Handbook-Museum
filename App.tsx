import React, { useState } from 'react';
import { Category, Exhibit, Theme } from './types';
import { INITIAL_EXHIBITS, CATEGORY_LABELS, THEMES, SUBCATEGORIES } from './constants';
import ExhibitCard from './components/ExhibitCard';
import CuratorChat from './components/CuratorChat';
import Modal from './components/Modal';
import { generateExhibit } from './services/gemini';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
  const [exhibits, setExhibits] = useState<Exhibit[]>(INITIAL_EXHIBITS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter exhibits based on active category and subcategory
  const filteredExhibits = exhibits.filter(e => {
    const categoryMatch = activeCategory === Category.ALL || e.category === activeCategory;
    const subcategoryMatch = activeSubcategory === 'all' || e.subcategory === activeSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setActiveSubcategory('all'); // Reset subcategory when main category changes
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // If ALL is selected, pick a random category to generate
    const targetCategory = activeCategory === Category.ALL 
      ? [Category.LITERATURE, Category.MUSIC, Category.ARCHITECTURE][Math.floor(Math.random() * 3)]
      : activeCategory;

    const targetSubcategory = activeSubcategory !== 'all' ? activeSubcategory : undefined;

    // Generate with Theme Context
    const newExhibit = await generateExhibit(targetCategory, activeTheme, targetSubcategory);
    
    if (newExhibit) {
      setExhibits(prev => [newExhibit, ...prev]);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-stone-950 flex items-center justify-center font-serif font-bold text-xl rounded">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white serif">图鉴博物馆</h1>
                <p className="text-xs text-stone-500 uppercase tracking-widest">Museo Brainstorm</p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1">
                {(Object.values(Category) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-rose-900/50 text-rose-100 border border-rose-800'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:hidden">
               <select 
                 className="bg-stone-900 text-stone-300 text-sm rounded-lg border-none focus:ring-rose-500 block w-full p-2.5"
                 value={activeCategory}
                 onChange={(e) => handleCategoryChange(e.target.value as Category)}
               >
                 {(Object.values(Category) as Category[]).map(cat => (
                   <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="serif text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-500 mb-6">
            灵感的栖息地
          </h2>
          <p className="text-lg sm:text-xl text-stone-400 leading-relaxed mb-8">
            在这里，我们收集人类智慧的闪光点。
            <br className="hidden sm:block" />
            从书页间的微光，到凝固的音乐，再到超越时间的建筑。
          </p>

          {/* Theme Selector */}
          <div className="mb-10">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-3 font-semibold">选择策展主题 (Curated Themes)</p>
            <div className="flex flex-wrap justify-center gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`relative px-4 py-2 rounded-lg text-sm transition-all duration-300 border ${
                    activeTheme.id === theme.id 
                      ? 'bg-stone-800 text-white border-stone-600 shadow-lg scale-105' 
                      : 'bg-stone-900/50 text-stone-400 border-stone-800 hover:border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <span className={`absolute inset-0 rounded-lg opacity-10 bg-gradient-to-r ${theme.gradient}`}></span>
                  <span className="relative z-10 font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-600 mt-2 h-4 transition-all duration-500">
               {activeTheme.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-stone-950 bg-white rounded-full hover:bg-stone-200 transition-all disabled:opacity-70 disabled:cursor-wait w-full sm:w-auto overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className={`absolute inset-0 bg-stone-300/30 transform transition-transform duration-1000 ${isGenerating ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}`}></span>
              <span className="relative flex items-center gap-2">
                {isGenerating ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-stone-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在寻找符合“{activeTheme.name}”的{activeSubcategory !== 'all' ? activeSubcategory : '藏品'}...
                   </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    探索{activeSubcategory !== 'all' ? activeSubcategory : '新藏品'}
                  </>
                )}
              </span>
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-stone-700 rounded-full hover:bg-stone-900 hover:border-stone-500 transition-all w-full sm:w-auto"
            >
              咨询策展人
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-stone-900 pb-4 gap-4">
           <div className="flex items-center gap-2 text-stone-500 text-sm">
             <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeTheme.gradient}`}></span>
             当前展示: <span className="text-white font-medium">{filteredExhibits.length}</span> 件珍藏
             <span className="hidden sm:inline text-stone-700 mx-2">|</span>
             <span className="hidden sm:inline text-stone-600">主题: {activeTheme.name}</span>
           </div>

           {/* Subcategory Filter Pills */}
           {activeCategory !== Category.ALL && (
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
               <button
                 onClick={() => setActiveSubcategory('all')}
                 className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                   activeSubcategory === 'all' 
                   ? 'bg-stone-800 text-white' 
                   : 'bg-stone-900 text-stone-500 hover:text-stone-300'
                 }`}
               >
                 全部
               </button>
               {SUBCATEGORIES[activeCategory].map(sub => (
                 <button
                   key={sub}
                   onClick={() => setActiveSubcategory(sub)}
                   className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                     activeSubcategory === sub 
                     ? 'bg-rose-900/40 text-rose-300 border border-rose-900/50' 
                     : 'bg-stone-900 text-stone-500 hover:text-stone-300 border border-transparent hover:border-stone-800'
                   }`}
                 >
                   {sub}
                 </button>
               ))}
             </div>
           )}
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredExhibits.map((exhibit) => (
            <ExhibitCard 
              key={exhibit.id} 
              exhibit={exhibit} 
              onClick={setSelectedExhibit} 
            />
          ))}
        </div>
        
        {filteredExhibits.length === 0 && (
          <div className="text-center py-20 bg-stone-900/50 rounded-2xl border border-stone-800 border-dashed">
            <p className="text-stone-500 mb-4">
              {activeSubcategory !== 'all' ? `“${activeSubcategory}”分类下暂无藏品` : '该区域暂无藏品'}
            </p>
            <button 
              onClick={handleGenerate}
              className="text-rose-400 hover:text-rose-300 underline underline-offset-4"
            >
              让 AI 为您寻觅一件
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 py-12 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-600 text-sm">
            © 2024 图鉴博物馆 (Museo). Powered by Google Gemini.
          </p>
        </div>
      </footer>

      {/* Overlays */}
      <CuratorChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <Modal 
        exhibit={selectedExhibit} 
        allExhibits={exhibits}
        onClose={() => setSelectedExhibit(null)} 
        onSelectExhibit={setSelectedExhibit}
      />
      
      {/* Floating Chat Button (Mobile only mostly) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 p-4 bg-rose-900 text-white rounded-full shadow-2xl hover:bg-rose-800 transition-all hover:scale-110 md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;