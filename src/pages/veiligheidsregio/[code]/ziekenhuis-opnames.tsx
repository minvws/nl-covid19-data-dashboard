import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';

import siteText from 'locale';

import { IntakeHospitalMa } from 'types/data';
import { useRouter } from 'next/router';
import regionCodeToMunicipalCodeLookup from 'data/regionCodeToMunicipalCodeLookup';
import MunicipalityMap from 'components/mapChart/MunicipalityMap';

const text: typeof siteText.ziekenhuisopnames_per_dag =
  siteText.ziekenhuisopnames_per_dag;

export function IntakeHospitalBarScale(props: {
  data: IntakeHospitalMa | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      signaalwaarde={40}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.moving_average_hospital}
      id="opnames"
      rangeKey="moving_average_hospital"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 40,
        },
        {
          color: '#f35065',
          value: 90,
        },
      ]}
    />
  );
}

const IntakeHospital: FCWithLayout = () => {
  const router = useRouter();

  const vrcode = router.query.code as string | undefined;

  const municipalCodes = vrcode
    ? regionCodeToMunicipalCodeLookup[vrcode]
    : undefined;

  return (
    <article className="metric-article layout-two-column">
      <div className="column-item column-item-extra-margin">
        <h3>{text.map_titel}</h3>
        <p>{text.map_toelichting}</p>
      </div>

      <div className="column-item column-item-extra-margin">
        <MunicipalityMap
          municipalCodes={municipalCodes}
          metric="hospital_admissions"
          gradient={['#69c253', '#f35065']}
        />
      </div>
    </article>
  );
};

IntakeHospital.getLayout = getSafetyRegionLayout();

export default IntakeHospital;
