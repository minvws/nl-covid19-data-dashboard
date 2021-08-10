import { KeysOfType, VrCollectionBehavior } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { vrThresholds } from '~/components/choropleth/logic';
import { Choropleth } from '~/components/choropleth2';
import { VrBehaviorTooltip } from '~/components/choropleth2/tooltips/vr/vr-behavior-tooltip';
import { ErrorBoundary } from '~/components/error-boundary';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { SelectBehavior } from './components/select-behavior';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from './logic/behavior-types';

interface BehaviorChoroplethsTileProps {
  title: string;
  description: string;
  data: { behavior: VrCollectionBehavior[] };
  currentId: BehaviorIdentifier;
  setCurrentId: React.Dispatch<React.SetStateAction<BehaviorIdentifier>>;
}

export function BehaviorChoroplethsTile({
  title,
  description,
  data,
  currentId,
  setCurrentId,
}: BehaviorChoroplethsTileProps) {
  const { siteText } = useIntl();
  const firstRegionData = data.behavior[0];

  // Find all the keys that don't exist on VR level but do on NL
  const keysWithoutData = behaviorIdentifiers.filter(
    (item) => !Object.keys(firstRegionData).find((a) => a.includes(item))
  );

  /**
   * Since e.g. the curfew has no data anymore and returns null that also needs to be filtered out
   * First we check if there are some keys that contain a value of null
   * Second we slice everything before the underscore, since only the id name is important and not _support or _compliance
   * Lastly we remove all the duplicates in the array and add it to all the keys without data
   */
  const idsThatContainNull = Object.keys(firstRegionData)
    .filter(
      (key) => firstRegionData[key as keyof VrCollectionBehavior] === null
    )
    .map((item) => item.slice(0, item.indexOf('_')))
    .filter((item, pos) => item.indexOf(item) == pos);

  keysWithoutData.push(...(idsThatContainNull as BehaviorIdentifier[]));

  return (
    <ChartTile title={title} description={description}>
      <Box spacing={4} height="100%">
        <SelectBehavior value={currentId} onChange={setCurrentId} />
        <Box display="flex" flexWrap="wrap" spacing={{ _: 4, md: 0 }}>
          <ChoroplethBlock
            title={siteText.nl_gedrag.verdeling_in_nederland.compliance_title}
            data={data}
            behaviorType="compliance"
            currentId={currentId}
            keysWithoutData={keysWithoutData}
          />

          <ChoroplethBlock
            title={siteText.nl_gedrag.verdeling_in_nederland.support_title}
            data={data}
            behaviorType="support"
            currentId={currentId}
            keysWithoutData={keysWithoutData}
          />
        </Box>
      </Box>
    </ChartTile>
  );
}

interface ChoroplethBlockProps {
  data: { behavior: VrCollectionBehavior[] };
  keysWithoutData: BehaviorIdentifier[];
  behaviorType: 'compliance' | 'support';
  currentId: BehaviorIdentifier;
  title: string;
}

function ChoroplethBlock({
  data,
  keysWithoutData,
  behaviorType,
  currentId,
  title,
}: ChoroplethBlockProps) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();

  const isSmallScreen = breakpoints.sm;
  const metricProperty = `${currentId}_${behaviorType}` as const;

  return (
    <Box width={{ _: '100%', lg: '50%' }} spacing={3}>
      <Heading level={5} as="h4" textAlign="center">
        {title}
      </Heading>

      <Box position="relative">
        {keysWithoutData.includes(currentId) && (
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            top={0}
            width="100%"
            height="100%"
            css={css({ zIndex: 9 })}
          >
            <Text textAlign="center" css={css({ maxWidth: '300px' })}>
              {siteText.nl_gedrag.verdeling_in_nederland.geen_beschikbare_data}
            </Text>
          </Box>
        )}
        <ErrorBoundary>
          <Choropleth
            accessibility={{
              key: 'behavior_choropleths',
            }}
            map="vr"
            data={data.behavior}
            dataConfig={{
              metricProperty: metricProperty as unknown as KeysOfType<
                VrCollectionBehavior,
                number | null | boolean | undefined,
                true
              >,
              noDataFillColor: colors.page,
            }}
            dataOptions={{
              getLink: reverseRouter.vr.gedrag,
            }}
            minHeight={!isSmallScreen ? 350 : 400}
            formatTooltip={(context) => {
              const currentComplianceValue =
                `${currentId}_compliance` as keyof VrCollectionBehavior;
              const currentSupportValue =
                `${currentId}_support` as keyof VrCollectionBehavior;

              // Return null when there is no data available to prevent breaking the application when using tab
              if (keysWithoutData.includes(currentId)) return null;

              return (
                <VrBehaviorTooltip
                  behaviorType={behaviorType}
                  context={context}
                  currentMetric={currentId}
                  currentComplianceValue={
                    context.dataItem[currentComplianceValue] as number
                  }
                  currentSupportValue={
                    context.dataItem[currentSupportValue] as number
                  }
                />
              );
            }}
          />
        </ErrorBoundary>
      </Box>
      <Box
        display="flex"
        justifyContent={{ _: 'center', lg: 'flex-start' }}
        maxWidth={300}
      >
        <ChoroplethLegenda
          thresholds={vrThresholds.behavior[metricProperty]}
          title={siteText.gedrag_common.basisregels.header_percentage}
        />
      </Box>
    </Box>
  );
}
