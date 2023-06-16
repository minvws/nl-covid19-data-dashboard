import { DatetimeDefinition, Image, Slug } from 'sanity';
import { LocaleBlock } from '../locale/block';
import { LocaleRichContentBlock } from '../locale/rich-content-block';
import { LocaleString } from '../locale/string';
import { LocaleText } from '../locale/text';

export type Article = {
  title: LocaleString;
  slug: Slug;
  metaDescription: LocaleString;
  publicationDate: DatetimeDefinition;
  categories: string[];
  summary: LocaleText;
  intro: LocaleBlock;
  cover: Image;
  imageDesktop: Image;
  imageMobile: Image;
  content: LocaleRichContentBlock;
};

interface ArticleValidationContextParent {
  minNumber: number;
  maxNumber: number;
  articles: Article[];
}

export const isArticleValidationContextParent = (parent: unknown): parent is ArticleValidationContextParent =>
  typeof parent === 'object' && parent !== null && 'minNumber' in parent && 'maxNumber' in parent && 'articles' in parent;
