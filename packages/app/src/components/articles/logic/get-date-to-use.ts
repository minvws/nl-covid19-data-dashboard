import { ArticleMainCategory, ArticlePublishedDate, ArticleUpdatedDate } from '~/types/cms';

export const getDateToUse = (publishedDate: ArticlePublishedDate, updatedDate: ArticleUpdatedDate, mainCategory: ArticleMainCategory | null) => {
  if (!updatedDate || mainCategory === 'news') {
    return {
      publishedOrUpdatedDate: publishedDate,
      isUpdatedAfterPublishing: false,
    };
  }

  const dateOfUpdate = new Date(updatedDate);
  const dateOfPublishing = new Date(publishedDate);
  const isUpdatedAfterPublishing = dateOfUpdate > dateOfPublishing;

  return {
    publishedOrUpdatedDate: mainCategory && mainCategory === 'knowledge' && isUpdatedAfterPublishing ? updatedDate : publishedDate,
    isUpdatedAfterPublishing,
  };
};
