import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, Upload, message } from 'antd'
import './index.scss';
import Operate from "./operate"

const FormItem = Form.Item;
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

class ClubberImport extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      projectValue: "",
      projectList: [],
      projectValue: "",
      uploadUrl: "",
      serviceList: [],
      custPscId: "",
      type: "",
      groupList: [],
      cusId: "",
      groupValue: ""
    }
  }

  componentWillMount () {
    this.setState({
      projectList: this.props.projectList,
      projectValue: this.props.projectValue,
      uploadUrl: this.props.uploadUrl,
      serviceList: this.props.serviceList,
      custPscId: this.props.custPscId,
      type: this.props.type,
      cusId: this.props.cusId
    })
    if(this.props.type === "org") {
      let data = {
        custPscId: this.props.custPscId,
        cusId: this.props.cusId
      }
      this.getServiceGroup(data);
    }
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.projectValue !== this.state.projectValue || nextProps.custPscId !== this.state.custPscId) {
      this.setState({
        projectList: nextProps.projectList,
        projectValue: nextProps.projectValue,
        uploadUrl: nextProps.uploadUrl,
        serviceList: nextProps.serviceList,
        custPscId: nextProps.custPscId,
        type: nextProps.type,
        cusId: nextProps.cusId
      })
      if(this.props.type === "org") {
        let data = {
          custPscId: nextProps.custPscId,
          cusId: nextProps.cusId
        }
        this.getServiceGroup(data);
      }
    }
  }

  /*服务集团*/
  getServiceGroup (groupData) {
    const _this = this;
    let groupUrl = "/chealth/background/ajaxBusiness/loadCustHcuGrouptList";
    Operate.getResponse(groupUrl, groupData, "POST", "html").then((value) => {
      if(value.success) {
        let list = [];
        value.data.list.forEach(el => {
          if(el.value) {
            list.push(el)
          }
        })
        _this.setState({
          groupList: list,
          groupValue: list[0].value
        })
      }
    }, (value) => {})
  }

  serviceChange (value) {
    this.setState({
      custPscId: value
    })
    this.props.custPscIdPropsChange(value)
    let data = {
      custPscId: value,
      cusId: this.state.cusId
    }
    this.getServiceGroup(data)
  }

  getProjectName () {
    let item = "";
    this.state.projectList.forEach(el => {
      if(el.custProjectId === this.state.projectValue) {
        item = el.projectName;
      }
    })
    return item;
  }

  getServiceItem () {
    let item = "";
    if(this.state.type === "clubber") {
      item = <FormItem
        {...modalItemLayout}
        label="产品服务">                  
          <Select value={this.state.custPscId} style={{ width: "100%" }} onChange={this.serviceChange.bind(this)}>
            {this.state.serviceList.map(el => {
              return <Option value={el.value}>{el.label}</Option>
            })}
          </Select>
      </FormItem>
    }
    else {
      let serviceName = "";
      this.state.serviceList.forEach(el => {
        if(el.value === this.state.custPscId) {
          serviceName = el.label;
        }
      })
      item = <FormItem
        {...modalItemLayout}
        label="产品服务">                  
        <span>{serviceName}</span>
      </FormItem>
    }
    return item;
  }

  groupChange (value) {
    this.setState({
      groupValue: value
    })
  }

  getOrgList () {
    let item = "";
    if(this.state.type === "org") {
      item = <Row>
        <Col span={12}>
          <FormItem
            {...modalItemLayout}
            label="服务集团">    
            <Select value={this.state.groupValue} style={{ width: "100%" }} onChange={this.groupChange.bind(this)}>
              {this.state.groupList.map(el => {
                return <Option value={el.value}>{el.label}</Option>
              })}
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
    }
    return item;
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    let data = {
      custProjectId: this.state.projectValue,
      custPscId: this.state.custPscId
    };
    if(this.state.type === "org") {
      data.hcuGroupId = this.state.groupValue
    }
    const props = {
      name: 'inputExcelFile',
      action: this.state.uploadUrl,
      onChange: this.handleChange,
      data: data,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功.`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败.`);
        }
      }
    }

    return (
      <div className="clubber-import">
        <Form>
        <div className="table-dialog-area">
          <div className="table-area-line">
            <Row>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="项目名称">    
                    <span>{this.getProjectName()}</span>              
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="产品服务">                  
                    <Select value={this.state.custPscId} style={{ width: "100%" }} onChange={this.serviceChange.bind(this)}>
                      {this.state.serviceList.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                </FormItem>
              </Col>
            </Row>
            {this.getOrgList()}
          </div>
          <div style={{marginTop: "10px"}}>
            <Row>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="文件上传">
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload" /> Upload
                      </Button>
                    </Upload>
                  </FormItem>
              </Col>
              </Row>
          </div>
        </div>
      </Form>
      </div>
    );
  }
}

export default ClubberImport = Form.create({
})(ClubberImport);


