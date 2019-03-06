/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-06 14:39:09
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchUserInfo, fetchTagList } from "../../actions";
import { HOME } from "../../constants";
import ZXJCarousel from "../../components/Carousel/index";
import DynamicList from "../../components/DynamicList/index";
import { getGlobalData } from "../../utils/common";
import { AtGrid } from "taro-ui";

type PageStateProps = {};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchUserInfo: (namespace: string, payload?: any) => any;
  fetchTagList: (namespace: string, payload?: any) => any;
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
    fetchUserInfo: fetchUserInfo,
    fetchTagList: fetchTagList
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

  /**
   * 页面展示
   */
  async componentDidShow() {
    if (getGlobalData("token")) {
      await this.props.fetchUserInfo("user");
    }
    await this.props.fetchTagList("home");
    await this.fetchPageData();
  }

  /**
   * 页面隐藏
   */
  componentDidHide() {}

  /********************* 事件handler **********************/

  /**
   * 跳转到搜索页面
   */
  searchViewClickHandler = () => {
    Taro.navigateTo({ url: "/pages/search/index" });
  };

  /**
   * 首页menu跳转事件
   */
  homeMenuClickhandler = (item, index) => {
    console.log("item", item, "index", index);
    index == 4 && Taro.navigateTo({ url: "/pages/search/index" });
    index == 9 && Taro.navigateTo({ url: "/pages/becomeShopkeeper/index" });
    Taro.navigateTo({ url: `/pages/goodsList/index?cateId=${item.cateId}` });
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
  /********************* 渲染页面的方法 *********************/
  /**
   * 加载页面数据
   */
  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData(HOME);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /********************* 页面render方法 ********************/
  render() {
    const { homeItems, tagList } = this.props.home;
    console.log("homeItems", homeItems);
    return (
      <View className="home-page">
        {/* <AtButton type="primary">TARO UI 按钮</AtButton> */}
        {/* <Button className="add_btn" onClick={this.add}>
          +
        </Button> */}
        {/* <Button className="add_btn" onClick={this.getCode}>
          getCode
        </Button>
        <Button className="add_btn" onClick={this.getUserInfo}>
          getUserInfo
        </Button> */}
        {/* <Button className="add_btn" onClick={this.loginHandler}>
          登录
        </Button> */}
        {/* <Button className="add_btn" onClick={this.goGoodsList}>
          商品列表
        </Button> */}
        {/* <Button className="add_btn" onClick={this.goGoodsDetailHandler}>
          查看商品详情
        </Button> */}
        {/* <Button className="add_btn" onClick={this.goSharePageHandler}>
          分享页面
        </Button> */}
        <View className="search-bar">
          <Image
            mode="aspectFit"
            src={require("../../assets/icon/resource18.png")}
            className="message-icon"
          />
          <View
            className="search-text-view"
            onClick={this.searchViewClickHandler}
          >
            <Image
              mode="aspectFit"
              src={require("../../assets/icon/resource32.png")}
              className="search-icon"
            />
          </View>
          <Image
            src={require("../../assets/icon/resource51.png")}
            className="share-icon"
            onClick={this.goSharePageHandler}
          />
        </View>
        <View className="carousel">
          {homeItems.map((item, index) => {
            return (
              item.type === "SliderImage" && (
                <ZXJCarousel images={item.content} key={index} />
              )
            );
          })}
        </View>
        <View className="homeItems">
          {/* TODO：这里需要改成动态！！！！ */}
          <AtGrid
            mode="square"
            columnNum={5}
            hasBorder={false}
            onClick={this.homeMenuClickhandler}
            data={[
              {
                image: require("../../assets/icon/resource48.png"),
                value: "人气美妆",
                cateId: 1
              },
              {
                image: require("../../assets/icon/resource46.png"),
                value: "格调育儿",
                cateId: 3
              },
              {
                image: require("../../assets/icon/resource47.png"),
                value: "口碑保健",
                cateId: 6
              },
              {
                image: require("../../assets/icon/resource44.png"),
                value: "时尚轻奢",
                cateId: 9
              },
              {
                image: require("../../assets/icon/resource45.png"),
                value: "分类",
                cateId: 0
              },
              {
                image: require("../../assets/icon/resource43.png"),
                value: "UGG专场",
                cateId: 8
              },
              {
                image: require("../../assets/icon/resource42.png"),
                value: "服饰配件",
                cateId: 10
              },
              {
                image: require("../../assets/icon/resource41.png"),
                value: "日用百货",
                cateId: 7
              },
              {
                image: require("../../assets/icon/resource40.png"),
                value: "奶粉直邮",
                cateId: 2
              },
              {
                image: require("../../assets/icon/resource39.png"),
                value: "成为金主",
                cateId: -1
              }
            ]}
          />
        </View>
        <View className="homeItems">
          {homeItems.map((item, index) => {
            return (
              item.type === "DynamicList" && (
                <DynamicList
                  list={item.content}
                  key={index}
                  tagList={tagList}
                />
              )
            );
          })}
        </View>
      </View>
    );
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>;
