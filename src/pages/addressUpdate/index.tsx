import Taro, { Component } from "@tarojs/taro";
import { View, Input, Image, Text, Picker } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import locations from "../../assets/locations.js";
import AddressPicker from "../../components/AddressPicker";

@connect(({ address }) => ({
  ...address
}))
export default class Addressupdate extends Component {
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

  componentDidMount = () => {
    // this.props.dispatch({
    //   type: 'addressUpdate/getDistricts',
    //   payload: {
    //     send_cities: 0,
    //   },
    // });
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

  // 保存提交
  submit = () => {};

  onToggleAddressPicker = (info, params) => {
    console.log("点击", this);
    console.log("点击", info);
    console.log("点击", params);

    this.setState({ isPickerShow: false, cityInfo: info });
  };

  cityInputHandler = () => {
    this.setState({ isPickerShow: true });
  };

  render() {
    const { isPickerShow } = this.state;
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
          />
          <View onClick={this.cityInputHandler}>
            <Input
              type="number"
              maxLength={11}
              placeholder="省市区"
              id="address_city"
              value={this.state.cityInfo}
              onInput={this.updateCity}
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
            type="number"
            maxLength={11}
            placeholder="身份证"
            id="contact_ID"
            value={this.state.id}
            onInput={this.updateId}
          />
        </View>
        <View className="bottom-btn">
          <View className="confirm" onClick={this.submit}>
            <Image
              mode="widthFix"
              src={require("../../images/icon/check.png")}
            />
            <Text>保存</Text> d
          </View>
        </View>
        <AddressPicker
          pickerShow={isPickerShow}
          onHandleToggleShow={this.onToggleAddressPicker.bind(this)}
        />
      </View>
    );
  }
}
