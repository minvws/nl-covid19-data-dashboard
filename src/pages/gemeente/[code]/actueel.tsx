import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Tile } from '~/components-styled/layout';
import { MaxWidth } from '~/components-styled/max-width';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { TALLLanguages } from '~/locale/';
import { EscalationMapLegenda } from '~/pages/veiligheidsregio';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';

type ActueelData = IMunicipalityData & { text: TALLLanguages };

const MunicipalityActueel: FCWithLayout<ActueelData> = (data) => {
  const router = useRouter();
  const { text } = data;

  return (
    <MaxWidth>
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
    </MaxWidth>
  );
};

/** @TODO Fill metadata / adjust layout */
const metadata = {
  title: '',
};
MunicipalityActueel.getLayout = getLayoutWithMetadata(metadata);

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default MunicipalityActueel;
