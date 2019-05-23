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

  },

  /**
   * 组件的方法列表
   */
  methods: {

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
              var json = JSON.parse(res.data);
              var result = JSON.parse(json.data);
              var resultObj = result.result;
              var resultStr = resultObj.toString();
              var resultStr1 = resultStr.replace('。', '');
              console.log(result);
              that.setData({
                message: resultStr1
              });
              //缓存 录入的语音内容
              wx.setStorage({
                key: "message",
                data: resultStr1,
              })

              if (resultStr.indexOf("告警") >= 0) {
                that.goAlert(); //跳转到告警界面
              } else if (resultStr.indexOf("性能") >= 0) {
                that.goPerformance(); //跳转到性能界面
              } else {
                //弹出框询问：你要找的是：告警 性能，用户选择后进行跳转。
                wx.showModal({
                  content: "关键词是性能或告警，没说关键词，要找什么",
                  confirmText: "找告警",
                  cancelText: "找性能",
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: 'details/index',
                      });
                    } else {
                      wx.navigateTo({
                        url: 'performance/index',
                      });
                    }
                  }
                })
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
      });

    },
    //跳转告警界面
    goAlert: function() {
      //录音完成后， 延时跳转到详情界面
      setTimeout(function() {
        wx.navigateTo({
          url: 'details/index',
        })
      }, 1000);
    },

    //跳转性能界面
    goPerformance: function() {
      setTimeout(function() {
        wx.navigateTo({
          url: 'performance/index',
        })
      }, 1000);
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

    actionSheetTap: function() {
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
    },
  },

})