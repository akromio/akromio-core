"use strict";

var _core = require("@dogmalang/core");
const shuffle = _core.dogma.use(require("array-shuffle"));
const {
  Readable
} = _core.dogma.use(require("stream"));
const RunReqStream = _core.dogma.use(require("../RunReqStream"));
const JobInfo = _core.dogma.use(require("./JobInfo"));
const $Assigner = class Assigner {
  constructor(_) {
    /* c8 ignore start */if (_ == null) _ = {};
    /* c8 ignore stop */
    (0, _core.expect)('input', _['input'], Readable);
    Object.defineProperty(this, 'input', {
      value: (0, _core.coalesce)(_['input'], null),
      writable: false,
      enumerable: true
    });
    (0, _core.expect)('output', _['output'], RunReqStream);
    Object.defineProperty(this, 'output', {
      value: (0, _core.coalesce)(_['output'], null),
      writable: false,
      enumerable: true
    });
    (0, _core.expect)('jobs', _['jobs'], _core.dogma.TypeDef({
      name: 'inline',
      types: [JobInfo],
      min: 0,
      max: null
    }));
    Object.defineProperty(this, 'jobs', {
      value: (0, _core.coalesce)(_['jobs'], null),
      writable: false,
      enumerable: true
    });
    /* c8 ignore start */
    if (this._pvt_ab27666e79a50c9410a9e2a9d2bac25d___init__ instanceof Function) this._pvt_ab27666e79a50c9410a9e2a9d2bac25d___init__(_); /* c8 ignore stop */
    /* c8 ignore start */
    if (this._pvt_ab27666e79a50c9410a9e2a9d2bac25d___post__ instanceof Function) this._pvt_ab27666e79a50c9410a9e2a9d2bac25d___post__(); /* c8 ignore stop */
    /* c8 ignore start */
    if (this._pvt_ab27666e79a50c9410a9e2a9d2bac25d___validate__ instanceof Function) this._pvt_ab27666e79a50c9410a9e2a9d2bac25d___validate__(); /* c8 ignore stop */
  }
};

const Assigner = new Proxy($Assigner, {
  apply(receiver, self, args) {
    return new $Assigner(...args);
  }
});
module.exports = exports = Assigner;
Assigner.prototype._pvt_ab27666e79a50c9410a9e2a9d2bac25d_post = function () {
  const self = this;
  {
    let total = 0;
    for (const job of this.jobs) {
      total += job.weight;
    }
    if (total != 100) {
      _core.dogma.raise(TypeError(`Sum of job weights must be 100. Got: ${total}.`));
    }
  }
};
Assigner.prototype._pvt_ab27666e79a50c9410a9e2a9d2bac25d___post__ = Assigner.prototype._pvt_ab27666e79a50c9410a9e2a9d2bac25d_post;
Assigner.prototype.start = async function () {
  const self = this;
  {
    const {
      input,
      output
    } = this;
    let assignationOrder = [];
    let job;
    for await (const blankSheet of input) {
      if ((0, _core.len)(assignationOrder) == 0) {
        assignationOrder = this.generateAssignationOrder();
      }
      if (Math.round(Math.random()) == 0) {
        job = assignationOrder.shift();
      } else {
        job = assignationOrder.pop();
      }
      output.append(job);
    }
    output.end();
  }
};
Assigner.prototype.generateAssignationOrder = function () {
  const self = this;
  let order = [];
  {
    const jobs = shuffle(this.jobs);
    for (const job of jobs) {
      for (let i = 0; i < job.weight; i += 1) {
        order.push(job);
      }
    }
    order = shuffle(order);
  }
  return order;
};