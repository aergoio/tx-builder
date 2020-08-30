// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"RHeE":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.language = exports.conf = void 0;
var conf = {
  comments: {
    lineComment: '*'
  },
  brackets: [['[', ']'], ['(', ')']]
};
exports.conf = conf;
var abapKeywords = ['abstract', 'add', 'add-corresponding', 'adjacent', 'alias', 'aliases', 'all', 'append', 'appending', 'ascending', 'as', 'assert', 'assign', 'assigned', 'assigning', 'association', 'authority-check', 'back', 'begin', 'binary', 'block', 'bound', 'break-point', 'by', 'byte', 'class', 'call', 'cast', 'changing', 'check', 'class-data', 'class-method', 'class-methods', 'clear', 'close', 'cnt', 'collect', 'commit', 'cond', 'character', 'corresponding', 'communication', 'component', 'compute', 'concatenate', 'condense', 'constants', 'conv', 'count', 'controls', 'convert', 'create', 'currency', 'data', 'descending', 'default', 'define', 'deferred', 'delete', 'describe', 'detail', 'display', 'divide', 'divide-corresponding', 'display-mode', 'duplicates', 'deleting', 'editor-call', 'end', 'endexec', 'endfunction', 'ending', 'endmodule', 'end-of-definition', 'end-of-page', 'end-of-selection', 'end-test-injection', 'end-test-seam', 'exit-command', 'endclass', 'endmethod', 'endform', 'endinterface', 'endprovide', 'endselect', 'endtry', 'endwhile', 'enum', 'event', 'events', 'exec', 'exit', 'export', 'exporting', 'extract', 'exception', 'exceptions', 'field-symbols', 'field-groups', 'field', 'first', 'fetch', 'fields', 'format', 'frame', 'free', 'from', 'function', 'find', 'for', 'found', 'function-pool', 'generate', 'get', 'handle', 'hide', 'hashed', 'include', 'import', 'importing', 'index', 'infotypes', 'initial', 'initialization', 'id', 'is', 'in', 'interface', 'interfaces', 'init', 'input', 'insert', 'instance', 'into', 'key', 'left-justified', 'leave', 'like', 'line', 'line-count', 'line-size', 'load', 'local', 'log-point', 'length', 'left', 'leading', 'lower', 'matchcode', 'method', 'mesh', 'message', 'message-id', 'methods', 'modify', 'module', 'move', 'move-corresponding', 'multiply', 'multiply-corresponding', 'match', 'new', 'new-line', 'new-page', 'new-section', 'next', 'no', 'no-gap', 'no-gaps', 'no-sign', 'no-zero', 'non-unique', 'number', 'occurrence', 'object', 'obligatory', 'of', 'output', 'overlay', 'optional', 'others', 'occurrences', 'occurs', 'offset', 'options', 'pack', 'parameters', 'perform', 'places', 'position', 'print-control', 'private', 'program', 'protected', 'provide', 'public', 'put', 'radiobutton', 'raising', 'ranges', 'receive', 'receiving', 'redefinition', 'reduce', 'reference', 'refresh', 'regex', 'reject', 'results', 'requested', 'ref', 'replace', 'report', 'reserve', 'restore', 'result', 'return', 'returning', 'right-justified', 'rollback', 'read', 'read-only', 'rp-provide-from-last', 'run', 'scan', 'screen', 'scroll', 'search', 'select', 'select-options', 'selection-screen', 'stamp', 'source', 'subkey', 'separated', 'set', 'shift', 'single', 'skip', 'sort', 'sorted', 'split', 'standard', 'stamp', 'starting', 'start-of-selection', 'sum', 'subtract-corresponding', 'statics', 'step', 'stop', 'structure', 'submatches', 'submit', 'subtract', 'summary', 'supplied', 'suppress', 'section', 'syntax-check', 'syntax-trace', 'system-call', 'switch', 'tables', 'table', 'task', 'testing', 'test-seam', 'test-injection', 'then', 'time', 'times', 'title', 'titlebar', 'to', 'top-of-page', 'trailing', 'transfer', 'transformation', 'translate', 'transporting', 'types', 'type', 'type-pool', 'type-pools', 'unassign', 'unique', 'uline', 'unpack', 'update', 'upper', 'using', 'value', 'when', 'while', 'window', 'write', 'where', 'with', 'work', 'at', 'case', 'catch', 'continue', 'do', 'elseif', 'else', 'endat', 'endcase', 'enddo', 'endif', 'endloop', 'endon', 'if', 'loop', 'on', 'raise', 'try', 'abs', 'sign', 'ceil', 'floor', 'trunc', 'frac', 'acos', 'asin', 'atan', 'cos', 'sin', 'tan', 'cosh', 'sinh', 'tanh', 'exp', 'log', 'log10', 'sqrt', 'strlen', 'xstrlen', 'charlen', 'lines', 'numofchar', 'dbmaxlen', 'round', 'rescale', 'nmax', 'nmin', 'cmax', 'cmin', 'boolc', 'boolx', 'xsdbool', 'contains', 'contains_any_of', 'contains_any_not_of', 'matches', 'line_exists', 'ipow', 'char_off', 'count', 'count_any_of', 'count_any_not_of', 'distance', 'condense', 'concat_lines_of', 'escape', 'find', 'find_end', 'find_any_of', 'find_any_not_of', 'insert', 'match', 'repeat', 'replace', 'reverse', 'segment', 'shift_left', 'shift_right', 'substring', 'substring_after', 'substring_from', 'substring_before', 'substring_to', 'to_upper', 'to_lower', 'to_mixed', 'from_mixed', 'translate', 'bit-set', 'line_index', 'definition', 'implementation', 'public', 'inheriting', 'final'];
var language = {
  defaultToken: 'invalid',
  ignoreCase: true,
  tokenPostfix: '.abap',
  keywords: abapKeywords,
  typeKeywords: ['abap_bool', 'string', 'xstring', 'any', 'clike', 'csequence', 'numeric', 'xsequence', 'c', 'n', 'i', 'p', 'f', 'd', 't', 'x'],
  operators: ['+', '-', '/', '*', '=', '<', '>', '<=', '>=', '<>', '><', '=<', '=>', 'EQ', 'NE', 'GE', 'LE', 'CS', 'CN', 'CA', 'CO', 'CP', 'NS', 'NA', 'NP'],
  symbols: /[=><!~?&+\-*\/\^%]+/,
  tokenizer: {
    root: [[/[a-z_$][\w$]*/, {
      cases: {
        '@typeKeywords': 'keyword',
        '@keywords': 'keyword',
        '@default': 'identifier'
      }
    }], {
      include: '@whitespace'
    }, [/[:,.]/, 'delimiter'], [/[{}()\[\]]/, '@brackets'], [/@symbols/, {
      cases: {
        '@operators': 'operator',
        '@default': ''
      }
    }], [/'/, {
      token: 'string',
      bracket: '@open',
      next: '@stringquote'
    }], [/\|/, {
      token: 'string',
      bracket: '@open',
      next: '@stringtemplate'
    }], [/\d+/, 'number']],
    stringtemplate: [[/[^\\\|]+/, 'string'], [/\\\|/, 'string'], [/\|/, {
      token: 'string',
      bracket: '@close',
      next: '@pop'
    }]],
    stringquote: [[/[^\\']+/, 'string'], [/'/, {
      token: 'string',
      bracket: '@close',
      next: '@pop'
    }]],
    whitespace: [[/[ \t\r\n]+/, ''], [/^\*.*$/, 'comment'], [/\".*$/, 'comment']]
  }
};
exports.language = language;
},{}]},{},["RHeE"], null)
//# sourceMappingURL=/abap.0ef04e18.js.map