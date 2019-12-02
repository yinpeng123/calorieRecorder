// components/searchbox/searchbox.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    "addGlobalClass": true
  },
  properties: {
    placeholder: {
      type: String,
      value: '请输入食物\运动名称查询'
    },
    focus:{
      type:Boolean,
      value:false
    },
    cursor: {
      type: Number,
      value: 0
    },
    value: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
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
      this.triggerEvent('search', {
        value: e.detail.value
      })
    }
  }
})