// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var collectionName = event.target
  const _id = event._id
  try {
    return await db.collection(collectionName).doc(_id).remove()
  } catch (err) {
    console.error(err)
  }
}