function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

function rpx2px(rpx){
return rpx*wx.getSystemInfoSync().windowWidth/750
}

exports.rpx2px=rpx2px

