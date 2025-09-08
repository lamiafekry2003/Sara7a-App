import * as dbService from '../../DB/dbService.js'
import { messageModel } from '../../DB/Models/message.model.js';
import {userModel} from '../../DB/Models/user.models.js'
import { uploadImages } from '../../Utils/multer/cloud.multer.js';
import { successResponse } from '../../Utils/successResponse.utils.js';
// send message
export const sendMessage = async (req,res,next)=>{

    const {receiver_id} = req.params;
    const {content} =req.body;
    if(!(await dbService.findOne({
        model:userModel,
        filter:{
            _id:receiver_id,
            freezedAt:{$exists:false},
            confirmEmail:{$exists:true}
        }
    })))
    return next(new Error('In-valid receiver id',{cause:400}))

    // if message has attachments
    const attachments=[]
    if(req.files){
        for(const file of req.files){
           const { public_id, secure_url } = await uploadImages({filePath:file.path,type:'message-attachments',userId:receiver_id,fileType:'Message'})
            attachments.push({public_id,secure_url})
        }
    }
    // save message in db
    const message = await dbService.create({
        model:messageModel,
        data:[{
            content,
            attachment:attachments,
            receiver_id,
            sender_id:req.user?._id
        }]
    })
    return successResponse({
        res,
        statusCode:201,
        message:'Message sent successfully',
        data:message
    })

}
// get message
export const getMessage = async (req,res,next)=>{

    const {userId} = req.params;
    const message = await dbService.find({
        model:messageModel,
        filter:{
            receiver_id:userId
        },
        populate:[{
            path:'receiver_id',
            select:'email firstName lastName -_id'
        }]

    })

    return successResponse({
        res,
        statusCode:200,
        message:'Message fetched successfully',
        data:message
    })

}