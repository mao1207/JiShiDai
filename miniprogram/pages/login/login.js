
Page({ 
    data: { 
      phone: '', 
      password:'' ,
      num:0,
    }, 
   //request异步处理
    newRequest :function(i){
        var that=this;
        var app = getApp();
        this.setData({
            num:i,
        })
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsduser/list?pageNum='+i+'&pageSize=10',
            method:'get',
            data:{  
            },
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success(res){
                console.log(res.data);
                if(res.data.total+10<=that.data.num*10)
                {
                    wx.showToast({
                        icon:'error',
                        title: '账号或密码错误',
                        duration:1500,
                    })
                    return ;
                }
                for (var j=0;j<res.data.rows.length;j++)
                {
                    if(that.data.phone==res.data.rows[j].userNumber&&that.data.password==res.data.rows[j].userPassword)
                    {
                        wx.showLoading({
                            title:'正在登录...'
                        })
                        setTimeout(
                            function(){
                                var app = getApp()
                                app.globalData.userName = res.data.rows[j].userName;
                                app.globalData.userClass = res.data.rows[j].userClass;
                                app.globalData.userAuthority = res.data.rows[j].userAuthority;
                                app.globalData.userNickname = res.data.rows[j].userNickname;
                                app.globalData.userNumber = res.data.rows[j].userNumber;
                                app.globalData.userSex = res.data.rows[j].userSex;
                                app.globalData.userHead = res.data.rows[j].userHead;
                                app.globalData.userId = res.data.rows[j].userId;
                                wx.switchTab({
                                    url: '/pages/homePage/index',
                                  })
                            }
                        ,2000)
                        return;
                    }
                }
                if(res.data.rows.length==10){
                    that.newRequest(i+1);
                }
                else{
                    wx.showToast({
                        icon:'error',
                        title: '账号或密码错误',
                        duration:1500,
                    })
                    return ;
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },
  // 获取输入账号 
    phoneInput :function (e) { 
      this.setData({ 
        phone:e.detail.value 
      }) 
    }, 
   
  // 获取输入密码 
    passwordInput :function (e) { 
      this.setData({ 
        password:e.detail.value 
      })   
    }, 
  // 登录 
    login: function () { 
      if(this.data.phone.length == 0 || this.data.password.length == 
  0){ 
        wx.showToast({   
          title: '账号或密码不能为空',   
          icon: 'none',   
          duration: 2000    
        })   
  }else { 
        this.newRequest(1);
      }   
    }, 
    onLoad(options){
        wx.request({
            url: 'http://192.168.1.8/dev-api/login',
            header:{'content-type':'application/json'},
            data: {
                password: "admin123",
                username: "admin",
            },
            method:'POST',
            success(res)
            {
                var app = getApp();
                app.globalData.token='Bearer '+res.data.token;
            }
        })
    }
  }) 
