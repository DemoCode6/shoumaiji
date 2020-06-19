var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],

    tuihuo_reason: '',  //评论内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    var id = options.id;
    this.view(id);
    wx.setNavigationBarTitle({
      title: '物流详情'
    })
  },

  view: function (id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/tuihuo',
      data: {
        id: id,
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        that.setData({ 'view': res.data })
        console.log(res.data)
      }
    })
  },

  //退货
  tuihuo:function() {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/tuihuo_sq',
      data: {
        id: that.data.view.res.id,
        member_id: that.data.globalData.user_msg.id,
        tuihuo_reason: that.data.tuihuo_reason
      },
      method:'post',
      success(res) {
        if (res.data) {
          wx.showToast({
            title: '申请成功，请等待',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/member/p_order_d/p_order_d?id='+ that.data.view.res.id,
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '操作失败',
          })
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
  onShareAppMessage: function () {
    
  },

  //退货
  tuihuo_reason: function (e) {
    this.setData({
      tuihuo_reason: e.detail.value
    });
  }
})