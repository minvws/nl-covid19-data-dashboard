import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { Languages } from '~/locale';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useEffect } from 'react';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useRouter } from 'next/router';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        text: siteText.pages.topical_page.nl.nationaal_metadata,
      }),
      locale
    ),
  getLastGeneratedDate
);

const National = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, lastGenerated } = props;

  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    if (breakpoints.md) {
      router.replace(reverseRouter.nl.rioolwater());
    }
  }, [breakpoints.md, reverseRouter.nl, router]);

  return (
    <Layout {...pageText.text} lastGenerated={lastGenerated}>
      <NlLayout />
    </Layout>
  );
};

export default National;
