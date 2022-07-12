// components/nav/nav.js
Component({
    properties: {
      title: {			// 设置标题
        type: String,
        value: ''	
      },
      cover_state: {	 // 控制页面padding-top
        type: Boolean,
        value: false
      },
      show_bol: {			// 控制返回箭头是否显示
        type: Boolean,
        value: true
      },
      my_class: {			// 控制样式
        type: Boolean,
        value: false
      }
    },
    /* 组件的初始数据 */
    data: {
      type: "组件",
      bar_Height: wx.getSystemInfoSync().statusBarHeight
              // 获取手机状态栏高度
    },
    /* 组件的方法列表 */
    methods: {
      goBack: function () {					// 返回事件
        console.log("退后")
        let pages = getCurrentPages();   //获取小程序页面栈
        let beforePage = pages[pages.length -2];
        if(beforePage.route=="pages/appointment/index"){
            beforePage.renew2();
        }
        wx.navigateBack({
          delta: 1,
        })
       
      }
    }
  
  })