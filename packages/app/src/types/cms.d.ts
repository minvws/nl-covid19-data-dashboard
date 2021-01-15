export type CollapsibleList = {
  content: {
    _key: string;
    _type: string;
    content: unknown[] | null;
    title: string | null;
  };
  title: string;
};

export interface Article {
  title: string;
  slug: {
    _key: string;
    _type: 'slug';
    current: string;
  };
  cover: ImageBlock;
  summary: Block | null;
  intro: Block | null;
  content: RichContentBlock[] | null;
  metaDescription: string;
  publicationDate: string;
  isHighlighted: boolean;
}

interface ImageBlock {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
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
  children: unknown[];
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
