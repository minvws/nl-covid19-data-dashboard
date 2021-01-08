export type CollapsibleList = {
  content: {
    _key: string;
    _type: string;
    content: unknown[] | null;
    title: string | null;
  };
  title: string;
};
