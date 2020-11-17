import css from '@styled-system/css';
import Getest from '~/assets/test.svg';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { Metadata } from '~/components-styled/metadata';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<INationalData> = ({ data }) => {
  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuizen}
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.nursing_home.last_value.date_of_report_unix,
          dateInsertedUnix: data.nursing_home.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article
        className="metric-article layout-two-column"
        css={css({ mb: 4 })}
      >
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(data.nursing_home.last_value.newly_infected_people)}
          </p>
          <Metadata
            date={data.nursing_home.last_value.date_of_report_unix}
            source={text.bron}
          />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <LineChartTile
        metadata={{ source: text.bron }}
        title={text.linechart_titel}
        values={data.nursing_home.values.map((value) => ({
          value: value.newly_infected_people,
          date: value.date_of_report_unix,
        }))}
      />
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedPeople;
