import {
  create,
  deleteOne,
  findById,
  findOne,
  findOneAndUpdate,
  updateOne,
} from "../../DB/dbService.js";
import { providers, roles, userModel } from "../../DB/Models/user.models.js";
import { decrypt, encrypt } from "../../Utils/encryption/encryption.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import { compare, hash } from "../../Utils/hashing/hash.utils.js";
import { customAlphabet } from "nanoid/non-secure";
import { emailEvent } from "../../Utils/events/event.utils.js";
import { logoutEnum } from "../../Utils/token/token.utils.js";
import { tokenModel } from "../../DB/Models/token.model.js";
import file from "multer";
import { cloudinaryConfig } from "../../Utils/multer/cloudinary.js";
import { destroyImages, uploadImages } from "../../Utils/multer/cloud.multer.js";
import path from "path";
//////get single user //////
export const getSingleUser = async (req, res, next) => {
  // return phone decrypted
  req.user.phoneNumber = await decrypt({ cipherText: req.user.phoneNumber });
  const user = await findById({
    model:userModel,
    id:req.user._id,
    populate:[{path:'messages'}]
  })
  return successResponse({
    res,
    statusCode: 200,
    message: "user found successfully",
    data: { user },
  });
};
//////share-profile //////
export const sahreProfile = async (req, res, next) => {
  const { userId } = req.params;
  // check usre found or not
  const user = await findOne({
    model: userModel,
    filter: { _id: userId, confirmEmail: { $exists: true } },
  });
  return user
    ? successResponse({
        res,
        statusCode: 200,
        message: "user fecthed successfully",
        data: user,
      })
    : next(new Error("invaild or not verified account", { cause: 404 }));
};
//////update profile //////
export const updateProfile = async (req, res, next) => {
  if (req.body.phoneNumber) {
    req.body.phoneNumber = await encrypt(req.body.phoneNumber);
  }
  // check usre found or not
  const updateUser = await findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: req.body,
  });
  return updateUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "user updated successfully",
        data: updateUser,
      })
    : next(new Error("invaild account", { cause: 404 }));
};
//////Freeze account //////
export const freezeAccount = async (req, res, next) => {
  const { userId } = req.params;
  // check userid
  if (userId && req.user.role !== roles.admin) {
    return next(
      new Error("You Are Not Authorized to freeze this account", { cause: 403 })
    );
  }
  const updateAccount = await findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId || req.user._id,
      FreezedAt: { $exists: false },
    },
    data: {
      freezedAt: Date.now(),
      FreezedBy: req.user._id,
      $unset: {
        restoredAt: true,
        restoredBy: true,
      },
    },
  });
  return updateAccount
    ? successResponse({
        res,
        statusCode: 200,
        message: "User frozed successfully",
        data: { updateAccount },
      })
    : next(new Error("invaild Account", { cause: 404 }));
};
////// restore account using admin//////
export const freezeAccountAdmin = async (req, res, next) => {
  const { userId } = req.params;
  const updateUser = await findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId,
      freezedAt: { $exists: true },
      FreezedBy: { $ne: userId },
    },
    data: {
      $unset: {
        freezedAt: true,
        FreezedBy: true,
      },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
  });
  return updateUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "User restored successfully",
        data: { updateUser },
      })
    : next(new Error("invaild Account", { cause: 404 }));
};
////// restore account using user ///////
export const restoreAccountUser = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (!user.freezedAt) {
    return next(new Error("Account is not frozen", { cause: 400 }));
  }

  if (!user.FreezedBy.equals(user._id)) {
    return next(
      new Error("You Are Not Authorized to restore this account", {
        cause: 403,
      })
    );
  }
  const updateUser = await findOneAndUpdate({
    model: userModel,
    filter: {
      _id: user._id,
      freezedAt: { $exists: true },
      FreezedBy: user._id,
    },
    data: {
      $unset: {
        freezedAt: true,
        FreezedBy: true,
      },
      restoredAt: Date.now(),
      restoredBy: user._id,
    },
  });
  return updateUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "User restored successfully",
        data: { updateUser },
      })
    : next(new Error("invaild Account", { cause: 404 }));
};
////// hard delete or delete account from data base using admin and must have a freeze
export const hardDelete = async (req, res, next) => {
  const { userId } = req.params;
  const user = await deleteOne({
    model: userModel,
    _id: userId,
    freezedAt: { $exists: true },
  });
  return user.deletedCount
    ? successResponse({
        res,
        statusCode: 200,
        message: "user deleted sucessfully",
      })
    : next(new Error("invaild account", { cause: 404 }));
};
////// updatePassword //////
export const updatePassword = async (req, res, next) => {
  const { oldPassword, password, flag } = req.body;
  // check oldPassword === passwod
  if (!(await compare({ plainText: oldPassword, hash: req.user.password })))
    return next(new Error("invaild old password", { cause: 400 }));

  // using flag to logout from all devices or stay loged in
  let updateData = {};
  switch (flag) {
    case logoutEnum.logoutFromAllDevices:
      updateData.changeCredentialsTime = Date.now();
      break;
    case logoutEnum.logout:
      await create({
        model: tokenModel,
        data: [
          {
            jti: req.decode.jti,
            userId: req.user._id,
            expiresId: Date.now() - req.decode.iat,
          },
        ],
      });
      break;
    default:
      break;
  }
  const updatepasswoed = await findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
    },
    data: {
      password: await hash({ plainText: password }),
      ...updateData,
    },
  });
  return updatepasswoed
    ? successResponse({
        res,
        statusCode: 200,
        message: "password updated successfully",
        data: { updatePassword },
      })
    : next(new Error("invaild Account", { cause: 404 }));
};
////// forgetPassword //////
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  // generate otp
  const otp = await customAlphabet("0123456789", 6)();
  const hashOtp = await hash({ plainText: otp });
  const user = await findOneAndUpdate({
    model: userModel,
    filter: {
      email,
      provider: providers.system,
      confirmEmail: { $exists: true },
      freezedAt: { $exists: false },
    },
    data: {
      forgetPasswordOTP: hashOtp,
    },
  });
  if (!user)
    return next(new Error("User not found or not verifiend", { cause: 404 }));
  // send email
  emailEvent.emit("forgetPassword", {
    to: email,
    code: otp,
    firstName: user.firstName,
  });
  return successResponse({
    res,
    statusCode: 200,
    message: "otp sent to your email",
  });
};
////// resetPassword //////
export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await findOne({
    model: userModel,
    filter: {
      email,
      provider: providers.system,
      confirmEmail: { $exists: true },
      freezedAt: { $exists: false },
      forgetPasswordOTP: { $exists: true },
    },
  });
  if (!user) return next(new Error("invaild account", { cause: 404 }));
  // compare hash password
  if (!(await compare({ plainText: otp, hash: user.forgetPasswordOTP })))
    return next(new Error("invaild otp", { cause: 400 }));
  // hash new password
  const hashPasswod = await hash({ plainText: password });
  // update password
  await updateOne({
    model: userModel,
    filter: { email },
    data: {
      password: hashPasswod,
      $unset: { forgetPasswordOTP: true },
      $inc: { __v: 1 },
    },
  });
  return successResponse({
    res,
    statusCode: 200,
    message: "password reset successfully",
  });
};
////// update profile image //////
export const updateProfileImage = async (req, res, next) => {
  // save image in db
  //  const user = await findOneAndUpdate({
  //   model:userModel,
  //   filter:{_id:req.user._id},
  //   data:{
  //     profileImage : req.file.finalPath
  //   }
  // })
  // save image in cloud
  const { public_id, secure_url } = await uploadImages({filePath:req.file.path,type:'Profile-image',userId:req.user._id,fileType:'User'})

  const user = await findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      profileCloudImage: { public_id, secure_url },
    },
  });
  if (req.user.profileCloudImage?.public_id) {
    await destroyImages({filePath:req.user.profileCloudImage?.public_id})
  }
  return successResponse({
    res,
    statusCode: 200,
    message: "image uploaded successfully",
    data: { user },
  });
};
////// cover image //////
export const coverImage = async (req, res, next) => {
  // save image in db
  //  const user = await findOneAndUpdate({
  //   model:userModel,
  //   filter:{_id:req.user._id},
  //   data:{
  //     profileImage : req.files.map((file)=>file.finalPath)
  //   }
  // })
  // save in cloud
  const attachments = [];
  for (const file of req.files) {
    const { public_id, secure_url } =await uploadImages({filePath:file.path,type:'Cover-image',userId:req.user._id,fileType:'User'})
    attachments.push({ public_id, secure_url });
  }
  const user = await findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      coverCloudImages: attachments,
    },
  });
  if(req.user.coverCloudImages?.length){
    for(const img of req.user.coverCloudImages){
      if(img?.public_id){
       await destroyImages({filePath:img?.public_id})
      }
    }
  }
  return successResponse({
    res,
    statusCode: 200,
    message: "image uploaded successfully",
    data: { user },
  });
};
