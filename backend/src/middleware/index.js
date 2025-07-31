import express from "express";
import cors from "cors";
import route from "../routes/index.js";
import morgan from "morgan";

const appMiddleware = express();

// Use morgan for HTTP request logging instead of custom middleware
appMiddleware.use(morgan('dev'));

appMiddleware.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

appMiddleware.options("*", cors());
appMiddleware.use(express.json());
appMiddleware.use(express.urlencoded({ extended: true })); // Add support for URL-encoded data
appMiddleware.use(route);

export default appMiddleware;