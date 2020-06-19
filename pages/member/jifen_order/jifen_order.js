var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view:'',
    type : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.view();
    wx.setNavigationBarTitle({
      title: '订单管理'
    })
  },

  onchange:function(e){
    var id = e.currentTarget.id;  
    this.handeldata(id)
  },

  handeldata:function(id){
    var res = this.data.view.res;

    for (var i = 0; i < res.length; i++) {
      res[i].showhide = 0;
      if (id == -1) {
        res[i].showhide = 1;
      }
      if (id == 0) {
        res[i].status == 0 ? res[i].showhide = 1 : '';
      }
      if (id == 1) {
        res[i].status == 1 ? res[i].showhide = 1 : '';
        res[i].status == 6 ? res[i].showhide = 1 : '';
      }
      if (id == 2) {
        res[i].status == 2 ? res[i].showhide = 1 : '';
      }
      if (id == 3) {
        if (res[i].status == 3 && res[i].has_comment != 2) {
          res[i].showhide = 1
        }
      }
      if (id == 4) {
        if (res[i].status == 3 && res[i].has_comment == 2) {
          res[i].showhide = 1
        }
      }
    }
    var old = this.data.view;
    old.view = res;
    this.setData({ view: old, type: id })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/jifen_order',
      data: {
        member_id:that.data.globalData.user_msg.id
      },
      success(res) {
        console.log(res.data)
        that.setData({ 'view': res.data })
        that.handeldata(-1)
      }
    })
  },

  //确认收货
  shouhuo: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.request({
      url: that.data.globalData.domain + '/wxxcx/member/jifen_order_shouhuo',
      data: {
        'id': id,
        'member_id': that.data.globalData.user_msg.id,
      },
      method: 'post',
      success(res1) {
        if (res1.data) {
          wx.showToast({
            title: '收货成功',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/member/jifen_order/jifen_order',
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
  },
})