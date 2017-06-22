import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import DataUtil from "../../utils/dataUtil"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
import Condition from "./condition"
import Operate from "./operate"
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

class OrgResImport extends Component {
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
      serviceList: [],
      custPscId: "",
      custProjectId: "",
      cusId: "",
      groupOrgTotal: 0,
      pageNumber: 1,
      projectName: "",
      groupOrgDetailList: [],     //机构详情
      groupOrgDetailTotal: 0,
      groupOrgDetailColumns: [],
      groupOrgPageNumber: 1,
      psc: ""
    }
    this.columns = ClubberDetail.getOrgImportItem(this)
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
        //产品服务
        let serviceData = {
          custProjectId : value.data[0].custProjectId,        // 项目ID
        }
        this.getServiceInfo(serviceData);
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
        if(service.data.list.length) {
          let list = service.data.list.map(el => {
            let serviceObject = DataUtil.getServiceObject(el.value)
            el.custPscId = serviceObject.custPscId;
            el.psc = serviceObject.psc;
            return el
          })
          let groupOrgData = {
            custProjectId : serviceData.custProjectId,        // 项目ID
            custPscId: list[0].custPscId,
            pageNumber: 1
          }
          let data = {
            cusId: cusId,
            custPscId: list[0].custPscId
          }
          this.commonsReq(groupOrgData, data)
          _this.setState({
            serviceList: list,
            custPscId: list[0].custPscId,
            psc: list[0].psc,
            condition: groupOrgData,
          })
        }
      }
    }, (service) => {})
  }

  commonsReq (groupOrgData, data) {
    //体检机构查询
    this.getGroupOrgInfo(groupOrgData)
    //服务集团
    this.getServiceGroup(data)
    //省
    this.getProvince(data)
  }

  /*获取集团机构表格信息*/
  getGroupOrgInfo (groupOrgData) {
    const _this = this;
    this.setState({
      tableLoading: true
    })
    groupOrgData.pageSize = 10;
    let groupOrgUrl = "/chealth/background/cusServiceOperation/hcuInstitutionCalendarEdit/searchData";
    Operate.getResponse(groupOrgUrl, groupOrgData, "POST", "html").then((value) => {
      if(value.success === "true") {
        _this.setState({
          data: value.data.rows,
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
          groupList: list
        })
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
      custProjectId: this.state.custProjectId,
      custPscId : record.custPscId,                 // 客户所购服务周期ID
      hospitalId : record.hcuInstitutionsId,         // 体检机构ID
      pageNumber: 1,
      pageSize: 8
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
    })
    this.getGroupOrgInfo(data);
    let serviceData = {
      custProjectId: value
    }
    this.getServiceInfo(serviceData, cusId);
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
      pageNumber: 1,
    }
    this.setState({
      groupValue: [],
      areaValue: [],
      custPscId: "",
      psc: "",
      custProjectId: this.state.projectData[0].custProjectId
    })
    this.getGroupOrgInfo(data)
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

  /*服务集团机构选择事件*/
  groupSelectChange (value) {
    let data = this.state.condition;
    if(value.length === 1) {
      data.hcuGroupId = value[0];
    }
    else {
      data.hcuGroupId = value[0];
      data.hospitalId = value[1];
    }
    this.getGroupOrgInfo(data);
    this.setState({
      groupValue: value
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
            groupList: groupList
          })
        }
      }, (value) => {})
    }
  }

  /*服务省、市选择事件*/
  areaSelectChange (value) {
    let data = this.state.condition;
    if(value.length === 1) {
      data.parplmId = value[0];
    }
    else {
      data.parplmId = value[0];
      data.cityId = value[1];
    }
    this.getGroupOrgInfo(data);
    this.setState({
      areaValue: value
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
    let data = {
      custProjectId: this.state.condition.custProjectId,
      custPscId: value
    }
    let psc = "";
    this.state.serviceList.forEach(el => {
      if(el.custPscId === value) {
        psc = el.psc;
      }
    })
    this.setState({
      custPscId: value,
      psc: psc,
      condition: data,
      groupValue: "",
      areaValue: "",
    })
    let commonsData = {
      cusId: this.state.cusId,
      custPscId: value
    }
    this.commonsReq(data, commonsData)
  }

  /*表格翻页事件*/
  groupOrgTableChange = (pagination, filters, sorter) => {
    let data = this.state.condition;
    data.pageNumber = pagination.current
    this.getGroupOrgInfo(data)
    this.setState({
      pageNumber: pagination.current
    })
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
                      value={this.state.custPscId} 
                      style={{ width: "100%" }} 
                      onChange={this.serviceChange.bind(this)}
                      placeholder="请选择产品服务">                 
                      {this.state.serviceList.map(el => {
                        return <Option value={el.custPscId}>{el.label}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>  
              <Col span={8}>
              </Col>
              <Col span={8}>
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
            <Table 
              loading={this.state.tableLoading} 
              columns={this.columns} 
              dataSource={this.state.data} 
              size="middle"
              onChange={this.groupOrgTableChange}
              pagination={{pageSize: 10, total: this.state.groupOrgTotal, size: "middle"}}  />
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
          <ClubberImport 
            type="org"
            projectList={this.state.projectData} 
            projectValue={this.state.custProjectId} 
            uploadUrl={uploadUrl}
            serviceList={this.state.serviceList}
            custPscId={this.state.custPscId}
            cusId={this.state.cusId}
            custPscIdPropsChange={this.serviceChange.bind(this)} />
        </Modal>
      </div>
    );
  }
}

export default OrgResImport = Form.create({
})(OrgResImport);