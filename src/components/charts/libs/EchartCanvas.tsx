import Taro, { PureComponent } from '@tarojs/taro';
import { Canvas } from '@tarojs/components';
import WxCanvas from './wx-canvas';
import * as Echarts from './echarts';

interface IProps {
  ec: object,
  canvasId: string,
  width: string | number,
  height: string | number
}

let ctx = null;

export default class EchartCanvas extends PureComponent<IProps> {

  chart = {};

  componentDidMount() {
    if (!this.props.ec) {
      console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" '
        + 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
      return;
    }

    if (!this.props.ec.lazyLoad) {
      this.init();
    }
  };

  init(callback?: Function): void {
    if (!this.checkWXVersion()) return;

    const { canvasId, ec } = this.props;

    ctx = Taro.createCanvasContext(canvasId, this);
    const canvas = new WxCanvas(ctx, canvasId);

    Echarts.setCanvasCreator(() => canvas);
    
    Taro.createSelectorQuery()
      .in(this.$scope)
      .select('#ec-canvas')
      .boundingClientRect(res => {
        const { width, height } = res;

        if (typeof callback === 'function') {
          this.chart = callback(canvas, width, height);
        } else if (ec && typeof ec.onInit === 'function') {
          this.chart = ec.onInit(canvas, width, height);
        } else {
          this.$scope.triggerEvent('init', { canvas: canvas, width, height });
        }

      })
      .exec();
  };

  checkWXVersion(): boolean {
    const version = Taro.getSystemInfoSync().SDKVersion.split('.').map(n => parseInt(n, 10));
    const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9)
      || (version[0] === 1 && version[1] === 9 && version[2] >= 91);

    if (!isValid) {
      console.error('微信基础库版本过低，需大于等于 1.9.91。'
        + '参见：https://github.com/ecomfe/echarts-for-weixin'
        + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
      return false;
    }

    return true;
  }

  canvasToTempFilePath(opt: object): void {
    if (!opt.canvasId) {
      opt.canvasId = this.props.canvasId;
    }

    ctx.draw(true, () => {
      Taro.canvasToTempFilePath(opt, this);
    });
  };

  handleTouchStart = (e): void => {
    if (this.chart && e.touches.length > 0) {
      const touch = e.touches[0];
      this.chart._zr.handler.dispatch('mousedown', {
        zrX: touch.x,
        zrY: touch.y
      });
      this.chart._zr.handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y
      });
      this.chart._zr.handler.proxy.processGesture(wrapTouch(e), 'start');
    }
  };

  handleTouchMove = (e): void => {
    if (this.chart && e.touches.length > 0) {
      const touch = e.touches[0];
      this.chart._zr.handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y
      });
      this.chart._zr.handler.proxy.processGesture(wrapTouch(e), 'change');
    }
  };

  handleTouchEnd = (e): void => {
    if (this.chart) {
      const touch = e.changedTouches ? e.changedTouches[0] : {};
      this.chart._zr.handler.dispatch('mouseup', {
        zrX: touch.x,
        zrY: touch.y
      });
      this.chart._zr.handler.dispatch('click', {
        zrX: touch.x,
        zrY: touch.y
      });
      this.chart._zr.handler.proxy.processGesture(wrapTouch(e), 'end');
    }
  };

  render() {
    const { 
      width = '100%',
      height = '100%',
      canvasId = 'canvasId'
    } = this.props;
    return (
      <Canvas 
        id='ec-canvas'
        style={{ width, height}}
        canvasId={canvasId}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      />
    )
  };
}

function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}