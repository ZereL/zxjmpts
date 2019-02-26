/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-26 13:24:02
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, ScrollView, Text, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import {
  fetchPageData,
  fetchMorePageData,
  fetchUserInfo,
  requestRegisterUid,
  requestRegisterWechat,
  fetchInvitationCode
} from "../../actions";
import ZXJGoodsList from "../../components/ZXJGoodsList/index";
import { getGlobalData, setGlobalData } from "../../utils/common";
import {
  AtTabBar,
  AtButton,
  AtNoticebar,
  AtAvatar,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput
} from "taro-ui";
import { IMAGE_URL, cdnSmallSuffix } from "../../config";
import avatar_img from "../../assets/icon/resource23.png";

type PageStateProps = {};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  fetchMorePageData: (namespace: string, payload?: any) => any;
  fetchUserInfo: (namespace: string, payload?: any) => any;
  requestRegisterUid: (namespace: string, payload?: any) => any;
  requestRegisterWechat: (namespace: string, payload?: any) => any;
  fetchInvitationCode: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  notLoginShopkeeper: {
    items: Array<object>;
    currentPage: number;
    hasNext: boolean;
    pageSize: number;
  };
  user: {
    invatationCode: string;
    invatationCodeHash: string;
    name: string;
    image: string;
    isCommissionAvailable: boolean;
  };
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface NotLoginShopkeeper {
  props: IProps;
}

@connect(
  ({ notLoginShopkeeper, user }) => ({
    notLoginShopkeeper,
    user
  }),
  {
    fetchPageData: fetchPageData,
    fetchMorePageData: fetchMorePageData,
    fetchUserInfo: fetchUserInfo,
    requestRegisterUid: requestRegisterUid,
    requestRegisterWechat: requestRegisterWechat,
    fetchInvitationCode: fetchInvitationCode
  }
)

// TODO: 研究代替switch case遍历homeItems数组的办法
// TODO: 分页加载的时候显示加载中
// TODO: 已经是金主的话底部按钮什么也不显示
// TODO: 现在有一种极端情况下没做处理， 刚升级成金主，进来还没获得到邀请码， 直接分享， 这时候应该没有邀请码
class NotLoginShopkeeper extends Component {
  config: Config = {
    navigationBarTitleText: "臻享家"
  };

