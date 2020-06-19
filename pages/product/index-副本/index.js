var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    globalData: app.globalData,
    search: '',
    view: '',
    footer: ['s2.png', 'c1.png', 'g1.png', 'm11.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: app.globalData.domain + '/wxxcx/member/save_options',
      data: {
        options: options,
        type: 'index',
      },
      method: 'post',
      success: function(res) {

      }
    });
    this.setData({
      globalData: app.globalData
    })
    if (options.query) {
      app.globalData.tuijian_id = options.query;
    }
    //绑定推荐人
    if (options.query) {
      this.save_tuijian(options.query);
    }
    // var options = {'scene':'chanpin_hexiao%3D76'};
    if (options.scene) {
      var aa = unescape(options.scene);
      var cc = this.explode('=', aa, '');
      if (cc[0] == 'chanpin_hexiao') {
        wx.navigateTo({
          url: '/pages/product/chanpin_hexiao/chanpin_hexiao?id=' + cc[1],
        })
      }
      if (cc[0] == 'dianyuan_saoma') {
        wx.navigateTo({
          url: '/pages/product/dianyuan_saoma/dianyuan_saoma?id=' + cc[1],
        })
      }
    }
  },

  explode:function (separators, inputstring, includeEmpties) {
    inputstring = new String(inputstring);
    separators = new String(separators);

    if (separators == "undefined") {
      separators = " :;";
    }
    var  fixedExplode = new Array(1);
    var currentElement = "";
    var count = 0;

    for (var x = 0; x < inputstring.length; x++) {
      var str = inputstring.charAt(x);
      if (separators.indexOf(str) != -1) {
        if (((includeEmpties <= 0) || (includeEmpties == false)) && (currentElement == "")) {

        } else {
          fixedExplode[count] = currentElement;
          count++;
          currentElement = "";
        }
      } else {
        currentElement += str;
      }
    }

    if ((!(includeEmpties <= 0) && (includeEmpties != false)) || (currentElement != "")) {
      fixedExplode[count] = currentElement;
    }
    return fixedExplode;
  },

  //保存推荐人
  save_tuijian: function(tuijian_id) {
    var that = this
    wx.request({
      url: that.data.globalData.domain + '/wxxcx/product/save_tuijianren',
      data: {
        'tuijian_id': tuijian_id,
        'member_id': that.data.globalData.user_msg.id
      },
      success(res) {

      }
    })
  },

  view: function() {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/index',
      success(res) {
        that.setData({
          'view': res.data,
          'imgUrls': res.data.banner
        })
        console.log(res.data);
      }
    })
  },

  xilie: function(e) {
    app.globalData.product_type_id = e.currentTarget.id;

    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  search_product: function(e) {
    app.globalData.search = this.data.search;
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  search_product1: function(e) {
    app.globalData.search = e.currentTarget.id;
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  jump: function() {
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  jump1: function() {
    wx.switchTab({
      url: '/pages/member/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.view();
    app.globalData.type = 0;
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

  },

  //留言
  search: function(e) {
    this.setData({
      search: e.detail.value
    });
  },

  miaosha: function() {
    app.globalData.search = '特惠';
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  member_card: function() {
    wx.navigateTo({
      url: '/pages/product/member_card/member_card',
    })
  }
})