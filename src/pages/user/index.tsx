/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:58
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-07 11:32:20
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { add, login } from "../../actions";
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

type PageStateProps = {
  user: {
    num: number;
  };
};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
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
    login: login
  }
)
class User extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "小主"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

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

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    // const { mobile, nickname } = this.props;
    return (
      <View className="user-page">
        <View className="not-login">
          <View
            className="to-login"
            data-url="/pages/login/index"
          >
            <View className="left">
              <View className={"name "}>
                {"请登录 >"}
              </View>
              <View>
                <View
                  className="msg"
                  data-url="/pages/message/index"
                >
                  <Image mode="widthFix" src={messageIcon} />
                </View>
              </View>
            </View>
            <View className="avatar-container">
              <Image className="avatar" src={avatar_img} />
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
          <View
            className="item"
            data-url="/pages/addressList/index"
          >
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>收藏的宝贝</Text>
            </View>
          </View>
          <View
            className="item"
            data-url="/pages/addressList/index"
          >
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>成为金主</Text>
            </View>>
          </View>
          <View
            className="item"
            data-url="/pages/couponList/index"
          >
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>帮助中心</Text>
            </View>
          </View>
          <View
            className="item"
            data-url="/pages/about/index"
          >
            <View className="left">
              <Image className="icon-left" src={zxjLogo} />
              <Text>联系客服</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default User as ComponentClass<PageOwnProps, PageState>;
