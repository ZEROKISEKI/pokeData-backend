// 该文件为mocha + chai + supertest 提供测试支持

import mongoose from 'mongoose'
import {mongodb} from '../config'

class Test {

	static async connectDB() {
		return mongoose.connect(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`)
	}

	static async closeDB() {
		mongoose.connection.close()
	}

}

export default Test