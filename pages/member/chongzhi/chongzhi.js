var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    chuzhi_card: [],
    chuzhi_card_order: [],
  },

  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    wx.setNavigationBarTitle({
      title: '储值中心'
    })
    this.view();
  },

  view: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/member/chuzhi_card',
      data: {
        member_id: app.globalData.user_msg.id,
      },
      method: 'post',
      success: function (res) {
        that.setData({
          chuzhi_card: res.data.chuzhi_card,
          chuzhi_card_order: res.data.chuzhi_card_order,
        })
      }
    });
  },

  pay_money: function (e) {
    var id = e.currentTarget.id;
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/chuzhi_card_pay_money',
      data: {
        'chuzhi_card_id': id,
        'member_id': app.globalData.user_msg.id,
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
            }, 2000)
            //发送支付通知
            // wx.requestSubscribeMessage({
            //   tmplIds: ['kRsBh1xjAi8vKYwNih20nL4h4S-b55b3vGJBp5qtJ5Y', 'DYBy0R3HzXEbo2lZp4KBWQIiGPE9uMb5frF-Ly6BqQU'],
            //   success(res2) {
            //     if (res2.errMsg == 'requestSubscribeMessage:ok') {
            //       wx.request({
            //         url: that.data.globalData.domain + '/wxxcx/product/send_zhifu_tongzhi',
            //         data: {
            //           package: res.data.package,
            //           member_id: that.data.globalData.user_msg.id,
            //           order_id: res.data.order_id
            //         },
            //         method: "post",
            //         success(res) {

            //         }
            //       })
            //     }
            //     wx.redirectTo({
            //       url: '/pages/member/my_cards/my_cards',
            //     })
            //   }
            // })
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

  },
})