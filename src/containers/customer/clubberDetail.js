import React, { Component } from 'react'
import { Form, Row, Col, Select, InputNumber, Button, Checkbox} from 'antd'
const FormItem = Form.Item;
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}
const UserDetail = {
  /*用户详情内容*/
  getUserItemDetail: (data) => {
    let value = [{
      label: "用户姓名",
      value: data.name
    },{
      label: "用户账号",
      value: data.memberNo
    },{
      label: "性别",
      value: data.sexName
    },{
      label: "出生年月",
      value: data.birth
    },{
      label: "证件类型",
      value: data.certiTypeName
    },{
      label: "证件号码",
      value: data.certiId
    },{
      label: "婚姻状况",
      value: data.maritalName
    },{
      label: "民族",
      value: data.nation
    },{
      label: "员工号",
      value: data.staffNo
    }];
    return value
  },
  getUserColumns: (_this, flag) => {
    let columns = [{
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '项目名称',
      dataIndex: 'code',
      key: 'code',
      render: (text, record, index) => {
        let projectName = "";
        _this.state.projectData.forEach(el => {
          if(el.custProjectId === record.custProjectId) {
            projectName = el.projectName;
          }
        })
        return <span>{projectName}</span>
      }
    }, {
      title: '机构组织',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '性别',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '身份证件号',
      key: 'certiId',
      dataIndex: "certiId",
      render: (text, record, index) => {
        let certiTypeName = record.certiTypeName === null ? "" : record.certiTypeName + "：";
        let certiId = record.certiId === null ? "" : record.certiId;
        return <span>{certiTypeName + certiId}</span>
      },
    },{
      title: '员工/会员号',
      key: 'memberNo',
      dataIndex: "memberNo"
    }, {
      title: '手机号',
      key: 'mobile',
      dataIndex: "mobile"
    },{
      title: '账号状态',
      key: 'accountStatus',
      dataIndex: "accountStatus",
      render: (text, record, index) => {
        let status = [{
          label: "激活",
          value: "02"
        },{
          label: "未激活",
          value: "01"
        },{
          label: "失效",
          value: "03"
        },{
          label: "禁用",
          value: "04"
        },{
          label: "作废",
          value: "05"
        }]
        let name = "";
        status.forEach(el => {
          if(el.value === _this.state.accountStatus) {
            name = el.label
          }
        })
        return <span>{name}</span>
      }
    }]
    if(flag === "clubber") {
      let ele = {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return <span className="table-operate">
            <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>查看</a></span>
            <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "edit", record, index)}><a>编辑</a></span>
            <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "delete", record, index)}><a>删除</a></span>
          </span>
        },
      }
      columns.push(ele);
    }
    else {
      let ele = {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return <span className="table-operate">
            <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "reset", record, index)}><a>重置</a></span>
          </span>
        },
      }
      columns.push(ele);
    }
    return columns
  },
  getClubberLoginInfo: (_this) => {
    return [{
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '项目名称',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '机构组织',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '性别',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '身份证件号',
      key: 'certiId',
      dataIndex: "certiId",
      render: (text, record, index) => {
        let certiTypeName = record.certiTypeName === null ? "" : record.certiTypeName + "：";
        let certiId = record.certiId === null ? "" : record.certiId;
        return <span>{certiTypeName + certiId}</span>
      },
    },{
      title: '员工/会员号',
      key: 'contact',
      dataIndex: "contact"
    }, {
      title: '手机号',
      key: 'mobile',
      dataIndex: "mobile"
    },{
      title: '账号状态',
      key: 'accountStatus',
      dataIndex: "accountStatus"
    }, {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <span className="table-operate">
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>重置</a></span>
        </span>
      },
    }]
  },
  /*删除用户时查询订单*/
  getClubberOrderItem: (_this) => {
    return [{
      title: '订单号',
      dataIndex: 'recordId',
      key: 'recordId',
    }, {
      title: '产品服务',
      dataIndex: 'pscName',
      key: 'pscName',
    }, {
      title: '套餐详情',
      key: 'packageDetail',
      dataIndex: "packageDetail",
      render: (text, record, index) => {
        return <span onClick={_this.packageDetailClick.bind(text, record, index)}><a>查看</a></span>
      },
    },{
      title: '服务状态',
      key: 'serviceStatus',
      dataIndex: "serviceStatus"
    },{
      title: '支付状态',
      key: 'tranStatus',
      dataIndex: "tranStatus"
    },{
      title: '订单时间',
      key: 'orderDate',
      dataIndex: "orderDate"
    },{
      title: '预约服务日期',
      key: 'appointServiceDate',
      dataIndex: "appointServiceDate"
    },{
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <span className="table-operate">
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, record, index)}><a>取消</a></span>
        </span>
      },
    }]
  },
  getReserveItem: (_this) => {
    return [{
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    }, {
      title: '订单号',
      dataIndex: 'recordId',
      key: 'recordId',
    }, {
      title: '产品服务',
      dataIndex: 'pscName',
      key: 'pscName',
    }, {
      title: '证件号',
      key: 'certiId',
      dataIndex: "certiId",
    },{
      title: '员工/会员号',
      key: 'memberNo',
      dataIndex: "memberNo"
    }, {
      title: '套餐详情',
      key: 'packageDetail',
      dataIndex: "packageDetail",
      render: (text, record, index) => {
        let value = "";
        if(record.recordId) {
          value = <span onClick={_this.packageDescClick.bind(_this, text, record, index)}><a>查看</a></span>
        }
        return value
      },
    },{
      title: '服务状态',
      key: 'serviceStatus',
      dataIndex: "serviceStatus"
    },{
      title: '支付状态',
      key: 'tranStatus',
      dataIndex: "tranStatus"
    },{
      title: '订单时间',
      key: 'orderDate',
      dataIndex: "orderDate"
    },{
      title: '预约服务日期',
      key: 'appointServiceDate',
      dataIndex: "appointServiceDate"
    },{
      title: '预约状态',
      key: 'reserveStatus',
      dataIndex: "reserveStatus",
      render: (text, record, index) => {
        let name = "已预约";
        if(!record.recordId) {
          name = "未预约"
        }
        return <span>{name}</span>
      }
    },{
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <span className="table-operate">
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>查看</a></span>
          {record.recordId ? "" : <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "reserve", record, index)}><a>预约</a></span>}
          {record.recordId ? <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "change", record, index)}><a>改约</a></span> : ""}
          {record.recordId ? <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "cancel", record, index)}><a>取消</a></span> : ""}
        </span>
      },
    }]
  },
  getOrgImportItem: (_this) => {
    return [{
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    }, {
      title: '产品服务',
      dataIndex: 'pscName',
      key: 'pscName',
    }, {
      title: '服务集团',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '服务机构',
      dataIndex: 'institutionsName',
      key: 'institutionsName',
    }, {
      title: '服务城市',
      dataIndex: 'cityId',
      key: 'cityId',
    },{
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <span className="table-operate">
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, record, index)}><a>查看</a></span>
        </span>
      },
    }]
  },
  getOrgResChangeItem: (_this) => {
    return [{
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    }, {
      title: '服务机构',
      dataIndex: 'hcuInstitutionsName',
      key: 'hcuInstitutionsName',
    }, {
      title: '日期',
      dataIndex: 'calendarYmd',
      key: 'calendarYmd',
    }, {
      title: '星期',
      dataIndex: 'week',
      key: 'week',
    }, {
      title: '已预约人数',
      dataIndex: 'reserved',
      key: 'reserved',
      // width: 100,
      // render: (text, record, index) => {
      //   return <div className="org-change-operate">
      //     <InputNumber min={0} defaultValue={record.reserved} onChange={_this.reservedChange.bind(_this, record, index)}/>
      //   </div>
      // }
    }, {
      title: '预约名额',
      dataIndex: 'reserveLimit',
      key: 'reserveLimit',
      width: 100,
      render: (text, record, index) => {
        return <div className="org-change-operate">
          <InputNumber min={0} defaultValue={record.reserveLimit} onChange={_this.reserveLimitChange.bind(_this, record, index)}/>
        </div>
      }
    }, {
      title: '团检日',
      dataIndex: 'groupHcuFlg',
      key: 'groupHcuFlg',
      width: 150,
      render: (text, record, index) => {
        return <div className="org-change-operate">
          <Checkbox checked={record.groupHcuFlg === "1"} onChange={_this.groupHcuFlgChange.bind(_this, record, index)}>团检日</Checkbox>
        </div>
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 100,
      render: (text, record, index) => {
        return <div className="org-change-operate">
          <Button type="primary" onClick={_this.tableSaveClick.bind(_this, record, index)}>保存</Button>
        </div>
      }
    }]
  },
  getGroupOrgDetailItem: () => {
    return [{
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    }, {
      title: '服务机构',
      dataIndex: 'hcuInstitutionsName',
      key: 'hcuInstitutionsName',
    }, {
      title: '日期',
      dataIndex: 'calendarYmd',
      key: 'calendarYmd',
    }, {
      title: '星期',
      dataIndex: 'week',
      key: 'week',
    }, {
      title: '已预约人数',
      dataIndex: 'reserved',
      key: 'reserved',
    }, {
      title: '预约名额',
      dataIndex: 'reserveLimit',
      key: 'reserveLimit',
    }]
  },
  /*预约导出项名称*/
  getExportItem: (data) => {
    return [{
      label: "项目名称",
      value: "projectName"
    },{
      label: "产品服务",
      value: "pscName"
    },{
      label: "订单号",
      value: "recordId"
    },{
      label: "员工/会员号",
      value: "memberNo"
    },{
      label: "证件号",
      value: "certiId"
    },{
      label: "联系手机",
      value: "mobile"
    },{
      label: "联系邮箱",
      value: "email"
    },{
      label: "订单时间",
      value: "orderDate"
    },{
      label: "总金额",
      value: "totalMoney"
    },{
      label: "预约服务日期",
      value: "appointServiceDate"
    },{
      label: "服务状态",
      value: "serviceStatus"
    },{
      label: "交易状态",
      value: "tranStatus"
    },{
      label: "主套餐",
      value: ""
    },{
      label: "服务集团",
      value: "hcuGroupId"
    },{
      label: "服务机构",
      value: "hcuInstitutionId"
    }]
  },
  /*订单详情*/
  orderDetail: (el) => {
    return [{
      label: "订单号",
      value: el.recordId
    },{
      label: "项目名称",
      value: el.projectName
    },{
      label: "服务名称",
      value: el.pscName
    },{
      label: "员工号",
      value: el.memberNo
    },{
      label: "总金额",
      value: el.totalMoney
    },{
      label: "支付日期",
      value: el.payDate
    },{
      label: "预约服务日期",
      value: el.appointServiceDate
    },{
      label: "服务状态",
      value: el.serviceStatus
    },{
      label: "交易状态",
      value: el.tranStatus
    },{
      label: "证件号",
      value: el.certiId
    },{
      label: "联系手机",
      value: el.mobile
    },{
      label: "联系邮箱",
      value: el.email
    }]
  },
  //可选套餐
  getExtraPackage: () => {
    return [{
      title: "套餐名称",
      dataIndex: "packageName",
      key: "packageName"
    },{
      title: "套餐介绍",
      dataIndex: "context",
      key: "context"
    }]
  },
  //可选项目
  getExtraProject: () => {
    return [{
      title: "体检项名称",
      dataIndex: "packageName",
      key: "packageName"
    },{
      title: "体检项介绍",
      dataIndex: "context",
      key: "context"
    }]
  },
  getDetailElement: (array) => {
    let item = "";
    let list = [];
    let colList = [];
    array.forEach((el, index) => {
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
      if((array.length % 2) && (array.length - 1 === index)) {
        let RowEl = <Row>
          {colList}
        </Row>
        list.push(RowEl);
        colList = [];
      }
    });
    return list
  },
  /*套餐详情说明*/
  packageDetailColumn: () => {
    return [{
      title: "子项名称",
      dataIndex: "subItem",
      key: "subItem",
    },{
      title: "子项类型",
      dataIndex: "itemTypeName",
      key: "itemTypeName",
    },{
      title: "子项内容",
      dataIndex: "context",
      key: "context",
    },{
      title: "筛查的疾病",
      dataIndex: "illness",
      key: "illness",
    }]
  }
}

export default UserDetail;