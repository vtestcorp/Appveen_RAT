const log4js = require('log4js'); const request = require('request-promise'); const faker = require('faker');const fs = require('fs'); const path = require('path');if (!fs.existsSync('data')) fs.mkdirSync('data'); function getDateTime() {var sd = new Date();var syear = sd.getFullYear();var smonth = ('0' + (sd.getMonth() + 1)).slice(-2);var sdate = ('0' + sd.getDate()).slice(-2);var shours = ('0' + sd.getHours()).slice(-2);var sminutes = ('0' + sd.getMinutes()).slice(-2);var sseconds = ('0' + sd.getSeconds()).slice(-2);var startDate = syear + '-' + smonth + '-' + sdate;var startTime = shours + '-' + sminutes + '-' + sseconds;return startDate + '_' + startTime;}; function waitForInAPI(_option, _key, _value, _till){if(_till > (new Date())){return request(_option).then(_d => {if (JSON.parse(_d)[_key] == _value) return true;else {return new Promise(_resolve => {setTimeout(()=> _resolve(waitForInAPI(_option, _key, _value, _till)),500);});}}, _e => {return false});} else return false;}; function checkInList(_list, _values) {let flag = false;_list.forEach(_e => {let innerFlag = true;for (_k in _values) {innerFlag = innerFlag && (_e[_k] == _values[_k]);};if (innerFlag) flag = true;});return flag;}; log4js.configure({ appenders: { file: { type: 'file', filename: 'Log_'+getDateTime()+'_00-00-Users-NS-Create.json.log' } }, categories: { default: { appenders: ['file'], level: 'info' } }});const logger = log4js.getLogger('[00-00-Users-NS-Create.json]');const dataFile = path.join('.', 'data', "00-00-Users-NS-Create.json");logger.info('dataFile :: ' + dataFile);let dataPipe = {init: (_dataFile) => fs.writeFileSync(dataFile, '{}'),save: (_key, _data) => {data = JSON.parse(fs.readFileSync(dataFile).toString());data[_key] = _data;fs.writeFileSync(dataFile, JSON.stringify(data));},read: _dataFile => {let f = path.join('.', 'data', _dataFile);logger.info('Reading data from ' + f);return JSON.parse(fs.readFileSync(f).toString());}};dataPipe.init();var expect = require('chai').expect;var assert = require('chai').assert;var url1 = process.env.URL1 ? process.env.URL1 : 'https://bifrost.ds.appveen.com/api';describe('00::Create users for NS', function () {var loginResponse='';it('Login', function (done) {logger.info('Title: Login');var _payload = {"username":"test_appadmin@appveen.com","password":"123123123"};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/login");logger.info("Request HEADERS :: " + JSON.stringify({}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/login","headers": {},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);loginResponse = res.body;dataPipe.save("loginResponse",res.body);logger.info('Login :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Login :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create user test_ns_all_blocked@appveen.com', function (done) {logger.info('Title: Create user test_ns_all_blocked@appveen.com');var _payload = {"user":{"username":"test_ns_all_blocked@appveen.com","password":"123123123","cpassword":"123123123","isSuperAdmin":false,"basicDetails":{"name":"test_ns_all_blocked@appveen.com"},"roles":null}};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/usr/app/TEST-API/create");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/usr/app/TEST-API/create","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);logger.info('Create user test_ns_all_blocked@appveen.com :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create user test_ns_all_blocked@appveen.com :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create user test_ns_basic_view@appveen.com', function (done) {logger.info('Title: Create user test_ns_basic_view@appveen.com');var _payload = {"user":{"username":"test_ns_basic_view@appveen.com","password":"123123123","cpassword":"123123123","isSuperAdmin":false,"basicDetails":{"name":"test_ns_basic_view@appveen.com"},"roles":null}};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/usr/app/TEST-API/create");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/usr/app/TEST-API/create","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);logger.info('Create user test_ns_basic_view@appveen.com :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create user test_ns_basic_view@appveen.com :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create user test_ns_basic_manage@appveen.com', function (done) {logger.info('Title: Create user test_ns_basic_manage@appveen.com');var _payload = {"user":{"username":"test_ns_basic_manage@appveen.com","password":"123123123","cpassword":"123123123","isSuperAdmin":false,"basicDetails":{"name":"test_ns_basic_manage@appveen.com"},"roles":null}};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/usr/app/TEST-API/create");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/usr/app/TEST-API/create","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);logger.info('Create user test_ns_basic_manage@appveen.com :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create user test_ns_basic_manage@appveen.com :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create user test_ns_design_view@appveen.com', function (done) {logger.info('Title: Create user test_ns_design_view@appveen.com');var _payload = {"user":{"username":"test_ns_design_view@appveen.com","password":"123123123","cpassword":"123123123","isSuperAdmin":false,"basicDetails":{"name":"test_ns_design_view@appveen.com"},"roles":null}};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/usr/app/TEST-API/create");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/usr/app/TEST-API/create","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);logger.info('Create user test_ns_design_view@appveen.com :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create user test_ns_design_view@appveen.com :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});it('Create user test_ns_design_manage@appveen.com', function (done) {logger.info('Title: Create user test_ns_design_manage@appveen.com');var _payload = {"user":{"username":"test_ns_design_manage@appveen.com","password":"123123123","cpassword":"123123123","isSuperAdmin":false,"basicDetails":{"name":"test_ns_design_manage@appveen.com"},"roles":null}};logger.info("Request METHOD :: POST");logger.info("Request URL :: " + url1 + "/a/rbac/usr/app/TEST-API/create");logger.info("Request HEADERS :: " + JSON.stringify({"Authorization":"JWT " + loginResponse.token + ""}));logger.info("Request BODY :: " + JSON.stringify(_payload));request({"method": "POST","url": url1 + "/a/rbac/usr/app/TEST-API/create","headers": {"Authorization":"JWT " + loginResponse.token + ""},"body": _payload,"json": true,"resolveWithFullResponse": true}).then(res => {logger.info('Response STATUS :: ' + res.statusCode);logger.info('Response HEADER :: ' + JSON.stringify(res.headers));logger.info('Response BODY :: ' + JSON.stringify(res.body));try{expect(res.statusCode, JSON.stringify(res.body)).to.equal(200);logger.info('Create user test_ns_design_manage@appveen.com :: PASS'); done();}catch (_err){logger.error(_err.message);logger.info('Create user test_ns_design_manage@appveen.com :: FAIL');assert.fail(_err.actual, _err.expected, _err.message);done();};}).catch(_err => {logger.info('ERROR Response STATUS :: ' + _err.statusCode);logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));logger.error(_err.message);assert.fail(0,1, _err.message);done();});});});