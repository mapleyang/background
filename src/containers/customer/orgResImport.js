import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
import Condition from "./condition"
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}
const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];


class OrgResImport extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
      detaiVisible: false,
      editVisible: false,
      importVisible: false,
      detailData: {},
      editData: {},
      addEditTitle: "",
      loginAccount: "",
      accountStatus: "00",
      mobile: "",
      projectData: [],
      projectValue: "all",
      groups: [],
      institution: [],
      region: [],
      citys: [],
      groupValue: "all",
      provinceValue: "all",
      serviceValue: "all"
    }
    this.columns = ClubberDetail.getOrgImportItem(this)
  }

  componentWillMount () {
    const _this = this;
    //后台用户信息接口
    UserInfo.getUserInfo();
    //会员信息接口
    this.getClubberInfo();
    //项目接口
    let project = new Promise(function(resolve, reject) {
      Condition.getProjects(_this, resolve, reject)
    })
    project.then(function(value) {
      //产品服务
      Condition.getServices()
      //服务集团
      let data = {
        "cusId": "1",                
        "custPscId": "5"
      }
      Condition.getGroups(data, _this);
      //省/直辖市
      Condition.getProvince(data, _this)
    }, function(value) {
      // failure

    });
  }



  getClubberInfo (body) {
    const _this = this;
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/cusServiceOperation/memberInfo/searchData",
      data: body,
      dataType:'html',
      success:function(res){
        if(res.success === undefined) {
          res = JSON.parse(res)
        }
        if(res.success === "true") {
          _this.setState({
            data: res.data.rows
          })
        }
        else {
          Modal.error({
            title: res.errors[0].errorMessage,
            content: '',
          });
        }
      },
      error:function(){
      }
    });
  }

  /*表格操作*/
  operateClick (flag, record, index) {
    if(flag === "detail") {
      this.setState({
        detaiVisible: true,
        detailData: record
      })
    }
    else if(flag === "edit"){
      this.setState({
        editVisible: true,
        editData: record,
        addEditTitle: record.name + "信息编辑"
      })
    }
    else if(flag === "delete"){
      Modal.confirm({
        title: "确定删除" + record.name + "信息",
        content: '',
        onOk() {
          console.log('OK');
        },
        onCancel() {
        },
      });
    }
  }

  handleChange (value) {
    console.log(value)
  }

  /*账号状态修改*/
  countStatusChange (value) {
    console.log(value)
    let data = {
      accountStatus: value
    }
    this.setState({
      accountStatus: value
    })
    this.getClubberInfo(data)
  }

  /*项目更改*/
  projectChange (value) {
    let data = {
      cusId: value === "all" ? "" : value
    }
    this.setState({
      projectValue: value,
    })
    this.getClubberInfo(data);
  }

  /*产品服务机构信息*/


  /*组织机构更改*/

  agencyChange () {

  }

  /*模态框*/
  handleOk = (e) => {
    console.log(e);
    this.setState({
      detaiVisible: false,
      editVisible: false,
      importVisible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      detaiVisible: false,
      editVisible: false,
      importVisible: false,
    });
  }
  /*用户信息详情*/
  getUserDetail () {
    let item = "";
    let list = [];
    let colList = [];
    ClubberDetail.getUserItemDetail(this.state.detailData).forEach((el, index) => {
      let ColEl = <Col span={12}>
        <FormItem
          {...modalItemLayout}
          label={el.label}>                  
            <span>{el.value}</span>
        </FormItem>
      </Col>
      colList.push(ColEl)
      if(index % 2) {
        let RowEl = <Row>
          {colList}
        </Row>
        list.push(RowEl);
        colList = [];
      }
      if((ClubberDetail.getUserItemDetail(this.state.detailData).length % 2) && (ClubberDetail.getUserItemDetail(this.state.detailData).length - 1 === index)) {
        let RowEl = <Row>
          {colList}
        </Row>
        list.push(RowEl);
        colList = [];
      }
    });

    item = <div className="table-dialog-area">

      {list}
    </div>
    return item;
  }

  /*查询*/
  searchClick () {
    let data = {}
    if(this.state.mobile !== "") {
      data.mobile = this.state.mobile;
    }
    if(this.state.loginAccount !== "") {
      data.loginAccount = this.state.loginAccount;
    }
    this.getClubberInfo(data);
  }
  /*清空*/
  clearClick () {
    this.setState({
      projectValue: "all",
      serviceValue: "all",
      provinceValue: "all",
      groupValue: "all",
    })
    // this.getClubberInfo()
  }
  /*新增*/
  addUserClick () {
    this.setState({
      editVisible: true,
      addEditTitle: "新增用户信息"
    })
  }
  /*导出*/
  exportClick () {

  }
  /*导入*/
  importClick () {
    this.setState({
      importVisible: true
    })
  }
  /*登陆账号更改*/
  countLoginChange = (e) => {
    this.setState({
      loginAccount: e.target.value
    })
  }

  /*搜索条件-手机事件*/
  mobileChange = (e) => {
    this.setState({
      mobile: e.target.value
    })
  }

  /*获取select options*/
  getOptions (value) {
    let item = <Option value="all">全部</Option>
    if(value.length !== 0) {
      item = value.map(el => {
        if(el.value === "") {
          return <Option value="all">全部</Option>
        }
        return <Option value={el.value}>{el.label}</Option>
      })
    }
    return item;
  }

  /*服务产品选择事件*/
  serviceChange (value) {
    this.setState({
      serviceValue: value
    })
  }

  /*服务集团选择事件*/
  groupsSelect (value) {
    let data = {
      "cusId": "1",                 
      "custPscId": "5",              
      "hcuGroupId": value
    }
    Condition.getInstitution(data, this)
    this.setState({
      groupValue: value
    })
  }

  /*省/直辖市选择事件*/
  provinceSelect (value) {
    let data = {
      "cusId": "1",                 //客户Id
      "custPscId": "1",               //客户所购服务周期ID
      "parplmId": value               //省(直辖市)ID
    }
    Condition.getCitys(data, this)
    this.setState({
      provinceValue: value
    })
  }

  render() {
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="项目名称："
                  >
                    <Select defaultValue="all" value={this.state.projectValue} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                      <Option value="all">全部</Option>
                      {this.state.projectData.length === 0 ? [] : this.state.projectData.map(el => {
                        return <Option value={el.cusId}>{el.projectName}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="服务集团">
                    <Select 
                      placeholder={this.state.serviceValue === "all" ? "请先选择产品服务" : "请选择服务集团"} 
                      disabled={this.state.serviceValue === "all" ? true : false}
                      style={{ width: "100%" }} 
                      onChange={this.groupsSelect.bind(this)}>
                      {this.getOptions(this.state.groups)}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="省/直辖市">   
                    <Select 
                      placeholder={this.state.serviceValue === "all" ? "请先选择产品服务" : "请选择省/直辖市"} 
                      disabled={this.state.serviceValue === "all" ? true : false}
                      style={{ width: "100%" }} 
                      onChange={this.provinceSelect.bind(this)}>
                      {this.getOptions(this.state.region)}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={8}>
                  <FormItem
                  {...formItemLayout}
                    label="产品服务">                  
                    <Select 
                      placeholder={this.state.projectValue === "all" ? "请先选择项目" : "请选择服务产品"} 
                      disabled={this.state.projectValue === "all" ? true : false} 
                      style={{ width: "100%" }} 
                      onChange={this.serviceChange.bind(this)}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </FormItem>
                </Col>  
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="服务机构">                  
                    <Select 
                      placeholder={this.state.groupValue === "all" ? "请先选择服务集团" : "请选择服务机构"} 
                      disabled={this.state.groupValue === "all" ? true : false} 
                      style={{ width: "100%" }} 
                      onChange={this.agencyChange.bind(this)}>
                      {this.getOptions(this.state.institution)}
                    </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="服务城市"
                  className="item-idCard">   
                  <Select 
                    placeholder={this.state.provinceValue === "all" ? "请先选择省/直辖市" : "请选择服务城市"} 
                    disabled={this.state.provinceValue === "all" ? true : false} 
                    style={{ width: "100%" }} 
                    onChange={this.agencyChange.bind(this)}>
                    {this.getOptions(this.state.citys)}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className="group-search-operate">
            <span className="group-search-button">
              <Button type="primary" onClick={this.searchClick.bind(this)}>搜索</Button>
              <Button type="primary" onClick={this.clearClick.bind(this)}>条件清空</Button>
              <Button type="primary" onClick={this.importClick.bind(this)}>排期名额导入</Button>
              <Button type="primary" onClick={this.exportClick.bind(this)}>模板导出</Button>
            </span>
          </div>
          <div className="line-area"></div>
          <div className="group-table">
            <div className="group-table-operate">
            </div>
            <Table columns={this.columns} dataSource={this.state.data} size="middle"  />
          </div>
        </div>
        <Modal
          title={this.state.detailData.name + "信息详情"}
          visible={this.state.detaiVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
        >
          {this.getUserDetail()}
        </Modal>
        <Modal
          title="用户信息导入"
          visible={this.state.importVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          <ClubberImport />
        </Modal>
      </div>
    );
  }
}

export default OrgResImport = Form.create({
})(OrgResImport);