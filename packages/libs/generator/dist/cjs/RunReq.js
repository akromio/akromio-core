"use strict";

var _core = require("@dogmalang/core");
const RunReq = _core.dogma.intf('RunReq', {
  registry: {
    optional: false,
    type: _core.text
  },
  catalog: {
    optional: false,
    type: _core.text
  },
  job: {
    optional: false,
    type: _core.text
  },
  args: {
    optional: true,
    type: _core.any
  }
});
module.exports = exports = RunReq;