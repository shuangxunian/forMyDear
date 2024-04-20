// import axios from 'axios'
const axios = require('axios')
const cronJob = require('cron').CronJob

const appId = 'wxc851281d8a1c0994'
const appSecret = '97c123c746b25e354d17b26008dc768b'

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}，`;
}


const getWeather = async () => {
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=320113&key=3f388fee9f84b98ebbfa46137f40926c&extensions=all`
  const res = await axios.get(url)
  return res.data.forecasts[0].casts[0]
  // console.log(res.data.forecasts[0].casts)
  // return `${year}-${month}-${day}`;
}

const daysBetweenDates = (date1, date2) => {
  const diff = Math.abs(date2 - date1);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.floor(days/7) + 1
}

const main = async() => {

  const getTodayWeek = daysBetweenDates(new Date(), '2024-02-26')
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  const classList = [
    [],
    [
      {
        time: '3-4节',
        name: '思想道德与法治',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '行远楼（3号）3103',
      },
      {
        time: '5-6节',
        name: '数据库原理与应用',
        class: [1,2,3,4,5,6,7,8,9,10,11,12],
        where: '资讯楼215',
      },
      {
        time: '7-8节',
        name: '大学生创新教育',
        class: [1,2,3,4,5,6],
        where: '资讯楼101',
      },
      {
        time: '7-8节',
        name: '数据库原理与应用',
        class: [12],
        where: '资讯楼409',
      },
    ],
    [
      {
        time: '3-4节',
        name: '思想道德与法治',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '行远楼（3号）3103',
      },
    ],
    [],
    [],
    [],
    [],
    [],
  ]

  let accessToken = ''
  const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`)
  if (res.status === 200 && res.data && res.data.access_token) {
    accessToken = res.data.access_token
  } else {
    return
  }

  const todayWeather = await getWeather()
  let weatherValue = ''
  if (todayWeather.dayweather === todayWeather.nightweather) {
    weatherValue = todayWeather.dayweather
  } else {
    weatherValue = `${todayWeather.dayweather}转${todayWeather.nightweather}`
  }

  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`
  const data = {
    touser: 'oHccb6koTI8I8XJ9AeXj1USZwHNU',
    template_id: '14LGwP6KYHoRUguulq1mBdSxvCvIKywzjBqiVzrSj3A',
    topcolor: '#FF0000',
    data: {
      date: {
        value: getTodayDate() + weekList[Number(todayWeather.week)],
      },
      weather: {
        value: weatherValue,
      },
      min_temperature: {
        value: todayWeather.nighttemp,
      },
      max_temperature: {
        value: todayWeather.daytemp,
      },
      class: {
        value: '',
      }
    },
  }

  const finalRes = await axios.post(url, data)
  console.log(finalRes)
}

const task = cron.schedule('0 0 7 * * *', main);

task.start();
