import path from "node:path";
import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import messageRouter from "./Modules/Message/message.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import { globalErrorHandling } from "./Utils/errorHandling.utils.js";
import cors from "cors"
import { attachRoutingWithLogger } from "./Utils/logger/logger.js";
import { corsOption } from "./Utils/cors/cors.js";
import helmet from "helmet";
import { limiter } from "./Utils/limiter/limiter.js";


const bootstrap = async (app, express) => {
  app.use(express.json()); //global middlewares
  // to secure from attack
  app.use(helmet())
  app.use(cors(corsOption()))
  // rate limit
   app.use(limiter())
  await connectDB();

  // http://localhost:3000/uploads/User/68abe6854801b87e169611a9/1756564745490__0.8450765170691701__book2.PNG
    
  //morgan
  attachRoutingWithLogger(app,'/api/auth',authRouter,'auth.log')
  attachRoutingWithLogger(app,'/api/user',userRouter,'user.log')
  attachRoutingWithLogger(app,'/api/message',messageRouter,'message.log')


  app.get('/',(req,res)=>{
    return res.status(200).json({message:'Welcome To Sara7a App'})
  })
  app.use("/uploads",express.static(path.resolve('./src/uploads')))
  app.use("/api/auth", authRouter);
  app.use("/api/message", messageRouter);
  app.use("/api/user", userRouter);
  app.all("/*dummy", (req, res,next) => {
    return next(new Error('Not Found Handler',{cause:404}))
  });
  // global error handling
  app.use(globalErrorHandling);
};
export default bootstrap;
