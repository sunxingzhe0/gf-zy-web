import { compressAccurately } from 'image-conversion'
export function compressImg(file, size) {
  return new Promise(resolve => {
    //size 压缩到多大  单位k
    compressAccurately(file, size).then(res => {
      resolve(res)
    })
  })
}
