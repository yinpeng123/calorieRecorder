// miniprogram/pages/analysis/analysis.js
const proteintimes = [.5, .6, .7, .8, .9];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    healthImg: "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/health.png",
    calendarImg: "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/日历.png",
    status:['正常', '偏低', '严重不足', '偏高', '超高'],
    statusClass: ['', 'text-low', 'text-low', 'text-waring', 'text-waring']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptRecordfromIndex', (data) => {
      var userData = data.userData
      var record = data.record
      this.setData({
        record: record,
        userData: userData,
        date: record.date.slice(8, 10)
      })
      var souweight = userData.weight * ((100 - userData.bodyfat) / 100) * 2.2
      // var proteinSug = this.getTimes(userData.exercises) * souweight
      // var carboSug = userData.sugCalories*0.125
      // var fatSug = (userData.sugCalories - (proteinSug + carboSug)*4)/9
      var proteinSugCal = this.getTimes(userData.exercise) * souweight * 4
      var carboSugCal = userData.sugCal * 0.125 * 4
      var fatSugCal = userData.sugCal - (proteinSugCal + carboSugCal)
      var proteinCal = record.protein * 4
      var carboCal = record.carbo * 4
      var fatCal = record.fat * 9
      var proteinCalProp = Math.round((proteinCal / record.calories) * 100)
      var carboCalProp = Math.round((carboCal / record.calories) * 100)
      var fatCalProp = Math.round((fatCal / record.calories) * 100)
      this.setData({
        'proteinCalProp': proteinCalProp,
        'carboCalProp': carboCalProp,
        'fatCalProp': fatCalProp
      })
      this.setData({
        statu: {
          calorieTotal: this.getStatus(record.calories, userData.sugCal),
          breakfast: this.getStatus(record.meals[0].calories, userData.sugCal * 0.25),
          lunch: this.getStatus(record.meals[1].calories, userData.sugCal * 0.4),
          dinner: this.getStatus(record.meals[2].calories, userData.sugCal * 0.35),
          protein: this.getStatus(proteinCal, proteinSugCal),
          carbo: this.getStatus(carboCal, carboSugCal),
          fat: this.getStatus(fatCal, fatSugCal)
        }
      })
    })
  },
  getTimes(e) {
    return proteintimes[+e]
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      //
    }
    return {
      title: "我发现了一个超好用的食物热量查询工具",
      success: function() {
        //
      },
      fail: function() {
        //
      }
    }
  },
  getStatus(actual, sug) {
    if (actual > sug && (actual - sug) / sug > 0.35) {
      return 4
    } else if (actual > sug && (actual - sug) / sug > 0.16) {
      return 3
    } else if (sug > actual && (sug - actual) / sug > 0.32) {
      return 2
    } else if (sug > actual && (sug - actual) / sug > 0.13) {
      return 1
    } else {
      return 0
    }
  },
})