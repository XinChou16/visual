import Taro, { Component } from "@tarojs/taro";
import * as Echarts from "./libs/echarts";
import EchartCanvas from './libs/EchartCanvas';

function setChartData(chart, data) {
  let option = {
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     type: "shadow",
    //     textStyle: {
    //       color: "#0ff"
    //     }
    //   },
    // },
    grid: {
        "borderWidth": 0,
        "top": 110,
        "bottom": 95,
        textStyle: {
            color: "#fff"
        }
    },
    xAxis: [{
        type: "category",
        axisLine: {
          lineStyle: {
            color: '#90979c'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitArea: {
          show: false
        },
        axisLabel: {
          interval: 0,
        },
        data: [1,2,3,4,5,6,7,8,9,10,11,12],
    }],
    yAxis: [{
      type: "value",
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#90979c'
        }
      },
      axisTick: {
          show: false
      },
      axisLabel: {
          interval: 0,
      },
      splitArea: {
          show: false
      },
    }],
    series: [
      {
        name: "男",
        type: "line",
        stack: "总量",
        symbolSize: 10,
        symbol:'circle',
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        },
        itemStyle: {
          normal: {
            color: "skyblue",
            barBorderRadius: 0,
            label: {
              show: false,
              position: "bottom",
            }
          }
        },
        data: data.lineData
      },
    ]
  }
  chart.setOption(option);
}

export default class AddChart extends Component {

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
      console.log('----this.Chart.init----');
      console.log(this.Chart);
      const chart = Echarts.init(canvas, null, {
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
      <EchartCanvas 
        width='100%'
        height='500px'
        ref={this.refChart} 
        canvasId='mychart-area' 
        ec={this.state.ec} 
      />
    );
  }
}
