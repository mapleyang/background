import React, { Component } from 'react'
import { Row, Col, Checkbox } from 'antd'
import './index.scss';
import ClubberDetail from "./clubberDetail"

class ReserveExport extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      checkbox: [],
      dataSource: this.props.dataSource
    }
  }

  componentWillMount () {
    this.setState({
      checkbox: ClubberDetail.getExportItem(this.props.dataSource)
    })
  }
 
  onChange(value) {
    console.log(value)
  }

  getCheckboxItem () {
    let item = "";
    if(this.state.checkbox.length !== 0) {
      item = this.state.checkbox.map(el => {
        return <Col span={8}><Checkbox value={el.value}>{el.label}</Checkbox></Col>
      })
    }
    return item;
  }


  render() {
    return (
      <div className="reserve-form">
        <Checkbox.Group onChange={this.onChange}>
          <Row>
            {this.getCheckboxItem()}
          </Row>
        </Checkbox.Group>
      </div>
    );
  }
}

export default ReserveExport;


