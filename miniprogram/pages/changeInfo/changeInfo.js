// miniprogram/pages/changeInfo/changeInfo.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: '',
    wx: '',
    phone: '',
    region: '',
    address: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let account = wx.getStorageSync('account');
    db.collection('pet_user').where({
      account: account
    }).get().then(res =>{
      let d = res.data[0];
      let n = res.data[0].region.join('').length;
      this.setData({
        photo: d.photo,
        wx: d.wx,
        phone: d.phone,
        region: d.region,
        address: d.address.slice(n),
        id: d._id
      })
    })
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
      this.setData({
        address: e.detail.value
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
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  submitInfo() {
    let d = this.data;
    if (d.wx && d.phone && d.address) {
      db.collection('pet_user').doc(this.data.id).update({
        data: {
          photo: d.photo,
          wx: d.wx,
          phone: d.phone,
          region: d.region,
          address: d.region.join('') + d.address
        },
        success: res => {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../mine/mine'
            })
          }, 2000)
        } 
      })
    } else {
      wx.showToast({
        title: '信息不完全，请完全输入后确认',
        icon: 'none',
        duration: 2000
      })
    }
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