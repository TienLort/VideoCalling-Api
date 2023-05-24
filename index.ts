import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { config } from "./src/config";
import mongoose from "mongoose";
import { routers } from "./src/routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routers());

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    message: error.message,
  });
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
