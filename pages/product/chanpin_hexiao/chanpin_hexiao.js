var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData:app.globalData,
    view:'',
    id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: app.globalData.domain + '/wxxcx/member/save_options',
    //   data: {
    //     options: options,
    //     type: 'chanpin_hexiao',
    //   },
    //   method: 'post',
    //   success: function (res) {

    //   }
    // });
    this.setData({ 
      globalData: app.globalData,
      id:options.id,
    })
    var id = options.id;
    if (!app.globalData.user_msg) {
      app.globalData.temp_url = '/pages/product/chanpin_hexiao/chanpin_hexiao?id=' + id
      wx.redirectTo({
        url: '/pages/product/login/login',
      })
    }
    this.view(id);
    wx.setNavigationBarTitle({
      title: '产品核销'
    })
  },

  // 点击事件
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.view.gsxx.kefu_phone
    })
  },

  view: function (id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/chanpin_hexiao',
      data: {
        id: id,
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        if (res.data.code == 501) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/product/index/index',
                })
              }
            }
          })
        } else {
          if (res.data.res.peisong_type == 0) {
            wx.showModal({
              title: '提示',
              content: '该订单为快递订单，不支持核销',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/product/index/index',
                  })
                }
              }
            })
          } else {
            that.setData({
              view: res.data,
            })
          }
        }
      }
    })
  },

  //提现发货
  txfh: function (res) {
    var id = res.currentTarget.id;
    var that = this;
    wx.request({
      url: that.data.globalData.domain + '/wxxcx/member/txfh',
      data: {
        'id': id,
        'member_id': that.data.globalData.user_msg.id
      },
      method: 'post',
      success(res) {
        if (res) {
          wx.showToast({
            title: '提醒成功',
          })
        }
      }
    })
  },

  //付款
  tijiao: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '该操作不可逆，请确认',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.globalData.domain + '/wxxcx/member/shouhuo_confirm',
            data: {
              'id': that.data.id,
              'hexiao_member_id': that.data.globalData.user_msg.id,
              'form_id': '',
            },
            method: 'post',
            success(res1) {
              if (res1.data) {
                wx.showToast({
                  title: '核销成功',
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/product/index/index',
                  })
                }, 2000)
              }
            }
          })
        }
      }
    })
  },

  onShow: function () {
    
  },
})