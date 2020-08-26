import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import LoadingPlaceholder from 'components/loadingPlaceholder';
import { LineChart } from '../index';

import Getest from 'assets/test.svg';

import { SafetyRegion, RegioDataLoading } from 'pages/regio/index';

import { Regionaal, RegionaalValue } from 'types/data';

import siteText from 'locale';

import formatNumber from 'utils/formatNumber';

interface IProps {
  data: Regionaal;
  selectedRegio: SafetyRegion | undefined;
}

export default PostivelyTestedPeople;

function PostivelyTestedPeople(props: IProps) {
  const { selectedRegio, data } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <TitleWithIcon
          Icon={Getest}
          title={siteText.regionaal_positief_geteste_personen.title}
          regio={selectedRegio?.name}
        />

        <p>{siteText.regionaal_positief_geteste_personen.text}</p>

        {!selectedRegio && <RegioDataLoading />}

        {selectedRegio && (
          <>
            {!data?.results_per_region && <LoadingPlaceholder />}
            {data?.results_per_region && (
              <BarScale
                min={0}
                max={10}
                value={
                  data.results_per_region.last_value
                    .infected_increase_per_region
                }
                screenReaderText={
                  siteText.regionaal_positief_geteste_personen
                    .screen_reader_graph_content
                }
                id="regio_infecties"
                rangeKey="infected_increase_per_region"
                gradient={[
                  {
                    color: '#3391CC',
                    value: 0,
                  },
                ]}
              />
            )}

            {data?.results_per_region && (
              <>
                <h3>
                  {siteText.regionaal_positief_geteste_personen.metric_title}{' '}
                  <span style={{ color: '#01689b' }}>
                    {formatNumber(
                      data.results_per_region.last_value
                        .total_reported_increase_per_region
                    )}
                  </span>
                </h3>
                <DateReported
                  datumsText={
                    siteText.regionaal_positief_geteste_personen.datums
                  }
                  dateUnix={
                    data.results_per_region.last_value.date_of_report_unix
                  }
                  dateInsertedUnix={
                    data.results_per_region.last_value.date_of_insertion_unix
                  }
                />
              </>
            )}
          </>
        )}
      </GraphContent>

      {selectedRegio && (
        <Collapse
          openText={siteText.regionaal_positief_geteste_personen.open}
          sluitText={siteText.regionaal_positief_geteste_personen.sluit}
          piwikAction={selectedRegio.name}
          piwikName="Positief geteste mensen"
        >
          <h4>{siteText.regionaal_positief_geteste_personen.fold_title}</h4>
          <p>{siteText.regionaal_positief_geteste_personen.fold}</p>
          <h4>{siteText.regionaal_positief_geteste_personen.graph_title}</h4>

          {data?.results_per_region?.values && (
            <LineChart
              values={data.results_per_region.values.map(
                (value: RegionaalValue) => ({
                  value: value.infected_increase_per_region,
                  date: value.date_of_report_unix,
                })
              )}
            />
          )}

          <Metadata
            dataSource={siteText.regionaal_positief_geteste_personen.bron}
          />
        </Collapse>
      )}
    </GraphContainer>
  );
}
