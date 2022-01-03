# ReST API Tester - R.A.T #

Writing test cases and automating them are fairly time consuming activities. RAT aims to eliminate the pain of automating REST API test cases.

In itself, RAT is not a new framework. It's a simple code generator that generates [mocha](https://mochajs.org) test cases from a simple JSON file. RAT uses [request](https://github.com/request/request) for API calls and [chai-expect](https://www.chaijs.com/guide/styles/#expect) as the assertion library

> Current version of RAT **ONLY** supports **JSON** request and response vaidations.

# Table of contents

1. [Installation](#Installation)
2. [CLI Options](#CLI-Options)
3. [Setting up](#Setting-up)
    * [Folder structure](#Folder-structure)
4. [Writing test cases](#Writing-test-cases)
    * [Test Suit](#Test-Suit)
    * [Test Case](#Test-Case)
    * [Request object](#Request-object)
    * [Response object](#Response-object)
5. [Smart substituitions](#Smart-substituitions)
    * [Globals](#Globals)
    * [Data-pipes](#Data-pipes)

# Installation
`npm i -g @appveen/rat`

# CLI Options

`rat [options] [file ...]`

The available options are,

* `-i, --init`: Initialize the currect folder as a RAT test case location.
* `--ui`: Start RAT in interactive mode on the CLI. This is the default behavior.
* `-u,--upgrade`: Upgrades the RAT setup in the current folder.
* `-g, --generate [file ...]`: Generates mocha scripts for all the files under the _tests_ folder or for the files specified.
* `-r, --run [file ...]`: Run all the tests under the _generatedTests_ folder or the tests specified.
* `--stopOnError`: Stop at the first failure while running tests
* `--har [file]`:  Generates RAT test case from a HAR file.
* `--clean`: Displays the instructions to clean RAT setup from a folder.
* `--demo`: Starts the demo server. This is primarily used for demoing RAT.
* `-v, --version`: Displays the version of RAT

# Setting up

To set up a folder for running RAT tests, run the following commands from the command line.

`rat -i`

When `rat` is initialized for the first time, a set of sample test cases are provided under the _tests_ folder. 

## Folder structure

Once initialised the following folders are created.

| Name | Description |
|--|--|
| _generatedTests_ | Contains the generated test cases. |
| _lib_ | JSON Files that are referenced by the test cases. |
| _modules_ | Files that define JS methods |
| _tests_ | Testcase JSON files which are used to generate the testcase  under _generatedTests_. |

# Writing test cases

Test cases are bundles as a test suite and each test suite is written as a JSON file. 

## Test Suit

* Each file is treated as a test suite or a collection of tests.

| Option | Type |Desctiprion |
|---|---|---|
| `testName` | String | _Required_. Name of the test case |
| `url` | List | _Required_. A list of URLs that will be used in this test suite |
| `modules` | List | The list of module files from _modules_ directory that is being used in the test cases. |
| `globals` | List | A list of global variables that would be used in the test cases. Global varaibles are used to pass data between test cases. |
| `tests` | Array | Tests is an array of objects. Each object in the array is test case.  |

Sample test casefile,

```json
{
    "testName": "Sample API Tests",
    "url": [ "http://localhost:8080" ],
    "modules": [ "sampleFunction" ],
    "globals": [ "loginResponse", "data" ],
    "tests": []
}
```

## Test Case

| Attribute | Type | Desctiprion |
|---|---|---|
| `endpoint` | Number | _Required_. This denotes the URL in the list of `url` that was defined in the test suite section. The list starts with **1**. Example, if `url` was defined as `url:["http://localhost:8080", "http://localhost:8081"]`, then `endpoint:1` points to the first URL, `http://localhost:8080` |
| `name` | String | Name of the test case. This would appear in the summary. |
| `delimiters` | List | The delimiters that should be used for patten substituitions. The default delimiters are `{{` and `}}`| 
| `wait` | Number | The number of seconds to wait before continuing to the next text. | 
| `continueOnError` | Boolean | Default: `false`. If set to `true`, then the test execution will not stop if this step fails. |
| `request` | Object | _Required_. The request definition. |
| `response` | Object | The response data that would be used to validate the API response. |

Sample test case

```json
{
    "endpoint": "1",
    "name": "Login - Valid",
    "delimiters": ["{{", "}}"],
    "continueOnError": false,
    "wait": 2,
    "request": {},
    "response": {}
}
```

## Request object

| Attribute | Type | Desctiprion |
|---|---|---|
| `method` | String | _Required_. One of the HTTP methods - POST, PUT, GET, DELETE, PATCH |
| `url` | String | _Required_. A uri under test.
| `headers` | JSON | A set of headers that should be sent along with the request.
| `qs` | JSON | A set of query strings that should be set on the URL.
| `responseCode` | Number | The HTTP status code that is expected from the response.
| `payload` | JSON | The JSON payload that should be sent with the request.
| `payloadFile` | String | The name of the JSON file under `lib` folder to be used as payload. 
| `saveResponse` | String | One of the entries from `globals`. This will be used to save the output of the request so that it can used in any of the subsequent test cases. If the value is not in `globals`, then no error is raised, but might cause downstream test cases to fail. |

N.B.
> If the JSON payload is big, then it is a good practice to save the file under `lib` and reference the file in the test.

> If both `payload` and `payloadFile` is provided, then `payload` takes precedence.

e.g.

```json
{
  "method": "GET",
  "url": "/api/a/sm/service",
  "qs": {
    "select": "name domain port",
    "filter": {
      "app": "jerry",
      "name": {
          "$in": ["Test-Relation-Root","Test-Relation-Child" ]
          }
    }
  },
  "headers": {
    "Authorization": "JWT <% loginResponse.token %>"
  },
  "responseCode": 200,
  "saveResponse": "fetchAllEntity"
}
```

## Response object

An optional response object can be defined for a testcase. This response object is used to validate the response from the API. If no response object is provided, then no response validation is done.

| Attribute | Type | Desctiprion |
|---|---|---|
| `headers` | JSON | Response headers to be validated |
| `body` | JSON or Array | Response body will be validated against this. Arrays are order sensitive for comparison. |
| `bodyFile` | String | A file from `lib` that can be used to validate the response body |

e.g.

```json
{
  "body": {
      "message": "Login error!"
  }
}
```

# Smart substituitions

Smart substituitions allows you to specify dynamic payload.

## Globals

The value from a global variable can be used in the test case by enclosing it with in the delimiters.

```json
"headers": {"token": "<% loginResponse.token %>"}
```

The delimiters for the above example are `<%` and `%>`.

## Data-pipes

This allows you to use the output data of a previously run test case in the current test case.

```json
"url": "/data/{{dataPipe['sampleTest01.json'].data._id}}",
```