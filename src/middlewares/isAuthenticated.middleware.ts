import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { UnauthorizedException } from "../utils/appError";

const isAuthnticated = (req: Request, res: Response, next: NextFunction) => {
  if(!req.user || !req.user._id) {
    throw new UnauthorizedException("Unauthorized. Please Log in.")
  }
  next();
}
export default isAuthnticated;