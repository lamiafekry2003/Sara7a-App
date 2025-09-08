import jwt from "jsonwebtoken";
import { roles } from "../../DB/Models/user.models.js";
import { nanoid } from "nanoid";

export const signatureEnum = {
  admin: "Admin",
  user: "User",
};
export const logoutEnum = {
  logoutFromAllDevices: "logoutFromAllDevices",
  logout: "logout",
  stayLogedIn: "stayLogedIn"
};
// generate token
export const signToken = ({
  payload = {},
  signature,
  options = {
    expiresIn: 60 * 60 * 24,
  },
}) => {
  return jwt.sign(payload, signature, options);
};
// verify token
export const verifyToken = ({ token = "", signature }) => {
  return jwt.verify(token, signature);
};

// get signature
export const getSignature = async ({ signatureLevel = signatureEnum.user }) => {
  // verify
  let signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case signatureEnum.admin:
      signature.accessSignature = process.env.ACCESS_ADMIN_SIGNATURE_TOKEN;
      signature.refreshSignature = process.env.REFRESH_ADMIN_SIGNATURE_TOKEN;
      break;
    case signatureEnum.user:
      signature.accessSignature = process.env.ACCESS_USER_SIGNATURE_TOKEN;
      signature.refreshSignature = process.env.REFRESH_USER_SIGNATURE_TOKEN;
      break;
    default:
      break;
  }
  return signature;
};

// to get access token ,refresh,jti token
export const getNewTokenCredentials = async (user) => {
  let signature = await getSignature({
    signatureLevel:
      user.role !== roles.user ? signatureEnum.admin : signatureEnum.user,
  });
  // do token id
  const jwtid = nanoid();
  // do Token
  const accessToken = signToken({
    payload: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    signature: signature.accessSignature,
    options: {
      expiresIn: "1d",
      issuer: "Sara7a App",
      subject: "Authentication",
      jwtid,
    },
  });
  const refreshToken = signToken({
    payload: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    signature: signature.refreshSignature,
    options: {
      issuer: "Sara7a App",
      subject: "Authentication",
      expiresIn: "7d",
      jwtid,
    },
  });
  return { accessToken, refreshToken };
};
