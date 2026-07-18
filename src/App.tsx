/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  CalendarDays, 
  Sparkles, 
  Clock, 
  X,
  Tag
} from 'lucide-react';
import { Category, Post } from './types';
import { getInitialDemoPosts, getDaysDifference, formatDDay } from './utils';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import ImminentBanner from './components/ImminentBanner';

const LOCAL_STORAGE_KEY = 'classroom-bulletin-posts';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Load posts from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved posts, loading defaults', e);
        const defaults = getInitialDemoPosts();
        setPosts(defaults);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaults));
      }
    } else {
      const defaults = getInitialDemoPosts();
      setPosts(defaults);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaults));
    }
  }, []);

  // Update current time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute is enough
    return () => clearInterval(timer);
  }, []);

  // Save posts to local storage when changed
  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPosts));
  };

  const handleAddPost = (newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    savePosts([newPost, ...posts]);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      const filtered = posts.filter(post => post.id !== id);
      savePosts(filtered);
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
    }
  };

  const handleResetToDemo = () => {
    if (window.confirm('모든 게시글을 초기 데모 데이터로 복원하시겠습니까? (직접 작성한 글이 사라집니다)')) {
      const defaults = getInitialDemoPosts();
      savePosts(defaults);
      setSelectedCategory('전체');
      setSearchQuery('');
      setSelectedPost(null);
    }
  };

  // Format today's date for display
  const formattedToday = currentTime.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-950 pb-16" id="app-root-container">
      
      {/* Upper Top Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Header Container */}
      <header className="bg-white border-b border-slate-100 py-6 md:py-8 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Title Block */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xs shadow-indigo-200">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-mono">2026학년도</span>
                </div>
                <h1 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight mt-0.5">
                  3-9 학급 게시판 🌿
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed max-w-xl">
                  중요한 시험범위, 학급 행사, 학사일정과 다양한 소식을 실시간으로 공유하고 함께 확인해 보세요!
                </p>
              </div>
            </div>

            {/* Live Calendar and Info Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3.5 self-start md:self-center">
              <div className="p-2.5 bg-white text-indigo-600 rounded-xl shadow-xs">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">TODAY'S DATE</span>
                <span className="font-semibold text-slate-800 text-sm block mt-0.5">{formattedToday}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8" id="app-main">
        <div className="space-y-6">
          
          {/* Always on top: Imminent Events Alert Banner */}
          <ImminentBanner 
            posts={posts} 
            onSelectPost={(post) => setSelectedPost(post)} 
          />

          {/* Body Columns: 1 Column on Mobile, 2 on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Register Post (span 4/12 on desktop) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-6">
                <PostForm onAddPost={handleAddPost} />
              </div>
            </div>

            {/* Right Column: Search, Filters & PostList (span 8/12 on desktop) */}
            <div className="lg:col-span-8 space-y-4">
              <PostList
                posts={posts}
                onDelete={handleDeletePost}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400" id="app-footer">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 우리 반 학급 자치회. 누구나 별도 로그인 없이 이용 가능한 소통 게시판입니다.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              로컬 임시 저장 활성화됨 (localStorage)
            </span>
          </div>
        </div>
      </footer>

      {/* Detail View Modal / Dialog */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="post-detail-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 overflow-hidden"
            >
              {/* Top gradient for imminent detail */}
              {getDaysDifference(selectedPost.date) >= 0 && getDaysDifference(selectedPost.date) <= 3 && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-orange-500" />
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                id="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg border bg-slate-50 border-slate-100 text-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {selectedPost.category}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                  getDaysDifference(selectedPost.date) >= 0 && getDaysDifference(selectedPost.date) <= 3
                    ? 'bg-red-500 text-white'
                    : 'bg-indigo-600 text-white'
                }`}>
                  {formatDDay(getDaysDifference(selectedPost.date))}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display font-black text-xl md:text-2xl text-slate-900 tracking-tight leading-snug mb-4">
                {selectedPost.title}
              </h2>

              {/* Content Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 max-h-64 overflow-y-auto mb-6">
                <p className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              {/* Meta information */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div>
                  <span className="block text-slate-400 font-medium">기준일 (D-day 계산일)</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedPost.date}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">최초 등록 시간</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {new Date(selectedPost.createdAt).toLocaleString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    handleDeletePost(selectedPost.id);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  게시글 삭제
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  확인 완료
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
