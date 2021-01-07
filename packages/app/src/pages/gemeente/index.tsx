import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Heading, Text } from '~/components-styled/typography';
import { MunicipalityNavigationMap } from '~/components/choropleth/municipality-navigation-map';
import {
  createSelectMunicipalHandler,
  MunicipalitySelectionHandler,
} from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { MunicipalityProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { SEOHead } from '~/components/seoHead';
import text from '~/locale/index';
import getLastGeneratedData from '~/static-props/last-generated-data';
import { useBreakpoints } from '~/utils/useBreakpoints';

const tooltipContent = (selectedHandler: MunicipalitySelectionHandler) => {
  return (context: MunicipalityProperties): ReactNode => {
    const onSelectMunicipal = (event: any) => {
      event.stopPropagation();
      selectedHandler(context);
    };

    return (
      <TooltipContent title={context.gemnaam} onSelect={onSelectMunicipal} />
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
  const breakpoints = useBreakpoints();

  const goToMunicipal = createSelectMunicipalHandler(
    router,
    'positief-geteste-mensen',
    !breakpoints.md
  );

  return (
    <>
      <SEOHead
        title={text.gemeente_index.metadata.title}
        description={text.gemeente_index.metadata.description}
      />

      {!breakpoints.md && (
        <Box bg="white">
          <SafetyRegionComboBox />
        </Box>
      )}

      <Box as="article" p={4}>
        <Heading level={3} as="h1">
          {text.gemeente_index.selecteer_titel}
        </Heading>
        <Text>{text.gemeente_index.selecteer_toelichting}</Text>

        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          height="120vw"
          maxWidth={750}
          maxHeight={960}
          margin="0 auto"
        >
          <MunicipalityNavigationMap
            tooltipContent={tooltipContent(goToMunicipal)}
            onSelect={goToMunicipal}
          />
        </Box>
      </Box>
    </>
  );
};

Municipality.getLayout = getMunicipalityLayout();
export const getStaticProps = getLastGeneratedData();

export default Municipality;
