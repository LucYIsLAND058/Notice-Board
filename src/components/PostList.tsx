/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, CalendarRange, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Category, Post } from '../types';
import PostCard from './PostCard';
import { mapPostsByCategory, getDaysDifference } from '../utils';

interface PostListProps {
  posts: Post[];
  onDelete: (id: string) => void;
  selectedCategory: Category | '전체';
  setSelectedCategory: (cat: Category | '전체') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function PostList({
  posts,
  onDelete,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: PostListProps) {
  const [sortBy, setSortBy] = useState<'createdAt' | 'dday'>('createdAt');

  // 1. Map posts by category (satisfies requirement: "카테고리를 키(key)로 게시글을 매핑하는 방식으로 구현해줘")
  const postsByCategoryMap = mapPostsByCategory(posts);

  // 2. Select initial pool based on category selection
  let basePosts: Post[] = [];
  if (selectedCategory === '전체') {
    basePosts = [...posts];
  } else {
    // Retrieve using the mapped dictionary/object structure!
    basePosts = [...(postsByCategoryMap[selectedCategory] || [])];
  }

  // 3. Apply keyword search filter (title or content)
  const filteredPosts = basePosts.filter((post) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
  });

  // 4. Sort filtered results
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortBy === 'createdAt') {
      // Newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // D-day closeness: active closest first, then past
      const diffA = getDaysDifference(a.date);
      const diffB = getDaysDifference(b.date);

      // Handle past vs future
      const aIsPast = diffA < 0;
      const bIsPast = diffB < 0;

      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;

      if (!aIsPast && !bIsPast) {
        // Both in future/today: sort ascending (closest first)
        return diffA - diffB;
      } else {
        // Both in past: sort descending (most recent past first)
        return diffB - diffA;
      }
    }
  });

  const categories: (Category | '전체')[] = ['전체', '시험', '행사', '학사일정'];

  // Count totals for each category using our mapPostsByCategory
  const getCategoryCount = (cat: Category | '전체') => {
    if (cat === '전체') return posts.length;
    return postsByCategoryMap[cat]?.length || 0;
  };

  return (
    <div className="space-y-5" id="post-list-section">
      {/* Search & Filter Header Container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
        {/* Top bar: Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              id="search-input"
              type="text"
              placeholder="제목이나 내용으로 게시글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-800"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                지우기
              </button>
            )}
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'dday')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            >
              <option value="createdAt">최신 등록순</option>
              <option value="dday">마감 임박순</option>
            </select>
          </div>
        </div>

        {/* Bottom bar: Category filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-50" id="category-filter-buttons">
          <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            필터:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                id={`filter-btn-${cat}`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Posts Display Grid */}
      <div id="posts-grid-container">
        {sortedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-100 rounded-2xl py-16 px-4 text-center flex flex-col items-center justify-center space-y-3"
            id="posts-empty-state"
          >
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <CalendarRange className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-700 text-base">검색된 게시글이 없습니다</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              {searchQuery 
                ? `'${searchQuery}' 키워드를 포함하는 일정이 없습니다. 검색어를 확인해 주세요.` 
                : `${selectedCategory === '전체' ? '' : `'${selectedCategory}' `}게시판이 비어 있습니다. 새로운 글을 등록해 보세요!`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                검색 조건 초기화
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {sortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
