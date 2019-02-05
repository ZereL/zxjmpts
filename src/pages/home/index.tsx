import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import {
  Swiper,
  SwiperItem,
  View,
  Button,
  Text,
  Image
} from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login, fetchPageData } from "../../actions";
import { HOME } from "../../constants";
import Slider from "../../components/Slider";

type PageStateProps = {};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  home: {
    homeItems: [{ content: Array<object>; type: string }];
  };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Home {
  props: IProps;
}

@connect(
  ({ home }) => ({
    home
  }),
  {
    add: add,
    login: login,
    fetchPageData: fetchPageData
  }
)
class Home extends Component {
  config: Config = {
    navigationBarTitleText: "首页"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.fetchPageData();
  }

  componentDidHide() {}

  /********************* 事件handler **********************/
  add = async () => {
    try {
      const result = await this.props.add(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * 登录
   */
  loginHandler = async () => {
    try {
      const result = await this.props.login(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  goGoodsDetailHandler = () => {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=1271`
    });
  };

  /********************* 渲染页面的方法 *********************/
  // /**
  //  * 渲染首页slider
  //  */
  // renderSlider = () => {
  //   const {data} = this.props.home
  //   return (
  //     <Slider banner={data.}/>
  //   )
  // }

  // /**
  //  * 渲染首页
  //  */
  // renderHome = () => {
  //   const { homeItems } = this.props.home;
  //   return homeItems.map((item, index) => {
  //     switch (item.type) {
  //       case "SliderImage": {
  //         return <Slider banner={item.content} />;
  //       }

  //       default: {
  //         break;
  //       }
  //     }
  //   });
  // };

  /**
   * 渲染首页
   */
  // renderHome = homeItems => {
  //   return homeItems.map((item, index) => {
  //     if (item.type == "SliderImage") {
  //       return <Slider banner={item.content} />;
  //     }
  //   });
  // };
  /********************* 页面render方法 ********************/
  render() {
    // const { homeItems } = this.props.home;
    return (
      <View className="index">
        <Button className="add_btn" onClick={this.add}>
          +
        </Button>
        <Button className="add_btn" onClick={this.loginHandler}>
          登录
        </Button>
        <Button className="add_btn" onClick={this.goGoodsDetailHandler}>
          查看商品详情
        </Button>
        <View>
          <Text>首页</Text>
        </View>
        <View>
          {/* <Image
            mode="widthFix"
            src={`https://cdn2u.com/images/upload/241018-afe6ced15f8b064ad9d91e1d24cf1af9-1242x600.jpg`}
          /> */}
          {/* {homeItems.map((item, index) => {
            return item.type === "SliderImage" && <Text>{item.type}</Text>
          })} */}
          {/* {homeItems.map((item, index) => {
            return (
              item.type === "SliderImage" && <Slider banner={item.content} />
            );
          })} */}
          <Swiper
            className="swiper "
            circular
            indicatorDots
            indicatorColor="#999"
            indicatorActiveColor="#bf708f"
            autoplay
          >
            <SwiperItem>
              {/* <Image mode="widthFix" src={`${IMAGE_URL}${item.image}`} /> */}
              <Image
                mode="widthFix"
                src={`https://cdn2u.com/images/upload/241018-afe6ced15f8b064ad9d91e1d24cf1af9-1242x600.jpg`}
              />
            </SwiperItem>
            <SwiperItem>
              {/* <Image mode="widthFix" src={`${IMAGE_URL}${item.image}`} /> */}
              <Image
                mode="widthFix"
                src={`https://cdn2u.com/images/upload/241018-afe6ced15f8b064ad9d91e1d24cf1af9-1242x600.jpg`}
              />
            </SwiperItem>
            <SwiperItem>
              {/* <Image mode="widthFix" src={`${IMAGE_URL}${item.image}`} /> */}
              <Image
                mode="widthFix"
                src={`https://cdn2u.com/images/upload/241018-afe6ced15f8b064ad9d91e1d24cf1af9-1242x600.jpg`}
              />
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    );
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>;