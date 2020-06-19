App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.dologin();
  },

  //登录
  dologin: function() {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: that.globalData.domain + '/wxxcx/login/login',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              that.globalData.openid = res.data.openid;
              if (res.data.user_msg) {
                that.globalData.user_msg = res.data.user_msg;
              }
            }
          })
          
        }
      }
    });
  },

  globalData:{
    static_domain:'https://xinyi.pyhdysm.com/static/wx_img/',  //静态网址配置
    domain:'https://xinyi.pyhdysm.com',
    img_domain:'https://xinyi.pyhdysm.com/static',
    // static_domain: 'http://localhost/shoumaiji/public/static/wx_img/',  //静态网址配置
    // domain: 'http://localhost/shoumaiji/public/index.php',
    // img_domain: 'http://localhost/shoumaiji/public/static',
    openid:'',
    tuijian_id:0,
    user_msg:'',
    buy_order:0,
    type:0,
    search:'',
    product_type_id: 0,
    temp_url:'',  //临时url
    dingdan_arr:[], //已选择订单明细
    current_yiji_product_id:0,
    is_fresh:1,
  }
})
