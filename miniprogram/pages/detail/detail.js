// miniprogram/pages/detail/detail.js
var common = require('./common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    food: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    var {
      _id,
      name
    } = option
    this.setData({
      _id: _id,
      name: name
    })
    if (_id || name) {
      this.getData(_id,name)
    } else {
      var eventChannel = this.getOpenerEventChannel();
      eventChannel.on('acceptFoodfromSearch', ({
        food
      }) => {
        this.setData({
          food: food
        })
        this.setNutritions()
      })
     
    }
  },

  getData(_id, name) {
    var querycondition = {
      name: {
        $regex: name,
        $options: 'i'
      },
      _id: {
        $regex: _id,
        $options: 'i'
      }
    }
    wx.cloud.callFunction({
      name: 'query',
      data: {
        target: 'foods',
        querycondition
      },
      success: (res) => {
        this.setData({
          food: res.result.data[0]
        })
        this.setNutritions()
      }
    })
  },

  setNutritions() {
    var nutritions = this.data.food.nutrition
    var nutritionList = [];
    for (var key in nutritions) {
      nutritionList.push({
        name: key,
        value: nutritions[key],
        unit: common.getUnit(key)
      })
    }
    this.setData({
      nutritionList: nutritionList
    })
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
    return {
      title: '快来查询你最喜爱的食物的营养成份把',
      path: '/pages/detail/detail?_id=' + this.data.food._id + '&name=' + this.data.food.name
    }
  }
})