// components/share.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
visible:{
  type:Boolean,
  value:false
},
userInfo:{
  type: Object,
  value:false
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
    draw() {
const {userInfo} = this.data;
const {avatarUrl, nickName } =userInfo;
    }
  }
})
