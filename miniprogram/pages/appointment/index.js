function judgeYear(year){
    if(year%400==0||((year%4==0)&&(year%100!=0))){
        return true;
    }
    else{
        return false;
    }
};

function addDay(day1){
    var day2 = 0;
    if(day1==6){
        day2=0;
    }
    else{
        day2=day1+1;
    }
    return day2;
};

function addMonth(day1,month1,year1){
    if(judgeYear(year1)){
        var month=[31,29,31,30,31,30,31,31,30,31,30,31];
    }
    else{
        var month=[31,28,31,30,31,30,31,31,30,31,30,31];
    }
    var month2 = 0;
   if(day1<month[month1-1]){
       month2=month1;
   }
   else{
       if(month1==12){
           month2=1;
       }
       else{
        month2=month1+1;
       }
   }
   return month2;
};

function addDate(day1,month1,year1){
    if(judgeYear(year1)){
        var month=[31,29,31,30,31,30,31,31,30,31,30,31];
    }
    else{
        var month=[31,28,31,30,31,30,31,31,30,31,30,31];
    }
    var day2 = 0;
    if(day1<month[month1-1]){
        day2=day1+1;
    }
    else{
        day2=1;
    }
    return day2;
};

function addYear(day1,month1,year1){
    var year2 = 0;
    if(month1==12&&day1==31){
        year2=year1+1;
    }
    else{
        year2=year1;
    }
    return year2;
};

function minusDay(day1){
    var day2 = 0;
    if(day1==0){
        day2=6;
    }
    else{
        day2=day1-1;
    }
    return day2;
};

function minusMonth(day1,month1){
    var month2 = 0;
    if(day1>1){
        month2=month1;
    }
    else{
        if(month1==1){
            month2=12;
        }
        else{
            month2=month1-1;
        }
    }
    return month2;
};

function minusDate(day1,month1,year1){
    if(judgeYear(year1)){
        var month=[31,29,31,30,31,30,31,31,30,31,30,31];
    }
    else{
        var month=[31,28,31,30,31,30,31,31,30,31,30,31];
    }
    var day2 = 0;
    if(day1>1){
        day2=day1-1;
    }
    else{
        if(month1==1){
            day2=31;
        }
        else{
            day2=month[month1-2];
        }
    }
    return day2;
};

