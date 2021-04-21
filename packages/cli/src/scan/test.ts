export type Language = { key: string };

function useIntl() {
  const siteText: Language = {
    key: 'nl',
  };
  return { siteText };
}

const { siteText } = useIntl();

const instance = siteText.key;
