var app = getApp();
Page({

  data: {
    globalData:'',
    id:0,  //卡包id   member_card_list表id
    member_card_list:'',
    money:0, //输入的金额
    jifen:0, //积分
    fanli:0, //可得返利
    summary:'',
    member_card_fuli:[],

    fuli_summary:'',
    type:0, // 0 线下消费  1 会员福利
  },

  onLoad: function (options) {
    this.setData({
      id:options.id,
    })
    if (!app.globalData.user_msg) {
      app.globalData.temp_url = '/pages/product/dianyuan_saoma/dianyuan_saoma?id=' + id
      wx.redirectTo({
        url: '/pages/product/login/login',
      })
    }
  },

  onShow: function () {
    this.setData({
      globalData:app.globalData,
    })
    this.view();
  },

  view:function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/product/dianyuan_saoma',
      data: {
        member_id: app.globalData.user_msg.id,
        member_card_list_id: that.data.id,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 501) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/product/index/index',
                })
              }
            }
          })
        } else {
          that.setData({
            member_card_list:res.data.member_card_list,
            member_card_fuli:res.data.member_card_fuli,
          })
        }
      }
    });
  },

  money:function(e) {
    var money = e.detail.value;
    this.setData({
      money:money,
      jifen:(money/10).toFixed(0),
      fanli:(money*this.data.member_card_list.getcard.xianxia_zigou_fanli/100).toFixed(2),
    })
  },

  summary: function (e) {
    var summary = e.detail.value;
    this.setData({
      summary: summary,
    })
  },

  fuli_summary: function (e) {
    var fuli_summary = e.detail.value;
    this.setData({
      fuli_summary: fuli_summary,
    })
  },

  //付款
  tijiao:function(){
    var that = this;
    console.log(Number(that.data.money))
    if (that.data.jifen == 'NaN') {
      wx.showToast({
        title: '请输入金额',
      })
      return false;
    }
    if (that.data.summary == '') {
      wx.showToast({
        title: '请输入备注',
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '您输入的金额是' + that.data.money + '元,请确认，该操作不可逆！！！',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/wxxcx/product/xianxia_xiaofei_queren',
            data: {
              money: that.data.money,
              summary: that.data.summary,
              saoma_member_id: app.globalData.user_msg.id,
              member_id: that.data.member_card_list.getmember.id,
              member_card_id:that.data.member_card_list.member_card_id,
            },
            method: 'post',
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '操作成功',
                })
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/product/index/index',
                  })
                }, 2000)
              }else {
                wx.showToast({
                  title: '操作失败',
                })
              }
            }
          });
        }
      }
    })
  },

  //付款
  fuli_tijiao: function () {
    var that = this;
    if (that.data.fuli_summary == '') {
      wx.showToast({
        title: '请输入客户领取物品',
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '您输入的是' + that.data.fuli_summary + ',请确认，该操作不可逆！！！',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/wxxcx/product/fuli_lingqu',
            data: {
              fuli_summary: that.data.fuli_summary,
              saoma_member_id: app.globalData.user_msg.id,
              member_id: that.data.member_card_list.getmember.id,
              member_card_id: that.data.member_card_list.member_card_id,
            },
            method: 'post',
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '操作成功',
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/product/index/index',
                  })
                }, 2000)
              } else {
                wx.showToast({
                  title: '操作失败',
                })
              }
            }
          });
        }
      }
    })
  },

  changeType:function(e) {
    this.setData({
      type:e.currentTarget.id,
    })
  }

})