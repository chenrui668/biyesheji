// miniprogram/pages/petRegister/petRegister.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    petName: '',
    petType: '',
    petAge: '',
    petDays: '',
    petPrice: '',
    petDetail:'',
    imgUrl: '',
    sex: 'male',
    accountA: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let account = wx.getStorageSync('account');
    this.setData({
      accountA: account
    })
  },
  
  checkName(e) {
    if(e.detail.value) {
      this.setData({
        petName: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkType(e) {
    if(e.detail.value) {
      this.setData({
        petType: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入种类',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkAge(e) {
    if(e.detail.value) {
      this.setData({
        petAge: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkDays(e) {
    let reg = /^\d+$/;
    if(reg.test(e.detail.value)) {
      this.setData({
        petDays: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入整数',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkPrice(e) {
    let reg = /^\d+(\.\d\d?)?$/;
    if(reg.test(e.detail.value)) {
      this.setData({
        petPrice: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入整数或至多两位小数',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkDetail(e) {
    this.setData({
      petDetail: e.detail.value
    })
  },

  checkAll() {
    let d = this.data;
    if (d.imgUrl && d.petName && d.petType && d.petAge && d.petDays && d.petPrice) {
      wx.showModal({
        title: '提示',
        content: '是否确认提交',
        success (res) {
          if (res.confirm) {
            db.collection('pet_list').add({
              data: {
                imgUrl: d.imgUrl,
                name: d.petName,
                type: d.petType,
                age: d.petAge,
                days: d.petDays,
                price: d.petPrice,
                detail: d.petDetail,
                accountA: d.accountA,
                accountB: '',
                status: 1,
                date: '',
                sex: d.sex,
                video: []
              },
              success: res => {
                wx.showToast({
                  title: '提交成功',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../logs/logs'
                  })
                }, 2000)
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 2000
      })
    }
  },

  chooseMale() {
    this.setData({
      sex: 'male' 
    })
  },
  chooseFemale() {
    this.setData({
      sex: 'female'
    })
  },

  chooseImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
        var str = randnum +"_"+ new Date().getMilliseconds() + ".png";
        wx.cloud.uploadFile({
          cloudPath: str,
          filePath: tempFilePaths[0],
          success: res => {
            that.setData({
              imgUrl: res.fileID
            })
          },
        })
      }
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