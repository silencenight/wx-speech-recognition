Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    message: '',
    actionSheetHidden: true,
    luStatu: false, //di'bu
    list: [],
    width: 0,
    hiddenmodal: true,  //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    //弹出询问框
    modalinput: function () {
      this.setData({
        hiddenmodal: !this.data.hiddenmodal
      })
    },
    //告警 按钮  
    cancel: function () {
      console.log("告警 按钮 ");
      this.setData({
        hiddenmodal: true
      });
      wx.navigateTo({
        url: 'details/index',
      });
      
    },
    //性能 按钮  
    confirm: function () {
      console.log("性能 按钮 ");
      this.setData({
        hiddenmodal: true
      })
      wx.navigateTo({
        url: 'performance/index',
      });
     
    },






    // 触摸开始
    touchStart: function(e) {
      // console.log('touchStart', e);
      var start = e.timeStamp;
      var seconds = (start % (1000 * 60)) / 1000;
      this.setData({
        start: seconds,
        luStatu: true,
      })
      this.recorderManager.start({
        format: 'mp3'
      });
    },
    // 触摸结束
    touchEnd: function(e) {
      // console.log('touchEnd', e);
      var start = this.data.start;
      var end = e.timeStamp;
      var seconds = (end % (1000 * 60)) / 1000;
      var shijian = seconds - start;
      var width = shijian * 4;
      this.setData({
        end: seconds,
        shijian: shijian,
        luStatu: false,
        width: width
      })
      this.recorderManager.stop();
      console.log('按了' + shijian + '秒');
      console.log('width是', width);

    },
    // 实时监测变化调用这些方法
    onShow: function(e) {
      var that = this;
      //  初始化录音对象
      this.recorderManager = wx.getRecorderManager();
      this.recorderManager.onError(function() {
        that.tip("录音失败！")
      });

      // 录音结束
      this.recorderManager.onStop(function(res) {
        that.setData({
            message: '语音识别中...'
          }),
          wx.uploadFile({
            //url: "http://localhost:8080/speech/upload",//演示域名、自行配置
            url: "http://101.201.150.7:8010/speech/upload", //演示域名、自行配置
            filePath: res.tempFilePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              userId: 12345678 //附加信息为用户ID
            },
            success: function(res) {
              console.log('===1:' + res.data);
              var json = JSON.parse(res.data);
              console.log('===2:' + json.data);
              var result = JSON.parse(json.data);
              console.log(result);
              that.setData({
                message: result.result
              });

              // 睡眠半秒，然后请求接口？跳转页面
              //判断包含的字符串
              var resultObj = result.result;
              var resultStr = resultObj.toString();
              // console.log(resultStr.indexOf("告警"));
              //console.log('dbac'.indexOf('a')); 

              if (resultStr.indexOf("告警") >= 0) {
                console.log('==================');
                that.goAlert(); //跳转到告警界面
               
                //缓存 录入的语音内容
                wx.setStorage({
                  key: "message",
                  data: resultStr,
                })

              } else if (resultStr.indexOf("性能") >= 0) {
                console.log('-------------------');
                that.goPerformance(); //跳转到性能界面
              
                //缓存 录入的语音内容
                wx.setStorage({
                  key: "message",
                  data: resultStr,
                });
              } else {
                //弹出框询问：你要找的是：告警 性能，用户选择后进行跳转。
                console.log("弹出框询问：你要找的是：告警 性能，用户选择后进行跳转");
                that.actionSheetTap();//关掉底部弹框
                that.modalinput();
               
             

              }

            },

            fail: function(res) {
              console.log(res);
              that.setData({
                message: res.errMsg
              })
            },
          });

        // that.tip("录音完成！")
        // console.log('录音结果===================');
        // console.log(result.result);

      });


      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.onError((res) => {
        that.tip("播放录音失败！")
      })
    },
    //跳转告警界面
    goAlert: function() {
      //录音完成后， 延时跳转到详情界面
      setTimeout(function() {
        wx.navigateTo({
          url: 'details/index',
        })
      }, 1000);


      console.log('=====================');
    },

    //跳转性能界面
    goPerformance: function() {
      setTimeout(function() {
        wx.navigateTo({
          url: 'performance/index',
        })
      }, 1000);
      console.log('++++++++++++++++++');
    },

    tip: function(msg) {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
      })
    },

    // 播放录音
    audioPlay: function(e) {
      var that = this;
      var src = e.currentTarget.dataset.src;
      if (src == '') {
        this.tip("失效")
        return;
      }
      this.innerAudioContext.src = src;
      this.innerAudioContext.play();
    },
    //=========================底部弹出框==================================
    //=========================底部弹出框==================================
    //=========================不显示我猜跟这有关系吧。你再看看吧。==================================
    actionSheetTap: function() {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
    },
  },

})