import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { InLayout } from '~/domain/layout/in-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = withFeatureNotFoundPage(
  'inHomePage',
  createGetStaticProps(getLastGeneratedDate)
);

export default function InternationalPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { commonTexts } = useIntl();
  const { lastGenerated } = props;

  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    if (breakpoints.md) {
      router.replace(reverseRouter.in.positiefGetesteMensen());
    }
  }, [breakpoints.md, reverseRouter.in, router]);

  return (
    <Layout
      {...commonTexts.internationaal_metadata}
      lastGenerated={lastGenerated}
    >
      <InLayout lastGenerated={lastGenerated} />
    </Layout>
  );
}
