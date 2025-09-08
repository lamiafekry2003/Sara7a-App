
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  content: {
    type: String,
    required: function (){
        return this.attachment?.length ? false : true
    },
    minLength:[2,'Message must be at least 2 characters'],
    maxLength:[20000,'Message must be at most 2000 characters'],
  },
  attachment:[
    {
        public_id:String,
        secure_url:String
    }
  ],
  receiver_id:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  sender_id:{
    type: Schema.Types.ObjectId,
    ref:'User',
  }
 },{
   timestamps: true 
 });
export const messageModel =mongoose.models.Message || mongoose.model('Message',messageSchema);
