/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BellRing, Calendar, Clock, Sparkles } from 'lucide-react';
import { Post } from '../types';
import { getDaysDifference, formatDDay } from '../utils';

interface ImminentBannerProps {
  posts: Post[];
  onSelectPost?: (post: Post) => void;
}

export default function ImminentBanner({ posts, onSelectPost }: ImminentBannerProps) {
  // Filter imminent posts: D-day between 0 and 3 days (inclusive)
  const imminentPosts = posts
    .map(post => ({
      ...post,
      diffDays: getDaysDifference(post.date),
    }))
    .filter(p => p.diffDays >= 0 && p.diffDays <= 3)
    // Sort so closest (D-DAY) is first
    .sort((a, b) => a.diffDays - b.diffDays);

  if (imminentPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
        id="banner-empty-state"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
          <div>
            <span className="font-semibold text-emerald-900 block sm:inline mr-1">평화로운 학급입니다 🌸</span>
            <span className="text-sm text-emerald-700">3일 이내에 예정된 임박 일정이 없습니다. 여유롭게 학습해 보세요!</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 md:p-5 shadow-sm"
      id="banner-active-state"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl animate-bounce">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-red-900 text-lg flex items-center gap-1.5">
              임박한 일정 알림
              <span className="text-xs bg-red-500 text-white font-mono px-2 py-0.5 rounded-full">
                {imminentPosts.length}
              </span>
            </h2>
            <p className="text-xs text-red-700 mt-0.5">3일 이하로 남은 학급 일정들입니다. 잊지 말고 대비하세요!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {imminentPosts.map((post) => {
          const ddayText = formatDDay(post.diffDays);
          const isDDay = post.diffDays === 0;

          // Color themes for categories
          const categoryColors = {
            '시험': 'bg-red-100 text-red-700 border-red-200',
            '행사': 'bg-orange-100 text-orange-700 border-orange-200',
            '학사일정': 'bg-amber-100 text-amber-700 border-amber-200',
          };

          return (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPost?.(post)}
              className="cursor-pointer bg-white border border-red-100 hover:border-red-300 rounded-xl p-3.5 flex flex-col justify-between transition-all shadow-xs relative overflow-hidden"
              id={`banner-item-${post.id}`}
            >
              {/* Highlight ribbon for D-DAY */}
              {isDDay && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider font-mono">
                  Today
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full font-mono shadow-xs ${
                    isDDay 
                      ? 'bg-red-600 text-white animate-soft-pulse' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {ddayText}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-red-700">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-3 border-t border-gray-50 pt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>목표일: {post.date}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
