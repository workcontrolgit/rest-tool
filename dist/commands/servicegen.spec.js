'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _datafile = require('datafile');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _prjgen = require('./prjgen');

var _servicegen = require('./servicegen');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('servicegen', function () {

    var testDirectory = _path2.default.resolve('./tmp');
    var testProjectName = 'testProject';

    var createContainer = {
        config: _.merge({}, _config2.default, { sourceDir: testDirectory })
    };
    var createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    };

    var addContainer = {
        config: _.merge({}, _config2.default, { sourceDir: _path2.default.resolve(testDirectory, testProjectName) })
    };
    var addCommand = {
        name: 'add',
        args: {
            type: 'OPERATION',
            path: 'newservice',
            uriTemplate: '/newservice',
            name: 'New Service',
            desc: 'Description of new service'
        }
    };

    var addCommandWrongType = {
        name: 'add',
        args: {
            type: 'WRONG_TYPE',
            path: 'newservice',
            uriTemplate: '/newservice',
            name: 'New Service',
            desc: 'Description of new service'
        }
    };

    var addCommandMissingArgs = {
        name: 'add',
        args: {}
    };

    var addBulkContainer = addContainer;
    var addBulkCommand = { name: 'addBulk', args: { services: './src/commands/fixtures/bulkServices.yml' } };

    var destCleanup = function destCleanup(cb) {
        var dest = testDirectory;
        console.log('Remove: ', dest);
        (0, _rimraf2.default)(dest, cb);
    };

    beforeEach(function (done) {
        destCleanup(function () {
            console.log('Create: ', testDirectory);
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    afterEach(function (done) {
        destCleanup(done);
    });

    it('add - with defaults', function (done) {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        (0, _prjgen.create)(createContainer, createCommand.args);

        // rest-tool add --sourceDir ./tmp/testProject/ -p newservice -u /newservice -n "New Service" -d "Description of new service"
        (0, _servicegen.add)(addContainer, addCommand.args);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedAddResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddResult.yml');
        (0, _chai.expect)(results).to.eql(expectedAddResult);
        done();
    });

    it('add - with absolute path', function (done) {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        (0, _prjgen.create)(createContainer, createCommand.args);

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        (0, _servicegen.add)(addContainer, addCommand.args);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedAddResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddResult.yml');
        (0, _chai.expect)(results).to.eql(expectedAddResult);
        done();
    });

    it('add - with wrong type parameter', function (done) {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        (0, _prjgen.create)(createContainer, createCommand.args);

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        (0, _servicegen.add)(addContainer, addCommandWrongType.args);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedAddWrongResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddWrongResult.yml');
        (0, _chai.expect)(results).to.eql(expectedAddWrongResult);
        done();
    });
    it('add - missing parameters', function (done) {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        (0, _prjgen.create)(createContainer, createCommand.args);

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        (0, _servicegen.add)(addContainer, addCommandMissingArgs.args);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedAddWrongResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddWrongResult.yml');
        (0, _chai.expect)(results).to.eql(expectedAddWrongResult);
        done();
    });

    it('addBulk - with defaults', function (done) {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        (0, _prjgen.create)(createContainer, createCommand.args);

        // rest-tool add-bulk --sourceDir ./testProject/ -s ./src/commands/fixtures/bulkServices.yml
        (0, _servicegen.addBulk)(addBulkContainer, addBulkCommand.args);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedAddBulkResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddBulkResult.yml');
        (0, _chai.expect)(results).to.eql(expectedAddBulkResult);
        done();
    });
});