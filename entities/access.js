"use strict";

var VariableDelcaration = require('./variabledeclaration.js');
var VariableReference = require('./variablereference.js');
var Function = require('./function.js');
var FunctionCall = require('./functioncall.js');
var Type = require('./type.js');
var error = require('../error.js');

class Access {
    constructor(id, exps) {
        this.id = id;
        this.exps = exps;
    }

    toString() {
        console.log("Access toString");
        console.log(this.id);
        if (this.id instanceof FunctionCall) { // hardcoding edge case for now
            console.log("case1");
            return this.id + "[" + this.exps.join('][') + "]";
        } else {
            console.log("case2");
            return this.id.token.lexeme + "[" + this.exps.join('][') + "]";
        }
    }

    analyze(context) {
        console.log("inside Access analyze");
        // check if list is already declared

        var variable = context.lookupVariable(this.id.getToken()); // this returns a VarDecl

        console.log(variable);
        var varElements;
        if (variable instanceof VariableDelcaration) {

            // implement function return types
            // need to check for index out of bounds exception
            variable = variable.getExp();

        } 
        // might not need these
        // else if (variable.type === Type.ITERABLE) {
        //     varElements = variable.exp.elements.length;
        // } else if (variable.type === Type.OBJECT) {
        //
        // }
        variable.analyze(context);
        variable.type.canBeIterOrObj("Variable not of type ITERABLE or type OBJECT", variable);

        console.log("variable ))()()()()()()()()()()()(");
        console.log(variable);
        if (this.exps.length > 0 && this.exps[0]) {
            for (var i = 0; i < this.exps.length; i++) {
                this.exps[i].analyze(context);
                var checkVar = this.exps[i];
                if (checkVar instanceof VariableReference) {
                    checkVar = context.lookupVariable(checkVar.getToken());
                    console.log(checkVar);
                }
                checkVar.type.canBeIntOrString("Index not an integer or a string", checkVar);
            }
        } else {
            error("No index parameter specified", this.id);
        }

        console.log("leaving Access analyze");
    }
}

module.exports = Access;