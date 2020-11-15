// miniprogram/pages/register/register.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: '../../images/mine/photo_def.png',
    account: '',
    password: '',
    passwordT: '',
    wx: '',
    phone: '',
    address: '',
    region: '',
    showPw1: false,
    showPw2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  uploadPhoto() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
        var str = randnum +"_"+ new Date().getMilliseconds() + ".png";
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: str,
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePaths[0],
          // 成功回调
          success: res => {
            that.setData({
              photo: res.fileID
            })
          },
        })
      }
    })
  },

  checkAccount(e) {
    let reg = /^[a-zA-Z][a-zA-Z0-9]{4,8}\d$/;
    if (reg.test(e.detail.value)) {
      db.collection('pet_user').where({
        account: e.detail.value
      }).get().then(
        res => {
          if (res.data.length > 0) {
            wx.showModal({
              title: '提示',
              content: '该用户已注册，立即前往登录',
              success (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../login/login'
                  })
                }
              }
            })
          } else {
            this.setData({
              account: e.detail.value
            })
          }
          
        }
      )
    } else {
      if (this.data.account) {
        this.setData({
          account: ''
        })
      }
      wx.showToast({
        title: '账号格式不正确',
        icon: 'none',
        duration: 2000
      }) 
    }
  },
  checkPasswordT(e) {
    let reg = /^[\w]{6,12}$/;
    if (reg.test(e.detail.value)) {
      this.setData({
        passwordT: e.detail.value
      })
    } else {
      if (this.data.passwordT) {
        this.setData({
          passwordT: ''
        })
      }
      wx.showToast({
        title: '密码格式不正确',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkPassword(e) {
    if (e.detail.value === this.data.passwordT) {
      this.setData({
        password: e.detail.value
      })
    } else {
      if (this.data.password) {
        this.setData({
          password: ''
        })
      }
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkWx(e) {
    let reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
    if (reg.test(e.detail.value)) {
      this.setData({
        wx: e.detail.value
      })
    } else {
      if (this.data.wx) {
        this.setData({
          wx: ''
        })
      }
      wx.showToast({
        title: '请输入正确的微信号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkPhone(e) {
    let reg = /^1[3456789]\d{9}$/;
    if (reg.test(e.detail.value)) {
      this.setData({
        phone: e.detail.value
      })
    } else {
      if (this.data.phone) {
        this.setData({
          phone: ''
        })
      }
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkAddress(e) {
    if (e.detail.value.length > 0) {
      let add = this.data.region.join('') + e.detail.value;
      this.setData({
        address: add
      })
    } else {
      if (this.data.address) {
        this.setData({
          address: ''
        })
      } 
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
    }
  },
  submitInfo() {
    let d = this.data;
    if (d.account && d.password && d.wx && d.phone && d.address) {
      db.collection('pet_user').add({
        data: {
          account: d.account,
          password: d.password,
          photo: d.photo,
          wx: d.wx,
          phone: d.phone,
          region: d.region,
          address: d.address,
          money: 0
        },
        success: res => {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '../login/login'
            })
          }, 2000)
        } 
      })
    } else {
      wx.showToast({
        title: '信息不完全，请完全输入后提交',
        icon: 'none',
        duration: 2000
      })
    }
  },

  showPassword1() {
    this.setData({
      showPw1: true
    })
  },
  hidePassword1() {
    this.setData({
      showPw1:false
    })
  },
  showPassword2() {
    this.setData({
      showPw2: true
    })
  },
  hidePassword2() {
    this.setData({
      showPw2:false
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
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