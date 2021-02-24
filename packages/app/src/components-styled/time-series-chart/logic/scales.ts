// import { scaleLinear, scaleTime } from 'd3-scale';
// import { useMemo } from 'react';
// import { ChartBounds } from '~/components-styled/line-chart/components';

/**
 * Create scales and datum=>coordinate-mappers (getX, getY)
 */
// export function useSewerChartScales<T>(values: T[], bounds: ChartBounds) {
//   return useMemo(() => {
//     const valuesX = values.map((x) => x.dateMs);
//     const valuesY = values.map((x) => x.value);

//     const xScale = scaleTime<number>({
//       domain: [Math.min(...valuesX), Math.max(...valuesX)],
//     }).range([0, bounds.width]);

//     const yScale = scaleLinear<number>({
//       domain: [Math.min(...valuesY), Math.max(...valuesY)],
//       nice: true,
//     }).range([bounds.height, 0]);

//     const getX = (x: T) => xScale(x.dateMs);
//     const getY = (x: T) => yScale(x.value);

//     return { xScale, yScale, getX, getY };
//   }, [values, bounds.width, bounds.height]);
// }
