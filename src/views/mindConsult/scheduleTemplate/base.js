const schedulData = {
  weekData: [
    { label: '周一', value: 'MONDAY' },
    { label: '周二', value: 'TUESDAY' },
    { label: '周三', value: 'WEDNESDAY' },
    { label: '周四', value: 'THURSDAY' },
    { label: '周五', value: 'FRIDAY' },
    { label: '周六', value: 'SATURDAY' },
    { label: '周日', value: 'SUNDAY' },
  ],
  flitterData(arr) {
    let spanOneArr = []
    let spanTwoArr = []
    let concatOne = 0
    let concatTwo = 0
    arr.forEach((item, index) => {
      if (index === 0) {
        spanOneArr.push(1)
        spanTwoArr.push(1)
      } else {
        if (item.deptId === arr[index - 1].deptId) {
          //第一列需合并相同内容的判断条件
          spanOneArr[concatOne] += 1
          spanOneArr.push(0)
        } else {
          spanOneArr.push(1)
          concatOne = index
        }
        if (
          item.userId === arr[index - 1].userId &&
          item.deptId === arr[index - 1].deptId
        ) {
          //第二列需合并相同内容的判断条件
          spanTwoArr[concatTwo] += 1
          spanTwoArr.push(0)
        } else {
          spanTwoArr.push(1)
          concatTwo = index
        }
      }
    })
    return {
      one: spanOneArr,
      two: spanTwoArr,
    }
  },
  //入参 格式 unselectTime=[{ startTime:"1:00", endTime:'3:00'}]
  //返回数据 [{ startTime:"00:00", endTime:'1:00'}，{ startTime:"3:00", endTime:'00:00'}]
  //转化成分钟
  toMinites(time) {
    console.log(time)
    let mins = null
    let times = time.split(':')
    mins = parseInt(times[0]) * 60 + parseInt(times[1])
    return mins
  },

  toHHmmFormat(minutes) {
    let h = null
    let m = null
    if (minutes) {
      h = ('0' + parseInt(minutes / 60)).slice(-2)
      m = ('0' + (minutes % 60)).slice(-2)
    }
    return [h, m].join(':')
  },
  formateTime(selectedTime, { startTime, endTime }) {
    console.log(endTime)
    console.log(selectedTime)
    let newSelectTime = [...selectedTime]
    selectedTime.forEach((item, index) => {
      if (
        this.toMinites(item.startTime) > this.toMinites(item.endTime) &&
        this.toMinites(item.endTime) != 0
      ) {
        newSelectTime.splice(index, 1)
        newSelectTime.push({
          startTime: item.startTime,
          endTime: endTime ? endTime : '00:00',
        })
        newSelectTime.push({
          startTime: startTime ? startTime : '00:00',
          endTime: item.endTime,
        })
      }
    })
    console.log(newSelectTime)
    return newSelectTime
  },
  vaiiatorTimeTimeIsOverlapping(selectedTime, currentTime) {
    let arr = []
    let flag = false
    let newArr = [...selectedTime]
    if (currentTime) {
      newArr.push({
        startTime: currentTime[0],
        endTime: currentTime[1],
      })
    }
    let newSelectTime = this.formateTime(newArr)
    newSelectTime.forEach(item => {
      if (
        this.toMinites(item.startTime) == this.toMinites(item.endTime) &&
        newSelectTime.length !== 1
      ) {
        flag = true
      }
      arr.push([this.toMinites(item.startTime), this.toMinites(item.endTime)])
    })
    arr.sort(function (a, b) {
      return a[0] - b[0]
    })
    arr.forEach((item, index) => {
      if (index == arr.length - 1) return
      if (item[1] > arr[index + 1][0]) {
        flag = true
      }
    })
    return flag
  },
  unselectTime(selectedTime, { startTime, endTime }) {
    let arr = [...selectedTime]
    console.log(arr)
    let newSelectTime = this.formateTime(arr, { startTime, endTime })
    let timeArr = []
    let unselectTime = []
    if (newSelectTime && newSelectTime.length) {
      for (let i = 0; i < newSelectTime.length; i++) {
        if (
          this.toMinites(newSelectTime[i].startTime) ==
          this.toMinites(newSelectTime[i].endTime)
        ) {
          return unselectTime
        }

        timeArr.push([
          this.toMinites(newSelectTime[i].startTime),
          this.toMinites(newSelectTime[i].endTime),
        ])
      }
    }

    timeArr.sort(function (a, b) {
      return a[0] - b[0]
    })
    console.log(timeArr)
    if (timeArr.length) {
      if (timeArr[0][0] !== 0 && timeArr[0][0] !== this.toMinites(startTime)) {
        console.log(11111)
        unselectTime.unshift({
          startTime: startTime ? startTime : '00:00',
          endTime: this.toHHmmFormat(timeArr[0][0]),
        })
      }
      for (let i = 0; i < timeArr.length; i++) {
        if (i + 1 > timeArr.length - 1) {
          continue
        }
        if (timeArr[i][1] == timeArr[i + 1][0]) {
          continue
        }
        unselectTime.push({
          startTime: this.toHHmmFormat(timeArr[i][1]),
          endTime: this.toHHmmFormat(timeArr[i + 1][0]),
        })
      }
      if (
        timeArr[timeArr.length - 1][1] !== 0 &&
        timeArr[timeArr.length - 1][1] !== this.toMinites(endTime)
      ) {
        console.log(2222)
        unselectTime.push({
          startTime: this.toHHmmFormat(timeArr[timeArr.length - 1][1]),
          endTime: endTime ? endTime : '00:00',
        })
      }
      // if (
      //   unselectTime.length &&
      //   unselectTime[0].startTime == (startTime ? startTime : '00:00') &&
      //   unselectTime[unselectTime.length - 1].endTime ==
      //     (endTime ? endTime : '00:00')
      // ) {

      //   let startTime = unselectTime[unselectTime.length - 1].startTime
      //   let endTime = unselectTime[0].endTime
      //   console.log(unselectTime)
      //   unselectTime.splice(0, 1)
      //   unselectTime.splice(unselectTime.length - 1, 1)
      //   unselectTime.push({
      //     startTime,
      //     endTime,
      //   })
      // }
    }
    console.log(unselectTime)
    return unselectTime
  },
}
export default schedulData
