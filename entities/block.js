"use strict";

var ReturnStatement = require('./returnstatement.js');

var Block = (function() {
  function Block(statements) {
    this.statements = statements;
  }

  Block.prototype.toString = function() {
    return "(Block " + (this.statements.join(' ')) + ")";
  };

  Block.prototype.analyze = function(context) {
    var i, len, localContext, ref, results, statement;
    localContext = context.getInsideFunction() ? context : context.createChildContext();
    ref = this.statements;
    results = [];
    if (ref[0]) {
      for (i = 0, len = ref.length; i < len; i++) {
        statement = ref[i];
        results.push(statement.analyze(localContext));
      }
    }
    return results;
  };

  Block.prototype.optimize = function() {
    var temporary = [];
    var extraneous = false;
    for (var i = 0; i < this.statements.length; i += 1) {
      if (this.statements[i] instanceof ReturnStatement) {
        temporary = this.statements.slice(0, i + 1);
        extraneous = true;
      }
    }
    if (extraneous) {
      this.statements = temporary.slice();
    }

    var s;
    this.statements = (function() {
      var ref = this.statements;
      var results = [];
      for (var i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        results.push(s.optimize());
      }
      return results;
    }).call(this);
    this.statements = (function() {
      var ref = this.statements;
      var results = [];
      for (var i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (s !== null) {
          results.push(s);
        }
      }
      return results;
    }).call(this);
    return this;
  };

  return Block;

})();

module.exports = Block;