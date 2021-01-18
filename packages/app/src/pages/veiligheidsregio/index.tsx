import { useRouter } from 'next/router';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MessageTile } from '~/components-styled/message-tile';
import { TileList } from '~/components-styled/tile-list';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { SEOHead } from '~/components/seoHead';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getText,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { useBreakpoints } from '~/utils/useBreakpoints';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegion: FCWithLayout<typeof getStaticProps> = ({
  text,
  choropleth,
}) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  return (
    <>
      <SEOHead
        title={text.veiligheidsregio_index.metadata.title}
        description={text.veiligheidsregio_index.metadata.description}
      />

      {!breakpoints.md && (
        <Box bg="white">
          <SafetyRegionComboBox />
        </Box>
      )}

      <TileList>
        {text.regionaal_index.belangrijk_bericht && (
          <MessageTile message={text.regionaal_index.belangrijk_bericht} />
        )}

        <ChoroplethTile
          title={text.veiligheidsregio_index.selecteer_titel}
          description={
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: text.veiligheidsregio_index.selecteer_toelichting,
                }}
              />
              <EscalationMapLegenda />
            </>
          }
        >
          <SafetyRegionChoropleth
            data={choropleth.vr}
            metricName="escalation_levels"
            metricProperty="escalation_level"
            onSelect={createSelectRegionHandler(router, 'maatregelen')}
            tooltipContent={escalationTooltip(
              createSelectRegionHandler(router, 'maatregelen')
            )}
          />
        </ChoroplethTile>
      </TileList>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
