//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    isHide: false,

    globalData: app.globalData,
    search: '',
    view: '',
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/member/save_options',
      data: {
        options: options,
        type: 'index',
      },
      method: 'post',
      success: function (res) {

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
      var aa = unescape(options.scene);
      // var aa = 'product=67&member_id=65';
      var cc = this.explode('&', aa, '');
      var pages = this.explode('=', cc[0], '');
      var member_id = this.explode('=', cc[1], '');
      if (pages[0] == 'product') {
        wx.navigateTo({
          url: '/pages/product/detail/detail?id=' + pages[1] + '&tuijian_id=' + member_id[1],
        })
      }
    }
    wx.request({
      url: app.globalData.domain + '/wxxcx/product/youhuiquan_center',
      success: function (res) {
        if (res.data) {
          that.setData({
            isHide: true,
          })
        }
      }
    });
  },

  onShareAppMessage:function(){

  },

  explode: function (separators, inputstring, includeEmpties) {
    inputstring = new String(inputstring);
    separators = new String(separators);

    if (separators == "undefined") {
      separators = " :;";
    }
    var fixedExplode = new Array(1);
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

  onShow: function () {
    this.view();
    app.globalData.type = 0;
  },

  showModal() {
    this.setData({
      isHide: true
    })
  },

  hideModal(e) {
    this.setData({
      isHide: false
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/index',
      success(res) {
        that.setData({
          'view': res.data,
          'imgUrls': res.data.banner
        })
      }
    })
  },

  jump1:function(e){
    var url = e.currentTarget.dataset.url;
    console.log(url);
    wx.navigateTo({
      url: url,
    })
  },

  xilie: function (e) {
    app.globalData.search = e.currentTarget.id;
    app.globalData.product_type_id = 0;
    app.globalData.is_fresh = 1;
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  xilie1: function (e) {
    app.globalData.product_type_id = e.currentTarget.id;
    app.globalData.search = '';
    app.globalData.is_fresh = 1;
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },

  youhuiquan_center:function(){
    wx.navigateTo({
      url: '/pages/member/youhuiquan_center/youhuiquan_center',
    })
  },

  //留言
  search: function (e) {
    this.setData({
      search: e.detail.value
    });
  },

  search_product: function (e) {
    app.globalData.search = this.data.search;
    wx.switchTab({
      url: '/pages/product/xilie/xilie',
    })
  },
})
