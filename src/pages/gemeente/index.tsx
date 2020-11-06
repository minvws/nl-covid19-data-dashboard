import { useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import {
  createSelectMunicipalHandler,
  MunicipalitySelectionHandler,
} from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { MunicipalityProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { SEOHead } from '~/components/seoHead';
import getLastGeneratedData from '~/static-props/last-generated-data';
import { useMediaQuery } from '~/utils/useMediaQuery';

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
  const { siteText }: ILocale = useContext(LocaleContext);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const onSelectMunicipal = (context: MunicipalityProperties) => {
    const pageName = isLargeScreen ? '/positief-geteste-mensen' : '';
    router.push(
      `/gemeente/[code]${pageName}`,
      `/gemeente/${context.gemcode}${pageName}`
    );
  };

  return (
    <>
      <SEOHead
        title={siteText.gemeente_index.metadata.title}
        description={siteText.gemeente_index.metadata.description}
      />
      <article className="map-article">
        <div>
          <h2>{siteText.gemeente_index.selecteer_titel}</h2>
          <p>{siteText.gemeente_index.selecteer_toelichting}</p>
        </div>
        <div className="map-container">
          <MunicipalityChoropleth
            tooltipContent={tooltipContent(onSelectMunicipal)}
            onSelect={createSelectMunicipalHandler(
              router,
              'positief-geteste-mensen'
            )}
            isSelectorMap={true}
          />
        </div>
      </article>
    </>
  );
};

Municipality.getLayout = getMunicipalityLayout();
export const getStaticProps = getLastGeneratedData();

export default Municipality;
