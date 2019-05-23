// pages/record/index.js
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
    luStatu: false,//di'bu
    list: [],
    width: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 触摸开始
    touchStart: function (e) {
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
    touchEnd: function (e) {
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
    onShow: function (e) {
      var that = this;
      //  初始化录音对象
      this.recorderManager = wx.getRecorderManager();
      this.recorderManager.onError(function () {
        that.tip("录音失败！")
      });

      // 录音结束
      this.recorderManager.onStop(function (res) {
        var list = that.data.list;
        var width = that.data.width;
        var src = res.tempFilePath;
        console.log('list的1是', list)
        // console.log(src)
        var aa = {
          src: src,
          width: width,
          play: false
        }
        list.push(aa);
        console.log('list的2是', list)
        that.setData({
          list: list
        })

        // that.tip("录音完成！")
        //console.log(list)
      });

      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.onError((res) => {
        that.tip("播放录音失败！")
      })
    },
    tip: function (msg) {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
      })
    },

    // 播放录音
    audioPlay: function (e) {
      var that = this;
      var src = e.currentTarget.dataset.src;
      if (src == '') {
        this.tip("失效")
        return;
      }
      this.innerAudioContext.src = src;
      this.innerAudioContext.play();
    },
  }
})
