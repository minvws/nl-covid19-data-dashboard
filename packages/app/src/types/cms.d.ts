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
    _type: string;
    current: string;
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
