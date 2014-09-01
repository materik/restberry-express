var _ = require('underscore');
var _s = require('underscore.string');
var errors = require('restberry-errors');
var express = require('express');
var RestberryWeb = require('restberry-web');


function RestberryWebExpress() {
    this.express = express;
    this.app = null;
};

RestberryWebExpress.prototype.__proto__ = RestberryWeb.__class__.prototype;

RestberryWebExpress.prototype.listen = function(port, next) {
    this.app.listen(port, next);
};

RestberryWebExpress.prototype.use = function(next) {
    this.app = express();
    if (next)  next(this);
};

module.exports = exports = new RestberryWebExpress;
