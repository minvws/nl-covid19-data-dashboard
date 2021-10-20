import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Group } from '@visx/group';
import Pie from '@visx/shape/lib/shapes/Pie';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

const VACCINATION_STATUS_HOSPITAL = {
  fully_vaccinated: 300,
  partly_vaccinated: 31,
  not_vaccinated: 700,
};

function Chart({ data, config, pieConfig, paddingLeft }) {
  const radius = Math.min(pieConfig.width, pieConfig.height) / 2;

  const totalValue = config.reduce(
    (previousValue, { metricProperty }) => previousValue + data[metricProperty],
    0
  );

  const dataMapped = config.map((i) => {
    return {
      __value:
        data[i.metricProperty] === 0
          ? // Calculcate the percentage that needs to be added to the graph
            totalValue * (pieConfig.minimumPercentageSlice / 100) * 2
          : data[i.metricProperty],
      ...i,
    };
  });

  return (
    <Box
      paddingLeft={paddingLeft}
      display="flex"
      spacingHorizontal={5}
      alignItems="center"
    >
      <svg width={pieConfig.width} height={pieConfig.height}>
        <Group top={pieConfig.width / 2} left={pieConfig.height / 2}>
          <Pie
            data={dataMapped}
            outerRadius={radius}
            innerRadius={radius - pieConfig.donutWidth}
            pieValue={(d) => d.__value}
            padAngle={pieConfig.padAngle}
          >
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const arcPath = pie.path(arc);

                return (
                  <path
                    d={arcPath}
                    fill={arc.data.color}
                    key={`arc-${index}`}
                  />
                );
              });
            }}
          </Pie>
        </Group>
      </svg>

      <Box
        spacing={3}
        as="ol"
        css={css({
          listStyleType: 'none',
        })}
      >
        {dataMapped.map((item, index) => (
          <Box
            as="li"
            key={Math.random + index}
            display="flex"
            alignItems="center"
            spacingHorizontal={2}
          >
            <Box
              width={12}
              height={12}
              backgroundColor={item.color}
              borderRadius="50%"
            />
            <Markdown
              content={replaceVariablesInText(item.label, {
                [item.metricProperty]: data[item.metricProperty],
              })}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function PieChart() {
  return (
    <ChartTile
      title={'Vaccinatiestatus ziekenhuisopnames'}
      // metadata={metadata}
      description={
        'Vaccinatiestatus van **1.369** COVID-19 patienten, opgenomen in het ziekenhuis (incluslief IC) tussen 1 september en 3 oktober 2021.'
      }
    >
      <Chart
        data={VACCINATION_STATUS_HOSPITAL}
        paddingLeft={20}
        pieConfig={{
          width: 200,
          height: 200,
          donutWidth: 35,
          padAngle: 0.03,
          minimumPercentageSlice: 0.5,
        }}
        config={[
          {
            metricProperty: 'fully_vaccinated',
            color: colors.data.secondary,
            label: '**11%** niet gevaccineerd (**{{fully_vaccinated}})**',
          },
          {
            metricProperty: 'partly_vaccinated',
            color: colors.data.cyan,
            label:
              '**12%** gedeeltelijk gevaccineerd (**{{partly_vaccinated}}**)',
          },
          {
            metricProperty: 'not_vaccinated',
            color: colors.data.yellow,
            label: '**13%** volledig gevaccineerd (**{{not_vaccinated}}**)',
          },
        ]}
      />
    </ChartTile>
  );
}
