"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const APP = (0, express_1.default)();
APP.get('*', (request, response) => {
    response.sendFile(path_1.default.join(__dirname, 'www', request.path));
});
APP.listen(80);
