/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, CategoryMap, Category } from './types';

/**
 * Calculates the difference in days between the target date and reference date (default: today).
 * 
 * @param targetDateStr YYYY-MM-DD string
 * @param referenceDate Optional reference Date object
 * @returns number of days (positive for future, 0 for today, negative for past)
 */
export function getDaysDifference(targetDateStr: string, referenceDate: Date = new Date()): number {
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) {
    return 0;
  }
  // Clear hours/minutes/seconds to compare calendar days
  const targetYMD = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const refYMD = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  
  const diffTime = targetYMD.getTime() - refYMD.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Formats the D-day string.
 * e.g., 3 -> "D-3", 0 -> "D-DAY", -5 -> "D+5"
 */
export function formatDDay(diffDays: number): string {
  if (diffDays === 0) {
    return 'D-DAY';
  } else if (diffDays > 0) {
    return `D-${diffDays}`;
  } else {
    return `D+${Math.abs(diffDays)}`;
  }
}

/**
 * Maps a list of posts into a dictionary keyed by Category.
 * Satisfies the requirement: "카테고리를 키(key)로 게시글을 매핑하는 방식으로 구현해줘"
 */
export function mapPostsByCategory(posts: Post[]): CategoryMap {
  const map: CategoryMap = {
    '시험': [],
    '행사': [],
    '학사일정': []
  };
  
  posts.forEach(post => {
    if (post.category in map) {
      map[post.category].push(post);
    }
  });
  
  return map;
}

/**
 * Check if a post's D-day is imminent (3 days or fewer remaining, including today).
 * Definition: 0 <= diffDays <= 3
 */
export function isImminent(diffDays: number): boolean {
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * Generates initial demo posts relative to the current date.
 * Since the current date is 2026-07-16, let's generate relative to that or dynamic today.
 */
export function getInitialDemoPosts(): Post[] {
  const today = new Date();
  
  const getRelativeDateStr = (daysOffset: number): string => {
    const d = new Date(today);
    d.setDate(today.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'demo-1',
      title: '영어 단어 수행평가 (Unit 5-6)',
      content: '교과서 120-135쪽 단어 암기 대상입니다. 총 30문항이 출제되며 80점 미만은 재시험이 있으니 꼼꼼히 준비해 주세요!',
      category: '시험',
      date: getRelativeDateStr(0), // Today, D-DAY
      createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-2',
      title: '학급 자치 회의 및 대청소',
      content: '방학 전 학실 및 사물함 정리를 위한 대청소를 실시합니다. 개인 소지품은 미리 정리하고, 쓰레기 분리배출 담당 구역을 확인해 주세요.',
      category: '행사',
      date: getRelativeDateStr(2), // In 2 days, D-2
      createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-3',
      title: '1학기 2차 지필평가 성적 이의신청 기간',
      content: '지필평가 가채점 결과를 확인하고 이의가 있는 학생은 정해진 양식을 작성하여 과목 교사에게 제출하시기 바랍니다.',
      category: '시험',
      date: getRelativeDateStr(1), // Tomorrow, D-1
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-4',
      title: '2026학년도 1학기 방학식',
      content: '기다리던 여름방학식이 진행됩니다! 오전 10시 강당 모임 후 학급 조회가 있으니 늦지 않게 등교 바랍니다.',
      category: '학사일정',
      date: getRelativeDateStr(8), // In 8 days, D-8
      createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-5',
      title: '지난주 학급 체육대회 피자 파티',
      content: '우리 반 준우승 기념으로 피자 파티를 진행했습니다! 다들 정말 고생 많았고 응원해준 친구들도 고마워요. 사진첩 게시판에서 사진 다운로드 가능합니다.',
      category: '행사',
      date: getRelativeDateStr(-4), // 4 days ago, D+4
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}
