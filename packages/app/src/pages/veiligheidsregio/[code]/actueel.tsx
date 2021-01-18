import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MaxWidth } from '~/components-styled/max-width';
import { QuickLinks } from '~/components-styled/quick-links';
import { Tile } from '~/components-styled/tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
export { getStaticPaths } from '~/static-paths/vr';
import { RiskLevelIndicator } from '~/components-styled/risk-level-indicator';
import { assert } from '~/utils/assert';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegionActueel: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, choropleth } = props;
  const router = useRouter();
  const text = siteText.veiligheidsregio_actueel;
  const regionText = siteText.escalatie_niveau;

  const regionCode =
    typeof router.query.code === 'string' ? router.query.code : undefined;

  const riskLevelText = siteText.risoconiveau_maatregelen;

  const filteredRegion = props.choropleth.vr.escalation_levels.find(
    (item) => item.vrcode === regionCode
  );

  assert(filteredRegion, 'Could not find a region code');

  return (
    <MaxWidth>
      <Tile>De actuele situatie in {props.safetyRegionName}</Tile>
      <Tile>Artikelen</Tile>

      <Tile>
        <RiskLevelIndicator
          title={riskLevelText.title}
          description={riskLevelText.description.vr}
          linkText={riskLevelText.bekijk_href}
          escalationLevel={filteredRegion.escalation_level}
          code={filteredRegion.vrcode}
          href={`/veiligheidsregio/${regionCode}/maatregelen`}
          escalationTypes={regionText.types}
        />
      </Tile>

      <ChoroplethTile
        title={text.risiconiveaus.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.risiconiveaus.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda
              data={choropleth.vr}
              metricName="escalation_levels"
              metricProperty="escalation_level"
            />
          </>
        }
      >
        <SafetyRegionChoropleth
          data={choropleth.vr}
          metricName="escalation_levels"
          metricProperty="escalation_level"
          onSelect={createSelectRegionHandler(router)}
          tooltipContent={escalationTooltip(createSelectRegionHandler(router))}
        />
      </ChoroplethTile>

      <QuickLinks
        header={text.quick_links.header}
        links={[
          { href: '/landelijk', text: text.quick_links.links.nationaal },
          {
            href: `/veiligheidsregio/${router.query.code}/positief-geteste-mensen`,
            text: replaceVariablesInText(
              text.quick_links.links.veiligheidsregio,
              { safetyRegionName: props.safetyRegionName }
            ),
          },
          { href: '/gemeentes', text: text.quick_links.links.gemeente },
        ]}
      ></QuickLinks>
    </MaxWidth>
  );
};

/** @TODO Fill metadata / adjust layout */
const metadata = {
  title: '',
};
SafetyRegionActueel.getLayout = getLayoutWithMetadata(metadata);

export default SafetyRegionActueel;
