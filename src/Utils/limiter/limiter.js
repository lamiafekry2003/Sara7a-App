import { rateLimit } from 'express-rate-limit'
export function limiter(){
    const limiter=rateLimit({
        windowMs: 15 * 60 * 1000,   //1m
        limit:100,
        message:{
          statusCode:429,
          message:'Too many requests from this IP,please try again'
        },
        legacyHeaders:false,
    
      })
    return limiter
}