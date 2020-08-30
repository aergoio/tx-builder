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
})({"DcRj":[function(require,module,exports) {
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
  // the default separators except `@$`
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  autoClosingPairs: [{
    open: '{',
    close: '}'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '"',
    close: '"'
  }, {
    open: '\'',
    close: '\''
  }],
  surroundingPairs: [{
    open: '{',
    close: '}'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '"',
    close: '"'
  }, {
    open: '\'',
    close: '\''
  }, {
    open: '<',
    close: '>'
  }],
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))"),
      end: new RegExp("^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))")
    }
  }
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.kt',
  keywords: ['as', 'as?', 'break', 'class', 'continue', 'do', 'else', 'false', 'for', 'fun', 'if', 'in', '!in', 'interface', 'is', '!is', 'null', 'object', 'package', 'return', 'super', 'this', 'throw', 'true', 'try', 'typealias', 'val', 'var', 'when', 'while', 'by', 'catch', 'constructor', 'delegate', 'dynamic', 'field', 'file', 'finally', 'get', 'import', 'init', 'param', 'property', 'receiver', 'set', 'setparam', 'where', 'actual', 'abstract', 'annotation', 'companion', 'const', 'crossinline', 'data', 'enum', 'expect', 'external', 'final', 'infix', 'inline', 'inner', 'internal', 'lateinit', 'noinline', 'open', 'operator', 'out', 'override', 'private', 'protected', 'public', 'reified', 'sealed', 'suspend', 'tailrec', 'vararg', 'field', 'it'],
  operators: ['+', '-', '*', '/', '%', '=', '+=', '-=', '*=', '/=', '%=', '++', '--', '&&', '||', '!', '==', '!=', '===', '!==', '>', '<', '<=', '>=', '[', ']', '!!', '?.', '?:', '::', '..', ':', '?', '->', '@', ';', '$', '_'],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [// class name highlighting
    [/[A-Z][\w\$]*/, 'type.identifier'], // identifiers and keywords
    [/[a-zA-Z_$][\w$]*/, {
      cases: {
        '@keywords': {
          token: 'keyword.$0'
        },
        '@default': 'identifier'
      }
    }], // whitespace
    {
      include: '@whitespace'
    }, // delimiters and operators
    [/[{}()\[\]]/, '@brackets'], [/[<>](?!@symbols)/, '@brackets'], [/@symbols/, {
      cases: {
        '@operators': 'delimiter',
        '@default': ''
      }
    }], // @ annotations.
    [/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'], // numbers
    [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'], [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'], [/0[xX](@hexdigits)[Ll]?/, 'number.hex'], [/0(@octaldigits)[Ll]?/, 'number.octal'], [/0[bB](@binarydigits)[Ll]?/, 'number.binary'], [/(@digits)[fFdD]/, 'number.float'], [/(@digits)[lL]?/, 'number'], // delimiter: after number because of .\d floats
    [/[;,.]/, 'delimiter'], // strings
    [/"([^"\\]|\\.)*$/, 'string.invalid'], [/"""/, 'string', '@multistring'], [/"/, 'string', '@string'], // characters
    [/'[^\\']'/, 'string'], [/(')(@escapes)(')/, ['string', 'string.escape', 'string']], [/'/, 'string.invalid']],
    whitespace: [[/[ \t\r\n]+/, ''], [/\/\*\*(?!\/)/, 'comment.doc', '@javadoc'], [/\/\*/, 'comment', '@comment'], [/\/\/.*$/, 'comment']],
    comment: [[/[^\/*]+/, 'comment'], [/\/\*/, 'comment', '@comment'], [/\*\//, 'comment', '@pop'], [/[\/*]/, 'comment']],
    //Identical copy of comment above, except for the addition of .doc
    javadoc: [[/[^\/*]+/, 'comment.doc'], [/\/\*/, 'comment.doc', '@push'], [/\/\*/, 'comment.doc.invalid'], [/\*\//, 'comment.doc', '@pop'], [/[\/*]/, 'comment.doc']],
    string: [[/[^\\"]+/, 'string'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], [/"/, 'string', '@pop']],
    multistring: [[/[^\\"]+/, 'string'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], [/"""/, 'string', '@pop'], [/./, 'string']]
  }
};
exports.language = language;
},{}]},{},["DcRj"], null)
//# sourceMappingURL=/kotlin.e2bb4e09.js.map