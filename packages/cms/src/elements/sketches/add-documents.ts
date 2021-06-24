import { createTimelineEventsMockData } from '@corona-dashboard/app/src/components/time-series-chart/mock-timeline-events';
import { snakeCase } from 'change-case';
import { isDefined } from 'ts-is-present';
import { getClient } from '../../client';

const testDocuments = [
  ['nl', 'tested_overall', 'timeSeries'],
  ['nl', 'sewer', 'timeSeries'],
  ['nl', 'tested_overall', 'kpi', 'infected'],
  ['nl', 'tested_overall', 'choropleth', 'infected_per_100k'],
  ['vr', 'tested_overall', 'timeSeries'],
];

/**
 * This is a sketch to inject some test documents
 */
(async function run() {
  const client = getClient();

  for (const [scope, metricName, _type, metricProperty] of testDocuments) {
    /**
     * By using the various id elements in dot notation we can organize the
     * documents in sanity and make sure to never have more then one document for
     * each chart / data component.
     *
     * Snake-casing the type makes the path identical to the key we could use in
     * lokalize to store texts for that object.
     */
    const _id = [scope, metricName, snakeCase(_type), metricProperty]
      .filter(isDefined)
      .join('.');

    console.log('Injecting', _id);

    switch (_type) {
      case 'timeSeries': {
        const allData = await import(
          `@corona-dashboard/app/public/json/${getJsonFilenameForScope(scope)}`
        );

        console.log('data?', !!allData);

        const metricData = allData[metricName];

        const timelineEvents = createTimelineEventsMockData(
          metricData.values,
          'all',
          new Date()
        );

        console.log('timelineEvents', timelineEvents);

        const document = {
          _id,
          _type,
          scope,
          metricName,
          metricProperty,
          timelineEvents: [],
        };
        await client.createOrReplace(document);
        break;
      }
      default: {
        const document = {
          _id,
          _type,
          scope,
          metricName,
          metricProperty,
        };
        await client.createOrReplace(document);
      }
    }
  }
})();

function getJsonFilenameForScope(scope: string) {
  switch (scope) {
    case 'nl':
      return 'NL.json';
    case 'vr':
      return 'VR09.json';
    case 'gm':
      return 'GM0344.json';
    default:
      throw new Error(`Unknown scope ${scope}`);
  }
}
