// pages/carlist/carlist.js
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
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.view();
    wx.setNavigationBarTitle({
      title: '我的浏览'
    })
    
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/product_liulan',
      data: {
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        console.log(res.data)
        that.setData({ 'view': res.data });
      }
    })
  },

  //删除浏览
  del: function (event) {
    var that = this;
    var id = event.currentTarget.id;
    var key = event.currentTarget.dataset.key;
    console.log(key)
    wx.showModal({
      title: '删除浏览',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.globalData.domain + '/wxxcx/member/del_product_liulan',
            data: {
              id: id,
              // member_id: that.data.globalData.user_msg.id
            },
            success(res) {
              if (res.data) {
                var temp = that.data.view;
                temp.res[key].showhide = 0;
                that.setData({'view':temp})
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

  }
})