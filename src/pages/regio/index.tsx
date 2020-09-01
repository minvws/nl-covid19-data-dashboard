import { useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

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

  const contentRef = useRef(null);
  const selectRegioWrapperRef = useRef(null);

  const setSelectedRegio = (safetyRegionCode: SafetyRegion['code']): void => {
    router.replace('/regio/[region]', `/regio/${safetyRegionCode}`);
  };

  return (
    <>
      <MaxWidth>
        <LastUpdated loadingText={'\u00A0'} />
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
                <span className={styles['select-safety-region']}>
                  Selecteer een veiligheidsregio of gemeente
                </span>
              </div>
              <MapChart selected={{ id: 'GM0074' }} metric="Total_reported" />
            </div>
          </div>

          <div className={styles['panel-column']}>
            <IntakeHospital contentRef={contentRef} />

            <PostivelyTestedPeople />

            <SewerWater />
          </div>
        </div>
        <ScreenReaderOnly>
          <button>{siteText.terug_naar_regio_selectie.text}</button>
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
