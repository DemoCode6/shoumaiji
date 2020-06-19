var app = getApp();
Page({
  data: {
    imgUrls: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    hiddenName: false,
    goumaiHidden: false,
    canshuHidden: false,
    fuwuHidden: false,
    soucang_img: '', //搜藏图标
    condition: 0,
    tuanzhang_id: 0,
    order_id:0,

    globalData: app.globalData,
    view: '',
    shuxingming: '', //属性名属性值
    shuxingmingshuxingzhi_result: '', //根据属性名属性值返回的价格
    number: 1, //购买数量
    flag: 0, //是否可以购买或加入购物车
    pintuan:'',

    img_path: '',  // 画布图片
    img: "",  //头像
    erweima: "",  //二维码
    picss: "",  //产品图
    hidden: 0, //展示隐藏
  },

  jump:function(){
    wx.switchTab({
      url: '/pages/member/gwc/gwc',
    })
  },

  jump1: function () {
    wx.switchTab({
      url: '/pages/product/index/index',
    })
  },

  onLoad: function(options) {
    var that = this;
    this.setData({globalData: app.globalData})
    if (options.order_id) {
      this.setData({'order_id': options.order_id})
    }
    if (options.id) {
      var id = options.id;
    }
    if (options.q) {
      var str = unescape(options.q);
      var reg = /[1-9][0-9]*/g;
      var id = str.match(reg)[0];
    }
    if (options.tuijian_id) {
      app.globalData.tuijian_id = options.tuijian_id
    }
    if (!app.globalData.user_msg) {
      app.globalData.temp_url = '/pages/product/detail/detail?id='+id
      wx.redirectTo({
        url: '/pages/product/login/login',
      })
    }
    this.view(id);
    //绑定推荐人
    if (options.tuijian_id ) {
      this.save_tuijian(options.tuijian_id);
    }
    if (this.data.globalData.tuijian_id && this.data.globalData.user_msg.tuijian_id == 0) {
      this.save_tuijian(this.data.globalData.tuijian_id);
      app.globalData.tuijian_id = 0;
    }
    //保存头像
    wx.downloadFile({
      url: app.globalData.img_domain + '/' + app.globalData.user_msg.img,
      success: function (res) {
        that.setData({
          img: res.tempFilePath
        });
      }
    })
    this.setData({
      widthN: wx.getSystemInfoSync().windowWidth - 30,
    })
  },

  // 点击事件
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.view.gsxx.kefu_phone
    })
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

  view: function(id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/detail',
      data: {
        'id': id,
        'member_id': that.data.globalData.user_msg.id,
        'order_id':that.data.order_id
      },
      success(res) {
        //更改搜藏图标
        if (res.data.is_shoucang == 0) {
          var temp = that.data.globalData.static_domain + 'i4.png';
        } else {
          var temp = that.data.globalData.static_domain + 'star.png';
        }
        var str = res.data;
        that.setData({
          'view': str,
          'imgUrls': res.data.res.getimages,
          'shuxingming': res.data.shuxingming,
          'shuxingmingshuxingzhi_result': {
            'price': res.data.res.price,
            'mingzhi_name': '请选择 产品规格'
          },
          'soucang_img': temp,
          'condition': res.data.res.condition,
        })
        //保存二维码
        console.log(app.globalData.img_domain + '/' + res.data.img_path);
        wx.downloadFile({
          url: app.globalData.img_domain + '/' + res.data.img_path,
          success: function (res) {
            console.log(res);
            that.setData({
              erweima: res.tempFilePath,
            });
          }
        })
        // 保存产品图
        console.log(app.globalData.img_domain + '/' + res.data.res.img)
        wx.downloadFile({
          url: app.globalData.img_domain + '/' + res.data.res.img,
          success: function (res) {
            that.setData({
              picss: res.tempFilePath,
            });
          }
        })
        wx.setNavigationBarTitle({
          title: res.data.res.name
        })
        if (res.data.pintuan_list != '') {
          setInterval(function() {
            var pintuan_list = that.data.view.pintuan_list;
            for (var i = 0; i < pintuan_list.length; i++) {
              var shengyu_time = parseInt(that.time_to_sec(pintuan_list[i].shengyu_time));
              if (shengyu_time < 1) {
                //倒计时到了
                pintuan_list.splice(i,1);
                return;
              }
              var formattime = that.sec_to_time(shengyu_time - 1);
              pintuan_list[i].shengyu_time = formattime;
            }
            that.setData({'view.pintuan_list': pintuan_list});
          }, '1000')
        }

        //点击链接过来的拼团
        if (res.data.order) {
          console.log(res.data.order)
          if (res.data.order == 1) {
            wx.showToast({
              title: '该单已结束，请重新购买',
            })
          } else {
            that.setData({ 'pintuan': res.data.order, 'tuanzhang_id': res.data.order.tuanzhang_id });
            that.__single_order(res.data.order.condition);
          }
        }
      }
    })
  },

  time_to_sec: function(time) {
    var s = '';
    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];
    s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s;
  },

  sec_to_time: function(s) {
    var t;
    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        t = '0' + hour + ":";
      } else {
        t = hour + ":";
      }
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec.toFixed(0);
    }
    return t;
  },

  //购买
  single_order: function(options) {
    var condition = options.currentTarget.dataset.condition;
    this.setData({ 'pintuan': '', 'tuanzhang_id':0});
    this.__single_order(condition);
  },

  //拼团
  pintuan: function(options){
    console.log('hehehehehe'+options.currentTarget.dataset);
    this.setData({ 'pintuan': options.currentTarget.dataset, 'tuanzhang_id':options.currentTarget.dataset.tuanzhang_id});
    this.__single_order(options.currentTarget.dataset.condition);
  },

  __single_order:function(condition){
    var that = this;
    this.setData({
      'hiddenName': true,
      'goumaiHidden': true,
      'canshuHidden': false,
      'fuwuHidden': false,
      'condition': condition
    });
    if (this.data.view.res.condition == 2) {
      wx.request({
        url: this.data.globalData.domain + '/wxxcx/product/getprice_by_shuxingzhi',
        data: {
          'str': this.data.shuxingming,
          'condition': condition,
          'member_id': that.data.globalData.user_msg.id
        },
        'method': 'post',
        success(res) {
          console.log(res.data.res);
          if (res.data.res != '') {
            that.setData({
              shuxingmingshuxingzhi_result: res.data.res,
              'flag': 1
            });
          }
        }
      })
    }
  },


  //点击属性值获取价格
  shuxingzhi: function(options) {
    var that = this;
    var shuxingming_id = options.currentTarget.dataset.shuxingming_id; //属性名id
    var shuxingzhi_id = options.currentTarget.dataset.shuxingzhi_id; //属性值id
    var temp = 'shuxingming.' + shuxingming_id;
    this.setData({
      [temp]: shuxingzhi_id
    })
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/getprice_by_shuxingzhi',
      data: {
        'str': this.data.shuxingming,
        'condition': this.data.condition,
        'member_id': that.data.globalData.user_msg.id
      },
      'method': 'post',
      success(res) {
        console.log(res.data.res);
        if (res.data.res != '') {
          that.setData({
            shuxingmingshuxingzhi_result: res.data.res,
            'flag': 1
          });
        }
      }
    })

  },

  onShow: function () {
    var that = this;
    var aa = setInterval(function () {
      if (that.data.img != '' && that.data.erweima != '' && that.data.picss) {
        that.canvasImg();
        clearInterval(aa)
      }
    }, 200)
  },

  //加入购物车
  gwc: function() {
    var that = this;
    if (this.data.flag == 0) {
      wx.showToast({
        title: '请选择产品',
      })
      return;
    }
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/jr_gwc',
      data: {
        'shuxingming_shuxingzhi_id': this.data.shuxingmingshuxingzhi_result.id,
        'product_id': this.data.view.res.id,
        'number': this.data.number,
        'condition': this.data.view.res.condition,
        'member_id': this.data.globalData.user_msg.id
      },
      'method': 'post',
      success(res) {
        wx.showToast({
          title: res.data.msg,
        })
        if (res.data.code == 1) {
          console.log('hhe');
          var temp = 'view.gwc_number';
          that.setData({
            [temp]: that.data.view.gwc_number + 1
          })
        }
      }
    })
  },

  //加入
  buy: function() {
    var that = this;
    if (this.data.flag == 0) {
      wx.showToast({
        title: '请选择产品',
      })
      return;
    }
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/single_order',
      data: {
        'shuxingming_shuxingzhi_id': this.data.shuxingmingshuxingzhi_result.id,
        'product_id': this.data.view.res.id,
        'number': this.data.number,
        'condition': this.data.condition,
        'member_id': this.data.globalData.user_msg.id,
        'tuanzhang_id': this.data.tuanzhang_id,
        type: that.data.view.res.type,
      },
      'method': 'post',
      success(res) {
        if (parseInt(res.data)) {
          app.globalData.buy_order = res.data;
          wx.navigateTo({
            url: '/pages/product/buy/buy',
          })
        } else {
          wx.showToast({
            title: res.data,
          })
        }
      }
    })
  },

  //收藏产品
  sc: function() {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/product/shoucang',
      data: {
        'product_id': this.data.view.res.id,
        'member_id': this.data.globalData.user_msg.id,
        'status': this.data.view.is_shoucang
      },
      'method': 'post',
      success(res) {
        wx.showToast({
          title: res.data.msg,
        })
        if (res.data.code == 1) {
          var temp = that.data.globalData.static_domain + 'star.png';
          var temptemp = 'view.is_shoucang';
          that.setData({
            soucang_img: temp,
            [temptemp]: 1
          })
        }
        if (res.data.code == 2) {
          var temp = that.data.globalData.static_domain + 'i4.png';
          var temptemp = 'view.is_shoucang';
          that.setData({
            soucang_img: temp,
            [temptemp]: 0
          })
        }
      }
    })
  },

  //增加数量
  jia: function() {
    this.setData({
      number: this.data.number + 1
    });
  },

  //减少数量
  jian: function() {
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number - 1
      });
    }
  },

  //参数展示
  canshu: function(options) {
    this.setData({
      'hiddenName': true,
      'goumaiHidden': false,
      'canshuHidden': true,
      'fuwuHidden': false
    });
  },

  //服务展示
  fuwu: function(options) {
    this.setData({
      'hiddenName': true,
      'goumaiHidden': false,
      'canshuHidden': false,
      'fuwuHidden': true
    });
  },

  //关闭选择
  clickOff: function(e) {
    this.setData({
      'hiddenName': false,
      'goumaiHidden': false,
      'canshuHidden': false,
      'fuwuHidden': false
    });
  },

  onShareAppMessage: function() {
    console.log('/pages/product/detail/detail?id=' + this.data.view.res.id + '&tuijian_id=' + this.data.globalData.user_msg.id)
    return {
      title: '亲，' + '看看'+ this.data.view.res.name + ',我刚买了，很好的',
      imageUrl: this.data.globalData.img_domain + '/compress/' + this.data.view.res.img,
      path: '/pages/product/detail/detail?id=' + this.data.view.res.id + '&tuijian_id=' + this.data.globalData.user_msg.id
    }
  },

  hbewm: function () {
    var that = this;
    this.setData({
      hidden: true,
    })
    if (that.data.img_path == '') {
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'firstCanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
              img_path: tempFilePath,
            });

          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 2000);
    }
  },

  drawFont: function (ctx, content, x, y, color, font) {

    let tmpColor = color ? color : "blue"
    let tmpFont = font ? font : '14'
    ctx.setFontSize(tmpFont);
    ctx.setFillStyle(tmpColor);
    ctx.fillText(content, x, y);
  },

  canvasImg() {
    var that = this;
    var headPic = this.data.img;
    var widthN = wx.getSystemInfoSync().windowWidth - 50;
    var context = wx.createCanvasContext('firstCanvas');
    var x = (widthN + 20) / 2;

    const grd = context.createLinearGradient(0, 0, 384, 0);
    context.setFillStyle("#fff");
    context.fillRect(0, 0, wx.getSystemInfoSync().windowWidth, 600);
    // --------------头 像 --------------
    context.drawImage(headPic, 11.5, 11.5, 53, 53);
    // --------------产品图 --------------
    context.drawImage(that.data.picss, (widthN - 315/1.5)/2, 80, 315 / 1.5, 315 / 1.5);
    context.textAlign = 'left';
    context.setFontSize(14)
    context.setFillStyle("#000");
    context.fillText(app.globalData.user_msg.name, 80, 34)

    context.setFontSize(12)
    context.setFillStyle("#8c8c8c");
    context.fillText('邀您查看', 80, 60)
    context.textAlign = 'center';
    that.drawFont(context, that.data.view.res.name, x, 310, '#8c8c8c', 12); //昵称
    // --------------二维码 --------------
    context.drawImage(that.data.erweima, 31, 320, widthN * 0.32, widthN * 0.32);
    // --------------二维码 --------------
    context.drawImage('/pages/images/mingpsb.png', widthN * 0.55, 320, widthN * 0.42, 121);
    context.draw();
  },

  saveImg() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.img_path,
      success(res) {
        that.setData({
          hidden: false
        })
      }
    })
  },

  quxiao:function(){
    this.setData({
      hidden:false,
    })
  }
})