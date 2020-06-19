var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
    value:'',
    type:'',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    this.setData({ globalData: app.globalData, type: type })
    this.view(this.data.globalData.user_msg.id, type);
    wx.setNavigationBarTitle({
      title: '用户中心'
    })
  },

  view: function (member_id, type) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/member',
      data: {
        member_id: member_id
      },
      success(res) {
        that.setData({ 'view': res.data })
        if (type == 'name') {
          that.setData({value:res.data.res.name})
        }
        if (type == 'summary') {
          that.setData({ value: res.data.res.summary })
        }
        if (type == 'phone') {
          that.setData({ value: res.data.res.phone })
        }
      }
    })
  },

  edit_user:function(){
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/edit_user',
      data: {
        member_id: that.data.globalData.user_msg.id,
        type:that.data.type,
        value:that.data.value
      },
      method:'post',
      success(res) {
        if (res.data) {
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/member/member/member',
            })
          }, 2000)

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

  summary: function (e) {
    this.setData({
      value: e.detail.value
    });
  }
})