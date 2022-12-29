"use strict";

var _core = require("@dogmalang/core");
const {
  Duplex
} = _core.dogma.use(require("stream"));
const {
  Runner,
  Ops,
  PluginLoader,
  PluginParser
} = _core.dogma.use(require("@akromio/core"));
const {
  Trigger
} = _core.dogma.use(require("@akromio/trigger"));
const intervalTriggerImpl = _core.dogma.use(require("@akromio/trigger-interval"));
const JobRunCommandBase = _core.dogma.use(require("../JobRunCommandBase"));
const {
  baseOptions
} = JobRunCommandBase;
const $TriggerCommand = class TriggerCommand extends JobRunCommandBase {
  constructor(_) {
    super(_);
    /* c8 ignore start */
    if (_ == null) _ = {};
    /* c8 ignore stop */ /* c8 ignore start */
    if (_['name'] != null) (0, _core.expect)('name', _['name'], _core.list); /* c8 ignore stop */
    Object.defineProperty(this, 'name', {
      value: (0, _core.coalesce)(_['name'], ["trigger [jobName]", "t"]),
      writable: false,
      enumerable: true
    });
    /* c8 ignore start */
    if (_['desc'] != null) (0, _core.expect)('desc', _['desc'], _core.text); /* c8 ignore stop */
    Object.defineProperty(this, 'desc', {
      value: (0, _core.coalesce)(_['desc'], "Use a trigger to run a job of a catalog."),
      writable: false,
      enumerable: true
    });
    /* c8 ignore start */
    if (_['positionals'] != null) (0, _core.expect)('positionals', _['positionals'], _core.map); /* c8 ignore stop */
    Object.defineProperty(this, 'positionals', {
      value: (0, _core.coalesce)(_['positionals'], {
        ["jobName"]: {
          ["type"]: "string",
          ["desc"]: "Job name to run. If unset, defaultJobName used."
        }
      }),
      writable: false,
      enumerable: true
    });
    /* c8 ignore start */
    if (_['options'] != null) (0, _core.expect)('options', _['options'], _core.map); /* c8 ignore stop */
    Object.defineProperty(this, 'options', {
      value: (0, _core.coalesce)(_['options'], {
        ["registries"]: baseOptions.registries,
        ["catalogName"]: baseOptions.catalogName,
        ["registryAndCatalogName"]: baseOptions.registryAndCatalogName,
        ["arg"]: baseOptions.arg,
        ["onError"]: baseOptions.onError,
        ["reporter"]: baseOptions.reporter,
        ["summaryReporter"]: baseOptions.summaryReporter,
        ["answer"]: baseOptions.answer,
        ["triggerName"]: {
          ["type"]: "string",
          ["alias"]: ["trigger", "t"],
          ["desc"]: "Trigger name to use. If unset, defaultTriggerName used."
        }
      }),
      writable: false,
      enumerable: true
    });
    /* c8 ignore start */
    if (this._pvt_cd7b5fd280baca02cda40ed652e5df80___init__ instanceof Function) this._pvt_cd7b5fd280baca02cda40ed652e5df80___init__(_); /* c8 ignore stop */
    /* c8 ignore start */
    if (this._pvt_cd7b5fd280baca02cda40ed652e5df80___post__ instanceof Function) this._pvt_cd7b5fd280baca02cda40ed652e5df80___post__(); /* c8 ignore stop */
    /* c8 ignore start */
    if (this._pvt_cd7b5fd280baca02cda40ed652e5df80___validate__ instanceof Function) this._pvt_cd7b5fd280baca02cda40ed652e5df80___validate__(); /* c8 ignore stop */
  }
};

const TriggerCommand = new Proxy($TriggerCommand, {
  /* c8 ignore start */apply(receiver, self, args) {
    throw "'TriggerCommand' is abstract.";
  } /* c8 ignore stop */
});
module.exports = exports = TriggerCommand;
/* c8 ignore start */
TriggerCommand.prototype.createCatalogParser = function () {
  (0, _core.abstract)();
}; /* c8 ignore stop */
TriggerCommand.prototype.handle = async function (argv) {
  const self = this; /* c8 ignore next */
  _core.dogma.expect("argv", argv, _core.map);
  let {
    triggerName,
    catalogName,
    registryAndCatalogName,
    jobName,
    onError,
    args,
    answers,
    reporters,
    summaryReporters
  } = argv;
  {
    const registries = (0, await this.createRegistries(argv).connect());
    try {
      const ops = Ops();
      if (registryAndCatalogName) {
        catalogName = _core.dogma.getItem(registryAndCatalogName.split("://"), 1);
      }
      const decl = (0, await this.readCatalogDecl(catalogName = this.buildCatalogPath(catalogName), registries));
      if (!decl) {
        (0, _core.print)(`Job catalog '${catalogName}' not found in '${registries.registryNames}'.`);
        _core.ps.exit(1);
      }
      const globalDataset = (0, await this.createGlobalDataset({
        'catalog': decl,
        'args': args,
        'answers': answers
      }));
      const pluginParser = PluginParser();
      const catalog = (0, await this.createCatalog(decl, pluginParser, globalDataset, ops));
      const log = new Duplex({
        emitClose: true,
        read() {},
        write() {}
      });
      const engine = (0, await this.createEngine({
        ["dataset"]: catalog.dataset,
        ["onError"]: catalog.onError || onError,
        ["runner"]: Runner({
          'log': log
        }),
        ["pluginParser"]: pluginParser,
        ["ops"]: ops
      }, registries.getRegistry(decl.registryName)));
      reporters = this.createReporters(reporters, log).connect();
      ops.appendOps(...(0, _core.values)(catalog.jobs));
      const trigger = createTrigger(triggerName, catalog, engine, jobName, args);
      if (!trigger.call.jobName) {
        console.error("Catalog doesn't contain default job name.");
        _core.ps.exit(2);
      }
      let code = 0;
      trigger.start(async result => {
        {
          try {
            if (result) {
              code = 1;
            }
          } finally {
            0, await catalog.finalize();
            _core.ps.exit(code);
          }
        }
      });
    } finally {
      await _core.dogma.pawait(() => registries.disconnect());
      _core.dogma.peval(() => {
        return reporters.disconnect();
      });
    }
  }
};
function createTrigger(name, cat, engine, jobName, jobArgs) {
  let trigger;
  {
    const decl = _core.dogma.getItem(cat.triggers, name !== null && name !== void 0 ? name : cat.defaultTriggerName);
    let TriggerImpl;
    {
      var _decl$impl;
      const i = (_decl$impl = decl.impl) !== null && _decl$impl !== void 0 ? _decl$impl : name;
      switch (i) {
        case "interval":
          {
            TriggerImpl = intervalTriggerImpl.impl;
          } /* c8 ignore start */
          break;
        /* c8 ignore stop */
        default:
          {
            _core.dogma.raise(TypeError(`Invalid trigger implementation: ${i}.`));
          }
      }
    }
    trigger = Trigger({
      'name': name,
      'engine': engine,
      'call': {
        ["jobName"]: jobName !== null && jobName !== void 0 ? jobName : cat.defaultJobName,
        ["args"]: jobArgs
      },
      'triggerImpl': TriggerImpl(decl)
    });
  }
  return trigger;
}