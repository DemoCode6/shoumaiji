var app = getApp();
var tcity = require("../../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    address: '',
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    is_moren:1,
    id:0,  //积分商城id,
    
    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  //提交表单
  formSubmit(e) {
    var that =this;
    var data1 = e.detail.value;
    data1.address = this.data.province + ' ' + this.data.city + ' ' + this.data.county;
    data1.is_moren = 1;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (data1.name == '') {
      wx.showToast({
        title: '请输入姓名',
      })
      return false;
    }
    if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(data1.phone))) {
      wx.showToast({
        title: '手机号码有误，请重填',
      })
      return false;
    }
    if (data1.address_detail == '') {
      wx.showToast({
        title: '请输入详细地址',
      })
      return false;
    }

    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/address_add',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        member_id: app.globalData.user_msg.id,
        data: data1
      },
      method: "post",
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 200) {
          console.log(res.data.content)
          wx.showToast({
            title: '修改成功',
            success: function (res) {
              if (that.data.id) {
                wx.redirectTo({
                  url: '/pages/member/jfshop_detail/jfshop_detail?id='+that.data.id,
                })
              } else {
                wx.redirectTo({
                  url: '/pages/member/address/address',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '修改失败'
          })
        }
      }
    })
  },

  moren: function () {
    this.setData({ 'is_moren': !this.data.is_moren })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ globalData: app.globalData })
    this.setData({'id':options.id})
    console.log("onLoad");
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');
    wx.setNavigationBarTitle({
      title: '地址管理'
    })
  },

  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },


  open: function () {
    this.setData({
      condition: !this.data.condition
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