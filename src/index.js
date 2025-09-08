import express from 'express'
import bootstrap from './app.controller.js'
import dotenv from 'dotenv'
import chalk from 'chalk'
const app = express()
dotenv.config({path:'./src/config/.env', override: true })
const port = process.env.PORT
await bootstrap(app,express)

app.listen(port, () => console.log(chalk.bgGreen(chalk.black(`Example app listening on port ${port}!`))))