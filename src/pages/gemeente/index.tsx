import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';
import { useRouter } from 'next/router';

import text from 'locale';
import styles from 'components/chloropleth/chloropleth.module.scss';

import { ReactNode } from 'react';
import MunicipalityChloropleth from 'components/chloropleth/MunicipalityChloropleth';
import { MunicipalityProperties } from 'components/chloropleth/shared';

const tooltipContent = (context: MunicipalityProperties): ReactNode => {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.gemnaam}</strong>
      </div>
    )
  );
};

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (municipality).
// All other pages which use `getMunicipalityLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.
const Municipality: FCWithLayout<any> = () => {
  const router = useRouter();

  const onSelectMunicpal = (context: MunicipalityProperties) => {
    router.push(
      '/gemeente/[code]/positief-geteste-mensen',
      `/gemeente/${context.gemcode}/positief-geteste-mensen`
    );
  };

  return (
    <>
      <article className="map-article layout-two-column">
        <div className="column-item-no-margin column-item-small">
          <h2 className="text-max-width">
            {text.gemeente_index.selecteer_titel}
          </h2>
          <p className="text-max-width">
            {text.gemeente_index.selecteer_toelichting}
          </p>
        </div>
        <div className="column-item-no-margin column-item">
          <MunicipalityChloropleth
            tooltipContent={tooltipContent}
            style={{ height: '800px' }}
            onSelect={onSelectMunicpal}
          />
        </div>
      </article>
    </>
  );
};

Municipality.getLayout = getMunicipalityLayout();

export default Municipality;
