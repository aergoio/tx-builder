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
})({"ASoI":[function(require,module,exports) {
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
    open: '<',
    close: '>',
    notIn: ['string']
  }],
  surroundingPairs: [{
    open: '(',
    close: ')'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '`',
    close: '`'
  }],
  folding: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#?region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#?endregion\\b.*-->")
    }
  }
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.rst',
  control: /[\\`*_\[\]{}()#+\-\.!]/,
  escapes: /\\(?:@control)/,
  empty: ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'isindex', 'link', 'meta', 'param'],
  alphanumerics: /[A-Za-z0-9]/,
  alphanumericsplus: /[A-Za-z0-9-_+:.]/,
  simpleRefNameWithoutBq: /(?:@alphanumerics@alphanumericsplus*@alphanumerics)+|(?:@alphanumerics+)/,
  simpleRefName: /(?:`@simpleRefNameWithoutBq`|@simpleRefNameWithoutBq)/,
  phrase: /@simpleRefName(?:\s@simpleRefName)*/,
  citationName: /[A-Za-z][A-Za-z0-9-_.]*/,
  blockLiteralStart: /(?:[!"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]|[\s])/,
  precedingChars: /(?:[ -:/'"<([{])/,
  followingChars: /(?:[ -.,:;!?/'")\]}>]|$)/,
  punctuation: /(=|-|~|`|#|"|\^|\+|\*|:|\.|'|_|\+)/,
  tokenizer: {
    root: [//sections
    [/^(@punctuation{3,}$){1,1}?/, 'keyword'], //line-blocks
    //No rules on it
    //bullet-lists
    [/^\s*([\*\-+‣•]|[a-zA-Z0-9]+\.|\([a-zA-Z0-9]+\)|[a-zA-Z0-9]+\))\s/, 'keyword'], //literal-blocks
    [/([ ]::)\s*$/, 'keyword', '@blankLineOfLiteralBlocks'], [/(::)\s*$/, 'keyword', '@blankLineOfLiteralBlocks'], {
      include: '@tables'
    }, {
      include: '@explicitMarkupBlocks'
    }, {
      include: '@inlineMarkup'
    }],
    explicitMarkupBlocks: [//citations
    {
      include: '@citations'
    }, //footnotes
    {
      include: '@footnotes'
    }, //directives
    [/^(\.\.\s)(@simpleRefName)(::\s)(.*)$/, [{
      token: '',
      next: 'subsequentLines'
    }, 'keyword', '', '']], //hyperlink-targets
    [/^(\.\.)(\s+)(_)(@simpleRefName)(:)(\s+)(.*)/, [{
      token: '',
      next: 'hyperlinks'
    }, '', '', 'string.link', '', '', 'string.link']], //anonymous-hyperlinks
    [/^((?:(?:\.\.)(?:\s+))?)(__)(:)(\s+)(.*)/, [{
      token: '',
      next: 'subsequentLines'
    }, '', '', '', 'string.link']], [/^(__\s+)(.+)/, ['', 'string.link']], //substitution-definitions
    [/^(\.\.)( \|)([^| ]+[^|]*[^| ]*)(\| )(@simpleRefName)(:: .*)/, [{
      token: '',
      next: 'subsequentLines'
    }, '', 'string.link', '', 'keyword', ''], '@rawBlocks'], [/(\|)([^| ]+[^|]*[^| ]*)(\|_{0,2})/, ['', 'string.link', '']], //comments
    [/^(\.\.)([ ].*)$/, [{
      token: '',
      next: '@comments'
    }, 'comment']]],
    inlineMarkup: [{
      include: '@citationsReference'
    }, {
      include: '@footnotesReference'
    }, //hyperlink-references
    [/(@simpleRefName)(_{1,2})/, ['string.link', '']], //embedded-uris-and-aliases
    [/(`)([^<`]+\s+)(<)(.*)(>)(`)(_)/, ['', 'string.link', '', 'string.link', '', '', '']], //emphasis
    [/\*\*([^\\*]|\*(?!\*))+\*\*/, 'strong'], [/\*[^*]+\*/, 'emphasis'], //inline-literals
    [/(``)((?:[^`]|\`(?!`))+)(``)/, ['', 'keyword', '']], [/(__\s+)(.+)/, ['', 'keyword']], //interpreted-text
    [/(:)((?:@simpleRefNameWithoutBq)?)(:`)([^`]+)(`)/, ['', 'keyword', '', '', '']], [/(`)([^`]+)(`:)((?:@simpleRefNameWithoutBq)?)(:)/, ['', '', '', 'keyword', '']], [/(`)([^`]+)(`)/, ''], //inline-internal-targets
    [/(_`)(@phrase)(`)/, ['', 'string.link', '']]],
    citations: [[/^(\.\.\s+\[)((?:@citationName))(\]\s+)(.*)/, [{
      token: '',
      next: '@subsequentLines'
    }, 'string.link', '', '']]],
    citationsReference: [[/(\[)(@citationName)(\]_)/, ['', 'string.link', '']]],
    footnotes: [[/^(\.\.\s+\[)((?:[0-9]+))(\]\s+.*)/, [{
      token: '',
      next: '@subsequentLines'
    }, 'string.link', '']], [/^(\.\.\s+\[)((?:#@simpleRefName?))(\]\s+)(.*)/, [{
      token: '',
      next: '@subsequentLines'
    }, 'string.link', '', '']], [/^(\.\.\s+\[)((?:\*))(\]\s+)(.*)/, [{
      token: '',
      next: '@subsequentLines'
    }, 'string.link', '', '']]],
    footnotesReference: [[/(\[)([0-9]+)(\])(_)/, ['', 'string.link', '', '']], [/(\[)(#@simpleRefName?)(\])(_)/, ['', 'string.link', '', '']], [/(\[)(\*)(\])(_)/, ['', 'string.link', '', '']]],
    blankLineOfLiteralBlocks: [[/^$/, '', '@subsequentLinesOfLiteralBlocks'], [/^.*$/, '', '@pop']],
    subsequentLinesOfLiteralBlocks: [[/(@blockLiteralStart+)(.*)/, ['keyword', '']], [/^(?!blockLiteralStart)/, '', '@popall']],
    subsequentLines: [[/^[\s]+.*/, ''], [/^(?!\s)/, '', '@pop']],
    hyperlinks: [[/^[\s]+.*/, 'string.link'], [/^(?!\s)/, '', '@pop']],
    comments: [[/^[\s]+.*/, 'comment'], [/^(?!\s)/, '', '@pop']],
    tables: [[/\+-[+-]+/, 'keyword'], [/\+=[+=]+/, 'keyword']]
  }
};
exports.language = language;
},{}]},{},["ASoI"], null)
//# sourceMappingURL=/restructuredtext.8dec4a49.js.map