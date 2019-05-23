// pages/find/performance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '',
    searchValue: ''

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = '';
    wx.getStorage({
      key: 'message',
      success: function(res) {
        data = res.data
      },
    });
    console.log(data);
    this.setData({
      message: data,
      searchValue: data
    });

    //请求 查询性能的 接口
    var performanceUrl = "http://101.201.150.7:8010/speech/performance?keyWord=单板";
    this.getperformanceData(performanceUrl);
  },

  //请求性能接口数据
  getperformanceData: function(url){
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        that.processPerformanceData(res.data);
        // console.log("==3") 
        // console.log(res.data)
      },
      complete: function () {
      },
      fail: function () {
        console.log("访问失败")
      },
    })
  },
  //解析  绑定服务器获取的数据
  processPerformanceData: function(performanceData){
    console.log(performanceData.data);
    var data = performanceData.data;
    var performanceList = [];//让performanceList成为一个数据绑定的变量

    for (var idx in data.list) {
      var performance = data.list[idx];

      var deviceName = performance.deviceName;//设备信息
      var period = performance.period;//指标名称1
      var performanceEvents = performance.performanceEvents;//指标名称2
      var valueMax = performance.valueMax;//指标信息1
      var valueCurrent = performance.valueCurrent;//指标信息2
      var valueMin = performance.valueMin;//指标信息3
      var startTime = performance.startTime;//时间信息

      //设备信息名称过长的话  截取12个字符显示
      if (deviceName.length >= 12) {
        deviceName = deviceName.substring(0, 12) + "...";
      };


      // 定义一个temp 把所有的元素都临时放到temp中，最后再push到performanceList的数组中，让performanceList成为一个数据绑定的变量
      var temp = {
        deviceName: deviceName,
        period: period,
        performanceEvents: performanceEvents,
        valueMax: valueMax,
        valueCurrent: valueCurrent,
        valueMin: valueMin,
        startTime: startTime,
      };
      console.log("temp" + deviceName + period + performanceEvents + valueMax + valueCurrent + valueMin + startTime+"");

      performanceList.push(temp);
      this.setData({
        performanceList: performanceList
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})