import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { Tile } from '~/components-styled/layout';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<ISafetyRegionData> = (props) => {
  const { safetyRegionName } = props;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.ziekenhuizen}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        reference={text.reference}
      />

      <Tile>
        <Heading level={3}>{text.tijdelijk_onbeschikbaar_titel}</Heading>
        <Box width="70%">
          <Text>{text.tijdelijk_onbeschikbaar}</Text>
        </Box>
      </Tile>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
