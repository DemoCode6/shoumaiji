var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    globalData: app.globalData,
    view: '',
    search_res: '',
    footer: ['s1.png', 'c2.png', 'g1.png', 'm11.png'],
  },

  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    wx.setNavigationBarTitle({
      title: '产品中心'
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/xilie',
      data:{
        search:app.globalData.search
      },
      success(res) {
        that.setData({
          'view': res.data.res
        })
        if (app.globalData.search != '') {
          console.log('enen')
          var result = res.data.res;
          that.setData({search_res: res.data.res[0].children});
          result[0].children = res.data.search_res;
          that.setData({ view: result })
        }
      }
    })
  },

  clickTab: function (e) {
    var that = this;
    if (app.globalData.search != '') {
      app.globalData.search = '';
      var result = that.data.view;
      result[0].children = that.data.search_res;
      that.setData({ view: result })
    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
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
    this.view();
    this.setData({ currentTab: app.globalData.type })
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