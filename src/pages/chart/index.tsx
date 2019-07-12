import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import LineChart from '../../components/charts/LineChart'
import AddChart from '../../components/charts/AddChart'
import "./index.scss";

export default class Line extends Component {
  config: Config = {
    navigationBarTitleText: '折线图'
  };

  componentDidMount() {
    // this.initChartData();

    const chartData = {
      barData: [709,1917,2455,2610,1719,1433,1544,3285,5208,3372,2484,4078],
      lineData: [1036,3693,2962,3810, 2519,1915,1748, 4675, 6209,4323,2865,4298]
    };
    this.addChart.refresh(chartData);
  };

  initChartData() {
    const chartData = {
      dimensions: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      measures: [{
        data: [10, 52, 200, 334, 390, 330, 220]
      }, {
        data: [50, 22, 100, 134, 90, 22, 220]
      }]
    }
    this.lineChart.refresh(chartData);
  };

  refLineChart = (node) => this.lineChart = node
  
  refAddChart = (node) => this.addChart = node

  render() {
    return (
      <View className='line-chart'>
        <AddChart ref={this.refAddChart} />
      </View>
    );
  }; 
}
