/*
 * @Author: Hank
 * @Date: 2019-02-07 10:07:40
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-25 13:08:58
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
import { AtGrid } from "taro-ui";

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

  /**
   * 页面展示
   */
  componentDidShow() {
    if (getGlobalData("token")) {
      this.props.fetchUserInfo("user");
    }
    this.fetchPageData();
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
    const { homeItems } = this.props.home;
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
            onClick={this.goSharePageHandler}
          />
        </View>
        <View className="homeItems">
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
                image:
                  "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
                value: "人气美妆",
                cateId: 1
              },
              {
                image:
                  "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
                value: "格调育儿",
                cateId: 3
              },
              {
                image:
                  "https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png",
                value: "口碑保健",
                cateId: 6
              },
              {
                image:
                  "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
                value: "时尚轻奢",
                cateId: 9
              },
              {
                image:
                  "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                value: "分类",
                cateId: 0
              },
              {
                image:
                  "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                value: "UGG专场",
                cateId: 8
              },
              {
                image:
                  "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                value: "服饰配件",
                cateId: 10
              },
              {
                image:
                  "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                value: "日用百货",
                cateId: 7
              },
              {
                image:
                  "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                value: "奶粉直邮",
                cateId: 2
              },
              {
                image:
                  "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
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
