// miniprogram/pages/mine/mine.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    showMoney: false,
    height: 0,
    showRecharge: false,
    rechargeValue: 0,
    password: '',
    showWithdrawal: false,
    withdrawalValue: 0,
    password2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('pet_user').where({
      account: wx.getStorageSync('account')
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          user: res.data[0]
        })
      } else {
        this.setData({
          user: null
        })
      }
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
    })
  },

  toCancellation() {
    wx.showModal({
      title: '提示',
      content: '您确定注销吗？',
      success (res) {
        if (res.confirm) {
          wx.setStorage({
            key: "account",
            data: ""
          })
          wx.reLaunch({
            url: '../mine/mine'
          })
        }
      }
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
  },

  toRegister() {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  toChangeInfo() {
    wx.navigateTo({
      url: '../changeInfo/changeInfo'
    })
  },
  toChangePw() {
    wx.navigateTo({
      url: '../changePw/changePw'
    })
  },
   
  showMoney() {
    this.setData({
      showMoney: true
    })
  },
  toRecharge() {
    this.setData({
      showRecharge: true,
      showWithdrawal: false
    })
  },
  toWithdrawal() {
    this.setData({
      showWithdrawal: true,
      showRecharge: false
    })
  },
  checkValue(e) {
    let reg = /^\d+(\.\d\d?)?$/;
    if(reg.test(e.detail.value)) {
      this.setData({
        rechargeValue: e.detail.value
      })
    } else {
      if (this.data.rechargeValue) {
        this.setData({
          rechargeValue: 0
        })
      }
      wx.showToast({
        title: '请输入整数或至多两位小数',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkPassword(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        password: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入账户密码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkRecharge() {
    if (this.data.rechargeValue && this.data.password) {
      if (this.data.password === this.data.user.password) {
        wx.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 2000
        })
        let user = this.data.user;
        user.money += +this.data.rechargeValue;
        this.setData({  
          user: user,
          showMoney: false,
          showRecharge: false
        })
        db.collection('pet_user').doc(user._id).update({
          data:{
            money: user.money
          }
        })
      } else {
        wx.showToast({
          title: '密码错误',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请输入充值金额或者账户密码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkValue2(e) {
    let reg = /^\d+(\.\d\d?)?$/;
    if(reg.test(e.detail.value)) {
      if(e.detail.value <= this.data.user.money) {
        this.setData({
          withdrawalValue: e.detail.value
        })
      } else {  
        wx.showToast({
          title: '提现金额不能大于余额',
          icon: 'none',
          duration: 2000
        })
      } 
    } else {
      if (this.data.rechargeValue) {
        this.setData({
          withdrawalValue: 0
        })
      }
      
    }
  },
  checkPassword2(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        password2: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入账户密码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkWithdrawal() {
    if (this.data.withdrawalValue && this.data.password2) {
      if (this.data.password2 === this.data.user.password) {
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 2000
        })
        let user = this.data.user;
        user.money -= +this.data.withdrawalValue;
        this.setData({  
          user: user,
          showMoney: false,
          showWithdrawal: false
        })
        db.collection('pet_user').doc(user._id).update({
          data:{
            money: user.money
          }
        })
      } else {
        wx.showToast({
          title: '密码错误',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请输入充值金额或者账户密码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  cancelRecharge() {
    this.setData({
      showMoney: false,
      showRecharge: false,
      rechargeValue: 0,
      password: ''
    })
  },
  cancelWithdrawal() {
    this.setData({
      showMoney: false,
      showWithdrawal: false,
      withdrawalValue: 0,
      password2: ''
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