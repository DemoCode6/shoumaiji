var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
    address: '',
    liuyan: '',
    xiangqing:0,

    number: 1,
    total: 0,

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ globalData: app.globalData })
    this.view(this.data.globalData.user_msg.id, options.id);
    wx.setNavigationBarTitle({
      title: '积分商城'
    })
  },

  clickMe:function(){
    this.setData({ xiangqing: !this.data.xiangqing})
  },

  view: function(member_id, id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/jfshop_detail',
      data: {
        member_id: member_id,
        id: id
      },
      success(res) {
        var str = res.data.res;
        str.content = WxParse.wxParse('content', 'html', str.content, that, 5);
        that.setData({
          'view': str,
          'address': res.data.address,
          total: res.data.res.price
        })
        console.log(res.data);
      }
    })
  },

  //增加数量
  jia: function(e) {
    this.setData({
      number: parseInt(this.data.number) + 1
    });
    this.gettotal();
  },

  //减少数量
  jian: function(e) {
    if (this.data.number > 1) {
      this.setData({
        number: parseInt(this.data.number) - 1
      });
      this.gettotal();
    }
  },

  //计算总金额
  gettotal: function() {
    var total = this.data.number * this.data.view.price;
    this.setData({
      total: total
    });
  },

  pay_money: function() {
    var that = this;
    console.log('hehe')
    if (!that.data.address.id) {
      wx.showToast({
        title: '请填写收货地址',
      });
      return false;
    }
    wx.showModal({
      title: '积分商城',
      content: '确定购买吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.globalData.domain + '/wxxcx/member/jf_pay_money',
            data: {
              number: that.data.number,
              id: that.data.view.id,
              address_id: that.data.address.id,
              liuyan: that.data.liuyan,
              member_id: app.globalData.user_msg.id
            },
            method: 'post',
            success(res) {
              console.log(res)
              if (res.data.code == 200) { //成功
                wx.showToast({
                  title: res.data.msg,
                  duration: 2000,
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/member/jifen/jifen',
                  })
                }, 2000);
              }
              if (res.data.code == 301 || res.data.code == 501) { //积分不足//系统错误
                wx.showToast({
                  title: res.data.msg,
                  duration: 2000
                })
                return false;
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //留言
  liuyan: function(e) {
    this.setData({
      liuyan: e.detail.value
    });
  }
})