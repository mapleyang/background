import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker, message   } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import ClubberDetail from "./clubberDetail"
import Condition from "./condition"
import Operate from "./operate"
import moment from 'moment';
import DataUtil from "../../utils/dataUtil"
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}
const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class ClubberLogin extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      condition: {},
      data: [],
      addEditVisible: false,
      detailData: {},
      userDetail: {},
      loginAccount: "",
      accountStatus: "02",
      projectData: [],
      projectValue: "",
      idCardType: [],
      idCardTypeValue: "",
      region: [],
      workCitys: [],
      institutions: [],
      departments: [],
      workPosition: [],
      operateFlag: "",
      total: 0,
      pageNumber: 1,
      clubberOrgList: [],
      clubberOrgValue: "",
      tableLoading: false,
      staffNameValue: "",
      idCardValue: "",
      cusId: "",
      serviceList: [],
      custPscId: "",
      orgSelectValue: [],
      projectName: "",
      psc: ""
    }
    this.columns = ClubberDetail.getUserColumns(this, "clubberLogin")
  }

  componentWillMount () {
    const _this = this;
    //后台用户信息接口
    UserInfo.getUserInfo();
    //项目接口
    this.setState({
      tableLoading: true
    })
    let projectUrl = "/chealth/background/ajaxBusiness/loadCustProjectList"
    let projectData = {};
    Operate.getResponse(projectUrl, projectData, "POST", "html").then((value) => {
      if(value.success === "true") {
        let clubberData = {
          custProjectId: value.data[0].custProjectId,
          pageNumber: 1,
          accountStatus: this.state.accountStatus
        }
        _this.setState({
          projectData: value.data,
          projectValue: value.data[0].custProjectId,
          projectName: value.data[0].projectName,
          cusId: value.data[0].cusId,
          condition: clubberData
        })
        //用户数据
        _this.getClubberInfo(clubberData)
        //产品服务
        let serviceData = {
          custProjectId: value.data[0].custProjectId
        }
        _this.getServiceInfo(serviceData, value.data[0].cusId)
      }
    }, (value) => {})
    /*获取身份证号*/
    Condition.getIdCardType(_this)
  }
  /*用户信息请求*/
  getClubberInfo (data) {
    const _this = this;
    this.setState({
      tableLoading: true
    })
    data.pageSize = 10;
    let clubberUrl = "/chealth/background/cusServiceOperation/memberInfo/searchData";
    Operate.getResponse(clubberUrl, data, "POST", "html").then((clubber) => {
      if(clubber.success === "true") {
        _this.setState({
          data: clubber.data.rows,
          total: clubber.data.total,
        })
      }
      _this.setState({
        tableLoading: false
      })
    }, (clubber) => {
      _this.setState({
        tableLoading: false
      })
    })
  }
  /*产品服务信息*/
  getServiceInfo (serviceData, cusId) {
    const _this = this;
    let serviceUrl = "/chealth/background/ajaxBusiness/loadCustPsc";
    Operate.getResponse(serviceUrl, serviceData, "POST", "html").then((service) => {
      if(service.success === "true") {
        if(service.data.list.length) {
          let list = service.data.list.map(el => {
            let serviceObject = DataUtil.getServiceObject(el.value);
            el.custPscId = serviceObject.custPscId;
            el.cusId = serviceObject.cusId;
            return el
          })
          _this.setState({
            serviceList: list,
            custPscId: list[0].custPscId,
            psc: list[0].psc,
          })
          //用户机构组织
          let clubberOrgData = {
            cusId: cusId,
            custPscId: list[0].custPscId
          }
          _this.getClubberOrgInfo(clubberOrgData);
        }
      }
    }, (service) => {})
  }
  getClubberOrgInfo (data) {
    const _this = this;
    let clubberOrgUrl = "/chealth/background/ajaxBusiness/loadCustInstitutionsList";
    Operate.getResponse(clubberOrgUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            el.isLeaf = false;
            list.push(el)
          }
        })
        _this.setState({
          clubberOrgList: list
        })
      }
    }, (value) => {})
  }

  /*表格操作*/
  operateClick (flag, record, index) {
    const _this = this;
    if(flag === "reset") {
      this.setState({
        detailData: record,
        operateFlag: flag,
        addEditVisible: true
      })
      let initData = {
        password: "",
        passwordNew: "",
        effectFlg: ""
      }
      this.props.form.setFieldsValue(initData)
      let userDetailUrl = "/chealth/background/cusServiceOperation/memberLogin/edit";
      let userDetailData = {
        cusId: record.cusId,                       
        memberId: record.memberId,
      }
      Operate.getResponse(userDetailUrl, userDetailData, "POST", "html").then((value) => {
        if(value.success === "true") {
          _this.setState({
            userDetail: value.data
          })
        }
      }, (value) => {})
    }
  }

  /*账号状态修改*/
  countStatusChange (value) {
    let data = this.state.condition;
    data.accountStatus = value;
    this.setState({
      accountStatus: value,
      condition: data
    })
    this.getClubberInfo(data)
  }

  /*项目更改*/
  projectChange (value) {
    let data = this.state.condition;
    data.custProjectId = value;
    let cusId = this.state.cusId;
    let projectName = this.state.projectName;
    this.state.projectData.forEach(el => {
      if(el.custProjectId === value) {
        cusId = el.cusId;
        projectName = el.projectName;
      }
    })
    this.setState({
      projectValue: value,
      projectName: projectName,
      cusId: cusId,
      condition: data
    })
    let serviceData = {
      custProjectId: value
    }
    this.getServiceInfo(serviceData, cusId);
    this.getClubberInfo(data);
  }

  /*组织机构更改*/

  clubberOrgChange (value) {
    let data = this.state.condition;
    if(value) {
      data.cusInstitutionId = value;
      this.getClubberInfo(data)
    }
    this.setState({
      clubberOrgValue: value,
      condition: data
    })
  }

  /*新增编辑确认*/
  addEdithandleOk () {
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {};
        for(let key in values) {
          if(key !== "password") {
            data[key] = values[key];
          }
        }
        let clubberSaveUrl = "/chealth/background/cusServiceOperation/memberLogin/saveEdit";
        Operate.getResponse(clubberSaveUrl, data, "POST", "html").then((value) => {
          if(value.success === "true") {
            message.success(this.state.detailData.name + "登陆重置成功！");
            _this.getClubberInfo(_this.state.condition)
          }
          else {
            message.error(this.state.detailData.name + "登陆重置失败！")
          }
          _this.setState({
            addEditVisible: false
          })
        }, (value) => {})
      }
    });
  }

  /*模态框*/
  handleOk = (e) => {
    this.setState({
      addEditVisible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      addEditVisible: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    });
  }

  effectFlgChange (value) {

  }
  //再次确认密码
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

              // <FormItem
              //   {...modalItemLayout}
              //   label="产品服务">    
              //   <span>{serviceName}</span>
              // </FormItem>

  /*用户新增与编辑*/
  getUserAddEdit () {
    let item = "";
    const { getFieldDecorator } = this.props.form;
    let serviceName = "";
    this.state.serviceList.forEach(el => {
      if(el.custPscId === this.state.custPscId) {
        serviceName = el.label;
      }
    })
    item = <Form>
      <div className="table-dialog-area">
        <div>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="项目名称">                  
                  <span>{this.state.projectName}</span>
              </FormItem>
            </Col>
            <Col span={12}>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="输入新密码"
                hasFeedback>                  
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入新密码' }],
                  })(
                    <Input type="password" placeholder="请输入新密码" />
                  )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="再次输入新密码"
                hasFeedback>                  
                  {getFieldDecorator('passwordNew',  {
                    rules: [{
                      required: true, message: '请再次输入新密码!',
                    }, {
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input type="password" placeholder="请再次输入新密码" />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="登陆权限禁用"
                hasFeedback> 
                  {getFieldDecorator('effectFlg', {
                    rules: [{ required: true }],
                  })(
                    <RadioGroup onChange={this.effectFlgChange.bind(this)}>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </RadioGroup>
                  )}                  
              </FormItem>
            </Col>
            <Col span={12}>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
    return item;
  }

  onAreaChange = (value, selectedOptions) => {
    console.log(selectedOptions);
    console.log(value);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  }

  /*异步加载*/
  loadData = (selectedOptions) => {
    const _this = this;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let data = {
      cusId: this.state.cusId,                 //客户Id
      custPscId: this.state.custPscId,               //客户所购服务周期ID
    }
    if(selectedOptions.length === 1) {   //获取市数据
      data.parplmId = selectedOptions[0].value;
      let cityUrl = "/chealth/background/ajaxBusiness/loadCustCityListInParplm";
      Operate.getResponse(cityUrl, data, "POST", "html").then((value) => {
        if(value.success === "true") {
          let list = [];
          value.data.list.forEach(el => {
            if(el.value) {
              list.push(el)
            }
          })
          let region = this.state.region.map(el => {
            if(el.value === selectedOptions[0].value) {
              el.children = list;
              el.isLeaf = list.length === 0 ? true : false;
            }
            return el
          })
          _this.setState({
            region: region
          })
        }
        targetOption.loading = false;
      }, (value) => {})
    }
  }

  /*查询*/
  searchClick () {
    this.getClubberInfo(this.state.condition);
  }
  /*清空*/
  clearClick () {
    let data = {
      custProjectId: this.state.projectData[0].custProjectId,
      pageNumber: 1,
      accountStatus: "02"
    }
    this.setState({
      accountStatus: "",
      loginAccount: "",
      mobile: "",
      staffNameValue: "",
      idCardTypeValue: "",
      idCardValue: "",
      custPscId: "",
      psc: "",
      orgSelectValue: [],
      projectValue: this.state.projectData[0].custProjectId,
      condition: data
    })
    let serviceData = {
      custProjectId: this.state.projectData[0].custProjectId,
    }
    this.getServiceInfo(serviceData, this.state.projectData[0].cusId);
    this.getClubberInfo(data)
  }
  /*登陆账号更改*/
  countLoginChange = (e) => {
    let data = this.state.condition;
    data.loginAccount = e.target.value.trim();
    this.setState({
      loginAccount: e.target.value,
      condition: data
    })
  }

  /*搜索条件-手机事件*/
  mobileChange = (e) => {
    let data = this.state.condition;
    data.mobile = e.target.value.trim();
    this.setState({
      mobile: e.target.value,
      condition: data
    })
  }

  /*员工号/姓名更改*/
  staffChange = (e) => {
    let data = this.state.condition;
    data.memberName = e.target.value.trim();
    this.setState({
      condition: data,
      staffNameValue: e.target.value
    })
  } 

  /*获取身份证类型*/

  getIdCardTypeOption (flag) {
    let item = [];
    if(flag === "form") {
      if(this.state.idCardType.length !== 0) {
        this.state.idCardType.forEach(el => {
          if(el.value !== "") {
            item.push(<Option value={el.value}>{el.label}</Option>)
          }
        })
      }
    }
    else {
      if(this.state.idCardType.length !== 0) {
        item = this.state.idCardType.map(el => {
          if(el.value === "") {
            return <Option value="">全部</Option>
          }
          return <Option value={el.value}>{el.label}</Option>
        })
      }
      else {
        item = <Option value="">全部</Option>
      }
    }
    return item;
  }
  /*身份证类型*/
  idCardTypeChange (value) {
    let data = this.state.condition;
    data.cardType = value === "all" ? "" : value;
    this.setState({
      idCardTypeValue: value,
      condition: data
    })
    this.getClubberInfo(data)
  }
  idCardChange = (e) => {
    let data = this.state.condition;
    data.cardID = e.target.value.trim();
    this.setState({
      condition: data,
      idCardValue: e.target.value
    })
  }
  /*表格事件*/
  tableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNumber: pagination.current
    })
    let data = this.state.condition;
    data.pageNumber = pagination.current;
    this.getClubberInfo(data)
  }

  /*产品服务选择事件*/
  serviceChange (value) {
    let data = this.state.condition;
    data.custPscId = value;
    data.cusInstitutionId = "";
    data.cusDepartmentId = "";
    let psc = "";
    this.state.serviceList.forEach(el => {
      if(value === el.custPscId) {
        psc = el.psc;
      }
    })
    let clubberOrgData = {
      cusId: this.state.cusId,
      custPscId: value,
      psc: psc,
    }
    this.setState({
      custPscId: value,
      condition: data,
      orgSelectValue: [],
    })
    this.getClubberInfo(data);
    this.getClubberOrgInfo(clubberOrgData);
  }

  /*组织机构选择事迹*/
  orgSelectChange (value) {
    let data = this.state.condition;
    if(value.length === 1) {
      data.cusInstitutionId = value[0];
    }
    else {
      data.cusInstitutionId = value[0];
      data.cusDepartmentId = value[1];
    }
    this.getClubberInfo(data);
    this.setState({
      orgSelectValue: value
    })
  }

  /*机构加载*/
  orgLoadData = (selectedOptions) => {
    const _this = this;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if(selectedOptions.length === 1) {
      let departmentUrl = "/chealth/background/ajaxBusiness/loadCustDepartmentsList";
      let departmentData = {
        cusInstitutionsId: selectedOptions[0].value
      }
      Operate.getResponse(departmentUrl, departmentData, "POST", "html").then((value) => {
        targetOption.loading = false;
        if(value.success === "true"){
          let list = [];
          value.data.list.forEach(el => {
            if(el.value) {
              list.push(el)
            }
          })
          let clubberOrgList = [];
          clubberOrgList = this.state.clubberOrgList.map(el => {
            if(el.value === selectedOptions[0].value) {
              el.children = list;
              el.isLeaf = list.length === 0 ? true : false;
            }
            return el;
          })
          _this.setState({
            clubberOrgList: clubberOrgList
          })
        }
      }, (value) => {})
    }
  }

  render() {
    let uploadUrl = "/chealth/background/cusServiceOperation/memberInfo/inputMemberData";
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="项目名称">
                    <Select value={this.state.projectValue} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                      {this.state.projectData.map(el => {
                        return <Option value={el.custProjectId}>{el.projectName}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                   <FormItem
                    {...formItemLayout}
                    label="产品服务：">                  
                      <Select value={this.state.custPscId} style={{ width: "100%" }} onChange={this.serviceChange.bind(this)}>
                        {this.state.serviceList.map(el => {
                          return <Option value={el.custPscId}>{el.label}</Option>
                        })}
                      </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol = {{ span: 6 }}
                    wrapperCol = {{ span: 14 }}
                    label="用户姓名">
                    <Input placeholder="请输入用户姓名" onChange={this.staffChange} value={this.state.staffNameValue} />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="登陆账号">                  
                    <Input placeholder="请输入登陆账号" onChange={this.countLoginChange} value={this.state.loginAccount}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="手机号">   
                  <Input placeholder="请输入手机号" onChange={this.mobileChange} value={this.state.mobile}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  labelCol = {{ span: 6 }}
                  wrapperCol = {{ span: 14 }}
                  label="身份证件号"
                  className="item-idCard">   
                  <InputGroup compact>
                    <Select value={this.state.idCardTypeValue} onChange={this.idCardTypeChange.bind(this)}>
                      {this.getIdCardTypeOption("condition")}
                    </Select>
                    <Input placeholder="请输入证件号" style={{ width: '68%' }} onChange={this.idCardChange} value={this.state.idCardValue} />
                  </InputGroup> 
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="帐号状态：">                  
                    <Select value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                      <Option value="01">未激活</Option>
                      <Option value="02">激活</Option>
                      <Option value="03">失效</Option>
                      <Option value="04">禁用</Option>
                      <Option value="05">作废</Option>
                    </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                {...formItemLayout}
                  label="机构组织">    
                  <Cascader placeholder="请选择团体机构、组织" style={{width: "100%"}} value={this.state.orgSelectValue} options={this.state.clubberOrgList} loadData={this.orgLoadData} onChange={this.orgSelectChange.bind(this)} changeOnSelect />              
                </FormItem>
              </Col>
              <Col span={8}>
              </Col>
            </Row>
          </div>
          <div className="group-search-operate">
            <span className="group-search-button">
              <Button type="primary" onClick={this.searchClick.bind(this)}>搜索</Button>
              <Button type="primary" onClick={this.clearClick.bind(this)}>条件清空</Button>
            </span>
          </div>
          <div className="line-area"></div>
          <div className="group-table">
            <div className="group-table-operate">
            </div>
            <Table 
              columns={this.columns} 
              loading={this.state.tableLoading}
              dataSource={this.state.data} 
              size="middle"
              onChange={this.tableChange}
              pagination={{current: this.state.pageNumber ,pageSize: 10, total: this.state.total, size: "middle"}}  />
          </div>
        </div>
        <Modal
          title={this.state.detailData.name + "登陆重置"}
          visible={this.state.addEditVisible}
          onOk={this.addEdithandleOk.bind(this)}
          onCancel={this.handleCancel}
          width={800}
        >
          {this.getUserAddEdit()}
        </Modal>
      </div>
    );
  }
}

export default ClubberLogin = Form.create({
})(ClubberLogin);