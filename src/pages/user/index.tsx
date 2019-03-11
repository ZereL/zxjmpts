/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:58
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-08 16:42:23
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  login,
  fetchUserToken,
  fetchUserInfo,
  clearPageData
} from "../../actions";

import messageIcon from "../../assets/icon/resource52.png";
import avatar_img from "../../assets/icon/resource23.png";
// import setttingsIcon from "../../assets/icon/resource30.png";

import pendingPayIcon from "../../assets/icon/resource13.png";
import pendingDeliveryIcon from "../../assets/icon/resource11.png";
import pendingReceiveIcon from "../../assets/icon/resource12.png";
import completeOrderIcon from "../../assets/icon/resource9.png";
import refundIcon from "../../assets/icon/resource10.png";
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtButton
} from "taro-ui";
import { setGlobalData, getGlobalData } from "./../../utils/common";
import { IMAGE_URL, cdnSmallSuffix } from "../../config";

type PageStateProps = {
  user: {
    nickname: string;
    image: any;
  };
};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchUserToken: (namespace: string, payload?: any) => any;
  fetchUserInfo: (namespace: string, payload?: any) => any;
  clearPageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  user: {
    nickName: string;
    image: any;
    name: any;
  };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface User {
  props: IProps;
}

// const windowWidth = getGlobalData("systemInfo").windowWidth;

@connect(
  ({ user }) => ({
    user
  }),
  {
    login: login,
    fetchUserToken: fetchUserToken,
    fetchUserInfo: fetchUserInfo,
    clearPageData: clearPageData
  }
)
class User extends Component {
  state = {
    isOpened: false,
    avatarUrl: "",
    nickName: ""
  };
  config: Config = {
    navigationBarTitleText: "小主"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    const token = getGlobalData("token");
    console.log("token", token);
    if (token === "") {
      this.setState({ isOpened: true });
    } else {
      this.props.fetchUserInfo("user");
    }
  }

  // componentDidShow() {
  //   Taro.getStorage({ key: "token" })
  //     .then(rst => {
  //       //从缓存中获取用户信息
  //       console.log("rst", rst);
  //       // this.props.setBasicInfo(rst.data)
  //     })
  //     .catch(error => {
  //       // console.log("取缓存错误", error);
  //       this.setState({ isOpened: true }); // 弹出请求权限的modal
  //     });

  //   // const userInfo = await Taro.getUserInfo();
  //   // console.log("userInfo", userInfo);
  // }

  componentDidHide() {}

  /********************* 事件handler **********************/

  /**
   * 获取权限同意的modal事件
   */
  getUserInfohandler = userInfo => {
    console.log("userinfo", userInfo);
    // if(userInfo.detail.userInfo){   //同意
    //     this.props.setBasicInfo(userInfo.detail.userInfo) //将用户信息存入redux
    //     Taro.setStorage({key:'userInfo',data:userInfo.detail.userInfo}).then(rst => {  //将用户信息存入缓存中
    //         Taro.navigateBack()
    //     })
    // } else{ //拒绝,保持当前页面，直到同意
    // }
  };

  /**
   * 登录事件
   */
  loginHandler = async () => {
    // 拿到用户登录凭证
    const { code } = await Taro.login();
    console.log("code", code);
    try {
      if (code) {
        const { userInfo, encryptedData, iv } = await Taro.getUserInfo();
        console.log("userInfo, encryptedData, iv", userInfo, encryptedData, iv);

        if (encryptedData != void 23333 && iv != void 23333) {
          this.setState({ isOpened: false });
          const { data } = await this.props.fetchUserToken("user", {
            wechatCode: code,
            encryptedData: encryptedData,
            iv: iv
          });
          console.log("data", data);
          console.log("data.token", data.token);
          // 设置全局变量token
          setGlobalData("token", data.token);
          // 存储全局变量，下次进入程序自动登录
          Taro.setStorage({ key: "token", data: data.token });
          console.log(data);
          this.props.fetchUserInfo("user");
        } else {
          Taro.showToast({
            title: "授权失败，请先授权",
            icon: "none",
            duration: 2000
          });
        }
      } else {
        Taro.showToast({
          title: "授权失败，请先授权",
          icon: "none",
          duration: 2000
        });
      }
    } catch (error) {
      // console.log("error", error);
      this.setState({ isOpened: true });
    }
  };

  // 通过点击事件拿到dataset属性
  // goPage = (e) => {
  //   if(e.currentTarget.dataset.url == '/pages/login/index' && this.props.access_token) {
  //     return;
  //   }
  //   Taro.navigateTo({
  //     url: e.currentTarget.dataset.url,
  //   })
  // }

  modalCancelHandler = () => {
    this.setState({ isOpened: false });
  };

  handleConfirm = () => {};

