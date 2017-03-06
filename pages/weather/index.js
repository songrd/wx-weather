var util = require('../../utils/util.js')
var config = require('../../utils/config.js')
Page({
  data: {
    config : config,
    location: { },
    weatherData : { },
    animationData: { },
    isHideMore : "hidden",
    weatherImg : "00",
    isNight : 1,
    selectCityIndex : 0,
  },
  onLoad: function () {
    var that = this;
    // 设置白天还是晚上
    var nowHours = new Date().getHours();
    if (nowHours >= 7 && nowHours <= 19) {
      that.setData({
        isNight:0
      })
    }

    // 获取坐标并根据坐标获取天气信息
　　wx.getLocation({
    　　success: function (res) {
          that.setData({
            location : res        
          });
          var weatherparam = { };
          weatherparam["location"] = res["longitude"] + ',' + res["latitude"];
          //weatherparam["location"] = '杭州';
　　　　　　wx.request({
              url: 'https://api.map.baidu.com/telematics/v3/weather?output=json&ak=btsVVWf0TM1zUBEbzFz6QqWF',
              data: weatherparam,
              method: 'GET',
　　　　　　　　header: { 'Content-Type': 'application/json' },
　　　　　　　　success: function(data) {
                console.log(config);
                var res = data["data"];
                if (res["error"] === 0 && res["results"][0]) {
                  that.setData({
                    weatherData : res["results"][0],
                    weatherDataStr : getWeatherInfoStr(res["results"][0]),
                    weatherImg  : config.weaterImgResault[res["results"][0]['weather_data'][0]['weather']]
                  });
                
                }
　　　　　　　　}
    　　　　})
    　　}
    })
  },

  /**
   * select选择城市
   */
  bindPickerChange: function(e) {
    var that = this;
    var selectId = parseInt(e.detail.value);
    var selectCity = config.weaterCityList[selectId];
    var weatherparam = { };
    weatherparam["location"] = selectCity;
　　wx.request({
          url: 'https://api.map.baidu.com/telematics/v3/weather?output=json&ak=btsVVWf0TM1zUBEbzFz6QqWF',
          data: weatherparam,
          method: 'GET',
　　　　　　 header: { 'Content-Type': 'application/json' },
　　　　　　 success: function(data) {
            var res = data["data"];
            if (res["error"] === 0 && res["results"][0]) {
              that.setData({
                weatherData : res["results"][0],
                weatherDataStr : getWeatherInfoStr(res["results"][0]),
                weatherImg  : config.weaterImgResault[res["results"][0]['weather_data'][0]['weather']],
                selectCityIndex : selectId,
              });
            }
　　　   }
      })
  },

  // 展示更多天气
  showMore: function(e) {
    var animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translate(-500, 0).step()
    this.setData({
      animationData:animation.export(),
      isHideMore:""
    })
  },

  // 隐藏更多天气
  hideMore: function(e) {
    var animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translate(500, 0).step()
    this.setData({
      animationData:animation.export(),
      isHideMore:"hidden"
    })
  }

})


/**
 * 设置天气
 */
function getWeatherInfoStr(weatherData)
{
  console.log(weatherData);
  var data = '';
  data = 'PM2.5：' + weatherData.pm25 + '\n' +'日期：' + weatherData.weather_data[0].date + '\n' + '温度：' + weatherData.weather_data[0].temperature + '\n' +'天气：' + weatherData.weather_data[0].weather + '\n' +'风力：' + weatherData.weather_data[0].wind + '\n'; 

  console.log(data);

  return data;
}
