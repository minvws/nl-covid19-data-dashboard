import { DataExplainedParts, FaqParts } from '~/types/cms';

type KeysToOmit = '_type' | 'pageDataKind';

export const getPageInformationHeaderContent = ({
  dataExplained,
  faq,
}: {
  dataExplained: Omit<DataExplainedParts, KeysToOmit> | null;
  faq: Omit<FaqParts, KeysToOmit> | null;
}) => ({
  dataExplained: dataExplained
    ? {
        link: `/verantwoording/${dataExplained.item.slug.current}`,
        button: {
          header: dataExplained.buttonTitle,
          text: dataExplained.buttonText,
        },
      }
    : undefined,
  faq:
    faq && faq.questions?.length > 0
      ? {
          link: 'veelgestelde-vragen',
          button: {
            header: faq.buttonTitle,
            text: faq.buttonText,
          },
        }
      : undefined,
});
