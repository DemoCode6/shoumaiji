var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],

    is_liushui:1,
  },

  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    var id = options.id;
    this.view(id);
    wx.setNavigationBarTitle({
      title: '提现记录'
    })
  },

  view: function (id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/tixian_record',
      data: {
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        that.setData({ 'view': res.data })
        console.log(res.data)
      }
    })
  },

  onShow: function () {
    
  },

  change_liushui:function(e) {
    this.setData({
      is_liushui:e.currentTarget.id,
    })
  }
})