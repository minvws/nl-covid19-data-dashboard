import { Box } from '~/components/base';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { space } from '~/style/theme';
import { Heading } from '~/components/typography';
import { DynamicChoropleth, Markdown } from '~/components';
import { ErrorBoundary } from '~/components/error-boundary';
import { ArchivedGmCollectionHospitalNiceChoropleth, colors } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { Menu, MenuItemButton } from '~/components/aside/menu';
import { Menu as MenuIcon } from '@corona-dashboard/icons';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils';
import { useIntl } from '~/intl';

interface ChoroplethLayoutProps {
  code: string;
  data: ArchivedGmCollectionHospitalNiceChoropleth[];
  switchIndexPageType: () => void;
}

/**
 * Display the overview of municipalities in an interactive choropleth map
 * @param code
 * @param data
 * @constructor
 */
export function ChoroplethLayout({ code, data, switchIndexPageType }: ChoroplethLayoutProps) {
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  return (
    <>
      {!breakpoints.md && (
        <Box bg="white">
          <GmComboBox selectedGmCode={code} />
        </Box>
      )}

      <Box as="article" padding={space[4]}>
        <Heading level={2} as="h1">
          {commonTexts.gemeente_index.selecteer_titel}
        </Heading>
        <Markdown content={commonTexts.gemeente_index.selecteer_toelichting} />

        <Box display="flex" flex="1" justifyContent="center" height="75vh" width="100%" maxHeight="960px" flexDirection="column" spacing={3}>
          <ErrorBoundary>
            <DynamicChoropleth
              accessibility={{
                key: 'municipality_navigation_map',
                features: ['keyboard_choropleth'],
              }}
              map="gm"
              data={data}
              minHeight={0}
              dataConfig={{
                metricName: 'gemeente' as any,
                metricProperty: 'admissions_on_date_of_admission',
                areaStroke: colors.white,
                areaStrokeWidth: 1,
                hoverFill: colors.white,
                hoverStrokeWidth: 3,
                noDataFillColor: colors.gray2,
              }}
              dataOptions={{
                getLink: reverseRouter.gm.index,
              }}
              formatTooltip={(context) => <TooltipContent title={context.featureName} link={reverseRouter.gm.index(context.dataItem.gmcode)} />}
            />
          </ErrorBoundary>
        </Box>
      </Box>

      {!breakpoints.md && (
        <Menu spacing={2}>
          <MenuItemButton title={commonTexts.gemeente_index.lijstweergave_button_title} icon={<MenuIcon />} action={switchIndexPageType} />
        </Menu>
      )}
    </>
  );
}