function minusYear(day1,month1,year1){
    var year2 = 0;
    if(month1==1&&day1==1){
        year2=year1-1;
    }
    else{
        year2=year1;
    }
    return year2;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classtext1:'textclick1',
    classtext2:'text2',
    classtext3:'text3',
    underlinestyle:'underline1',
    display1:'block',
    display2:'none',
    display3:'none',
    class1display:'block',
    cancelStyle:'',
    index:0,
    step:7,
    state:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    num:0,
    num2:0,
    canlendar: [
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute1',
            class2:'day1',
            day:'',
            year:'',
            number:''
        },
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute2',
            class2:'day2',
            day:'',
            year:'',
            number:''
        },
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute3',
            class2:'day3',
            day:'',
            year:'',
            number:''
        },
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute4',
            class2:'day4',
            day:'',
            year:'',
            number:''
        },
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute5',
            class2:'day5',
            day:'',
            year:'',
            number:''
        },
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute6',
            class2:'day6',
            day:'',
            year:'',
            number:''
        },
        {
            dateMonth:'',
            dateDay:'',
            class1:'dute7',
            class2:'day7',
            day:'',
            year:'',
            number:''
        },
    ],
    class:[
        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
    ],
  },
    //页面跳转
    skip :function(e){
        var index = e.currentTarget.dataset.num;
        var userInfo = JSON.stringify(this.data.class[this.data.step][index]);
        wx.navigateTo({
          url: '../../pages/introduction/index?userInfo=' + userInfo,
        })
    },

    skip2 :function(e){
        wx.navigateTo({
          url: '../../pages/search/search'
        })
    },
    //图片缓存
    download :function(x,index){
        var that = this;
        wx.downloadFile({
            url: x,
            success: function(res) {
              if (res.statusCode === 200) {
                console.log('图片下载成功' + res.tempFilePath)
                const fs = wx.getFileSystemManager()
                fs.saveFile({
                  tempFilePath: res.tempFilePath, // 传入一个临时文件路径
                  success(res) {
                    console.log('图片缓存成功', res.savedFilePath);
                    wx.setStorageSync('image_cache', res.savedFilePath);
                    that.data.class[that.data.step][index].picture=res.savedFilePath;
                  }
                })
              }else {
                console.log('响应失败', res.statusCode)
              }
            }
        })
    },
    //检索课程信息
    search :function(i,number,index){
        var that=this;
        this.setData({
            num2:i,
        })
        var app = getApp();
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsdclasses/list?pageNum='+i+'&pageSize=10',
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
                    if (res.data.rows.length>=i+1&&res.data.rows[i].classesNumber==number){
                        that.data.class[that.data.step][index].name=res.data.rows[i].classesName;
                        that.data.class[that.data.step][index].org=res.data.rows[i].classesOrg;
                        that.data.class[that.data.step][index].introduction=res.data.rows[i].classesIntroduction;
                        that.download('http://192.168.1.8/dev-api'+res.data.rows[i].classesPicture,index);
                        console.log(that.data.class);
                    }
                    var state = 'state['+that.data.step+']';
                    that.setData({
                        [state]:1,
                    })
                }     
                if(res.data.rows.length==10){
                    that.search(i+1,number,index);
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },
    //request异步处理
     newRequest :function(i){
        var that=this;
        this.setData({
            num:i,
        })
        var app = getApp();
        wx.request({
            url: 'http://192.168.1.8/dev-api/jsd/jsdschedule/list?pageNum='+i+'&pageSize=10',
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
                    if (res.data.rows.length>=i+1&&res.data.rows[i].scheduleDate==that.data.canlendar[3].year+'/'+that.data.canlendar[3].dateMonth+'/'+that.data.canlendar[3].dateDay){
                        var classes = res.data.rows[i].scheduleClass;
                        var date = res.data.rows[i].scheduleDate;
                        var time = res.data.rows[i].scheduleTime;
                        var place = res.data.rows[i].schedulePlace;
                        var num = res.data.rows[i].scheduleNum;
                        var apppoint = res.data.rows[i].scheduleAppoint;
                        var lecturer = res.data.rows[i].scheduleLecturer;
                        var code = res.data.rows[i].scheduleCode;
                        var state = res.data.rows[i].scheduleState;
                        var id = res.data.rows[i].scheduleId;
                        var personState = "预约";
                        var personText = 550.22;
                        var personColor="rgb(243, 111, 71)";
                        var text = JSON.parse(res.data.rows[i].scheduleAppoint);
                        for (var j=0;j<text.length;j++)
                        {
                            if(app.globalData.userNumber==text[j].number)
                            {
                                personState="已预约";
                                personText=536.22;
                                personColor="rgb(243, 153, 125)";
                                break;
                            }
                        }
                        var json={
                            classes:classes,
                            date:date,
                            time:time,
                            place:place,
                            num:num,
                            apppoint:apppoint,
                            lecturer:lecturer,
                            code:code,
                            state:state,
                            personState:personState,
                            personText:personText,
                            personColor:personColor,
                            id:id,
                        }
                        var cla = 'class['+that.data.step+']';
                        that.setData({
                            [cla]:that.data.class[that.data.step].concat(json),
                        })
                        that.search(1,classes,that.data.index)
                        that.setData({
                            index:that.data.index+1,
                        })
                    }
                }         
                if(res.data.rows.length==10){
                    console.log("iojqwcji");
                    that.newRequest(that.data.num+1);
                }
            },
            fail:function(){
                console.log("fail")
                return ;
            }
        })   
    },
    
    textclick1(){
        if(this.data.classtext1!='textclick1'){
            this.renew();
        }
        this.setData({
            classtext1:'textclick1',
            classtext2:'text2',
            classtext3:'text3',
            underlinestyle:'underline1',
            display1:'block',
            display2:'none',
            display3:'none',
        });
    },

    textclick2(){
        if(this.data.classtext2!='textclick2'){
            this.renew();
        }
        this.setData({
            classtext1:'text1',
            classtext2:'textclick2',
            classtext3:'text3',
            underlinestyle:'underline2',
            display1:'none',
            display2:'block',
            display3:'none',
        });
    },

    textclick3(){
        if(this.data.classtext3!='textclick3'){
            this.renew();
        }
        this.setData({
            classtext1:'text1',
            classtext2:'text2',
            classtext3:'textclick3',
            underlinestyle:'underline3',
            display1:'none',
            display2:'none',
            display3:'block',
        });
    },

    rightShift(){
        var dayName = ["周日","周一","周二","周三","周四","周五","周六"];
        var dateMonth0=addMonth(this.data.canlendar[0].dateDay,this.data.canlendar[0].dateMonth,this.data.canlendar[0].year);
        var dateDay0=addDate(this.data.canlendar[0].dateDay,this.data.canlendar[0].dateMonth,this.data.canlendar[0].year);
        var day0=addDay(this.data.canlendar[0].number);
        var year0=addYear(this.data.canlendar[0].dateDay,this.data.canlendar[0].dateMonth,this.data.canlendar[0].year);
        var dateMonth1=addMonth(this.data.canlendar[1].dateDay,this.data.canlendar[1].dateMonth,this.data.canlendar[1].year);
        var dateDay1=addDate(this.data.canlendar[1].dateDay,this.data.canlendar[1].dateMonth,this.data.canlendar[1].year);
        var day1=addDay(this.data.canlendar[1].number);
        var year1=addYear(this.data.canlendar[1].dateDay,this.data.canlendar[1].dateMonth,this.data.canlendar[1].year);
    var dateMonth2=addMonth(this.data.canlendar[2].dateDay,this.data.canlendar[2].dateMonth,this.data.canlendar[2].year);
        var dateDay2=addDate(this.data.canlendar[2].dateDay,this.data.canlendar[2].dateMonth,this.data.canlendar[2].year);
        var day2=addDay(this.data.canlendar[2].number);
        var year2=addYear(this.data.canlendar[2].dateDay,this.data.canlendar[2].dateMonth,this.data.canlendar[2].year);
var dateMonth3=addMonth(this.data.canlendar[3].dateDay,this.data.canlendar[3].dateMonth,this.data.canlendar[3].year);
        var dateDay3=addDate(this.data.canlendar[3].dateDay,this.data.canlendar[3].dateMonth,this.data.canlendar[3].year);
        var day3=addDay(this.data.canlendar[3].number);
        var year3=addYear(this.data.canlendar[3].dateDay,this.data.canlendar[3].dateMonth,this.data.canlendar[3].year);
var dateMonth4=addMonth(this.data.canlendar[4].dateDay,this.data.canlendar[4].dateMonth,this.data.canlendar[4].year);
        var dateDay4=addDate(this.data.canlendar[4].dateDay,this.data.canlendar[4].dateMonth,this.data.canlendar[4].year);
        var day4=addDay(this.data.canlendar[4].number);
        var year4=addYear(this.data.canlendar[4].dateDay,this.data.canlendar[4].dateMonth,this.data.canlendar[4].year);
var dateMonth5=addMonth(this.data.canlendar[5].dateDay,this.data.canlendar[5].dateMonth,this.data.canlendar[5].year);
        var dateDay5=addDate(this.data.canlendar[5].dateDay,this.data.canlendar[5].dateMonth,this.data.canlendar[5].year);
        var day5=addDay(this.data.canlendar[5].number);
        var year5=addYear(this.data.canlendar[5].dateDay,this.data.canlendar[5].dateMonth,this.data.canlendar[5].year);
var dateMonth6=addMonth(this.data.canlendar[6].dateDay,this.data.canlendar[6].dateMonth,this.data.canlendar[6].year);
        var dateDay6=addDate(this.data.canlendar[6].dateDay,this.data.canlendar[6].dateMonth,this.data.canlendar[6].year);
        var day6=addDay(this.data.canlendar[6].number);
        var year6=addYear(this.data.canlendar[6].dateDay,this.data.canlendar[6].dateMonth,this.data.canlendar[6].year);
        this.setData({
            'canlendar[0].dateMonth':dateMonth0,
            'canlendar[0].dateDay':dateDay0,
            'canlendar[0].day':dayName[day0],
            'canlendar[0].year':year0,
            'canlendar[0].number':day0,
            'canlendar[1].dateMonth':dateMonth1,
            'canlendar[1].dateDay':dateDay1,
            'canlendar[1].day':dayName[day1],
            'canlendar[1].year':year1,
            'canlendar[1].number':day1,
            'canlendar[2].dateMonth':dateMonth2,
            'canlendar[2].dateDay':dateDay2,
            'canlendar[2].day':dayName[day2],
            'canlendar[2].year':year2,
            'canlendar[2].number':day2,
            'canlendar[3].dateMonth':dateMonth3,
            'canlendar[3].dateDay':dateDay3,
            'canlendar[3].day':dayName[day3],
            'canlendar[3].year':year3,
            'canlendar[3].number':day3,
            'canlendar[4].dateMonth':dateMonth4,
            'canlendar[4].dateDay':dateDay4,
            'canlendar[4].day':dayName[day4],
            'canlendar[4].year':year4,
            'canlendar[4].number':day4,
            'canlendar[5].dateMonth':dateMonth5,
            'canlendar[5].dateDay':dateDay5,
            'canlendar[5].day':dayName[day5],
            'canlendar[5].year':year5,
            'canlendar[5].number':day5,
            'canlendar[6].dateMonth':dateMonth6,
            'canlendar[6].dateDay':dateDay6,
            'canlendar[6].day':dayName[day6],
            'canlendar[6].year':year6,
            'canlendar[6].number':day6,
        });
        this.setData({
            step:this.data.step+1,
            index:0,
        })
        if(this.data.state[this.data.step]==0)
        {
            this.newRequest(1);
        }
    },

    renew(){
        var dayName = ["周日","周一","周二","周三","周四","周五","周六"];
        var time = new Date;
        var Month = time.getMonth() + 1;
        var Day = time.getDate();
        var year = time.getFullYear();
        var W = time.getDay();
        var dateMonth4 =addMonth(Day,Month,year);
        var dateDay4=addDate(Day,Month,year);
        var day4=addDay(W);
        var year4=addYear(Day,Month,year);
        var dateMonth5 =addMonth(dateDay4,dateMonth4,year4);
        var dateDay5=addDate(dateDay4,dateMonth4,year4);
        var day5=addDay(day4);
        var year5=addYear(dateDay4,dateMonth4,year4);
        var dateMonth6 =addMonth(dateDay5,dateMonth5,year5);
        var dateDay6=addDate(dateDay5,dateMonth5,year5);
        var day6=addDay(day5);
        var year6=addYear(dateDay5,dateMonth5,year5);
        var dateMonth2 =minusMonth(Day,Month);
        var dateDay2=minusDate(Day,Month,year);
        var day2=minusDay(W);
        var year2=minusYear(Day,Month,year);
        var dateMonth1 =minusMonth(dateDay2,dateMonth2);
        var dateDay1=minusDate(dateDay2,dateMonth2,year2);
        var day1=minusDay(day2);
        var year1=minusYear(dateDay2,dateMonth2,year2);
        var dateMonth0 =minusMonth(dateDay1,dateMonth1);
        var dateDay0=minusDate(dateDay1,dateMonth1,year1);
        var day0=minusDay(day1);
        var year0=minusYear(dateDay1,dateMonth1,year1);
        this.setData({
            step:7,
            index:0,
            'canlendar[3].dateMonth':Month,
            'canlendar[3].dateDay':Day,
            'canlendar[3].day':dayName[W],
            'canlendar[3].year':year,
            'canlendar[3].number':W,
            'canlendar[4].dateMonth':dateMonth4,
            'canlendar[4].dateDay':dateDay4,
            'canlendar[4].day':dayName[day4],
            'canlendar[4].year':year4,
            'canlendar[4].number':day4,
            'canlendar[5].dateMonth':dateMonth5,
            'canlendar[5].dateDay':dateDay5,
            'canlendar[5].day':dayName[day5],
            'canlendar[5].year':year6,
            'canlendar[5].number':day5,
            'canlendar[6].dateMonth':dateMonth6,
            'canlendar[6].dateDay':dateDay6,
            'canlendar[6].day':dayName[day6],
            'canlendar[6].year':year6,
            'canlendar[6].number':day6,
            'canlendar[0].dateMonth':dateMonth0,
            'canlendar[0].dateDay':dateDay0,
            'canlendar[0].day':dayName[day0],
            'canlendar[0].year':year0,
            'canlendar[0].number':day0,
            'canlendar[1].dateMonth':dateMonth1,
            'canlendar[1].dateDay':dateDay1,
            'canlendar[1].day':dayName[day1],
            'canlendar[1].year':year1,
            'canlendar[1].number':day1,
            'canlendar[2].dateMonth':dateMonth2,
            'canlendar[2].dateDay':dateDay2,
            'canlendar[2].day':dayName[day2],
            'canlendar[2].year':year2,
            'canlendar[2].number':day2,
        });
    },
    
    leftShift(){
        var dayName = ["周日","周一","周二","周三","周四","周五","周六"];
        var dateMonth0=minusMonth(this.data.canlendar[0].dateDay,this.data.canlendar[0].dateMonth);
        var dateDay0=minusDate(this.data.canlendar[0].dateDay,this.data.canlendar[0].dateMonth,this.data.canlendar[0].year);
        var day0=minusDay(this.data.canlendar[0].number);
        var year0=minusYear(this.data.canlendar[0].dateDay,this.data.canlendar[0].dateMonth,this.data.canlendar[0].year);
        var dateMonth1=minusMonth(this.data.canlendar[1].dateDay,this.data.canlendar[1].dateMonth);
        var dateDay1=minusDate(this.data.canlendar[1].dateDay,this.data.canlendar[1].dateMonth,this.data.canlendar[1].year);
        var day1=minusDay(this.data.canlendar[1].number);
        var year1=minusYear(this.data.canlendar[1].dateDay,this.data.canlendar[1].dateMonth,this.data.canlendar[1].year);
    var dateMonth2=minusMonth(this.data.canlendar[2].dateDay,this.data.canlendar[2].dateMonth);
        var dateDay2=minusDate(this.data.canlendar[2].dateDay,this.data.canlendar[2].dateMonth,this.data.canlendar[2].year);
        var day2=minusDay(this.data.canlendar[2].number);
        var year2=minusYear(this.data.canlendar[2].dateDay,this.data.canlendar[2].dateMonth,this.data.canlendar[2].year);
var dateMonth3=minusMonth(this.data.canlendar[3].dateDay,this.data.canlendar[3].dateMonth);
        var dateDay3=minusDate(this.data.canlendar[3].dateDay,this.data.canlendar[3].dateMonth,this.data.canlendar[3].year);
        var day3=minusDay(this.data.canlendar[3].number);
        var year3=minusYear(this.data.canlendar[3].dateDay,this.data.canlendar[3].dateMonth,this.data.canlendar[3].year);
var dateMonth4=minusMonth(this.data.canlendar[4].dateDay,this.data.canlendar[4].dateMonth);
        var dateDay4=minusDate(this.data.canlendar[4].dateDay,this.data.canlendar[4].dateMonth,this.data.canlendar[4].year);
        var day4=minusDay(this.data.canlendar[4].number);
        var year4=minusYear(this.data.canlendar[4].dateDay,this.data.canlendar[4].dateMonth,this.data.canlendar[4].year);
var dateMonth5=minusMonth(this.data.canlendar[5].dateDay,this.data.canlendar[5].dateMonth);
        var dateDay5=minusDate(this.data.canlendar[5].dateDay,this.data.canlendar[5].dateMonth,this.data.canlendar[5].year);
        var day5=minusDay(this.data.canlendar[5].number);
        var year5=minusYear(this.data.canlendar[5].dateDay,this.data.canlendar[5].dateMonth,this.data.canlendar[5].year);
var dateMonth6=minusMonth(this.data.canlendar[6].dateDay,this.data.canlendar[6].dateMonth);
        var dateDay6=minusDate(this.data.canlendar[6].dateDay,this.data.canlendar[6].dateMonth,this.data.canlendar[6].year);
        var day6=minusDay(this.data.canlendar[6].number);
        var year6=minusYear(this.data.canlendar[6].dateDay,this.data.canlendar[6].dateMonth,this.data.canlendar[6].year);
        this.setData({
            'canlendar[0].dateMonth':dateMonth0,
            'canlendar[0].dateDay':dateDay0,
            'canlendar[0].day':dayName[day0],
            'canlendar[0].year':year0,
            'canlendar[0].number':day0,
            'canlendar[1].dateMonth':dateMonth1,
            'canlendar[1].dateDay':dateDay1,
            'canlendar[1].day':dayName[day1],
            'canlendar[1].year':year1,
            'canlendar[1].number':day1,
            'canlendar[2].dateMonth':dateMonth2,
            'canlendar[2].dateDay':dateDay2,
            'canlendar[2].day':dayName[day2],
            'canlendar[2].year':year2,
            'canlendar[2].number':day2,
            'canlendar[3].dateMonth':dateMonth3,
            'canlendar[3].dateDay':dateDay3,
            'canlendar[3].day':dayName[day3],
            'canlendar[3].year':year3,
            'canlendar[3].number':day3,
            'canlendar[4].dateMonth':dateMonth4,
            'canlendar[4].dateDay':dateDay4,
            'canlendar[4].day':dayName[day4],
            'canlendar[4].year':year4,
            'canlendar[4].number':day4,
            'canlendar[5].dateMonth':dateMonth5,
            'canlendar[5].dateDay':dateDay5,
            'canlendar[5].day':dayName[day5],
            'canlendar[5].year':year5,
            'canlendar[5].number':day5,
            'canlendar[6].dateMonth':dateMonth6,
            'canlendar[6].dateDay':dateDay6,
            'canlendar[6].day':dayName[day6],
            'canlendar[6].year':year6,
            'canlendar[6].number':day6,
        });
        this.setData({
            step:this.data.step-1,
            index:0,
        })
        if(this.data.state[this.data.step]==0)
        {
            this.newRequest(1);
        }
    },

    onShow(options){
        var that = this;
        setInterval(
            function(){
                that.setData({
                    class:that.data.class,
                })        
            }
        ,50)
    },

    renew2(){
        this.setData({
            index:0,
            state:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            class:[
                [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
            ],
        })
        var that=this;
        that.newRequest(1);
      }, 
    
    onLoad(options) {
        this.renew();
        var that=this;
        that.newRequest(1);
      }, 
});
