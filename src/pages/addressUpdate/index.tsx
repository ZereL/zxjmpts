import { ComponentClass } from "react";
import Taro, { Component } from "@tarojs/taro";
import { View, Input, Text, Button } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import AddressPicker from "../../components/AddressPicker";
import { requestAddAddress, requestModifyAddress } from "../../actions/index";

type PageStateProps = {};

type PageDispatchProps = {
  requestAddAddress: (namespace: string, payload?: any) => any;
  requestModifyAddress: (namespace: string, payload?: any) => any;
};

type PageOwnProps = {
  address: {};
};

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface AddressUpdate {
  props: IProps;
}

@connect(
  ({ address }) => ({
    address
  }),
  {
    requestAddAddress: requestAddAddress,
    requestModifyAddress: requestModifyAddress
  }
)
class AddressUpdate extends Component {
  config = {
    navigationBarTitleText: "编辑收件人"
  };

  state = {
    isPickerShow: false,
    name: "",
    cityInfo: "",
    detailInfo: "",
    mobile: "",
    id: ""
  };

  /********************* 生命周期函数 **********************/
  componentDidMount = () => {};

  componentDidShow = () => {
    let {
      name,
      phoneNum,
      enCodeFullName,
      detailAddress,
      idNum
    } = this.$router.params; //获取传入进来的参数

    if (name || phoneNum || enCodeFullName || detailAddress || idNum) {
      this.setState({
        name: name,
        cityInfo: enCodeFullName,
        detailInfo: detailAddress,
        mobile: phoneNum,
        id: idNum
      });
    }
  };

  /********************* 事件handler **********************/

  /**
   * 新提交地址数据事件
   */
  submitHandler = async () => {
    const { name, cityInfo, detailInfo, mobile, id } = this.state;
    // 验证输入信息
    if (!name || !cityInfo || !detailInfo || !mobile || !id) {
      Taro.showToast({
        title: "请您完整填写表单",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (mobile.length != 11) {
      Taro.showToast({
        title: "请您填写正确的电话号码",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (id.length != 18) {
      Taro.showToast({
        title: "请您填写正确的身份证号码",
        icon: "none",
        duration: 2000
      });
      return;
    }

    Taro.showLoading({ title: "保存中...", mask: true });
    const cityInfoArray = cityInfo.split(" "); // 注意这里是picker生成的，这里要通过“ ”分割，可以修改成一样的

    // 发请求
    await this.props.requestAddAddress("address", {
      enCode: "CN11010200",
      name: name,
      province: cityInfoArray[0],
      city: cityInfoArray[1],
      area: cityInfoArray[2],
      phoneNum: mobile,
      detailAddress: detailInfo,
      idNum: id,
      isDefaultAddress: true
    });
    Taro.hideLoading();
  };

  /**
   * 修改的地址数据事件
   */
  saveChangHandler = async () => {
    let { addressId } = this.$router.params; //获取传入进来的参数
    const { name, cityInfo, detailInfo, mobile, id } = this.state;

    // 验证输入信息
    if (!name || !cityInfo || !detailInfo || !mobile || !id) {
      Taro.showToast({
        title: "请您完整填写表单",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (mobile.length != 11) {
      Taro.showToast({
        title: "请您填写正确的电话号码",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (id.length != 18) {
      Taro.showToast({
        title: "请您填写正确的身份证号码",
        icon: "none",
        duration: 2000
      });
      return;
    }

    Taro.showLoading({ title: "保存中...", mask: true });
    const cityInfoArray = cityInfo.split(","); // 注意这里是传入的数据，这里要通过“,”分割

    // 发请求
    await this.props.requestModifyAddress("address", {
      id: addressId,
      enCode: "CN11010200",
      country: "CN",
      name: name,
      province: cityInfoArray[0],
      city: cityInfoArray[1],
      area: cityInfoArray[2],
      phoneNum: mobile,
      detailAddress: detailInfo,
      idNum: id,
      isDefaultAddress: true
    });
    Taro.hideLoading();
  };

  /**
   * 关闭地址pickerView事件
   */
  onToggleAddressPicker = (info, params) => {
    console.log("点击", this);
    console.log("点击", info);
    console.log("点击", params);

    this.setState({ isPickerShow: false, cityInfo: info });
  };

  /********************* 渲染页面的方法 *********************/
  cityInputHandler = () => {
    this.setState({ isPickerShow: true });
  };

  updateName = event => {
    const { value, id } = event.target;
    console.log(value, id);
    this.setState({ name: value });
  };
  updateCity = event => {
    const { value, id } = event.target;
    console.log(value, id);
    this.setState({ cityInfo: value });
  };
  updateDetail = event => {
    const { value, id } = event.target;
    console.log(value, id);
    this.setState({ detailInfo: value });
  };
  updateMobile = event => {
    const { value, id } = event.target;
    console.log(value, id);
    this.setState({ mobile: value });
  };
  updateId = event => {
    const { value, id } = event.target;
    console.log(value, id);
    this.setState({ id: value });
  };

  /********************* 页面render方法 ********************/
  render() {
    const { isPickerShow } = this.state;
    let { addressId } = this.$router.params; //获取传入进来的参数
    return (
      <View className="addressUpdate-page">
        {/* <View className="head">{"编辑地址"}</View> */}
        <View className="form">
          <Input
            placeholder="姓名"
            id="contact_name"
            value={this.state.name}
            onInput={this.updateName}
          />
          <Input
            type="number"
            maxLength={11}
            placeholder="国家/地区"
            id="address_city"
            value={"中国"}
            disabled
          />
          <View onClick={this.cityInputHandler}>
            <Input
              type="text"
              placeholder="省市区"
              id="address_city"
              value={this.state.cityInfo}
              onInput={this.updateCity}
              disabled
            />
          </View>
          <Input
            placeholder="详细地址"
            id="address_detail"
            value={this.state.detailInfo}
            onInput={this.updateDetail}
          />
          <Input
            type="number"
            maxLength={11}
            placeholder="手机号码"
            id="contact_mobile"
            value={this.state.mobile}
            onInput={this.updateMobile}
          />
          <Input
            type="idcard"
            maxLength={18}
            placeholder="身份证"
            id="contact_ID"
            value={this.state.id}
            onInput={this.updateId}
          />
        </View>
        {/* 如果传入参数带有地址的id，说明是修改地址 */}
        {addressId && (
          <View className="bottom-btn">
            <Button className="confirm" onClick={this.saveChangHandler}>
              <Text>保存修改并设为默认</Text>
            </Button>
          </View>
        )}
        {/* 如果传入参数不带有地址的id，说明是修改地址 */}
        {!addressId && (
          <View className="bottom-btn">
            <Button className="confirm" onClick={this.submitHandler}>
              <Text>保存</Text>
            </Button>
          </View>
        )}
        {/* 地址选择器 */}
        <AddressPicker
          pickerShow={isPickerShow}
          onHandleToggleShow={this.onToggleAddressPicker.bind(this)}
        />
      </View>
    );
  }
}

export default AddressUpdate as ComponentClass<PageOwnProps, PageState>;
