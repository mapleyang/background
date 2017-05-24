import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio  } from 'antd'
import './index.scss'
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const Option = Select.Option;

const columns = [{
    title: '编号',
    dataIndex: 'no',
    key: 'no',
  }, {
    title: '渠道用户名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '渠道代码',
    dataIndex: 'code',
    key: 'code',
  }, {
    title: '行业类型',
    dataIndex: 'vocationType',
    key: 'vocationType',
  }, {
    title: '渠道介绍',
    key: 'introduction',
    dataIndex: "introduction"
  },{
    title: '联系人',
    key: 'contact',
    dataIndex: "contact"
  }, {
    title: '操作',
    key: 'operate',
    dataIndex: 'operate',
    render: (text, record) => {
      return <span className="table-operate">
        {record.operate.map(el => {
          return <span className="table-operate-item"><a>{el}</a></span>
        })}
      </span>
    },
  }]

const data = [{
    no: '1',
    name: 'xxx',
    code: 123,
    vocationType: '体检',
    introduction: 'xxxx',
    contact: "详情",
    operate: ["查看", "删除"]
  }];

class Clubber extends Component {
  constructor(props, context) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    //项目接口
    //会员信息接口
  }

  handleChange (value) {
    console.log(value)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div className="group-search-select">
              <span>项目名称：</span>
              <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange.bind(this)}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
              <span className="group-search-button">
                <Button type="primary">搜索</Button>
              </span>
            </div>
          </div>
          <div className="line-area"></div>
          <div className="group-table">
            <div className="group-table-operate">
              <Button type="primary">新增</Button>
            </div>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
      </div>
    );
  }
}

export default Clubber = Form.create({
})(Clubber);