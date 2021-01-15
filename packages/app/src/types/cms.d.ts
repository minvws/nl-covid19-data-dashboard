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
  cover: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  intro: Block | null;
  content: RichContentBlock[] | null;
  metaDescription: string;
  publicationDate: string;
}

type RichContentBlock =
  | Block
  | RichContentImageBlock
  | RichContentLineChartBlock;

// @TODO more properties are needed
interface Block {
  _key: string;
  _type: string;
}

// @TODO more properties are needed
interface RichContentImageBlock {
  _key: string;
  _type: 'image';
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
