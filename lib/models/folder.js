"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
var lodash_1 = __importDefault(require("lodash"));
var Folder = /** @class */ (function () {
    function Folder(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    Folder.prototype.addObject = function (input) {
        if (!this.objects)
            this.objects = [];
        this.objects.push(input);
    };
    Folder.prototype.ensureFolder = function (name) {
        if (!this.folders)
            this.folders = [];
        var existingFolder = this.folders.find(function (x) { return x.name === name; });
        if (!existingFolder) {
            var newFolder = new Folder(name, this.name);
            this.folders.push(newFolder);
            return newFolder;
        }
        return existingFolder;
    };
    Folder.prototype.all = function () {
        var _a, _b;
        return __spreadArrays(((_a = this.objects) !== null && _a !== void 0 ? _a : []), ((_b = this.folders) !== null && _b !== void 0 ? _b : []));
    };
    Folder.prototype.toJson = function () {
        var items = lodash_1.default.omitBy(this, lodash_1.default.isUndefined);
        return JSON.stringify(items, null, 2);
    };
    Folder.prototype.toObject = function () {
        var toObj = function (input) {
            var _a;
            var obj = {
                name: input.name,
                parent: input.parent,
                objects: input.objects,
            };
            (_a = input.folders) === null || _a === void 0 ? void 0 : _a.map(function (x) {
                var result = toObj(x);
                obj[result.name] = result;
            });
            return obj;
        };
        return toObj(this);
    };
    return Folder;
}());
exports.Folder = Folder;
