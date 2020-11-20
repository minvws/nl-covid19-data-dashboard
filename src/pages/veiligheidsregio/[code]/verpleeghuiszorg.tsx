import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Getest from '~/assets/test.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const locationsText = siteText.veiligheidsregio_verpleeghuis_besmette_locaties;
const positiveTestPeopleText =
  siteText.veiligheidsregio_verpleeghuis_positief_geteste_personen;
const mortalityText = siteText.veiligheidsregio_verpleeghuis_oversterfte;

const NursingHomeInfectedLocations: FCWithLayout<ISafetyRegionData> = (
  props
) => {
  const { data, safetyRegionName } = props;

  const nursinghomeLastValue = data.nursing_home.last_value;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(locationsText.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(
          locationsText.metadata.description,
          {
            safetyRegionName,
          }
        )}
      />

      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.kwetsbare_groepen}
        title={replaceVariablesInText(positiveTestPeopleText.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Getest}
        subtitle={replaceVariablesInText(
          positiveTestPeopleText.pagina_toelichting,
          {
            safetyRegion: safetyRegionName,
          }
        )}
        metadata={{
          datumsText: positiveTestPeopleText.datums,
          dateUnix: nursinghomeLastValue.date_of_report_unix,
          dateInsertedUnix: nursinghomeLastValue.date_of_insertion_unix,
          dataSource: positiveTestPeopleText.bron,
        }}
        reference={positiveTestPeopleText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={positiveTestPeopleText.barscale_titel}
          description={positiveTestPeopleText.extra_uitleg}
          metadata={{
            date: nursinghomeLastValue.date_of_report_unix,
            source: positiveTestPeopleText.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={nursinghomeLastValue.newly_infected_people}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        metadata={{ source: positiveTestPeopleText.bron }}
        title={positiveTestPeopleText.linechart_titel}
        values={data.nursing_home.values.map((value) => ({
          value: value.newly_infected_people,
          date: value.date_of_report_unix,
        }))}
      />

      <ContentHeader
        title={replaceVariablesInText(locationsText.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Locatie}
        subtitle={locationsText.pagina_toelichting}
        metadata={{
          datumsText: locationsText.datums,
          dateUnix: nursinghomeLastValue.date_of_report_unix,
          dateInsertedUnix: nursinghomeLastValue.date_of_insertion_unix,
          dataSource: locationsText.bron,
        }}
        reference={locationsText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={locationsText.kpi_titel}
          metadata={{
            date: nursinghomeLastValue.date_of_report_unix,
            source: locationsText.bron,
          }}
        >
          <KpiValue
            absolute={nursinghomeLastValue.infected_locations_total}
            percentage={nursinghomeLastValue.infected_locations_percentage}
          />
          <Text>{locationsText.kpi_toelichting}</Text>
        </KpiTile>
        <KpiTile
          title={locationsText.barscale_titel}
          metadata={{
            date: nursinghomeLastValue.date_of_report_unix,
            source: locationsText.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={nursinghomeLastValue.newly_infected_locations}
          />
          <Text>{locationsText.barscale_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      {nursinghomeLastValue.infected_locations_total !== undefined && (
        <LineChartTile
          title={locationsText.linechart_titel}
          values={data.nursing_home.values.map((value) => ({
            value: value.infected_locations_total,
            date: value.date_of_report_unix,
          }))}
          metadata={{
            source: locationsText.bron,
          }}
        />
      )}

      <ContentHeader
        title={replaceVariablesInText(mortalityText.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={CoronaVirus}
        subtitle={mortalityText.pagina_toelichting}
        metadata={{
          datumsText: mortalityText.datums,
          dateUnix: nursinghomeLastValue.date_of_report_unix,
          dateInsertedUnix: nursinghomeLastValue.date_of_insertion_unix,
          dataSource: mortalityText.bron,
        }}
        reference={mortalityText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={mortalityText.barscale_titel}
          description={mortalityText.extra_uitleg}
          metadata={{
            date: nursinghomeLastValue.date_of_report_unix,
            source: mortalityText.bron,
          }}
        >
          <KpiValue absolute={nursinghomeLastValue.deceased_daily} />
        </KpiTile>
      </TwoKpiSection>

      {data && (
        <LineChartTile
          metadata={{ source: mortalityText.bron }}
          title={mortalityText.linechart_titel}
          values={data.nursing_home.values.map((value) => ({
            value: value.deceased_daily,
            date: value.date_of_report_unix,
          }))}
        />
      )}
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeInfectedLocations;
