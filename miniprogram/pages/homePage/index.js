// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
    data:{
        imgUrls: [
            '../../images/newsbelow1.jpg',
            '../../images/newsbelow2.jpg',
            '../../images/newsbelow3.jpg',
            '../../images/newsbelow4.jpg',
            '../../images/newsbelow5.jpg',
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        number:0,
    },
    
    skip :function(e) {
        var num = e.currentTarget.dataset.num;
        if (num == 1){
            wx.navigateTo({
                url: "/pages/webview/index1",
              })
        }
        if (num == 2){
            wx.navigateTo({
                url: "/pages/webview/index2",
              })
        }
        if (num == 3){
            wx.navigateTo({
                url: "/pages/webview/index3",
              })
        }
        if (num == 4){
            wx.navigateTo({
                url: "/pages/webview/index4",
              })
        }
        if (num == 5){
            wx.navigateTo({
                url: "/pages/webview/index5",
              })
        }
        if (num == data.imgUrls[1]){
            wx.navigateTo({
                url: "/pages/webview/index5",
              })
        }
      },
})

  