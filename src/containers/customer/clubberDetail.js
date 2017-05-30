import React, { Component } from 'react'
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
  getUserColumns: (_this) => {
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
        return <span>{record.certiTypeName + "：" + record.certiId}</span>
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
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>查看</a></span>
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "edit", record, index)}><a>编辑</a></span>
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "delete", record, index)}><a>删除</a></span>
        </span>
      },
    }]
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
        return <span>{record.certiTypeName + "：" + record.certiId}</span>
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
  getReserveItem: (_this) => {
    return [{
      title: '项目名称',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '产品服务',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '患者姓名',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '患者身份证件号',
      key: 'certiId',
      dataIndex: "certiId",
      render: (text, record, index) => {
        return <span>{record.certiTypeName + "：" + record.certiId}</span>
      },
    },{
      title: '员工/会员号',
      key: 'contact',
      dataIndex: "contact"
    }, {
      title: '主套餐',
      key: 'mobile',
      dataIndex: "mobile"
    },{
      title: '服务机构',
      key: 'accountStatus',
      dataIndex: "accountStatus"
    },{
      title: '服务状态',
      key: 'accountStatus',
      dataIndex: "accountStatus"
    },{
      title: '订单时间',
      key: 'mobile',
      dataIndex: "mobile"
    },{
      title: '服务时间',
      key: 'mobile',
      dataIndex: "mobile"
    },{
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <span className="table-operate">
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>查看</a></span>
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>预约</a></span>
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>改约</a></span>
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>取消</a></span>
        </span>
      },
    }]
  },
  getOrgImportItem: (_this) => {
    return [{
      title: '项目名称',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '产品服务',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '服务机构',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <span className="table-operate">
          <span className="table-operate-item" onClick={_this.operateClick.bind(_this, "detail", record, index)}><a>查看</a></span>
        </span>
      },
    }]
  },
  getOrgResChangeItem: (el) => {
    return [{
      title: '项目名称',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '服务机构',
      dataIndex: 'institutionName',
      key: 'institutionName',
    }, {
      title: '日期',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '星期',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '已预约人数',
      dataIndex: 'sexName',
      key: 'sexName',
    }, {
      title: '预约名额',
      dataIndex: 'sexName',
      key: 'sexName',
    }]
  }
}

export default UserDetail;