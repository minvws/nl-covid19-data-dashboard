import { GmCollectionVaccineCoveragePerAgeGroup } from '@corona-dashboard/common';
import { Choropleth } from '~/components/choropleth';
import { ChoroplethTile } from '~/components/choropleth-tile';
import { thresholds } from '~/components/choropleth/logic';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface VaccineCoveragePerMunicipalityProps {
  data: GmCollectionVaccineCoveragePerAgeGroup;
}

export function VaccineCoveragePerMunicipality({
  data,
}: VaccineCoveragePerMunicipalityProps) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  return (
    <ChoroplethTile
      title={siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.title}
      description={
        siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.description
      }
      legend={{
        thresholds: thresholds.gm.vaccination_coverage_percentage,
        title:
          siteText.vaccinaties.choropleth_vaccinatie_graad_per_gm.legenda_titel,
      }}
      metadata={{ source: siteText.brononderzoek.bronnen.rivm }}
    >
      <Choropleth
        map="gm"
        data={data}
        dataConfig={{
          metricProperty: 'fully_vaccinated_percentage',
        }}
        dataOptions={{
          isPercentage: true,
          // TODO: replace with vaccinaties pagina
          getLink: (gmcode) => reverseRouter.gm.index(gmcode),
        }}
      />
    </ChoroplethTile>
  );
}
