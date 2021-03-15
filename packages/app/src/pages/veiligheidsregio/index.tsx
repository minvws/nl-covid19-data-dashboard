import { useRouter } from 'next/router';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { useIntl } from '~/intl';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegion: FCWithLayout<typeof getStaticProps> = (props) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const { siteText, formatDate } = useIntl();

  const { choropleth } = props;

  const goToSafetyRegion = createSelectRegionHandler(
    router,
    'risiconiveau',
    !breakpoints.md
  );

  return (
    <>
      <SEOHead
        title={siteText.veiligheidsregio_index.metadata.title}
        description={siteText.veiligheidsregio_index.metadata.description}
      />

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
              <div
                dangerouslySetInnerHTML={{
                  __html: replaceVariablesInText(
                    siteText.veiligheidsregio_index.selecteer_toelichting,
                    {
                      last_update: formatDate(
                        choropleth.vr.escalation_levels[0].last_determined_unix,
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
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
