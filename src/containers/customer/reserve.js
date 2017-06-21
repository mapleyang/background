import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker, message  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
import ReserveExport from "./reserveExport"
import Operate from "./operate"
import DataUtil from "../../utils/dataUtil"
import Condition from "./condition"
import moment from 'moment'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const formItemLayoutFirstCell = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const modalItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

class Reserve extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
      consition: {},         //条件
      cusId: "",            //项目ID
      custPscId: "",
      detailVisible: false,
      exportVisible: false,
      detailData: {},
      editData: {},
      loginAccount: "",
      accountStatus: "00",
      mobile: "",
      projectData: [],
      custProjectId: "",
      reserveVisible: false,
      operateType: "",
      pageNumber: 0,
      hcuReserveFlg: "1",
      idCardType: [],
      cardType: "",
      cardID: "",      //输入证件号
      reserveTotal: 0,
      pageNumber: 0,
      tableLoading: false,
      orgSelectValue: [],
      orgList: [],
      serviceList: [],
      serviceValue: "",
      psc: "",
      area: [],   //服务地区
      institutionOptions: [],    //服务机构
      hcuPackageId: "",          //套餐ID
      packageInfo: "",            //主套餐下属套餐
      package_name: "",           //主套餐名称
      packageList: [],            //主套餐下拉列表
      addFreeHcuItemDtoList: "",
      addPayHcuItemDtoList: "",
      addFreeHcuPackageDtoList: "",
      addPayHcuPackageDtoList: "",
    }
    this.columns = ClubberDetail.getReserveItem(this)
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
      _this.setState({
        projectData: value.data,
        cusId: value.data[0].cusId,
        custProjectId: value.data[0].custProjectId
      })
      //产品服务
      let serviceData = {
        custProjectId: value.data[0].custProjectId,
      }
      _this.getServiceInfo(serviceData, value.data[0].cusId)
    }, (value) => {
    })
    //身份证类型
    this.getIdCardType();
  }
  //身份证类型
  getIdCardType () {
    const _this = this;
    let idCardTypeUrl = "/chealth/background/ajaxBusiness/loadCertiTypeList";
    let idCardTypeData = {};
    Operate.getResponse(idCardTypeUrl, idCardTypeData, "POST", "html").then((value) => {
      if(value.success) {
        let list = [];
        if(value.data.list.length) {
          value.data.list.forEach(el => {
            if(el.value) {
              list.push(el)
            }
          })
          _this.setState({
            idCardType: list
          })
          let initInfo = {
            staffCertiType: list[0].value,
          }
          _this.props.form.setFieldsValue(initInfo)
        }
      }
    }, (value) => {})
  }

  /*产品服务信息*/
  getServiceInfo (serviceData, cusId) {
    const _this = this;
    let serviceUrl = "/chealth/background/ajaxBusiness/loadCustPsc";
    Operate.getResponse(serviceUrl, serviceData, "POST", "html").then((service) => {
      if(service.success) {
        //预约信息查询
        let serviceObject = DataUtil.getServiceObject(service.data.list[0].value)
        let orderData = {
          cusId: cusId,     
          custPscId: serviceObject.custPscId,     
          hcuReserveFlg: this.state.hcuReserveFlg,
          pageNumber: 1,
        };
        _this.getOrderInfo(orderData);
        //用户机构组织
        let clubberOrgData = {
          cusId: cusId,
          custPscId: serviceObject.custPscId
        }
        _this.setState({
          serviceList: service.data.list,
          custPscId: serviceObject.custPscId,
          psc: serviceObject.psc,
          condition: orderData,
          serviceValue: service.data.list[0].value,
        })
        _this.getOrgInfo(clubberOrgData);
      }
    }, (service) => {})
  }

  /*获取预约信息*/
  getOrderInfo (orderData) {
    const _this = this;
    this.setState({
      tableLoading: true
    })
    let orderUrl = "/chealth/background/cusServiceOperation/hcuReserve/searchData";
    orderData.pageSize = 10;
    Operate.getResponse(orderUrl, orderData, "POST", "html").then((order) => {
      if(order.success) {
        _this.setState({
          data: order.data.rows,
          reserveTotal: order.data.total
        })
      }
      _this.setState({
        tableLoading: false
      })
    }, (order) => {
    })
  }

  getOrgInfo (data) {
    const _this = this;
    let clubberOrgUrl = "/chealth/background/ajaxBusiness/loadCustInstitutionsList";
    Operate.getResponse(clubberOrgUrl, data, "POST", "html").then((value) => {
      if(value.success) {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            el.isLeaf = false;
            list.push(el)
          }
        })
        _this.setState({
          orgList: list
        })
      }
    }, (value) => {})
  }

  /*表格操作*/
  operateClick (flag, record, index) {
    const _this = this;
    if(flag === "detail") {
      this.setState({
        detailVisible: true,
        detailData: record
      })
    }
    else if(flag === "reserve"){
      this.setState({
        reserveVisible: true,
        detailData: record,
      })
      let packageData = {
        cusId: this.state.cusId,
        custPscId: this.state.custPscId,
        recordId: 0,            
        relRecordId: 0,         
        memberId: record.memberId,    
        refHcuPackageId: 0,
        psc: this.state.psc      
      }
      this.getPackageList(packageData);
      let data = {
        cusId: this.state.cusId,
        custPscId: this.state.custPscId 
      }
      this.getProvinceList(data);
      setTimeout(function () {
        let initInfo = {
          staffMemberName: "",
          staffMemberNo: "",
          staffSex: "1",
          staffMarital: "2",
          hcuPackageId: "",
          staffCertiId: "",
          staffMobile: "",
          staffEmail: "",
          staffBirthday: "",
          appointServiceTime: "",
          areaValue: [],
          hcuInstitutionId: "",
        }
        _this.props.form.setFieldsValue(initInfo)
      }, 100)
    }
    else if (flag === "change") {
      this.setState({
        reserveVisible: true,
        detailData: record,
      })
      let data = {
        cusId: record.cusId,
        custPscId: record.custPscId 
      }
      this.getProvinceList(data);
      let initInfo = {
        areaValue: [],
        hcuInstitutionId: "",
        appointServiceTime:  moment(record.appointServiceDate, 'YYYY-MM-DD'),
      }
      this.props.form.setFieldsValue(initInfo);
    }
    else if(flag === "cancel"){
      Modal.confirm({
        title: "确定取消订单号为" + record.grouprecordId + "的订单",
        content: '',
        onOk() {
          let url = "/chealth/background/cusServiceOperation/hcuReserve/cancelOrder";
          let data = {
            purchaseOrderId: record.grouprecordId,      //订单ID
            cusId: record.cusId,             //客户ID
            custPscId: record.custPscId,         //团体客户所购服务周期Id
            psc: record.psc,             //客户所购服务
            orderStep: record.orderStep,          //订单步骤
            handelKbn: record.handleKbn          //执行区分          
          }
          return Operate.getResponse(url, data, "POST", "html").then(function(value){
            if(value.success) {
              message.success(record.grouprecordId + "订单删除成功");
            }
            else {
              message.error(record.grouprecordId + "订单删除失败，请重试！");
            }
          },function(value) {
              message.error(record.grouprecordId + "订单删除失败，请重试！");
          })
        },
        onCancel() {
        },
      });
    }
    this.setState({
      operateType: flag
    })
  }

  /*获取省市*/
  getProvinceList (provinceData) {
    const _this = this;
    let provinceUrl = "/chealth/background/ajaxBusiness/loadCustParplmList"
    Operate.getResponse(provinceUrl, provinceData, "POST", "html").then((value) => {
      if(value.success) {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            el.isLeaf = false;
            list.push(el)
          }
        })
        _this.setState({
          area: list
        })
        if(this.state.operateType === "change") {
          provinceData.parplmId = this.state.detailData.parplmId;
        }
        else {
          provinceData.parplmId = list[0].value;
        }
        _this.getCityList(provinceData)
      }
    }, (value) => {})
  } 

  /*获取城市*/
  getCityList (data) {
    const _this = this;
    let cityUrl = "/chealth/background/ajaxBusiness/loadCustCityListInParplm";
    Operate.getResponse(cityUrl, data, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.map(el => {
          if(el.value) {
            list.push(el)
          }
        })
        let area = _this.state.area.map(el => {
          if(el.value === data.parplmId.toString()) {
            el.children = list;
            el.isLeaf = true;
          }
          return el
        })
        _this.setState({
          area: area
        })
        let institutionData = {
          cusId: _this.state.cusId,
          custPscId: _this.state.custPscId,
          memberId: this.state.detailData.memberId,                                                     //会员Id
          psc: this.state.detailData.psc,
        }
        let initInfo = {}
        if(_this.state.hcuReserveFlg === "1") {   //已经预约
          //服务机构下拉框
          initInfo.areaValue = [_this.state.detailData.parplmId.toString(), _this.state.detailData.cityId.toString()]
          institutionData.hcuPackageId = _this.state.detailData.hcuPackageId;
          institutionData.ParplmId = data.parplmId;
          institutionData.CityId = _this.state.detailData.cityId;
          _this.getInstitutionOptions(institutionData);
        }
        else {
          //服务机构下拉框
          initInfo.areaValue = [data.parplmId.toString(), list[0].value.toString()]
          institutionData.hcuPackageId = _this.state.hcuPackageId;
          institutionData.ParplmId = data.parplmId;
          institutionData.CityId = list[0].value;
          _this.getInstitutionOptions(institutionData);
        }
        _this.props.form.setFieldsValue(initInfo);
      } 
    }, (value) => {});
  }

  areaLoadData = (selectedOptions) => {
    const _this = this;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let data = {
      cusId: this.state.cusId,
      custPscId: this.state.custPscId
    }
    if(selectedOptions.length === 1) {   //获取市数据
      data.parplmId = selectedOptions[0].value;
      let cityUrl = "/chealth/background/ajaxBusiness/loadCustCityListInParplm";
      Operate.getResponse(cityUrl, data, "POST", "html").then((value) => {
        targetOption.loading = false;
        if(value.success) {
          let list = [];
          value.data.list.map(el => {
            if(el.value) {
              list.push(el)
            }
          })
          let area = [];
          area = _this.state.area.map(el => {
            if(el.value === selectedOptions[0].value) {
              el.children = list;
              el.isLeaf = true;
            }
            return el
          })
          _this.setState({
            area: area
          })
        } 
      }, (value) => {});
    }
    else {
      data.parplmId = selectedOptions[selectedOptions.length - 1].value;
      let countyUrl = "/chealth/background/ajaxBusiness/loadCustCityListInParplm"
      Operate.getResponse(countyUrl, data, "POST", "html").then((value) => {
        if(value.success) {

        }
      }, (value) => {});
    }
  }

  /*套餐详情查看*/
  packageDetailClick () {
    this.setState({
      packageVisible: true
    })
  }

  packageDescClick (text, record, index) {
    let packageInfoData = {
      cusId: this.state.cusId,             
      custPscId: this.state.custPscId,           
      hcuPackageId: record.hcuPackageId         
    }
    this.getPackageInfo(packageInfoData);
    this.setState({
      packageVisible: true
    })
  }

  /*项目更改*/
  projectChange (value) {
    let cusId = this.state.cusId;
    let orderData = this.state.condition;
    this.state.projectData.forEach(el => {
      if(el.custProjectId === value) {
        cusId = el.cusId;
      }
    })
    orderData.cusId = cusId;
    this.setState({
      cusId: cusId,
      custProjectId: value,
      condition: orderData
    })
    let serviceData = {
      custProjectId: value
    }
    this.getServiceInfo(serviceData, cusId);
    this.getOrderInfo(orderData);
  }

  /*模态框*/
  reservehandleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          appointServiceTime: moment(values.appointServiceTime._i).format("YYYYMMDD"),
          hcuInstitutionId: values.hcuInstitutionId
        }
        if(this.state.operateType === "change") {
          data.grouprecordId = this.state.detailData.grouprecordId
        }
        else {
          let date = new Date(values.staffBirthday);
          data.staffBirthdayDayY = date.getFullYear();
          data.staffBirthdayDayM = date.getMonth() + 1;
          data.staffBirthdayDayD = date.getDate();
          data.cusId = this.state.cusId;
          data.custPscId = this.state.custPscId;
          data.psc = this.state.psc;
          data.staffMemberId = this.state.detailData.memberId;
          data.staffMemberNo = values.staffMemberNo;
          data.staffMemberName = values.staffMemberName;
          data.staffSex = values.staffSex;
          data.hcuPackageId = values.hcuPackageId;
          data.staffCertiType = values.staffCertiType;
          data.staffCertiId = values.staffCertiId;
          data.staffMobile = values.staffMobile;
          data.staffEmail = values.staffEmail;
          if(this.state.addFreeHcuItemDtoList.length) {
            data.addFreeHcuItemDtoList = this.state.addFreeHcuItemDtoList;        
          }
          if(this.state.addPayHcuItemDtoList.length) {
            data.addPayHcuItemDtoList = this.state.addPayHcuItemDtoList;          
          }
          if(this.state.addFreeHcuPackageDtoList.length) {
            data.addFreeHcuPackageDtoList = this.state.addFreeHcuPackageDtoList;    
          }
          if(this.state.addPayHcuPackageDtoList.length) {
            data.addPayHcuPackageDtoList = this.state.addPayHcuPackageDtoList;
          }
        }
        this.reserveFormFuc(data);
      }
    });
  }

  reserveHandleCancel = (e) => {
    this.setState({
      reserveVisible: false
    })
  }

  /*导出确定*/
  exportHandleOk = (e) => {
    this.setState({
      exportVisible: false
    })
  }

  exportHandleCancel = (e) => {
    this.setState({
      exportVisible: false
    })
  }

  packageHandleOk = (e) => {
    this.setState({
      packageVisible: false
    })
  }

  packageHandleCancel = (e) => {
    this.setState({
      packageVisible: false
    })
  }

  detailHandleOk = (e) => {
    this.setState({
      detailVisible: false,
    });
  }

  detailHandleCancel = (e) => {
    this.setState({
      detailVisible: false,
    });
  }
  /*用户信息详情*/
  getOrderDetail () {
    let item = "";
    let list = ClubberDetail.getDetailElement(ClubberDetail.orderDetail(this.state.detailData))
    item = <div className="table-dialog-area">
      {list}
    </div>
    return item;
  }

  /*查询*/
  searchClick () {
    let orderData = this.state.condition
    if(this.state.mobile !== "") {
      orderData.mobile = this.state.mobile;
    }
    if(this.state.loginAccount !== "") {
      orderData.loginAccount = this.state.loginAccount;
    }
    if(this.state.cardID !== "") {
      orderData.cardID = this.state.cardID;
    }
    this.getOrderInfo(orderData);
  }
  /*清空*/
  clearClick () {
    this.setState({
      accountStatus: "00",
      loginAccount: "",
      mobile: "",
      orgSelectValue: [],
      cusId: this.state.projectData[0].cusId,
      hcuReserveFlg: "",
      custPscId: "",
      psc: "",
      cardID: "",
      serviceValue: "",
      hcuReserveFlg: "1",
      custProjectId: this.state.projectData[0].custProjectId,
      pageNumber: 1
    })
    let serviceData = {
      custProjectId: this.state.projectData[0].custProjectId,
    }
    this.getServiceInfo(serviceData, this.state.projectData[0].cusId);
    let orderData = {
      cusId: this.state.projectData[0].cusId,
      pageNumber: 1
    } 
    this.getOrderInfo(orderData);
  }
  /*导出*/
  exportClick () {
    this.setState({
      exportVisible: true
    })
  }
  /*登陆账号更改*/
  countLoginChange = (e) => {
    this.setState({
      loginAccount: e.target.value.trim()
    })
  }

  /*搜索条件-手机事件*/
  mobileChange = (e) => {
    this.setState({
      mobile: e.target.value.trim()
    })
  }

  /*预约状态*/
  hcuReserveFlgChange = (e) => {
    let orderData = this.state.condition;
    if(e.target.value !== "") {
      orderData.hcuReserveFlg = e.target.value;
      this.getOrderInfo(orderData);
    }
    this.setState({
      hcuReserveFlg: e.target.value,
      condition: orderData
    })
  }

  /*订单日期修改*/
  orderChange = (e) => {
    let dayFrom = new Date(e[0]._d);
    let dayTo = new Date(e[1]._d);
    let orderData = {
      cusId: 1,             
      pageNumber: 0,
      orderDayFrom: dayFrom.getFullYear() + "-" + (dayFrom.getMonth() + 1) + "-" + dayFrom.getDate(),
      orderDayTo: dayTo.getFullYear() + "-" + (dayTo.getMonth() + 1) + "-" + dayTo.getDate()
    }
    this.getOrderInfo(orderData);
  }

  /*预约日期修改*/
  reserveDateChange = (e) => {
    let dayFrom = new Date(e[0]._d);
    let dayTo = new Date(e[1]._d);
    let orderData = {
      cusId: 1,             
      pageNumber: 0,
      appointServiceDayFrom: dayFrom.getFullYear() + "-" + (dayFrom.getMonth() + 1) + "-" + dayFrom.getDate(),
      appointServiceDayTo: dayTo.getFullYear() + "-" + (dayTo.getMonth() + 1) + "-" + dayTo.getDate()
    }
    this.getOrderInfo(orderData);
  }

  /*身份证类型*/
  idCardTypeChange (value) {
    let orderData = {
      cusId: 1,             
      pageNumber: 0,
      cardType: value === "all" ? "" : value
    }
    this.setState({
      cardType: value,
    })
    this.getOrderInfo(orderData)
  }

  reserveTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
    this.setState({
      pageNumber: pagination.current
    })
    let orderData = this.state.condition;
    orderData.pageNumber = pagination.current,
    this.getOrderInfo(orderData)
  }

  reserveFormFuc (data) {
    this.setState({
      reserveVisible: false,
    })
    if(this.state.operateType === "change") {
      let reserveChangeUrl = "/chealth/background/cusServiceOperation/hcuReserve/saveModifyOrderInfo";
      let reserveChangeData = data;
      Operate.getResponse(reserveChangeUrl, reserveChangeData, "POST", "html").then((value) => {
        if(value.success === "true") {
          message.success(this.state.detailData.grouprecordId + "订单改约成功！");
          let orderData = _this.state.condition;
          _this.getOrderInfo(orderData);
        }
        else {
          message.error(this.state.detailData.grouprecordId + "订单改约失败！");
        }
      }, (value) => {})
    }
    else {
      let changeUrl = "/chealth/background/cusServiceOperation/hcuReserve/createHcuReserveOrder";
      Operate.getResponse(changeUrl, data, "POST", "html").then((value) => {
        if(value.success === "true") {
          message.success("预约成功！");
          let orderData = _this.state.condition;
          _this.getOrderInfo(orderData);
        }
        else {
          message.error("预约失败！");
        }
      }, (value) => {})
    }
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
    this.getOrderInfo(data);
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
        if(value.success){
          let list = [];
          value.data.list.forEach(el => {
            if(el.value) {
              list.push(el)
            }
          })
          let orgList = [];
          orgList = this.state.orgList.map(el => {
            if(el.value === selectedOptions[0].value) {
              el.children = list;
              el.isLeaf = list.length === 0 ? true : false;
            }
            return el;
          })
          _this.setState({
            orgList: orgList
          })
        }
      }, (value) => {})
    }
  }

  /*产品服务选择事件*/
  serviceChange (value) {
    let data = this.state.condition;
    let serviceObject = DataUtil.getServiceObject(value)
    data.custPscId = serviceObject.custPscId;
    data.cusInstitutionId = "";
    data.cusDepartmentId = "";
    let clubberOrgData = {
      cusId: this.state.cusId,
      custPscId: serviceObject.custPscId,
    }
    this.setState({
      custPscId: serviceObject.custPscId,
      psc: serviceObject.psc,
      condition: data,
      orgSelectValue: [],
      serviceValue: value,
    })
    this.getOrderInfo(data);
    this.getOrgInfo(clubberOrgData);
  }

  getComboItem () {
    let item = "";
    let packageColumns = ClubberDetail.getExtraPackage();
    let projectColumns = ClubberDetail.getExtraProject();
     const package_freePackageRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let addFreeHcuPackageDtoList = "";
        selectedRows.forEach((el, index) => {
          if(index === selectedRows.length - 1) {
            addFreeHcuPackageDtoList += el.id;
          }
          else {
            addFreeHcuPackageDtoList += el.id + "/";
          }
        })
        this.setState({
          addFreeHcuPackageDtoList: addFreeHcuPackageDtoList
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };
    const package_freeHcuRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let addFreeHcuItemDtoList = "";
        selectedRows.forEach((el, index) => {
          if(index === selectedRows.length - 1) {
            addFreeHcuItemDtoList += el.id;
          }
          else {
            addFreeHcuItemDtoList += el.id + "/";
          }
        })
        this.setState({
          addFreeHcuItemDtoList: addFreeHcuItemDtoList
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };
    const package_payPackageRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let addPayHcuPackageDtoList = "";
        selectedRows.forEach((el, index) => {
          if(index === selectedRows.length - 1) {
            addPayHcuPackageDtoList += el.id;
          }
          else {
            addPayHcuPackageDtoList += el.id + "/";
          }
        })
        this.setState({
          addPayHcuPackageDtoList: addPayHcuPackageDtoList
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };
    const package_payHcuRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let addPayHcuItemDtoList = "";
        selectedRows.forEach((el, index) => {
          if(index === selectedRows.length - 1) {
            addPayHcuItemDtoList += el.id;
          }
          else {
            addPayHcuItemDtoList += el.id + "/";
          }
        })
        this.setState({
          addPayHcuItemDtoList: addPayHcuItemDtoList
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };
    let list = [];
    if(this.state.packageInfo) {
      if(this.state.packageInfo.package_freePackage.length) {   //免费体检套餐
        let ele = <div>
          <div><span>免费体检套餐</span></div>
          <Table rowSelection={package_freePackageRowSelection} columns={packageColumns} dataSource={this.state.packageInfo.package_freePackage} size="middle" />
        </div>
        list.push(ele)
      }
      if(this.state.packageInfo.package_freeHcu.length) {  //免费可选项目
        let ele = <div>
          <div><span>免费可选项目</span></div>
          <Table rowSelection={package_freeHcuRowSelection} columns={projectColumns} dataSource={this.state.packageInfo.package_freeHcu} size="middle" />
        </div>
        list.push(ele)
      }
      if(this.state.packageInfo.package_payPackage.length) {  //自费体检套餐
        let ele = <div>
          <div><span>自费体检套餐</span></div>
          <Table rowSelection={package_payPackageRowSelection} columns={projectColumns} dataSource={this.state.packageInfo.package_payPackage} size="small" />
        </div>
        list.push(ele)
      }
      if(this.state.packageInfo.package_payHcu.length){  //自费可选项目
        let ele = <div>
          <div><span>自费可选项目</span></div>
          <Table rowSelection={package_payHcuRowSelection} columns={packageColumns} dataSource={this.state.packageInfo.package_payHcu} size="small" />
        </div>
        list.push(ele)
      }
      item = <div>
        {list}
      </div>
    }
    return item;
  }

  getDialogItem () {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('staffCertiType')(
      <Select style={{ width: 80 }}>
        {this.state.idCardType.map(el => {
          return <Option value={el.value}>{el.label}</Option>
        })}
      </Select>
    );
    let item = "";
    if(this.state.operateType === "reserve") {
      item = <div>
        <div><span>用户信息</span></div>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="用户姓名"
              hasFeedback>     
              {getFieldDecorator('staffMemberName', {
                rules: [{ required: true }],
              })(             
                <Input placeholder="请输入用户姓名"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="员工/会员号"
              hasFeedback>     
              {getFieldDecorator('staffMemberNo', {
                  rules: [{ required: true }],
                })(             
                <Input placeholder="请输入员工号或会员号"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户性别"
                hasFeedback>     
                {getFieldDecorator('staffSex', {
                  rules: [{ required: true }],
                })(              
                  <Select>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                  </Select>     
                )}
              </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="婚姻状况"
                hasFeedback>    
                  {getFieldDecorator('staffMarital', {
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
                label="出生年月"
                hasFeedback>     
                {getFieldDecorator('staffBirthday', {
                rules: [{ required: true }],
                })(              
                  <DatePicker style={{ width: '100%' }}/>    
                )}
              </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="身份证件号"
              hasFeedback>    
              {getFieldDecorator('staffCertiId', {
                rules: [{ required: true }],
              })(
                <Input placeholder="请输入证件号" addonBefore={prefixSelector} style={{ width: '100%' }} />
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
              {getFieldDecorator('staffMobile', {
                rules: [{ required: true }],
              })(              
                <Input placeholder="请输入用户手机"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="用户邮箱"
              hasFeedback>    
              {getFieldDecorator('staffEmail', {
                rules: [{ required: true }],
              })(
                <Input placeholder="请输入用户邮箱"/>
              )} 
            </FormItem>
          </Col>
        </Row>
        <div><span>选择服务套餐</span></div>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="服务套餐"
              hasFeedback>     
              {getFieldDecorator('hcuPackageId', {
                  rules: [{ required: true }],
                })(            
                <Select style={{ width: "100%" }} onChange={this.packageChange.bind(this)}>
                  {this.state.packageList.map(el => {
                    return <Option value={el.value}>{el.label}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="套餐说明">                  
                <span><a onClick={this.packageDetailClick.bind(this)}>查看详情</a></span>
            </FormItem>
          </Col>
        </Row>
        {this.getComboItem()}
      </div>
    }
    return item
  }

  packageChange (value) {
    this.setState({
      hcuPackageId: value,
      areaValue: [],
      institutionValue: "",
      appointServiceDate: ""
    })
    let paackageInfoData = {
      cusId: this.state.cusId,             
      custPscId: this.state.custPscId,           
      hcuPackageId: value      
    }
    this.getPackageInfo(paackageInfoData);
    //省
    let data = {
      cusId: this.state.cusId,
      custPscId: this.state.custPscId 
    }
    this.getProvinceList(data);
  }

  /*获取套餐*/
  getPackageList (packageData) {
    const _this = this;
    let packageUrl = "/chealth/background/cusServiceOperation/hcuReserve/loadCusHcuPackageList";
    Operate.getResponse(packageUrl, packageData, "POST", "html").then((value) => {
      if(value.success === "true") {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        if(list.length) {
          let initInfo = {
            hcuPackageId: list[0].value,
          }
          _this.props.form.setFieldsValue(initInfo)
          let packageInfoData = {
            cusId: this.state.cusId,             
            custPscId: this.state.custPscId,           
            hcuPackageId: list[0].value         
          }
          _this.getPackageInfo(packageInfoData);
          _this.setState({
            packageList: list,
            hcuPackageId: list[0].value
          })
        }
      }
    }, (value) => {})
  }

  /*获取附属套餐*/
  getPackageInfo (packageInfoData) {
    const _this = this;
    let extraUrl = "/chealth/background/cusServiceOperation/hcuReserve/loadHcuPackage";
    Operate.getResponse(extraUrl, packageInfoData, "POST", "html").then((value) => {
      if(value.success === "true") {
        _this.setState({
          packageInfo: value.data,
          package_name: value.data.package_name === undefined ? "" : value.data.package_name
        })
      }
    }, (value) => {})
  }

  onAreaChange = (value, selectedOptions) => {
    const _this = this;
    //服务机构下拉框
    let institutionData = {
      cusId: this.state.cusId,
      custPscId: this.state.custPscId,
      hcuPackageId: this.state.hcuPackageId,                //体检套餐Id
      memberId: this.state.detailData.memberId,                                                     //会员Id
      ParplmId: value[0],    
      psc: this.state.psc     
    }
    if(value.length === 2) {
      institutionData.CityId = value[1];
    }
    if(value.length > 1) {
      this.getInstitutionOptions(institutionData);
    }
  }

  /*获取默认机构下拉下拉*/
  getInstitutionOptions (institutionData) {
    const _this = this;
    let institutionUrl = "/chealth/background/cusServiceOperation/hcuReserve/loadCusHcuInstitutionList";
    Operate.getResponse(institutionUrl, institutionData, "POST", "html").then((value) => {
      if(value.success) {
        if(value.data.list.length) {
          let state = {
            institutionOptions: value.data.list
          }
          let initInfo = {}
          if(this.state.operateType === "change") {
            initInfo.hcuInstitutionId = _this.state.detailData.hcuInstitutionsId.toString();
            _this.getInstitutionDate(_this.state.detailData.hcuInstitutionsId);
          }
          else {
            initInfo.hcuInstitutionId =  value.data.list[0].value;
            state.institutionValue = value.data.list[0].value;
            _this.getInstitutionDate(value.data.list[0].value)
          }
          _this.props.form.setFieldsValue(initInfo)
          _this.setState(state)
        }
      }
    }, (value) => {})
  }

  institutionChange = (value) => {
    const _this = this;
    //获取体检机构详细信息
    let data = {
      cusId: this.state.cusId,             
      custPscId: this.state.custPscId,         
      hcuInstitutionId: value
    }
    this.setState({
      institutionValue: value
    })
    let institutionDetailUrl = "/chealth/background/cusServiceOperation/hcuReserve/loadCusHcuInstitutionInfo";
    Operate.getResponse(institutionDetailUrl, data, "POST", "html").then((institution) => {
      if(institution.success) {
        _this.setState({
          institutionInfo: institution.data
        })
      }
    }, (institution) => {})
    //获取预约日期
    this.getInstitutionDate(value)
  }

  //获取机构预约日期
  getInstitutionDate (hcuInstitutionId) {
    const _this = this;
    let data = {
      cusId: this.state.cusId,             
      custPscId: this.state.custPscId,         
      hcuInstitutionId: hcuInstitutionId
    }
    let reserveDateUrl = "/chealth/background/cusServiceOperation/hcuReserve/loadCusHcuInstitutionPermissionDate";
    Operate.getResponse(reserveDateUrl, data, "POST", "html").then((value) => {
      if(value.success) {
        if(value.data.list.length) {
          _this.setState({
            reserveDateList: value.data.list
          })
          if(_this.state.operateType === "change") {
            let initInfo = {
              appointServiceTime: moment(_this.state.detailData.appointServiceDate, 'YYYY-MM-DD'),
            }
            _this.props.form.setFieldsValue(initInfo);
          }
        }
      }
    }, (value) => {});
  }

  getResverFormItem () {
    const { getFieldDecorator } = this.props.form;
    let item = <div className="reserve-form">
      <Form>
        <div className="table-dialog-area">
          {this.getDialogItem()}
          <div><span>选择服务机构和日期</span></div>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="服务地区"
                hasFeedback>     
                {getFieldDecorator('areaValue', {
                  rules: [{ required: true }],
                })(             
                   <Cascader
                    placeholder="请选择服务地区"
                    options={this.state.area}
                    loadData={this.areaLoadData}
                    onChange={this.onAreaChange}
                    changeOnSelect
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
             <FormItem
                {...modalItemLayout}
                label="服务机构"
                hasFeedback>    
                {getFieldDecorator('hcuInstitutionId', {
                  rules: [{ required: true }],
                })(                   
                  <Select 
                    placeholder="请选择服务机构"
                    style={{ width: "100%" }} 
                    onChange={this.institutionChange.bind(this)}>
                    {this.state.institutionOptions.map(el => {
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
                label="服务日期选择"
                hasFeedback>  
                  {getFieldDecorator('appointServiceTime', {
                    rules: [{ required: true }],
                  })(     
                  <DatePicker
                    placeholder="请选择服务日期"
                    format="YYYY-MM-DD"
                    style={{width: "100%"}}
                    disabledDate={this.disabledDate.bind(this)}/>   
                  )}             
              </FormItem>
            </Col>
            <Col span={12}>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
    return item;
  }

  disabledDate(current) {
    let flag = true;
    if(current) {
      if(this.state.reserveDateList.length) {
        this.state.reserveDateList.forEach(el => {
          let reserveDate = new Date(moment(el.label));
          let reserveTime = reserveDate.getFullYear() + "-" + reserveDate.getMonth() + "-" + reserveDate.getDate();
          let currentDate = new Date(current);
          let currentTime = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate();
          if(reserveTime === currentTime) {
            flag = false
          }
        })
      }
    }
    return flag;
  }

  memberNoChange = (e) => {
    let orderData = this.state.condition;
  }

  idCardChange = (e) => {
    this.setState({
      cardID: e.target.value.trim()
    })
  }

  getPackageDetail () {
    let item = "";
    let columns = ClubberDetail.packageDetailColumn();
    if(this.state.packageInfo) {
      item = <div>
        <div style={{marginBottom: "10px"}}>
          <span style={{fontWeight: "bold"}}>套餐说明:</span>
          <span>{this.state.packageInfo.package_desc}</span>
        </div>
        <Table 
          columns={columns} 
          dataSource={this.state.packageInfo.package_details} 
          size="middle" 
          pagination={{pageSize: 5, size: "middle"}}/>
      </div>
    }
    return item;
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
                    {...formItemLayoutFirstCell}
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
                    label="机构组织">                  
                    <Cascader 
                      placeholder="请选择机构组织" 
                      style={{width: "100%"}} 
                      value={this.state.orgSelectValue} 
                      options={this.state.orgList} 
                      loadData={this.orgLoadData} 
                      onChange={this.orgSelectChange.bind(this)} 
                      changeOnSelect />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol = {{ span: 6 }}
                    wrapperCol = {{ span: 14 }}
                    label="员工/会员号：">
                    <Input onChange={this.memberNoChange} placeholder="请输入员工或会员号" />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutFirstCell}
                  label="产品服务">                  
                    <Select value={this.state.serviceValue} style={{ width: "100%" }} onChange={this.serviceChange.bind(this)}>
                      {this.state.serviceList.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
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
                  label="身份证件号："
                  className="item-idCard">   
                  <InputGroup compact>
                    <Select defaultValue="" value={this.state.cardType} onChange={this.idCardTypeChange.bind(this)}>
                      <Option value="">全部</Option>
                      {this.state.idCardType.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                    <Input onChange={this.idCardChange} value={this.state.cardID} placeholder="请输入证件号" style={{ width: '68%' }} />
                  </InputGroup> 
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutFirstCell}
                  label="订单日期">                  
                    <RangePicker onChange={this.orderChange}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="预约服务日期">                  
                    <RangePicker onChange={this.reserveDateChange}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="登陆账号">                  
                    <Input placeholder="请输入登陆账号" onChange={this.countLoginChange} value={this.state.loginAccount}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutFirstCell}
                  label="预约状态">                  
                    <RadioGroup onChange={this.hcuReserveFlgChange} value={this.state.hcuReserveFlg}>
                      <Radio value="1">已预约</Radio>
                      <Radio value="2">未预约</Radio>
                    </RadioGroup>
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
              <Button type="primary" onClick={this.exportClick.bind(this)}>预约导出</Button>
            </span>
          </div>
          <div className="line-area"></div>
          <div className="group-table">
            <div className="group-table-operate">
            </div>
            <Table 
              columns={this.columns} 
              dataSource={this.state.data} 
              loading={this.state.tableLoading}
              onChange={this.reserveTableChange} size="middle" 
              pagination={{pageSize: 10, total: this.state.reserveTotal, size: "middle"}} />
          </div>
        </div>
        <Modal
          title={this.state.detailData.grouprecordId + "订单信息详情"}
          visible={this.state.detailVisible}
          onOk={this.detailHandleOk}
          onCancel={this.detailHandleCancel}
          width={800}>
          {this.getOrderDetail()}
        </Modal>
        <Modal
          title={"用户" + this.state.operateType === "reserve" ? "预约操作" : "改约操作"}
          visible={this.state.reserveVisible}
          onOk={this.reservehandleOk}
          onCancel={this.reserveHandleCancel}
          width={800}>
          {this.getResverFormItem()}
        </Modal>
        <Modal
          title="请勾选导出查询信息项,"
          visible={this.state.exportVisible}
          onOk={this.exportHandleOk}
          onCancel={this.exportHandleCancel}
          width={800}
        > 
          <ReserveExport dataSource={this.state.data} />
        </Modal>
        <Modal
          title={this.state.package_name + "套餐详情"}
          visible={this.state.packageVisible}
          onOk={this.packageHandleOk}
          onCancel={this.packageHandleCancel}
          width={800}> 
          {this.getPackageDetail()}
        </Modal>
      </div>
    );
  }
}

export default Reserve = Form.create({
})(Reserve);
