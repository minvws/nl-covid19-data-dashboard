import {
  Arts,
  Coronavirus,
  Elderly,
  Gedrag,
  GehandicaptenZorg,
  Phone,
  Reproductiegetal,
  RioolwaterMonitoring,
  Test,
  Vaccinaties,
  Varianten,
  Verpleeghuiszorg,
  Ziekenhuis,
  Ziektegolf,
} from '@corona-dashboard/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  CategoryMenu,
  Menu,
  MetricMenuButtonLink,
  MetricMenuItemLink,
} from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface NlLayoutProps {
  children?: React.ReactNode;
}

/**
 * NlLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /landelijk -> only show aside
 * - /landelijk/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /landelijk -> shows aside and content (children)
 * - /landelijk/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export function NlLayout(props: NlLayoutProps) {
  const { children } = props;

  const router = useRouter();
  const reverseRouter = useReverseRouter();

  const { siteText } = useIntl();

  return (
    <>
      <Head>
        <link
          key="dc-spatial"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>

      <AppContent
        sidebarComponent={
          <Box
            as="nav"
            /** re-mount when route changes in order to blur anchors */
            key={router.asPath}
            id="metric-navigation"
            aria-labelledby="sidebar-title"
            role="navigation"
            pt={4}
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
          >
            <VisuallyHidden as="h2" id="sidebar-title">
              {siteText.nationaal_layout.headings.sidebar}
            </VisuallyHidden>

            <Menu spacing={4}>
              <MetricMenuButtonLink
                title={siteText.nationaal_maatregelen.titel_sidebar}
                subtitle={siteText.nationaal_maatregelen.subtitel_sidebar}
                href={reverseRouter.nl.maatregelen()}
              />

              <CategoryMenu
                title={siteText.nationaal_layout.headings.vaccinaties}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.vaccinaties()}
                  icon={<Vaccinaties />}
                  title={siteText.vaccinaties.titel_sidebar}
                />
              </CategoryMenu>

              <CategoryMenu
                title={siteText.nationaal_layout.headings.ziekenhuizen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.ziekenhuisopnames()}
                  icon={<Ziekenhuis />}
                  title={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.intensiveCareOpnames()}
                  icon={<Arts />}
                  title={siteText.ic_opnames_per_dag.titel_sidebar}
                />
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.besmettingen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.positiefGetesteMensen()}
                  icon={<Test />}
                  title={siteText.positief_geteste_personen.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.reproductiegetal()}
                  icon={<Reproductiegetal />}
                  title={siteText.reproductiegetal.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.sterfte()}
                  icon={<Coronavirus />}
                  title={siteText.sterfte.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.varianten()}
                  icon={<Varianten />}
                  title={siteText.covid_varianten.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.brononderzoek()}
                  icon={<Gedrag />}
                  title={siteText.brononderzoek.titel_sidebar}
                />
              </CategoryMenu>

              <CategoryMenu title={siteText.nationaal_layout.headings.gedrag}>
                <MetricMenuItemLink
                  href={reverseRouter.nl.gedrag()}
                  icon={<Gedrag />}
                  title={siteText.nl_gedrag.sidebar.titel}
                />
              </CategoryMenu>

              <CategoryMenu
                title={siteText.nationaal_layout.headings.kwetsbare_groepen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.verpleeghuiszorg()}
                  icon={<Verpleeghuiszorg />}
                  title={siteText.verpleeghuis_besmette_locaties.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.gehandicaptenzorg()}
                  icon={<GehandicaptenZorg />}
                  title={
                    siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar
                  }
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.thuiswonendeOuderen()}
                  icon={<Elderly />}
                  title={siteText.thuiswonende_ouderen.titel_sidebar}
                />
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.vroege_signalen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.rioolwater()}
                  icon={<RioolwaterMonitoring />}
                  title={siteText.rioolwater_metingen.titel_sidebar}
                />
              </CategoryMenu>

              <CategoryMenu title={siteText.nationaal_layout.headings.overig}>
                <MetricMenuItemLink
                  href={reverseRouter.nl.coronamelder()}
                  icon={<Phone />}
                  title={siteText.corona_melder_app.sidebar.titel}
                />
              </CategoryMenu>

              <CategoryMenu title={siteText.nationaal_layout.headings.archief}>
                <MetricMenuItemLink
                  href={reverseRouter.nl.besmettelijkeMensen()}
                  icon={<Ziektegolf />}
                  title={siteText.besmettelijke_personen.titel_sidebar}
                />

                <MetricMenuItemLink
                  href={reverseRouter.nl.verdenkingenHuisartsen()}
                  icon={<Arts />}
                  title={siteText.verdenkingen_huisartsen.titel_sidebar}
                />
              </CategoryMenu>
            </Menu>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
