import {
  GmCollectionVaccineCoveragePerAgeGroup,
  VrCollectionVaccineCoveragePerAgeGroup,
} from '@corona-dashboard/common';
import { useMemo, useState } from 'react';
import { hasValueAtKey } from 'ts-is-present';
import { RegionControlOption } from '~/components/chart-region-controls';
import { Choropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface VaccineCoveragePerMunicipalityProps {
  data: {
    gm: GmCollectionVaccineCoveragePerAgeGroup[];
    vr: VrCollectionVaccineCoveragePerAgeGroup[];
  };
}

type AgeGroup = '12+' | '12-17' | '18+';

export function VaccineCoveragePerMunicipality({
  data,
}: VaccineCoveragePerMunicipalityProps) {
  const { siteText } = useIntl();
  const [selectedMap, setSelectedMap] = useState<RegionControlOption>('gm');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('18+');
  const reverseRouter = useReverseRouter();

  const selectedData = useMemo(
    () =>
      data[selectedMap].filter(
        hasValueAtKey('age_group_range', selectedAgeGroup)
      ),
    [data, selectedAgeGroup, selectedMap]
  );

  return (
    <ChoroplethTile
      title={siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.title}
      description={
        siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.description
      }
      legend={{
        thresholds: thresholds.gm.fully_vaccinated_percentage,
        title:
          siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.legenda_titel,
      }}
      metadata={{ source: siteText.brononderzoek.bronnen.rivm }}
      chartRegion={selectedMap}
      onChartRegionChange={setSelectedMap}
    >
      {selectedMap === 'gm' && (
        <Choropleth
          map={'gm'}
          accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
          data={selectedData}
          dataConfig={{
            metricProperty: 'fully_vaccinated_percentage',
          }}
          dataOptions={{
            isPercentage: true,
            // TODO: replace with vaccinaties pagina
            getLink: (gmcode) => reverseRouter.gm.index(gmcode),
            tooltipVariables: {
              age_group: siteText.vaccinaties.age_groups[selectedAgeGroup],
            },
          }}
        />
      )}

      {
        selectedMap === 'vr' && 'getting there'
        // <Choropleth
        //   map={'vr'}
        //   accessibility={{ key: 'vaccine_coverage_nl_choropleth' }}
        //   data={data}
        //   dataConfig={{
        //     metricProperty: 'fully_vaccinated_percentage',
        //   }}
        //   dataOptions={{
        //     isPercentage: true,
        //     // TODO: replace with vaccinaties pagina
        //     getLink: (gmcode) => reverseRouter.gm.index(gmcode),
        //   }}
        // />
      }
    </ChoroplethTile>
  );
}
