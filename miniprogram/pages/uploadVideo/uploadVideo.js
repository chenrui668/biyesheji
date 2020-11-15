// miniprogram/pages/uploadVideo/uploadVideo.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pet: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('pet_list').doc(options.id).get().then(res => {
      this.setData({
        pet: res.data
      })
    })
  },

  toUpload() {
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 180,
      camera: 'back',
      success: res => {
        wx.showLoading({
          title: '上传中',
        })
        let index = res.tempFilePath.lastIndexOf(".");
        let s = res.tempFilePath.slice(index);
        var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
        var str = randnum +"_"+ new Date().getMilliseconds() + s;
        wx.cloud.uploadFile({
          cloudPath: str,
          filePath: res.tempFilePath,
          success: re => {
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            let pet = JSON.parse(JSON.stringify(this.data.pet));
            let obj = {
              date: new Date().toLocaleDateString(),
              url: re.fileID
            }
            let video = [];
            if(pet.video.length > 0) {
              video = JSON.parse(JSON.stringify(pet.video));
            }
            video.push(obj);
            db.collection('pet_list').doc(pet._id).update({
              data: {
                video
              }
            })
            db.collection('pet_message').add({
              data: {
                account: pet.accountA,
                datems: new Date().getTime(),
                text: '对方已上传新的宠物视频'
              }
            })
            setTimeout(function () {
              wx.reLaunch({
                url: '../logs/logs'
              })
            }, 2000)
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