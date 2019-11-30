// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var name = event.data.name || ''
  var _id = event.data.id || ''
  var type = event.data.type || ''
  var collectionName = 'foods'
  var querycondition = {
    name: {
      $regex: name,
      $options: 'i'
    },
    type: {
      $regex: type,
      $options: 'i'
    },
    _id: {
      $regex: _id,
      $options: 'i'
    } 
}

  return await db.collection('foods').where(querycondition).get()}