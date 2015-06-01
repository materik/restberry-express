var _ = require('underscore');
var bodyParser = require('body-parser');
var errors = require('restberry-errors');
var express = require('express');
var modules = require('restberry-modules');


function RestberryExpress(req, res) {
    this.setReqAndRes(req, res);
    this.express = express;
    this.app = null;
};

RestberryExpress.prototype.__proto__ = modules.waf.prototype;

RestberryExpress.prototype.delete = function() {
    var app = this.app;
    app.delete.apply(app, arguments);
};

RestberryExpress.prototype.get = function() {
    var app = this.app;
    app.get.apply(app, arguments);
};

RestberryExpress.prototype.listen = function(port, next) {
    this.app.listen(port, next);
};

RestberryExpress.prototype.post = function() {
    var app = this.app;
    app.post.apply(app, arguments);
};

RestberryExpress.prototype.put = function() {
    var app = this.app;
    app.put.apply(app, arguments);
};

RestberryExpress.prototype.res = function(code, data) {
    if (!this._res._headerSent) {
        this._res.status(code).json(data);
    }
};

RestberryExpress.prototype.use = function(next) {
    var self = this;
    var app = express();
    app.use(bodyParser.json());
    self.app = app;
    if (next)  next(self);
    return self;
};

module.exports = exports = new RestberryExpress;
