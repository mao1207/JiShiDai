const app = getApp()
 
Component({
  data: {
    content:'',//文本内容
    bottomHeight:0 //定义comment容器与page容器下边界之间的距离
  },
  methods: {
    // 获取焦点 唤起软键盘
    bindfocus(e){
        this.setData({
        bottomHeight:e.detail.height //将键盘的高度设置为comment容器与page容器下边界之间的距离。
        })
    
        },
        // 输入内容
        bindinput(e){
        this.setData({
            content:e.detail.value
        })
        },
        // 失去焦点 
        bindblur(e){
        this.setData({
            bottomHeight:0
            })
        },
        //
        sendOut(){
            this.triggerEvent('content',this.data.content);
            this.setData({
                content:'',
            })
        }
  }
})