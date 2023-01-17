const list = [
  {
    title: '2周内情况',
    child: [
      {
        title: '2周内是否有衢州外旅居史',
        id: '1',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内是否有国外旅居史',
        id: '2',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内是否到过中高风险地区',
        id: '3',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内是否接触过来自中高风险地区的人员',
        id: '4',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内是否有发热或者呼吸道症状',
        id: '5',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内是否接触新冠确诊患者',
        id: '6',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内周围是否有聚集性发热、咳嗽等患者',
        id: '7',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '2周内是否乘坐长途汽车/飞机/轮船等',
        id: '8',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
    ],
  },
  {
    title: '目前情况',
    child: [
      {
        title: '实测体温',
        id: '9',
        value: null,
      },
      {
        title: '是否出现发热（>=37.3）',
        id: '10',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '是否出现咳嗽、腹泻、乏力等',
        id: '11',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '是否出现气促等呼吸道感染症状',
        id: '12',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '现在所服用药物',
        id: '13',
        value: null,
      },
      {
        title: '是否服用退热药',
        id: '14',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
      {
        title: '现在所患慢病',
        id: '15',
        value: null,
        option: [
          {
            lable: '否',
            value: 0,
          },
          {
            lable: '是',
            value: 1,
          },
        ],
      },
    ],
  },
  {
    title: '检测',
    child: [
      {
        title: '检查目的',
        id: '16',
        value: null,
        option: [
          {
            lable: '返乡',
            value: 0,
          },
          {
            lable: '陪护',
            value: 1,
          },
          {
            lable: '复工/复产、复学',
            value: 2,
          },
          {
            lable: '门诊有创检查治疗（胃肠镜、口腔科等）',
            value: 3,
          },
          {
            lable: '住院',
            value: 4,
          },
          {
            lable: '其他原因',
            value: 5,
          },
        ],
      },
    ],
  },
]
export default list
