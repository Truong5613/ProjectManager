import jwt,{ SignOptions } from "jsonwebtoken";
import { UserDocument } from "../models/user.model"
import { config } from "../config/app.config";


export type ACcessTpayload = {
    userId: UserDocument["_id"];
};

type SignOptsAndSecret = SignOptions & {
    secret: string;
};

const defaults : SignOptions = {
    audience: ["user"],
};



export const accessTokenSignOptions : SignOptsAndSecret = {
    secret: config.JWT_SECRET,
    expiresIn: "1d",
};

export const signJwtToken = (
    payload: ACcessTpayload,
    options?: SignOptsAndSecret
) => {
    const { secret, ...opts} = options || accessTokenSignOptions
    return jwt.sign(payload, secret ,{
        ...defaults,
        ...opts,
    });
}; 