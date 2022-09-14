import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { Languages } from '~/locale';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';

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
