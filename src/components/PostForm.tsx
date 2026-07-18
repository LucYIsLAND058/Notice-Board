/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Calendar, FileText, Tag, Clock, Sparkles } from 'lucide-react';
import { Category, Post } from '../types';
import { getDaysDifference, formatDDay } from '../utils';

interface PostFormProps {
  onAddPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
}

export default function PostForm({ onAddPost }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('시험');
  const [date, setDate] = useState('');
  const [liveDDay, setLiveDDay] = useState<string | null>(null);

  // Set today's date as default value on first load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Update live D-day preview when date changes
  useEffect(() => {
    if (date) {
      const diff = getDaysDifference(date);
      setLiveDDay(formatDDay(diff));
    } else {
      setLiveDDay(null);
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !date) return;

    onAddPost({
      title: title.trim(),
      content: content.trim(),
      category,
      date,
    });

    // Reset fields except category and date
    setTitle('');
    setContent('');
    // Optionally reset date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const categories: Category[] = ['시험', '행사', '학사일정'];

  // Theme colors for categories to style selection buttons
  const categoryThemes = {
    '시험': {
      bg: 'bg-red-50 text-red-700 border-red-200',
      active: 'bg-red-600 text-white border-red-600 focus:ring-red-300'
    },
    '행사': {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      active: 'bg-orange-500 text-white border-orange-500 focus:ring-orange-300'
    },
    '학사일정': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      active: 'bg-amber-500 text-white border-amber-500 focus:ring-amber-300'
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm" id="post-registration-form">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-slate-900 text-lg">새로운 게시글 등록</h2>
          <p className="text-xs text-slate-500 mt-0.5">학급 친구들과 공유할 일정을 작성해 보세요.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            제목
          </label>
          <input
            id="form-title-input"
            type="text"
            required
            placeholder="예: 국어 수행평가 범위 공지, 반장 선거 등"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-800"
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            카테고리 선택
          </label>
          <div className="grid grid-cols-3 gap-2" id="form-category-tabs">
            {categories.map((cat) => {
              const isSelected = category === cat;
              const theme = categoryThemes[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected ? theme.active + ' shadow-xs font-bold' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            내용
          </label>
          <textarea
            id="form-content-input"
            required
            rows={4}
            placeholder="일정에 대한 구체적인 준비물, 시간, 주요 공지사항 등을 자유롭게 적어주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-800 resize-none leading-relaxed"
          />
        </div>

        {/* Target Date Input & Live Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            기준일 (D-day 계산일)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="form-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all text-slate-800"
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {liveDDay && (
              <div className="flex items-center gap-1 px-3 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-xs font-extrabold font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{liveDDay}</span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            * 입력하신 날짜를 기준으로 오늘과의 차이를 D-day로 실시간 자동 계산합니다.
          </p>
        </div>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-100"
          id="form-submit-btn"
        >
          <Sparkles className="w-4 h-4" />
          게시물 등록하기
        </motion.button>
      </form>
    </div>
  );
}
