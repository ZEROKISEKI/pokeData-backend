export const mongodb = {
  host: 'localhost',
  port: 27017,
  database: 'test'
}

// 按照命令行的顺序来
export const proto = {
  'files': [
    './protos/BasicMessage.proto',
    './protos/Common.proto',
    './protos/Config.proto',
    './protos/User.proto'
  ],
  '-t': 'static-module',
  '-w': 'commonjs',
  '-o': './common/model.js',
  * [Symbol.iterator]() {
    let result = []
    for(const key of Object.keys(this)) {
      if(this[key] === null) {
		result.push(key)
      } else if(key !== 'files') {
		result.splice(result.length, 0, key, this[key])
      }
    }
	result = [...result, ...this['files']]
    yield result
  }
}

export const jwt = {
  secret: 'DL3F7OXg0Wy2gha+5O+XEQ=='
}