// miniprogram/pages/changePw/changePw.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordP: '',
    passwordT: '',
    password: '',
    id: '',
    showPw1: false,
    showPw2: false,
    showPw3: false,
    pass: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let account = wx.getStorageSync('account');
    db.collection('pet_user').where({
      account: account
    }).get().then(res => {
      let d = res.data[0];
      this.setData({
        passwordP: d.password,
        id: d._id
      })
    })
  },
  checkPw(e) {
    if (e.detail.value === this.data.passwordP) {
      this.setData({
        pass: true
      })
    } else {
      if (this.data.pass) {
        this.setData({
          pass: false
        })
      }
      wx.showToast({
        title: '旧密码错误',
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
  submitInfo() {
    let d = this.data;
    if (d.password && d.pass) {
      db.collection('pet_user').doc(d.id).update({
        data: {
          password: d.password,
        },
        success: res => {
          wx.showToast({
            title: '修改成功',
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
        title: '请输入完全后再确认',
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
  showPassword3() {
    this.setData({
      showPw3: true
    })
  },
  hidePassword3() {
    this.setData({
      showPw3:false
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