// miniprogram/pages/petDetail/petDetail.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    petInfo: '',
    userInfo: '',
    buttonStatus: true,
    height: 0,
    showPage: false,
    userNow: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('pet_list').where({
      _id: options.id
    }).get().then(res => {
      this.setData({
        petInfo: res.data[0]
      })
      db.collection('pet_user').where({
        account: res.data[0].accountA
      }).get().then(res => {
        this.setData({
          userInfo: res.data[0]
        })
        if (res.data[0].account === wx.getStorageSync('account')) {
          this.setData({
            buttonStatus: false
          })
        }
      })
    })
    db.collection('pet_apply').where({
      petId: options.id,
      account: wx.getStorageSync('account')
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          buttonStatus: false
        })
      }
    })
    db.collection('pet_user').where({
      account: wx.getStorageSync('account')
    }).get().then(res => {
      this.setData({
        userNow: res.data[0]
      })
    })
    wx.getSystemInfo({
      success: res => {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        this.setData({
          height: height
        });
      }
    });
  },

  toApply() {
    this.setData({
      showPage: true
    })
  },
  toLogs() {
    wx.reLaunch({
      url: '../logs/logs'
    })
  },
  checkReason(e) {
    this.reason = e.detail.value;
  }, 
  chooseTrue() {
    if(this.reason.length >= 10) {
      db.collection('pet_apply').add({
        data: {
          account: this.data.userNow.account,
          region: this.data.userNow.region.join(''),
          photo: this.data.userNow.photo,
          wx: this.data.userNow.wx,
          phone: this.data.userNow.phone,
          petId: this.data.petInfo._id,
          reason: this.reason,
          status: 1,
          petList: this.data.petInfo,
          userA: this.data.userInfo
        },
        success: res => {
          wx.showToast({
            title: '申请提交成功',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            showPage: false,
            buttonStatus: false
          })
        }
      })
      let text = `用户${this.data.userNow.account}申请领养您的宠物${this.data.petInfo.name}`
      db.collection('pet_message').add({
        data: {
          account: this.data.userInfo.account,
          datems: new Date().getTime(),
          text
        }
      })
    } else {
      wx.showToast({
        title: '请输入不少于10个字',
        icon: 'none',
        duration: 2000
      })
    }
  },
  chooseFalse() {
    this.setData({
      showPage: false,
      reason: ''
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