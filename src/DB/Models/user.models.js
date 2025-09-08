
import mongoose, { Schema } from "mongoose";

export const genderEnum = {
  male: "male",
  female: "female",
};
export const providers = {
  system: "SYSTEM",
  google: "GOOGLE",
};
export const roles = {
  user: "USER",
  admin: "ADMIN",
};
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: [20, "First name must be at most 3 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Last name must be at least 3 characters long"],
      maxLength: [20, "Last name must be at most 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
      unique: true,
    },
    password: {
      required: function(){
        return this.provider === providers.system ? true : false
      },
      type: String,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "Must Be Male oa Female",
      },
      default: genderEnum.male,
    },
    phoneNumber: String,
    confirmEmail: Date,
    confirmEmailOTp:String,
    forgetPasswordOTP:String,
    profileImage:String,
    coverImages:[String],
    profileCloudImage:{public_id:String,secure_url:String},
    coverCloudImages:[{public_id:String,secure_url:String}],
    freezedAt:Date,
    FreezedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    restoredAt:Date,
    restoredBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    changeCredentialsTime:Date,
    provider:{
      type:String,
      enum:{
        values:Object.values(providers),
        message:'provider must be system or google'
      },
      default:providers.system
    },
    role:{
      type:String,
      enum:{
        values:Object.values(roles),
        message:'Role must be user or admin'
      },
      default:roles.user
    }
  },
  { timestamps: true ,toJSON:{virtuals : true} , toObject:{virtuals : true}}
);
// to do virtual on user 
userSchema.virtual('messages',{
  localField:'_id',
  foreignField:'receiver_id',
  ref:'Message'
});
export const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
