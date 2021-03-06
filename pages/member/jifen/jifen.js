var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    globalData: app.globalData,
    view: '',
    jifen:0,

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.view();
    wx.setNavigationBarTitle({
      title: '我的积分'
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/jifen',
      data: {
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        that.setData({ 'view': res.data.res, 'jifen':res.data.jifen })
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

  }
})