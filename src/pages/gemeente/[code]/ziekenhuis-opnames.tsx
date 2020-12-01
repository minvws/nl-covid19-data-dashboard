import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { Tile } from '~/components-styled/layout';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<IMunicipalityData> = (props) => {
  const { municipalityName } = props;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          municipalityName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          municipalityName,
        })}
      />

      <ContentHeader
        category={siteText.gemeente_layout.headings.ziekenhuizen}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
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

IntakeHospital.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default IntakeHospital;
