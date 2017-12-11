import React, { Component } from 'react'
import { Table, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker, message  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import DataUtil from "../../utils/dataUtil"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
import Condition from "./condition"
import Operate from "./operate"
import moment from 'moment';
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const firstFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}
const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

class OrgResChange extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
      condition: {},
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
      groups: [],
      groupList: [],
      institution: [],
      region: [],
      provinces: [],
      groupValue: [],
      tableLoading: false,
      areaList: [],
      areaValue: [],
      productList: [],
      productValue: "",
      custProjectId: "",
      cusId: "",
      custPscId: "",
      groupOrgTotal: 0,
      pageNumber: 1,
      projectName: "",
      groupOrgDetailList: [],     //机构详情
      groupOrgDetailTotal: 0,
      groupOrgDetailColumns: [],
      groupOrgPageNumber: 1,
      serviceList: [],
      serviceValue: "",
      reserveRangeDate: [],
      psc: "",
      pageSize: 10,
    }
    this.columns = ClubberDetail.getOrgResChangeItem(this)
  }

  componentWillMount () {
    const _this = this;
    this.setState({
      tableLoading: true
    })
    //后台用户信息接口
    UserInfo.getUserInfo();
    //项目接口
    let projectUrl = "/chealth/background/ajaxBusiness/loadCustProjectList";
    Operate.getResponse(projectUrl, "", "GET", "json").then((value) => {
      if(value.success === "true") {
        let orgUrl = "/chealth/background/cusServiceOperation/hcuInstitutionCalendarEdit/searchData";
        //产品服务
        let serviceData = {
          custProjectId : value.data[0].custProjectId,        // 项目ID
        }
        _this.getServiceInfo(serviceData, value.data[0].cusId);
        _this.setState({
          projectData: value.data,
          custProjectId: value.data[0].custProjectId,
          projectName: value.data[0].projectName,
          cusId: value.data[0].cusId,
        })
      }
    }, (value) => {})    
  }

  /*产品服务信息*/
  getServiceInfo (serviceData, cusId) {
    const _this = this;
    let serviceUrl = "/chealth/background/ajaxBusiness/loadCustPsc";
    Operate.getResponse(serviceUrl, serviceData, "POST", "html").then((service) => {
      if(service.success === "true") {
        let serviceObject = DataUtil.getServiceObject(service.data.list[0].value)
        //用户机构组织
        let data = {
          cusId: cusId,
          custPscId: serviceObject.custPscId
        }
        //服务集团
        _this.getServiceGroup(data)
        //省
        _this.getProvince(data)
        let GroupOrgInfoData = {
          custProjectId: serviceData.custProjectId,
          custPscId: serviceObject.custPscId,
          pageNumber: 1,
        }
        _this.getGroupOrgInfo(GroupOrgInfoData)
        _this.setState({
          serviceList: service.data.list,
          condition: GroupOrgInfoData,
          custPscId: serviceObject.custPscId,
          psc: serviceObject.psc,
          serviceValue: service.data.list[0].value
        })
      }
    }, (service) => {})
  }

  /*获取机构排期和名额表格信息*/
  getGroupOrgInfo (groupOrgData) {
    const _this = this;
    this.setState({
      tableLoading: true
    })
    groupOrgData.pageSize = groupOrgData.pageSize ? groupOrgData.pageSize : this.state.pageSize;
    let groupOrgUrl = "/chealth/background/cusServiceOperation/hcuInstitutionCalendarModify/searchData";
    Operate.getResponse(groupOrgUrl, groupOrgData, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        if(value.data.rows.length) {
          value.data.rows.forEach(el => {
            el.projectName = this.state.projectName;
            list.push(el)
          })
        }
        _this.setState({
          data: list,
          groupOrgTotal: value.data.total
        })
      }
      this.setState({
        tableLoading: false
      })
    }, (value) => {})
  }
  /*服务集团*/
  getServiceGroup (groupData) {
    const _this = this;
    let groupUrl = "/chealth/background/ajaxBusiness/loadCustHcuGrouptList";
    Operate.getResponse(groupUrl, groupData, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            el.isLeaf = false;
            list.push(el)
          }
        })
        _this.setState({
          groupList: list,
        })
        let data = {
          cusId: this.state.cusId,              
          custPscId: groupData.custPscId,               
        }
        if(list.length) {
          data.hcuGroupId = list[0].value;
        }
        this.getInstitutionsReq(data)
      }
    }, (value) => {})
  }
  /*获取省直辖市*/
  getProvince (provinceData) {
    const _this = this;
    let provinceUrl = "/chealth/background/ajaxBusiness/loadCustParplmList";
    Operate.getResponse(provinceUrl, provinceData, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            el.isLeaf = false;
            list.push(el)
          }
        })
        _this.setState({
          areaList: list
        })
      }
    }, (value) => {})
  }

  /*表格操作*/
  operateClick (record, index) {
    const _this = this;
    this.setState({
      detailData: record,
      detaiVisible: true
    })
    let groupOrgdetailData = {
      cusId : record.cusId,                         // 客户ID
      custPscId : record.custPscId,                 // 客户所购服务周期ID
      hospitalId : record.hcuInstitutionsId,         // 体检机构ID
      pageNumber: 1,
      pageSize: this.state.pageSize
    }
    this.getGroupOrgDetailReq(record, groupOrgdetailData)
  }

  /*服务机构详情请求*/
  getGroupOrgDetailReq (record, groupOrgdetailData) {
    const _this = this;
    let groupOrgdetailUrl = "/chealth/background/cusServiceOperation/hcuInstitutionCalendarModify/searchData";
    Operate.getResponse(groupOrgdetailUrl, groupOrgdetailData, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = value.data.rows.map(el => {
          el.projectName = record.projectName;
          return el
        })
        _this.setState({
          groupOrgDetailList: list,
          groupOrgDetailTotal: value.data.total,
          groupOrgDetailColumns: ClubberDetail.getGroupOrgDetailItem(),
          groupOrgdetailData: groupOrgdetailData
        })
      }
    }, (value) => {})
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
      custProjectId: value,
      cusId: cusId,
      projectName: projectName,
      condition: data,
    })
    let serviceData = {
      custProjectId: value
    }
    this.getServiceInfo(serviceData, cusId);
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
  /*服务机构详情*/
  getRecordDetail () {
    let item = "";
    let list = [];
    item = <div className="table-dialog-area">
      <Table 
        loading={this.state.tableLoading} 
        columns={this.state.groupOrgDetailColumns} 
        dataSource={this.state.groupOrgDetailList} 
        size="middle"
        onChange={this.groupOrgDetailTableChange}
        pagination={{pageSize: 10, total: this.state.groupOrgDetailTotal, size: "middle"}}  />
    </div>
    return item;
  }

  groupOrgDetailTableChange = (pagination, filters, sorter) => {
    let data = this.state.groupOrgdetailData;
    data.pageNumber = pagination.current;
    this.getGroupOrgDetailReq(this.state.detailData, data)
    this.setState({
      groupOrgPageNumber: pagination.current
    })
  }

  /*查询*/
  searchClick () {
    let data = this.state.condition;
    this.getGroupOrgInfo(data);
  }
  /*清空*/
  clearClick () {
    let data = {
      custProjectId: this.state.projectData[0].custProjectId,
    }
    this.setState({
      groupValue: [],
      areaValue: [],
      productValue: "",
      custPscId: "",
      psc: "",
      reserveRangeDate: [],
      serviceValue: "",
      custProjectId: this.state.projectData[0].custProjectId
    })
    this.getServiceInfo(data, this.state.cusId)
  }

  /*服务集团机构选择事件*/
  groupSelectChange (value) {
    let data = this.state.condition;
    if(value.length === 1) {
      data.hcuGroupId = value[0];
    }
    else if(value.length === 2){
      data.hcuGroupId = value[0];
      data.hospitalId = value[1];
    }
    else if(value.length === 0) {
      data.hcuGroupId = "";
      data.hospitalId = "";
    }
    this.getGroupOrgInfo(data);
    this.setState({
      groupValue: value,
      condition: data
    })
  }
  /*服务集团、机构级联事件*/
  groupLoadData = (selectedOptions) => {
    const _this = this;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if(selectedOptions.length === 1) {
      let institutionUrl = "/chealth/background/ajaxBusiness/loadCustHcuInstitutionsInGroup";
      let institutionData = {
        cusId: this.state.cusId,              
        custPscId: this.state.custPscId,               
        hcuGroupId: selectedOptions[0].value              
      }
      Operate.getResponse(institutionUrl, institutionData, "POST", "html").then((value) => {
        targetOption.loading = false;
        if(value.success === "true"){
          let list = [];
          value.data.list.forEach(el => {
            if(el.value) {
              list.push(el)
            }
          })
          let groupList = [];
          groupList = this.state.groupList.map(el => {
            if(el.value === selectedOptions[0].value) {
              el.children = list;
              el.isLeaf = list.length === 0 ? true : false;
            }
            return el;
          })
          _this.setState({
            groupList: groupList,
          })
        }
      }, (value) => {})
    }
  }

  /*机构获取*/
  getInstitutionsReq (institutionData) {
    const _this = this;
    let institutionUrl = "/chealth/background/ajaxBusiness/loadCustHcuInstitutionsInGroup";
    Operate.getResponse(institutionUrl, institutionData, "POST", "html").then((value) => {
      if(value.success === "true"){
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        let groupList = [];
        groupList = this.state.groupList;
        if(groupList.length) {
          groupList[0].children = list;
          groupList[0].isLeaf = list.length === 0 ? true : false;
          _this.setState({
            groupList: groupList,
          })
        }
        else {
          _this.setState({
            tableLoading: false,
          })
        }
      }
    }, (value) => {})
  }

  /*服务省、市选择事件*/
  areaSelectChange (value) {
    let data = this.state.condition;
    if(value.length === 1) {
      data.parplmId = value[0];
    }
    else if(value.length === 2){
      data.parplmId = value[0];
      data.cityId = value[1];
    }
    else if(value.length === 0) {
      data.parplmId = "";
      data.cityId = "";
    }
    this.getGroupOrgInfo(data);
    this.setState({
      areaValue: value,
      condition: data
    })
  }
  /*服务省、市级联事件*/
  areaLoadData = (selectedOptions) => {
    const _this = this;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if(selectedOptions.length === 1) {
      let cityUrl = "/chealth/background/ajaxBusiness/loadCustCityListInParplm";
      let cityData = {
        cusId: this.state.cusId,              
        custPscId: this.state.custPscId,               
        parplmId: selectedOptions[0].value              
      }
      Operate.getResponse(cityUrl, cityData, "POST", "html").then((value) => {
        targetOption.loading = false;
        if(value.success === "true"){
          let list = [];
          value.data.list.forEach(el => {
            if(el.value) {
              list.push(el)
            }
          })
          let areaList = [];
          areaList = this.state.areaList.map(el => {
            if(el.value === selectedOptions[0].value) {
              el.children = list;
              el.isLeaf = list.length === 0 ? true : false;
            }
            return el;
          })
          _this.setState({
            areaList: areaList
          })
        }
      }, (value) => {})
    }
  }

  /*产品服务事件*/
  serviceChange (value) {
    let data = this.state.condition;
    let serviceObject = DataUtil.getServiceObject(value);
    data.custPscId = serviceObject.custPscId;
    this.setState({
      custPscId: serviceObject.custPscId,
      psc: serviceObject.psc,
      serviceValue: value,
      condition: data
    })
    let reqData = {
      custProjectId: data.custProjectId,
      cusId: data.cusId,
      custPscId: serviceObject.custPscId,
      pageNumber: 1
    }
    this.getGroupOrgInfo(reqData);
    //用户机构组织
    let conditionData = {
      cusId: this.state.cusId,
      custPscId: serviceObject.custPscId
    }
    //服务集团
    this.getServiceGroup(conditionData)
    //省
    this.getProvince(conditionData)
  }

  /*表格翻页事件*/
  groupOrgTableChange = (pagination, filters, sorter) => {
    let data = this.state.condition;
    data.pageNumber = pagination.current
    this.getGroupOrgInfo(data)
    this.setState({
      pageNumber: pagination.current,
      condition: data
    })
  }

  /*机构日期标志修改*/
  dateFlagChange (record, index, value) {
    let data = this.state.data;
    data[index].groupHcuFlg = value;
    this.setState({
      data: data
    })
  }

  groupHcuFlgChange (record, index, e) {
    let data = this.state.data;
    data[index].groupHcuFlg = e.target.checked ? "1" : "0";
    this.setState({
      data: data
    })
  }

  /*已预约人数修改*/
  reservedChange (record, index, value) {
    let data = this.state.data;
    data[index].reserved = value; 
    this.setState({
      data: data
    })
  }

  /*预约名额修改*/
  reserveLimitChange (record, index, value) {
    let data = this.state.data;
    data[index].reserveLimit = value;
    this.setState({
      data: data
    })
  } 

  /*表格保存事件*/
  tableSaveClick () {
    const _this = this;
    let saveUrl = "/chealth/background/cusServiceOperation/hcuInstitutionCalendarModify/saveEdit";
    // let itemData = this.state.data;
    // itemData.groupHcuFlg = itemData.groupHcuFlg.toString();
    let jsonList = JSON.stringify(this.state.data);
    let saveData = {
      jsonList: jsonList
    }
    Operate.getResponse(saveUrl, saveData, "POST", "html").then((value) => {
      if(value.success === "true") {
        message.success("修改保存成功！");
        _this.getGroupOrgInfo(this.state.condition);
      }
      else {
        if(value.errors && value.errors.length !== 0 && value.errors[0].errorMessage) {
          message.error(value.errors[0].errorMessage)
        }
        else {
          message.error("修改保存失败！")
        }
      }
    }, (value) => {})
  }

  reserveDateChange (date, dateString) {
    let data = this.state.condition;
    if(dateString[0] && dateString[1]) {
      data.calendarYmdFrom =  moment(dateString[0]).format("YYYYMMDD");
      data.calendarYmdTo =  moment(dateString[1]).format("YYYYMMDD");
      this.getGroupOrgInfo(data);
    }
    this.setState({
      condition: data,
      reserveRangeDate: date
    })
  }

  onShowSizeChange(current, pageSize) {
    this.setState({
      pageSize: pageSize
    })
    let data = this.state.condition;
    data.pageSize = pageSize;
    this.getGroupOrgInfo(data);
  }

  render() {
    let uploadUrl = "/chealth/background/cusServiceOperation/hcuInstitutionCalendarEdit/inputHcuInstitutionsCalendarData";
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...firstFormItemLayout}
                    label="项目名称">
                    <Select value={this.state.custProjectId} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                      {this.state.projectData.map(el => {
                        return <Option value={el.custProjectId}>{el.projectName}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="集团/机构">
                    <Cascader 
                      placeholder="请选择集团、机构" 
                      style={{width: "100%"}} 
                      value={this.state.groupValue} 
                      options={this.state.groupList} 
                      loadData={this.groupLoadData} 
                      onChange={this.groupSelectChange.bind(this)} 
                      changeOnSelect />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="省/市">   
                    <Cascader 
                      placeholder="请选择服务省、市" 
                      style={{width: "100%"}} 
                      value={this.state.areaValue} 
                      options={this.state.areaList} 
                      loadData={this.areaLoadData} 
                      onChange={this.areaSelectChange.bind(this)} 
                      changeOnSelect />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={8}>
                <FormItem
                  {...firstFormItemLayout}
                  label="产品服务"> 
                  <Select 
                    placeholder="请选择产品服务"
                    value={this.state.serviceValue} 
                    style={{ width: "100%" }} 
                    onChange={this.serviceChange.bind(this)}>                 
                    {this.state.serviceList.map(el => {
                      return <Option value={el.value}>{el.label}</Option>
                    })}
                  </Select>
                </FormItem>
              </Col>  
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="日期"> 
                  <RangePicker onChange={this.reserveDateChange.bind(this)} value={this.state.reserveRangeDate} />
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
              loading={this.state.tableLoading} 
              columns={this.columns} 
              dataSource={this.state.data} 
              size="middle"
              onChange={this.groupOrgTableChange}
              pagination={{ total: this.state.groupOrgTotal, size: "middle", showSizeChanger: true, onShowSizeChange: this.onShowSizeChange.bind(this)}}  />
              <div className="table-operate-save">
                <Button type="primary" onClick={this.tableSaveClick.bind(this)}>保存</Button>
              </div>
          </div>
        </div>
        <Modal
          title={this.state.detailData.institutionsName + "名额排期详情"}
          visible={this.state.detaiVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
        >
          {this.getRecordDetail()}
        </Modal>
        <Modal
          title={this.state.projectName + "的服务机构排期和名额导入"}
          visible={this.state.importVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}>
          <ClubberImport projectList={this.state.projectData} projectValue={this.state.custProjectId} uploadUrl={uploadUrl} />
        </Modal>
      </div>
    );
  }
}

export default OrgResChange = Form.create({
})(OrgResChange);