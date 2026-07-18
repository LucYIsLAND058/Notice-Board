/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Trash2, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Post } from '../types';
import { getDaysDifference, formatDDay, isImminent } from '../utils';

interface PostCardProps {
  key?: string;
  post: Post;
  onDelete: (id: string) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const diffDays = getDaysDifference(post.date);
  const ddayText = formatDDay(diffDays);
  const imminent = isImminent(diffDays);
  const isPast = diffDays < 0;
  const isDDay = diffDays === 0;

  // Format created at date nicely
  const formatCreatedDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Category specific colors for badges
  const categoryBadgeClasses = {
    '시험': {
      bg: 'bg-red-50 text-red-700 border-red-100',
      text: 'text-red-700'
    },
    '행사': {
      bg: 'bg-orange-50 text-orange-700 border-orange-100',
      text: 'text-orange-700'
    },
    '학사일정': {
      bg: 'bg-amber-50 text-amber-700 border-amber-100',
      text: 'text-amber-700'
    }
  };

  const badgeTheme = categoryBadgeClasses[post.category] || { bg: 'bg-slate-100 text-slate-700', text: 'text-slate-700' };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative border rounded-2xl p-5 md:p-6 transition-all flex flex-col justify-between ${
        isPast 
          ? 'bg-slate-50/70 border-slate-200/80 opacity-75 hover:opacity-100' 
          : imminent 
            ? 'bg-red-50/40 border-red-200 shadow-xs ring-1 ring-red-100 hover:border-red-300' 
            : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-xs'
      }`}
      id={`post-card-${post.id}`}
    >
      {/* Decorative top strip for imminent posts */}
      {imminent && !isPast && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-t-2xl" />
      )}

      <div>
        {/* Header containing Category and D-day */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${badgeTheme.bg}`}>
              {post.category}
            </span>
            {isPast && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-slate-500" />
                완료됨
              </span>
            )}
            {isDDay && (
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-semibold flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3 text-white animate-pulse" />
                오늘 진행
              </span>
            )}
          </div>

          {/* Calculated D-Day display */}
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full font-mono shadow-xs ${
            isPast 
              ? 'bg-slate-200 text-slate-600 border border-slate-300' 
              : imminent
                ? 'bg-red-600 text-white animate-soft-pulse'
                : 'bg-indigo-600 text-white'
          }`}>
            {ddayText}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-display text-base font-bold leading-snug tracking-tight mb-2.5 ${
          imminent && !isPast 
            ? 'text-red-950 font-extrabold text-[17px]' 
            : 'text-slate-950'
        }`}>
          {post.title}
        </h3>

        {/* Content */}
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isPast 
            ? 'text-slate-500 line-through/none' 
            : 'text-slate-600'
        }`}>
          {post.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            기준일: {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            작성: {formatCreatedDate(post.createdAt)}
          </span>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(post.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer self-end"
          title="게시글 삭제"
          id={`delete-btn-${post.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}
