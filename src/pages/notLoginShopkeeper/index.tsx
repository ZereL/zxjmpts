/*
 * @Author: Hank
 * @Date: 2019-02-08 15:12:23
 * @Last Modified by: Hank
 * @Last Modified time: 2019-03-05 16:24:14
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
import { getGlobalData, setGlobalData, MD5 } from "../../utils/common";
import {
  AtTabBar,
  AtButton,
  AtNoticebar,
  AtAvatar,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput,
  AtToast
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
    id: any;
  };
  home: any;
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface NotLoginShopkeeper {
  props: IProps;
}

@connect(
  ({ notLoginShopkeeper, user, home }) => ({
    notLoginShopkeeper,
    user,
    home
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
  /**
   * 页面获取数据
   */
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  /**
   * 页面卸载
   */
  componentWillUnmount() {}

  /**
   * 页面获取焦点
   */
  async componentDidShow() {
    Taro.hideShareMenu();
    let { code, hash, share } = this.$router.params; //获取分享进来的参数share

    // 如果是通过分享进入， 需要计算验证md5
    if (share == "true") {
      let MD5Code = MD5(`ZXJ@${code}@InvestCode`);
      const trimUpperCaseMD5Code = MD5Code.replace("-", "").toUpperCase();

      // 如果hash和code转的hash不一直，直接跳走，不让用户注册
      if (trimUpperCaseMD5Code != hash) {
        Taro.showModal({
          title: "邀请码被篡改",
          content:
            "检测到伪造的邀请码，为确保您的安全，您不能使用该用户分享的邀请码注册。"
        }).then(res => {
          console.log("res", res);
          // Taro.navigateTo({ url: "/pages/home/index" });
          Taro.switchTab({ url: "/pages/home/index" });
        });
      }
    }

    // 用户已经登录
    if (getGlobalData("token")) {
      const { data } = await this.props.fetchUserInfo("user");
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

      // 如果刚成为进入还没有邀请码， 发请求获取邀请码
      if (!invatationCode && isCommissionAvailable) {
        // console.log("刚升级成金主，需要发送请求获取邀请码");
        // 如果没有邀请码并且已经成为金主， 发请求获取邀请码
        this.props.fetchInvitationCode("user");
      } else {
        // console.log("已经是金主，也有邀请码");
      }
    }

    // 加载页面数据
    this.fetchPageData();
  }

  /**
   * 页面失去焦点
   */
  componentDidHide() {}

  /**
   * 分享函数入口
   */
  onShareAppMessage() {
    //这个分享的函数必须写在入口中，写在子组件中不生效
    const { invatationCode, invatationCodeHash, name, image } = this.props.user;

    if (!invatationCode) {
      Taro.showToast({
        title: "您还没有邀请码，请您成为金主以后，再分享本页",
        icon: "none",
        duration: 2000
      });
    }
    return {
      title: "海淘更便宜，分享有收益❤️全球臻选好物等您来👇。",
      path: `/pages/notLoginShopkeeper/index?code=${invatationCode}&hash=${invatationCodeHash}&name=${name}&avatarImage=${image}&share=true`,
      // imageUrl: `/src/assets/icon/resource63.png`, // TODO：自定义分享图片目前好像不行
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

  /********************* 事件handler **********************/

  /**
   * 获取页面展示数据
   */
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

  /**
   * 加载更多
   */
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

  /**
   * 跳转到金主有礼页面
   */
  goBecomeShopkeeperHandler = () => {
    Taro.navigateTo({ url: "/pages/becomeShopkeeper/index" });
  };

  /**
   * 用户通过分享进入， 需要从分享链接中拿到邀请码，一键注册
   */
  onClickRegister = async () => {
    // QBF219
    try {
      Taro.showLoading({ title: "注册中...", mask: true });
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
        Taro.hideLoading();
        console.log("registerWechat注册成功", registerWechat);
        // 存入数据库
        setGlobalData("token", registerWechat.data.token);
        // 存入本地缓存
        Taro.setStorageSync("token", registerWechat.data.token);
        Taro.showToast({ title: `注册成功`, duration: 2000 });
      } else {
        Taro.hideLoading();
        Taro.showToast({
          title: `微信号已被使用`,
          icon: "none",
          duration: 2000
        });
        console.log("已经注册过， 没有返回Uid");
        // Taro.showToast({ title: `注册成功`, duration: 2000 });
      }
    } catch (error) {
      console.log("error", error);
      Taro.hideLoading();
      Taro.showToast({
        title: `注册出错，${error.toString()}`,
        icon: "none",
        duration: 2000
      });
    }
  };

  /**
   * 用户不是通过分享进入，直接进入这个页面，在弹出的modal中准备注册
   */
  onModalClickRegister = async () => {
    // QBF219
    try {
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
      Taro.showLoading({ title: "注册中...", mask: true });
      const loginResult = await Taro.login();
      console.log(loginResult);
      const { userInfo, encryptedData, iv } = await Taro.getUserInfo();

      console.log(
        "encryptedData",
        encryptedData,
        "iv",
        iv,
        "code",
        loginResult.code
      );

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
        Taro.hideLoading();
        // 存入数据库
        setGlobalData("token", registerWechat.data.token);
        // 存入本地缓存
        Taro.setStorageSync("token", registerWechat.data.token);
        Taro.showToast({ title: `注册成功`, duration: 2000 });
      } else {
        Taro.hideLoading();
        Taro.showToast({
          title: `微信号已被使用 `,
          icon: "none",
          duration: 2000
        });
        console.log("已经注册过， 服务器没有返回Uid");
        // Taro.showToast({ title: `注册成功`, duration: 2000 });
      }
    } catch (error) {
      console.log("error", error);
      Taro.hideLoading();
      Taro.showToast({
        title: `注册出错，${error.toString()}`,
        icon: "none",
        duration: 2000
      });
    }
    this.setState({ isInvitationCodeModalShow: false });
  };

  /********************* 渲染页面的方法 *********************/

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

  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { tagList = [] } = this.props.home;
    const { items = [] } = this.props.notLoginShopkeeper;
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
              {/* 臻享家用户 {name}, 邀请您加入臻享家。邀请码为： {code}{" "}
              {id && "您已经接受过邀请。请点击“成为金主”获取更多收益"} */}

              {id && isCommissionAvailable
                ? `臻享家用户 ${name}, 邀请您加入臻享家。邀请码为： ${code}, 您已经是臻享家 金主。点击“一键分享”分享全球好物`
                : null}
              {id && !isCommissionAvailable
                ? `臻享家用户 ${name}, 邀请您加入臻享家。邀请码为： ${code}, 您已经是臻享家 小主。点击“成为金主”获取更多收益`
                : null}
              {!id && isCommissionAvailable
                ? `臻享家用户 ${name}, 邀请您加入臻享家。邀请码为： ${code}. 点击“一键注册”即可加入，成为臻享家小主`
                : null}
              {!id && !isCommissionAvailable
                ? `臻享家用户 ${name}, 邀请您加入臻享家。邀请码为： ${code}. 点击“一键注册”即可加入，成为臻享家小主`
                : null}
            </View>
          </View>
        ) : null}
        <ScrollView
          style={
            share
              ? `height: ${getGlobalData("systemInfo").windowHeight - 115}px`
              : `height: ${getGlobalData("systemInfo").windowHeight - 45}px`
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
          <ZXJGoodsList list={items} tagList={tagList} />
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
        {/* 情况1：是金主，通过分享进入 */}
        {id && share && isCommissionAvailable == true ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              金主您好，点击“一键分享”，分享全球好物
            </View>
            <Button className="bottom-button" open-type="share">
              一键分享
            </Button>
          </View>
        ) : null}
        {/* 情况2：是金主，不通过分享进入 */}
        {id && share == void 2333 && isCommissionAvailable == true ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              金主您好，点击“一键分享”，分享全球好物
            </View>
            <Button className="bottom-button" open-type="share">
              一键分享
            </Button>
          </View>
        ) : null}
        {/* 情况3：是小主，通过分享进入 */}
        {id && share && isCommissionAvailable == false ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              更多商品请点击“成为金主”后查看
            </View>
            <Button
              className="bottom-button"
              onClick={this.goBecomeShopkeeperHandler}
            >
              成为金主
            </Button>
          </View>
        ) : null}
        {/* 情况4：是小主，不通过分享进入 */}
        {id && share == void 2333 && isCommissionAvailable == false ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              更多商品请点击“成为金主”后查看
            </View>
            <Button
              className="bottom-button"
              onClick={this.goBecomeShopkeeperHandler}
            >
              成为金主
            </Button>
          </View>
        ) : null}
        {/* 情况5：是游客，通过分享进入 */}
        {id == void 2333 &&
        share == "true" &&
        isCommissionAvailable == void 2333 ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              加入臻享家，点击“一键注册”，查看全球各国好物。
            </View>
            <Button
              className="bottom-button"
              onGetUserInfo={this.onClickRegister}
              open-type="getUserInfo"
            >
              一键注册
            </Button>
          </View>
        ) : null}
        {/* 情况6：是游客，不通过分享进入  */}
        {id == void 2333 &&
        share == void 2333 &&
        isCommissionAvailable == void 2333 ? (
          <View className="bottom-view">
            <View className="bottom-view-text">
              顾客您好，请您输入邀请码，成为臻享家会员
            </View>
            <Button
              className="bottom-button"
              onGetUserInfo={this.onShowRegisterModal}
              open-type="getUserInfo"
            >
              开始注册
            </Button>
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
