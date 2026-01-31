import { Category, Exhibit, Theme } from "./types";

export const INITIAL_EXHIBITS: Exhibit[] = [
  {
    id: '1',
    title: '百年孤独',
    description: '“多年以后，奥雷连诺上校站在行刑队面前，准会想起父亲带他去参观冰块的那个遥远的下午。”',
    details: '加西亚·马尔克斯',
    year: '1967',
    category: Category.LITERATURE,
    subcategory: '小说',
    tags: ['魔幻现实主义', '经典', '记忆', '家族'],
    imageUrl: 'https://picsum.photos/seed/100years/600/800'
  },
  {
    id: '2',
    title: '萨沃伊别墅 (Villa Savoye)',
    description: '柯布西耶的现代主义杰作，体现了“新建筑五点”。漂浮的白色方盒，是居住机器的完美诠释。',
    details: '勒·柯布西耶',
    year: '1931',
    category: Category.ARCHITECTURE,
    subcategory: '住宅',
    tags: ['现代主义', '法国', '混凝土', '极简'],
    imageUrl: 'https://picsum.photos/seed/savoye/600/800'
  },
  {
    id: '3',
    title: '哥德堡变奏曲',
    description: '巴赫为失眠的伯爵所作，30段变奏如数学般精密，又如宇宙般浩瀚。皮亚诺的演绎赋予了它新的生命。',
    details: '约翰·塞巴斯蒂安·巴赫',
    year: '1741',
    category: Category.MUSIC,
    subcategory: '古典',
    tags: ['巴洛克', '钢琴', '变奏曲', '治愈'],
    imageUrl: 'https://picsum.photos/seed/bach/600/800',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3d/06/32/3d063242-261a-0518-e7c6-2c502fb42065/mzaf_3735874288075306385.plus.aac.p.m4a'
  },
  {
    id: '4',
    title: '古根海姆博物馆 (毕尔巴鄂)',
    description: '弗兰克·盖里设计的解构主义建筑，钛金属的曲线在阳光下熠熠生辉，改变了一座城市的命运。',
    details: '弗兰克·盖里',
    year: '1997',
    category: Category.ARCHITECTURE,
    subcategory: '博物馆',
    tags: ['解构主义', '西班牙', '钛金属', '地标'],
    imageUrl: 'https://picsum.photos/seed/guggenheim/600/800'
  },
  {
    id: '5',
    title: '看不见的城市',
    description: '“记忆中的形象一旦被词语固定住，就给抹掉了。” 卡尔维诺构建的55个虚构城市，是献给城市的最后情诗。',
    details: '伊塔洛·卡尔维诺',
    year: '1972',
    category: Category.LITERATURE,
    subcategory: '小说',
    tags: ['寓言', '城市', '想象', '哲学'],
    imageUrl: 'https://picsum.photos/seed/invisible/600/800'
  }
];

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.ALL]: '全部藏品',
  [Category.LITERATURE]: '书籍名句',
  [Category.MUSIC]: '音乐旋律',
  [Category.ARCHITECTURE]: '建筑奇观'
};

export const SUBCATEGORIES: Record<Category, string[]> = {
  [Category.ALL]: [],
  [Category.LITERATURE]: ['小说', '诗歌', '哲学', '散文'],
  [Category.MUSIC]: ['古典', '爵士', '原声', '民谣'],
  [Category.ARCHITECTURE]: ['博物馆', '住宅', '地标', '宗教']
};

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: '经典荟萃',
    description: '跨越时空的永恒经典',
    gradient: 'from-stone-500 to-stone-700'
  },
  {
    id: 'impressionism',
    name: '光影印象',
    description: '捕捉瞬间的光影与色彩',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'cyberpunk',
    name: '赛博未来',
    description: '高科技与低生活的反差美学',
    gradient: 'from-cyan-500 to-blue-700'
  },
  {
    id: 'minimalism',
    name: '极简主义',
    description: '少即是多的纯粹表达',
    gradient: 'from-gray-300 to-gray-500'
  },
  {
    id: 'nature',
    name: '自然共生',
    description: '师法自然的有机形态',
    gradient: 'from-green-500 to-emerald-700'
  }
];