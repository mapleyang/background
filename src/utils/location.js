const PathName = {
  getPathName: (value) => {
    return !location.hash.indexOf(value);
  }
}

export default PathName;