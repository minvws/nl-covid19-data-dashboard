import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { useRouter } from 'next/router';

import getLastGeneratedData from '~/static-props/last-generated-data';

import text from '~/locale/index';

import { ReactNode } from 'react';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { MunicipalityProperties } from '~/components/chloropleth/shared';
import {
  createSelectMunicipalHandler,
  MunicipalitySelectionHandler,
} from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { useMediaQuery } from '~/utils/useMediaQuery';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';

const tooltipContent = (selectedHandler: MunicipalitySelectionHandler) => {
  return (context: MunicipalityProperties): ReactNode => {
    const onSelectMunicipal = (event: any) => {
      event.stopPropagation();
      selectedHandler(context);
    };

    return (
      context && (
        <TooltipContent
          title={context.gemnaam}
          onSelect={onSelectMunicipal}
        ></TooltipContent>
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
    const pageName = isLargeScreen ? '/positief-geteste-mensen' : '';
    router.push(
      `/gemeente/[code]${pageName}`,
      `/gemeente/${context.gemcode}${pageName}`
    );
  };

  return (
    <article className="map-article">
      <div>
        <h2>{text.gemeente_index.selecteer_titel}</h2>
        <p>{text.gemeente_index.selecteer_toelichting}</p>
      </div>
      <div className="map-container">
        <MunicipalityChloropleth
          tooltipContent={tooltipContent(onSelectMunicipal)}
          onSelect={createSelectMunicipalHandler(
            router,
            'positief-geteste-mensen'
          )}
          isSelectorMap={true}
        />
      </div>
    </article>
  );
};

Municipality.getLayout = getMunicipalityLayout();
export const getStaticProps = getLastGeneratedData();

export default Municipality;
