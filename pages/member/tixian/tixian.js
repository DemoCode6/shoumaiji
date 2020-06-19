var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
    money: 0,

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    var id = options.id;
    this.view(id);
    wx.setNavigationBarTitle({
      title: '提现'
    })
  },

  view: function (id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/tixian',
      data: {
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        that.setData({ 'view': res.data })
        console.log(res.data)
      }
    })
  },

  //提现
  tixian: function(){
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/tixian_tijiao',
      data: {
        member_id: that.data.globalData.user_msg.id,
        money: that.data.money
      },
      method:'post',
      success(res) {
        if (res.data[0] == 200) {
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/member/txok/txok',
            })
          }, 1000);
        } else {
          wx.showToast({
            title: res.data[1],
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  money: function (e) {
    this.setData({
      money: e.detail.value
    });
  }
})