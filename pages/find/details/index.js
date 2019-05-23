// pages/find/details/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '',
    searchValue:''
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

      //请求 查询告警的 接口

    var alarmUrl = "http://101.201.150.7:8010/speech/alarm?keyaWoed=传输";
    this.getalarmData(alarmUrl);

  },

  //请求 告警 接口
  getalarmData: function(url){
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        that.processAlarmData(res.data)
        // console.log("==3") 
        // console.log(res.data.data)

      },
      complete: function () {

      },

      fail: function () {
        console.log("访问失败")
      },

    })
  },
  //解析服务器获取的数据
  processAlarmData: function(alarmData){
    console.log(alarmData.data);
    var data = alarmData.data;
    var alarmList = [];//让shopList成为一个数据绑定的变量

    for (var idx in data.list) {
      var alarm = data.list[idx];

      var alarmSource = alarm.alarmSource;//设备信息
      var alarmKey = alarm.alarmKey;//告警名称
      var level = alarm.level;//告警级别
      var province = alarm.province;//设备归属
      var city = alarm.city;//设备归属
      var specialty = alarm.specialty;//设备归属
      var endTime = alarm.endTime;//时间信息

    //设备信息名称过长的话  截取12个字符显示
      if (alarmSource.length >= 12) {
        alarmSource = alarmSource.substring(0, 12) + "...";
      };
     
    
      // 定义一个temp 把所有的元素都临时放到temp中，最后再push到shopList的数组中，让shopList成为一个数据绑定的变量
      var temp = {
        alarmSource: alarmSource,
        alarmKey: alarmKey,
        level: level,
        province: province,
        city: city,
        specialty: specialty,
        endTime: endTime,
      };
      console.log("temp" + alarmSource + level + province + city + specialty + endTime+ "");

      alarmList.push(temp);
      this.setData({
        alarmList: alarmList
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})