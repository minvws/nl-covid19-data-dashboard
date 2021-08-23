import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(),
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale } = context;
    return createPageArticlesQuery('elderlyAtHomePage', locale);
  })
);

const VaccinationsVrPage = (props: StaticProps<typeof getStaticProps>) => {
  const { vrName, selectedVrData: data, lastGenerated } = props;

  // const { difference } = data;
  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_vaccinaties;

  const metadata = {
    ...siteText.veiligheidsregio_vaccinaties.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegion: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegion: vrName,
    }),
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <h1>Hoi</h1>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default VaccinationsVrPage;
