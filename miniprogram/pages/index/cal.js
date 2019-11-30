function getbmr(sex, b, w, h) {
  var currentTime = new Date()
  var age = currentTime.getFullYear() - b.slice(0, 4) + (+((currentTime.getMonth() - b.slice(5, 7) + 1) / 12).toFixed(1))
  var bmr
  if (sex == '男') {
    bmr = 66 + 13.7 * w + 5 * h - 6.8 * age
  } else {
    bmr = 655 + 9.6 * w + 1.7 * h - 4.7 * age
  }
  return bmr
}

function getSuggestKcal(birthdate, sex, weight, height, exercise) {
  var bmr = getbmr(sex, birthdate, weight, height);
  var sug
  switch (+exercise) {
    case 0:
      sug = bmr * 1.2;
      break;
    case 1:
      sug = bmr * 1.375;
      break;
    case 2:
      sug = bmr * 1.55;
      break;
    case 3:
      sug = bmr * 1.725;
      break;
    case 4:
      sug = bmr * 1.9;
      break;
  }
  return +sug.toFixed(0)
}

function getSugExercise(s) {
  var min
  var max
  switch (s) {
    case 0:
      min = 200;
      max = 300;
      break;
    case 1:
      min = 400;
      max = 500;
      break;
    case 2:
      min = 600;
      max = 800;
      break;
  }
  return { min, max }
}

exports.getSuggestKcal = getSuggestKcal