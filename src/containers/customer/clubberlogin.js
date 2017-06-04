import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker, Checkbox } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];


class ClubberLogin extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
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
      projectValue: "all",
    }
    this.columns = ClubberDetail.getClubberLoginInfo(this)
  }

  componentWillMount () {
    //后台用户信息接口
    UserInfo.getUserInfo();
    //会员信息接口
    this.getClubberInfo();
    //项目接口
    this.getProjectInfo();
  }

  /*项目信息获取*/
  getProjectInfo () {
    const _this = this;
    window.$.ajax({
      type: 'GET',
      url: "/chealth/background/ajaxBusiness/loadCustProjectList",
      dataType:'json',
      success:function(res){
        if(res.success === "true") {
          _this.setState({
            projectData: res.data,
          })
        }
        else {
          // Modal.error({
          //   title: data.errors[0].errorMessage,
          //   content: '',
          // });
        }
      },
      error:function(){
      }
    });
  }

  getClubberInfo (body) {
    const _this = this;
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/cusServiceOperation/memberInfo/searchData",
      data: body,
      dataType:'html',
      success:function(res){
        if(res.success === undefined) {
          res = JSON.parse(res)
        }
        if(res.success === "true") {
          _this.setState({
            data: res.data.rows
          })
        }
        else {
          Modal.error({
            title: res.errors[0].errorMessage,
            content: '',
          });
        }
      },
      error:function(){
      }
    });
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
      this.setState({
        editVisible: true,
        editData: record,
        addEditTitle: record.name + "信息编辑"
      })
    }
    else if(flag === "delete"){
      Modal.confirm({
        title: "确定删除" + record.name + "信息",
        content: '',
        onOk() {
          console.log('OK');
        },
        onCancel() {
        },
      });
    }
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
    this.getClubberInfo(data)
  }

  /*项目更改*/
  projectChange (value) {
    let data = {
      cusId: value === "all" ? "" : value
    }
    this.setState({
      projectValue: value,
    })
    this.getClubberInfo(data);
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

  /*用户新增与编辑*/
  getUserAddEdit () {
    let item = "";
    const { getFieldDecorator } = this.props.form;
    item = <Form>
      <div className="table-dialog-area">
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="登陆时间重置"
              hasFeedback>                  
                <RangePicker />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="登陆权限禁用">    
              {getFieldDecorator('loginSetting')(
                <Checkbox></Checkbox>
              )}      
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              className="form-item-title"
              label="密码重置">                  
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
                <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="重复新密码"
              hasFeedback>    
              <Input />              
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="产品服务有效期设置">                  
            </FormItem>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="会员体检">                  
                <RangePicker />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="家属体检">    
              <RangePicker />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="会员体检">                  
               <RangePicker />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="家属体检">    
              <RangePicker />            
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="自费齿科">                  
                <RangePicker />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="体检解答">    
              <RangePicker />            
            </FormItem>
          </Col>
        </Row>
      </div>
    </Form>
    return item;
  }

  /*查询*/
  searchClick () {
    let data = {}
    if(this.state.mobile !== "") {
      data.mobile = this.state.mobile;
    }
    if(this.state.loginAccount !== "") {
      data.loginAccount = this.state.loginAccount;
    }
    this.getClubberInfo(data);
  }
  /*清空*/
  clearClick () {
    this.setState({
      accountStatus: "00",
      loginAccount: "",
      mobile: "",
      projectValue: "all"
    })
    this.getClubberInfo()
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


  render() {
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="项目名称："
                  >
                    <Select defaultValue="all" value={this.state.projectValue} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                      <Option value="all">全部</Option>
                      {this.state.projectData.length === 0 ? [] : this.state.projectData.map(el => {
                        return <Option value={el.cusId}>{el.projectName}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                  {...formItemLayout}
                    label="机构组织：">                  
                    <Select defaultValue="lucy" style={{ width: "100%" }} onChange={this.agencyChange.bind(this)}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol = {{ span: 6 }}
                    wrapperCol = {{ span: 14 }}
                    label="员工/会员号：">
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="登陆账号：">                  
                    <Input onChange={this.countLoginChange} value={this.state.loginAccount}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="手机号：">   
                  <Input onChange={this.mobileChange} value={this.state.mobile}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  labelCol = {{ span: 6 }}
                  wrapperCol = {{ span: 14 }}
                  label="身份证件号："
                  className="item-idCard">   
                  <InputGroup compact>
                    <Select defaultValue="idCard">
                      <Option value="idCard">身份证</Option>
                      <Option value="passport">护照</Option>
                    </Select>
                    <Input style={{ width: '68%' }} />
                  </InputGroup> 
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="帐号状态：">                  
                    <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                      <Option value="00">全部</Option>
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
                  label="产品服务：">                  
                    <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                      <Option value="00">全部</Option>
                      <Option value="01">未激活</Option>
                      <Option value="02">激活</Option>
                      <Option value="03">失效</Option>
                      <Option value="04">禁用</Option>
                      <Option value="05">作废</Option>
                    </Select>
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
            <Table columns={this.columns} dataSource={this.state.data} size="middle"  />
          </div>
        </div>
        <Modal
          title={this.state.detailData.name + "登陆信息重置"}
          visible={this.state.detaiVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}>
          {this.getUserAddEdit()}
        </Modal>
      </div>
    );
  }
}

export default ClubberLogin = Form.create({
})(ClubberLogin);