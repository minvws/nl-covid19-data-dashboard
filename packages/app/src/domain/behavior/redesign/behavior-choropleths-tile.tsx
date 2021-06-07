import {
  ChoroplethThresholdsValue,
  RegionsBehavior,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { ChoroplethLegenda } from '~/components/choropleth-legenda';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { BehaviorTooltip } from '~/components/choropleth/tooltips/region/behavior-tooltip';
import { Select } from '~/components/select';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { BehaviorIdentifier, behaviorIdentifiers } from '../behavior-types';
import { BehaviorIcon } from '../components/behavior-icon';

interface BehaviorChoroplethsTileProps {
  title: string;
  description: string;
  data: RegionsBehavior[];
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
  const firstRegionData = data[0];

  // Find all the keys that doesn't exist on VR level but does on NL
  const keysWithoutData = behaviorIdentifiers.filter(
    (item) => !Object.keys(firstRegionData).find((a) => a.includes(item))
  );

  /**
   * Since e.g. the curfew has no data anymore and returns null that's also needs to be filtered out
   * First we check if there are some keys and values that contain null
   * Second we slice everything before the underscore since only the id name is important and not _support or _compliance
   * Lastly we remove all the duplicates in the array and add it to all the keys without data
   */
  const idsThatContainNull = Object.keys(firstRegionData)
    .filter((key) => firstRegionData[key as keyof RegionsBehavior] === null) // check if a value has null
    .map((item) => item.slice(0, item.indexOf('_'))) // Slice everything after the underscore to find the behaviorIdentifier
    .filter((item, pos) => item.indexOf(item) == pos); // Remove duplicate names

  keysWithoutData.push(...(idsThatContainNull as BehaviorIdentifier[]));

  const behaviorIndentifiersData = behaviorIdentifiers.map((id) => {
    const label = siteText.gedrag_onderwerpen[id];
    return {
      label,
      value: id,
    };
  });

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{description}</Text>
      </Box>

      <Box mb={4}>
        <Select
          value={currentId}
          onChange={setCurrentId}
          options={behaviorIndentifiersData}
          icon={<BehaviorIcon name={currentId} size={20} />}
        />
      </Box>

      <Box display="flex" flexWrap="wrap" spacing={{ _: 4, lg: undefined }}>
        <ChoroplethBlock
          title={siteText.nl_gedrag.verdeling_in_nederland.compliance_title}
          data={{ behavior_compliance: data }}
          metricName="compliance"
          currentId={currentId}
          keysWithoutData={keysWithoutData}
          thresholds={regionThresholds.behavior_compliance}
        />

        <ChoroplethBlock
          title={siteText.nl_gedrag.verdeling_in_nederland.support_title}
          data={{ behavior_support: data }}
          metricName="support"
          currentId={currentId}
          keysWithoutData={keysWithoutData}
          thresholds={regionThresholds.behavior_support}
        />
      </Box>
    </Tile>
  );
}

interface ChoroplethBlockProps {
  data: { [key: string]: RegionsBehavior[] };
  keysWithoutData: BehaviorIdentifier[];
  metricName: 'compliance' | 'support';
  currentId: BehaviorIdentifier;
  title: string;
  thresholds: ChoroplethThresholdsValue[];
}

function ChoroplethBlock({
  data,
  keysWithoutData,
  metricName,
  currentId,
  title,
  thresholds,
}: ChoroplethBlockProps) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  return (
    <Box width={{ _: '100%', lg: '50%' }}>
      <Heading level={4} textAlign="center">
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
            <Text textAlign="center" m={0} css={css({ maxWidth: '300px' })}>
              {siteText.nl_gedrag.verdeling_in_nederland.geen_beschikbare_data}
            </Text>
          </Box>
        )}
        <SafetyRegionChoropleth
          data={data as { behavior: RegionsBehavior[] }}
          getLink={reverseRouter.vr.gedrag}
          metricName={`behavior_${metricName}` as 'behavior'}
          metricProperty={`${currentId}_${metricName}`}
          minHeight={400}
          noDataFillColor={colors.page}
          tooltipContent={(
            context: RegionsBehavior & SafetyRegionProperties
          ) => {
            const currentComplianceValue =
              `${currentId}_compliance` as keyof RegionsBehavior;
            const currentSupportValue =
              `${currentId}_support` as keyof RegionsBehavior;

            // Return null when there is no data available to prevent breaking the application when using tab
            if (keysWithoutData.includes(currentId)) return null;

            return (
              <BehaviorTooltip
                context={context}
                currentMetric={currentId}
                currentComplianceValue={
                  context[currentComplianceValue] as number
                }
                currentSupportValue={context[currentSupportValue] as number}
              />
            );
          }}
        />
      </Box>
      <Box
        display="flex"
        justifyContent={{ _: 'center', lg: 'flex-start' }}
        maxWidth={300}
      >
        <ChoroplethLegenda
          thresholds={thresholds}
          title={siteText.gedrag_common.basisregels.header_percentage}
        />
      </Box>
    </Box>
  );
}
