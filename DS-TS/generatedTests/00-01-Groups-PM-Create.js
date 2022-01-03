const log4js = require('log4js'); const request = require('request-promise'); const faker = require('faker');const fs = require('fs'); const path = require('path');if (!fs.existsSync('data')) fs.mkdirSync('data'); function getDateTime() {var sd = new Date();var syear = sd.getFullYear();var smonth = ('0' + (sd.getMonth() + 1)).slice(-2);var sdate = ('0' + sd.getDate()).slice(-2);var shours = ('0' + sd.getHours()).slice(-2);var sminutes = ('0' + sd.getMinutes()).slice(-2);var sseconds = ('0' + sd.getSeconds()).slice(-2);var startDate = syear + '-' + smonth + '-' + sdate;var startTime = shours + '-' + sminutes + '-' + sseconds;return startDate + '_' + startTime;}; function waitForInAPI(_option, _key, _value, _till){if(_till > (new Date())){return request(_option).then(_d => {if (JSON.parse(_d)[_key] == _value) return true;else {return new Promise(_resolve => {setTimeout(()=> _resolve(waitForInAPI(_option, _key, _value, _till)),500);});}}, _e => {return false});} else return false;}; function checkInList(_list, _values) {let flag = false;_list.forEach(_e => {let innerFlag = true;for (_k in _values) {innerFlag = innerFlag && (_e[_k] == _values[_k]);};if (innerFlag) flag = true;});return flag;}; log4js.configure({ appenders: { file: { type: 'file', filename: 'Log_'+getDateTime()+'_00-01-Groups-PM-Create.json.log' } }, categories: { default: { appenders: ['file'], level: 'info' } }});const logger = log4js.getLogger('[00-01-Groups-PM-Create.json]');const dataFile = path.join('.', 'data', "00-01-Groups-PM-Create.json");logger.info('dataFile :: ' + dataFile);let dataPipe = {init: (_dataFile) => fs.writeFileSync(dataFile, '{}'),save: (_key, _data) => {data = JSON.parse(fs.readFileSync(dataFile).toString());data[_key] = _data;fs.writeFileSync(dataFile, JSON.stringify(data));},read: _dataFile => {let f = path.join('.', 'data', _dataFile);logger.info('Reading data from ' + f);return JSON.parse(fs.readFileSync(f).toString());}};dataPipe.init();var expect = require('chai').expect;var assert = require('chai').assert;var url1 = process.env.URL1 ? process.env.URL1 : 'https://bifrost.ds.appveen.com/api';describe('00::Groups for PM users', function () {var loginResponse='';var pm_all_blocked='';var pm_basic_view='';var pm_basic_manage='';var pm_flow_view='';var pm_flow_manage='';var pm_profile_view='';var pm_profile_manage='';var pm_headers_view='';var pm_headers_manage='';var pm_management_manage='';it('Login', function (done) {logger.info('Title: Login');var _payload = {"username":"test_appadmin@appveen.com","password":"123123123"};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/login");logger.info("Request HEADERS :: " + JSON.stringify({}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/login","headers": {},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);loginResponse = res.body;dataPipe.save("loginResponse",res.body);expect(res.body).to.be.not.null;expect(res.body["token"], 'res.body["token"]').to.exist;logger.info('Login :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Login :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM All Blocked', function (done) {logger.info('Title: Create Group: PM All Blocked');var _payload = {"name":"PM All Blocked","app":"TEST-API","users":["test_pm_all_blocked@appveen.com"]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_all_blocked = res.body;dataPipe.save("pm_all_blocked",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM All Blocked');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM All Blocked :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM All Blocked :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Basic View', function (done) {logger.info('Title: Create Group: PM Basic View');var _payload = {"name":"PM Basic View","app":"TEST-API","users":["test_pm_basic_view@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_basic_view = res.body;dataPipe.save("pm_basic_view",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Basic View');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Basic View :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Basic View :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Basic Manage', function (done) {logger.info('Title: Create Group: PM Basic Manage');var _payload = {"name":"PM Basic Manage","app":"TEST-API","users":["test_pm_basic_manage@appveen.com"],"roles":[{"id":"PMPBC","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPBU","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPBD","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_basic_manage = res.body;dataPipe.save("pm_basic_manage",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Basic Manage');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Basic Manage :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Basic Manage :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Flow View', function (done) {logger.info('Title: Create Group: PM Flow View');var _payload = {"name":"PM Flow View","app":"TEST-API","users":["test_pm_flow_view@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PVPFMB","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_flow_view = res.body;dataPipe.save("pm_flow_view",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Flow View');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Flow View :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Flow View :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Flow Manage', function (done) {logger.info('Title: Create Group: PM Flow Manage');var _payload = {"name":"PM Flow Manage","app":"TEST-API","users":["test_pm_flow_manage@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPFMBC","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPFMBU","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPFMBD","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPFPD","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPFPS","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_flow_manage = res.body;dataPipe.save("pm_flow_manage",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Flow Manage');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Flow Manage :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Flow Manage :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Profile View', function (done) {logger.info('Title: Create Group: PM Profile View');var _payload = {"name":"PM Profile View","app":"TEST-API","users":["test_pm_profile_view@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PVPP","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_profile_view = res.body;dataPipe.save("pm_profile_view",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Profile View');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Profile View :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Profile View :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Profile Manage', function (done) {logger.info('Title: Create Group: PM Profile Manage');var _payload = {"name":"PM Profile Manage","app":"TEST-API","users":["test_pm_profile_manage@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPPC","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPPD","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_profile_manage = res.body;dataPipe.save("pm_profile_manage",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Profile Manage');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Profile Manage :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Profile Manage :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Headers View', function (done) {logger.info('Title: Create Group: PM Headers View');var _payload = {"name":"PM Headers View","app":"TEST-API","users":["test_pm_headers_view@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PVPH","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_headers_view = res.body;dataPipe.save("pm_headers_view",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Headers View');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Headers View :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Headers View :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Headers Manage', function (done) {logger.info('Title: Create Group: PM Headers Manage');var _payload = {"name":"PM Headers Manage","app":"TEST-API","users":["test_pm_headers_manage@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPH","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_headers_manage = res.body;dataPipe.save("pm_headers_manage",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Headers Manage');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Headers Manage :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Headers Manage :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create Group: PM Management Manage', function (done) {logger.info('Title: Create Group: PM Management Manage');var _payload = {"name":"PM Management Manage","app":"TEST-API","users":["test_pm_management_manage@appveen.com"],"roles":[{"id":"PVPB","app":"TEST-API","entity":"PM","type":"author"},{"id":"PMPM","app":"TEST-API","entity":"PM","type":"author"}]};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/group");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/group","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);pm_management_manage = res.body;dataPipe.save("pm_management_manage",res.body);expect(res.body).to.be.not.null;expect(res.body["name"], 'res.body["name"]').to.be.a('string');expect(res.body["name"], 'res.body["name"]').to.be.equal('PM Management Manage');expect(res.body["app"], 'res.body["app"]').to.be.a('string');expect(res.body["app"], 'res.body["app"]').to.be.equal('TEST-API');logger.info('Create Group: PM Management Manage :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create Group: PM Management Manage :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});});