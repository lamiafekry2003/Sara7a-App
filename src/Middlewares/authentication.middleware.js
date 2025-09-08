import { userModel } from "../DB/Models/user.models.js";
import { getSignature, verifyToken } from "../Utils/token/token.utils.js";
import * as dbService from "../DB/dbService.js";
import { tokenModel } from "../DB/Models/token.model.js";

export const tokenTypesEnum = {
  access: "access",
  refresh: "refresh",
};
const decodedToken = async ({
  authorization,
  tokenType = tokenTypesEnum.access,
  next,
}) => {
  const [bearer, token] = authorization.split(" ") || [];
  if (!bearer || !token)
    return next(new Error("invaild token", { cause: 400 }));

  // verify to add word(Admin or User) instead of bearer
  let signature = await getSignature({
    signatureLevel: bearer,
  });

  // decode token
  const decode = verifyToken({
    token,
    signature:
      tokenType === tokenTypesEnum.access
        ? signature.accessSignature
        : signature.refreshSignature,
  });
  if(decode.jti && await dbService.findOne({
    model:tokenModel,
    filter:{jti:decode.jti},

  }))
  return next(new Error('token Revoked',{cause:401}))
  // console.log(decode);

  const user = await dbService.findById({
    model: userModel,
    id: { _id: decode._id },
  });
  if (!user) return next(new Error("user not found", { cause: 404 }));

  // console.log(user.changeCredentialsTime?.getTime(),decode.iat*1000);
  if (user.changeCredentialsTime?.getTime() > decode.iat * 1000)
    return next(new Error('Token Expired',{cause:401}))
  return {user,decode}
};

export const authentication = ({tokenType = tokenTypesEnum.access})=>{
    return async (req,res,next)=>{
      const{user,decode} = await decodedToken({
        authorization :req.headers.authorization,
        tokenType,
        next
      })
      req.user = user
      req.decode = decode 
      req.file = req.file || null;
      return next();
    }
}
// authorization
export const authorization = ({accessRoles = []})=>{
  return async(req,res,next)=>{
    if(!accessRoles.includes(req.user.role))
      return next(new Error('unauthorized',{cause:403}))
    return next()
  }
}