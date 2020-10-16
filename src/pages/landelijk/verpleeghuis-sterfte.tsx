import CoronaVirus from '~/assets/coronavirus.svg';
import { LineChart } from '~/components/charts/index';
import { NursingHomeDeathsBarScale } from '~/components/common/nursing-home-deaths-barscale';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { SEOHead } from '~/components/seoHead';

const text = siteText.verpleeghuis_oversterfte;

const NursingHomeDeaths: FCWithLayout<INationalData> = (props) => {
  const data = props.data.nursing_home;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuis}
        title={text.titel}
        Icon={CoronaVirus}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.last_value.date_of_report_unix,
          dateInsertedUnix: data.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <NursingHomeDeathsBarScale
            value={data.last_value.deceased_daily}
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
              value: value.deceased_daily,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}
    </>
  );
};

NursingHomeDeaths.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeDeaths;
