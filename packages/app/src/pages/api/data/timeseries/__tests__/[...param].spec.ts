import fs from 'fs';
import { createMocks } from 'node-mocks-http';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import handler from '../[...param]';

const Handler = suite('Timeseries API route');

Handler.before.each((context) => {
  sinon.stub(fs, 'existsSync').callsFake((_filePath) => {
    return context.fileExists;
  });
  sinon.stub(fs, 'readFileSync').callsFake((_path, _options): string => {
    console.log('_path', _path);
    return JSON.stringify(context.fileContent);
  });
});

Handler.after.each(() => {
  sinon.restore();
});

Handler(
  'should return 400 Bad Request for undefined root and/or metric',
  (context) => {
    context.fileExists = false;
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    handler(req, res);
    assert.is(res._getStatusCode(), 400);
  }
);

Handler("should return 404 Not Found when file doesn't exist", (context) => {
  context.fileExists = false;
  const { req, res } = createMocks({
    method: 'GET',
    query: { param: ['nl', 'testMetric', 'testMetricProperty'] },
  });

  handler(req, res);
  assert.is(res._getStatusCode(), 404);
});

/**
 * Skipping this test because of some runtime errors thrown by ts-node,
 * I have no idea how to solve them. Maybe in a future version of ts-node it'll be solved...
 */
Handler.skip('should return 200 and the correct file contents', (context) => {
  context.fileExists = true;
  context.fileContent = {
    testMetric: {
      values: [],
      last_value: {},
    },
  };
  const { req, res } = createMocks({
    method: 'GET',
    query: { param: ['nl', 'testMetric', 'testMetricProperty'] },
  });

  handler(req, res);
  assert.is(res._getStatusCode(), 200);
  assert.equal(JSON.parse(res._getData()), context.fileContent);
});

/**
 * Skipping this test because of some runtime errors thrown by ts-node,
 * I have no idea how to solve them. Maybe in a future version of ts-node it'll be solved...
 */
Handler.skip('should return 500 if handler logic throws', (context) => {
  context.fileExists = true;
  context.fileContent = undefined;
  const { req, res } = createMocks({
    method: 'GET',
    query: { param: ['nl', 'testMetric', 'testMetricProperty'] },
  });

  handler(req, res);
  assert.is(res._getStatusCode(), 500);
});

Handler.run();
