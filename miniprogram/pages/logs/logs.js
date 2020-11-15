// miniprogram/pages/logs/logs.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '100%',
    petList1: [],
    petList2: [],
    petList3: [],
    showApply: false,
    showEvaluatePage: false,
    starList: [false, false, false, false, false],
    starRank: 0,
    evaAccountB: '',
    showPayPage: false,
    payAccount: '',
    payPrice: 0,
    payPassword: '',
    payPetId: '',
    messageList: [],
    showMessage: false
  },

  setDots(status) {
    let statusDot1 = [];
    let statusDot2 = [];
    for (let i = 0; i < 7; i ++) {
      let dot = i * 100;
      if (i < status) {
        statusDot1.push(dot)
      } else {
        statusDot2.push(dot)
      }
    }
    return [statusDot1, statusDot2];
  },
  setStatusA(status) {
    let statusText = '';
    switch(status) {
      case 1: 
        statusText = '已发布';
        break;
      case 2: 
        statusText = '待寄出';
        break;
      case 3: 
        statusText = '已寄出';
        break;
      case 4: 
        statusText = '寄养中';
        break;
      case 5: 
        statusText = '待寄回';
        break;
      case 6: 
        statusText = '已寄回';
        break;
      case 7:
      case 8: 
        statusText = '寄养结束';
        break;
    }
    return statusText;
  },
  setStatusB(status) {
    let statusText = '';
    switch(status) {
      case 2: 
        statusText = '待寄出';
        break;
      case 3: 
        statusText = '已寄出';
        break;
      case 4: 
        statusText = '领养中';
        break;
      case 5: 
        statusText = '待寄回';
        break;
      case 6: 
        statusText = '已寄回';
        break;
      case 7: 
      case 8:
        statusText = '领养结束';
        break;
    }
    return statusText;
  },
  setStatusC(status) {
    let statusText = '';
    switch(status) {
      case 1: 
        statusText = '申请中';
        break;
      case 2: 
        statusText = '申请失败';
        break;
      case 3: 
        statusText = '已取消申请';
        break;
      case 4: 
        statusText = '对方已取消寄养';
    }
    return statusText;
  },

  onLoad: function (options) {
    if (!wx.getStorageSync('account')) {
      wx.showModal({
        title: '提示',
        content: '您还没有登录，请先前往登录',
        success: res => {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }
    db.collection('pet_message').where({
      account: wx.getStorageSync('account')
    }).get().then(res => {
      if (res.data.length > 0) {
        res.data.sort((a, b) => {
          return +a.datems - +b.datems;
        })
        this.setData({
          showMessage: true,
          messageList: res.data
        })
      }
    })
    db.collection('pet_list').where({
      accountA: wx.getStorageSync('account')
    }).get().then(res => {
      for (let item of res.data) {
        item.statusDots = this.setDots(item.status);
        item.statusText = this.setStatusA(item.status);
        item.showContent = false;
        if (item.status === 1) {
          db.collection('pet_apply').where({
            petId: item._id,
            status: 1
          }).get().then(res => {
            if (res.data.length > 0) {
              for(let itm of res.data) {
                db.collection('pet_evaluate').where({
                  accountB: itm.account
                }).get().then(res => {
                  if (res.data.length > 0) {
                    itm.evaluate = res.data;
                  }
                })
              }
              item.applyUser = res.data;
            }
          })
        } else {
          db.collection('pet_user').where({
            account: item.accountB
          }).get().then(res => {
            item.userB = res.data[0];
          })  
        }
        if (item.status === 4) {
          let dayms = 1000 * 60 * 60 * 24;
          let date1 = new Date(item.date).getTime() +  dayms * item.days;
          let date2 = new Date().getTime();
          if (date1 - date2 > 0) {
            let ms = date1 - date2;
            let nowDays = Math.ceil(ms / dayms);
            item.statusText += `(剩${nowDays}天)`;
          } else {
            item.status = 5;
            item.statusDots = this.setDots(5);
            item.statusText = this.setStatusA(5);
            db.collection('pet_list').doc(item._id).update({
              data: {
                status: 5
              }
            })
          }
        }
      }
      return res.data;
    }).then(res => {
      this.setData({
        petList1: res
      })
    })
    db.collection('pet_list').where({
      accountB: wx.getStorageSync('account')
    }).get().then(res => {
      let list = res.data.filter(item => {
        return item.status > 1;
      })
      for (let item of list) {
        item.statusDots = this.setDots(item.status);
        item.statusText = this.setStatusB(item.status);
        item.showContent = false;
        db.collection('pet_user').where({
          account: item.accountA
        }).get().then(re => {
          item.userA = re.data[0];
        })
        if (item.status === 4) {
          let dayms = 1000 * 60 * 60 * 24;
          let date1 = new Date(item.date).getTime() +  dayms * item.days;
          let date2 = new Date().getTime();
          if (date1 - date2 > 0) {
            let ms = date1 - date2;
            let nowDays = Math.ceil(ms / dayms);
            item.statusText += `(剩${nowDays}天)`;
          } else {
            item.status = 5;
            item.statusDots = this.setDots(5);
            item.statusText = this.setStatusB(5);
            db.collection('pet_list').doc(item._id).update({
              data: {
                status: 5
              }
            })
          }
        }  
      }
      return list;
    }).then(res => {
      this.setData({
        petList2: res
      })
    })
    db.collection('pet_apply').where({
      account: wx.getStorageSync('account')
    }).get().then(res => {
      for (let item of res.data) {
        item.statusText = this.setStatusC(item.status);
        item.showContent = false;
      }
      this.setData({
        petList3: res.data
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

  checkMessage() {
    let list = this.data.messageList.slice(0);
    wx.cloud.callFunction({
      name: 'removeMessage',
      data: {
        id: list[0]._id
      }
    }).then(res => {
      if (list.length > 1) {
        list.shift();
        this.setData({
          messageList: list
        })
      } else {
        this.setData({
          messageList: [],
          showMessage: false
        })
      }
    })
  },
  openContent(e) {
    let petList = JSON.parse(JSON.stringify(this.data.petList1));
    for (let i = 0; i < petList.length; i ++) {
      if(i === e.currentTarget.dataset.index) {
        petList[i].showContent = true;
      }
    }
    this.setData({
      petList1: petList
    })
  },
  closeContent(e) {
    let petList = JSON.parse(JSON.stringify(this.data.petList1));
    for (let i = 0; i < petList.length; i ++) {
      if(i === e.currentTarget.dataset.index) {
        petList[i].showContent = false;
      }
    }
    this.setData({
      petList1: petList
    })
  },
  openContent2(e) {
    let petList = JSON.parse(JSON.stringify(this.data.petList2));
    for (let i = 0; i < petList.length; i ++) {
      if(i === e.currentTarget.dataset.index) {
        petList[i].showContent = true;
      }
    }
    this.setData({
      petList2: petList
    })
  },
  closeContent2(e) {
    let petList = JSON.parse(JSON.stringify(this.data.petList2));
    for (let i = 0; i < petList.length; i ++) {
      if(i === e.currentTarget.dataset.index) {
        petList[i].showContent = false;
      }
    }
    this.setData({
      petList2: petList
    })
  },
  openContent3(e) {
    let petList = JSON.parse(JSON.stringify(this.data.petList3));
    for (let i = 0; i < petList.length; i ++) {
      if(i === e.currentTarget.dataset.index) {
        petList[i].showContent = true;
      }
    }
    this.setData({
      petList3: petList
    })
  },
  closeContent3(e) {
    let petList = JSON.parse(JSON.stringify(this.data.petList3));
    for (let i = 0; i < petList.length; i ++) {
      if(i === e.currentTarget.dataset.index) {
        petList[i].showContent = false;
      }
    }
    this.setData({
      petList3: petList
    })
  },

  toAgree(e) {
    let data = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '您确定要同意吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_apply').doc(data.id).remove();
          db.collection('pet_apply').where({
            petId: data.petid
          }).get().then(res => {
            for (let item of res.data) {
              if (item.account !== data.accountB) {
                db.collection('pet_message').add({
                  data: {
                    account: item.account,
                    datems: new Date().getTime(),
                    text: '对方拒绝了您的领养申请'
                  }
                })
              }
            }
          })
          wx.cloud.callFunction({
            name: 'updateApply',
            data: {
              petId: data.petid
            }
          })
          db.collection('pet_list').doc(data.petid).update({
            data: {
              status: 2,
              accountB: data.account
            }
          })
          db.collection('pet_message').add({
            data: {
              account: data.account,
              datems: new Date().getTime(),
              text: '对方同意了您的领养申请'
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  toDisagree(e) {
    wx.showModal({
      title: '提示',
      content: '您确定要拒绝吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_apply').doc(e.currentTarget.dataset.id).update({
            data: {
              status: 2
            }
          })
          db.collection('pet_message').add({
            data: {
              account: e.currentTarget.dataset.account,
              datems: new Date().getTime(),
              text: '对方拒绝了您的领养申请'
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  toUploadVideo(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../uploadVideo/uploadVideo?id=${id}`
    })
  },

  toSend(e) {
    let data = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '您确定已寄出吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            showPayPage: true,
            payPrice: data.price,
            payAccount: data.account,
            payPetId: data.id
          })
        }
      }
    })
  },
  checkPayPassword(e) {
    this.setData({
      payPassword: e.detail.value
    })
  },
  choosePay() {
    db.collection('pet_user').where({
      account: wx.getStorageSync('account')
    }).get().then(res => {
      if (res.data[0].money >= this.data.payPrice) {
        if (res.data[0].password === this.data.payPassword) {
          db.collection('pet_pay').add({
            data: {
              accountA: res.data[0].account,
              accountB: this.data.payAccount,
              money: this.data.payPrice,
              petId: this.data.payPetId
            }
          })
          db.collection('pet_message').add({
            data: {
              account: this.data.payAccount,
              datems: new Date().getTime(),
              text: '对方已将宠物寄出，清注意查收'
            }
          })
          db.collection('pet_user').doc(res.data[0]._id).update({
            data: {
              money: res.data[0].money - +this.data.payPrice
            }
          })
          db.collection('pet_list').doc(this.data.payPetId).update({
            data: {
              status: 3
            }
          })
          let petList = JSON.parse(JSON.stringify(this.data.petList1));
          for(let item of petList) {
            if (item._id === this.data.payPetId) {
              item.status = 3,
              item.statusText = '已寄出',
              item.statusDots = this.setDots(3);
            }
          }
          this.setData({
            petList1: petList,
            payPassword: '',
            showPayPage: false,
          })
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '密码错误，请重新输入',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '您的余额不足，请先充值',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  cancelPay() {
    this.setData({
      payPassword: '',
      showPayPage: false,
    })
  },
  toEnd(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定要提前结束寄养吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_list').doc(id).update({
            data: {
              status: 5
            }
          })
          db.collection('pet_message').add({
            data: {
              account: e.currentTarget.dataset.account,
              datems: new Date().getTime(),
              text: '对方已提前结束寄养，请将宠物寄回'
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    }) 
  },
  toReceive(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定已收到吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_list').doc(id).update({
            data: {
              status: 4,
              date: new Date().toLocaleDateString()
            }
          })
          db.collection('pet_message').add({
            data: {
              account: e.currentTarget.dataset.account,
              datems: new Date().getTime(),
              text: '对方已收到宠物'
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  toSendBack(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定已寄回吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_list').doc(id).update({
            data: {
              status: 6,
            }
          })
          db.collection('pet_message').add({
            data: {
              account: e.currentTarget.dataset.account,
              datems: new Date().getTime(),
              text: '对方已将宠物寄回，请注意查收'
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  toReceiveBack(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定已收到吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_list').doc(id).update({
            data: {
              status: 7,
            }
          })
          db.collection('pet_pay').where({
            petId: id
          }).get().then(res =>{
            db.collection('pet_user').where({
              account: res.data[0].accountB
            }).get().then(re => {
              let money = +re.data[0].money + +res.data[0].money;
              db.collection('pet_user').doc(re.data[0]._id).update({
                data: {
                  money
                } 
              })
              db.collection('pet_pay').doc(res.data[0]._id).remove();
            })
            db.collection('pet_message').add({
              data: {
                account: res.data[0].accountB,
                datems: new Date().getTime(),
                text: `寄养结束，您已收到寄养费${res.data[0].money}元，请注意查收`
              }
            })
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  cancelApply(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定取消申请吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_apply').doc(id).update({
            data: {
              status: 3,
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  cancelRelease(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定取消发布吗？',
      success: res => {
        if (res.confirm) {
          db.collection('pet_list').doc(id).remove();
          wx.cloud.callFunction({
            name: 'updateApply2',
            data: {
              petId: id
            }
          })
          db.collection('pet_apply').where({
            petId: id
          }).get().then(res => {
            for (let item of res.data) {
              db.collection('pet_message').add({
                data: {
                  account: item.account,
                  datems: new Date().getTime(),
                  text: '对方取消了宠物的寄养'
                }
              })
            }
          })
          wx.reLaunch({
            url: '../logs/logs'
          })
        }
      }
    })
  },

  toEvaluate(e) {
    this.setData({
      showEvaluatePage: true,
      evaAccountB: e.currentTarget.dataset.account,
      evaId: e.currentTarget.dataset.id
    })
  },
  changeStar(e) {
    let star = [];
    let index = e.currentTarget.dataset.index;
    for(let i = 0; i < 5; i ++) {
      if (i <= index) {
        star[i] = true;
      } else {
        star[i] = false;
      }
    }
    this.setData({
      starRank: index + 1,
      starList: star
    })
  },
  checkEvaluate(e) {
    this.evaluateText = e.detail.value;
  },
  submitEvalute() {
    if (this.evaluateText) {
      db.collection('pet_user').where({
        account: wx.getStorageSync('account')
      }).get().then(res => {
        let data = res.data[0];
        db.collection('pet_evaluate').add({
          data: {
            date: new Date().toLocaleDateString(),
            accountA: data.account,
            accountB: this.data.evaAccountB,
            accountAPhoto: data.photo,
            starRank: this.data.starRank,
            starList: this.data.starList,
            text: this.evaluateText
          }
        }).then(res => {
          let petList = JSON.parse(JSON.stringify(this.data.petList1));
          for(let item of petList) {
            if (item._id === this.data.evaId) {
              item.status = 8
            }
          }
          this.setData({
            petList1: petList,
            showEvaluatePage: false,
            starRank: 0,
            starList: [false, false, false, false, false]
          })
        })
      })
      db.collection('pet_list').doc(this.data.evaId).update({
        data: {
          status: 8
        }
      })
      wx.showToast({
        title: '评价成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  cancelEvaluate() {
    this.setData({
      showEvaluatePage: false,
      starRank: 0,
      starList: [false, false, false, false, false],
    })
    this.evaluateText = ''
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