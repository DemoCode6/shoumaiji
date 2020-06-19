var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getUserInfoFun: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        wx.request({
          url: that.data.globalData.domain + '/wxxcx/login/saveuser',
          data: {
            userinfo: res.userInfo,
            openid: app.globalData.openid,
            tuijian_id: app.globalData.tuijian_id,
          },
          method: 'post',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            app.globalData.user_msg = res.data.user_msg
            if (app.globalData.temp_url) {
              var temp_url = app.globalData.temp_url;
              app.globalData.temp_url = '';
              wx.redirectTo({
                url: temp_url,
              })
            } else {
              wx.switchTab({
                url: '/pages/product/index/index',
              })
            }
          }
        })
      },
      fail: function () {
        console.log('hehe')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  jump22: function () {
    wx.switchTab({
      url: '/pages/product/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})