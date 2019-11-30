// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  var data = event.data
  var collectionName = event.target
  var _id = event.data._id
  delete data._id
  try {
    return await db.collection(collectionName).doc(_id).update({
      data
    })
  } catch (err) {
    console.error(err)
  }
}
