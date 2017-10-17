import qiniu from 'qiniu'
import {qiniuConfig} from '../config'
import {PokeData} from '../common/model'

const isProduction = process.env.NODE_ENV === 'production'

class Upload {

  static async uploadImage(ctx) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    const { file } = ctx.request.body
    const { accessKey, secretKey } = isProduction ? process.env : qiniuConfig
    const upload = []

    for(let index in file) {
      const data = file[index]
      const key = `${Date.now()}/${ctx.state.user.userId}/${data.name}`

      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      const pubPolicy = new qiniu.rs.PutPolicy(qiniuConfig.options)
      const uploadToken = pubPolicy.uploadToken(mac)

      const config = new qiniu.conf.Config()
      // 设置华南地区机房
      config.zone = qiniu.zone.Zone_z2
      const formUploader = new qiniu.form_up.FormUploader(config)
      const putExtra = new qiniu.form_up.PutExtra()

      upload.push(new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken,
          key, data.path, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
              reject(respErr)
            } else {
              resolve(respBody)
            }
          })
      }))
    }

    return Promise.all(upload).then(res => {
      ctx.response.body = res
    })
  }

}

export default Upload