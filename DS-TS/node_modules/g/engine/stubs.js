const os = require("os");
const fs = require("fs");
const path = require("path");
const cli = require("../utils/cli");

var e = {};
var _tc = "";
var delimiters = ["{{", "}}"];

e.initTestSuite = function(_suitName, _url) {
    _tc = "";
    _tc += "var expect = require('chai').expect;var assert = require('chai').assert;";
    _url.forEach((_url, _i) => {
        _tc += "var url" + (_i + 1) + " = process.env.URL1 ? process.env.URL1 : '" + _url + "';";
    });
    _tc += "describe('" + _suitName + "', function () {";
};

e.endTestSuite = function() {
    _tc += "});";
};

e.addGlobalVariable = function(_a) {
    _tc += "var " + _a + "='';";
};

let functions = [];
function funcReplacer(match, id) {
  return functions[id];
};

function jsonReplacer(key, val) {
    if (typeof val === 'function') {
  	    functions.push(val.toString());
        return "{func_" + (functions.length - 1) + "}";
    }
    return val;
};

e.addModules = function(_a) {
	functions = [];
    _tc += `var ${_a} = ${JSON.stringify(require(path.join(process.cwd(), "modules", _a)), jsonReplacer).replace(/"\{func_(\d+)\}"/g, funcReplacer)};`
};

e.addEdpoints = function(_a) {
    _tc += "var urls = " + _a + ";";
};

function whatIsThis(_d) {
    if (Object.prototype.toString.call(_d) == "[object Object]") return 1;
    if (Object.prototype.toString.call(_d) == "[object Array]") return 2;
    if (Object.prototype.toString.call(_d) == "[object String]") return 3;
    if (Object.prototype.toString.call(_d) == "[object Number]") return 4;
    if (Object.prototype.toString.call(_d) == "[object Boolean]") return 5;
    return 0;
}

function generateAssertionsForArray(_p, _d) {
    _tc += "expect(" + _p + ").to.be.an('array');";
    if (_d.length) {
        _d.forEach((_e, _i) => {
            let path = _p + "[" + _i + "]"
            switch (whatIsThis(_e)) {
                case 1:
                    generateAssertionsForJson(path, _e);
                    break;
                case 2:
                    generateAssertionsForArray(path, _e);
                    break;
                case 3:
                    if (_e.indexOf(delimiters[0]) > -1) {
                        _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + render(_e) + ");";
                    } else {
                        _tc += "expect(" + path + ", '" + path + "').to.be.a('string');";
                        _tc += "expect(" + path + ", '" + path + "').to.be.equal('" + _e + "');";
                    }
                    break;
                case 4:
                    _tc += "expect(" + path + ", '" + path + "').to.be.a('number');";
                    _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + _e + ");";
                    break;
                case 5:
                    _tc += "expect(" + path + ", '" + path + "').to.all.satisfy(bool => typeof bool === 'boolean');"
                    _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + _e + ");";
                    break;
                default:
                    if (_p != "res.body") _tc += "expect(" + path + ", '" + path + "').to.exist;";
                    break;
            }
        });
    }
};

function generateAssertionsForJson(_p, _d) {
    for (_k in _d) {
        let path = `${_p}["${_k}"]`;
        switch (whatIsThis(_d[_k])) {
            case 1:
                generateAssertionsForJson(path, _d[_k]);
                break;
            case 2:
                generateAssertionsForArray(path, _d[_k]);
                break;
            case 3:
                if (_d[_k].indexOf(delimiters[0]) > -1) {
                    _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + render(_d[_k]) + ");";
                } else {
                    _tc += "expect(" + path + ", '" + path + "').to.be.a('string');";
                    _tc += "expect(" + path + ", '" + path + "').to.be.equal('" + _d[_k] + "');";
                }
                break;
            case 4:
                _tc += "expect(" + path + ", '" + path + "').to.be.a('number');";
                _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + _d[_k] + ");";
                break;
            case 5:
                _tc += "expect(" + path + ", '" + path + "').to.all.satisfy(bool => typeof bool === 'boolean');"
                _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + _d[_k] + ");";
                break;
            default:
                _tc += "expect(" + path + ", '" + path + "').to.exist;";
                break;
        }
    }
};

