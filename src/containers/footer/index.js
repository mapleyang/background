import React, { Component } from 'react'
import { Row, Col, Menu, Icon  } from 'antd'
import './index.scss'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Footer extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div className="footer-area">
        <Row className="footer-contents">
          <Col span={3} className="footer-desc">
            <div className="footer-desc-title">关于我们</div>
            <div><a>新闻中心</a></div>
            <div><a>关于我们</a></div>
            <div><a>联系我们</a></div>
            <div><a>加入我们</a></div>
          </Col>
          <Col span={3} className="footer-desc">
            <div className="footer-desc-title">服务产品</div>
            <div><a>就医指导</a></div>
            <div><a>专家预约</a></div>
            <div><a>住院协助</a></div>
            <div><a>大病咨询</a></div>
          </Col>
          <Col span={3} className="footer-desc">
            <div className="footer-desc-title">服务产品</div>
            <div><a>自费体检</a></div>
            <div><a>洗牙预约</a></div>
            <div><a>体检解答</a></div>
          </Col>
          <Col className="footer-desc" span={3}>
            <div className="footer-desc-title">服务帮助</div>
            <div><a>帮助中心</a></div>
            <div><a>联系客服</a></div>
            <div><a>意见反馈</a></div>
          </Col>
          <Col className="footer-desc" span={3}>
            <div className="footer-desc-title">使用须知</div>
            <div><a>隐私保护</a></div>
            <div><a>知情同意</a></div>
            <div><a>使用条款</a></div>
          </Col>
          <Col span={8}>
            <div className="code-img"><img src="/chealth/img/background/code.png" /></div>
            <div className="code-img">微信公众号：GravityHealth2015</div>
          </Col>
        </Row>
        <div className="copyright-area">
          <div className="copyright">Copyright ©2014-2017 GravityHealth All Rights Reserved</div>
          <div className="copyright">版权所有 ©2014-2017 上海彧康医疗科技有限公司</div>
        </div>
      </div>
    );
  }
}

export default Footer;