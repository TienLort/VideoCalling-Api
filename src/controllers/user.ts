import { NextFunction, Request, Response } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userAccount, username, password } = req.body;
    console.log({ userAccount, username, password });
    const VoximplantApiClient = require("@voximplant/apiclient-nodejs").default;
    // const client = new VoximplantApiClient("../api/src/config/cridentials.json");
    const client = new VoximplantApiClient("/config/cridentials.json");
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
        .then((ev: any) => console.log(ev))
        .catch((err: any) => console.error(err));
    };
  } catch (error) {
    next(error);
  }
  res.status(200).json();
};

export default {
  createUser,
};
