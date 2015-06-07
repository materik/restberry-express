Restberry-Express
=================

[![](https://img.shields.io/npm/v/restberry-express.svg)](https://www.npmjs.com/package/restberry-express) [![](https://img.shields.io/npm/dm/restberry-express.svg)](https://www.npmjs.com/package/restberry-express)

Express wrapper for Restberry.

## Install

```
npm install restberry-express
```

## Usage

```
var restberryExpress = require('restberry-express');

restberry
    .use('express', function(waf) {
        var app = waf.app;
        var express = waf.express;
    });
```
