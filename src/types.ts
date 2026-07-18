/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = '시험' | '행사' | '학사일정';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: Category;
  date: string; // YYYY-MM-DD format
  createdAt: string; // ISO string
}

export type CategoryMap = Record<Category, Post[]>;
