import { useRouter } from 'next/router';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { Tile } from '~/components-styled/tile';
import { MaxWidth } from '~/components-styled/max-width';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { TALLLanguages } from '~/locale/';
import { EscalationMapLegenda } from '~/pages/veiligheidsregio';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { QuickLinks } from '~/components-styled/quick-links';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';

type ActueelData = IMunicipalityData & { text: TALLLanguages };

const MunicipalityActueel: FCWithLayout<ActueelData> = (data) => {
  const router = useRouter();
  const { text } = data;
  const safetyRegionForMunicipality =
    typeof router.query.code === 'string'
      ? getSafetyRegionForMunicipalityCode(router.query.code)
      : undefined;

  return (
    <MaxWidth>
      <Tile>De actuele situatie in {data.municipalityName}</Tile>
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
          safetyRegionForMunicipality
            ? {
                href: `/veiligheidsregio/${safetyRegionForMunicipality.code}/positief-geteste-mensen`,
                text: `Cijfers van ${safetyRegionForMunicipality.name}`,
              }
            : {
                href: '/veiligheidsregio',
                text: 'Cijfers per veiligheidsregio',
              },
          {
            href: `/gemeente/${router.query.code}/positief-geteste-mensen`,
            text: `Cijfers van ${data.municipalityName}`,
          },
        ]}
      ></QuickLinks>
    </MaxWidth>
  );
};

/** @TODO Fill metadata / adjust layout */
const metadata = {
  title: '',
};
MunicipalityActueel.getLayout = getLayoutWithMetadata(metadata);

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default MunicipalityActueel;
