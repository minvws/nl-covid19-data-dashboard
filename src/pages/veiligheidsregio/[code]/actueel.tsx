import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Tile } from '~/components-styled/layout';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { TALLLanguages } from '~/locale/';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { EscalationMapLegenda } from '..';

type ActueelData = ISafetyRegionData & { text: TALLLanguages };

const SafetyRegionActueel: FCWithLayout<ActueelData> = (data) => {
  const router = useRouter();
  const { text } = data;

  return (
    <>
      <Tile>De actuele situatie in {data.safetyRegionName}</Tile>
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

SafetyRegionActueel.getLayout = getSafetyRegionLayout();

export const getStaticPaths = getSafetyRegionPaths();

export async function getStaticProps(args: {
  params: {
    code: string;
  };
}): Promise<{ props: ActueelData }> {
  const text = parseMarkdownInLocale(
    (await import('../../../locale/index')).default
  );
  const { props } = getSafetyRegionData()(args);

  return {
    props: {
      text,
      ...props,
    },
  };
}

export default SafetyRegionActueel;
