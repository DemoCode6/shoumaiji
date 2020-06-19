// pages/youhuiquan/youhuiquan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.view();
    wx.setNavigationBarTitle({
      title: '优惠券中心'
    })
  },

  view: function () {
    var that = this;
    if (app.globalData.user_msg == '') {
      app.globalData.temp_url = '/pages/member/youhuiquan_center/youhuiquan_center'
      wx.navigateTo({
        url: '/pages/product/login/login',
      })
      return;
    }
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/youhuiquan_center',
      data: {
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        console.log(res.data)
        that.setData({ 'view': res.data });
      }
    })
  },

  lingqu: function(e) {
    var id = e.currentTarget.id;
    var that = this;
    console.log(e);
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/lingqu_youliuquan',
      data: {
        member_id: that.data.globalData.user_msg.id,
        id:id,
      },
      method:'post',
      success(res) {
        wx.showToast({
          title: res.data[1],
        })
        if (res.data[0] == 200) {
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/member/youhuiquan/youhuiquan',
            })
          }, 1000)
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

  }
})