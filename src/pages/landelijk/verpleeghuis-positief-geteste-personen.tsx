import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import Getest from '~/assets/test.svg';
import { LineChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber } from '~/utils/formatNumber';
import { Metadata } from '~/components-styled/metadata';

const NursingHomeInfectedPeople: FCWithLayout<INationalData> = ({ data }) => {
  const { siteText }: ILocale = useContext(LocaleContext);
  const text = siteText.verpleeghuis_positief_geteste_personen;

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
          dateUnix: data.nursing_home.last_value.date_of_report_unix,
          dateInsertedUnix: data.nursing_home.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
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

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={data.nursing_home.values.map((value) => ({
            value: value.newly_infected_people,
            date: value.date_of_report_unix,
          }))}
        />
        <Metadata source={text.bron} />
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedPeople;
