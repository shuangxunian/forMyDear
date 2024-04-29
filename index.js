// import axios from 'axios'
const axios = require('axios')
const cron = require('node-cron')

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
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.floor(days/7) + 1
}

const getTodayClass = (nowWeek,nowWeekDay) => {
  const classList = [
    [],
    // 周一
    [
      {
        time: '3-4节',
        name: '思想道德与法治',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '3号3103',
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
      {
        time: '9-11节',
        name: '无人机应用技术',
        class: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
        where: '科技园518',
      },
    ],
    // 周二
    [
      {
        time: '1-2节',
        name: '大学英语（二）',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '3号3103',
      },
      {
        time: '3-4节',
        name: '思想道德与法治',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '3号3103',
      },
      {
        time: '5-6节',
        name: 'Web前端应用开发',
        class: [1,2,3,4,5,6,7,8,9,11,12,13],
        where: '资讯楼108',
      },
      {
        time: '7-8节',
        name: '体育',
        class: [2,4,6,8,10,12,16,18],
        where: '未排地点',
      },
    ],
    // 周三
    [
      {
        time: '1-2节',
        name: 'Web前端应用开发',
        class: [9],
        where: '资讯楼108',
      },
      {
        time: '3-4节',
        name: 'Java高级程序设计',
        class: [1,2,3,4,5,6,7,8,9,11,12,13],
        where: '资讯楼306',
      },
      {
        time: '5-6节',
        name: '高等数学',
        class: [4],
        where: '1号阶教3',
      },
      {
        time: '7-8节',
        name: '思想道德与法治',
        class: [1,2,3,4,5],
        where: '3号3101',
      },
      {
        time: '7-8节',
        name: '形势与政策（二）',
        class: [7,8,9],
        where: '3号阶教10',
      },
      {
        time: '7-8节',
        name: '大学英语（二）',
        class: [11],
        where: '1号阶教3',
      },
      {
        time: '7-8节',
        name: '高等数学（二）',
        class: [12,13,16],
        where: '1号阶教3',
      },
      {
        time: '9-11节',
        name: 'C语言程序设计基础',
        class: [3,4,5,6,7,8,9,11,12,13,14],
        where: '资讯楼215',
      },
    ],
    // 周四
    [
      {
        time: '1-2节',
        name: 'Web前端应用开发',
        class: [1,2,3,4,5,6,7,8],
        where: '资讯楼108',
      },
      {
        time: '1-2节',
        name: 'Web前端应用开发',
        class: [9,10,11,12,13,16,17,18],
        where: '资讯楼407',
      },
      {
        time: '3-4节',
        name: '数据库原理与应用',
        class: [1,2,3,4,6,7,8,9,11,12,13,16,17,18],
        where: '资讯楼215',
      },
      {
        time: '5-6节',
        name: '高等数学',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '1号阶教3',
      },
      {
        time: '7-8节',
        name: '心理健康',
        class: [1,2,3,4,5,7,8,9],
        where: '2号中教室5',
      },
    ],
    // 周五
    [
      {
        time: '3-4节',
        name: '大学英语（二）',
        class: [1,2,4,5,6,7,8,9,11,12,13,16,17,18],
        where: '1号阶教1',
      },
      {
        time: '5-6节',
        name: '高等数学',
        class: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18],
        where: '1号阶教3',
      },
    ],
    [],
    [],
  ]
  const toadyAllClass = classList[nowWeekDay]
  const arr = []
  toadyAllClass.forEach(item => {
    if (item.class.includes(nowWeek)) {
      const str = `${item.time}的${item.name}课程，在${item.where}；`
      arr.push(str)
    }
  })
  return arr
}

const main = async() => {
  const nowWeek = daysBetweenDates(new Date(), new Date('2024-02-26'))
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  // console.log(getTodayWeek)


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

  const classValue = getTodayClass(nowWeek,Number(todayWeather.week))

  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`
  const data = {
    touser: 'oHccb6koTI8I8XJ9AeXj1USZwHNU',
    template_id: 'TWAcO8OP9VtZK0Mosb3qBq4xqlLVlAvWVEcT3fVykWQ',
    topcolor: '#FF0000',
    data: {
      date: {
        value: getTodayDate() + weekList[Number(todayWeather.week)],
      },
      weather: {
        value: weatherValue,
      },
      week: {
        value: nowWeek,
      },
      min_temperature: {
        value: todayWeather.nighttemp,
      },
      max_temperature: {
        value: todayWeather.daytemp,
      },
      class1: {
        value: classValue[0] ? classValue[0] : '今天没有课哦~好好休息吧亲爱的'
      },
      class2: {
        value: classValue[1],
      },
      class3: {
        value: classValue[2],
      },
      class4: {
        value: classValue[3],
      },
      class5: {
        value: classValue[4],
      }
    },
  }

  await axios.post(url, data)
  data.touser = oHccb6lU8MnEpAJ7SQs5DXWEQLgs
  await axios.post(url, data)
}

const task = cron.schedule('0 0 7 * * *', main);

task.start();
