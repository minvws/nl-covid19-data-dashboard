import { useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

import MaxWidth from 'components/maxWidth';
import LastUpdated from 'components/lastUpdated';
import Warning from 'assets/warn.svg';
import { getLayout, FCWithLayout } from 'components/layout';
import ScreenReaderOnly from 'components/screenReaderOnly';
import SelectMunicipality from 'components/selectMunicipality';
import IntakeHospital from 'components/tiles/regio/IntakeHospital';
import PostivelyTestedPeople from 'components/tiles/regio/PositivelyTestedPeople';
import SewerWater from 'components/tiles/regio/SewerWater';

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

import { Regionaal } from 'types/data';
const MapChart = dynamic(() => import('components/mapChart'));

export type SafetyRegion = {
  id: number;
  code: string;
  name: string;
};

export type MunicipalityMapping = {
  name: string;
  safetyRegion: string;
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

export async function getStaticProps(): Promise<RegioStaticProps> {
  const municipalityMapping = require('../../data/gemeente_veiligheidsregio.json');
  const safetyRegions: SafetyRegion[] = require('../../data/index').default;

  // group municipalities by safety region
  const map: MunicipalityMapping[] = Object.entries(municipalityMapping).map(
    (entry: [string, any]): MunicipalityMapping => {
      // value is safety region ID, key is municipality name
      const [municipality, safetyRegion] = entry;
      return { name: municipality, safetyRegion };
    }
  );

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

export function RegioDataLoading() {
  return (
    <span className={styles['safety-region-data-loading']}>
      <Warning />
      {siteText.geen_selectie.text}
    </span>
  );
}

const Regio: FCWithLayout<RegioProps> = (props) => {
  const { municipalities, safetyRegions } = props;

  const router = useRouter();

  const selectedRegio = useMemo(() => {
    const selectedRegioCode = router.query?.regio;
    return selectedRegioCode
      ? safetyRegions.find((el) => el.code === selectedRegioCode)
      : undefined;
  }, [router.query?.regio, safetyRegions]);

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

  const setSelectedRegio = (safetyRegionCode: SafetyRegion['code']): void => {
    router.replace(
      {
        pathname: router.pathname,
        query: safetyRegionCode ? { regio: safetyRegionCode } : {},
      },
      undefined,
      { shallow: true }
    );
  };

  const response = useSWR(() =>
    selectedRegio?.code ? `/json/${selectedRegio.code}.json` : null
  );
  const data: Regionaal = response.data;

  useEffect(focusFirstHeading, [data]);

  return (
    <>
      <MaxWidth>
        <LastUpdated
          lastUpdated={+data?.last_generated * 1000}
          loadingText={selectedRegio ? null : '\u00A0'}
        />
        <div className={styles['regio-grid']}>
          <div className={styles['map-column']} ref={selectRegioWrapperRef}>
            <SelectMunicipality
              municipalities={municipalities}
              safetyRegions={safetyRegions}
              setSelectedSafetyRegion={setSelectedRegio}
            />

            <div className={styles['map-container']}>
              <div className={styles['safety-region-header']}>
                <p>Uw veiligheidsregio</p>
                {selectedRegio && <h2>{selectedRegio.name}</h2>}
                {!selectedRegio && (
                  <span className={styles['select-safety-region']}>
                    Selecteer een veiligheidsregio of gemeente
                  </span>
                )}
              </div>
              <MapChart
                selected={{ id: 'GM0074' }}
                metric="positive_tested_people"
              />
            </div>
          </div>

          <div className={styles['panel-column']}>
            <IntakeHospital
              selectedRegio={selectedRegio}
              data={data}
              contentRef={contentRef}
            />

            <PostivelyTestedPeople selectedRegio={selectedRegio} data={data} />

            <SewerWater selectedRegio={selectedRegio} data={data} />
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

Regio.getLayout = getLayout({
  ...siteText.regionaal_metadata,
  openGraphImage,
  twitterImage,
});

export default Regio;
