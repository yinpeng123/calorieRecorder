const units={
  "热量":"Kcal",
  "碳水化合物": "g",
  "蛋白质": "g",
  "脂肪": "g",
  "纤维素": "g",
  "胆固醇": "mg",
  "维生素A": 'μg',
  "维生素C": 'mg',
  "维生素E": 'mg',
  "胡萝卜素": 'μg',
  "硫胺素": 'mg',
  "核黄素": 'mg',
  "烟酸": 'mg',
  "镁": 'mg',
  "钙": 'mg',
  "铁": 'mg',
  "锌": 'mg',
  "铜": 'mg',
  "锰": 'mg',
  "钾": 'mg',
  "磷": 'mg',
  "钠": 'mg',
  "硒": 'μg'
}

const getUnit = function(key){
  return units[key]
}

exports.getUnit = getUnit