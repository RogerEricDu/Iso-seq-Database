// import request from '@/utils/request'
import myData from '@/data/testSampleInfo.json'

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }

export function getList(params) {
  return new Promise((resolve) => {
    resolve({
      code: 20000,
      data: {
        total: myData.length,
        items: myData
      }
    })
  })
}
