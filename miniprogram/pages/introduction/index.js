Page({

  /**
   * 页面的初始数据
   */
  data: {
    className:'',
    classDate:'',
    classTime:'',
    classIntroduction:'',
    picture:'',
    function:'',
    classNumber:0,
    lecturer:0,
    teacher:{},
    comment:[],
    length:1200,
    id:0,
    content:'',
    color:'',
    text:'',
    index:0,
    classId:0,
    page:0,
    num:0,
    num2:0,
    num3:0,
    num4:0,
    num5:0,
  },
  //页面跳转
  skip :function(){
    var teacher = JSON.stringify(this.data.teacher);
    wx.navigateTo({
      url: '../../pages/lecturer/lecturer?teacher=' + teacher,
    })
  },  
  //检索讲师信息
  search :function(i){
    var number = this.data.lecturer;
    this.setData({
        num:i,
    })
    var that=this;
    var app = getApp();
    wx.request({
        url: 'http://192.168.1.8/dev-api/jsd/jsdlecturer/list?pageNum='+i+'&pageSize=10',
        method:'get',
        data:{  
        },
        header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
        success(res){     
            if(res.data.total+10<=that.data.num*10){
                return;
            }
            for (var i=0;i<10;i++)
            {
                if (res.data.rows.length>=i+1&&res.data.rows[i].lecturerNumber==number){
                    that.data.teacher.lecturerName=res.data.rows[i].lecturerName;
                    that.data.teacher.lecturerOrg=res.data.rows[i].lecturerOrg;
                    that.data.teacher.lecturerSex=res.data.rows[i].lecturerSex;
                    that.data.teacher.lecturerIntroduction=res.data.rows[i].lecturerIntroduction;
                    that.data.teacher.lecturerLove=res.data.rows[i].lecturerLove;
                    that.data.teacher.lecturerPicture=res.data.rows[i].lecturerPicture;
                    that.data.teacher.lecturerHead=res.data.rows[i].lecturerHead;
                    that.data.teacher.lecturerNumber=res.data.rows[i].lecturerNumber;
                    return;
                }
            }
            if(res.data.rows.length==10){
                this.search(i+1);
            }
        },
        fail:function(){
            console.log("fail")
            return ;
        }
    })   
},
  //检索评论信息
  searchComment :function(i,type){
    var number = this.data.classNumber;
    var that=this;
    var app = getApp();
    this.setData({
        num2:i,
    })
    wx.request({
        url: 'http://192.168.1.8/dev-api/jsd/jsdclasscomment/list?pageNum='+i+'&pageSize=10',
        method:'get',
        data:{  
        },
        header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
        success(res){     
            if(res.data.total+10<=that.data.num2*10){
                return;
            }
            for (var i=0;i<10;i++)
            {
                if (res.data.rows.length>=i+1&&res.data.rows[i].commentNumber==number){         
                    var comment = JSON.parse(res.data.rows[i].commentText);
                    if(type==1){
                        var height = 0;
                        for (var j=0;j<comment.length;j++){
                            comment[j].height=height;
                            height+=(parseInt(comment[j].content.length/26)+1)*20;
                            height+=140;                      
                        }
                        that.setData({
                            id:res.data.rows[i].commentId,
                            comment:comment,
                        })   
                        if(height>300){
                            that.setData({
                                length:900+height,
                            })   
                        }
                        console.log(that.data.comment);
                    }
                    if(type==2){
                        var time = new Date;
                        var year=time.getFullYear();
                        var month=time.getMonth()+1;
                        var day=time.getDate();
                        var json={
                            name:app.globalData.userNickname,
                            head:'http://192.168.1.8:8080'+app.globalData.userHead,
                            date:year+'-'+month+'-'+day,
                            content:that.data.content,
                        }
                        comment[comment.length]=json;
                        var text = JSON.stringify(comment);
                        console.log(text);
                        wx.request({
                            url: 'http://192.168.1.8/dev-api/jsd/jsdclasscomment', 
                            method:'PUT',
                            data:{
                                commentId: that.data.id,
                                commentText: text,
                            },
                            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                            success (res) {
                            that.searchComment(1,1);
                            }
                        })
                    }
                    return;
                }
            }
            if(res.data.rows.length==10){
                this.searchComment(i+1,type);
            }
        },
        fail:function(){
            console.log("fail")
            return ;
        }
    })   
},
    //上传评论信息
    uploading: function(e) {
        this.setData({
            content:e.detail,
        })
        this.searchComment(1,2);     
    },

     //上传预约信息
     upAppoint: function(e) {
        wx.showLoading({
            title: '正在预约...',
          })
        this.upAppoint4(1);
        this.upAppoint2(1);
    },

    upAppoint2 :function(i){
        var that=this;
        var app = getApp();
        this.setData({
            num4:i,
        })
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsdschedule/list?pageNum='+i+'&pageSize=10',
            method:'get',
            data:{  
            },
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success(res){    
                if(res.data.total+10<=that.data.num4*10){
                    return;
                }
                for (var i=0;i<10;i++)
                {
                    if (res.data.rows.length>=i+1&&res.data.rows[i].scheduleId==that.data.classId){  
                        that.setData({
                            page:that.data.num4,
                            index:i,
                        })
                        that.upAppoint3();
                    } 
                }
                if(res.data.rows.length==10){
                    that.upAppoint2(that.data.num4+1);
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },

    upAppoint3: function(e) {
        var that = this;
        var app = getApp();
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsdschedule/list?pageNum='+this.data.page+'&pageSize=10',
            method:'GET',
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success (res) {
                console.log(res.data);
                var appoint = JSON.parse(res.data.rows[that.data.index].scheduleAppoint);
                console.log(appoint);
                appoint[appoint.length]={"number":app.globalData.userNumber};
                console.log(appoint);
                var text = JSON.stringify(appoint);
                console.log(that.data.classId);
                wx.request({
                    url: 'http://192.168.1.8/dev-api/jsd/jsdschedule', 
                    method:'PUT',
                    data:{
                        scheduleId: that.data.classId,
                        scheduleAppoint: text,
                    },
                    header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                    success (res) {
                        wx.showToast({
                            icon:"success",
                            title: '预约成功',
                        })
                        that.setData({
                            color:"rgb(243, 153, 125)",
                            text:"取消预约",
                            function:"deleteAppoint",
                        })
                    }
                })     
            }
        })     
    },

    upAppoint4 :function(i){
        var that=this;
        var app = getApp();
        this.setData({
            num5:i,
        })
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsduser/list?pageNum='+i+'&pageSize=10',
            method:'get',
            data:{  
            },
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success(res){    
                if(res.data.total+10<=that.data.num5*10){
                    return;
                }
                for (var i=0;i<10;i++)
                {
                    if (res.data.rows.length>=i+1&&res.data.rows[i].userId==app.globalData.userId){ 
                        var appoint=JSON.parse(res.data.rows[i].userAppoint);
                        appoint[appoint.length]={"class":that.data.classId}; 
                        var text = JSON.stringify(appoint);
                        wx.request({
                            url: 'http://192.168.1.8/dev-api/jsd/jsduser', 
                            method:'PUT',
                            data:{
                                userId: app.globalData.userId,
                                userAppoint: text,
                            },
                            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                            success (res) {

                            }
                        })     
                    } 
                }
                if(res.data.rows.length==10){
                    that.upAppoint4(that.data.num5+1);
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },

    //取消预约信息
    deleteAppoint: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '您确定要取消预约吗',
            success: function (res) {
              if (res.confirm) {
                that.deleteAppoint4(1);
                that.deleteAppoint2(1);
              }
            }
        })
    },

    deleteAppoint2 :function(i){
        var that=this;
        var app = getApp();
        this.setData({
            num4:i,
        })
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsdschedule/list?pageNum='+i+'&pageSize=10',
            method:'get',
            data:{  
            },
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success(res){    
                if(res.data.total+10<=that.data.num4*10){
                    return;
                }
                for (var i=0;i<10;i++)
                {
                    if (res.data.rows.length>=i+1&&res.data.rows[i].scheduleId==that.data.classId){  
                        that.setData({
                            page:that.data.num4,
                            index:i,
                        })
                        that.deleteAppoint3();
                    } 
                }
                if(res.data.rows.length==10){
                    that.deleteAppoint2(that.data.num4+1);
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },

    deleteAppoint3: function(e) {
        var that = this;
        var app = getApp();
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsdschedule/list?pageNum='+this.data.page+'&pageSize=10',
            method:'GET',
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success (res) {
                var appoint = JSON.parse(res.data.rows[that.data.index].scheduleAppoint);
                var appoint2=[];
                for(var i=0;i<appoint.length;i++)
                {
                    if(appoint[i].number!=app.globalData.userNumber){
                        appoint2.push(appoint[i]);
                    }
                }
                var text = JSON.stringify(appoint2);               
                wx.request({
                    url: 'http://192.168.1.8/dev-api/jsd/jsdschedule', 
                    method:'PUT',
                    data:{
                        scheduleId: that.data.classId,
                        scheduleAppoint: text,
                    },
                    header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                    success (res) {
                        wx.showToast({
                            icon:"success",
                            title: '取消成功',
                        })
                        that.setData({
                            color:"rgb(243, 111, 71)",
                            text:"立即预约",
                            function:"upAppoint",
                        })
                    }
                })     
            }
        })     
    },

    deleteAppoint4 :function(i){
        console.log(i);
        var that=this;
        var app = getApp();
        this.setData({
            num5:i,
        })
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsduser/list?pageNum='+i+'&pageSize=10',
            method:'get',
            data:{  
            },
            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
            success(res){    
                if(res.data.total+10<=that.data.num5*10){
                    return;
                }
                for (var i=0;i<10;i++)
                {
                    if (res.data.rows.length>=i+1&&res.data.rows[i].userId==app.globalData.userId){ 
                        console.log(i);
                        var appoint = JSON.parse(res.data.rows[i].userAppoint);
                        var appoint2=[];
                        for(var j=0;j<appoint.length;j++)
                        {
                            if(appoint[j].class!=that.data.classId){
                                appoint2.push(appoint[j]);
                            }
                        }
                        var text = JSON.stringify(appoint2);
                        wx.request({
                            url: 'http://192.168.1.8/dev-api/jsd/jsduser', 
                            method:'PUT',
                            data:{
                                userId: app.globalData.userId,
                                userAppoint: text,
                            },
                            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                            success (res) {
                                console.log("that.data.num5");
                                return;
                            }
                        })     
                    } 
                }
                if(res.data.rows.length==10){
                    that.deleteAppoint4(that.data.num5+1);
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },
    //取消预约信息
    deleteAppoint9: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '您确定要取消预约吗',
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                wx.showLoading({
                  title: '正在取消预约...',
                })
                var app = getApp();
                wx.request({
                    url: 'http://192.168.1.8/dev-api/jsd/jsdschedule/list?pageNum='+that.data.page+'&pageSize=10',
                    method:'GET',
                    header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                    success (res) {
                        console.log(res.data);
                        var appoint = JSON.parse(res.data.rows[that.data.index].scheduleAppoint);
                        var appoint2=[];
                        for(var i=0;i<appoint.length;i++)
                        {
                            if(appoint[i].number!=app.globalData.userNumber){
                                appoint2.push(appoint[i]);
                            }
                        }
                        var text = JSON.stringify(appoint2);
                        console.log(that.data.classId);
                        wx.request({
                            url: 'http://192.168.1.8/dev-api/jsd/jsdschedule', 
                            method:'PUT',
                            data:{
                                scheduleId: that.data.classId,
                                scheduleAppoint: text,
                            },
                            header: { 'Content-Type': 'application/json','Authorization': app.globalData.token},
                            success (res) {
                                wx.hideLoading({
                                  success: (res) => {
                                    wx.hideLoading({
                                      success: (res) => {},
                                    })
                                    wx.showToast({
                                        icon:"success",
                                        title: '取消成功',
                                    })
                                    that.setData({
                                        color:"rgb(243, 111, 71)",
                                        text:"立即预约",
                                        function:"upAppoint",
                                    })
                                  },
                                })
                            }
                        })     
                    }
                })     
              } else {//这里是点击了取消以后
                console.log('用户点击取消')
              }
            }
          })
    },

    //加载我的课程

    onShow(options){
        var that = this;
        setInterval(
            function(){
                that.setData({
                    teacher:that.data.teacher,
                })        
            }
        ,50)
    },
    onLoad(options){
        var userInfo = JSON.parse(options.userInfo);
        this.setData({
            classNumber:userInfo.classes,
            className:userInfo.name,
            classDate:userInfo.date,
            classTime:userInfo.time,
            classIntroduction:userInfo.introduction,
            picture:userInfo.picture,
            lecturer:userInfo.lecturer,
            classId:userInfo.id,        
        })
        if(userInfo.personState=='已预约'){
            this.setData({
                color:"rgb(243, 153, 125)",
                text:"取消预约",
                function:"deleteAppoint",
            })
        }
        if(userInfo.personState=='预约'){
            this.setData({
                color:"rgb(243, 111, 71)",
                text:"立即预约",
                function:"upAppoint",
            })
        }
        console.log(this.data.classNumber);
        this.search(1);
        this.searchComment(1,1);
    }
})  