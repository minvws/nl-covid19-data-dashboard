import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { TileList } from '~/components-styled/tile-list';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { EscalationRegionalTooltip } from '~/components/choropleth/tooltips/region/escalation-regional-tooltip';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createDate } from '~/utils/createDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { reverseRouter } from '~/utils/reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { useIntl } from '~/intl';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import {
  EscalationLevels,
  SafetyRegionProperties,
} from '@corona-dashboard/common';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegion = (props: StaticProps<typeof getStaticProps>) => {
  const breakpoints = useBreakpoints();

  const { siteText, formatDate } = useIntl();

  const { choropleth, lastGenerated } = props;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout lastGenerated={lastGenerated}>
        {!breakpoints.md && (
          <Box bg="white">
            <SafetyRegionComboBox />
          </Box>
        )}

        <TileList>
          {siteText.regionaal_index.belangrijk_bericht && (
            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
              variant="emphasis"
            />
          )}

          <ChoroplethTile
            title={siteText.veiligheidsregio_index.selecteer_titel}
            description={
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: replaceVariablesInText(
                      siteText.veiligheidsregio_index.selecteer_toelichting,
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
              data={choropleth.vr}
              getLink={reverseRouter.vr.index}
              metricName="escalation_levels"
              metricProperty="level"
              tooltipContent={(
                context: SafetyRegionProperties & EscalationLevels
              ) => (
                <EscalationRegionalTooltip
                  context={context}
                  getLink={reverseRouter.vr.index}
                />
              )}
            />
          </ChoroplethTile>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default SafetyRegion;