function generateAssertions(_d, _locationOfResponse) {
    let path = `res.${_locationOfResponse}`
    if (whatIsThis(_d) == 1) generateAssertionsForJson(path, _d);
    if (whatIsThis(_d) == 2) generateAssertionsForArray(path, _d);
    if (whatIsThis(_d) == 3) {
        if (_d.indexOf(delimiters[0]) > -1) {
            _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + render(_d) + ");";
        } else {
            _tc += "expect(" + path + ", '" + path + "').to.be.a('string');";
            _tc += "expect(" + path + ", '" + path + "').to.be.equal('" + _d + "');";
        }
    }
    if (whatIsThis(_d) == 4) {
        _tc += "expect(" + path + ", '" + path + "').to.be.a('number');";
        _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + _d + ");";
    }
    if (whatIsThis(_d) == 5) {
        _tc += "expect(" + path + ", '" + path + "').to.all.satisfy(bool => typeof bool === 'boolean');"
        _tc += "expect(" + path + ", '" + path + "').to.be.equal(" + _d + ");";
    }
}

function parseData(_d) {
    var re1 = new RegExp(delimiters[0], "g");
    var re2 = new RegExp(delimiters[1], "g");
    return _d.replace(re1, "\" + ").replace(re2, " + \"");
}

function render(_s) {
    if (_s.indexOf(delimiters[0]) > -1) {
        var d = "";
        _s = _s.split(delimiters[0]);
        _s.forEach(_s1 => {
            if (_s1.indexOf(delimiters[1]) > -1) {
                _s1 = _s1.split(delimiters[1]);
                d += ((d.length > 0) ? " + " : "") + _s1[0];
                if (_s1[1].length > 0) d += ' + "' + _s1[1] + '"';
            } else if (_s1.length > 0) d += '"' + _s1 + '"';
        });
        return d;
    } else return '"' + _s + '"';
}

function urlSubstitute(_url) {
    let url = _url.split(delimiters[1]).shift().split(delimiters[0]);
    if (url.length == 1) return "\"" + _url + "\"";
    return "\"" + url[0] + "\" + " + url[1];
}

