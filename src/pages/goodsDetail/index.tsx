/*
 * @Author: Hank
 * @Date: 2019-02-07 10:09:36
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-07 11:56:58
 */
import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { login, fetchPageData } from "../../actions";
import { GOODSDETAIL } from "../../constants";
import Carousel from "../../components/Carousel";

type PageStateProps = {
  goodsDetail: {
    num: number;
    images: [];
  };
};

type PageDispatchProps = {
  fetchPageData: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface GoodsDetail {
  props: IProps;
}

@connect(
  ({ goodsDetail }) => ({
    goodsDetail
  }),
  {
    fetchPageData: fetchPageData,
    login: login
  }
)
class GoodsDetail extends Component {
  config: Config = {
    navigationBarTitleText: "商品详情"
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
    const { id } = this.$router.params;
    console.log("id", id);
    console.log("this.$router", this.$router);

    try {
      const result = await this.props.fetchPageData(GOODSDETAIL, { id: id });
      console.log("请求成功", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  /********************* 渲染页面的方法 *********************/
  /********************* 页面render方法 ********************/
  render() {
    console.log("this.props", this.props);
    const { images } = this.props.goodsDetail;
    return (
      <View className="index">
        <View>
          <Carousel images={images} />
        </View>
      </View>
    );
  }
}

export default GoodsDetail as ComponentClass<PageOwnProps, PageState>;
