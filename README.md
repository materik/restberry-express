Restberry-Express
=================

Express wrapper for Restberry WAF. This package implements the WAF interface of
Restberry-Modules and can be used by Restberry.

## Install

```
npm install restberry-express
```

## Usage

```
var restberryExpress = require('restberry-express');

restberry
    .use(restberryExpress.use(function(waf) {
        var app = waf.app;
        var express = waf.express;
    }));
```
