// miniprogram/pages/login/login.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPw: false,
    photo: '../../images/mine/photo_def.png',
    account: '',
    password: '',
    passwordT: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  checkAccount(e) {
    db.collection('pet_user').where({
      account: e.detail.value
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          showInput: true,
          photo: res.data[0].photo,
          account: res.data[0].account,
          password: res.data[0].password
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '该用户不存在，立即前往注册',
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../register/register'
              })
            }
          }
        })
      }
    })
  },

  checkPassword(e) {
    this.setData({
      passwordT: e.detail.value
    })
  },

  onLogin() {
    if (this.data.password === this.data.passwordT) {
      wx.setStorage({
        key: "account",
        data: this.data.account
      })
      wx.reLaunch({
        url: '../mine/mine'
      })
    } else {
      wx.showToast({
        title: '密码错误',
        icon: 'none',
        duration: 2000
      })
    }
  },

  showPassword() {
    this.setData({
      showPw: true
    })
  },
  hidePassword() {
    this.setData({
      showPw: false
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