e.test = function(tcFile, tc) {
    var name = tc.name;
    if (tc.continueOnError) name += " [Continue on error]";
    if (tc.wait) name += " [Timeout of " + tc.wait + "s]";
    delimiters = tc.delimiters ? tc.delimiters : ["{{", "}}"];
    var response = tc.response;
    var request = tc.request;
    var endpoint = tc.endpoint;
    var expectedResponseHeaders = response && response.headers ? response.headers : null;
    _tc += "it('" + name + "', function (done) {";
    _tc += "logger.info('Title: " + name + "');";
    if (tc.wait) {
        _tc += "this.timeout(" + (tc.wait * 1000 + 500) + ");";
        _tc += "logger.info('Changing default timeout for this testcase to " + (tc.wait) + " seconds');";
    } else if (tc.waitFor) {
        let timeout = 10;
        if (tc.waitFor.timeout) timeout = tc.waitFor.timeout;
        _tc += "this.timeout(" + (timeout * 1000) + ");";
        _tc += "logger.info('Changing default timeout for this testcase to " + (timeout) + " seconds');";
    }

    let headers = {}
    if (request.headers) headers = request.headers;

    let body = false;
    if (request.payload) {
    	body = true;
    	_tc += "var _payload = " + parseData(JSON.stringify(request.payload)) + ";";
    }
    else if (request.payloadFile) {
    	body = true;
    	_tc += "var _payload = " + parseData(cli.readFile("lib/" + request.payloadFile)) + ";";
    }

    _tc += `logger.info("Request METHOD :: ${request.method}");`
    _tc += `logger.info("Request URL :: " + url${tc.endpoint} + "${parseData(request.url)}");`
    _tc += `logger.info("Request HEADERS :: " + JSON.stringify(${parseData(JSON.stringify(headers))}));`
    
    let qs = null;
    if(request.qs){
    	qs = request.qs
    	for(let k in qs){
    		if(whatIsThis(qs[k]) == 1 ) qs[k] = JSON.stringify(qs[k])
    		if(whatIsThis(qs[k]) == 2 ) qs[k] = qs[k].join(",")
    	}
    }

    if(body) _tc += `logger.info("Request BODY :: " + JSON.stringify(_payload));`

    _tc += `request({`
    _tc += `"method": "${request.method}",`
    _tc += `"url": url${tc.endpoint} + "${parseData(request.url)}",`
    _tc += `"headers": ${parseData(JSON.stringify(headers))},`
    if(body) _tc += `"body": _payload,`
    if(qs) _tc += `"qs": ${parseData(JSON.stringify(qs))},`
    _tc += `"json": true,`
    _tc += `"resolveWithFullResponse": true`
    _tc +=`})`

    let locationOfResponse = "body"
    if(request.responseCode < 400) _tc +=`.then(res => {`
    else {
    	locationOfResponse = "error"
    	_tc +=`.then(res => {}, res => {`
  	}
    _tc += "logger.info('Response STATUS :: ' + res.statusCode);";
    _tc += "logger.info('Response HEADER :: ' + JSON.stringify(res.headers));";
    _tc += `logger.info('Response BODY :: ' + JSON.stringify(res.${locationOfResponse}));`;
    _tc += `try{`
    _tc += `expect(res.statusCode, JSON.stringify(res.${locationOfResponse})).to.equal(${request.responseCode});`
    if (request.saveResponse) {
        _tc += `${request.saveResponse} = res.${locationOfResponse};`;
        _tc += `dataPipe.save("${request.saveResponse}",res.${locationOfResponse});`
    }
    if (expectedResponseHeaders) {
        for (var _header in expectedResponseHeaders)
            if (expectedResponseHeaders[_header]) _tc += "expect(res.headers['" + _header.toLowerCase() + "']).to.equal(" + render(expectedResponseHeaders[_header]) + ");";
            else _tc += "expect(res.headers." + _header.toLowerCase() + ").to.be.not.empty;";
    }
    if (response && (response.body || response.bodyFile)) {
        var expectedResponse = "";
        if (response.body) expectedResponse = response.body;
        else if (response.bodyFile) expectedResponse = JSON.parse(cli.readFile("lib/" + response.bodyFile));
        _tc += "expect(res.body).to.be.not.null;";
        generateAssertions(expectedResponse, locationOfResponse);
        if (response.list) _tc += `let check = checkInList(res.${locationOfResponse}, ${JSON.stringify(response.list)});expect(check, "Check data in list failed!").to.be.equal(true);`
    }
    if (tc.wait) _tc += "setTimeout(() => {logger.info('" + name + " :: PASS'); done();}, " + (tc.wait * 1000) + ");";
    // wait or waitFor
    else if (tc.waitFor) {
        let timeout = 10;
        if (tc.waitFor.timeout) timeout = tc.waitFor.timeout;
        _tc += "var d = new Date();d.setSeconds(d.getSeconds() + " + timeout + ");"
        _tc += "waitForInAPI({";
        _tc += "'method': 'GET',"
        let otherOptions = [];
        otherOptions.push("'uri': url" + tc.waitFor.request.endpoint + "+" + urlSubstitute(tc.waitFor.request.uri));
        if (tc.waitFor.request.qs) otherOptions.push("'qs': " + JSON.stringify(tc.waitFor.request.qs));
        if (tc.waitFor.request.headers) {
            let header = "'headers':{"
            let headers = [];
            for (var k in tc.waitFor.request.headers) {
                let val = request.headers[k];
                if (val.indexOf(delimiters[0]) > -1) val = render(val);
                else val = "\"" + val + "\"";
                headers.push("'" + k + "':" + val + ",");
            }
            header += headers.join(",");
            header += "}";
            otherOptions.push(header);
        }
        _tc += otherOptions.join(",");
        _tc += "},'" + tc.waitFor.key + "',";
        _tc += "'" + tc.waitFor.value + "',d";
        _tc += ").then(() => {logger.info('" + name + " :: PASS'); done();}, ()=> assert.equal(1,0,'waitForInAPI :: FAIL!'));"
    } else _tc += "logger.info('" + name + " :: PASS'); done();";
    _tc += "}catch (_err){logger.error(_err.message);";
    _tc += "logger.info('" + name + " :: FAIL');";
    if (!tc.continueOnError) _tc += "assert.fail(_err.actual, _err.expected, _err.message);";
    _tc += "done();};})";// END THEN()
    _tc += ".catch(_err => {";
    _tc += "logger.info('ERROR Response STATUS :: ' + _err.statusCode);";
		_tc += "logger.info('ERROR Response HEADERS :: ' + JSON.stringify(_err.headers));";
		_tc += "logger.info('ERROR Response BODY :: ' + JSON.stringify(_err.body));";
    _tc += "logger.error(_err.message);";
    if (!tc.continueOnError) _tc += "assert.fail(0,1, _err.message);";
    _tc += "done();});});";
};

