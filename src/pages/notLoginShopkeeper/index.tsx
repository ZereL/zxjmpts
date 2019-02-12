/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-13 11:56:21
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, ScrollView, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData, fetchMorePageData } from "../../actions";
import ZXJGoodsList from "../../components/ZXJGoodsList/index";
import { getGlobalData } from "../../utils/common";
import { AtTabBar, AtButton, AtNoticebar, AtAvatar } from "taro-ui";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  notLoginShopkeeper: {
    items: Array<object>;
    currentPage: number;
    hasNext: boolean;
    pageSize: number;
  };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface NotLoginShopkeeper {
  props: IProps;
}

@connect(
  ({ notLoginShopkeeper }) => ({
    notLoginShopkeeper
  }),
  {
    fetchPageData: fetchPageData,
    fetchMorePageData: fetchMorePageData
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
// TODO: 分页加载的时候显示加载中
class NotLoginShopkeeper extends Component {
  config: Config = {
    navigationBarTitleText: "臻享家"
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

  fetchPageData = async () => {
    try {
      const result = await this.props.fetchPageData("notLoginShopkeeper", {
        pageSize: 14,
        currentPage: 1
      });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  fetchMorePageData = async () => {
    const { currentPage, hasNext, pageSize } = this.props.notLoginShopkeeper;

    try {
      if (hasNext) {
        const result = await this.props.fetchMorePageData(
          "notLoginShopkeeper",
          {
            pageSize: pageSize,
            currentPage: currentPage + 1
          }
        );
        console.log("请求成功", result);
      } else {
        console.log("没有更多了");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  onScrollToLower = () => {
    const { currentPage, hasNext, pageSize } = this.props.notLoginShopkeeper;
    // console.log('滑到底部');
    this.props.fetchMorePageData("notLoginShopkeeper", {
      pageSize: pageSize,
      currentPage: currentPage + 1
    });
  };
  // goGoodsDetailHandler = () => {
  //   Taro.navigateTo({
  //     url: `/pages/goodsDetail/index?id=1271`
  //   });
  // };

  handleClick = () => {};

  //这个分享的函数必须写在入口中，写在子组件中不生效
  onShareAppMessage() {
    // const { images } = this.props.goodsDetail;
    const goodsId = 128;
    const code = `FSI005`;
    const hash = `570AD6F305EC6EA60DCA5DCFAE67AE09`;
    const name = `漠然`;
    const avatarImage =
      "https://cdn2u.com/images/upload/2141-1bec8a1242511c99891f6e80b9c5ebfe-132x132.jpg";
    return {
      title: "海淘更便宜，分享有收益❤️全球臻选好物等您来👇。",
      path: `/pages/notLoginShopkeeper/index?id=${goodsId}&code=${code}&hash=${hash}&name=${name}&avatarImage=${avatarImage}&share=true`,
      imageUrl: `/src/assets/icon/resource63.png`, // TODO：自定义分享图片目前好像不行
      success: function(res) {
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }

  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { items } = this.props.notLoginShopkeeper;
    let share = this.$router.params.share; //获取分享进来的参数share
    let { id, code, hash, name, avatarImage } = this.$router.params; //获取分享进来的参数share
    console.log("params", this.$router.params);
    // let {share} = this.$router.params.share; //获取分享进来的参数share
    console.log("avatarImage", avatarImage);
    return (
      <View className="not-login-shopkeeper-page">
        {/* {share ? (
          <AtNoticebar className="fixIndex">
            <AtAvatar circle image={avatarImage}></AtAvatar> 臻享家用户{name}, id为{id} code为{code} hash为{hash}}
          </AtNoticebar>
        ) : null} */}
        {share ? (
          <View className="fixIndex">
            <AtAvatar
              circle
              image={avatarImage}
              size="small"
              className="avatar-image"
            />
            <View className="shared-data">
              臻享家用户 {name}, 分享给您本页面。邀请码为： {id}
            </View>
          </View>
        ) : null}

        {/* <Image
          mode="scaleToFill"
          src={require("../../assets/image/jinzhu.jpg")}
          // style={`width: ${
          //   getGlobalData("systemInfo").screenWidth
          // }, height: ${(getGlobalData("systemInfo").screenWidth * 6080) /
          //   1242}`}
          style="width: 375px, height:1600px"
        /> */}
        <ScrollView
          style={
            share
              ? `height: ${getGlobalData("systemInfo").windowHeight - 100}px`
              : `height: ${getGlobalData("systemInfo").windowHeight - 50}px`
          }
          scrollY
          scrollWithAnimation
        >
          <Image
            style={`width: ${
              getGlobalData("systemInfo").screenWidth
            }px;height: ${(getGlobalData("systemInfo").screenWidth * 6080) /
              1242}px;background: #fff;`}
            src={require("../../assets/image/jinzhu.jpg")}
          />
          <ZXJGoodsList list={items} />
        </ScrollView>
        <View className="bottom-view">
          <View className="bottom-view-text">
            更多商品请点击“成为金主”后查看
          </View>
          <AtButton className="bottom-button">成为金主</AtButton>
        </View>
      </View>

      // <ScrollView
      //   className="scrollview"
      //   scrollY
      //   scrollWithAnimation
      //   // scrollTop="0"
      //   style="height: 600px"
      //   lowerThreshold={20}
      //   // upperThreshold="20"
      //   // onScrolltoupper={this.onScrolltoupper}
      //   // onScroll={this.onScroll}
      //   onScrollToLower={this.onScrollToLower}
      // >
      //   <Image
      //     mode="scaleToFill"
      //     src={require("../../assets/image/jinzhu.jpg")}
      //   />
      //   {/* <ZXJGoodsList list={items} /> */}
      // </ScrollView>
    );
  }
}

export default NotLoginShopkeeper as ComponentClass<PageOwnProps, PageState>;
