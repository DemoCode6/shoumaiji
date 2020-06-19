var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.view();
    wx.setNavigationBarTitle({
      title: '关于我们'
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/other/huiyuan',
      data:{
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        var str = res.data;
        str.res.content = WxParse.wxParse('content', 'html', str.res.huiyuan_summary, that, 5);
        that.setData({view:str});
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

  //确认支付
  pay_money: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/other/pay_money',
      data: {
        'member_id': that.data.globalData.user_msg.id
      },
      method: 'post',
      success(res) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success(res1) {
            wx.showToast({
              title: '支付成功',
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/member/index/index',
              })
            }, 1000)

          },
          fail(res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})