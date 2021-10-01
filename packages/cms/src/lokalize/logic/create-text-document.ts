export function createTextDocument(key: string, nl: string, en = '') {
  /**
   * Subject is extracted from the key, because we use that to query/group texts
   * in the Sanity UI.
   */
  const [subject] = key.split('.');

  return {
    _type: 'lokalizeText',
    key,
    subject,
    is_newly_added: true,
    publish_count: 0,
    should_display_empty: false,
    text: {
      _type: 'localeText',
      nl,
      en,
    },
  };
}
