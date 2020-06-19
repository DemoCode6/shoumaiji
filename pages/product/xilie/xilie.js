var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    search: '',
    product: [],
    yiji_product_type: [], //一级分类
    product_type_id: 0,   //选中的一级分类
    erji_product_type: [], //二级分类
    product_erji_type_id: 0,   //选中的二级分类
    page:0,
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '产品中心'
    })
  },

  onShow: function () {
    if (app.globalData.is_fresh) {
      app.globalData.is_fresh = 0;
      this.setData({
        product:[],
        page:0,
        search:app.globalData.search,
        globalData: app.globalData,
        product_type_id:app.globalData.product_type_id,
      })
      this.view();
    }
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/xilie',
      data:{
        search:that.data.search,
        page:that.data.page,
        product_type_id:that.data.product_type_id,
        product_erji_type_id: that.data.product_erji_type_id,
        search:that.data.search,
      },
      method:'post',
      success(res) {
        that.setData({
          product: that.data.product.concat(res.data.product),
          yiji_product_type: res.data.yiji_product_type,
          erji_product_type: res.data.erji_product_type,
          page:that.data.page+1,
        })
      }
    })
  },

  //点击一级栏目
  yiji_click:function(e){
    this.setData({
      product_type_id:e.currentTarget.id,
      product:[],
      product_erji_type_id: 0,
      page:0,
    })
    this.view();
  },

  //点击二级栏目
  erji_click: function (e) {
    this.setData({
      product_erji_type_id: e.currentTarget.id,
      product: [],
      page: 0,
    })
    this.view();
  },
  
  onReachBottom: function () {
    this.view();
  },
  
  onShareAppMessage: function () {

  },

  jujiao: function () {
    this.setData({
      jujiao: true,
    })
  },
  // 取消
  delete() {
    this.setData({
      search: '',
      jujiao: false,
      page:0,
      product:[],
    })
    this.view();
  },

  // 键盘搜索
  search(e) {
    this.setData({
      search: e.detail.value,
      product:[],
      page:0,
    })
    this.view();
  },
})