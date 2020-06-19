var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page:0,
  },
  open(e){
    var list=this.data.list;
    var index = e.currentTarget.dataset.index;
    for(var i=0;i<list.length;i++){
      if (i != index){
        list[i].check = false
      }
    }
    list[index].check = !list[index].check
    this.setData({
      list: list
    })
  },
  
  onLoad: function(options) {
    this.setData({
      globalData: app.globalData,
    })
    this.view();
  },

  onShow: function() {

  },

  view: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/message/wenda',
      data: {
        page: that.data.page,
        member_id: app.globalData.user_msg.id,
      },
      method: 'post',
      success: function (res) {
        that.setData({
          list: that.data.list.concat(res.data.list),
          page: that.data.page + 1,
        })
      }
    });
  },
  
  onReachBottom: function() {
    this.view();
  },
})