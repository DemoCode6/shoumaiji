var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  data: {
    globalData:'',
    id:0,
    res:'',
    dianpu:[],
    dianpu_id:0,
  },

  onLoad: function (options) {
    this.setData({
      id:options.id,
    })
    if (!app.globalData.user_msg) {
      app.globalData.temp_url = '/pages/product/member_card_detail/member_card_detail?id=' + options.id,
      wx.redirectTo({
        url: '/pages/product/login/login',
      })
    }
    this.view();
  },

  view: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/product/member_card_detail',
      data: {
        id:that.data.id,
      },
      method: 'post',
      success: function (res) {
        WxParse.wxParse('content', 'html', res.data.res.content, that, 5);
        that.setData({
          res: res.data.res,
          dianpu:res.data.dianpu,
        })
      }
    });
  },

  buy:function(){
    this.setData({
      tanHidd: true,
    })
  },

  pay_money:function(){
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/member_card_pay_money',
      data: {
        'member_card_id': that.data.id,
        'member_id': app.globalData.user_msg.id,
        'dianpu_id': that.data.dianpu_id,
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
            //发送支付通知
            wx.requestSubscribeMessage({
              tmplIds: ['kRsBh1xjAi8vKYwNih20nL4h4S-b55b3vGJBp5qtJ5Y', 'DYBy0R3HzXEbo2lZp4KBWQIiGPE9uMb5frF-Ly6BqQU'],
              success(res2) {
                if (res2.errMsg == 'requestSubscribeMessage:ok') {
                  wx.request({
                    url: that.data.globalData.domain + '/wxxcx/product/send_zhifu_tongzhi',
                    data: {
                      package: res.data.package,
                      member_id: that.data.globalData.user_msg.id,
                      order_id: res.data.order_id
                    },
                    method: "post",
                    success(res) {

                    }
                  })
                }
                wx.redirectTo({
                  url: '/pages/member/my_cards/my_cards',
                })
              }
            })
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

  onShow: function () {
    this.setData({
      globalData:app.globalData,
    })
  },

  onShareAppMessage: function () {

  },

  tan_quxiao() {
    this.setData({
      tanHidd: false,
    })
  },

  select_dianpu: function (e) {
    this.setData({
      dianpu_id: e.currentTarget.id,
    })
    this.tan_quxiao();
    this.pay_money();
  }
})