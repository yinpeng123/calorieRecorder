// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var collectionName = event.target
  const data = event.data
  try {
    return await db.collection(collectionName).add({
      data
    })
  } catch (err) {
    console.error(err)
  }
}