import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import $ from "jquery"

import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';
import scriptjs from 'scriptjs';
import antdEn from 'antd/lib/locale-provider/en_US';
import appLocaleDataEn from 'react-intl/locale-data/en';
import appLocaleDataZh from 'react-intl/locale-data/zh';
import { LocaleProvider } from 'antd';
import ZH_EN from './zh-en';

import { hashHistory, browserHistory, Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import 'antd/dist/antd.less'
import Test from "./containers/test"
import Test01 from "./containers/test/test01"
import App from "./containers/app"
import Home from "./containers/home/index"
import Login from "./containers/login/index"
import GroupUser from "./containers/group/user"
import Project from "./containers/project/index"
import Clubber from "./containers/customer/clubber"
import ClubberLogin from "./containers/customer/clubberLogin"
import Reserve from "./containers/customer/reserve"
import OrgResImport from "./containers/customer/orgResImport"
import OrgResChange from "./containers/customer/orgResChange"

window.$ = $;


const param = location.hash.slice(2, 4) === "en" ? "en" : undefined;


const locale = param || 'zh';

const scripts = [];

if (!window.Intl) {
  scripts.push(`https://as.alipayobjects.com/g/component/intl/1.0.1/locale-data/jsonp/${locale}.js`);
  scripts.push(`https://as.alipayobjects.com/g/component/intl/1.0.1/Intl.js`);
  if (locale !== 'zh') {
    scripts.push(`https://as.alipayobjects.com/g/component/intl/1.0.1/locale-data/jsonp/en-US.js`);
  }
}
scripts.push(`https://as.alipayobjects.com/g/component/react-intl/2.0.0/locale-data/${locale}.js`);
if (locale !== 'zh') {
  scripts.push(`https://as.alipayobjects.com/g/component/react-intl/2.0.0/locale-data/en.js`);
}

const ready = () => {

  addLocaleData(window.ReactIntlLocaleData[locale]);

  window.ZH_EN = ZH_EN;

  const defaultZH_EN = ZH_EN['zh'];

  ReactDOM.render(
    <LocaleProvider locale={locale === "en" ? antdEn : null}>
      <IntlProvider
        locale={locale}
        messages={ZH_EN[locale] || defaultZH_EN}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <IndexRedirect to="/home" />
            <Route path="/test" component={Test}></Route>
            <Route path="/test01" component={Test01}></Route>
            <Route path="/home" component={Home}></Route>
            <Route path="/en/home" component={Home}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/en/login" component={Login}></Route>
            <Route path="/group_user" component={GroupUser}></Route>
            <Route path="/en/group_user" component={GroupUser}></Route>
            <Route path="/project" component={Project}></Route>
            <Route path="/en/project" component={Project}></Route>
            <Route path="/Clubber" component={Clubber}></Route>
            <Route path="/en/Clubber" component={Clubber}></Route>
            <Route path="/clubberlogin" component={ClubberLogin}></Route>
            <Route path="/reserve" component={Reserve}></Route>
            <Route path="/orgreschange" component={OrgResChange}></Route>
            <Route path="/orgresimport" component={OrgResImport}></Route>
          </Route>
        </Router>
      </IntlProvider>
    </LocaleProvider>,
    document.getElementById('root')
  )
};

if (scripts.length) {
  scriptjs(scripts, ready);
} else {
  ready();
}
