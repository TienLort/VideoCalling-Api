"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAccount, username, password } = req.body;
        console.log({ userAccount, username, password });
        const VoximplantApiClient = require("@voximplant/apiclient-nodejs").default;
        const client = new VoximplantApiClient("../api/src/config/cridentials.json");
        // if (!userName || !userDisplayName || !userPassword) {
        //   const error = new Error("Vui long nhap day du thong tin");
        //   throw error;
        // }
        client.onReady = function () {
            // Add a new user.
            client.Users.addUser({
                userName: username,
                userDisplayName: userAccount,
                userPassword: password,
                applicationId: "10573632",
            })
                .then((ev) => console.log(ev))
                .catch((err) => console.error(err));
        };
    }
    catch (error) {
        next(error);
    }
    res.status(200).json();
});
exports.default = {
    createUser,
};
