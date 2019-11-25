//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    searchbuttonUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/搜索.png',
    voicebuttonUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/录音.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    meals: [{
      name: '早餐',
      suggest: {
        min: 400,
        max: 600
      },
      calories: 800,
      imgUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/晚上.png',
      foods: [{
        name: '鸡蛋',
        weight: 100,
        unit: '克',
        calories: 300
      }, {
        name: '面包',
        weight: 150,
        unit: '克',
        calories: 500
      }]
    }, {
      name: '午餐',
      suggest: {
        min: 600,
        max: 800
      },
      calories: 800,
      imgUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/晚上.png',
      foods: [{
        name: '鸡蛋',
        weight: 100,
        unit: '克',
        calories: 300
      }, {
        name: '面包',
        weight: 150,
        unit: '克',
        calories: 500
      }]
    }]
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.showToast({
        title: '基础库版本过低',
        icon: 'none',
        duration: 1000
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.authorize({
            socpe: 'scope.userInfo',
            sucess() {
              this.getUserInfo()
            }
          })

        } else {
          this.getUserInfo()
        }
      }
    })
  },

  getUserInfo: function() {
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo
        })
      }
    })
  },

  onGetOpenid: function() {
    // 调用云函数,登录
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
            logged: true
          }),
          wx.navigateTo({
            url: '../userConsole/userConsole',
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  foodtoggle(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      ['meals[' + index + '].hidden']: !this.data.meals[index].hidden
    })
  },
  addFood(e) {
    wx.navigateTo({
        url: '/pages/addFood',
        success: function(res) {
          res.eventChannel.emit('acceptDataFromIndex', {
            mealName: e.currentTarget.dataset.mealName,
            index: e.currentTarget.dataset.index
          })
        }
      })
  },
  viewAnalysis() {
    wx.navigateTo({
      url: '/pages/analysis/analysis',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})