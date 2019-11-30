// miniprogram/pages/user/user.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/user-unlogin.png',
    exercises: [
      '低（日常活动）',
      '轻微（一周1~3次）',
      '中等（1周4~5次）',
      '强（1周6~7次）',
      '高强度（1周8次以上）'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      userInfo: app.globalData.userInfo
    })
    var querycondition = {
      openid: app.globalData.openid
    }
    wx.cloud.callFunction({
      name: 'query',
      data: {
        target: 'users',
        querycondition
      },
      success: (res) => {
        if (!res.result || !res.result.data.length) {
          this.addUser();
          return
        }
        this.setData({
          option: res.result.data[0]
        })
      },
      fail(err) {
        console.error(err)
      }
    })

  },

  addUser() {
    var sex = app.globalData.userInfo.gender === 1 ? '男' : '女'
    var height = sex === '男' ? 172 : 165
    var weight = sex === '男' ? 62 : 55
    var openid = app.globalData.openid
    var data = {
      birthdate: '2001-01-01',
      sex,
      weight,
      height,
      exercise: 2,
      bodyfat: 18,
      openid
    }
    this.setData({
      option: data
    })
    wx.cloud.callFunction({
      name: 'add',
      data: {
        target: 'users',
        data
      },
      success: res => {
        if (!!res.result._id) {
          console.log('添加用户成功')
          this.setData({
            'option._id': res.result._id
          })
        }
      },
      fail(err) {
        console.error(err)
      }
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
    var currentTime = new Date();
    this.setData({
      currentDate: currentTime.toLocaleDateString().replace(/\//g, '-')
    })
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
  onShareAppMessage: function() {

  },
  chosesex(e) {
    var sex = e.currentTarget.dataset.sex
    this.setData({
      'option.sex': sex
    })
  },
  bindDateChange(e) {
    this.setData({
      'option.birthdate': e.detail.value
    })
  },
  bindExerciseChange(e) {
    this.setData({
      'option.exercise': e.detail.value
    })
  },
  okhandle() {
    var data = this.data.option
    wx.cloud.callFunction({
      name: 'update',
      data: {
        target: 'users',
        data
      },
      success: res => {
        if (!!res.result && !!res.result.stats.updated) {
          var eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('userOptionChange')
          wx.showToast({
            title: '修改成功',
            duration: 1000,
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1100)
            }
          })

        } else {
          wx.showToast({
            title: '未修改',
            icon: 'none'
          })
        }
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
      }
    })
  },
  weightChangeHandle(e) {
    this.setData({
      'option.weight': +e.detail.value
    })
  },
  heightChangeHandle(e) {
    this.setData({
      'option.height': +e.detail.value
    })
  },
  fatChangeHandle(e) {
    this.setData({
      'option.bodyfat': +e.detail.value
    })
  }
})