import Test from '../utils/test'

before('数据库连接', async () => {
  await Test.connectDB()
  // run()
})

after('关闭数据库连接', async () => {
  await Test.closeDB()
})