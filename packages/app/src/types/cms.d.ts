import { PortableTextEntry } from '@sanity/block-content-to-react';
import { CategoriesTypes } from '~/domain/topical/common/categories';

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

export type RoadmapData = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: 'roadmap';
  _updatedAt: string;
  categories: [];
  title: string;
};

type Restriction = {
  icon?: string;
  _key: string;
  _type: 'restriction';
  text: string;
};

type LockdownDataGroup = {
  icon?: string;
  title: string;
  restrictions: Restriction[];
  _key: string;
  _type: string;
};

export type LockdownData = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: 'lockdown';
  _updatedAt: string;
  groups: LockdownDataGroup[];
  showLockdown: boolean;
  message: {
    title: string;
    description: RichContentBlock[] | null;
  };
  title: string;
};
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
  usefulLinks: LinkProps[];
  title: string;
  description: RichContentBlock[];
  milestones: Milestones[];
  expectedMilestones: ExpectedMilestones[];
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

export type InPositiveTestsQuery = {
  usefulLinks?: LinkProps[];
};
