var app = getApp();
// 购物车_从底部弹出选择框
var action = '';
var moveY = 200;
var animation = animation = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 400,
  timingFunction: "ease",
  delay: 0
})
animation.translateY(moveY + 'vh').step();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: 1,
    _sost: 1,
    _nav: 1,
    bool: true,
    booleans: true,
    hiddenName: true,
    hiddenpinpai: true,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    num: 1, // input默认是1  
    minusStatus: 'disabled', // 使用data数据对象设置样式名 
    
    // demo
    jiajiannum: 1,
    // 购物车_从底部弹出选择框
    show: false,
    backgroundVisible: false,
    animation: animation,
    bg: 'background',
    

    //我的数据
    current_yiji_product_id: 0, //当前一级分类id
    current_erji_product_id: 0, //当前二级分类id
    current_sanji_product_id: 0, //当前三级分类id
    yiji: [], //一级分类
    erji: [], //二级分类
    sanji: [], //三级分类
    arr: [], //产品列表
    current_product_duoshuxing: '', //当前产品属性属猪
    current_product_shuxingming_shuxingzhi: '',
    dingdan_arr: app.globalData.dingdan_arr, //产品订单列表
    totalPrice: 0, // 总价格
    totalCount: 0, // 总商品数
    nums: 1,  //多规格产品数量
    page:0,
    daodile:0, //是否到底了
  },

  onLoad: function(options) {
    this.setData({
      globalData: app.globalData,
      dingdan_arr: app.globalData.dingdan_arr,
      current_yiji_product_id: app.globalData.current_yiji_product_id,
    })
    wx.setNavigationBarTitle({
      title: '物料中心'
    })
    if (!app.globalData.user_msg) {
      wx.redirectTo({
        url: '/pages/product/login/login',
      })
    }
    this.view();
  },

  onShow: function() {
    
  },

  view: function() {
    this.setData({
      current_yiji_product_id: app.globalData.current_yiji_product_id,
    })
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/kuaijie/xilie',
      data: {
        current_yiji_product_id: that.data.current_yiji_product_id,
      },
      success(res) {
        var data = res.data;
        that.setData({
          yiji: data.yiji,
          erji: data.erji,
          sanji: data.sanji,
          current_yiji_product_id: data.current_yiji_product_id,
          current_erji_product_id: data.current_erji_product_id,
          current_sanji_product_id: data.current_sanji_product_id,
        })
        that.setData({
          page: 0,
          arr: [],
          daodile: 0,
        })
        that.get_products();
      }
    })
  },

  //一级栏目点击事件
  clickNum: function(e) {
    var that = this;
    this.setData({
      current_yiji_product_id: e.target.dataset.num,
      page:0,
      arr:[],
      daodile:0,
    })
    wx.request({
      url: app.globalData.domain + '/wxxcx/kuaijie/get_type_by_yiji',
      data: {
        id: that.data.current_yiji_product_id,
      },
      method: 'post',
      success: function (res) {
        that.setData({
          erji: res.data.erji,
          sanji: res.data.sanji,
          current_erji_product_id: res.data.current_erji_product_id,
        })
        that.get_products();
      }
    });
  },

  clickjiantou: function(i) {
    this.setData({
      bool: !this.data.bool,
      hiddenName: !this.data.hiddenName
    })
  },

  //二级分类点击事件
  clicknav: function(s) {
    var that = this;
    this.setData({
      current_erji_product_id: s.target.dataset.nav,
      page:0,
      arr: [],
      daodile: 0,
    })
    wx.request({
      url: app.globalData.domain + '/wxxcx/kuaijie/get_type_by_erji',
      data: {
        id: that.data.current_erji_product_id,
      },
      method: 'post',
      success: function (res) {
        that.setData({
          sanji: res.data.sanji,
        })
        that.get_products();
      }
    });
  },

  //三级点击事件
  click_sanji: function(s) {
    this.setData({
      current_sanji_product_id: s.target.dataset.sost,
      page:0,
      arr: [],
      daodile: 0,
    })
    this.get_products();
  },

  //获取产品
  get_products:function(){
    if (this.data.daodile == 1) {
      return false;
    }
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/kuaijie/get_products',
      data: {
        page: that.data.page,
        yiji_product_type_id: that.data.current_yiji_product_id,
        erji_product_type_id: that.data.current_erji_product_id,
        sanji_product_type_id: that.data.current_sanji_product_id
      },
      method: 'post',
      success: function (res1) {
        that.setData({
          arr: that.data.arr.concat(res1.data.products),
          page: that.data.page + 1,
        })
        that.product_format();
        if (res1.data.products.length == 0) {  //触底了
          that.setData({
            daodile:1,
          })
        }
      }
    });
  },

  //匹配产品与订单的数据
  product_format:function(){
    var arr = this.data.arr;
    var dingdan_arr = this.data.dingdan_arr;
    this.format_dingdan_arr(dingdan_arr);
    //匹配产品与订单
    for (var i=0; i<dingdan_arr.length; i++) {
      for (var j = 0; j < arr.length; j++) {
        //是单价格 并且id、属性相同
        if (arr[j].product_type == 'single' && dingdan_arr[i].id == arr[j].id && dingdan_arr[i].product_shuxingming_shuxingzhi.id == arr[j].product_shuxingming_shuxingzhi.id) {
          arr[j].number = dingdan_arr[i].number;
        }
      }
    }
    this.setData({
      arr:arr,
    })
  },

  //清空购物车
  qingkong:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定清空购物车吗？',
      success(res) {
        if (res.confirm) {
          that.setData({
            dingdan_arr: [],
            page: 0,
            arr: [],
            daodile: 0,
          })
          app.globalData.dingdan_arr = [];
          that.get_products();
        } else if (res.cancel) {
          
        }
      }
    })
  },

  //加载更多
  scrollToLower: function(){
    this.get_products();
  },

  //展示名称
  showname: function(e){
    wx.showModal({
      title: '提示',
      content: e.currentTarget.dataset.name,
      showCancel: false,
    })
  },

  //结算
  jiesuan: function(){
    var that = this;
    if (this.data.totalPrice == 0) {
      wx.showToast({
        title: '请选择产品',
      })
      return false;
    }
    var dingdan_arr = this.data.dingdan_arr;
    var str = '';
    for (var i=0; i<dingdan_arr.length; i++) {
      str += dingdan_arr[i].id + ':' + dingdan_arr[i].number + ':' + dingdan_arr[i].product_shuxingming_shuxingzhi.id + '#'
    }
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/make_order',
      data: {
        str: str,
        member_id: that.data.globalData.user_msg.id
      },
      method: 'post',
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
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel:false,
          })
        } else {
          wx.showToast({
            title: '系统繁忙，请重新操作',
          })
        }
      }
    })
  },

  jump_detail:function(e){
    wx.navigateTo({
      url: '/pages/product/detail/detail?id=' + e.currentTarget.id,
    })
  },

  clickpinpai: function() {
    this.setData({
      booleans: !this.data.booleans,
      hiddenpinpai: !this.data.hiddenpinpai
    })
  },

  //加
  jia: function(e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.arr;
    var number = arr[index].number ? arr[index].number : 0;
    arr[index].number = number + 1;
    this.setData({
      arr: arr,
    })
    //更新订单arr
    var dingdan_arr = this.data.dingdan_arr;
    var flag = 0;
    for (var i = 0; i < dingdan_arr.length; i++) {
      if (arr[index].id == dingdan_arr[i].id && arr[index].product_shuxingming_shuxingzhi.id == dingdan_arr[i].product_shuxingming_shuxingzhi.id) {
        flag = 1;
        dingdan_arr[i] = arr[index];
      }
    }
    if (flag == 0) { //新增
      dingdan_arr.unshift(arr[index]);
    }
    this.format_dingdan_arr(dingdan_arr);
  },

  jian: function(e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.arr;
    var number = arr[index].number ? arr[index].number : 0;
    arr[index].number = number - 1;
    this.setData({
      arr: arr,
    })
    //更新订单arr
    var dingdan_arr = this.data.dingdan_arr;
    var flag = 0;

    for (var i = 0; i < dingdan_arr.length; i++) {
      if (arr[index].id == dingdan_arr[i].id && arr[index].product_shuxingming_shuxingzhi.id == dingdan_arr[i].product_shuxingming_shuxingzhi.id) {
        if (arr[index].number == 0) { //移除购物车
          dingdan_arr.splice(i, 1);
        } else { //更新购物车
          dingdan_arr[i] = arr[index];
        }
      }
    }
    this.format_dingdan_arr(dingdan_arr);
  },

  //购物车加
  gwc_jia: function(e) {
    var index = e.currentTarget.dataset.index;
    //更新订单arr
    var dingdan_arr = this.data.dingdan_arr;
    dingdan_arr[index].number = dingdan_arr[index].number + 1;
    this.format_dingdan_arr(dingdan_arr);
    //如果是单品种，更新产品
    if (dingdan_arr[index].product_type == 'single') {
      var arr = this.data.arr;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == dingdan_arr[index].id && arr[i].product_shuxingming_shuxingzhi.id == dingdan_arr[index].product_shuxingming_shuxingzhi.id) {
          arr[i].number = dingdan_arr[index].number;
        }
      }
      this.setData({
        arr: arr,
      })
    }
  },

  //购物车减
  gwc_jian: function(e) {
    var index = e.currentTarget.dataset.index;
    //更新订单arr
    var dingdan_arr = this.data.dingdan_arr;
    dingdan_arr[index].number = dingdan_arr[index].number - 1;
    //如果是单品种，更新产品
    if (dingdan_arr[index].product_type == 'single') {
      var arr = this.data.arr;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == dingdan_arr[index].id && arr[i].product_shuxingming_shuxingzhi.id == dingdan_arr[index].product_shuxingming_shuxingzhi.id) {
          arr[i].number = dingdan_arr[index].number;
        }
      }
      this.setData({
        arr: arr,
      })
    }
    this.format_dingdan_arr(dingdan_arr);
  },

  format_dingdan_arr: function(dingdan_arr) {
    var totalPrice = 0 // 总价格
    var totalCount = 0 // 总商品数
    for (var i = 0; i < dingdan_arr.length; i++) {
      if (dingdan_arr[i].number == 0) {
        dingdan_arr.splice(i, 1);
      }
    }
    for (var i = 0; i < dingdan_arr.length; i++) {
      dingdan_arr[i].total = (dingdan_arr[i].number * dingdan_arr[i].price).toFixed(2)
      totalPrice += parseFloat(dingdan_arr[i].number * dingdan_arr[i].price);
      totalCount += dingdan_arr[i].number;
    }
    this.setData({
      dingdan_arr: dingdan_arr,
      totalPrice: totalPrice.toFixed(2),
      totalCount: totalCount,
    })
    app.globalData.dingdan_arr = dingdan_arr;
  },



  // 显示遮罩层
  showModal: function(e) {
    // 1.获取类型1商品的index索引
    // let index = e.currentTarget.dataset.index;
    // 2.将索引设置到遮罩层的加减按钮上(data-index="???")
    // e.target.dataset.index = index

    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块

  },

  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },

  fadeDown: function() {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  // 购物车_从底部弹出选择框
  //移动按钮点击事件
  showModel: function(e) {
    moveY = 0;
    action = 'show';
    animationEvents(this, moveY, action);
    var id = e.currentTarget.id;
    console.log(id)
    //获取产品属性列表
    this.setData({
      nums: 1,
      current_product_shuxingming_shuxingzhi: '',
    })
    this.get_shuxing_shuxingzhi(id);
  },

  //获取产品属性列表
  get_shuxing_shuxingzhi: function(id) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/wxxcx/kuaijie/get_shuxing_shuxingzhi',
      data: {
        id: id,
      },
      method: 'post',
      success: function(res) {
        that.setData({
          current_product_duoshuxing: res.data,
        })
      }
    });
  },

  //选择属性，根据属性获取价格
  choose_shuxing: function(e) {
    console.log(e)
    var id = e.currentTarget.id; //属性值id
    var shuxingming_key = e.currentTarget.dataset.shuxingming_key; //属性名key
    var shuxingzhi_key = e.currentTarget.dataset.shuxingzhi_key; //属性值key
    var current_product_duoshuxing = this.data.current_product_duoshuxing;
    //更改属性值的选中check值
    for (var i = 0; i < current_product_duoshuxing.res.getshuxingming[shuxingming_key].getshuxingzhi.length; i++) {
      current_product_duoshuxing.res.getshuxingming[shuxingming_key].getshuxingzhi[i].check = 0;
      if (current_product_duoshuxing.res.getshuxingming[shuxingming_key].getshuxingzhi[i].id == id) {
        current_product_duoshuxing.res.getshuxingming[shuxingming_key].getshuxingzhi[i].check = 1;
      }
    }
    this.setData({
      current_product_duoshuxing: current_product_duoshuxing,
    })
    this.getprice_by_shuxingzhi();
  },

  getprice_by_shuxingzhi: function() {
    var that = this;
    var str = [];
    for (var i = 0; i < this.data.current_product_duoshuxing.res.getshuxingming.length; i++) {
      for (var j = 0; j < this.data.current_product_duoshuxing.res.getshuxingming[i].getshuxingzhi.length; j++) {
        if (this.data.current_product_duoshuxing.res.getshuxingming[i].getshuxingzhi[j].check == 1) {
          str += this.data.current_product_duoshuxing.res.getshuxingming[i].getshuxingzhi[j].id + '#';
        }
      }
    }
    wx.request({
      url: app.globalData.domain + '/wxxcx/kuaijie/getprice_by_shuxingzhi_xilie',
      data: {
        str: str,
        condition: 0,
      },
      method: 'post',
      success: function(res) {
        if (res.data) {
          var current_product_duoshuxing = that.data.current_product_duoshuxing;
          current_product_duoshuxing.price = res.data.price;
          current_product_duoshuxing.getprice_by_shuxingzhi = res.data;
          that.setData({
            current_product_duoshuxing: current_product_duoshuxing,
            current_product_shuxingming_shuxingzhi: res.data,
          })
        }
      }
    });
  },

  duoguige_submit: function(e) {
    if (this.data.current_product_shuxingming_shuxingzhi == '') {
      wx.showToast({
        title: '请选择产品',
      })
      return false;
    }
    if (this.data.nums < 1) {
      wx.showToast({
        title: '请选择数量',
      })
      return false;
    }
    moveY = 200;
    action = 'hide';
    animationEvents(this, moveY, action);
    //判断是否已在订单中
    var dingdan_arr = this.data.dingdan_arr;
    var flag = 0;
    for (var i = 0; i < dingdan_arr.length; i++) {
      if (dingdan_arr[i].id == this.data.current_product_duoshuxing.res.id && dingdan_arr[i].product_shuxingming_shuxingzhi.id == this.data.current_product_shuxingming_shuxingzhi.id) { //存在
        dingdan_arr[i].number = dingdan_arr[i].number + this.data.nums;
        flag = 1;
      }
    }
    if (flag == 0) { //不存在
      var temp = this.data.current_product_duoshuxing.res;
      temp.number = this.data.nums;
      temp.product_shuxingming_shuxingzhi = this.data.current_product_shuxingming_shuxingzhi;
      temp.price = this.data.current_product_shuxingming_shuxingzhi.price;
      console.log(temp);
      dingdan_arr.unshift(temp);
    }
    this.format_dingdan_arr(dingdan_arr);
  },

  //隐藏弹窗浮层
  hidden(e) {
    console.log('nihao')
    moveY = 200;
    action = 'hide';
    animationEvents(this, moveY, action);
  },

  // 底部弹出的加减计数器  0.0
  /* 点击减号 */
  bindMinus: function() {
    var nums = this.data.nums;
    // 如果大于1时，才可以减  
    if (nums > 1) {
      nums--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = nums <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      nums: nums,
      minusStatus: minusStatus
    });
  },

  /* 点击加号 */
  bindPlus: function() {
    var nums = this.data.nums;
    // 不作过多考虑自增1  
    nums++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = nums < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      nums: nums,
      minusStatus: minusStatus
    });
  },

  /* 输入框事件 */
  bindManual: function(e) {
    var nums = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      nums: nums
    });
  }
})

//动画事件 底部的弹出，背景层通过切换不同的class，添加一个transition的效果，使之有一个渐变的感觉。
function animationEvents(that, moveY, action) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()
  if (action == 'show') {
    that.setData({
      animation: that.animation.export(),
      show: true,
      backgroundVisible: true,
      bg: 'bg',
      disableScroll: 'disableScroll'
    });
  } else if (action == 'hide') {
    that.setData({
      animation: that.animation.export(),
      show: false,
      backgroundVisible: false,
      bg: 'background',
      disableScroll: ''
    });
  }
}