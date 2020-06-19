var app = getApp();
Page({
  data: {
    flag: [5, 0, 0],
    startext: ['非常满意', '', ''],
    stardata: [1, 2, 3, 4, 5],
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    imagesList: [],
    maxLength: 0,

    globalData: app.globalData,
    view: '',
    order_id:0,
    order_detail_id:0,

    uploadimages:[], //储存返回的图片路径
    summary: '',  //评论内容

    footer: ['s1.png', 'c1.png', 'g1.png', 'm22.png'],
  },

  onLoad: function(options) {
    this.setData({ globalData: app.globalData })
    this.view(options.order_id, options.order_detail_id);
    this.setData({order_id:options.order_id, order_detail_id:options.order_detail_id});
    wx.setNavigationBarTitle({
      title: '追评'
    })
  },

  //提交评论
  sub: function(){
    if (this.data.summary == '') {
      wx.showToast({
        title: '请输入内容',
      })
      return false;
    }
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/zp_tj',
      data: {
        member_id: that.data.globalData.user_msg.id,
        xingji: that.data.flag[0],
        summary: that.data.summary, //评论内容
        order_detail_id: that.data.order_detail_id,
        order_id: that.data.order_id,
        guige_name: that.data.view.mingzhi,
        uploadimages: that.data.uploadimages,
        type:1
      },
      method:'post',
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/member/orderlist/orderlist?id=3',
            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },

  //删除图片
  del: function (res) {
    var that = this;
    var id = res.currentTarget.id;
    wx.showModal({
      title: '删除图片',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          var imagelist = that.data.imagesList;
          imagelist.splice(id, 1);
          var uploadimages = that.data.uploadimages;
          uploadimages.splice(id, 1);
          that.setData({ imagesList: imagelist, maxLength: that.data.maxLength - 1, uploadimages: uploadimages });
        }
      }
    })
  },

  view: function(order_id, order_detail_id) {
    var that = this;
    wx.request({
      url: this.data.globalData.domain + '/wxxcx/member/zp',
      data: {
        order_id: order_id,
        order_detail_id: order_detail_id,
        member_id: that.data.globalData.user_msg.id,
      },
      success(res) {
        that.setData({
          'view': res.data
        })
      }
    })
  },

  uploader: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        if (that.data.maxLength > 4) {
          wx.showModal({
            content: '最多能上传' + that.data.maxLength + '张图片',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('确定');
              }
            }
          })
          return;
        }
        wx.showLoading({
          title: '上传中',
        })
        var image = res.tempFilePaths[0]
        wx.uploadFile({
          url: that.data.globalData.domain + '/wxxcx/member/uploadd',
          filePath: image,
          name: 'images',
          header: {
            "Content-Type": "multipart/form-data",
            'Content-Type': 'application/json'
          },
          success: function(res) {
            var ress = res.data.substring(1);
            var res = JSON.parse(ress);
            if (res.status == 200) { //上传成功
              console.log(image)
              var imagelist = that.data.imagesList;
              imagelist.push(image);
              var uploadimages = that.data.uploadimages;
              uploadimages.push(res.res);
              that.setData({ imagesList: imagelist, maxLength: that.data.maxLength + 1, uploadimages: uploadimages});
              wx.hideLoading();
            } else {
              wx.showToast({
                title: res.res,
              })
            }
          },
          fail: function(data) {
            wx.showToast({
              title: '上传失败1',
            })
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '上传失败3',
        })
      }
    })
  },

  // 五星评价事件
  changeColor: function(e) {
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.no;
    var a = 'flag[' + index + ']';
    var b = 'startext[' + index + ']';
    var that = this;
    if (num == 1) {
      that.setData({
        [a]: 1,
        [b]: '非常不满意'
      });
    } else if (num == 2) {
      that.setData({
        [a]: 2,
        [b]: '不满意'
      });
    } else if (num == 3) {
      that.setData({
        [a]: 3,
        [b]: '一般'
      });
    } else if (num == 4) {
      that.setData({
        [a]: 4,
        [b]: '满意'
      });
    } else if (num == 5) {
      that.setData({
        [a]: 5,
        [b]: '非常满意'
      });
    }
  },

  //留言
  summary: function (e) {
    this.setData({
      summary: e.detail.value
    });
  }
  
})