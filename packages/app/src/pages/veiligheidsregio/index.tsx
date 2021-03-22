import { useRouter } from 'next/router';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { Markdown } from '~/components-styled/markdown';
import { TileList } from '~/components-styled/tile-list';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
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
import { useBreakpoints } from '~/utils/useBreakpoints';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegion = (props: StaticProps<typeof getStaticProps>) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const { siteText, formatDate } = useIntl();

  const { choropleth, lastGenerated } = props;

  const goToSafetyRegion = createSelectRegionHandler(
    router,
    'risiconiveau',
    !breakpoints.md
  );

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout lastGenerated={lastGenerated}>
        {!breakpoints.md && (
          <Box bg="white">
            <SafetyRegionComboBox onSelect={goToSafetyRegion} />
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
            <SafetyRegionChoropleth
              data={choropleth.vr}
              metricName="escalation_levels"
              metricProperty="level"
              onSelect={goToSafetyRegion}
              tooltipContent={escalationTooltip(goToSafetyRegion)}
            />
          </ChoroplethTile>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

export default SafetyRegion;
