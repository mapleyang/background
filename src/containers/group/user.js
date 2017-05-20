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
  title: '团体用户名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '代码',
  dataIndex: 'code',
  key: 'code',
}, {
  title: '账号',
  key: 'account',
  dataIndex: "account"
},{
  title: '操作',
  key: 'operate',
  dataIndex: 'operate',
  render: (text, record) => {
    console.log(record)
    return <span className="table-operate">
      {record.operate.map(el => {
        return <span className="table-operate-item"><a>{el}</a></span>
      })}
    </span>
  },
}];

const data = [{
  no: '1',
  name: 'xxx',
  code: 123,
  account: '1234457',
  operate: ["查看", "删除"]
}];

class Group extends Component {
  constructor(props, context) {
    super(props)
    this.state = {}
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
              <span>团体客户名称：</span>
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

export default Group = Form.create({
})(Group);