  goOrderListHandler = e => {
    console.log("e.currentTarget.dataset.index", e.currentTarget.dataset.index);
    const { index } = e.currentTarget.dataset;
    Taro.navigateTo({ url: `/pages/order/index?index=${index}` });
  };

  logoutHandler = () => {
    console.log("清除缓存");
    Taro.clearStorageSync();
    setGlobalData("token", "");
    this.props.clearPageData("user");
  };

  goLikeGoods = () => {
    Taro.navigateTo({ url: "/pages/goodsList/index?isFavorite=true" });
  };

  goBecomeShopkeeper = () => {
    // Taro.navigateTo({ url: "/pages/shopkeeper/index" });
    Taro.switchTab({ url: "/pages/shopkeeper/index" });
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    const { image, nickName, name } = this.props.user;
    // const { nickName, avatarUrl } = this.state;
    console.log("nickName", nickName);
    console.log("this.props", this.props);
    return (
      <View className="user-page">
        {/* <Button onClick={this.loginHandler}>登录</Button> */}
        <View className="not-login">
          <View className="to-login" data-url="/pages/login/index">
            <View className="left">
              <View className={name ? "name black" : "name "}>
                <View>
                  {name ? (
                    <Text>{`欢迎您回来，${name}`}</Text>
                  ) : (
                    <Text onClick={this.loginHandler} open-type="getUserInfo">
                      已经是小主？请登录 >
                    </Text>
                  )}
                </View>
              </View>
              <View>
                <View className="msg" data-url="/pages/message/index">
                  <Image mode="widthFix" src={messageIcon} />
                </View>
              </View>
            </View>
            <View className="avatar-container">
              <Image
                className="avatar"
                src={
                  image ? `${IMAGE_URL}${image}${cdnSmallSuffix}` : avatar_img
                }
              />
            </View>
          </View>
          <View className="list">
            <View
              className="item"
              data-index={0}
              onClick={this.goOrderListHandler}
            >
              <Image mode="widthFix" src={pendingPayIcon} />
              <Text>待支付</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View
              className="item"
              data-index={1}
              onClick={this.goOrderListHandler}
            >
              <Image mode="widthFix" src={pendingDeliveryIcon} />
              <Text>待发货</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View
              className="item"
              data-index={2}
              onClick={this.goOrderListHandler}
            >
              <Image mode="widthFix" src={pendingReceiveIcon} />
              <Text>待收货</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View
              className="item"
              data-index={3}
              onClick={this.goOrderListHandler}
            >
              <Image mode="widthFix" src={completeOrderIcon} />
              <Text>交易成功</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View className="item">
              <Image mode="widthFix" src={refundIcon} />
              <Text>退款售后</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
          </View>
        </View>
        <View className="login">
          <AtButton className="item" full={true} onClick={this.goLikeGoods}>
            <View className="left">
              <Text>收藏的宝贝</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </AtButton>
          <AtButton
            className="item"
            full={true}
            onClick={this.goBecomeShopkeeper}
          >
            <View className="left">
              <Text>成为金主</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </AtButton>
          {/* <AtButton className="item" full={true}>
            <View className="left">
              <Text>帮助中心</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </AtButton> */}
          <AtButton className="item" open-type="contact" full={true}>
            <View className="left">
              <Text>联系客服</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </AtButton>
          <AtButton className="item" full={true} onClick={this.logoutHandler}>
            <View className="left">
              <Text>登出</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </AtButton>
          {/* <View className="item" data-url="/pages/addressList/index">
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>收藏的宝贝</Text>
            </View>
          </View>
          <View className="item" data-url="/pages/addressList/index">
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>成为金主</Text>
            </View>
            >
          </View>
          <View className="item" data-url="/pages/couponList/index">
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>帮助中心</Text>
            </View>
          </View>
          <View className="item" data-url="/pages/couponList/index">
            <AtButton className="item-button" open-type="contact" full={true}>
              <View className="left">
                <Image className="icon-left" src={zxjLogo} />
                <Text>联系客服</Text>
              </View>
              <View className="right">
                <View className="iconfont icon-more arrow" />
              </View>
            </AtButton>
          </View>

          <View className="item" onClick={this.logoutHandler}>
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>登出</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </View> */}
        </View>
        <AtModal isOpened={this.state.isOpened}>
          <AtModalHeader>臻享家需要您的授权</AtModalHeader>
          <AtModalContent>
            <View>
              <Text>申请获取你的公开信息（昵称、头像等）</Text>
              <Button
                open-type="getUserInfo"
                // onGetUserInfo={this.getUserInfoHandler} // TODO: 暂时注释掉
                onGetUserInfo={this.loginHandler} // TODO: 暂时注释掉
              >
                微信授权
              </Button>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.modalCancelHandler}>取消授权</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default User as ComponentClass<PageOwnProps, PageState>;
