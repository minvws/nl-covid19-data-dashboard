import { FunctionComponent, useMemo, useState } from 'react';
import Select from 'react-select';

import { SafetyRegion, MunicipalityMapping } from 'pages/regio';

type SelectMunicipalityProps = {
  municipalities: MunicipalityMapping[];
  safetyRegions: SafetyRegion[];
  setSelectedSafetyRegion: (code: SafetyRegion['code']) => void;
};

const colourStyles = {
  control: (styles) => ({ ...styles, maxWidth: '25rem' }),
  menu: (styles) => ({ ...styles, maxWidth: '25rem' }),
};

const RegionSelect: FunctionComponent<SelectMunicipalityProps> = (props) => {
  const { municipalities, safetyRegions, setSelectedSafetyRegion } = props;

  const [selectedItem, setSelectedItem] = useState(undefined);

  const safetyRegionsOptions = useMemo(() => {
    const options = [];

    safetyRegions.forEach((element) => {
      const regionMunicipalities = municipalities
        .filter((el) => el.safetyRegion === element.code)
        .map((item) => {
          return {
            label: item.name,
            value: item.name,
            safetyRegion: item.safetyRegion,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      options.push({
        label: element.name,
        options: regionMunicipalities,
      });
    });
    return options;
  }, [municipalities, safetyRegions, selectedItem]);

  return (
    <div>
      <div>
        <Select
          options={safetyRegionsOptions}
          onChange={(val) => {
            setSelectedItem(val);
            setSelectedSafetyRegion(val.safetyRegion);
          }}
          styles={colourStyles}
        />
      </div>
    </div>
  );
};

export default RegionSelect;
