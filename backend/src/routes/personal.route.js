import { Router } from "express";
import { getPersonals } from "../controllers/personal.controller.js";
const personalRoute = Router();

personalRoute.get("/personals", getPersonals);

export default personalRoute;
