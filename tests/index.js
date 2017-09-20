import Test from '../utils/test'
import ora from 'ora'

describe('DataBase', () => {
  before('数据库连接', async () => {
	const spinner = ora('进行数据库连接').start()
	try {
	  await Test.connectDB()
	  spinner.succeed('数据库连接成功！')
	} catch (err) {
	  spinner.fail(`数据库连接失败! 错误原因: ${err.message}`)
	}
  })

  after('关闭数据库连接', async () => {
	const spinner = ora('关闭数据库连接').start()
	try {
	  await Test.closeDB()
	  spinner.succeed('成功关闭数据库连接！')
	} catch (err) {
	  spinner.fail(`关闭连接失败! 错误原因: ${err.message}`)
	}
  })
})