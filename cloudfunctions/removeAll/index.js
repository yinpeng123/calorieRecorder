// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var collectionName = event.target
  try{
    return await db.collection(collectionName).where({
      _id: { $regex: '' }
    }).remove()
  }catch(e){
    console.error(e)
  }
}