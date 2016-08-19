const { assert } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const readDirStub = sinon.stub();

const locator = proxyquire('./locator', {
  fs: { readdirSync: readDirStub }
});

describe(`Config locator`, () => {

  afterEach(() => {
    readDirStub.reset();
  });

  it(`lists the file types that it looks for`, () => {
    let files = locator.files;

    assert.isTrue(files.length === 3);
    assert.deepEqual(files, ['.es-cli', '.es-cli.js', '.es-cli.json']);
  });

  it(`throws if it can't find a candidate`, () => {
    readDirStub.returns([]);

    assert.throws(() => { locator.getConfiguration('dir') }, 'MissingConfigError');
  });

  it(`throws if it can't read a path`, () => {
    readDirStub.returns(['.es-cli']);

    assert.throws(() => { locator.getConfiguration('dir') }, 'UnreadableConfigError');
  });

});
