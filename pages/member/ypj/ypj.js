var app = getApp();
Page({
  data: {
    globalData: app.globalData,
    view: '',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  onLoad: function(options) {
    this.setData({ globalData: app.globalData })
    this.view(options.order_id, options.order_detail_id);
    wx.setNavigationBarTitle({
      title: '已评价'
    })
  },

  view: function(order_id, order_detail_id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/ypj',
      data: {
        order_id: order_id,
        order_detail_id: order_detail_id,
        member_id: that.data.globalData.user_msg.id,
      },
      success(res) {
        console.log(res.data)
        that.setData({
          'view': res.data
        })
      }
    })
  }

})