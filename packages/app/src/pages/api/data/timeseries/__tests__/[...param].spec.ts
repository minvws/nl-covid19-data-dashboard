import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
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
    const req = { query: {} } as NextApiRequest;
    const res = new MockResponse();
    handler(req, res as unknown as NextApiResponse);
    assert.is(res.lastStatusCode, 400);
  }
);

Handler("should return 404 Not Found when file doesn't exist", (context) => {
  context.fileExists = false;
  const req = {
    query: { param: ['nl', 'testMetric', 'testMetricProperty'] },
  } as unknown as NextApiRequest;
  const res = new MockResponse();
  handler(req, res as unknown as NextApiResponse);
  assert.is(res.lastStatusCode, 404);
});

Handler('should return 200 and the correct file contents', (context) => {
  context.fileExists = true;
  context.fileContent = {
    testMetric: {
      values: [],
      last_value: {},
    },
  };
  const req = {
    query: { param: ['nl', 'testMetric', 'testMetricProperty'] },
  } as unknown as NextApiRequest;
  const res = new MockResponse();
  handler(req, res as unknown as NextApiResponse);
  assert.is(res.lastStatusCode, 200);
  assert.equal(res.lastJson, context.fileContent);
});

Handler('should return 500 if handler logic throws', (context) => {
  context.fileExists = true;
  context.fileContent = undefined;
  const req = {
    query: { param: ['nl', 'testMetric', 'testMetricProperty'] },
  } as unknown as NextApiRequest;
  const res = new MockResponse();
  handler(req, res as unknown as NextApiResponse);
  assert.is(res.lastStatusCode, 500);
});

Handler.run();

class MockResponse {
  lastStatusCode = -1;
  lastJson = undefined;

  status(statusCode: number) {
    this.lastStatusCode = statusCode;
    return this;
  }

  json(json: any) {
    this.lastJson = json;
    return this;
  }

  end() {
    return this;
  }
}
