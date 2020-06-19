var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
    id:'',
    type:'',
    page: 0,
    res:[],
    bottom:false,

    footer: ['s1.png', 'c2.png', 'g1.png', 'm11.png'],
  },

  jump: function () {
    wx.switchTab({
      url: '/pages/member/gwc/gwc',
    })
  },

  jump1: function () {
    wx.switchTab({
      url: '/pages/product/index/index',
    })
  },

  // 点击事件
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.view.gsxx.kefu_phone
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    console.log(1)
    this.view(options.id, options.type);
  },

  onchange: function (e) {
    var id = e.currentTarget.id;
    this.handeldata(id)
  },

  handeldata: function (id) {
    console.log('haha')
    var res = this.data.res;

    for (var i = 0; i < res.length; i++) {
      res[i].showhide = 0;
      if (id == 0 || id == 1) {
        res[i].showhide = 1;
      }
      if (id == 2) {
        res[i].has_zhuiping == 1 ? res[i].showhide = 1 : '';
      }
      if (id == 3) {
        res[i].has_images == 1 ? res[i].showhide = 1 : '';
      }
      if (id == 4) {
        if (res[i].xingji == 4 || res[i].xingji == 5) {
          res[i].showhide = 1
        }
      }
      if (id == 5) {
        res[i].xingji == 3 ? res[i].showhide = 1 : '';
      }
      if (id == 6) {
        if (res[i].xingji == 1 || res[i].xingji == 2) {
          res[i].showhide = 1
        }
      }
    }
    this.setData({ res: res, type: id })
  },

  view: function (id, type=0) {
    var that = this;
    that.setData({'id': id, 'type':type})
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/pingjia',
      data: {
        'id': id,
        'member_id': that.data.globalData.user_msg.id,
        'type':type,
        'page':that.data.page
      },
      success(res) {
        var str = res.data.res;
        that.setData({ 'view': res.data, 'res': that.data.res.concat(str), 'page': that.data.page+1})
        if (res.data.res.length == 0) {
          that.setData({'bottom': true})
        }
        that.handeldata(type)
      }
    })
    wx.setNavigationBarTitle({
      title: '评价'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('hehe')
    this.view(this.data.id, this.data.type);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})