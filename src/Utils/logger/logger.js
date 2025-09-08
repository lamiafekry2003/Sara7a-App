import morgan from "morgan";
import fs from 'node:fs'
import path from "node:path";

const __dirname =path.resolve()
export function attachRoutingWithLogger(app,routerPath,router,logsFilename){
    const logSteam = fs.createWriteStream(
        path.join(__dirname,'./src/logs',logsFilename),
        {flags:'a'}
    )
    app.use(routerPath,morgan('combined',{stream:logSteam}),router)
    
    app.use(routerPath,morgan('dev'),router)


}