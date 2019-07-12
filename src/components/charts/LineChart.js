import Taro, { Component } from "@tarojs/taro";
import * as echarts from './libs/echarts';


// https://github.com/WsmDyj/echarts-for-taro
// https://github.com/ecomfe/echarts-for-weixin
function setChartData(chart, data) {
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        textStyle: {
          color: '#fff'
        }
      }
    },
    grid: {
      'borderWidth': 0,
      'top': 110,
      'bottom': 95,
      textStyle: {
          color: '#fff'
      }
    },
    color: ['#3398DB'],
    xAxis : [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis : [
      {
        type : 'value'
      } 
    ],
    series : [
      {
        data: [10, 52, 200, 334, 390, 330, 220],
        type: 'line',
        itemStyle: {
          normal: {
            color: 'green',
            barBorderRadius: 5,
            label: {
              show: false,
              position: 'nottom'
            }
          }
        }
      },
      {
        data: [50, 22, 100, 134, 90, 22, 220],
        type: 'line',
        // itemStyle
      }
    ],
    tooltip: [

    ]
  };
  // if (data && data.dimensions && data.measures) {
  //   option.xAxis[0].data = data.dimensions.data
  //   option.series = data.measures.map(item => {
  //     return {
  //       ...item,
  //       type:'line',
  //     }
  //   })
  // }
  chart.setOption(option);
}

export default class LineChart extends Component {
  config = {
    usingComponents: {
      'ec-canvas': './libs/ec-canvas'
    }
  };

  constructor(props) {
    super(props);
  }

  state = {
    ec: {
      lazyLoad: true
    }
  };

  refresh(data) {
    this.Chart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, data);
      return chart;
    });
  }

  refChart = node => (this.Chart = node);

  render() {
    return (
      <ec-canvas
        ref={this.refChart}
        canvas-id='mychart-area'
        ec={this.state.ec}
      />
    );
  }
}