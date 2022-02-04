import { suite } from 'uvu';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { loadJsonFromDataFile } from '../load-json-from-data-file';
import sinon from 'sinon';
import assert from 'uvu/assert';

const LoadJsonFromDataFile = suite('loadJsonFromDataFile');

LoadJsonFromDataFile('Should return data from read file', (context) => {
  sinon.stub(path, 'join').returns('foo.txt');
  const readFileSyncStub = sinon
    .stub(fs, 'readFileSync')
    .returns('{"foo": "bar"}');

  assert.equal(loadJsonFromDataFile('foo'), { foo: 'bar' });
  sinon.assert.calledWith(readFileSyncStub, 'foo.txt', 'utf8');
});

LoadJsonFromDataFile('Should throw an error when file not found', () => {
  sinon.stub(fs, 'readFileSync').throws(Error);
  assert.throws(() => loadJsonFromDataFile('foo'), Error);
});

LoadJsonFromDataFile(
  'Should return an empty array when dontFailOnNotFound is true',
  () => {
    sinon.stub(fs, 'readFileSync').throws(Error);
    assert.equal(loadJsonFromDataFile('foo', 'json', true), {});
  }
);

LoadJsonFromDataFile('Should construct the correct filepath ', () => {
  const pathStub = sinon.stub(path, 'join');
  sinon.stub(process, 'cwd').returns('baz');

  loadJsonFromDataFile('foo', 'json', true);
  sinon.assert.calledWith(pathStub, 'baz', 'public', 'json', 'foo');
});

LoadJsonFromDataFile.after.each(() => {
  sinon.restore();
});

LoadJsonFromDataFile.run();
