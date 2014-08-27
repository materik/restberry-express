var _ = require('underscore');
var _s = require('underscore.string');
var errors = require('restberry-errors');
var express = require('express');
var httpStatus = require('http-status');
var logger = require('restberry-logger');


var DEFAULT_LIMIT = 10;
var DEFAULT_OFFSET = 0;
var DEFAULT_SORT = {timestampCreated: -1};
var ERROR_TYPE = 'ERROR';
var SORT_REVERSE = '-';
var QS_VALUE_SPLIT = ',';

function Express() {
    this.app = null;
};

Express.prototype.use = function(restberry, next) {
    var self = this;
    self.app = express();
    restberry.connections.web = self;
    next(this.app);
};

Express.prototype.listen = function(port, next) {
    this.app.listen(port, next);
};

// TODO(materik):
// * make this method look nicer
Express.prototype.getHrefs = function(req, res, href, total) {
    var min = 0;
    var limit = parseInt(req.limit);
    var offset = parseInt(req.offset);
    var lastOffset = limit;
    while (lastOffset < total) {
        lastOffset += limit;
    };
    lastOffset -= limit;
    var nextOffset = offset + limit;
    var prevOffset = offset - limit;
    var current = href + '?offset=' + offset + '&limit=' + limit;
    var next = null;
    var prev = null;
    var first = href + '?offset=' + min + '&limit=' + limit;
    var last = href + '?offset=' + lastOffset + '&limit=' + limit;
    if (first == last) {
        first = null;
        last = null;
    } else {
        if (nextOffset < total) {
            next = href + '?offset=' + nextOffset + '&limit=' + limit;
        };
        if (prevOffset >= min) {
            prev = href + '?offset=' + prevOffset + '&limit=' + limit;
        };
    };
    if (!next)  last = null;
    if (!prev)  first = null;
    return {
        hrefs: {
            current: current,
            first: first,
            last: last,
            next: next,
            prev: prev,
        },
        offset: offset,
        limit: limit,
    };
};

Express.prototype.handleRes = function(json, req, res, next) {
    var code = res.statusCode;
    if (!json || !_.isObject(json)) {
        errors.throwServerIssue(req, res, json);
    } else if (json.type == ERROR_TYPE) {
        errors.throwBadRequest(req, res, json);
    } else {
        var data = (code == httpStatus.NO_CONTENT ? null : json);
        res.json(code, data);
        logger.res(res, data);
    };
};

Express.prototype.handleReq = function(req, res, next) {
    logger.req(req);
    //  if (auth && !req.user) {
    //      errors.throwUnauthenticated(req, res, {});
    //  } else {
        _extractQueryStrings(req);
        res.status(httpStatus.OK);
        next();
    //  };
};

var _extractQueryStrings = function(req) {
    req.expand = _extractExpand(req);
    req.fields = _extractFields(req);
    req.limit = _extractLimit(req);
    req.offset = _extractOffset(req);
    req.sort = _extractSort(req);
};

var _extractExpand = function(req) {
    var query = req.query;
    return (query.expand ? query.expand.split(QS_VALUE_SPLIT) : []);
};

var _extractFields = function(req) {
    var query = req.query;
    return (query.fields ? query.fields.split(QS_VALUE_SPLIT) : []);
};

var _extractLimit = function(req) {
    var query = req.query;
    return (query.limit ? query.limit : DEFAULT_LIMIT);
};

var _extractOffset = function(req) {
    var query = req.query;
    return (query.offset ? query.offset : DEFAULT_OFFSET);
};

var _extractSort = function(req) {
    var query = req.query;
    var sort = DEFAULT_SORT;
    if (query.sort) {
        sort = {};
        var sorts = query.sort.split(QS_VALUE_SPLIT);
        for (i in sorts) {
            var reqSort = sorts[i];
            if (_s.startsWith(reqSort, SORT_REVERSE)) {
                reqSort = _s.splice(reqSort, 0, 1);
                sort[reqSort] = -1;
            } else {
                sort[reqSort] = 1;
            };
        };
    };
    return sort;
};

var restberryExpress = module.exports = exports = new Express;
