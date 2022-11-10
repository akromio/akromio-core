"use strict";

var _core = require("@dogmalang/core");
const expected = _core.dogma.use(require("@akromio/expected"));
const {
  monitor,
  simulator,
  field,
  method
} = _core.dogma.use(require("@akromio/doubles"));
const {
  Call,
  SimpleOp
} = _core.dogma.use(require("../../.."));
const OperatorBase = _core.dogma.use(require("../../../dist/cjs/ops/Operator"));
const $Operator = class Operator extends OperatorBase {
  constructor(_) {
    super(_);
    /* c8 ignore start */
    if (_ == null) _ = {};
    /* c8 ignore stop */ /* c8 ignore start */
    if (this._pvt_48df69c260d445e77106255aed97a2b0___init__ instanceof Function) this._pvt_48df69c260d445e77106255aed97a2b0___init__(_); /* c8 ignore stop */
    /* c8 ignore start */
    if (this._pvt_48df69c260d445e77106255aed97a2b0___post__ instanceof Function) this._pvt_48df69c260d445e77106255aed97a2b0___post__(); /* c8 ignore stop */
    /* c8 ignore start */
    if (this._pvt_48df69c260d445e77106255aed97a2b0___validate__ instanceof Function) this._pvt_48df69c260d445e77106255aed97a2b0___validate__(); /* c8 ignore stop */
  }
};

const Operator = new Proxy($Operator, {
  apply(receiver, self, args) {
    return new $Operator(...args);
  }
});
suite(__filename, () => {
  {
    suite("emitOpLog()", () => {
      {
        const optor = Operator();
        teardown(() => {
          {
            monitor.clearAll();
          }
        });
        test("when content is text, serialization already performed", () => {
          {
            const content = "this is the content";
            const log = monitor(simulator({
              'push': method.returns()
            }), {
              'methods': ["push"]
            });
            const call = simulator(Call, {
              'id': field.uuid(),
              'op': field({
                'returns': simulator(SimpleOp, {})
              }),
              'log': log
            });
            const out = optor.emitOpLog(call, content);
            expected(out).toHave({
              'type': "opLog",
              'opType': "simple",
              'content': content
            }).member("id").toBeUuid().member("ts").toBeTimestamp();
            expected(monitor.log(log).calls).equalTo(1);
          }
        });
        test("when content is buffer, its string representation must be used", () => {
          {
            const content = Buffer.from("this is the content");
            const log = monitor(simulator({
              'push': method.returns()
            }), {
              'methods': ["push"]
            });
            const call = simulator(Call, {
              'id': field.uuid(),
              'op': field({
                'returns': simulator(SimpleOp, {})
              }),
              'log': log
            });
            const out = optor.emitOpLog(call, content);
            expected(out).toHave({
              'type': "opLog",
              'opType': "simple",
              'content': "this is the content"
            }).member("id").toBeUuid().member("ts").toBeTimestamp();
            expected(monitor.log(log).calls).equalTo(1);
          }
        });
        test("when content is other, its string representation must be used", () => {
          {
            const content = {
              ["x"]: 12,
              ["y"]: 34,
              ["z"]: 56
            };
            const log = monitor(simulator({
              'push': method.returns()
            }), {
              'methods': ["push"]
            });
            const call = simulator(Call, {
              'id': field.uuid(),
              'op': field({
                'returns': simulator(SimpleOp, {})
              }),
              'log': log
            });
            const out = optor.emitOpLog(call, content);
            expected(out).toHave({
              'type': "opLog",
              'opType': "simple",
              'content': "{ x: 12, y: 34, z: 56 }"
            }).member("id").toBeUuid().member("ts").toBeTimestamp();
            expected(monitor.log(log).calls).equalTo(1);
          }
        });
      }
    });
  }
});