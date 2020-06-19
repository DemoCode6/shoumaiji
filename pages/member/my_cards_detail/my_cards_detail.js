var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: '',
    id: 0,
    res: '',
    img:'',
    member_card_fuli:[],
  },

  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    this.view();
  },

  onShow: function () {
    this.setData({
      globalData: app.globalData,
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/member/my_cards_detail',
      data: {
        id: that.data.id,
      },
      method: 'post',
      success: function (res) {
        WxParse.wxParse('content', 'html', res.data.res.getcard.content, that, 5);
        that.setData({
          res: res.data.res,
          img:res.data.img,
          member_card_fuli: res.data.member_card_fuli,
        })
      }
    });
  },
})