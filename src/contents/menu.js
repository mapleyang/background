const MenuList = {
  group: [{
    key: "group",
    icon: "appstore",
    title: "用户管理",
    children: [{
      key: "group_user",
      icon: "",
      title: "团体用户"
    },{
      key: "group_channels",
      icon: "",
      title: "渠道用户"
    }]
  }],
  base: [{
    key: "base_physical",
    icon: "appstore",
    title: "体检服务",
    children: [{
      key: "base_physical_area",
      icon: "",
      title: "服务区域"
    },{
      key: "base_physical_institution",
      icon: "",
      title: "服务机构"
    },{
      key: "base_physical_combo",
      icon: "",
      title: "服务套餐"
    }]
  },{
    key: "base_expert",
    icon: "appstore",
    title: "专家预约",
    children: [{
      key: "base_expert_hospital",
      icon: "",
      title: "服务医院"
    }]
  }],
  analysis: [{
    key: "analysis_user",
    icon: "appstore",
    title: "用户分析"
  },{
    key: "analysis_service",
    icon: "appstore",
    title: "服务分析"
  }]
}

export default MenuList;