import { PortableTextEntry } from '@sanity/block-content-to-react';
import { ArticleSummary } from '~/components/articles/article-teaser';
import { CategoriesTypes } from '~/domain/topical/common/categories';

export type PageIdentifier =
  | 'behavior_page'
  | 'deceased_page'
  | 'disability_care_page'
  | 'elderly_at_home_page'
  | 'hospital_page'
  | 'hospitals_and_care_page'
  | 'infectious_people_page'
  | 'nursing_home_page'
  | 'patients_page'
  | 'positive_tests_page'
  | 'reproduction_page'
  | 'sewer_page'
  | 'situations_page'
  | 'infection_radar_page'
  | 'topical_page'
  | 'vaccinations_page'
  | 'variants_page'
  | 'coronathermometer_page';

export type PartTypes = 'pageArticles' | 'pageDataExplained' | 'pageFAQs' | 'pageHighlightedItems' | 'pageLinks' | 'pageRichText';

export type PageBasePart = {
  pageDataKind: string;
};

export type ArticleParts = {
  _type: 'pageArticles';
  articles: Article[];
  sectionTitle: string;
} & PageBasePart;

export type DataExplainedParts = {
  _type: 'pageDataExplained';
  item: {
    slug: { current: string };
  };
  buttonTitle: string;
  buttonText: RichContentBlock[];
} & PageBasePart;

export type FaqParts = {
  _type: 'pageFAQs';
  questions: FAQuestionAndAnswer[];
  sectionTitle: string;
  buttonTitle: string;
  buttonText: RichContentBlock[];
} & PageBasePart;

export type HighlightedItemParts = {
  _type: 'pageHighlightedItems';
  highlights: ArticleSummary[];
  showWeeklyHighlight: boolean;
} & PageBasePart;

export type LinkParts = {
  _type: 'pageLinks';
  links: {
    title: string;
    href: string;
  }[];
} & PageBasePart;

export type RichTextParts = {
  _type: 'pageRichText';
  text: RichContentBlock[];
} & PageBasePart;

export type PagePart = ArticleParts | DataExplainedParts | FaqParts | HighlightedItemParts | LinkParts | RichTextParts;

export type PagePartQueryResult<T extends PagePart = PagePart> = {
  pageParts: T[];
};

export type FAQuestionAndAnswer = {
  content: RichContentBlock[] | null;
  title: string;
  group: string;
};

export type DataExplainedGroup = {
  content: RichContentBlock[] | null;
  group: string;
  groupIcon: string;
  slug: { current: string };
  title: string;
};

export type InlineCollapsibleList = {
  content: {
    inlineBlockContent: RichContentBlock[] | null;
  };
  title: string;
  group: string;
};
export interface SanityFileProps {
  assetId: string;
  extension: string;
}

export interface SanityImageProps {
  assetId: string;
  extension: string;
  metadata: {
    dimensions: {
      aspectRatio: number;
      width: number;
      height: number;
    };
  };
}

export interface InlineAttachment {
  _type: 'inlineAttachment';
  asset?: SanityFileProps;
}

export type Editorial = Record<string, never> & Article;

export type ArticleMainCategory = 'knowledge' | 'news';
export type ArticleUpdatedDate = string | null;
export type ArticlePublishedDate = string;

export interface Article {
  categories: CategoriesTypes[];
  category: string;
  content: RichContentBlock[];
  cover: ImageBlock;
  intro: RichContentBlock[];
  isHighlighted: boolean;
  mainCategory: ArticleMainCategory;
  metaDescription: string;
  publicationDate: ArticlePublishedDate;
  slug: {
    _key: string;
    _type: 'slug';
    current: string;
  };
  summary: Block;
  title: string;
  updatedDate: ArticleUpdatedDate;
  imageMobile?: ImageBlock;
  imageDesktop?: ImageBlock;
}

export interface ImageBlock {
  _type: 'image';
  asset: SanityImageProps;
  alt: string;
  crop?: {
    _type: 'sanity.imageCrop';
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  hotspot?: {
    _type: 'sanity.imageHotspot';
    height: number;
    width: number;
    x: number;
    y: number;
  };
}

type RichContentBlock = Block | RichContentImageBlock;

// @TODO more properties are needed
interface Block {
  _key: string;
  _type: string;
  children: PortableTextEntry[];
}

// @TODO more properties are needed
interface RichContentImageBlock extends ImageBlock {
  isFullWidth?: boolean;
  caption?: string;
}

declare module 'picosanity' {
  type QueryParams = { [key: string]: unknown };

  export interface PicoSanity {
    /**
     * Override the `fetch` method in order to have TS fail when the return-type
     * is not given.
     */
    fetch<R = never>(query: string, params?: QueryParams): Promise<R>;
  }
}

export type TitleDescriptionBlock = {
  _type: 'titleDescriptionBlock';
  description: RichContentBlock[];
  title: string;
};
export interface LokalizeText {
  _type: 'lokalizeText';
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  key: string;
  subject: string;
  should_display_empty: boolean;
  is_newly_added: boolean;
  publish_count: number;
  text: {
    _type: 'localeText';
    nl?: string;
    en?: string;
  };
}

export type VaccinationPageQuery = {
  pageDescription: RichContentBlock[];
  pageLinks: LinkProps[];
};

export type HospitalAdmissionsPageQuery = {
  pageLinks: LinkProps[];
};

export type IntakeHospitalPageQuery = {
  pageLinks: LinkProps[];
};

export type InlineLink = {
  _key: string;
  _type: 'link';
  href: string;
};

export type LinkProps = {
  href: string;
  title: string;
};

export type VariantsPageQuery = {
  pageLinks: [LinkProps];
};
