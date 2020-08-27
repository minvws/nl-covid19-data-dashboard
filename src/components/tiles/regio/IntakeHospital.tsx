import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import LoadingPlaceholder from 'components/loadingPlaceholder';
import { LineChart } from '../index';

import Ziekenhuis from 'assets/ziekenhuis.svg';

import { SafetyRegion, RegioDataLoading } from 'pages/regio/index';

import { Regionaal, RegionaalValue } from 'types/data';

import siteText from 'locale';

interface IProps {
  data: Regionaal;
  selectedRegio: SafetyRegion | undefined;
  contentRef: React.RefObject<HTMLHeadingElement>;
}

export default IntakeHospitalRegio;

function IntakeHospitalRegio(props: IProps) {
  const { selectedRegio, data, contentRef } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <TitleWithIcon
          Icon={Ziekenhuis}
          title={siteText.regionaal_ziekenhuisopnames_per_dag.title}
          headingRef={contentRef}
          regio={selectedRegio?.name}
        />

        <p>{siteText.regionaal_ziekenhuisopnames_per_dag.text}</p>

        {!selectedRegio && <RegioDataLoading />}

        {selectedRegio && (
          <>
            {!data?.results_per_region.last_value && <LoadingPlaceholder />}

            {data?.results_per_region?.last_value && (
              <>
                <BarScale
                  min={0}
                  max={30}
                  value={
                    data.results_per_region.last_value
                      .hospital_moving_avg_per_region
                  }
                  screenReaderText={
                    siteText.regionaal_ziekenhuisopnames_per_dag
                      .screen_reader_graph_content
                  }
                  id="regio_opnames"
                  rangeKey="hospital_moving_avg_per_region"
                  gradient={[
                    {
                      color: '#3391CC',
                      value: 0,
                    },
                  ]}
                />
                <DateReported
                  datumsText={
                    siteText.regionaal_ziekenhuisopnames_per_dag.datums
                  }
                  dateUnix={
                    data.results_per_region.last_value?.date_of_report_unix
                  }
                />
              </>
            )}
          </>
        )}
      </GraphContent>

      {selectedRegio && (
        <Collapse
          openText={siteText.regionaal_ziekenhuisopnames_per_dag.open}
          sluitText={siteText.regionaal_ziekenhuisopnames_per_dag.sluit}
          piwikName="Ziekenhuisopnames per dag"
          piwikAction={selectedRegio.name}
        >
          <h4>{siteText.regionaal_ziekenhuisopnames_per_dag.fold_title}</h4>
          <p>{siteText.regionaal_ziekenhuisopnames_per_dag.fold}</p>
          <h4>{siteText.regionaal_ziekenhuisopnames_per_dag.graph_title}</h4>
          {data?.results_per_region?.values && (
            <LineChart
              values={data.results_per_region.values.map(
                (value: RegionaalValue) => ({
                  value: value.hospital_moving_avg_per_region,
                  date: value.date_of_report_unix,
                })
              )}
            />
          )}
          <Metadata
            dataSource={siteText.regionaal_ziekenhuisopnames_per_dag.bron}
          />
        </Collapse>
      )}
    </GraphContainer>
  );
}
