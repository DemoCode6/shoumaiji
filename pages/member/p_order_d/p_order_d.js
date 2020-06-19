var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData:app.globalData,
    view:'',
    img:'',
    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    var id = options.id;
    this.view(id);
    wx.setNavigationBarTitle({
      title: '订单详情'
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
      url: this.data.globalData.domain + '/wxxcx/member/p_order_d',
      data: {
        id: id,
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        that.setData({ 
          view: res.data,
          img: res.data.img,
        })
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

  //删除订单
  del:function(event){
    var that = this;
    var id = event.currentTarget.id;
    wx.showModal({
      title: '删除订单',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.globalData.domain + '/wxxcx/member/del_order',
            data: {
              id: id,
              member_id: that.data.globalData.user_msg.id
            },
            success(res) {
              if (res.data) {
                wx.redirectTo({
                  url:'/pages/member/orderlist/orderlist?id=0'
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },

  pay_now: function (res) {
    var id = res.currentTarget.id;
    var that = this;
    wx.request({
      url: that.data.globalData.domain + '/wxxcx/member/pay_now',
      data: {
        'id': id,
        'member_id': that.data.globalData.user_msg.id
      },
      success(res) {
        if (res.data.code == 200) {
          app.globalData.buy_order = id;
          wx.redirectTo({
            url: '/pages/product/buy/buy',
          })
        } else if (res.data.code == 501) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success(res1) {
              if (res1.confirm) {
                wx.switchTab({
                  url: '/pages/product/index/index',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success(res1) {
              if (res1.confirm) {
                wx.redirectTo({
                  url: '/pages/product/detail/detail?id=' + res.data.id,
                })
              }
            }
          })
        }
      }
    })
  },

  //确认收货
  submitInfo: function (e) {
    var that = this;
    var id = e.detail.target.id;
    var formId = e.detail.formId;
    wx.request({
      url: that.data.globalData.domain + '/wxxcx/member/shouhuo_confirm',
      data: {
        'id': id,
        'member_id': that.data.globalData.user_msg.id,
        'form_id': formId
      },
      method: 'post',
      success(res1) {
        if (res1.data) {
          wx.showToast({
            title: '收货成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/member/orderlist/orderlist?id=3',
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
  onShareAppMessage: function (e) {
    return {
      title: '发现一款好货，邀你一起拼团，快来参与吧',
      imageUrl: this.data.globalData.img_domain + '/compress/' + this.data.view.res.getdetail[0].getproduct.img,
      path: '/pages/product/detail/detail?id=' + this.data.view.res.getdetail[0].getproduct.id + '&tuijian_id=' + this.data.globalData.user_msg.id + '&order_id=' + this.data.view.res.id
    }
  }
})