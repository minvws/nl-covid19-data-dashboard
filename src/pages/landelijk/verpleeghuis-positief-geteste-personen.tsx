import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { ContentHeader } from '~/components/layout/Content';
import { LineChart } from '~/components/charts/index';

import { NursingHomeInfectedPeopleBarScale } from '~/components/landelijk/nursing-home-infected-people-barscale';

import Getest from '~/assets/test.svg';

import siteText from '~/locale/index';

import { InfectedPeopleNurseryCountDaily } from '~/types/data.d';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { SafetyRegionLegenda } from '~/components/chloropleth/legenda/SafetyRegionLegenda';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { useRouter } from 'next/router';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/chloropleth/tooltips/region/createPositiveTestedPeopleRegionalTooltip';

const text: typeof siteText.verpleeghuis_positief_geteste_personen =
  siteText.verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;
  const router = useRouter();

  const data: InfectedPeopleNurseryCountDaily | undefined =
    state?.infected_people_nursery_count_daily;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuis}
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
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

          <NursingHomeInfectedPeopleBarScale data={data} showAxis={true} />
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
              value: value.infected_nursery_daily,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>{text.positief_geteste_personen.map_titel}</h3>
          <p>{text.positief_geteste_personen.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <SafetyRegionChloropleth
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
            onSelect={createSelectRegionHandler(router)}
          />
        </div>

        <div className="chloropleth-legend">
          <SafetyRegionLegenda
            metricName="positive_tested_people"
            title={text.positief_geteste_personen.chloropleth_legenda.titel}
          />
        </div>
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedPeople;
