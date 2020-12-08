import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { Tile } from '~/components-styled/layout';
import { Heading, Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionStaticProps,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<ISafetyRegionData> = (props) => {
  // const { data, safetyRegionName } = props;
  // const router = useRouter();

  // const lastValue = data.results_per_region.last_value;

  // const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  // const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;
  const { safetyRegionName } = props;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.ziekenhuizen}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        icon={<Ziekenhuis />}
        subtitle={text.pagina_toelichting}
        // metadata={{
        //   datumsText: text.datums,
        //   dateInfo: lastValue.date_of_report_unix,
        //   dateOfInsertionUnix: lastValue.date_of_insertion_unix,
        //   dataSources: [text.bronnen.rivm],
        // }}
        reference={text.reference}
      />
      {/*
      <TwoKpiSection>
        <KpiTile
          showDataWarning
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: lastValue.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="hospital_moving_avg_per_region"
            absolute={lastValue.hospital_moving_avg_per_region}
            difference={
              data.difference.results_per_region__hospital_moving_avg_per_region
            }
          />
        </KpiTile>
      </TwoKpiSection>

      {lastValue && (
        <LineChartTile
          showDataWarning
          metadata={{ source: text.bronnen.rivm }}
          title={text.linechart_titel}
          description={text.linechart_description}
          values={data.results_per_region.values.map((value) => ({
            value: value.hospital_moving_avg_per_region,
            date: value.date_of_report_unix,
          }))}
        />
      )}

      <ChoroplethTile
        showDataWarning
        title={replaceVariablesInText(text.map_titel, {
          safetyRegion: safetyRegionName,
        })}
        description={text.map_toelichting}
        legend={{
          thresholds: regionThresholds.hospital_admissions.hospital_admissions,
          title: siteText.ziekenhuisopnames_per_dag.chloropleth_legenda.titel,
        }}
        metadata={{
          date: lastValue.date_of_report_unix,
          source: text.bronnen.rivm,
        }}
      >
        <MunicipalityChoropleth
          selected={selectedMunicipalCode}
          highlightSelection={false}
          metricName="hospital_admissions"
          metricProperty="hospital_admissions"
          tooltipContent={createMunicipalHospitalAdmissionsTooltip(router)}
          onSelect={createSelectMunicipalHandler(router, 'ziekenhuis-opnames')}
        />
      </ChoroplethTile>
        reference={text.reference}
      />
      */}

      <Tile>
        <Heading level={3}>{text.tijdelijk_onbeschikbaar_titel}</Heading>
        <Box width="70%">
          <Text>{text.tijdelijk_onbeschikbaar}</Text>
        </Box>
      </Tile>
    </>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default IntakeHospital;
