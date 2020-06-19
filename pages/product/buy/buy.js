var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: app.globalData,
    view: '',
    address_id: 0,
    total: 0,
    original_total: 0,
    liuyan: '',
    youhuiquanHidden: false,
    jifen: 0,
    fanli: 0,
    youhuiquan_user_id: 0,
    youhuiquan_text: '>',
    'youhui_money': 0,
    'man_price': 0,
    pay_type: 0,  
    peisong_type:0, //配送类型 0快递 1自提
    dasuan_dianpu_id:0, //选择自提方式时的店铺id
    dianpu:[],
    ddzt:'到店自提',
    yunfei:'',
    ziti_phone:'', //自提电话
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      globalData: app.globalData
    })
    this.view(app.globalData.buy_order, this.data.globalData.user_msg.id);
    wx.setNavigationBarTitle({
      title: '确认订单'
    })
  },

  view: function(order_id, member_id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/buy',
      data: {
        'order_id': order_id,
        'member_id': member_id
      },
      success(res) {
        if (res.data.code == 200) {
          var address_id = res.data.msg.address ? res.data.msg.address.id : 0;
          that.setData({
            'view': res.data.msg,
            'total': res.data.msg.total,
            'original_total': res.data.msg.total,
            'address_id': address_id,
            'jifen': res.data.msg.jifen,
            'fanli': res.data.msg.fanli,
            'dianpu':res.data.msg.dianpu,
             yunfei: res.data.msg.yunfei,
          })
          that.gettotal();
        } else {
          wx.showToast({
            title: res.data.msg,
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/product/xilie/xilie',
            })
          }, 2000);
        }
        console.log(res.data);
      }
    })
  },

  peisong_select(e) {
    var index = e.currentTarget.dataset.index;
    if (index == 1) {
      this.setData({
        tanHidd: true,
      })
    }
    if (index == 0) {
      this.setData({
        dasuan_dianpu_id: 0,
        ddzt: '到店自提',
      })
    }
    this.setData({
      peisong_type: index
    })
  },

  payselect(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      pay_type: index
    })
  },

  //确认支付
  pay_money: function() {

    var that = this;
    if (this.data.peisong_type == 0 && this.data.address_id == 0) {
      wx.showToast({
        title: '请填写地址',
      })
      return;
    }

    if (this.data.pay_type == 1 && parseFloat(this.data.total) > parseFloat(this.data.globalData.user_msg.account)) {
      wx.showToast({
        title: '余额不足',
      })
      return;
    }

    if (this.data.peisong_type == 1 && this.data.ziti_phone == '') {
      wx.showModal({
        title: '提示',
        content: '请输入联系电话',
        showCancel:false,
      })
      return;
    }

    var str = '';
    for (var i = 0; i < this.data.view.res.getdetail.length; i++) {
      var id = this.data.view.res.getdetail[i].id;
      var number = this.data.view.res.getdetail[i].number;
      str += id + ':' + number + '#';
    }
    if (this.data.pay_type == 0) { //微信支付
      wx.request({
        url: this.data.globalData.domain + '/wxxcx/product/pay_money',
        data: {
          'str': str,
          'id': app.globalData.buy_order,
          'address_id': that.data.address_id,
          'liuyan': that.data.liuyan,
          'youhuiquan_user_id': that.data.youhuiquan_user_id,
          'member_id': that.data.globalData.user_msg.id,
          'peisong_type':that.data.peisong_type,
          'dasuan_dianpu_id': that.data.dasuan_dianpu_id,
          ziti_phone: that.data.ziti_phone,
        },
        method: 'post',
        success(res) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success(res1) {
              wx.showToast({
                title: '支付成功',
              })
              setTimeout(function(){
                wx.redirectTo({
                  url: '/pages/member/orderlist/orderlist?id=1',
                })
              }, 2000)
              
              //发送支付通知
              // wx.requestSubscribeMessage({
              //   tmplIds: ['NTfWuHSUAEN7HMEKSwrnHdyDu4t4Y3vhtrAg5w-YRtU', 'rnfIcuDO-hwET_dTHfbBPB4tLUQykrYATnoonUyn-KU'],
              //   success(res2) {
              //     if (res2.errMsg == 'requestSubscribeMessage:ok') {
              //       wx.request({
              //         url: that.data.globalData.domain + '/wxxcx/product/send_zhifu_tongzhi',
              //         data: {
              //           package: res.data.package,
              //           member_id: that.data.globalData.user_msg.id,
              //           order_id: res.data.order_id
              //         },
              //         method: "post",
              //         success(res) {

              //         }
              //       })
              //     }
                  
              //   }
              // })
            },
            fail(res) {
              wx.showToast({
                title: '支付失败',
              })
            }
          })
        }
      })
    } else { //余额支付
      wx.request({
        url: this.data.globalData.domain + '/wxxcx/product/yue_pay_money',
        data: {
          'str': str,
          'id': app.globalData.buy_order,
          'address_id': that.data.address_id,
          'liuyan': that.data.liuyan,
          'youhuiquan_user_id': that.data.youhuiquan_user_id,
          'member_id': that.data.globalData.user_msg.id,
          'peisong_type': that.data.peisong_type,
          'dasuan_dianpu_id': that.data.dasuan_dianpu_id,
          ziti_phone: that.data.ziti_phone,
        },
        method: 'post',
        success(res) {
          wx.hideLoading();
          if (res.data != 0) {
            app.globalData.user_msg = res.data.member
            wx.showModal({
              title: '支付成功',
              showCancel: false,
              success:function(){
                wx.redirectTo({
                  url: '/pages/member/orderlist/orderlist?id=1',
                })
              }
            })
            // wx.requestSubscribeMessage({
            //   tmplIds: ['NTfWuHSUAEN7HMEKSwrnHdyDu4t4Y3vhtrAg5w-YRtU', 'rnfIcuDO-hwET_dTHfbBPB4tLUQykrYATnoonUyn-KU'],
            //   success(res2) {
            //     if (res2.errMsg == 'requestSubscribeMessage:ok') {
            //       wx.request({
            //         url: that.data.globalData.domain + '/wxxcx/product/send_zhifu_tongzhi',
            //         data: {
            //           member_id: that.data.globalData.user_msg.id,
            //           order_id: res.data.order_id
            //         },
            //         method: "post",
            //         success(res) {

            //         }
            //       })
            //     }
            //     wx.redirectTo({
            //       url: '/pages/member/orderlist/orderlist?id=1',
            //     })
            //   }
            // })
          } else {
            wx.showToast({
              title: '支付失败',
            })
          }
        }
      })
    }

  },

  //增加数量
  jia: function(e) {
    var key = e.currentTarget.id;
    var view = this.data.view;
    view.res.getdetail[key].number = parseInt(view.res.getdetail[key].number) + 1;
    this.setData({
      view: view
    });
    this.gettotal();
  },

  //减少数量
  jian: function(e) {
    var key = e.currentTarget.id;
    var view = this.data.view;
    if (view.res.getdetail[key].number > 1) {
      view.res.getdetail[key].number = parseInt(view.res.getdetail[key].number) - 1;
      this.setData({
        view: view
      });
      this.gettotal();
    }
  },

  //计算总金额
  gettotal: function() {
    var view = this.data.view;
    var total = 0;
    for (var i = 0; i < view.res.getdetail.length; i++) {
      total += view.res.getdetail[i].number * view.res.getdetail[i].getshuxingmingshuxingzhi.price;
    }
    var total = parseFloat((total * app.globalData.user_msg.zekou/100).toFixed(2));
    if (total < parseFloat(this.data.yunfei.mian_money)) {
      var yunfei = this.data.yunfei.yunfei_money;
      total += parseFloat(yunfei);
    }
    this.setData({
      total: total - this.data.youhui_money,
      jifen: parseInt(total),
      original_total: total
    });
    this.getfanli(total);
    if (parseFloat(total) < parseFloat(this.data.man_price)) {
      wx.showToast({
        title: '亲，不符合条件',
      })
      this.setData({
        youhuiquan_user_id: 0,
        youhuiquan_text: '>',
        'youhui_money': 0,
        'man_price': 0
      })
      var view = this.data.view;
      var total = 0;
      for (var i = 0; i < view.res.getdetail.length; i++) {
        total += view.res.getdetail[i].number * view.res.getdetail[i].getshuxingmingshuxingzhi.price;
      }
      var total = parseFloat(total*app.globalData.user_msg.zekou / 100).toFixed(2);
      this.setData({
        total: (total - this.data.youhui_money).toFixed(2),
        jifen: parseInt(total),
        original_total: parseFloat(total).toFixed(2)
      });
      this.getfanli(total);
    }
  },

  //获取返利
  getfanli: function($money) {
    var xilie = this.data.view.res.getdetail;
    var fanli = 0;
    for (var i = 0; i < xilie.length; i++) {
      fanli += parseFloat(xilie[i].fanli * xilie[i].number);
    }
    this.setData({
      fanli: (fanli*app.globalData.user_msg.zekou/100).toFixed(2),
    })
  },

  //优惠券展示
  youhuiquan: function(options) {
    this.setData({
      'youhuiquanHidden': true
    });
  },

  //关闭选择
  clickOff: function(e) {
    this.setData({
      'youhuiquanHidden': false
    });
  },

  //选择优惠券
  xuanze: function(e) {
    var id = e.currentTarget.id;
    var that = this;
    wx.request({
      url: that.data.globalData.domain + '/wxxcx/product/xiaofei_youhuiquan',
      data: {
        'buy_money': that.data.original_total,
        'id': id
      },
      method: 'post',
      success(res) {
        if (res.data.code == 501) {
          wx.showToast({
            title: res.data.msg,
          })
        } else { //符合条件
          that.setData({
            youhuiquan_text: res.data.msg,
            youhuiquan_user_id: id,
            youhui_money: res.data.jian_price,
            man_price: res.data.man_price
          })
          that.gettotal();
          that.clickOff();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //留言
  liuyan: function(e) {
    this.setData({
      liuyan: e.detail.value
    });
  },

  // 开启弹窗
  kaiqitanchuang() {
    this.setData({
      tanHidd: true,
    })
  },
  tan_quxiao() {
    this.setData({
      tanHidd: false,
    })
  },

  select_dianpu:function(e){
    this.setData({
      dasuan_dianpu_id:e.currentTarget.id,
      ddzt:'到店自提（' +e.currentTarget.dataset.name + '）',
    })
    this.tan_quxiao();
  },

  phone:function(e){
    console.log(e)
    this.setData({
      ziti_phone:e.detail.value,
    })
  }
})