  state = {
    isShareModalshow: false,
    isInvitationCodeModalShow: false,
    inputInviationCode: ""
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  async componentDidShow() {
    Taro.hideShareMenu();
    // 判断用户是否之前登录过
    console.log('getGlobalData("token")', getGlobalData("token"));
    if (getGlobalData("token")) {
      // const {
      //   invatationCode,
      //   invatationCodeHash,
      //   isCommissionAvailable
      // } = await this.props.fetchUserInfo("user");
      const { data } = await this.props.fetchUserInfo("user");

      console.log("data", data);
      const {
        invatationCode,
        invatationCodeHash,
        isCommissionAvailable
      } = data;
      console.log(
        "invatationCode",
        invatationCode,
        "isCommissionAvailable",
        isCommissionAvailable
      );
      if (!invatationCode && isCommissionAvailable) {
        console.log("刚升级成金主，需要发送请求获取邀请码");
        // 如果没有邀请码并且已经成为金主， 发请求获取邀请码
        this.props.fetchInvitationCode("user");
      } else {
        console.log("已经是金主，也有邀请码");
      }
    }

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
    // 目前我不是金主，所以没从user页面的model中取数据
    // TODO: 思考如果不是金主想分享怎么办？是直接不传邀请码还是怎么样。
    const { invatationCode, invatationCodeHash, name, image } = this.props.user;

    if (!invatationCode) {
      Taro.showToast({
        title: "您还没有邀请码，请您成为金主以后，再分享本页",
        icon: "none",
        duration: 2000
      });
    }
    // const code = `FSI005`;
    // const hash = `570AD6F305EC6EA60DCA5DCFAE67AE09`;
    // const name = `漠然`;
    // const avatarImage =
    //   "https://cdn2u.com/images/upload/2141-1bec8a1242511c99891f6e80b9c5ebfe-132x132.jpg";
    return {
      title: "海淘更便宜，分享有收益❤️全球臻选好物等您来👇。",
      path: `/pages/notLoginShopkeeper/index?code=${invatationCode}&hash=${invatationCodeHash}&name=${name}&avatarImage=${image}&share=true`,
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

  goBecomeShopkeeperHandler = () => {
    Taro.navigateTo({ url: "/pages/becomeShopkeeper/index" });
  };

  onClickRegister = async () => {
    // QBF219
    try {
      let { goodId, code, hash, name, avatarImage } = this.$router.params; //获取分享进来的参数share
      const loginResult = await Taro.login();
      console.log(loginResult);
      const { userInfo, encryptedData, iv } = await Taro.getUserInfo();
      const registerResult = await this.props.requestRegisterUid(
        "notLoginShopkeeper",
        {
          wechatCode: loginResult.code,
          encryptedData: encryptedData,
          iv: iv
        }
      );
      console.log("registerResult", registerResult);

      // 需要注册
      const { unionId } = registerResult.data;
      if (unionId) {
        // this._goWechatInvitation(uid);
        // this._goWechatInvitation(uid);
        const registerWechat = await this.props.requestRegisterWechat(
          "notLoginShopkeeper",
          {
            invatationCode: code,
            // invatationCode: "QBF219", // TODO: 这个要改！！！
            // UserIP: payload.UserIP,
            notLogin: false,
            uid: unionId
          }
        );
        console.log("registerWechat注册成功", registerWechat);
        // 存入数据库
        setGlobalData("token", registerWechat.data.token);
        // 存入本地缓存
        Taro.setStorageSync("token", registerWechat.data.token);
        Taro.showToast({ title: `注册成功`, duration: 2000 });
      } else {
        Taro.showToast({
          title: `服务器没有返回UID`,
          icon: "none",
          duration: 2000
        });
        // console.log("已经注册过");
        // Taro.showToast({ title: `注册成功`, duration: 2000 });
      }
    } catch (error) {
      console.log("error", error);
      Taro.showToast({
        title: `注册出错，${error.toString()}`,
        icon: "none",
        duration: 2000
      });
    }
  };

  onModalClickRegister = async () => {
    // QBF219
    try {
      let { goodId, code, hash, name, avatarImage } = this.$router.params; //获取分享进来的参数share
      const { inputInviationCode } = this.state;
      if (inputInviationCode == "") {
        console.log("请您输入邀请码");
        Taro.showToast({
          title: "请您输入邀请码",
          icon: "none",
          duration: 2000
        });
        return null;
      }
      const loginResult = await Taro.login();
      console.log(loginResult);
      const { userInfo, encryptedData, iv } = await Taro.getUserInfo();
      const registerResult = await this.props.requestRegisterUid(
        "notLoginShopkeeper",
        {
          wechatCode: loginResult.code,
          encryptedData: encryptedData,
          iv: iv
        }
      );
      console.log("registerResult", registerResult);

      // 需要注册
      const { unionId } = registerResult.data;
      if (unionId) {
        // this._goWechatInvitation(uid);
        // this._goWechatInvitation(uid);
        const registerWechat = await this.props.requestRegisterWechat(
          "notLoginShopkeeper",
          {
            invatationCode: inputInviationCode,
            // invatationCode: "QBF219", // TODO: 这个要改！！！
            // UserIP: payload.UserIP,
            notLogin: false,
            uid: unionId
          }
        );
        console.log("registerWechat注册成功", registerWechat);
        // 存入数据库
        setGlobalData("token", registerWechat.data.token);
        // 存入本地缓存
        Taro.setStorageSync("token", registerWechat.data.token);
        Taro.showToast({ title: `注册成功`, duration: 2000 });
      } else {
        Taro.showToast({
          title: `您已经注册,服务器没有返回UID `,
          icon: "none",
          duration: 2000
        });
        // console.log("已经注册过");
        // Taro.showToast({ title: `注册成功`, duration: 2000 });
      }
    } catch (error) {
      console.log("error", error);
      Taro.showToast({
        title: `注册出错，${error.toString()}`,
        icon: "none",
        duration: 2000
      });
    }
    this.setState({ isInvitationCodeModalShow: false });
  };

  onShowRegisterModal = () => {
    this.setState({ isInvitationCodeModalShow: true });
  };

  onHideRegisterModal = () => {
    this.setState({ isInvitationCodeModalShow: false });
  };

  onInputInviationCodeChange(value) {
    this.setState({
      inputInviationCode: value
    });
  }
  /********************* 渲染页面的方法 *********************/

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { items } = this.props.notLoginShopkeeper;
    const { id, isCommissionAvailable } = this.props.user;
    let share = this.$router.params.share; //获取分享进来的参数share
    // let share = true;
    let { goodId, code, hash, name, avatarImage } = this.$router.params; //获取分享进来的参数share
    console.log("打印params", this.$router.params);
    console.log("isCommissionAvailable", isCommissionAvailable);
    console.log("id", id);
    // let {share} = this.$router.params.share; //获取分享进来的参数share
    console.log("avatarImage", avatarImage);
    console.log("userModel", this.props.user);
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
              image={
                avatarImage
                  ? `${IMAGE_URL}${avatarImage}${cdnSmallSuffix}`
                  : avatar_img
              }
              size="small"
              className="avatar-image"
            />
            <View className="shared-data">
              臻享家用户 {name}, 邀请您加入臻享家。邀请码为： {code}{" "}
              {id && "您已经接受过邀请。请点击“成为金主”获取更多收益"}
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
              ? `height: ${getGlobalData("systemInfo").windowHeight - 115}px`
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
        {/* 
            TODO：需要优化逻辑
            情况1：是金主，通过分享进入
            情况2：是金主，不通过分享进入
            情况3：是小主，通过分享进入
            情况4：是小主，不通过分享进入
            情况5：是游客，通过分享进入
            情况6：是游客，不通过分享进入 
        */}
        {/* 情况3：是小主，通过分享进入 */}
        {id && share && isCommissionAvailable == false ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              更多商品请点击“成为金主”后查看
            </View>
            <AtButton
              className="bottom-button"
              onClick={this.goBecomeShopkeeperHandler}
            >
              成为金主
            </AtButton>
          </View>
        ) : null}
        {/* 情况4：是小主，不通过分享进入 */}
        {id && share == void 2333 && isCommissionAvailable == false ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              更多商品请点击“成为金主”后查看
            </View>
            <AtButton
              className="bottom-button"
              onClick={this.goBecomeShopkeeperHandler}
            >
              成为金主
            </AtButton>
          </View>
        ) : null}
        {/* 情况1：是金主，通过分享进入 */}
        {id && share && isCommissionAvailable == true ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              金主您好，点击“一键分享”，分享全球好物
            </View>
            <AtButton className="bottom-button" open-type="share">
              一键分享
            </AtButton>
          </View>
        ) : null}
        {/* 情况2：是金主，不通过分享进入 */}
        {id && share == void 2333 && isCommissionAvailable == true ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              金主您好，点击“一键分享”，分享全球好物
            </View>
            <AtButton className="bottom-button" open-type="share">
              一键分享
            </AtButton>
          </View>
        ) : null}
        {/* 情况5：是游客，通过分享进入 */}
        {isCommissionAvailable == void 2333 &&
        id == void 2333 &&
        share == true ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              加入臻享家，点击“一键注册”，查看全球各国好物。
            </View>
            <AtButton
              className="bottom-button"
              onGetUserInfo={this.onClickRegister}
              open-type="getUserInfo"
            >
              一键注册
            </AtButton>
          </View>
        ) : null}
        {/* 情况6：是游客，不通过分享进入  */}
        {isCommissionAvailable == void 2333 &&
        id == void 2333 &&
        share == void 2333 ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              顾客您好，请您输入邀请码，成为臻享家会员
            </View>
            <AtButton
              className="bottom-button"
              onGetUserInfo={this.onShowRegisterModal}
              open-type="getUserInfo"
            >
              开始注册
            </AtButton>
          </View>
        ) : null}

        <AtModal isOpened={this.state.isInvitationCodeModalShow}>
          <AtModalHeader>请输入臻享家邀请码</AtModalHeader>
          <AtModalContent>
            <AtInput
              name="inputInviationCode"
              title="邀请码："
              type="text"
              placeholder=""
              value={this.state.inputInviationCode}
              onChange={this.onInputInviationCodeChange.bind(this)}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onHideRegisterModal}>取消</Button>
            <Button onClick={this.onModalClickRegister}>注册</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default NotLoginShopkeeper as ComponentClass<PageOwnProps, PageState>;
