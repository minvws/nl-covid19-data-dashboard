import { vrData } from '~/data/vr';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  loadAndSortVrData,
  selectCustomData,
  selectNlPageMetricData,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  selectCustomData(() => {
    const risiconiveaus = vrData.map((vr) => {
      const vrData = loadAndSortVrData(vr.code);
      return {
        data: vrData.escalation_level,
        safetyRegionName: vr.name,
        vrCode: vr.code,
      };
    });

    return {
      risiconiveaus,
    };
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { selectedNlData: data, lastGenerated, risiconiveaus } = props;

  const text = siteText.rioolwater_metingen;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout
        data={data}
        lastGenerated={lastGenerated}
      ></NationalLayout>
    </Layout>
  );
};

export default OverRisicoNiveaus;
