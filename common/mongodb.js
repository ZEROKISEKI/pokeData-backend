import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import { mongodb } from "../config"
import ora from 'ora'

const spinner = ora('启动数据库...').start()

const db = mongoose.createConnection(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`)

autoIncrement.initialize(db)

db.on('open', () => spinner.succeed(`数据库连接成功`))
db.on('error', err => spinner.fail(`数据库连接出错，错误原因: ${err.message}`))

export default db