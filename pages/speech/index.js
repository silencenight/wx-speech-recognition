// pages/speech/index.js

//录音管理
const recorderManager = wx.getRecorderManager();
//音频组件控制
const innerAudioContext = wx.createInnerAudioContext();
var tempFilePath;

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
    message: "没有语音识别结果，请点击开始录音"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //开始录音
    start:function(){
      console.log('******开始录音********');
      const options = {
        duration: 10000,//制定录音的时长，单位ms
        sampleRate: 16000,//采样率
        numberOfChannels: 1,//录音通道数
        encodeBitRate: 64000,//编码码率
        format: 'mp3',//音频格式，有效值 aac/mp3
        frameSize: 50,//指定帧大小，单位 KB
      }
      //开始录音
      recorderManager.start(options);
      recorderManager.onStart(()=>{
        console.log('录音开始.');
      });
      //错误回调
      recorderManager.onError((res) => {
        console.log(res);
      })
    },
    //停止录音
    stop:function(){
      console.log('******停止录音********');
      recorderManager.stop();
      recorderManager.onStop((res) => {
        this.tempFilePath = res.tempFilePath;
        console.log('停止录音', res.tempFilePath)
        const { tempFilePath } = res
      })
    },
    //播放录音
    play: function () {
      console.log('******播放录音********');
      innerAudioContext.autoplay = true
      innerAudioContext.src = this.tempFilePath,
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    },
    //上传录
    upload: function () {
      console.log('******上传录音********');
      this.setData({
        message: '语音识别中...'
      })   
      var that = this;
      wx.uploadFile({
        //url: "http://localhost:8080/speech/upload",//演示域名、自行配置
        url: "http://101.201.150.7:8010/speech/upload",//演示域名、自行配置
        filePath: this.tempFilePath,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData:
        {
          userId: 12345678 //附加信息为用户ID
        },
        success: function (res) {
                 
          // wx.showToast({
          //   title: '上传成功',
          //   icon: 'success',
          //   duration: 2000
          // })
          console.log('===:' + res.data);
          var json = JSON.parse(res.data);
          console.log(json.data);
          var result = JSON.parse(json.data);
          console.log(result);
          that.setData({
            message:result.result
          })
        },
        fail: function (res) {
          console.log(res);
          that.setData({
            message:res.errMsg
          })
        },
        complete: function (res) {

        }
      })
    }
  }
})
