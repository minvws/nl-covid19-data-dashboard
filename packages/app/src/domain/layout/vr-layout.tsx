import Head from 'next/head';
import { useRouter } from 'next/router';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';

type VrLayoutProps = {
  children?: React.ReactNode;
};

/**
 * VrLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /veiligheidsregio -> only show aside
 * - /veiligheidsregio/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /veiligheidsregio -> shows aside and content (children)
 * - /veiligheidsregio/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export function VrLayout(props: VrLayoutProps) {
  const { children } = props;

  const router = useRouter();

  const isMainRoute = router.route === '/veiligheidsregio';

  return (
    <>
      <Head>
        <link key="dc-spatial" rel="dcterms:spatial" href="https://standaarden.overheid.nl/owms/terms/Nederland" />
        <link key="dc-spatial-title" rel="dcterms:spatial" href="https://standaarden.overheid.nl/owms/terms/Nederland" title="Nederland" />
      </Head>

      <AppContent hideBackButton={isMainRoute} sidebarComponent={<></>}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
