import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Tile } from '~/components-styled/tile';
import { MaxWidth } from '~/components-styled/max-width';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { TALLLanguages } from '~/locale/';
import {
  getSafetyRegionStaticProps,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { EscalationMapLegenda } from '..';
import { QuickLinks } from '~/components-styled/quick-links';

type ActueelData = ISafetyRegionData & { text: TALLLanguages };

const SafetyRegionActueel: FCWithLayout<ActueelData> = (data) => {
  const router = useRouter();
  const { text } = data;

  return (
    <MaxWidth>
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

      <QuickLinks
        header="Bekijk alle cijfers van het dashboard"
        links={[
          { href: '/landelijk', text: 'Cijfers van Nederland' },
          {
            href: `/veiligheidsregio/${router.query.code}/positief-geteste-mensen`,
            text: `Cijfers van ${data.safetyRegionName}`,
          },
          { href: `/gemeentes`, text: 'Cijfers per gemeente' },
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

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default SafetyRegionActueel;
