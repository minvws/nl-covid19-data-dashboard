import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Tile } from '~/components-styled/layout';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { TALLLanguages } from '~/locale/';
import { EscalationMapLegenda } from '~/pages/veiligheidsregio';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';

type ActueelData = IMunicipalityData & { text: TALLLanguages };

const MunicipalityActueel: FCWithLayout<ActueelData> = (data) => {
  const router = useRouter();
  const { text } = data;

  return (
    <>
      <Tile>De actuele situatie in {data.municipalityName}</Tile>
      <Tile>Artikelen</Tile>
      <ChoroplethTile
        title={text.veiligheidsregio_index.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.veiligheidsregio_index.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda text={text} />
          </>
        }
      >
        <SafetyRegionChoropleth
          metricName="escalation_levels"
          metricProperty="escalation_level"
          onSelect={createSelectRegionHandler(router)}
          tooltipContent={escalationTooltip(createSelectRegionHandler(router))}
        />
      </ChoroplethTile>
    </>
  );
};

MunicipalityActueel.getLayout = getMunicipalityLayout();

export const getStaticPaths = getMunicipalityPaths();

export async function getStaticProps(args: {
  params: {
    code: string;
  };
}): Promise<{ props: ActueelData }> {
  const text = parseMarkdownInLocale(
    (await import('../../../locale/index')).default
  );
  const { props } = getMunicipalityData()(args);

  return {
    props: {
      text,
      ...props,
    },
  };
}

export default MunicipalityActueel;
