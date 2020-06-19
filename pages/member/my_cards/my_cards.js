var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData:'',
    my_cards:[],
  },

  card_xq(){
    wx.navigateTo({
      url: '/pages/cardXq/cardXq',
    })
  },

  onLoad: function (options) {
    if (!app.globalData.user_msg) {
      app.globalData.temp_url = '/pages/member/my_cards/my_cards'
      wx.redirectTo({
        url: '/pages/product/login/login',
      })
    }
    this.setData({
      globalData:app.globalData,
    })
    this.view();
  },

  onShow: function () {

  },

  view:function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/member/my_cards',
      data: {
        member_id: app.globalData.user_msg.id,
      },
      method: 'post',
      success: function (res) {
        that.setData({
          my_cards:res.data.my_cards,
        })
      }
    });
  },

  my_cards_detail:function(e){
    wx.navigateTo({
      url: '/pages/member/my_cards_detail/my_cards_detail?id=' + e.currentTarget.id,
    })
  },

  member_card_detail: function (e) {
    wx.navigateTo({
      url: '/pages/product/member_card_detail/member_card_detail?id=' + e.currentTarget.id,
    })
  },
})