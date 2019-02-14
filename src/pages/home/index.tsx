/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-14 17:36:24
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchUserInfo } from "../../actions";
import { HOME } from "../../constants";
import ZXJCarousel from "../../components/Carousel/index";
import DynamicList from "../../components/DynamicList/index";
import { getGlobalData } from "../../utils/common";

type PageStateProps = {};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchUserInfo: (namespace: string, payload?: any) => any;
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
    // add: add,
    fetchPageData: fetchPageData,
    fetchUserInfo: fetchUserInfo
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
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
    if (getGlobalData("token")) {
      this.props.fetchUserInfo("user");
    }
    this.fetchPageData();
  }

  componentDidHide() {}

  /********************* 事件handler **********************/
  // add = async () => {
  //   try {
  //     const result = await this.props.add(HOME);
  //     console.log("请求成功", result);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  atSearchBarChangeHandler = () => {
    console.log("点击搜索");
  };

  searchViewClickHandler = () => {
    Taro.navigateTo({ url: "/pages/search/index" });
  };

  goGoodsList = () => {
    Taro.navigateTo({ url: "/pages/goodsList/index" });
  };

  goSharePageHandler = () => {
    Taro.navigateTo({ url: "/pages/notLoginShopkeeper/index" });
  };

  getCode = async () => {
    const result = await Taro.login();
    console.log("result", result);
  };

  getUserInfo = async () => {
    const result = await Taro.getUserInfo();
    console.log("result", result);
  };

  // goGoodsDetailHandler = () => {
  //   Taro.navigateTo({
  //     url: `/pages/goodsDetail/index?id=1271`
  //   });
  // };

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
    const { homeItems } = this.props.home;

    return (
      <View className="home-page">
        {/* <AtButton type="primary">TARO UI 按钮</AtButton> */}
        {/* <Button className="add_btn" onClick={this.add}>
          +
        </Button> */}
        <Button className="add_btn" onClick={this.getCode}>
          getCode
        </Button>
        <Button className="add_btn" onClick={this.getUserInfo}>
          getUserInfo
        </Button>
        {/* <Button className="add_btn" onClick={this.loginHandler}>
          登录
        </Button> */}
        <Button className="add_btn" onClick={this.goGoodsList}>
          商品列表
        </Button>
        {/* <Button className="add_btn" onClick={this.goGoodsDetailHandler}>
          查看商品详情
        </Button> */}
        <Button className="add_btn" onClick={this.goSharePageHandler}>
          分享页面
        </Button>
        <View>
          {/* <Image
            mode="widthFix"
            src={`https://cdn2u.com/images/upload/241018-afe6ced15f8b064ad9d91e1d24cf1af9-1242x600.jpg`}
          /> */}
          {/* {homeItems.map((item, index) => {
            return item.type === "SliderImage" && <Text>{item.type}</Text>
          })} */}
          {/* <AtSearchBar value={""} onChange={this.atSearchBarChangeHandler} /> */}
          <View className="search-bar">
            <Image
              src={require("../../assets/icon/resource18.png")}
              className="message-icon"
            />
            <View
              className="search-text-view"
              onClick={this.searchViewClickHandler}
            >
              <Image
                src={require("../../assets/icon/resource32.png")}
                className="search-icon"
              />
            </View>
            <Image
              src={require("../../assets/icon/resource51.png")}
              className="share-icon"
            />
          </View>
          {homeItems.map((item, index) => {
            return (
              item.type === "SliderImage" && (
                <ZXJCarousel images={item.content} key={index} />
              )
            );
          })}
          {homeItems.map((item, index) => {
            return (
              item.type === "DynamicList" && (
                <DynamicList list={item.content} key={index} />
              )
            );
          })}
        </View>
      </View>
    );
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>;
