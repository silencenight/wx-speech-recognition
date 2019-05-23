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

    var parmStr = data.toString();
    var parmStrSub1 = parmStr.replace('告警','');

      //请求 查询告警的 接口
    //var alarmUrl = "http://101.201.150.7:8010/speech/alarm?keyaWoed=" + parmStrSub1;
    var alarmUrl = "http://101.201.150.7:8010/speech/alarm?keyWord=" + parmStrSub1;
    //console.log('URL:'+alarmUrl);
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
        that.processAlarmData(res)
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
    var alarmList = [];//让shopList成为一个数据绑定的变量
    console.log('****:'+alarmData.data.data.list);
    var data = alarmData.data;
    var resultCode = data.code;
    //console.log('====data.code:' + resultCode);

    if(resultCode == 0){
      for (var idx in data.data.list) {
        var alarm = data.data.list[idx];
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
        }
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
        //console.log("temp" + alarmSource + level + province + city + specialty + endTime + "");
        alarmList.push(temp);
        this.setData({
          alarmList: alarmList
        })
    }
   
      if (resultCode == 1) {
        console.log('没有查到数据啊，该如何提示页面啊，不知道怎么绑定值。');
      }
    
  
    }
  },


})