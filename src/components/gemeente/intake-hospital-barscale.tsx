import { BarScale } from '~/components/barScale';
import { MunicipalHospital } from '~/types/data.d';

import siteText from '~/locale/index';
const text = siteText.gemeente_ziekenhuisopnames_per_dag;

export function IntakeHospitalBarScale(props: {
  data: MunicipalHospital | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.admissions_moving_average}
      id="opnames"
      rangeKey="moving_average_hospital"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
      showAxis={showAxis}
    />
  );
}
