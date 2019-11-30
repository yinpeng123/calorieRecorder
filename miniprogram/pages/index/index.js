//index.js
const cal = require('./cal.js')

const app = getApp()

Page({
  data: {
    avatarUrl: '/user-unlogin.png',
    userInfo: {},
    logged: false,
    hasUserInfo: false,
    takeSession: false,
    hasRecord: false,
    requestResult: '',
    imgUrls: {
      "早餐": "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/早上.png",
      "午餐": "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/中午.png",
      "晚餐": "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/晚上.png",
      "添加": "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/添加.png",
      "减少": "cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/减少.png"
    },
    record: {
      calories: 0,
      carbo: 0,
      fat: 0,
      protein: 0,
      date: '',
      meals: [{
          name: "早餐",
          calories: 0,
          foods: []
        },
        {
          name: "午餐",
          calories: 0,
          foods: []
        },
        {
          name: "晚餐",
          calories: 0,
          foods: []
        }
      ],
    }
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
    //登录
    this.getOpenid()

    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setUserInfo(res.userInfo)
            }
          })
        }
      }
    })
  },
  onShow() {
    var currentDate = new Date().toLocaleDateString().slice(0, 10).replace(/\//g, '-')
    if (currentDate != this.data.record.date) {
      this.getTodayRecords(currentDate)
    }
  },

  setUserInfo(userInfo) {
    this.setData({
      hasUserInfo: true,
      avatarUrl: userInfo.avatarUrl,
      userInfo: userInfo
    })
    app.globalData.avatarUrl = userInfo.avatarUrl
    app.globalData.userInfo = userInfo
  },

  onGetUserInfo: function(e) {
    if (!e.detail.userInfo) {
      return
    }
    if (!this.data.hasUserInfo) {
      this.setUserInfo(e.detail.userInfo)
    }

    wx.navigateTo({
      url: '/pages/user/user',
      events: {
        userOptionChange: () => {
          this.calculate()
        }
      }
    })

  },

  getOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        app.globalData.logged = true
        this.setData({
          'record.openid': app.globalData.openid
        })
        var date = new Date().toLocaleDateString().slice(0, 10).replace(/\//g, '-')
        this.getTodayRecords(date)
        this.calculate()
      },
      fail: err => {
        wx.showToast({
          title: '连接失败',
          icon: 'none',
          duration: 1000
        })
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  foodtoggle(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      ['record.meals[' + index + '].hidden']: !this.data.record.meals[index].hidden
    })
  },
  addFood(e) {
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var that = this
    wx.navigateTo({
      url: '/pages/addFood/addFood?type=' + type,
      fail: function(res) {
        console.error('跳转失败')
      },
      events: {
        addFoodCompleted: function(data) {
          if (data.weight == 0) {
            return
          }
          var foods = that.data.record.meals[index].foods
          var sign = false
          foods.forEach((food, index) => {
            if (food.name === data.name) {
              foods[index].calories = food.calories + data.calories;
              foods[index].weight = food.weight + data.weight;
              sign = true
            }
          })
          if (!sign) {
            foods = foods.concat(data)
          }
          that.data.record.meals[index].calories += data.calories
          that.data.record.calories += data.calories
          that.data.record.carbo += data.carbo
          that.data.record.fat += data.fat
          that.data.record.protein += data.protein
          that.setData({
            ['record.meals[' + index + '].foods']: foods,
            ['record.meals[' + index + '].calories']: that.data.record.meals[index].calories,
            'record.calories': that.data.record.calories,
            'record.carbo': that.data.record.carbo,
            'record.fat': that.data.record.fat,
            'record.protein': that.data.record.protein
          })
          that.updateRecord(index)
        }
      }
    })
  },
  minusFood(e) {
    var mealindex = e.currentTarget.dataset.mealIndex
    var foodindex = e.currentTarget.dataset.foodIndex
    var food = this.data.record.meals[mealindex].foods[foodindex]
    this.data.record.meals[mealindex].calories -= food.calories
    this.data.record.calories -= food.calories
    this.data.record.carbo += food.carbo
    this.data.record.fat += food.fat
    this.data.record.protein += food.protein
    this.data.record.meals[mealindex].foods.splice(foodindex, 1)
    this.setData({
      ['record.meals[' + mealindex + '].foods']: this.data.record.meals[mealindex].foods,
      ['record.meals[' + mealindex + '].calories']: this.data.record.meals[mealindex].calories,
      'record.calories': this.data.record.calories,
      'record.carbo': this.data.record.carbo,
      'record.fat': this.data.record.fat,
      'record.protein': this.data.record.protein
    })
    if (this.data.record.calories == 0) {
      this.removeRecord()
    } else {
      this.updateRecord(mealindex)
    }
  },
  removeRecord() {
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        target: '',
        _id: this.data.record._id
      },
      success: res => {
        if (res.result && res.result._id) {
          this.setData({
            'record._id': ''
          })
          console.log('删除记录成功')
        }
      }
    })
  },
  updateRecord(index) {
    if (!this.data.hasRecord) {
      wx.cloud.callFunction({
        name: 'add',
        data: {
          target: 'records',
          data: this.data.record
        },
        success: res => {
          if (res.result && res.result._id) {
            this.setData({
              'record._id': res.result._id,
              'hasRecord': true
            })
            console.log('添加记录成功')
          }
        },
        fail(e) {
          console.error(e)
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'update',
        data: {
          target: 'records',
          data: {
            _id: this.data.record._id,
            calories: this.data.record.calories,
            carbo: this.data.record.carbo,
            fat: this.data.record.fat,
            protein: this.data.record.protein,
            ['meals.' + index]: this.data.record.meals[index]
          }
        },
        success: res => {
          if (res.result && res.result.stats.updated) {
            console.log('更新记录成功')
          }
        },
        fail: e => {
          console.error(e)
        }
      })
    }
  },
  getTodayRecords(date) {
    this.setData({
      'record.date': date
    })
    var querycondition = {
      openid: app.globalData.openid,
      date: this.data.record.date
    }
    wx.cloud.callFunction({
      name: 'query',
      data: {
        target: 'records',
        querycondition
      },
      success: res => {
        if (res.result && res.result.data.length) {
          this.setData({
            'record': res.result.data[0],
            'hasRecord': true
          })
        } else {
          this.setData({
            'hasRecord': false
          })
        }
      },
      fail(err) {
        console.error(err)
      },
      complete: () => {
        this.setData({
          logged: app.globalData.logged,
        })
      }
    })
  },
  //计算推荐卡路里
  calculate() {
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
        var sugCal
        if (!res.result || !res.result.data.length) {
          wx.showToast({
            title: '查看饮食分析请先更新身体数据！',
            icon: 'none'
          })
          sugCal = 0
        } else {
          var {
            birthdate,
            sex,
            weight,
            height,
            exercise,
            bodyfat
          } = res.result.data[0]
          sugCal = cal.getSuggestKcal(birthdate, sex, weight, height, exercise)
          this.setData({
            'userData': {
              birthdate,
              sex,
              weight,
              height,
              exercise,
              bodyfat,
              sugCal
            }
          })
        }

        this.setData({
          'sugCal': sugCal,
          'record.meals[0].suggest.min': Math.ceil(.2 * sugCal),
          'record.meals[0].suggest.max': Math.ceil(.25 * sugCal),
          'record.meals[1].suggest.min': Math.ceil(.35 * sugCal),
          'record.meals[1].suggest.max': Math.ceil(.4 * sugCal),
          'record.meals[2].suggest.min': Math.ceil(.3 * sugCal),
          'record.meals[2].suggest.max': Math.ceil(.35 * sugCal)
        })
      },
      fail(err) {
        console.error(err)
      }
    })

  },
  viewAnalysis() {
    var record = this.data.record
    var userData = this.data.userData
    wx.navigateTo({
      url: '/pages/analysis/analysis',
      success: function(res) {
        res.eventChannel.emit('acceptRecordfromIndex', {
          record: record,
          userData: userData
        })
      },
      fail: function(res) {
        console.error('跳转失败')
      }
    })
  },
  tapsearchbox() {
    wx.navigateTo({
      url: '/pages/addFood/addFood?type=search',
      fail: function(res) {
        console.error('跳转失败')
      }
    })
  }
})