// pages/gwc/gwc.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
    quanxuan:false,
    total:0, //总金额
    type:1,
  },

  //单选全选
  itemSelected: function (e) {
    console.log(e)
    var key = e.currentTarget.id;
    if (key == -1) {
      var view = this.data.view;
      var quanxuan = !this.data.quanxuan;
      for (var i=0; i<view.res.length; i++){
        if (this.data.type == view.res[i].getproduct['type']) {
          view.res[i].isSelected = quanxuan;
        this.setData({'quanxuan':quanxuan})
        }
      }
    } else {
      var view = this.data.view;
      view.res[key].isSelected = !view.res[key].isSelected; 
    }
    this.setData({ 'view': view })
    this.gettotal();
  },

  //增加数量
  jia: function (e) {
    var key = e.currentTarget.id;
    var view = this.data.view;
    view.res[key].number = parseInt(view.res[key].number) + 1;
    view.res[key].isSelected = true;
    this.setData({view:view});
    this.gettotal();
  },

  //减少数量
  jian: function (e) {
    var key = e.currentTarget.id;
    var view = this.data.view;
    if (view.res[key].number > 1) {
      view.res[key].number = parseInt(view.res[key].number) - 1;
      view.res[key].isSelected = true;
      this.setData({ view: view });
      this.gettotal();
    }
  },

  //计算总金额
  gettotal:function(){
    var view = this.data.view;
    var total = 0;
    for (var i = 0; i < view.res.length; i++) {
      if (view.res[i].isSelected == true && view.res[i].showhide == true) {
        total += view.res[i].number * view.res[i].price;
      }
    }
    console.log(total.toFixed(2))
    this.setData({ total: total.toFixed(2) });
  },

  //提交订单
  many_order:function(){
    var view = this.data.view;
    var that = this;
    var str = '';
    for (var i = 0; i < view.res.length; i++) {
      if (view.res[i].isSelected == true && view.res[i].showhide == true) {
        var id = view.res[i].getproduct.id;
        var taozhuang = view.res[i].shuxingming_shuxingzhi_id;
        var number = view.res[i].number;
        str += id + ':' + number + ':' + taozhuang + '#';
      }
    }
    console.log(str)
    if (str == '') {
      wx.showToast({
        title: '请选择产品',
      })
      return;
    }
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/make_order',
      data: {
        str: str,
        member_id: that.data.globalData.user_msg.id
      },
      method:'post',
      success(res) {
        if (res.data.code == 200) {
          app.globalData.buy_order = res.data.msg;
          console.log(res.data.msg);
          console.log(app.globalData)
          wx.navigateTo({
            url: '/pages/product/buy/buy',
          })
        } else if (res.data.code == 201) {
          wx.showToast({
            title: '商品已下架',
          })
        } else if (res.data.code == 202) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            title: '系统繁忙，请重新操作',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
   
    wx.setNavigationBarTitle({
      title: '购物车'
    })
  },

  view: function () {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/gwc',
      data: {
        member_id: that.data.globalData.user_msg.id
      },
      success(res) {
        console.log(res.data)
        that.setData({'view': res.data});
      }
    })
  },

  del: function (event) {
    var that = this;
    var id = event.currentTarget.id;
    var key = event.currentTarget.dataset.key;
    wx.showModal({
      title: '删除购物车',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.globalData.domain + '/wxxcx/member/del_gwc',
            data: {
              id: id,
              member_id: that.data.globalData.user_msg.id
            },
            success(res) {
              if (res.data) {
                var temp = 'view.res[' + key + '].showhide'
                that.setData({ [temp]: 0 })
                wx.showToast({
                  title: '删除成功',
                })
                that.gettotal();
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
  onShow: function () {
    this.view();
  },

  onchange:function(e){
    var id = e.currentTarget.id;  
    var view = this.data.view;
    for (var i=0; i<view.res.length; i++) {
      view.res[i].isSelected = false
    }
    this.setData({
      type: id,
      view:view,
      quanxuan:false,
    })
    this.gettotal()
  },
})