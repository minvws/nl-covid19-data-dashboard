export interface LokalizeText {
  _type: 'lokalizeText';
  _id: string;
  path: string;
  subject: string;
  /**
   * The lokalize path is stored as a::b::c to make it findable
   * with the Sanity search feature.
   */
  lokalize_path: string;
  text: {
    _type: 'localeText';
    nl: string;
    en?: string;
  };
}
