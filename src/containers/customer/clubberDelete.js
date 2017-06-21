import React, { Component } from 'react'
import { Table, message } from 'antd'
import './index.scss';
import ClubberDetail from "./clubberDetail"
import Operate from "./operate"

class ClubberDelete extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      detailData: {},
      orderList: [],
      total: "",
      pageNumber: 1,
      loading: false
    }
    this.columns = ClubberDetail.getClubberOrderItem(this)
  }

  componentWillMount () {
    const _this = this;
    this.setState({
      detailData: this.props.detailData
    })
    let orderData = {
      cusId: this.props.detailData.cusId,
      loginAccount: this.props.detailData.memberNo,
      pageNumber: 1,
    }
    this.getOrderInfo(orderData)
  }

  getOrderInfo (orderData) {
    const _this = this;
    orderData.pageSize = 8;
    let orderUrl = "/chealth/background/cusServiceOperation/hcuReserve/searchData";
    Operate.getResponse(orderUrl, orderData, "POST", "html").then((value) => {
      if(value.success === "true") {
        _this.setState({
          orderList: value.data.rows,
          total: value.data.total,
          loading: false
        })
        _this.props.getClubberOrderInfo(value.data.rows);
      }
    }, (value) => {})
  }

  packageDetailClick () {

  }

  operateClick (record, index) {
    const _this = this;
    this.setState({
      loading: true
    })
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
        let orderData = {
          cusId: this.state.detailData.cusId,
          loginAccount: this.state.detailData.memberNo,
          pageNumber: this.state.pageNumber,
        }
        _this.getOrderInfo(orderData)
      }
      else {
        message.error(record.recordId + "订单取消失败！")
        _this.setState({
          loading: false
        })
      }
    }, (value) => {})
  }

  tableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNumber: pagination.current
    })
    let orderData = {
      cusId: this.state.detailData.cusId,
      loginAccount: this.state.detailData.memberNo,
      pageNumber: pagination.current,
    }
    this.getOrderInfo(orderData)
  }

  render() {
    return (
      <div className="clubber-delete">
        <Table loading={this.state.loading} columns={this.columns} dataSource={this.state.orderList} onChange={this.tableChange} pagination={{current: this.state.pageNumber ,pageSize: 8, total: this.state.total, size: "middle"}} size="middle"  />
      </div>
    );
  }
}

export default ClubberDelete;


