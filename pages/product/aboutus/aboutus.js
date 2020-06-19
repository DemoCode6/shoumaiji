var app = getApp();
Page({

  data: {
    globalData: app.globalData,
    view: '',
    file_name:'',
  },

  onLoad: function (options) {
    this.setData({ 
      globalData: app.globalData,
      file_name: options.file_name, 
    })
    this.view();
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/other/aboutus',
      data:{
        file_name:that.data.file_name,
      },
      method:'post',
      success(res) {
        that.setData({view: res.data});
      }
    })
  },

  onShareAppMessage: function () {

  },

  home:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  back:function(){
    wx.navigateBack();
  }
})