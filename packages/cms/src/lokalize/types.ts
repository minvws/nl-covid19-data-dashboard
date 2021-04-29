export interface LokalizeText {
  _type: 'lokalizeText';
  _id: string;
  path: string;
  subject: string;
  key: string;
  should_display_empty: boolean;
  is_newly_added: boolean;
  publish_count: number;
  text: {
    _type: 'localeText';
    nl?: string;
    en?: string;
  };
}
