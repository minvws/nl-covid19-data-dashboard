import { useRouter } from 'next/router';
import Getest from '~/assets/test.svg';
import { LineChart } from '~/components/charts/index';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { createNursingHomeNewlyInfectedTooltip } from '~/components/chloropleth/tooltips/region/createNursingHomeNewlyInfectedTooltip';
import { NursingHomeInfectedPeopleBarScale } from '~/components/common/nursing-home-infected-people-barscale';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { SEOHead } from '~/components/seoHead';

const text = siteText.verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<INationalData> = (props) => {
  const data = props.data.nursing_home;
  const router = useRouter();

  const legendItems = useSafetyRegionLegendaData(
    'nursing_home',
    'newly_infected_people'
  );

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
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

          <NursingHomeInfectedPeopleBarScale
            value={data.last_value.newly_infected_people}
            showAxis={true}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <SafetyRegionChloropleth
            metricName="nursing_home"
            metricValueName="newly_infected_people"
            tooltipContent={createNursingHomeNewlyInfectedTooltip(router)}
            onSelect={createSelectRegionHandler(
              router,
              'verpleeghuis-positief-geteste-personen'
            )}
          />
        </div>

        <div className="chloropleth-legend">
          {legendItems ? (
            <ChloroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          ) : null}
        </div>
      </article>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value) => ({
              value: value.newly_infected_locations,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedPeople;
