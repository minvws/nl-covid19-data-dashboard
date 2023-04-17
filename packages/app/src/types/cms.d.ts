import { PortableTextEntry } from '@sanity/block-content-to-react';
import { ArticleSummary } from '~/components/article-teaser';
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
  | 'tests_page'
  | 'topical_page'
  | 'vaccinations_page'
  | 'variants_page';

export type PageBasePart = {
  pageDataKind: string;
};

export type ArticleParts = {
  _type: 'pageArticles';
  articles: ArticleSummary[];
} & PageBasePart;

export type LinkParts = {
  _type: 'pageLinks';
  links: {
    title: string;
    href: string;
  }[];
} & PageBasePart;

export type HighlightedItemParts = {
  _type: 'pageHighlightedItems';
  highlights: ArticleSummary[];
  showWeeklyHighlight: boolean;
} & PageBasePart;

export type RichTextParts = {
  _type: 'pageRichText';
  text: RichContentBlock[];
} & PageBasePart;

export type PagePart = ArticleParts | LinkParts | HighlightedItemParts | RichTextParts;

export type PagePartQueryResult<T extends PagePart = PagePart> = {
  pageParts: T[];
};

export type FAQuestionAndAnswer = {
  content: RichContentBlock[] | null;
  title: string;
  group: string;
};

export type CollapsibleList = {
  content: RichContentBlock[] | null;
  title: string;
  group: string;
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
export interface Article {
  title: string;
  slug: {
    _key: string;
    _type: 'slug';
    current: string;
  };
  categories?: CategoriesTypes[];
  cover: ImageBlock;
  imageMobile?: ImageBlock;
  imageDesktop?: ImageBlock;
  summary: Block;
  intro: RichContentBlock[];
  content: RichContentBlock[];
  metaDescription: string;
  publicationDate: string;
  isHighlighted: boolean;
  category: string;
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
