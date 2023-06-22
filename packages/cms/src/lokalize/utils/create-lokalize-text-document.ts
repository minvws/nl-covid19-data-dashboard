type LokalizeText = {
  _id?: string;
  _type: 'lokalizeText';
  subject: string;
  is_newly_added: boolean;
  publish_count: number;
  should_display_empty: boolean;
  key: string;
  text: {
    _type: 'localeText';
    nl: string;
    en: string;
  };
};

export function createLokalizeTextDocument(key: string, nl: string, en = ''): LokalizeText {
  /**
   * Subject is extracted from the key, because we use that to query/group texts
   * in the Sanity UI.
   */
  const [subject] = key.split('.');
  console.log('createNewDocument-subject :', subject);

  return {
    _type: 'lokalizeText',
    key,
    subject,
    is_newly_added: true,
    publish_count: 0,
    should_display_empty: false,
    text: {
      _type: 'localeText',
      nl: nl.toString(),
      en: en.toString(),
    },
  };
}
