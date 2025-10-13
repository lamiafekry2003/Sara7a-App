import { create, findOne, updateOne } from "../../DB/dbService.js";
import { providers, roles, userModel } from "../../DB/Models/user.models.js";
import { emailSubject, sendEmail } from "../../Utils/email/sendEmail.utils.js";
import { encrypt } from "../../Utils/encryption/encryption.utils.js";
import { emailEvent } from "../../Utils/events/event.utils.js";
import { compare, hash } from "../../Utils/hashing/hash.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import {
  getNewTokenCredentials,
  getSignature,
  logoutEnum,
  signatureEnum,
  signToken,
} from "../../Utils/token/token.utils.js";
import { OAuth2Client } from "google-auth-library";
import path from 'node:path'
import { customAlphabet} from "nanoid";
import { tokenModel } from "../../DB/Models/token.model.js";


////// signup ///////
export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password,repeat_password, phoneNumber, gender, role } =
    req.body;  
  // check user found or not
  if (await findOne({ model: userModel, filter: { email } }))
    return next(new Error("email aleardy exists", { cause: 409 }));
  // hashing password
  const hashPassword = await hash({ plainText: password });
  // encrypt phone number
  const encryptPhone = await encrypt({ plainText: phoneNumber });
  // create otp first
  const generateOtp = customAlphabet('0123456789', 6);
  const code = generateOtp();
  // hashing otp
  const hashOtp= await hash({plainText:code})
  // send email
  emailEvent.emit('confirmEmail',{to:email,code,firstName})
  // create user in db
  const user = await create({
    model: userModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        phoneNumber: encryptPhone,
        gender,
        role,
        confirmEmailOTp:hashOtp
      },
    ],
  });
  return successResponse({
    res,
    statusCode: 201,
    message: "user created successfully",
    // data: user,
  });
};
export const confirmEmail= async (req,res,next) =>{
  const {email,otp} = req.body
  const user = await findOne({
    model:userModel,
    filter:{
      email,
      confirmEmail:{$exists:false},
      confirmEmailOTp:{$exists:true}
    }
  })
  if(!user)
    return next(new Error('User not found or email ',{cause:404}))
  if(!await compare({plainText:otp , hash:user.confirmEmailOTp}))
     return next(new Error('invaild otp ',{cause:400}))
  // update user some data
  await updateOne({
    model:userModel,
    filter:{email},
    data:{
      confirmEmail:Date.now(),
      $unset:{confirmEmailOTp:true},
      $inc:{__v:1}
    }
  })
  return successResponse({
    res,
    statusCode: 201,
    message: "user confirmed successfully",
  });
}
////// login //////
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // check user found or no
  const user = await findOne({ model: userModel, filter: { email } });
  if (!user)
    return next(new Error("invalid email or password", { cause: 401 }));
  // confirm email
  // if(!user.confirmEmail)
  //   return next(new Error("User inValid please confirm your email ", { cause: 401 }));
  // or another way to from using direct :
  if (!user.confirmEmail) {
    return successResponse({
      res,
      statusCode: 401,
      message: "User is invalid, please confirm your email",
      data: { redirect: true }, 
    });
  }
  // compare password with hashing password
  const isMatch = await compare({ plainText: password, hash: user.password });
  if (!isMatch) return next(new Error("invalid password", { cause: 401 }));
  // know role and crete token 
  const newCredential = await getNewTokenCredentials(user)
  
  // if all success
  return successResponse({
    res,
    statusCode: 200,
    message: "user logged successfully",
    data: { newCredential },
  });
};
/// logout //////
export const logout = async (req,res,next)=>{
  const {flag} = req.body
  if (!req.decode?.jti || !req.decode?.exp || !req.user?._id) {
      return next(new Error("Invalid token data", { cause: 400 }));
  }
  switch (flag){
    case logoutEnum.logoutFromAllDevices:
      // update
      await updateOne({
        model:userModel,
        filter:{_id:req.user._id},
        data:{changeCredentialsTime:Date.now()}
      });
    default:
      // create jti in token model
  await create({
    model:tokenModel,
    data:[{
      jti:req.decode.jti,
      expiresId:Date.now() - req.decode.exp,
      userId:req.user._id
    }]
  }) 
  }
  return successResponse({
    res,
    statusCode: 200,
    message: "user logged out successfully",
  });

}
//////verify account_ gmail //////
async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
//////Login with gmail //////
// export const loginWithGmail = async (req, res, next) => {
//   // req.body token
//   const { idToken } = req.body;
//   const { email, email_verified, given_name, family_name, picture } =
//     await verifyGoogleAccount({ idToken });
  
