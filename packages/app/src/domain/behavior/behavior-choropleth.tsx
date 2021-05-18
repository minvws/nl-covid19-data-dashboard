import { Box } from '~/components/base';
import { Tile } from '~/components/tile';
import { Text, Heading } from '~/components/typography';
// import { Select } from '~/components/select';
// import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { RegionsBehavior } from '@corona-dashboard/common';
import { useFormatAndSortBehavior } from '~/domain/behavior/behavior-logic';

interface BehaviorChoroplethProps {
  title: string;
  description: string;
  data: RegionsBehavior[];
}

export function BehaviorChoropleth({
  title,
  description,
  data,
}: BehaviorChoroplethProps) {
  const { sortedCompliance, sortedSupport } = useFormatAndSortBehavior(data[0]);

  console.log(sortedCompliance);

  // const filteredCompliance = data.behavior.map((vrRegion, index) => {
  //   const { sortedCompliance } = test(vrRegion);
  //   return sortedCompliance;
  // });

  // console.log(test);
  // console.log(sortedCompliance, sortedSupport);

  // const { sortedCompliance, sortedSupport } = useFormatAndSortBehavior(
  //   behaviorData[0]
  // );

  // const testmappie = console.log(sortedCompliance, sortedSupport);

  return (
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{description}</Text>
      </Box>
      {/* <Select
        value={currentId}
        onChange={setCurrentId}
        options={behaviorIdentifiers
          .filter((id) =>
            // filter the dropdown to only show behaviors with data
            data.behavior.find((data) => {
              const key = `${id}_${type}` as keyof RegionsBehavior;
              return typeof data[key] === 'number';
            })
          )
          .map((id) => ({
            value: id,
            label: siteText.gedrag_onderwerpen[id],
          }))}
      /> */}
      <Box display="flex" flexWrap="wrap">
        <Box pr={{ lg: 3 }} width={{ _: '100%', lg: '50%' }}>
          <p>Hier komt een mapie</p>
          {/* <SafetyRegionChoropleth /> */}
        </Box>
        <Box pl={{ lg: 3 }} width={{ _: '100%', lg: '50%' }}>
          <p>Hier komt een mapie</p>
        </Box>
      </Box>
    </Tile>
  );
}
