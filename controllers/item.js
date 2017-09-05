import * as model from '../models'


class Item {

  static async getItemById(ctx, next) {
    const { id } = ctx.params.id
	try {
	  if (!id || Object.is(NaN, +id)) {
		throw new Error('id不能为空或非数字!')
	  }
	  const item = await model.Item.findOne({id: ctx.params.id})
	  console.log('item', item)
	  ctx.body = '获取数据成功'
	} catch (err){
	  ctx.err = err.message
	  next()
	}
  }

}

export default Item