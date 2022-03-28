import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, selectVrData } from '~/static-props/get-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrData()
);

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated, vrName } = props;
  const { commonTexts } = useIntl();
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    if (breakpoints.md) {
      router.replace(reverseRouter.vr.vaccinaties(router.query.code as string));
    }
  }, [breakpoints.md, reverseRouter.vr, router]);

  return (
    <Layout
      {...commonTexts.veiligheidsregio_index.metadata}
      lastGenerated={lastGenerated}
    >
      <VrLayout vrName={vrName} />
    </Layout>
  );
};

export default VrIndexPage;
