var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: [],
    page: 0,
    lable:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.view();
    wx.setNavigationBarTitle({
      title: '新闻资讯'
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/news',
      data: {
        page: that.data.page,
      },
      success(res) {
        if (res.data.code == 200) {
          var str = that.data.view.concat(res.data.res);
          that.setData({ 'view': str, page: that.data.page + 1 })
        } else {
          that.setData({label:res.data.res})
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
    this.view();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})