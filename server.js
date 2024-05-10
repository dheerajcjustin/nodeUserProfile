import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
const server = express();
import cookieParser from "cookie-parser";

import mongooseConnect from "./config/mongooseConnect.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || "5000";

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cors({ credentials: true, origin: "*" }));
server.use(cookieParser());

server.use(morgan("dev"));

server.get("/", (req, res) => {
      res.json("hai wow good");
});

server.use(notFound);
server.use(errorHandler);

mongooseConnect();

server.listen(process.env.port, () => {
      console.log(
            "server run ayye !!!! at http://localhost:" + process.env.port + "/"
      );
});
