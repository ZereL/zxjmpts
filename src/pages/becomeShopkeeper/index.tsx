// /*
//  * @Author: Hank
//  * @Date: 2019-02-08 15:12:23
//  * @Last Modified by: Hank
//  * @Last Modified time: 2019-03-05 16:36:33
//  */

// import { ComponentClass } from "react";
// import Taro, { Component, Config } from "@tarojs/taro";
// import { View, Image, ScrollView, Text } from "@tarojs/components";
// import { connect } from "@tarojs/redux";

// import "./index.scss";
// import { fetchPageData, fetchMorePageData, fetchUserInfo } from "../../actions";
// import ZXJGoodsList from "../../components/ZXJGoodsList/index";
// import { getGlobalData } from "../../utils/common";

// type PageStateProps = {};

// type PageDispatchProps = {
//   fetchPageData: (namespace: string, payload?: any) => any;
//   fetchMorePageData: (namespace: string, payload?: any) => any;
//   fetchUserInfo: (namespace: string, payload?: any) => any;
// };

// type PageOwnProps = {
//   becomeShopkeeper: {
//     items: Array<object>;
//     currentPage: number;
//     hasNext: boolean;
//     pageSize: number;
//   };
//   user: any;
//   home: any;
// };

// type PageState = {};

// type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

// interface BecomeShopkeeper {
//   props: IProps;
// }

// @connect(
//   ({ becomeShopkeeper, user, home }) => ({
//     becomeShopkeeper,
//     user,
//     home
//   }),
//   {
//     fetchPageData: fetchPageData,
//     fetchMorePageData: fetchMorePageData,
//     fetchUserInfo: fetchUserInfo
//   }
// )

// // TODO: 研究代替switch case遍历homeItems数组的办法
// // TODO: 分页加载的时候显示加载中
// class BecomeShopkeeper extends Component {
//   config: Config = {
//     navigationBarTitleText: "金主有礼"
//   };

//   state = {
//     isShareModalshow: false
//   };

//   /********************* 生命周期函数 **********************/
//   componentWillReceiveProps(nextProps) {
//     console.log(this.props, nextProps);
//   }

//   componentWillUnmount() {}

//   componentDidShow() {
//     this.fetchPageData();
//   }

//   componentDidHide() {}

//   /********************* 事件handler **********************/

//   fetchPageData = async () => {
//     try {
//       const result = await this.props.fetchPageData("becomeShopkeeper", {
//         pageSize: 14,
//         currentPage: 1
//       });
//       console.log("请求成功", result);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   fetchMorePageData = async () => {
//     const { currentPage, hasNext, pageSize } = this.props.becomeShopkeeper;

//     try {
//       if (hasNext) {
//         const result = await this.props.fetchMorePageData("becomeShopkeeper", {
//           pageSize: pageSize,
//           currentPage: currentPage + 1
//         });
//         console.log("请求成功", result);
//       } else {
//         console.log("没有更多了");
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   /********************* 渲染页面的方法 *********************/

//   /********************* 页面render方法 ********************/
//   render() {
//     console.log("this.props", this.props);
//     const { items = [] } = this.props.becomeShopkeeper;
//     console.log("items@@", items);
//     const { tagList = [] } = this.props.home;
//     console.log("tagList", tagList);
//     const { id } = this.props.user;
//     let share = this.$router.params.share; //获取分享进来的参数share
//     let { goodId, code, hash, name, avatarImage } = this.$router.params; //获取分享进来的参数share
//     console.log("params", this.$router.params);
//     // let {share} = this.$router.params.share; //获取分享进来的参数share
//     console.log("avatarImage", avatarImage);
//     return (
//       <View className="become-shopkeeper-page">
//         <ScrollView
//           className="scrollview"
//           scrollY
//           scrollWithAnimation
//           // scrollTop="0"
//           style="height: 600px"
//           lowerThreshold={20}
//           // upperThreshold="20"
//           // onScrolltoupper={this.onScrolltoupper}
//           // onScroll={this.onScroll}
//           onScrollToLower={this.fetchMorePageData}
//         >
//           <ZXJGoodsList list={items} tagList={tagList} />
//         </ScrollView>
//       </View>
//     );
//   }
// }

// export default BecomeShopkeeper as ComponentClass<PageOwnProps, PageState>;
