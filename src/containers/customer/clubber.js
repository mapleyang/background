import React, { Component } from 'react'
import { Table, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker, message  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import DataUtil from "../../utils/dataUtil"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
import Condition from "./condition"
import Operate from "./operate"
import ClubberDelete from "./clubberDelete"
import moment from 'moment';
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

class Clubber extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      condition: {},
      data: [],
      detaiVisible: false,
      addEditVisible: false,
      importVisible: false,
      clubberDeleteVisible: false,
      deleteConfirmLoading: false,
      detailData: {},
      editData: {},
      addEditTitle: "",
      loginAccount: "",
      staffAccount: "",
      accountStatus: "",
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
      orderList: [],
      cusId: "",
      serviceList: [],
      custPscId: "",
      orgSelectValue: [],
      projectName: "",
      psc: "",
      staffType: "staff"
    }
    this.columns = ClubberDetail.getUserColumns(this, "clubber")
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
        let condition = {
          custProjectId: value.data[0].custProjectId,
          pageNumber: 1,
        }
        _this.setState({
          projectData: value.data,
          projectValue: value.data[0].custProjectId,
          projectName: value.data[0].projectName,
          cusId: value.data[0].cusId,
          condition: condition
        })
        //用户数据
        let clubberData = {
          custProjectId: value.data[0].custProjectId,
          pageNumber: 1,
        }
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
    let reqData = {};
    for(let key in data) {
      if(data[key]) {
        reqData[key] = data[key];
      }
    }
    let clubberUrl = "/chealth/background/cusServiceOperation/memberInfo/searchData";
    Operate.getResponse(clubberUrl, reqData, "POST", "html").then((clubber) => {
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
            return el;
          })
          let serviceObject = DataUtil.getServiceObject(service.data.list[0].value);
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
          let clubberData = _this.state.condition;
          clubberData.custPscId = list[0].custPscId;
          _this.getClubberInfo(clubberData)
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
    if(flag === "detail") {
      this.setState({
        detaiVisible: true,
        detailData: record
      })
    }
    else if(flag === "edit"){
      const dateFormat = 'YYYY-MM-DD';
      this.setState({
        addEditVisible: true,
        detailData: record,
        addEditTitle: record.name + "信息编辑"
      })
      this.dialogUserInfo();
      let data = {
        memberName: record.name,
        sex: record.sex,
        marital: record.marital,
        mobile: record.mobile,
        email: record.email,
        cardType: record.certiType,
        certiId: record.certiId,
        workCity: record.workCity,
        workPosition: record.workPosition,
        cusDepartmentId: record.department,
        cusInstitutionId: record.institutionsId,
        birth: record.birth === null ? "" : moment(record.birth, dateFormat),
        staffNo: record.staffNo,
        accountStatus: record.accountstatus
      }
      this.props.form.setFieldsValue(data)
    }
    else if(flag === "delete"){
      this.setState({
        clubberDeleteVisible: true,
        detailData: record
      })
    }
    this.setState({
      operateFlag: flag
    })
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
    let clubberData = {
      custProjectId: value,
      pageNumber: 1
    };
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
      condition: clubberData,
      orgSelectValue: [],
      accountStatus: "",
      loginAccount: "",
      mobile: "",
      staffAccount: "",
      staffNameValue: "",
      idCardTypeValue: "",
      idCardValue: "",
      staffType: "staff"
    })
    let serviceData = {
      custProjectId: value
    }
    this.getServiceInfo(serviceData, cusId);
    this.getClubberInfo(clubberData);
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
          if(key === "birth") {
            let date = new Date(values[key]._d)
            data.birthYear = date.getFullYear();
            data.birthMonth = date.getMonth() + 1;
            data.birthDay = date.getDate();
          }
          else {
            data[key] = values[key];
          }
        }
        if(_this.state.operateFlag === "edit") {
          data.cusId = _this.state.cusId;
          data.memberId = _this.state.detailData.memberId;
          let clubberSaveUrl = "/chealth/background/cusServiceOperation/memberInfo/saveEdit";
          Operate.getResponse(clubberSaveUrl, data, "POST", "html").then((value) => {
            if(value.success === "true") {
              _this.getClubberInfo(_this.state.condition)
              _this.setState({
                addEditVisible: false
              })
              message.success("用户编辑成功！")
            }
            else {
              message.error("用户编辑失败！")
            }
          }, (value) => {})
        }
        else {
          data.custProjectId = _this.state.projectValue;
          let clubberAddUrl = "/chealth/background/cusServiceOperation/memberInfo/saveCreate";
          Operate.getResponse(clubberAddUrl, data, "POST", "html").then((value) => {
            if(value.success === "true") {
              _this.getClubberInfo(_this.state.condition)
              _this.setState({
                addEditVisible: false
              })
              message.success("用户新增成功！")
            }
            else{
              message.error("用户新增失败！")
            }
          }, (value) => {})
        }
      }
    });
  }

  /*用户删除*/
  //获取用户订单
  getClubberOrderInfo (list) {
    this.setState({
      orderList: list
    })
  }
  clubberDeletehandleOk () {
    const _this = this;
    this.setState({
      deleteConfirmLoading: true
    })
    if(this.state.orderList.length === 0) {
      this.clubberDeleteReq();
    }
    else {
      //批量删除
      let cancel = new Promise(function(resolve, reject) {
        this.state.orderList.forEach((el,index) => {
          this.cancelOrderReq(el,index, resolve, reject)
        })
      })
      cancel.then((value) => {
        this.clubberDeleteReq();
      }, (value) => {})
    }
  }

  //批量取消订单
  cancelOrderReq (record, index, resolve, reject) {
    const _this = this;
    let cancelOrderUrl = "/chealth/background/cusServiceOperation/hcuReserve/cancelOrder";
    let cancelOrderData = {
      purchaseOrderId: record.recordId,      
      cusId: record.cusId,                   
      custPscId: record.custPscId,               
      psc: record.psc,                      
      orderStep: record.orderStep,          
      handelKbn: record.handleKbn,
    }
    Operate.getResponse(cancelOrderUrl, cancelOrderData, "POST", "html").then((value) => {
      if(value.success === "true") {
        message.success(record.recordId + "订单取消成功")
      }
      else {
        message.error(record.recordId + "订单取消失败！")
      }
      if(index === this.state.orderList.length - 1) {
        resolve(value)
      }
    }, (value) => {})
  }

  //删除请求
  clubberDeleteReq () {
    const _this = this; 
    let clubberDeleteUrl = "/chealth/background/cusServiceOperation/memberInfo/delete";
    let data = {
      cusId: this.state.cusId,
      memberId: this.state.detailData.memberId
    }
    Operate.getResponse(clubberDeleteUrl, data, "POST", "html").then((value) => {
      _this.setState({
        deleteConfirmLoading: false,
        clubberDeleteVisible: false,
      })  
      if(value.success === "true") {
        _this.getClubberInfo(_this.state.condition)
        message.success("删除" + this.state.detailData.name + "成功！")
      }
      else {
        message.error("删除" + this.state.detailData.name + "失败，请重试！")
      }
    }, (value) => {
      _this.setState({
        deleteConfirmLoading: false,
        clubberDeleteVisible: false,
      })  
      message.error("删除" + this.state.detailData.name + "失败，请重试！")
    })
  }


  /*模态框*/
  handleOk = (e) => {
    this.setState({
      detaiVisible: false,
      addEditVisible: false,
      clubberDeleteVisible: false,
    });
  }

  clubberHandleOk = (e) => {
    this.setState({
      importVisible: false,
    });
    this.getClubberInfo(this.state.condition)
  }

  handleCancel = (e) => {
    this.setState({
      detaiVisible: false,
      addEditVisible: false,
      importVisible: false,
      clubberDeleteVisible: false
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    });
  }
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
        <div className="table-area-line">
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
                label="用户姓名"
                hasFeedback>                  
                  {getFieldDecorator('memberName', {
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(
                    <Input placeholder="用户姓名" />
                  )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="性别"
                hasFeedback>    
                {getFieldDecorator('sex', {
                    rules: [{ required: true}],
                  })(
                  <Select>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                  </Select>          
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="出生年月"
                hasFeedback> 
                  {getFieldDecorator('birth', {
                    rules: [{ required: true }],
                  })(
                    <DatePicker placeholder="请选择出生年月"/>
                  )}                  
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="婚姻状况"
                hasFeedback>    
                  {getFieldDecorator('marital', {
                    rules: [{ required: true }],
                  })(
                    <Select>
                      <Option value="2">已婚</Option>
                      <Option value="1">未婚</Option>
                    </Select>          
                  )} 
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户手机"
                hasFeedback>  
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请输入手机号' }],
                  })(
                    <Input placeholder="用户手机" />
                  )}                
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户邮箱"
                hasFeedback>    
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: '请输入邮箱' }],
                  })(
                  <Input placeholder="用户邮箱" />
                )}                 
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="身份证件类型"
                hasFeedback>                  
                {getFieldDecorator('cardType', {
                    rules: [{ required: true, message: '请输入对应的身份证件号' }],
                  })(
                 <Select placeholder="请输入身份证类型" className="icp-selector" notFoundContent="not found">
                  {this.getIdCardTypeOption("form")}
                </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="身份证件号"
                hasFeedback>                  
                {getFieldDecorator('certiId', {
                    rules: [{ required: true, message: '请输入对应的身份证件号' }],
                  })(
                  <Input placeholder="请输入身份证件号"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="员工/会员号"
                hasFeedback>    
                {getFieldDecorator('staffNo', {
                    rules: [{ required: true, message: '请输入员工号或会员号' }],
                  })(
                  <Input placeholder="员工号或会员号" />
                )}             
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="账号状态">    
                  {getFieldDecorator('accountStatus', {
                    rules: [{ required: true, message: '请输入员工号或会员号' }],
                    })(
                    <Select placeholder="请选择账号状态">
                      <Option value="01">未激活</Option> 
                      <Option value="02">激活</Option>
                      <Option value="04">禁用</Option>
                      <Option value="05">作废</Option>
                    </Select>
                  )}                      
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="table-area-line">
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="工作城市">      
                  {getFieldDecorator('workCity')(
                    <Select placeholder="请选择工作城市">
                      {this.state.workCitys.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}                 
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="角色/职位">  
                {getFieldDecorator('workPosition')(
                    <Select placeholder="请选择角色/职位">
                      {this.state.workPosition.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}     
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="机构组织">                  
                  {getFieldDecorator('cusInstitutionId')(
                    <Select placeholder="请选择机构">
                      {this.state.institutions.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}     
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="部门组织">    
                  {getFieldDecorator('cusDepartmentId')(
                    <Select placeholder="请选择部门">
                      {this.state.departments.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}                  
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="table-area-line">
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="联系手机">     
                    <Input placeholder="请输入联系手机号"/>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="联系邮箱">    
                  <Input placeholder="请输入联系邮箱"/>     
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="所在地区">                  
                  <Cascader
                    placeholder="请选择所在地区"
                    options={this.state.region}
                    loadData={this.loadData}
                    onChange={this.onAreaChange}
                    changeOnSelect
                  />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="详细地址">    
                <Input placeholder="请输入详细地址"/>              
              </FormItem>
            </Col>
          </Row>
        </div>
        <div style={{marginTop: "10px"}}>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="备注">                  
                  <Input placeholder="请输入相关备注"/>
              </FormItem>
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
    }
    this.setState({
      accountStatus: "",
      loginAccount: "",
      mobile: "",
      staffAccount: "",
      staffNameValue: "",
      idCardTypeValue: "",
      idCardValue: "",
      orgSelectValue: [],
      custPscId: "",
      psc: "",
      staffType: "staff",
      projectValue: this.state.projectData[0].custProjectId,
      condition: data
    });
    let serviceData = {
      custProjectId: this.state.projectData[0].custProjectId,
    }
    this.getServiceInfo(serviceData, this.state.projectData[0].cusId);
    this.getClubberInfo(data);
  }
  /*新增*/
  addUserClick () {
    this.setState({
      addEditVisible: true,
      addEditTitle: "新增用户信息"
    })
    this.dialogUserInfo();
    let initData = {
      sex: "1",
      marital: "1",
      cardType: "1",
      birth: "",
      accountStatus: "01",
      memberName: "",
      mobile: "",
      email: "",
      certiId: "",
      staffNo: "",
      workCity: "",
      workPosition: "",
      cusDepartmentId: "",
      cusInstitutionId: "",
    }
    this.props.form.setFieldsValue(initData);
  }
  dialogUserInfo () {
    const _this = this;
    let data = {
      cusId: this.state.cusId,                  
      custPscId: this.state.custPscId                
    }
    /*获取省（直辖市数据）*/
    let provinceUrl = "/chealth/background/ajaxBusiness/loadCustParplmList";
    Operate.getResponse(provinceUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            el.isLeaf = false;
            list.push(el)            
          }
        })
        _this.setState({
          region: list
        })
      }
    }, (value) => {})
    /*获取工作职位*/
    let workPositionUrl = "/chealth/background/ajaxBusiness/loadCustWorkPositionsList";
    Operate.getResponse(workPositionUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        _this.setState({
          workPosition: list
        })
      }
    }, (value) => {})
    /*获取工作城市*/
    let workCityUrl = "/chealth/background/ajaxBusiness/loadCustWorkCitiesList"
    Operate.getResponse(workCityUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        _this.setState({
          workCitys: list
        })
      }
    }, (value) => {})
    /*获取团体机构*/
    let institutionsUrl = "/chealth/background/ajaxBusiness/loadCustInstitutionsList"
    Operate.getResponse(institutionsUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        _this.setState({
          institutions: list
        })
      }
    }, (value) => {})
    /*获取团体机构-组织*/
    let departmentsUrl = "/chealth/background/ajaxBusiness/loadCustDepartmentsList"
    Operate.getResponse(departmentsUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        _this.setState({
          departments: list
        })
      }
    }, (value) => {})
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
            item.push(<Option value={el.value} key={el.value}>{el.label}</Option>)
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
          return <Option value={el.value} key={el.value}>{el.label}</Option>
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
    data.certiId = e.target.value.trim();
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
    let clubberOrgData = {
      cusId: this.state.cusId,
      custPscId: value,
    }
    let psc = "";
    this.state.serviceList.map(el => {
      if(el.custPscId === value) {
        psc = el.cusId;
      }
    })
    this.setState({
      custPscId: value,
      psc: psc,
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
  //员工会员号
  staffCountChange (e) {
    let data = this.state.condition;
    data.staffNo = e.target.value.trim();
    this.setState({
      staffAccount: e.target.value,
      condition: data
    })
  }
  staffTypeChange (value) {
    this.setState({
      staffType: value
    })
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
                        return <Option value={el.custProjectId} key={el.custProjectId}>{el.projectName}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                   <FormItem
                    {...formItemLayout}
                    label="产品服务">                  
                      <Select value={this.state.custPscId} style={{ width: "100%" }} onChange={this.serviceChange.bind(this)}>
                        {this.state.serviceList.map(el => {
                          return <Option value={el.custPscId} key={el.custPscId}>{el.label}</Option>
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
                      <Option value="">全部</Option>
                      <Option value="02">激活</Option>
                      <Option value="01">未激活</Option>
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
                <FormItem
                  labelCol = {{ span: 6 }}
                  wrapperCol = {{ span: 14 }}
                  label="员工/会员号"
                  className="item-idCard">   
                  <InputGroup compact>
                    <Select value={this.state.staffType} onChange={this.staffTypeChange.bind(this)}>
                      <Option value="staff">员工号</Option>
                      <Option value="member">会员号</Option>
                    </Select>
                    <Input placeholder="请输入相关账号" style={{ width: '68%' }} onChange={this.staffCountChange.bind(this)} value={this.state.staffAccount}/>
                  </InputGroup> 
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className="group-search-operate">
            <span className="group-search-button">
              <Button type="primary" onClick={this.searchClick.bind(this)}>搜索</Button>
              <Button type="primary" onClick={this.clearClick.bind(this)}>条件清空</Button>
              <Button type="primary" onClick={this.addUserClick.bind(this)}>用户新增</Button>
              <Button type="primary" onClick={this.importClick.bind(this)}>用户导入</Button>
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
          title={this.state.detailData.name + "信息详情"}
          visible={this.state.detaiVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}>
          {this.getUserDetail()}
        </Modal>
        <Modal
          title={this.state.addEditTitle}
          visible={this.state.addEditVisible}
          onOk={this.addEdithandleOk.bind(this)}
          onCancel={this.handleCancel}
          width={800}
        >
          {this.getUserAddEdit()}
        </Modal>
        <Modal
          title={this.state.projectName + "的用户信息导入"}
          visible={this.state.importVisible}
          onOk={this.clubberHandleOk}
          onCancel={this.handleCancel}
          width={600}>
          <ClubberImport 
            type="clubber"
            projectList={this.state.projectData} 
            projectValue={this.state.projectValue}
            uploadUrl={uploadUrl}
            serviceList={this.state.serviceList}
            custPscId={this.state.custPscId}
            cusId={this.state.cusId}
            custPscIdPropsChange={this.serviceChange.bind(this)} />
        </Modal>
        <Modal
          title={"删除" + this.state.detailData.name + "用户信息，同时取消该用户所有的预约"}
          visible={this.state.clubberDeleteVisible}
          confirmLoading={this.state.deleteConfirmLoading}
          onOk={this.clubberDeletehandleOk.bind(this)}
          onCancel={this.handleCancel}
          width={1000}
        >
          <ClubberDelete detailData={this.state.detailData} getClubberOrderInfo={this.getClubberOrderInfo.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default Clubber = Form.create({
})(Clubber);
              // <Button type="primary" onClick={this.exportClick.bind(this)}>模板导出</Button>