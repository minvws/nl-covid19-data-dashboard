import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import handler from '../[...param]';

const Handler = suite('Timeseries API route');

const fileExists = true;
const fileContent = '';

Handler.before.each(() => {
  sinon.stub(fs, 'existsSync').callsFake((_filePath) => {
    return fileExists;
  });
  sinon.stub(fs, 'readFileSync').callsFake((_path, _options): string => {
    return fileContent;
  });
});

Handler.after.each(() => {
  sinon.restore();
});

Handler(
  'should return 400 Bad Request for undefined root and/or metric',
  () => {
    const req = { query: {} } as NextApiRequest;
    const res = new MockResponse();
    handler(req, res as unknown as NextApiResponse);
    assert.is(res.lastStatusCode, 400);
  }
);

Handler.run();

class MockResponse {
  lastStatusCode = -1;

  status(statusCode: number) {
    this.lastStatusCode = statusCode;
    return this;
  }

  end() {
    return this;
  }
}
