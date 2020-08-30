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
})({"Zeng":[function(require,module,exports) {
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
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  comments: {
    blockComment: ['{#', '#}']
  },
  brackets: [['{#', '#}'], ['{%', '%}'], ['{{', '}}'], ['(', ')'], ['[', ']'], // HTML
  ['<!--', '-->'], ['<', '>']],
  autoClosingPairs: [{
    open: '{# ',
    close: ' #}'
  }, {
    open: '{% ',
    close: ' %}'
  }, {
    open: '{{ ',
    close: ' }}'
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
    open: '"',
    close: '"'
  }, {
    open: '\'',
    close: '\''
  }, // HTML
  {
    open: '<',
    close: '>'
  }]
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '',
  ignoreCase: true,
  keywords: [// (opening) tags
  'apply', 'autoescape', 'block', 'deprecated', 'do', 'embed', 'extends', 'flush', 'for', 'from', 'if', 'import', 'include', 'macro', 'sandbox', 'set', 'use', 'verbatim', 'with', // closing tags
  'endapply', 'endautoescape', 'endblock', 'endembed', 'endfor', 'endif', 'endmacro', 'endsandbox', 'endset', 'endwith', // literals
  'true', 'false'],
  tokenizer: {
    root: [// whitespace
    [/\s+/], // Twig Tag Delimiters
    [/{#/, 'comment.twig', '@commentState'], [/{%[-~]?/, 'delimiter.twig', '@blockState'], [/{{[-~]?/, 'delimiter.twig', '@variableState'], // HTML
    [/<!DOCTYPE/, 'metatag.html', '@doctype'], [/<!--/, 'comment.html', '@comment'], [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, ['delimiter.html', 'tag.html', '', 'delimiter.html']], [/(<)(script)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@script'
    }]], [/(<)(style)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@style'
    }]], [/(<)((?:[\w\-]+:)?[\w\-]+)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@otherTag'
    }]], [/(<\/)((?:[\w\-]+:)?[\w\-]+)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@otherTag'
    }]], [/</, 'delimiter.html'], [/[^<]+/]],

    /**
     * Comment Tag Handling
     */
    commentState: [[/#}/, 'comment.twig', '@pop'], [/./, 'comment.twig']],

    /**
     * Block Tag Handling
     */
    blockState: [[/[-~]?%}/, 'delimiter.twig', '@pop'], // whitespace
    [/\s+/], // verbatim
    // Unlike other blocks, verbatim ehas its own state
    // transition to ensure we mark its contents as strings.
    [/(verbatim)(\s*)([-~]?%})/, ['keyword.twig', '', {
      token: 'delimiter.twig',
      next: '@rawDataState'
    }]], {
      include: 'expression'
    }],
    rawDataState: [// endverbatim
    [/({%[-~]?)(\s*)(endverbatim)(\s*)([-~]?%})/, ['delimiter.twig', '', 'keyword.twig', '', {
      token: 'delimiter.twig',
      next: '@popall'
    }]], [/./, 'string.twig']],

    /**
     * Variable Tag Handling
     */
    variableState: [[/[-~]?}}/, 'delimiter.twig', '@pop'], {
      include: 'expression'
    }],
    stringState: [// closing double quoted string
    [/"/, 'string.twig', '@pop'], // interpolation start
    [/#{\s*/, 'string.twig', '@interpolationState'], // string part
    [/[^#"\\]*(?:(?:\\.|#(?!\{))[^#"\\]*)*/, 'string.twig']],
    interpolationState: [// interpolation end
    [/}/, 'string.twig', '@pop'], {
      include: 'expression'
    }],

    /**
     * Expression Handling
     */
    expression: [// whitespace
    [/\s+/], // operators - math
    [/\+|-|\/{1,2}|%|\*{1,2}/, 'operators.twig'], // operators - logic
    [/(and|or|not|b-and|b-xor|b-or)(\s+)/, ['operators.twig', '']], // operators - comparison (symbols)
    [/==|!=|<|>|>=|<=/, 'operators.twig'], // operators - comparison (words)
    [/(starts with|ends with|matches)(\s+)/, ['operators.twig', '']], // operators - containment
    [/(in)(\s+)/, ['operators.twig', '']], // operators - test
    [/(is)(\s+)/, ['operators.twig', '']], // operators - misc
    [/\||~|:|\.{1,2}|\?{1,2}/, 'operators.twig'], // names
    [/[^\W\d][\w]*/, {
      cases: {
        '@keywords': 'keyword.twig',
        '@default': 'variable.twig'
      }
    }], // numbers
    [/\d+(\.\d+)?/, 'number.twig'], // punctuation
    [/\(|\)|\[|\]|{|}|,/, 'delimiter.twig'], // strings
    [/"([^#"\\]*(?:\\.[^#"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'/, 'string.twig'], // opening double quoted string
    [/"/, 'string.twig', '@stringState'], // misc syntactic constructs
    // These are not operators per se, but for the purposes of lexical analysis we
    // can treat them as such.
    // arrow functions
    [/=>/, 'operators.twig'], // assignment
    [/=/, 'operators.twig']],

    /**
     * HTML
     */
    doctype: [[/[^>]+/, 'metatag.content.html'], [/>/, 'metatag.html', '@pop']],
    comment: [[/-->/, 'comment.html', '@pop'], [/[^-]+/, 'comment.content.html'], [/./, 'comment.content.html']],
    otherTag: [[/\/?>/, 'delimiter.html', '@pop'], [/"([^"]*)"/, 'attribute.value.html'], [/'([^']*)'/, 'attribute.value.html'], [/[\w\-]+/, 'attribute.name.html'], [/=/, 'delimiter.html'], [/[ \t\r\n]+/]],
    // -- BEGIN <script> tags handling
    // After <script
    script: [[/type/, 'attribute.name.html', '@scriptAfterType'], [/"([^"]*)"/, 'attribute.value.html'], [/'([^']*)'/, 'attribute.value.html'], [/[\w\-]+/, 'attribute.name.html'], [/=/, 'delimiter.html'], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded',
      nextEmbedded: 'text/javascript'
    }], [/[ \t\r\n]+/], [/(<\/)(script\s*)(>)/, ['delimiter.html', 'tag.html', {
      token: 'delimiter.html',
      next: '@pop'
    }]]],
    // After <script ... type
    scriptAfterType: [[/=/, 'delimiter.html', '@scriptAfterTypeEquals'], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded',
      nextEmbedded: 'text/javascript'
    }], [/[ \t\r\n]+/], [/<\/script\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <script ... type =
    scriptAfterTypeEquals: [[/"([^"]*)"/, {
      token: 'attribute.value.html',
      switchTo: '@scriptWithCustomType.$1'
    }], [/'([^']*)'/, {
      token: 'attribute.value.html',
      switchTo: '@scriptWithCustomType.$1'
    }], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded',
      nextEmbedded: 'text/javascript'
    }], [/[ \t\r\n]+/], [/<\/script\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <script ... type = $S2
    scriptWithCustomType: [[/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded.$S2',
      nextEmbedded: '$S2'
    }], [/"([^"]*)"/, 'attribute.value.html'], [/'([^']*)'/, 'attribute.value.html'], [/[\w\-]+/, 'attribute.name.html'], [/=/, 'delimiter.html'], [/[ \t\r\n]+/], [/<\/script\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    scriptEmbedded: [[/<\/script/, {
      token: '@rematch',
      next: '@pop',
      nextEmbedded: '@pop'
    }], [/[^<]+/, '']],
    // -- END <script> tags handling
    // -- BEGIN <style> tags handling
    // After <style
    style: [[/type/, 'attribute.name.html', '@styleAfterType'], [/"([^"]*)"/, 'attribute.value.html'], [/'([^']*)'/, 'attribute.value.html'], [/[\w\-]+/, 'attribute.name.html'], [/=/, 'delimiter.html'], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded',
      nextEmbedded: 'text/css'
    }], [/[ \t\r\n]+/], [/(<\/)(style\s*)(>)/, ['delimiter.html', 'tag.html', {
      token: 'delimiter.html',
      next: '@pop'
    }]]],
    // After <style ... type
    styleAfterType: [[/=/, 'delimiter.html', '@styleAfterTypeEquals'], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded',
      nextEmbedded: 'text/css'
    }], [/[ \t\r\n]+/], [/<\/style\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <style ... type =
    styleAfterTypeEquals: [[/"([^"]*)"/, {
      token: 'attribute.value.html',
      switchTo: '@styleWithCustomType.$1'
    }], [/'([^']*)'/, {
      token: 'attribute.value.html',
      switchTo: '@styleWithCustomType.$1'
    }], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded',
      nextEmbedded: 'text/css'
    }], [/[ \t\r\n]+/], [/<\/style\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <style ... type = $S2
    styleWithCustomType: [[/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded.$S2',
      nextEmbedded: '$S2'
    }], [/"([^"]*)"/, 'attribute.value.html'], [/'([^']*)'/, 'attribute.value.html'], [/[\w\-]+/, 'attribute.name.html'], [/=/, 'delimiter.html'], [/[ \t\r\n]+/], [/<\/style\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    styleEmbedded: [[/<\/style/, {
      token: '@rematch',
      next: '@pop',
      nextEmbedded: '@pop'
    }], [/[^<]+/, '']]
  }
};
exports.language = language;
},{}]},{},["Zeng"], null)
//# sourceMappingURL=/twig.cad93ef9.js.map