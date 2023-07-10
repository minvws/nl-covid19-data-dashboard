import { ArticleSummary } from '../article-teaser';

export const getCategories = (item: ArticleSummary) => [...(item.categories && item.categories.length ? item.categories : []), item.mainCategory ? item.mainCategory : ''];
