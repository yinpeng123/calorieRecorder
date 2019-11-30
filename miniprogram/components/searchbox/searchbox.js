// components/searchbox/searchbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入食物\运动名称查询'
    },
    focus:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchbuttonUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/搜索.png',
    voicebuttonUrl: 'cloud://calorie-um1jm.6361-calorie-um1jm-1300723881/录音.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputhandle: function(e) {
      this.triggerEvent('input', {
        value: e.detail.value
      })
    },
    confirmhandle:function(e){
      this.triggerEvent('saerch', {
        value: e.detail.value
      })
    }
  }
})