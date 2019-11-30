// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var collectionName = event.target
  var querycondition = event.querycondition
  try{
    return await db.collection(collectionName).where(queryCondition).count()
  }catch(err){
    console.error(err)
  }
}