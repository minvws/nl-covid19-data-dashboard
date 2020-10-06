import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { LineChart } from '~/components/charts/index';

import { NursingHomeInfectedPeopleBarScale } from '~/components/common/nursing-home-infected-people-barscale';

import Getest from '~/assets/test.svg';

import siteText from '~/locale/index';

import { RegionalNursingHome } from '~/types/data.d';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/chloropleth/tooltips/region/createPositiveTestedPeopleRegionalTooltip';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';
import { useRouter } from 'next/router';

const text = siteText.veiligheidsregio_verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data: state, safetyRegionName } = props;

  const data: RegionalNursingHome | undefined = state?.nursing_home;

  const router = useRouter();
  const legendItems = useSafetyRegionLegendaData('positive_tested_people');

  return (
    <>
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.verpleeghuis}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Getest}
        subtitle={replaceVariablesInText(text.pagina_toelichting, {
          safetyRegion: safetyRegionName,
        })}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.date_of_report_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <NursingHomeInfectedPeopleBarScale
            value={data?.last_value.newly_infected_people}
            showAxis={true}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value) => ({
              value: value.newly_infected_people,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <SafetyRegionChloropleth
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
            onSelect={createSelectRegionHandler(
              router,
              'verpleeghuis-positief-geteste-personen'
            )}
          />
        </div>

        <div className="chloropleth-legend">
          {legendItems && (
            <ChloroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeInfectedPeople;
