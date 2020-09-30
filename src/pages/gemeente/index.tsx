import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { NextRouter, useRouter } from 'next/router';

import getLastGeneratedData from '~/static-props/last-generated-data';

import text from '~/locale/index';
import styles from '~/components/chloropleth/chloropleth.module.scss';

import { ReactNode } from 'react';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { MunicipalityProperties } from '~/components/chloropleth/shared';
import { useMediaQuery } from '~/utils/useMediaQuery';

const tooltipContent = (router: NextRouter) => {
  return (context: MunicipalityProperties): ReactNode => {
    const onSelectMunicipal = (event: any) => {
      event.stopPropagation();
      router.push(
        '/gemeente/[code]/positief-geteste-mensen',
        `/gemeente/${context.gemcode}/positief-geteste-mensen`
      );
    };

    return (
      context && (
        <div className={styles.clickableTooltip} onClick={onSelectMunicipal}>
          <strong>{context.gemnaam}</strong>
        </div>
      )
    );
  };
};

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (municipality).
// All other pages which use `getMunicipalityLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.
const Municipality: FCWithLayout<any> = () => {
  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const onSelectMunicipal = (context: MunicipalityProperties) => {
    router.push(
      '/gemeente/[code]/positief-geteste-mensen',
      `/gemeente/${context.gemcode}/positief-geteste-mensen`
    );
  };

  const mapHeight = isLargeScreen ? '800px' : '400px';

  return (
    <article className="map-article">
      <div>
        <h2>{text.gemeente_index.selecteer_titel}</h2>
        <p>{text.gemeente_index.selecteer_toelichting}</p>
      </div>
      <div>
        <MunicipalityChloropleth
          tooltipContent={tooltipContent(router)}
          style={{ height: mapHeight }}
          onSelect={onSelectMunicipal}
          isSelectorMap={true}
        />
      </div>
    </article>
  );
};

Municipality.getLayout = getMunicipalityLayout();
export const getStaticProps = getLastGeneratedData();

export default Municipality;
