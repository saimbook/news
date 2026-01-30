
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { 
  Menu, Search, User, Rss, FileText, Bell, Globe, ChevronRight, 
  TrendingUp, Clock, Share2, Facebook, Twitter, MessageCircle, 
  LayoutDashboard, FileEdit, Settings, LogOut, PlusCircle, BarChart3, Users
} from 'lucide-react';
import { MOCK_ARTICLES, COLORS } from './constants';
import { CategoryType, Article } from './types';
import { summarizeArticle } from './services/geminiService';

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="bg-[#0B2B4E] text-white py-1 text-xs">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 cursor-pointer"><Globe size={12}/> English</span>
          <span className="cursor-pointer">ই-পেপার</span>
          <span className="cursor-pointer">আর্কাইভ</span>
        </div>
        <div className="flex gap-4">
          <Link to="/admin" className="hover:text-red-400">অ্যাডমিন প্যানেল</Link>
          <span className="cursor-pointer">লগইন</span>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <Link to="/" className="flex flex-col items-center md:items-start">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B2B4E] tracking-tight font-serif-bn">সংবাদ সারথি</h1>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">Songbadsarathi • AI-চালিত সাংবাদিকতা</p>
      </Link>
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 w-full md:w-96 shadow-inner">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="অনুসন্ধান করুন..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
    </div>
    <nav className="bg-white border-t border-gray-100 hidden md:block">
      <div className="container mx-auto px-4 overflow-x-auto">
        <ul className="flex gap-6 whitespace-nowrap py-3 text-sm font-bold text-gray-700">
          {Object.values(CategoryType).map((cat) => (
            <li key={cat} className="hover:text-[#0B2B4E] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0B2B4E]">
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </header>
);

const BreakingNews = () => {
  const news = [
    "ঢাকায় মেট্রোরেলের নতুন রুটে ট্রায়াল রান সফল",
    "টি-টোয়েন্টি বিশ্বকাপের ব্যাটিং অর্ডারে পরিবর্তন আসছে",
    "বিদেশি বিনিয়োগ বাড়াতে নতুন নীতিমালা আনছে সরকার",
    "রাজধানীর তাপমাত্রা আরও কমতে পারে"
  ];
  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden py-2 flex items-center">
      <div className="bg-[#C62828] text-white px-4 py-1 text-sm font-bold skew-x-[-12deg] z-10 whitespace-nowrap">
        ব্রেকিং নিউজ
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-8 whitespace-nowrap animate-scroll">
          {news.map((item, i) => (
            <span key={i} className="text-sm font-medium hover:text-[#C62828] cursor-pointer">• {item}</span>
          ))}
          {news.map((item, i) => (
            <span key={`dup-${i}`} className="text-sm font-medium hover:text-[#C62828] cursor-pointer">• {item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsCard = ({ article, horizontal = false }: { article: Article, horizontal?: boolean }) => (
  <Link to={`/article/${article.slug}`} className={`group bg-white block ${horizontal ? 'flex gap-4' : 'flex flex-col'} border-b border-gray-100 pb-4 mb-4 last:border-0 hover:opacity-95 transition-all`}>
    <div className={`overflow-hidden rounded-lg ${horizontal ? 'w-1/3 aspect-video' : 'w-full aspect-video mb-3'}`}>
      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className={horizontal ? 'w-2/3' : 'w-full'}>
      <span className="text-xs font-bold text-[#1F5C3A] uppercase mb-1 block">{article.category}</span>
      <h3 className={`font-bold leading-snug group-hover:text-[#0B2B4E] transition-colors ${horizontal ? 'text-sm md:text-base' : 'text-lg md:text-xl font-serif-bn'}`}>
        {article.title}
      </h3>
      {!horizontal && article.summary && (
        <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">{article.summary}</p>
      )}
      <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
        <span>{article.author}</span>
        <span>•</span>
        <span>{article.publishDate}</span>
      </div>
    </div>
  </Link>
);

const Footer = () => (
  <footer className="bg-[#051629] text-gray-300 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-bold text-white mb-4 font-serif-bn">সংবাদ সারথি</h2>
          <p className="text-sm leading-relaxed mb-6">সংবাদ সারথি একটি আধুনিক অনলাইন নিউজ পোর্টাল যেখানে আমরা বস্তুনিষ্ঠ সাংবাদিকতা এবং আধুনিক প্রযুক্তির সমন্বয় ঘটাই।</p>
          <div className="flex gap-4">
            <Facebook size={20} className="hover:text-blue-400 cursor-pointer" />
            <Twitter size={20} className="hover:text-blue-300 cursor-pointer" />
            <MessageCircle size={20} className="hover:text-green-400 cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">বিভাগসমূহ</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {Object.values(CategoryType).slice(0, 8).map(cat => (
              <li key={cat} className="hover:text-white cursor-pointer">{cat}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">আমাদের সম্পর্কে</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">সম্পাদকীয় নীতিমালা</li>
            <li className="hover:text-white cursor-pointer">বিজ্ঞাপন</li>
            <li className="hover:text-white cursor-pointer">যোগাযোগ</li>
            <li className="hover:text-white cursor-pointer">ক্যারিয়ার</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">সাবস্ক্রিপশন</h4>
          <p className="text-xs mb-4">প্রতিদিনের সেরা খবরগুলো আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।</p>
          <div className="flex">
            <input type="email" placeholder="ইমেইল অ্যাড্রেস" className="bg-gray-800 border-none px-3 py-2 text-sm w-full outline-none" />
            <button className="bg-[#C62828] px-4 py-2 text-white text-sm font-bold">সাবস্ক্রাইব</button>
          </div>
        </div>
      </div>
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        <span>© ২০২৪ সংবাদ সারথি - সর্বস্বত্ব সংরক্ষিত</span>
        <span>Made with ❤️ for Independent Journalism</span>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => {
  const leadNews = MOCK_ARTICLES.find(a => a.isLead);
  const trendingNews = MOCK_ARTICLES.filter(a => a.isTrending || !a.isLead).slice(0, 4);
  const categories = Object.values(CategoryType).slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Lead Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2">
              {leadNews && (
                <Link to={`/article/${leadNews.slug}`} className="group block">
                  <div className="aspect-video overflow-hidden rounded-xl mb-4 shadow-lg">
                    <img src={leadNews.image} alt={leadNews.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif-bn leading-tight group-hover:text-[#0B2B4E] transition-colors">
                    {leadNews.title}
                  </h2>
                  <p className="text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                    {leadNews.summary}
                  </p>
                </Link>
              )}
            </div>
            <div className="space-y-2 border-l border-gray-100 pl-0 md:pl-6">
              <h4 className="text-sm font-bold text-[#C62828] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <TrendingUp size={16}/> ট্রেন্ডিং সংবাদ
              </h4>
              {trendingNews.map(article => (
                <NewsCard key={article.id} article={article} horizontal />
              ))}
            </div>
          </div>

          {/* Category Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {categories.map(cat => (
              <div key={cat}>
                <h4 className="text-lg font-bold border-b-2 border-[#0B2B4E] pb-1 mb-4 inline-block">{cat}</h4>
                <div className="space-y-4">
                  {MOCK_ARTICLES.filter(a => a.category === cat).map(article => (
                    <NewsCard key={article.id} article={article} horizontal />
                  ))}
                  {/* Mock some extra content if empty */}
                  {MOCK_ARTICLES.filter(a => a.category === cat).length === 0 && (
                    <div className="text-sm text-gray-400 italic">এই বিভাগে বর্তমানে কোনো সংবাদ নেই।</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-bold text-[#0B2B4E] border-b border-gray-100 pb-2 mb-4">সবশেষ আপডেট</h4>
            <div className="space-y-4">
              {MOCK_ARTICLES.slice(0, 5).map((a, i) => (
                <Link key={a.id} to={`/article/${a.slug}`} className="flex gap-3 group">
                  <span className="text-2xl font-bold text-gray-200 group-hover:text-[#0B2B4E] transition-colors">{i+1}</span>
                  <p className="text-sm font-bold leading-snug group-hover:text-[#0B2B4E] transition-colors">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#0B2B4E] text-white p-5 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-bold">লাইভ আপডেট</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">বিশ্বজুড়ে ঘটে যাওয়া গুরুত্বপূর্ণ ঘটনাগুলোর তাৎক্ষণিক আপডেট পেতে আমাদের লাইভ প্যানেল অনুসরণ করুন।</p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-colors">প্যানেল দেখুন</button>
          </div>

          <div className="sticky top-28">
            <img src="https://picsum.photos/seed/ad/300/600" alt="Advertisement" className="w-full rounded-lg border border-gray-100 shadow-sm" />
            <p className="text-[10px] text-center text-gray-400 mt-2 uppercase">Advertisement</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ArticlePage = () => {
  const { slug } = useParams();
  const article = MOCK_ARTICLES.find(a => a.slug === slug) || MOCK_ARTICLES[0];
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    const text = await summarizeArticle(article.content);
    setSummary(text);
    setLoadingSummary(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex gap-2 text-xs font-bold text-[#0B2B4E] uppercase mb-6">
          <Link to="/">প্রচ্ছদ</Link>
          <span>/</span>
          <span>{article.category}</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-bold font-serif-bn leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[#0B2B4E]">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author}</p>
              <div className="flex gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                <span>{article.publishDate}</span>
                <span>•</span>
                <span>পড়ার সময়: {article.readingTime} মিনিট</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><Facebook size={18} /></button>
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><Twitter size={18} /></button>
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><Share2 size={18} /></button>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="bg-[#F1F5F9] border-l-4 border-[#0B2B4E] p-6 rounded-r-xl mb-8">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-[#0B2B4E] flex items-center gap-2">
              <Globe size={16} /> AI সারসংক্ষেপ
            </h4>
            {!summary && !loadingSummary && (
              <button 
                onClick={fetchSummary}
                className="text-[10px] bg-[#0B2B4E] text-white px-3 py-1 rounded hover:opacity-90 font-bold"
              >
                তৈরি করুন
              </button>
            )}
          </div>
          {loadingSummary ? (
            <p className="text-sm italic text-gray-500 animate-pulse">AI তথ্য বিশ্লেষণ করছে...</p>
          ) : summary ? (
            <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
          ) : (
            <p className="text-xs text-gray-500">এই সংবাদের একটি এআই-জেনারেটেড সারসংক্ষেপ পেতে ক্লিক করুন।</p>
          )}
        </div>

        <div className="mb-10">
          <img src={article.image} alt={article.title} className="w-full rounded-2xl shadow-xl mb-4" />
          <p className="text-xs text-center text-gray-400 italic">ছবি: সংগৃহীত</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif-bn space-y-6">
          <p>{article.content}</p>
          <p>{article.content}</p>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-12">
          <h4 className="text-xl font-bold font-serif-bn mb-6">সম্পর্কিত সংবাদ</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_ARTICLES.slice(1, 4).map(a => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [stats] = useState({
    visitors: '২৪,৫০০+',
    articles: '৩৫০',
    comments: '১,২০০',
    live: '৮৫০'
  });

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0B2B4E] text-white hidden lg:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold font-serif-bn">সংবাদ সারথি এডমিন</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Control Center</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-sm font-bold">
            <LayoutDashboard size={18} /> ড্যাশবোর্ড
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm transition-colors">
            <FileEdit size={18} /> সংবাদ ব্যবস্থাপনা
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm transition-colors">
            <PlusCircle size={18} /> নতুন সংবাদ যোগ করুন
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm transition-colors">
            <Users size={18} /> ইউজার রোল
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm transition-colors">
            <BarChart3 size={18} /> এনালিটিক্স
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm transition-colors">
            <Settings size={18} /> সেটিংস
          </button>
        </nav>
        <div className="p-6 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut size={18} /> লগআউট
          </Link>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">স্বাগতম, এডমিন!</h1>
            <p className="text-sm text-gray-500">আজকের সংবাদ কার্যক্রমের সংক্ষিপ্ত চিত্র</p>
          </div>
          <button className="bg-[#0B2B4E] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <PlusCircle size={18} /> নতুন আর্টিকেল
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">ভিজিটর (আজ)</p>
            <h3 className="text-2xl font-bold text-[#0B2B4E]">{stats.visitors}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">মোট নিউজ</p>
            <h3 className="text-2xl font-bold text-[#0B2B4E]">{stats.articles}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">মন্তব্য</p>
            <h3 className="text-2xl font-bold text-[#0B2B4E]">{stats.comments}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-red-500 font-bold uppercase mb-1">লাইভ এখন</p>
            <h3 className="text-2xl font-bold text-[#0B2B4E]">{stats.live}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">সাম্প্রতিক সংবাদসমূহ</h3>
            <button className="text-xs font-bold text-[#0B2B4E] hover:underline">সবগুলো দেখুন</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase">
                <tr>
                  <th className="px-6 py-4">শিরোনাম</th>
                  <th className="px-6 py-4">বিভাগ</th>
                  <th className="px-6 py-4">অবস্থা</th>
                  <th className="px-6 py-4">প্রকাশক</th>
                  <th className="px-6 py-4">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ARTICLES.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-[#0B2B4E] max-w-xs truncate">{a.title}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{a.category}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">পাবলিশড</span>
                    </td>
                    <td className="px-6 py-4 text-xs">{a.author}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:text-[#0B2B4E]"><FileEdit size={16}/></button>
                        <button className="p-1 hover:text-red-500"><Settings size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="*" element={
            <>
              <Header />
              <BreakingNews />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/article/:slug" element={<ArticlePage />} />
                  {/* Additional routes can be added here */}
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}
