var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view:'',

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    wx.setNavigationBarTitle({
      title: '用户中心'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  view: function(member_id){
    var that = this;
    if (app.globalData.user_msg == '') {
      wx.navigateTo({
        url: '/pages/product/login/login',
      })
      return;
    }
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/index',
      data: {
        member_id: member_id
      },
      success(res){
        that.setData({'view': res.data})
        app.globalData.user_msg = res.data.user_msg;
        console.log(res.data);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.view(this.data.globalData.user_msg.id);
  },

  qiandao:function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/member/qiandao',
      data: {
        member_id: app.globalData.user_msg.id,
      },
      method: 'post',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: res.data,
          showCancel: false,
        })
      }
    });
  }
})
