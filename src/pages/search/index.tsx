/*
 * @Author: Hank
 * @Date: 2019-02-08 13:08:53
 * @Last Modified by: Hank
 * @Last Modified time: 2019-02-08 14:57:05
 */

import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";
import { fetchPageData } from "../../actions";
import { HOME } from "../../constants";
import { AtSearchBar, AtTag, AtDivider } from "taro-ui";

type PageStateProps = {};

type PageDispatchProps = {
  add: (namespace: string, payload?: any) => any;
  login: (namespace: string, payload?: any) => any;
  fetchPageData: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Search {
  props: IProps;
}

// @connect(
//   ({ Search }) => ({
//     Search
//   }),
//   {
//     fetchPageData: fetchPageData
//   }
// )

// TODO: 研究代替switch case遍历homeItems数组的办法
class Search extends Component {
  state = {
    searchText: "",
    historyKeywords: [],
    isShowDeleteIcon: false
  };
  config: Config = {
    navigationBarTitleText: "搜索产品"
  };

  /********************* 生命周期函数 **********************/
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {
    const historyKeywords = Taro.getStorageSync("@historyKeywords");

    // console.log("从本地取数据", JSON.parse(historyKeywords));
    console.log("从本地取数据", historyKeywords);
    if (historyKeywords) {
      this.setState({
        historyKeywords: JSON.parse(historyKeywords),
        isShowDeleteIcon: true
      });
    }
  }

  componentDidHide() {}

  /********************* 事件handler **********************/

  // fetchPageData = async () => {
  //   try {
  //     const result = await this.props.fetchPageData(HOME);
  //     console.log("请求成功", result);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  searchTextChangeHandler = value => {
    this.setState({
      searchText: value
    });
  };

  async actionClickHandler() {
    console.log("开始搜索");
    // 输入完成搜索之前先拿到本地的搜索历史
    const historyKeywords = Taro.getStorageSync("@historyKeywords");
    // 创建新字段存放加入新的keyword之后的json
    let newHistoryKeywords;
    // 如果本地已经有json数据，把新的keyword push进入数组
    if (historyKeywords) {
      newHistoryKeywords = await JSON.parse(historyKeywords);
      console.log("转成JSON的newHistoryKeywords", newHistoryKeywords);
      // const isOldKeyword = newHistoryKeywords.some(element => {
      //   return element == this.state.value;
      // });
      // !isOldKeyword && newHistoryKeywords.push(this.state.value);

      console.log("this.state.searchText", this.state.searchText);

      const indexOfKW = newHistoryKeywords.indexOf(this.state.searchText);

      console.log("indexOfKW", indexOfKW);
      console.log("newHistoryKeywords删除之前", newHistoryKeywords);
      if (indexOfKW !== -1) {
        // 如果是已有关键字，删除数组index上对应的关键字
        newHistoryKeywords.splice(indexOfKW, 1);
        // 把最新的关键字推到数组的最后面
        newHistoryKeywords.unshift(this.state.searchText);
      } else {
        // 如果是新的关键字，直接加入数组
        newHistoryKeywords.unshift(this.state.searchText);
      }
      console.log("newHistoryKeywords删除之后", newHistoryKeywords);
    } else {
      // 如果本地没有， 那么创建新数组
      newHistoryKeywords = [this.state.searchText];
    }

    //确定搜索关键字，跳转到商品列表
    // this.props.navigation.navigate("GoodsList", {
    //   keyword: this.state.value,
    //   item: {
    //     name: this.state.value
    //   }
    // });

    // 清空关键字
    this.setState({
      historyKeywords: newHistoryKeywords,
      value: "",
      isShowDeleteIcon: true
    });

    // 存入本地缓存
    Taro.setStorageSync("@historyKeywords", JSON.stringify(newHistoryKeywords));
  }

  // 输入完成开始搜索
  tagClickHandler = name => {
    this.setState({ searchText: name });
  };

  /**
   * 清空历史
   */
  clearHistoryHandler = () => {
    Taro.removeStorageSync("@historyKeywords");
    this.setState({ historyKeywords: [], isShowDeleteIcon: false });
  };

  /********************* 页面render方法 ********************/
  render() {
    return (
      <View className="search-page">
        <AtSearchBar
          actionName="搜一下"
          value={this.state.searchText}
          onChange={this.searchTextChangeHandler}
          onActionClick={this.actionClickHandler}
        />
        <View className="block-container">
          <View className="block-title">历史搜索</View>
          <View className="block-tags">
            {this.state.historyKeywords
              ? this.state.historyKeywords.map((item, index) => {
                  return (
                    <AtTag
                      name={item}
                      type="primary"
                      circle
                      onClick={this.tagClickHandler}
                      key={index}
                    >
                      {item}
                    </AtTag>
                  );
                })
              : null}
            {this.state.isShowDeleteIcon && (
              <AtTag
                name={"删除"}
                type="primary"
                circle
                onClick={this.clearHistoryHandler}
              >
                删除
              </AtTag>
            )}
          </View>
        </View>
        <View className="block-container">
          <View className="block-title">热门推荐</View>
          <View className="block-tags">
            <AtTag
              name="UGG"
              type="primary"
              circle
              onClick={this.tagClickHandler}
            >
              UGG
            </AtTag>
          </View>
        </View>
      </View>
    );
  }
}

export default Search as ComponentClass<PageOwnProps, PageState>;
