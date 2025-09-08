// old version of express used asyncHandler to handle unexpexcted error ,but now use this verson do it aotmactily to asign next 

// export const asyncHandler =(fn)=>{
//     return (req,res,next)=>{
//         fn(req,res,next).catch((err)=>{
//              return next(new Error(err,{cause:err.status ||500}))
//         })
//     }
// }