"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./src/config");
const routes_1 = require("./src/routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api", (0, routes_1.routers)());
app.use((error, req, res, next) => {
    res.status(500).send({
        message: error.message,
    });
});
app.listen(config_1.config.port, () => {
    console.log(`Example app listening on port ${config_1.config.port}`);
});
