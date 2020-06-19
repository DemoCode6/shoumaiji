var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ globalData: app.globalData })
    this.view(this.data.globalData.user_msg.id);
  },

  view: function(member_id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/address',
      data: {
        member_id: member_id
      },
      success(res) {
        that.setData({
          'view': res.data
        })
        console.log(res.data);
      }
    })
    wx.setNavigationBarTitle({
      title: '地址管理'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  //删除地址
  deladdress: function (event) {
    var that = this;
    var id = event.currentTarget.id;
    var key = event.currentTarget.dataset.key;
    console.log(key)
    wx.showModal({
      title: '删除地址',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.globalData.domain + '/wxxcx/member/address_del',
            data: {
              id: id
            },
            success(res) {
              if (res.data) {
                console.log(key)
                var temp = 'view.res[' + key + '].showhide'
                that.setData({
                  [temp]: 0
                })
                wx.showToast({
                  title: '删除成功',
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

  }
})