// components/setweight/setweight.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    food: {
      type: Object
    },
    type: {
      type: String
    }
  },

  options: {
    "addGlobalClass": true
  },

  /**
   * 组件的初始数据
   */
  data: {
    weight: "",
    calories: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {
    },
    onShow() {
    },
    cancelhandle() {
      this.triggerEvent('cancel')
    },
    okhandle() {
      this.setData({
        'food.weight': this.data.weight,
        'food.calories': this.data.calories,
        'food.carbo': this.data.carbo,
        'food.fat': this.data.fat,
        'food.protein': this.data.protein
      })
      this.triggerEvent('ok', {
        food: this.data.food
      })
    },
    inputhandle(e) {
      var weight = e.detail.value;
      var calories = Math.round(weight * (this.data.food.calories / this.data.food.weight) * 10) / 10
      var carbo = Math.round(weight * (this.data.food.nutrition["碳水化合物"] / this.data.food.weight) * 10) / 10
      var fat = Math.round(weight * (this.data.food.nutrition["脂肪"] / this.data.food.weight) * 10) / 10
      var protein = Math.round(weight * (this.data.food.nutrition["蛋白质"] / this.data.food.weight) * 10) / 10
      this.setData({
        'weight': weight,
        'calories': calories,
        'carbo': carbo,
        'fat': fat,
        'protein': protein
      })
    }
  },
  observers: {
    "food": function(food) {
      if (food && food.weight && food.calories) {
        this.setData({
          'weight': food.weight,
          'calories': food.calories,
          'carbo': food.nutrition["碳水化合物"],
          'protein': food.nutrition["蛋白质"],
          'fat': food.nutrition["脂肪"]
        })
      }
    }
  }

})