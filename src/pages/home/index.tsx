/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 10:23:40
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchUserInfo, fetchTagList } from "../../actions";
import ZXJCarousel from "../../components/Carousel/index";
import DynamicList from "../../components/DynamicList/index";
import { getGlobalData } from "../../utils/common";
import { AtGrid } from "taro-ui";
import { IMAGE_URL, cdnMediumSuffix } from "../../../src/config";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchUserInfo: (namespace: string, payload?: any) => any;
  fetchTagList: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  home: {
    homeItems: [{ content: Array<object>; type: string }];
    tagList: Array<Object>;
  };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Home {
  props: IProps;
}

// const windowHeight = getGlobalData("systemInfo").windowHeight;
const windowWidth = getGlobalData("systemInfo").windowWidth;

@connect(
  ({ home }) => ({
    home
  }),
  {
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

  /**
   * 跳转到产品列表
   */
  goGoodsList = () => {
    Taro.navigateTo({ url: "/pages/goodsList/index" });
  };

  /**
   * 跳转到分享页面
   */
  goSharePageHandler = () => {
    Taro.navigateTo({ url: "/pages/notLoginShopkeeper/index" });
  };

  /**
   * bannerOneTwo点击事件
   */
  bannerOneTwoClickHandler = link => {
    link.type == "CommingSoon" && console.log("comming soon");
    link.type == "Cate" &&
      Taro.navigateTo({ url: `/pages/goodsList/index?cateId=${link.cateId}` });

    link.type == "Goods" &&
      Taro.navigateTo({ url: `/pages/goodsDetail/index?id=${link.goodsId}` });
  };

  /********************* 渲染页面的方法 *********************/
  /**
   * 加载页面数据
   */
  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData("home");
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
          {/* TODO：这里需要改成动态从后台获取，目前图省事写死了！！！！ */}
          <AtGrid
            mode="square"
            columnNum={5}
            hasBorder={false}
            onClick={this.homeMenuClickhandler}
            data={[
              {
                image: require("../../assets/icon/resource48.png"),
                value: "人气美妆",
                cateId: 1 // 这里改了TaroUI的typings，为了TypeScript不报错。
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
        <View style={`width: ${windowWidth}px;height: 400px;background: #fff;`}>
          {homeItems.map((item: any, index) => {
            return (
              item.type === "BannerOneTwo" && (
                <View>
                  <Image
                    style={`width: ${windowWidth}px;height: 200px;background: #fff;`}
                    src={`${IMAGE_URL}${
                      item.mainImage.image
                    }${cdnMediumSuffix}`}
                    onClick={this.bannerOneTwoClickHandler.bind(this, item.mainImage.link)}
                  />
                  <Image
                    style={`width: ${windowWidth /
                      2}px;height: 200px;background: #fff;`}
                    src={`${IMAGE_URL}${
                      item.leftImage.image
                    }${cdnMediumSuffix}`}
                    onClick={this.bannerOneTwoClickHandler.bind(this, item.leftImage.link)}
                  />
                  <Image
                    style={`width: ${windowWidth /
                      2}px;height: 200px;background: #fff;`}
                    src={`${IMAGE_URL}${
                      item.rightImage.image
                    }${cdnMediumSuffix}`}
                    onClick={this.bannerOneTwoClickHandler.bind(this, item.rightImage.link)}
                  />
                </View>
                // <View>
                //   <Image
                //     style={`width: ${windowWidth}px;height: 100px;background: #fff;`}
                //     src={`${IMAGE_URL}${
                //       item.mainImage.image
                //     }${cdnMediumSuffix}`}
                //   />
                //   <Image
                //     style={`width: ${windowWidth}px;height: 100px;background: #fff;`}
                //     src={`${IMAGE_URL}${
                //       item.leftImage.image
                //     }${cdnMediumSuffix}`}
                //   />
                //   <Image
                //     style={`width: ${windowWidth}px;height: 100px;background: #fff;`}
                //     src={`${IMAGE_URL}${
                //       item.rightImage.image
                //     }${cdnMediumSuffix}`}
                //   />
                // </View>
              )
            );
          })}
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
