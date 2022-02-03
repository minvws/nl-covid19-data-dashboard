import { suite } from 'uvu';
import { loadJsonFromDataFile } from '../load-json-from-data-file';
import * as sinon from 'sinon';
import * as assert from 'uvu/assert';
import * as fs from 'fs';
import * as path from 'path';

const LoadJsonFromDataFile = suite('loadJsonFromDataFile');

LoadJsonFromDataFile.before.each((context) => {});

LoadJsonFromDataFile('Should return data from read file', (context) => {
  context.existsSync = sinon.stub(path, 'join').returns('foo.txt');
  context.existsSync = sinon.stub(fs, 'readFileSync').returns('{ foo: "bar" }');

  assert.equal(loadJsonFromDataFile('foo'), 'asdsad');
  sinon.assert.calledWith(context.existsSync, 'bla');
});

LoadJsonFromDataFile.run();
