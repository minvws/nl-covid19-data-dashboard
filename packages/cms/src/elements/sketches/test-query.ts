import { snakeCase } from 'change-case';
import { omitBy } from 'lodash';
import { isDefined } from 'ts-is-present';
import util from 'util';
import { getClient } from '../../client';

const testQueries = [
  ['nl', 'tested_overall', 'timeSeries'],
  // ['nl', 'sewer', 'timeSeries'],
  // ['nl', 'tested_overall', 'kpi', 'infected'],
  // ['nl', 'tested_overall', 'choropleth', 'infected_per_100k'],
  // ['vr', 'tested_overall', 'timeSeries'],
];

/**
 * This is a sketch to query the test documents
 */
(async function run() {
  const client = getClient();

  for (const [scope, metricName, type, metricProperty] of testQueries) {
    const params = omitBy(
      { type, scope, metricName, metricProperty },
      (x) => !isDefined(x)
    );

    const query = `*[
      !(_id in path("drafts.**"))
      && _type == $type
      && scope == $scope
      && metricName == $metricName
      ${
        params.metricProperty ? '&& metricProperty == $metricProperty]' : ']'
      }[0]`;

    const doc = await client.fetch(query, params);

    util.inspect(doc);
  }
})();
