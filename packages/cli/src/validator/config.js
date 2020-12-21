"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaDirectory = exports.localeDirectory = exports.jsonDirectory = void 0;
const path_1 = __importDefault(require("path"));
const appBasePath = path_1.default.join(__dirname, '..', // src
'..', // cli
'..', // packages
'app');
exports.jsonDirectory = path_1.default.join(appBasePath, 'public', 'json');
exports.localeDirectory = path_1.default.join(appBasePath, 'src', 'locale');
exports.schemaDirectory = path_1.default.join(appBasePath, 'schema');
