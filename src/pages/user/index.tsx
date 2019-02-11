/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:58
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-11 16:16:20
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login, fetchUserToken } from "../../actions";
import { USER } from "../../constants";

import messageIcon from "../../assets/icon/resource52.png";
import avatar_img from "../../assets/icon/resource23.png";
import zxjLogo from "../../assets/icon/resource34.png";
// import setttingsIcon from "../../assets/icon/resource30.png";

import pendingPayIcon from "../../assets/icon/resource13.png";
import pendingDeliveryIcon from "../../assets/icon/resource11.png";
import pendingReceiveIcon from "../../assets/icon/resource12.png";
import completeOrderIcon from "../../assets/icon/resource9.png";
import refundIcon from "../../assets/icon/resource10.png";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";

type PageStateProps = {
  user: {
    num: number;
  };
};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchUserToken: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface User {
  props: IProps;
}

@connect(
  ({ user }) => ({
    user
  }),
  {
    add: add,
    login: login,
    fetchUserToken: fetchUserToken
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
    Taro.getStorage({ key: "userInfo" })
      .then(rst => {
        //从缓存中获取用户信息
        console.log("rst", rst);
        // this.props.setBasicInfo(rst.data)
      })
      .catch(error => {
        // console.log("取缓存错误", error);
        this.setState({ isOpened: true }); // 弹出请求权限的modal
      });

    // const userInfo = await Taro.getUserInfo();
    // console.log("userInfo", userInfo);
  }

  componentDidHide() {}

  /********************* 事件handler **********************/
  add = async () => {
    try {
      const result = await this.props.add(USER);
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  // /**
  //  * 登录
  //  */
  // loginHandler = async () => {
  //   Taro.login().then(result => {
  //     // 拿到用户登录凭证
  //     const wxCode = result.code;
  //     // 获取用户信息, 需要用户授权
  //     Taro.getUserInfo().then(result => {
  //       console.log("result", result);

  //       // 拿到用户信息
  //       if (result.userInfo) {
  //         // this.props.setBasicInfo(result.userInfo) //将用户信息存入redux
  //         //将用户信息存入缓存中
  //         Taro.setStorage({ key: "userInfo", data: result.userInfo }).then(
  //           rst => {
  //             console.log("rst", rst);
  //           }
  //         );

  //         const token = await this.props.fetchUserToken(USER, {
  //           wechatCode: wxCode,
  //           encryptedData: result.encryptedData,
  //           iv: result.iv
  //         });
  //       } else {
  //         //拒绝,保持当前页面，直到同意
  //       }
  //     });
  //   });
  // };

  /**
   * 登录
   */
  loginHandler = async () => {
    // 拿到用户登录凭证
    const { code } = await Taro.login();
    const { userInfo, encryptedData, iv } = await Taro.getUserInfo();
    const { data } = await this.props.fetchUserToken(USER, {
      wechatCode: code,
      encryptedData: encryptedData,
      iv: iv
    });
    console.log(data);
    // Taro.login().then(result => {
    //   // 拿到用户登录凭证
    //   const wxCode = result.code;
    //   // 获取用户信息, 需要用户授权
    //   Taro.getUserInfo().then(result => {
    //     console.log("result", result);

    //     // 拿到用户信息
    //     if (result.userInfo) {
    //       // this.props.setBasicInfo(result.userInfo) //将用户信息存入redux
    //       //将用户信息存入缓存中
    //       Taro.setStorage({ key: "userInfo", data: result.userInfo }).then(
    //         rst => {
    //           console.log("rst", rst);
    //         }
    //       );

    //       const token = await this.props.fetchUserToken(USER, {
    //         wechatCode: wxCode,
    //         encryptedData: result.encryptedData,
    //         iv: result.iv
    //       });
    //     } else {
    //       //拒绝,保持当前页面，直到同意
    //     }
    //   });
    // });
  };

  modalCancelHandler = () => {
    this.setState({ isOpened: false });
  };

  handleConfirm = () => {};

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    // const { mobile, nickname } = this.props;
    const { nickName, avatarUrl } = this.state;
    return (
      <View className="user-page">
        <Button onClick={this.loginHandler}>登录</Button>
        <View className="not-login">
          <View className="to-login" data-url="/pages/login/index">
            <View className="left">
              <View className={nickName ? "name black" : "name "}>
                {nickName ? nickName : "已经是小主？请登录 >"}
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
                src={avatarUrl ? avatarUrl : avatar_img}
              />
            </View>
          </View>
          <View className="list">
            <View className="item">
              <Image mode="widthFix" src={pendingPayIcon} />
              <Text>待支付</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View className="item">
              <Image mode="widthFix" src={pendingDeliveryIcon} />
              <Text>待发货</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View className="item">
              <Image mode="widthFix" src={pendingReceiveIcon} />
              <Text>待收货</Text>
              {/* {item.num > 0 && <Icon className="num">{item.num}</Icon>} */}
            </View>
            <View className="item">
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
          {/* <View className="card">
            <View className="type type0">
              <View className="operation">
                <View className="txt">
                  {mobile ? "金主用户" : "您还不是金主"}
                </View>
                {!mobile && (
                  <View
                    className="btn"
                    data-url="/pages/login/index"
                    onClick={this.goPage}
                  >
                    成为金主
                    <View className="iconfont icon-membership_more" />
                  </View>
                )}
              </View>
            </View>
          </View> */}
          <View className="item" data-url="/pages/addressList/index">
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
          <View className="item" data-url="/pages/about/index">
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>联系客服</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </View>
        </View>

        <AtModal isOpened={this.state.isOpened}>
          <AtModalHeader>标题</AtModalHeader>
          <AtModalContent>
            <View>
              <Text>申请获取你的公开信息（昵称、头像等）</Text>
              <Button open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>
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
