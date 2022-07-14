Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: '',
    record: '',
    showUploadTip: false,
    haveGetImgSrc: false,
    imgSrc: '../../images/head.png',
    userName:'',
    userAuthority:'',
    userNickname:'',
    userNumber:'',
    userSex:'',
    sexUrl:'',
    userHead:'',
  },

  clearImgSrc() {
    this.setData({
      haveGetImgSrc: false,
      imgSrc: ''
    });
  },

  uploadImg() {
    var that=this;
    // 让用户选择一张图片
    wx.chooseMedia({
      count: 1,
      success(res){
        const tempFilePaths = res.tempFiles[0].tempFilePath;
        var app = getApp();
        // 将图片上传
        wx.uploadFile({
          header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
          url:'http://1.15.78.63/dev-api/common/upload',
          filePath: tempFilePaths,
          name:'file',
          formData:{ 
              'use' :'test'
          },
        success(res)
          {
            res = JSON.parse(res.data);
            var app = getApp();
            wx.request({
                url: 'http://1.15.78.63/dev-api/jsd/jsduser', 
                method:'PUT',
                data:{
                    userId: app.globalData.userId,
                    userHead: res.fileName,
                },
                header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                success (res) {
                console.log(res.data);
                }
            })
            that.setData({
              haveGetImgSrc: true,
              imgSrc: tempFilePaths,
              userHead:'http://1.15.78.63/dev-api'+res.fileName,
            });
            app.globalData.userHead = res.fileName;
            wx.hideLoading();
          }
        })
      },
    });
  },

  logOut() {
        wx.showLoading({
        title: '退出登录',
        });
        setTimeout(
            function(){
                wx.redirectTo({
                  url: '/pages/login/login',
                })
            },2000);
    },

  onLoad(options) {
    var app = getApp();
    var user = app.globalData.userName;
    var classes = app.globalData.userClass;
    var authority = app.globalData.userAuthority;
    var nickname = app.globalData.userNickname;
    var number = app.globalData.userNumber;
    var sex = app.globalData.userSex;
    var head = app.globalData.userHead;
    this.setData({
      userName:user,
      userClass:classes,
      userAuthority:authority,
      userNickname:nickname,
      userNumber:number,
      userHead:'http://1.15.78.63/dev-api'+head,
    });
    console.log(sex);
    if(sex=="男")
    {
        this.setData({
            sexUrl:"../../images/male.png",
        })
    }
    if(sex=="女")
    {
        this.setData({
            sexUrl:"../../images/female.png",
        })
    }
  },

  getRecord() {
    wx.showLoading({
      title: '',
    });
   wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'selectRecord'
      }
    }).then((resp) => {
      this.setData({
        haveGetRecord: true,
        record: resp.result.data
      });
     wx.hideLoading();
   }).catch((e) => {
      this.setData({
        showUploadTip: true
      });
     wx.hideLoading();
   });
  },

  clearRecord() {
    this.setData({
      haveGetRecord: false,
      record: ''
    });
  }

});
