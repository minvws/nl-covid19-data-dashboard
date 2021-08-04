import { EscalationLevels, VrGeoProperties } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { VrChoropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { VrEscalationTooltip } from '~/components/choropleth/tooltips';
import { EscalationMapLegenda } from '~/components/escalation-map-legenda';
import { Markdown } from '~/components/markdown';
import { TileList } from '~/components/tile-list';
import { WarningTile } from '~/components/warning-tile';
import { VrComboBox } from '~/domain/layout/components/vr-combo-box';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createDate } from '~/utils/create-date';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const breakpoints = useBreakpoints();

  const { siteText, formatDate } = useIntl();
  const reverseRouter = useReverseRouter();

  const { choropleth, lastGenerated } = props;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
  };

  const unknownLevelColor = useEscalationColor(null);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout isLandingPage lastGenerated={lastGenerated}>
        {!breakpoints.md && (
          <Box bg="white">
            <VrComboBox />
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
                <Box mb={3}>
                  <Markdown
                    content={replaceVariablesInText(
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
                    )}
                  />
                </Box>
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
            <VrChoropleth
              accessibility={{ key: 'escalation_levels_choropleth' }}
              data={choropleth.vr}
              getLink={reverseRouter.vr.index}
              metricName="escalation_levels"
              metricProperty="level"
              noDataFillColor={unknownLevelColor}
              tooltipContent={(context: VrGeoProperties & EscalationLevels) => (
                <VrEscalationTooltip
                  context={context}
                  getLink={reverseRouter.vr.index}
                />
              )}
            />
          </ChoroplethTile>
        </TileList>
      </VrLayout>
    </Layout>
  );
};

export default VrIndexPage;
