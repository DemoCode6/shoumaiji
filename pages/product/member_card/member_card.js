var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData:'',
    member_cards:[],
  },
  member_card_detail(e){
    wx.navigateTo({
      url: '/pages/product/member_card_detail/member_card_detail?id=' + e.currentTarget.id,
    })
  },

  onLoad: function (options) {
    this.view();
  },

  onShow: function () {
    this.setData({
      globalData:app.globalData,
    })
  },

  view:function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/product/member_cards',
      data: {
        
      },
      method: 'post',
      success: function (res) {
        that.setData({
          member_cards:res.data.member_cards,
        })
      }
    });
  },

  onShareAppMessage: function () {

  }
})