import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getText,
} from '~/static-props/get-data';
import { createDate } from '~/utils/createDate';
import { formatDate } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { reverseRouter } from '~/utils/reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegion: FCWithLayout<typeof getStaticProps> = (props) => {
  const breakpoints = useBreakpoints();

  const { text, choropleth } = props;

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
          <WarningTile
            message={text.regionaal_index.belangrijk_bericht}
            variant="emphasis"
          />
        )}

        <ChoroplethTile
          title={text.veiligheidsregio_index.selecteer_titel}
          description={
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: replaceVariablesInText(
                    text.veiligheidsregio_index.selecteer_toelichting,
                    {
                      last_update: formatDate(
                        createDate(
                          choropleth.vr.escalation_levels[0]
                            .last_determined_unix
                        ),
                        'day-month'
                      ),
                    }
                  ),
                }}
              />
              <EscalationMapLegenda
                data={choropleth.vr}
                metricName="escalation_levels"
                metricProperty="level"
                lastDetermined={
                  choropleth.vr.escalation_levels[0].last_determined_unix
                }
              />
            </>
          }
        >
          <SafetyRegionChoropleth
            getLink={reverseRouter.vr.index}
            data={choropleth.vr}
            metricName="escalation_levels"
            metricProperty="level"
            tooltipContent={escalationTooltip(reverseRouter.vr.index)}
          />
        </ChoroplethTile>
      </TileList>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
