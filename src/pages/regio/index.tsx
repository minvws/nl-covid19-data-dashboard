import { useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';
import LastUpdated from 'components/lastUpdated';
import Warning from 'assets/warn.svg';
import { FunctionComponentWithLayout } from 'components/layout';
import ScreenReaderOnly from 'components/screenReaderOnly';
import SelectMunicipality from 'components/selectMunicipality';
import IntakeHospital from 'components/tiles/regio/IntakeHospital';
import PostivelyTestedPeople from 'components/tiles/regio/PositivelyTestedPeople';
import { SewerWater } from 'components/tiles/regio/SewerWater';

const SvgMap = dynamic(() => import('components/mapChart/svgMap'));

import styles from './regio.module.scss';
import openGraphImageNL from 'assets/sharing/og-regionale-cijfers.png?url';
import twitterImageNL from 'assets/sharing/twitter-regionale-cijfers.png?url';
import openGraphImageEN from 'assets/sharing/og-regional.png?url';
import twitterImageEN from 'assets/sharing/twitter-regional.png?url';
import getLocale from 'utils/getLocale';

const locale = getLocale();

const openGraphImage = locale === 'nl' ? openGraphImageNL : openGraphImageEN;
const twitterImage = locale === 'nl' ? twitterImageNL : twitterImageEN;

import siteText from 'locale';

import { Regionaal, RegionaalMunicipality } from 'types/data';
import { IntakeHospitalMunicipality } from 'components/tiles/municipality/IntakeHospital';
import { PostivelyTestedPeopleMunicipality } from 'components/tiles/municipality/PositivelyTestedPeople';
import { SewerWaterMunicipality } from 'components/tiles/municipality/SewerWater';
import MunicipalityMap from 'components/mapChart/municipality';

export type SafetyRegion = {
  id: number;
  code: string;
  name: string;
};

export type MunicipalityMapping = {
  name: string;
  safetyRegion: string;
  gemcode: string;
};

type RegioProps = {
  municipalities: MunicipalityMapping[];
  safetyRegions: SafetyRegion[];
};

type RegioStaticProps = {
  props: {
    municipalities: MunicipalityMapping[];
    safetyRegions: SafetyRegion[];
  };
};

export type RegionType = 'municipality' | 'safetyRegion';

export async function getStaticProps(): Promise<RegioStaticProps> {
  const municipalityMapping = require('../../data/gemeente_veiligheidsregio.json');
  const safetyRegions: SafetyRegion[] = require('../../data/index').default;

  // group municipalities by safety region
  const map: MunicipalityMapping[] = municipalityMapping;

  return {
    props: {
      municipalities: map.sort((a, b) => {
        const safetyRegionA = safetyRegions.find(
          (el) => el.code === a.safetyRegion
        );

        const safetyRegionB = safetyRegions.find(
          (el) => el.code === b.safetyRegion
        );

        return (
          // sort by safety region name OR (if they are the same) sort by name.
          safetyRegionA?.name.localeCompare(safetyRegionB?.name as string) ||
          a.name.localeCompare(b.name)
        );
      }),
      safetyRegions: safetyRegions
        .filter((el) => el.id !== 0)
        .sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}

export const RegioDataLoading: React.FC = () => {
  return (
    <span className={styles['safety-region-data-loading']}>
      <Warning />
      {siteText.geen_selectie.text}
    </span>
  );
};

export const RegioNoData: React.FC = () => {
  return (
    <div className={styles['data-not-available']}>
      <span>
        <Warning aria-hidden />
      </span>
      <p>{siteText.no_data_for_this_municipality.text}</p>
    </div>
  );
};

let regionType: RegionType = 'municipality';
let lastKnownGemcode: string | null = null;

const Regio: FunctionComponentWithLayout<RegioProps> = (props) => {
  const { municipalities, safetyRegions } = props;

  // Toggle region type between municipality and safety region
  const setRegionType = (event: any): void => {
    let query = null;
    regionType = event?.currentTarget?.value;

    // Recover last known municipality in case we switch back from
    // safety region to municipality
    if (lastKnownGemcode) {
      if (regionType === 'municipality') {
        query = { regio: lastKnownGemcode };
      } else {
        const municipalityMatch = municipalities.find(
          (municipality: MunicipalityMapping) =>
            municipality.gemcode === lastKnownGemcode
        );
        // Scale up from municipality level to safety region
        if (municipalityMatch?.safetyRegion) {
          query = { regio: municipalityMatch?.safetyRegion };
        }
      }
    }

    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const selectMunicipalityFromMap = (selectedGemcode: string): void => {
    lastKnownGemcode = selectedGemcode;
    router.replace(
      {
        pathname: router.pathname,
        query: { regio: selectedGemcode },
      },
      undefined,
      { shallow: true }
    );
  };

  const setSelectedMunicipality = (
    selectedRegio: MunicipalityMapping
  ): void => {
    let query = null;
    if (selectedRegio?.gemcode) {
      lastKnownGemcode = selectedRegio.gemcode;
      query = { regio: selectedRegio.gemcode };
    }
    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const router = useRouter();

  // Recover selected regio from URL param
  // can also set the region type to match
  const selectedRegio = useMemo(() => {
    const selectedRegioCode = router.query?.regio;
    if (selectedRegioCode?.indexOf('GM') === 0) {
      regionType = 'municipality';
      return (
        municipalities.find(
          (municipality) => municipality.gemcode === selectedRegioCode
        ) || undefined
      );
    }

    // safety region
    const region = selectedRegioCode
      ? safetyRegions.find((el) => el.code === selectedRegioCode)
      : undefined;

    // reset the last known gemcode when we select a safety region that is outside the municipality
    // keep it if the municipality is inside the safety region
    if (region) {
      regionType = 'safetyRegion';
    }
    if (region && lastKnownGemcode) {
      const lastKnownMunicipality = municipalities.find(
        (municipality) => municipality.gemcode === lastKnownGemcode
      );
      if (
        lastKnownMunicipality &&
        lastKnownMunicipality.safetyRegion !== region.code
      ) {
        lastKnownGemcode = null;
      }
    }
    // return { regionType: 'safetyRegion', selectedRegio: region };
    return region;
  }, [router.query?.regio, safetyRegions, municipalities]);

  const contentRef = useRef(null);
  const selectRegioWrapperRef = useRef(null);

  /**
   * Focuses region select element. Triggered by a screen reader
   * only button at the end of the content.
   */
  const focusRegioSelect = () => {
    if (!selectRegioWrapperRef.current) return;

    const el = selectRegioWrapperRef.current as any;
    const input = el.querySelector('input');
    if (input) input.focus();
  };

  /**
   * Focuses the first heading in the content column,
   * used after region changes to move focus for visually impaired
   * users so they know what has changed.
   */
  const focusFirstHeading = () => {
    const el = contentRef.current as any;
    if (el) el.focus();
  };

  const setSelectedSafetyRegion = (
    selectedRegio: MunicipalityMapping
  ): void => {
    if (selectedRegio?.gemcode) {
      lastKnownGemcode = selectedRegio.gemcode;
    }
    router.replace(
      {
        pathname: router.pathname,
        query: selectedRegio ? { regio: selectedRegio.safetyRegion } : {},
      },
      undefined,
      { shallow: true }
    );
  };

  // Fetch data for municipality or safety region
  const response = useSWR(() => {
    if (!selectedRegio) {
      return null;
    }
    if (regionType === 'municipality') {
      return `/json/${(selectedRegio as MunicipalityMapping).gemcode}.json`;
    }
    return (selectedRegio as SafetyRegion).code
      ? `/json/${(selectedRegio as SafetyRegion).code}.json`
      : null;
  });
  const data: Regionaal | RegionaalMunicipality = response.data;
  const text: typeof siteText.regionaal_index = siteText.regionaal_index;

  useEffect(focusFirstHeading, [data]);

  return (
    <>
      <MaxWidth>
        <div className={styles['regio-grid']}>
          <div className={styles['map-column']} ref={selectRegioWrapperRef}>
            <p className={styles['select-region-legend']}>
              {text.select_region_type_legend}
            </p>
            <div className={styles['select-region-type']}>
              <input
                onChange={setRegionType}
                id="regionType-municipality"
                type="radio"
                name="regionType"
                value="municipality"
                defaultChecked={true}
              />
              <label htmlFor="regionType-municipality">
                {text.label_municipalities}
              </label>{' '}
              <input
                onChange={setRegionType}
                id="regionType-safetyRegion"
                type="radio"
                name="regionType"
                value="safetyRegion"
              />
              <label htmlFor="regionType-safetyRegion">
                {text.label_safety_regions}
              </label>
            </div>
            <p className={styles['select-region-legend']}>
              {text.select_region_municipality_legend}
            </p>
            <SelectMunicipality
              regionType={regionType}
              municipalities={municipalities}
              safetyRegions={safetyRegions}
              setSelectedSafetyRegion={setSelectedSafetyRegion}
              setSelectedMunicipality={setSelectedMunicipality}
            />

            <div className={styles['map-container']}>
              {regionType === 'municipality' && (
                <MunicipalityMap
                  onSelect={selectMunicipalityFromMap}
                  selected={selectedRegio as MunicipalityMapping}
                />
              )}
              {regionType === 'safetyRegion' && (
                <SvgMap
                  safetyRegions={safetyRegions}
                  selected={selectedRegio as SafetyRegion}
                />
              )}
            </div>
          </div>

          <div className={styles['panel-column']}>
            <div className={styles['safety-region-header']}>
              <p>
                {regionType === 'safetyRegion'
                  ? text.your_safety_region
                  : text.your_municipality}
              </p>
              {selectedRegio && <h2>{selectedRegio.name}</h2>}
              {!selectedRegio && (
                <span className={styles['select-safety-region']}>
                  {regionType === 'safetyRegion'
                    ? text.select_safety_region_municipality
                    : text.select_municipality}
                </span>
              )}
            </div>
            <LastUpdated
              lastUpdated={
                selectedRegio && data?.last_generated
                  ? parseInt(data.last_generated, 10) * 1000
                  : 0
              }
              loadingText={selectedRegio ? null : '\u00A0'}
            />
            {regionType === 'safetyRegion' && (
              <>
                <IntakeHospital
                  selectedRegio={selectedRegio as SafetyRegion}
                  data={data as Regionaal}
                  contentRef={contentRef}
                />

                <PostivelyTestedPeople
                  selectedRegio={selectedRegio as SafetyRegion}
                  data={data as Regionaal}
                />

                <SewerWater
                  selectedRegio={selectedRegio as SafetyRegion}
                  data={data as Regionaal}
                />
              </>
            )}

            {regionType === 'municipality' && (
              <>
                <IntakeHospitalMunicipality
                  selectedRegio={selectedRegio as MunicipalityMapping}
                  data={data as RegionaalMunicipality}
                  contentRef={contentRef}
                />

                <PostivelyTestedPeopleMunicipality
                  selectedRegio={selectedRegio as MunicipalityMapping}
                  data={data as RegionaalMunicipality}
                />

                <SewerWaterMunicipality
                  selectedRegio={selectedRegio as MunicipalityMapping}
                  data={data as RegionaalMunicipality}
                />
              </>
            )}
          </div>
        </div>
        <ScreenReaderOnly>
          <button onClick={focusRegioSelect}>
            {siteText.terug_naar_regio_selectie.text}
          </button>
        </ScreenReaderOnly>
      </MaxWidth>
    </>
  );
};

Regio.getLayout = Layout.getLayout({
  ...siteText.regionaal_metadata,
  openGraphImage,
  twitterImage,
});

export default Regio;