//   // know role
//   let signature = await getSignature({
//     signatureLevel:
//       user.role !== roles?.user ? signatureEnum.admin : signatureEnum.user,
//   });
//   // email_verifed
//   if (!email_verified)
//     return next(new Error("email not verified", { cause: 401 }));

//   const user = await findOne({
//     model: userModel,
//     filter: { email },
//   });

//   if (user) {
//     if (user.provider === providers.google) {
//       // do Token
//       const newCredential = await getNewTokenCredentials(user)
  
//       // if all success
//       return successResponse({
//         res,
//         statusCode: 200,
//         message: "user logged in successfully",
//         data: { newCredential },
//       });
//     }
//   }
//   const newUser = await create({
//     model: userModel,
//     data: [
//       {
//         firstName: given_name,
//         lastName: family_name,
//         email,
//         // phoneNumber: encryptPhone,
//         photo: picture,
//         provider: providers.google,
//         confirmEmail: Date.now(),
//       },
//     ],
//   });
//   const newCredential = await getNewTokenCredentials(newUser)
//   // if all success
//   return successResponse({
//     res,
//     statusCode: 201,
//     message: "user created successfully",
//     data: { newCredential },
//   });
// };
// export const loginWithGmail = async (req, res, next) => {
//   // req.body token
//   const { idToken } = req.body;
//   const { email, email_verified, given_name, family_name, picture } =
//     await verifyGoogleAccount({ idToken });
//   // know role
//   let signature = await getSignature({
//     signatureLevel:
//       user.role !== roles.user ? signatureEnum.admin : signatureEnum.user,
//   });
//   // email_verifed
//   if (!email_verified)
//     return next(new Error("email not verified", { cause: 401 }));
//   // check email found or not
//   const user = await findOne({
//     model: userModel,
//     filter: { email },
//   });
//   if (user) {
//     if (user.provider === providers.google) {
//       // do Token
//       const newCredential = await getNewTokenCredentials(user)
  
//       // if all success
//       return successResponse({
//         res,
//         statusCode: 200,
//         message: "user logged in successfully",
//         data: { newCredential },
//       });
//     }
//   }
//   const newUser = await create({
//     model: userModel,
//     data: [
//       {
//         firstName: given_name,
//         lastName: family_name,
//         email,
//         // phoneNumber: encryptPhone,
//         photo: picture,
//         provider: providers.google,
//         confirmEmail: Date.now(),
//       },
//     ],
//   });
//   const newCredential = await getNewTokenCredentials(newUser)
//   // if all success
//   return successResponse({
//     res,
//     statusCode: 201,
//     message: "user created successfully",
//     data: { newCredential },
//   });
// };
export const loginWithGmail = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const { email, email_verified, given_name, family_name, picture } =
      await verifyGoogleAccount({ idToken });

    if (!email_verified)
      return next(new Error("email not verified", { cause: 401 }));

    // check if user exists
    const user = await findOne({ model: userModel, filter: { email } });

    // now we can safely use user
    let signature = await getSignature({
      signatureLevel: user?.role !== roles.user ? signatureEnum.admin : signatureEnum.user,
    });

    if (user) {
      if (user.provider === providers.google) {
        const newCredential = await getNewTokenCredentials(user);
        return successResponse({
          res,
          statusCode: 200,
          message: "user logged in successfully",
          data: { newCredential },
        });
      }
    }

    // if user doesn't exist → create new user
    const newUser = await create({
      model: userModel,
      data: [
        {
          firstName: given_name,
          lastName: family_name,
          email,
          photo: picture,
          provider: providers.google,
          confirmEmail: Date.now(),
        },
      ],
    });

    const newCredential = await getNewTokenCredentials(newUser);
    return successResponse({
      res,
      statusCode: 201,
      message: "user created successfully",
      data: { newCredential },
    });
  } catch (err) {
    console.error(err);
    return next(new Error("something went error"));
  }
};

//////refresh token //////
export const refreshToken = async (req, res, next) => {
  const user = req.user;
  // know role
 const newCredential = await getNewTokenCredentials(user)
  // if all success
  return successResponse({
    res,
    statusCode: 201,
    message: "new credential created successfully",
    data: { newCredential },
  });
};
