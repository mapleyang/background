const dataUtil = {
  getServiceObject: (value) => {
    let index = value.indexOf("-");
    let object = {
      custPscId: value.slice(0, index),
      psc: value.slice(index + 1, value.length)
    }
    return object
  }
}

export default dataUtil;