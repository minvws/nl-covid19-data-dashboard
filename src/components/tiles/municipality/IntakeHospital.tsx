import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import LoadingPlaceholder from 'components/loadingPlaceholder';
import { LineChart } from '../index';

import Ziekenhuis from 'assets/ziekenhuis.svg';

import { RegioDataLoading, MunicipalityMapping } from 'pages/regio/index';

import { RegionaalMunicipality, HospitalAdmissions } from 'types/data';

import siteText from 'locale';

interface IProps {
  data: RegionaalMunicipality;
  selectedRegio: MunicipalityMapping | undefined;
  contentRef: React.RefObject<HTMLHeadingElement>;
}

export const IntakeHospitalMunicipality: React.FC<IProps> = (props) => {
  const { selectedRegio, data, contentRef } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Ziekenhuis}
          title={
            siteText.regionaal_municipality_ziekenhuisopnames_per_dag.title
          }
          headingRef={contentRef}
          regio={selectedRegio?.name}
        />

        <p>{siteText.regionaal_municipality_ziekenhuisopnames_per_dag.text}</p>

        {!selectedRegio && <RegioDataLoading />}

        {selectedRegio && (
          <>
            {!data?.hospital_admissions?.last_value && <LoadingPlaceholder />}

            {data?.hospital_admissions?.last_value && (
              <>
                <BarScale
                  min={0}
                  max={30}
                  value={
                    data.hospital_admissions.last_value.moving_average_hospital
                  }
                  screenReaderText={
                    siteText.regionaal_municipality_ziekenhuisopnames_per_dag
                      .screen_reader_graph_content
                  }
                  id="regio_opnames"
                  rangeKey="moving_average_hospital"
                  gradient={[
                    {
                      color: '#3391CC',
                      value: 0,
                    },
                  ]}
                />
                <DateReported
                  datumsText={
                    siteText.regionaal_municipality_ziekenhuisopnames_per_dag
                      .datums
                  }
                  dateUnix={
                    data.hospital_admissions.last_value?.date_of_report_unix
                  }
                />
              </>
            )}
          </>
        )}
      </GraphContent>

      {selectedRegio && (
        <Collapse
          openText={
            siteText.regionaal_municipality_ziekenhuisopnames_per_dag.open
          }
          sluitText={
            siteText.regionaal_municipality_ziekenhuisopnames_per_dag.sluit
          }
          piwikName="Ziekenhuisopnames per dag"
          piwikAction={selectedRegio.name}
        >
          <h4>
            {
              siteText.regionaal_municipality_ziekenhuisopnames_per_dag
                .fold_title
            }
          </h4>
          <p>
            {siteText.regionaal_municipality_ziekenhuisopnames_per_dag.fold}
          </p>
          <h4>
            {
              siteText.regionaal_municipality_ziekenhuisopnames_per_dag
                .graph_title
            }
          </h4>
          {data?.hospital_admissions?.values && (
            <LineChart
              values={data.hospital_admissions.values.map(
                (value: HospitalAdmissions) => ({
                  value: value.moving_average_hospital,
                  date: value.date_of_report_unix,
                })
              )}
            />
          )}
          <Metadata
            dataSource={
              siteText.regionaal_municipality_ziekenhuisopnames_per_dag.bron
            }
          />
        </Collapse>
      )}
    </GraphContainer>
  );
};
