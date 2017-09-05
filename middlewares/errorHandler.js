export default async function (ctx) {
  // 抛出错误
  if (!ctx.errors) {
	ctx.throw(500, ctx.message)
  } else {
    // 抛出数据库检测错误
	let result = ''
	for (const error of ctx.errors) {
	  result += `${error.message}\n`
	}
	ctx.throw(500, result)
  }
}