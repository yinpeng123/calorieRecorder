// miniprogram/pages/addFood.js
const util = require('../../util.js')
const app = getApp()
Component({
  properties: {
    type: {
      type: String,
      value: ''
    }
  },
  //   /**
  //    * 页面的初始数据
  //    */
  data: {
    histories: [],
    clearImgUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/清空.png',
    result: [],
    animationData: {}
  },


  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      var type = this.data.type
      if (type === '早餐' || type === '午餐' || type === '晚餐') {
        type = 'food'
      } else if (type === '运动') {
        type = 'sport'
      } else {
        type = ''
      }
      var querycondition = {
        type: {
          $regex: type
        }
      }
      wx.cloud.callFunction({
        name: 'query',
        data: {
          target: 'searchhistories',
          querycondition
        },
        success: (res) => {
          if (res.result && res.result.data.length) {
            this.setData({
              histories: res.result.data
            })
          }

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

    clearhandle(e) {
      wx.cloud.callFunction({
        name: 'removeAll',
        data: {
          target: 'searchhistories'
        }
      }).then((res) => {
        if (res.result.stats.removed) {
          this.data.histories = []
          this.setData({
            histories: this.data.histories
          })
        }
      }).catch(e => {
        console.error(e)
      })
    },

    inputhandle(e) {
      this.closesetweightBox()
      var result
      var type = this.data.type
      if (type === '早餐' || type === '午餐' || type === '晚餐') {
        type = 'food'
      } else if (type === '运动') {
        type = 'sport'
      } else {
        type = ''
      }
      if (!e.detail.value) {
        this.setData({
          result: []
        })
        return
      }
      var name = e.detail.value || ''
      var querycondition = {
        name: {
          $regex: name,
          $options: 'i'
        },
        type: {
          $regex: type,
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
          if (res.result && res.result.data.length) {
            this.setData({
              result: res.result.data
            })
          }
        }
      })

    },

    tapfoodhandle(e) {
      var food = e.currentTarget.dataset.food;
      if (this.data.type === 'search') {
        wx.navigateTo({
          url: '/pages/detail/detail',
          success: (res) => {
            this.addSearchHistory(food)
            res.eventChannel.emit('acceptFoodfromSearch', {
              food
            })
          }
        })
      } else {
        this.opensetweightBox(food);
      }
    },
    opensetweightBox(food) {
      this.setData({
        food: food,
        type: this.data.type
      })
      var animation = wx.createAnimation({
        duration: 250,
        timingFunction: 'ease-out',
      })

      animation.bottom(0).step()

      this.setData({
        animationData: animation.export()
      })
    },
    closesetweightBox() {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out',
      })

      animation.bottom(-util.rpx2px(400)).step()

      this.setData({
        animationData: animation.export()
      })
    },
    cancelhandle() {
      this.closesetweightBox()
    },
    okhandle(e) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('addFoodCompleted', e.detail.food)
      wx.showToast({
        title: '添加成功',
        duration: 500
      })
      this.addSearchHistory(e.detail.food)
      this.closesetweightBox()
    },
    addSearchHistory(food) {
      var data = {
        id: food._id,
        openid: app.globalData.openid,
        name: food.name,
        type: food.type,
        time: new Date()
      }
      var querycondition = {
        id: food._id,
        openid: app.globalData.openid,
      }
      wx.cloud.callFunction({
        name: 'query',
        data: {
          target: 'searchhistories',
          querycondition
        },
        success: res => {
          if (res.result) {
            wx.cloud.callFunction({
              name: 'update',
              data: {
                target: 'searchhistories',
                data: {
                  "_id": res.result.data[0]._id,
                  'time': new Date()
                }
              },
              success: res => {
                if (res.result.stats.updated) {
                  console.log('更新搜索历史记录')
                }
              }
            })
          } else {
            wx.cloud.callFunction({
              name: 'add',
              data: {
                target: 'searchhistories',
                data
              },
              success: res => {
                if (res.result.updated) {
                  this.data.histories.concat(data)
                  this.setData({
                    'histories': this.data.histories
                  })
                  console.log('插入搜索历史记录')
                }
              }
            })
          }
        }
      })
    },
    historytaphandle(e) {
      var _id = e.currentTarget.dataset.item.id
      wx.cloud.callFunction({
        name: 'query',
        data: {
          target: 'foods',
          querycondition: {
            _id
          }
        }
      }).then(res => {
        var food = res.result.data[0];
        if (this.data.type === 'search') {
          wx.navigateTo({
            url: '/pages/detail/detail',
            success: (res) => {
              this.addSearchHistory(food)
              res.eventChannel.emit('acceptFoodfromSearch', {
                food
              })
            }
          })
        } else {
          this.opensetweightBox(food);
        }
      }).catch(e => {
        console.error(e)
      })
    }
  },

  observers: {
    'result.length': function(length) {
      this.setData({
        hasResult: !!length
      })
    }
  }
})