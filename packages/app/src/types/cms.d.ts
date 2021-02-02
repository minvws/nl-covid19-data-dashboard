import { PortableTextEntry } from '@sanity/block-content-to-react';

export type CollapsibleList = {
  content: RichContentBlock[] | null;
  title: string;
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
  asset: SanityFileProps;
}

export type Editorial = Record<string, never> & Article;

export interface Article {
  title: string;
  slug: {
    _key: string;
    _type: 'slug';
    current: string;
  };
  cover: ImageBlock;
  summary: Block;
  intro: RichContentBlock[];
  content: RichContentBlock[];
  metaDescription: string;
  publicationDate: string;
  isHighlighted: boolean;
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

type RichContentBlock =
  | Block
  | RichContentImageBlock
  | RichContentLineChartBlock;

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

// @TODO more properties are needed
interface RichContentLineChartBlock {
  _key: string;
  _type: 'lineChart';
  metricName: string;
  metricProperty: string;
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

export type Restriction = {
  icon?: string;
  _key: strinig;
  _type: 'restriction';
  text: string;
};

export type LockdownDataGroup = {
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
