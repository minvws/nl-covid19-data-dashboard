import { ContentHeader } from '~/components/layout/Content';
import { FCWithLayout } from '~/components/layout';
import { LineChart } from '~/components/charts/index';

import { formatNumber } from '~/utils/formatNumber';

import CoronaVirus from '~/assets/coronavirus.svg';

import siteText from '~/locale/index';

import { RegionalNursingHome } from '~/types/data.d';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { SEOHead } from '~/components/seoHead';

const text = siteText.veiligheidsregio_verpleeghuis_oversterfte;

const NursingHomeDeaths: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data: state, safetyRegionName } = props;

  const data: RegionalNursingHome | undefined = state?.nursing_home;

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
        category={siteText.veiligheidsregio_layout.headings.verpleeghuis}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={CoronaVirus}
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

          <h3>
            <span className="text-blue kpi" data-cy="infected_daily_total">
              {formatNumber(data?.last_value.deceased_daily)}
            </span>
          </h3>
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

NursingHomeDeaths.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeDeaths;
