import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MaxWidth } from '~/components-styled/max-width';
import { QuickLinks } from '~/components-styled/quick-links';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { Search } from '~/domain/topical/components/search';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

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

  return (
    <MaxWidth>
      <TileList>
        <Search initialValue={props.safetyRegionName} />
        <Tile>De actuele situatie in {props.safetyRegionName}</Tile>
        <Tile>Artikelen</Tile>
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
            tooltipContent={escalationTooltip(
              createSelectRegionHandler(router)
            )}
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
        />
      </TileList>
    </MaxWidth>
  );
};

/** @TODO Fill metadata / adjust layout */
const metadata = {
  title: '',
};
SafetyRegionActueel.getLayout = getLayoutWithMetadata(metadata);

export default SafetyRegionActueel;
