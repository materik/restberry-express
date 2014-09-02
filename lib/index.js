var _ = require('underscore');
var _s = require('underscore.string');
var errors = require('restberry-errors');
var express = require('express');
var modules = require('restberry-modules');


function RestberryExpress(next) {
    this.express = express;
    this.app = null;
    this.use(next);
};

RestberryExpress.prototype.__proto__ = modules.waf.prototype;

RestberryExpress.prototype.listen = function(port, next) {
    this.app.listen(port, next);
};

RestberryExpress.prototype.use = function(next) {
    var self = this;
    self.app = express();
    self.app.use(function(req, res, next) {
        req.apiPath = self.apiPath;
        next();
    });
    if (next)  next(self);
};

module.exports = exports = RestberryExpress;