e.generate = function(_f, _stopOnError) {
    let suffix = _f.split(".")[0] + ".js";
    let opt = path.join(process.cwd(), "generatedTests", suffix);
    var opf = "generatedTests/" + suffix;
    let tc = "const log4js = require('log4js'); const request = require('request-promise'); const faker = require('faker');";
    tc += "const fs = require('fs'); const path = require('path');"
    tc += "if (!fs.existsSync('data')) fs.mkdirSync('data'); "
    tc += "function getDateTime() {var sd = new Date();var syear = sd.getFullYear();var smonth = ('0' + (sd.getMonth() + 1)).slice(-2);var sdate = ('0' + sd.getDate()).slice(-2);var shours = ('0' + sd.getHours()).slice(-2);var sminutes = ('0' + sd.getMinutes()).slice(-2);var sseconds = ('0' + sd.getSeconds()).slice(-2);var startDate = syear + '-' + smonth + '-' + sdate;var startTime = shours + '-' + sminutes + '-' + sseconds;return startDate + '_' + startTime;}; function waitForInAPI(_option, _key, _value, _till){if(_till > (new Date())){return request(_option).then(_d => {if (JSON.parse(_d)[_key] == _value) return true;else {return new Promise(_resolve => {setTimeout(()=> _resolve(waitForInAPI(_option, _key, _value, _till)),500);});}}, _e => {return false});} else return false;}; function checkInList(_list, _values) {let flag = false;_list.forEach(_e => {let innerFlag = true;for (_k in _values) {innerFlag = innerFlag && (_e[_k] == _values[_k]);};if (innerFlag) flag = true;});return flag;}; log4js.configure({ appenders: { file: { type: 'file', filename: 'Log_'+getDateTime()+'_" + _f + ".log' } }, categories: { default: { appenders: ['file'], level: 'info' } }});const logger = log4js.getLogger('[" + _f + "]');";
    tc += `const dataFile = path.join('.', 'data', "${_f}");logger.info('dataFile :: ' + dataFile);`
    tc += "let dataPipe = {init: (_dataFile) => fs.writeFileSync(dataFile, '{}'),save: (_key, _data) => {data = JSON.parse(fs.readFileSync(dataFile).toString());data[_key] = _data;fs.writeFileSync(dataFile, JSON.stringify(data));},read: _dataFile => {let f = path.join('.', 'data', _dataFile);logger.info('Reading data from ' + f);return JSON.parse(fs.readFileSync(f).toString());}};"
    tc += `dataPipe.init();` + _tc
    fs.writeFileSync(opf, tc);
    return opf;
};

module.exports = e;