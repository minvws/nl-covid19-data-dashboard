import { documentListWidget } from 'sanity-plugin-dashboard-widget-document-list';

export const unpublishedDocuments = documentListWidget({
  title: 'Niet-gepubliceerde documenten',
  limit: 25,
  query: `//groq
    *[_id in path("drafts.**") && (defined(text))] | order(_updatedAt desc)
  `,
});

export const recentlyPublishedDocuments = documentListWidget({
  title: 'Recent gepubliceerde documenten',
  limit: 25,
  query: `//groq
    *[!(_id in path("drafts.**")) && (defined(text)) && (defined(key))] | order(_publishedAt desc)
  `,
});

export const untranslatedLokalizeKeys = documentListWidget({
  title: 'Onvertaalde Lokalize teksten',
  limit: 25,
  query: `//groq
    *[_type == "lokalizeText" && (!defined(text.en) || text.en == "")] | order(_updatedAt desc)
  `,
});

export const newLokalizeKeys = documentListWidget({
  title: 'Nieuwe Lokalize teksten',
  limit: 25,
  query: `//groq
    *[_type == "lokalizeText" && is_newly_added == true] | order(key asc)
  `,
});

export const recentlyPublishedArticles = documentListWidget({
  title: 'Laatst gewijzigde artikelen',
  limit: 25,
  query: `//groq
    *[_type == 'article'] | order(_updatedAt desc)
  `,
  createButtonText: 'Nieuw artikel',
});
