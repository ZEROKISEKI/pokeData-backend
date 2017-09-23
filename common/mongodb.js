import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import {mongodb} from "../config"
import ora from 'ora'
import blueBird from 'bluebird'

// 替换My Promise为BlueBird
mongoose.Promise = blueBird

const spinner = ora('启动数据库...\n').start()

const db = mongoose.connect(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`)

autoIncrement.initialize(db)

db.then(() => {
  spinner.succeed(`数据库连接成功\n`)
}).catch(err => {
  spinner.fail(`数据库连接出错，错误原因: ${err.message}\n`)
})

// db.on('open', () => spinner.succeed(`数据库连接成功\n`))
// db.on('error', err => spinner.fail(`数据库连接出错，错误原因: ${err.message}\n`))

export default db