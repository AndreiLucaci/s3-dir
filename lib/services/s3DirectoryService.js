"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3DirectoryService = void 0;
var models_1 = require("../models");
var constants_1 = require("./constants");
var S3DirectoryService = /** @class */ (function () {
    function S3DirectoryService() {
    }
    S3DirectoryService.prototype.processDirectoryStructure = function (objects) {
        try {
            var rootFolder_1 = new models_1.Folder();
            if (!objects || !Array.isArray(objects) || !objects.length)
                return rootFolder_1;
            var process_1 = function (inputPath, obj, parent) {
                if (!inputPath.includes(constants_1.DEFAUL_S3_PATH_SEPARATOR)) {
                    // we have a "file"
                    if (inputPath) {
                        parent.addObject(obj);
                    }
                    return parent;
                }
                // we have a "folder"
                var _a = inputPath.split(constants_1.DEFAUL_S3_PATH_SEPARATOR), name = _a[0], restPath = _a.slice(1);
                var folder = parent.ensureFolder(name);
                return process_1(restPath.join(constants_1.DEFAUL_S3_PATH_SEPARATOR), obj, folder);
            };
            objects.forEach(function (curr) {
                if (!curr.Key)
                    return rootFolder_1;
                return process_1(curr.Key, curr, rootFolder_1);
            });
            return rootFolder_1;
        }
        catch (err) {
            throw err;
        }
    };
    return S3DirectoryService;
}());
exports.S3DirectoryService = S3DirectoryService;
var s3DirectoryService = new S3DirectoryService();
exports.default = s3DirectoryService;
