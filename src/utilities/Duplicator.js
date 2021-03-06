/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://openformatted.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This class implements a duplicator that can be used to perform a deep copy of a
 * component.  Since elements are immutable, they are not copied, only referenced.
 */
const Validator = require('./Validator').Validator;
const Visitor = require('../types/Visitor').Visitor;


// This private constant sets the POSIX end of line character
const EOL = '\n';


// PUBLIC FUNCTIONS

/**
 * This function creates a new duplicator object.
 *
 * @param {Number} debug A number in the range [0..3].
 * @returns {Duplicator} The new component duplicator.
 */
const Duplicator = function(debug) {
    debug = debug || 0;

    this.duplicateComponent = function(component) {
        if (debug > 1) {
            const validator = new Validator(debug);
            validator.validateType('/bali/utilities/Duplicator', '$duplicateComponent', '$component', component, [
                '/bali/types/Component'
            ]);
        }
        const visitor = new DuplicatingVisitor(debug);
        component.acceptVisitor(visitor);
        return visitor.result;
    };

    return this;
};
Duplicator.prototype.constructor = Duplicator;
exports.Duplicator = Duplicator;


// PRIVATE CLASSES

const DuplicatingVisitor = function(debug) {
    Visitor.call(this, debug);
    return this;
};
DuplicatingVisitor.prototype = Object.create(Visitor.prototype);
DuplicatingVisitor.prototype.constructor = DuplicatingVisitor;


// acceptClause: 'accept' expression
DuplicatingVisitor.prototype.visitAcceptClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const message = tree.getItem(1);
    message.acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// angle: ANGLE
DuplicatingVisitor.prototype.visitAngle = function(angle) {
    this.visitParameters(angle.getParameters());
    const parameters = this.result;
    this.result = new angle.constructor(angle.getValue(), parameters, this.debug);
};


// arguments:
//     expression (',' expression)* |
//     /* no arguments */
DuplicatingVisitor.prototype.visitArguments = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        item.acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// arithmeticExpression: expression ('*' | '/' | '//' | '+' | '-') expression
DuplicatingVisitor.prototype.visitArithmeticExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    copy.operator = tree.operator;
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// association: element ':' component
DuplicatingVisitor.prototype.visitAssociation = function(association) {
    association.getKey().acceptVisitor(this);
    const key = this.result;
    association.getValue().acceptVisitor(this);
    const value = this.result;
    this.result = new association.constructor(key, value, this.debug);
};


// binary: BINARY
DuplicatingVisitor.prototype.visitBinary = function(binary) {
    this.visitParameters(binary.getParameters());
    const parameters = this.result;
    this.result = new binary.constructor(binary.getValue(), parameters, this.debug);
};


// block: '{' procedure '}'
DuplicatingVisitor.prototype.visitBlock = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// breakClause: 'break' 'loop'
DuplicatingVisitor.prototype.visitBreakClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    this.result = copy;
};


// checkoutClause: 'checkout' ('level' expression 'of')? recipient 'from' expression
DuplicatingVisitor.prototype.visitCheckoutClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        const item = iterator.getNext();
        item.acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// collection: list | catalog
DuplicatingVisitor.prototype.visitCollection = function(collection) {
    this.visitParameters(collection.getParameters());
    const parameters = this.result;
    const copy = new collection.constructor(parameters, this.debug);
    const iterator = collection.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        item.acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// commitClause: 'commit' expression 'to' expression
DuplicatingVisitor.prototype.visitCommitClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// comparisonExpression: expression ('<' | '=' | '>' | 'IS' | 'MATCHES') expression
DuplicatingVisitor.prototype.visitComparisonExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    copy.operator = tree.operator;
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// complementExpression: 'NOT' expression
DuplicatingVisitor.prototype.visitComplementExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// concatenationExpression: expression '&' expression
DuplicatingVisitor.prototype.visitConcatenationExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// continueClause: 'continue' 'loop'
DuplicatingVisitor.prototype.visitContinueClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    this.result = copy;
};


// defaultExpression: expression '?' expression
DuplicatingVisitor.prototype.visitDefaultExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// dereferenceExpression: '@' expression
DuplicatingVisitor.prototype.visitDereferenceExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// discardClause: 'discard' expression
DuplicatingVisitor.prototype.visitDiscardClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// duration: DURATION
DuplicatingVisitor.prototype.visitDuration = function(duration) {
    this.visitParameters(duration.getParameters());
    const parameters = this.result;
    this.result = new duration.constructor(duration.getTime().toISOString(), parameters, this.debug);
};


// evaluateClause: (recipient ':=')? expression
DuplicatingVisitor.prototype.visitEvaluateClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// exponentialExpression: <assoc=right> expression '^' expression
DuplicatingVisitor.prototype.visitExponentialExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// factorialExpression: expression '!'
DuplicatingVisitor.prototype.visitFactorialExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// function: IDENTIFIER
DuplicatingVisitor.prototype.visitFunction = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    copy.identifier = tree.identifier;
    this.result = copy;
};


// functionExpression: function '(' arguments ')'
DuplicatingVisitor.prototype.visitFunctionExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// handleClause: 'handle' symbol ('matching' expression 'with' block)+
DuplicatingVisitor.prototype.visitHandleClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// ifClause: 'if' expression 'then' block ('else' 'if' expression 'then' block)* ('else' block)?
DuplicatingVisitor.prototype.visitIfClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// inversionExpression: ('-' | '/' | '*') expression
DuplicatingVisitor.prototype.visitInversionExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    copy.operator = tree.operator;
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// indices: expression (',' expression)*
DuplicatingVisitor.prototype.visitIndices = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        item.acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// logicalExpression: expression ('AND' | 'SANS' | 'XOR' | 'OR') expression
DuplicatingVisitor.prototype.visitLogicalExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    copy.operator = tree.operator;
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// magnitudeExpression: '|' expression '|'
DuplicatingVisitor.prototype.visitMagnitudeExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// message: IDENTIFIER
DuplicatingVisitor.prototype.visitMessage = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    copy.identifier = tree.identifier;
    this.result = copy;
};


// messageExpression: expression ('.' | '<-') message '(' arguments ')'
DuplicatingVisitor.prototype.visitMessageExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    copy.operator = tree.operator;
    this.result = copy;
};


// moment: MOMENT
DuplicatingVisitor.prototype.visitMoment = function(moment) {
    const value = moment.getTimestamp().format(moment.getFormat());
    this.visitParameters(moment.getParameters());
    const parameters = this.result;
    this.result = new moment.constructor(value, parameters, this.debug);
};


// name: NAME
DuplicatingVisitor.prototype.visitName = function(name) {
    this.visitParameters(name.getParameters());
    const parameters = this.result;
    this.result = new name.constructor(name.getValue(), parameters, this.debug);
};


// number:
//    'undefined' |
//    'infinity' |
//    '∞' |
//    REAL |
//    IMAGINARY |
//    '(' REAL (',' IMAGINARY | 'e^' ANGLE 'i') ')'
DuplicatingVisitor.prototype.visitNumber = function(number) {
    this.visitParameters(number.getParameters());
    const parameters = this.result;
    this.result = new number.constructor([number.getReal(), number.getImaginary()], parameters, this.debug);
};


// parameters: '(' catalog ')'
DuplicatingVisitor.prototype.visitParameters = function(parameters) {
    if (parameters) {
        const copy = new parameters.constructor(undefined, this.debug);
        const iterator = parameters.getIterator();
        while (iterator.hasNext()) {
            var association = iterator.getNext();
            association.acceptVisitor(this);
            copy.addItem(this.result);
        }
        this.result = copy;
    } else {
        this.result = undefined;  // must remove the previous value
    }
};


// pattern: 'none' | REGEX | 'any'
DuplicatingVisitor.prototype.visitPattern = function(pattern) {
    this.visitParameters(pattern.getParameters());
    const parameters = this.result;
    this.result = new pattern.constructor(pattern.getValue(), parameters, this.debug);
};


// percent: PERCENT
DuplicatingVisitor.prototype.visitPercent = function(percent) {
    this.visitParameters(percent.getParameters());
    const parameters = this.result;
    this.result = new percent.constructor(percent.getValue(), parameters, this.debug);
};


// precedenceExpression: '(' expression ')'
DuplicatingVisitor.prototype.visitPrecedenceExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// probability: 'false' | FRACTION | 'true'
DuplicatingVisitor.prototype.visitProbability = function(probability) {
    this.visitParameters(probability.getParameters());
    const parameters = this.result;
    this.result = new probability.constructor(probability.getValue(), parameters, this.debug);
};


// procedure: '{' statements '}'
DuplicatingVisitor.prototype.visitProcedure = function(procedure) {
    procedure.getStatements().acceptVisitor(this);
    const statements = this.result;
    this.visitParameters(procedure.getParameters());
    const parameters = this.result;
    const copy = new procedure.constructor(statements, parameters, this.debug);
    this.result = copy;
};


// publishClause: 'publish' expression
DuplicatingVisitor.prototype.visitPublishClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// postClause: 'post' expression 'to' expression
DuplicatingVisitor.prototype.visitPostClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// range: ('0' | REAL)? '..' ('0' | REAL)?
DuplicatingVisitor.prototype.visitRange = function(range) {
    this.visitParameters(range.getParameters());
    const parameters = this.result;
    this.result = new range.constructor([range.getFirst(), range.getLast()], parameters, this.debug);
};


// retrieveClause: 'retrieve' recipient 'from' expression
DuplicatingVisitor.prototype.visitRetrieveClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// reference: RESOURCE
DuplicatingVisitor.prototype.visitReference = function(reference) {
    this.visitParameters(reference.getParameters());
    const parameters = this.result;
    this.result = new reference.constructor(reference.getValue(), parameters, this.debug);
};


// rejectClause: 'reject' expression
DuplicatingVisitor.prototype.visitRejectClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const message = tree.getItem(1);
    message.acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// returnClause: 'return' expression?
DuplicatingVisitor.prototype.visitReturnClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// saveClause: 'save' expression ('as' recipient)?
DuplicatingVisitor.prototype.visitSaveClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// selectClause: 'select' expression 'from' (expression 'do' block)+ ('else' block)?
DuplicatingVisitor.prototype.visitSelectClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// statement: mainClause handleClause?
DuplicatingVisitor.prototype.visitStatement = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// statements:
//     statement (';' statement)* |
//     EOL (statement EOL)* |
//     {empty procedure}
DuplicatingVisitor.prototype.visitStatements = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};


// attribute: variable '[' indices ']'
DuplicatingVisitor.prototype.visitAttribute = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// attributeExpression: expression '[' indices ']'
DuplicatingVisitor.prototype.visitAttributeExpression = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// symbol: SYMBOL
DuplicatingVisitor.prototype.visitSymbol = function(symbol) {
    this.visitParameters(symbol.getParameters());
    const parameters = this.result;
    this.result = new symbol.constructor(symbol.getValue(), parameters, this.debug);
};


// tag: TAG
DuplicatingVisitor.prototype.visitTag = function(tag) {
    this.visitParameters(tag.getParameters());
    const parameters = this.result;
    this.result = new tag.constructor(tag.getValue(), parameters, this.debug);
};


// text: TEXT | TEXT_BLOCK
DuplicatingVisitor.prototype.visitText = function(text) {
    this.visitParameters(text.getParameters());
    const parameters = this.result;
    this.result = new text.constructor(text.getValue(), parameters, this.debug);
};


// throwClause: 'throw' expression
DuplicatingVisitor.prototype.visitThrowClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// variable: IDENTIFIER
DuplicatingVisitor.prototype.visitVariable = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    copy.identifier = tree.identifier;
    this.result = copy;
};


// version: VERSION
DuplicatingVisitor.prototype.visitVersion = function(version) {
    this.visitParameters(version.getParameters());
    const parameters = this.result;
    this.result = new version.constructor(version.getValue(), parameters, this.debug);
};


// whileClause: 'while' expression 'do' block
DuplicatingVisitor.prototype.visitWhileClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    tree.getItem(1).acceptVisitor(this);
    copy.addItem(this.result);
    tree.getItem(2).acceptVisitor(this);
    copy.addItem(this.result);
    this.result = copy;
};


// withClause: 'with' ('each' symbol 'in')? expression 'do' block
DuplicatingVisitor.prototype.visitWithClause = function(tree) {
    const copy = new tree.constructor(tree.getType(), this.debug);
    const iterator = tree.getIterator();
    while (iterator.hasNext()) {
        iterator.getNext().acceptVisitor(this);
        copy.addItem(this.result);
    }
    this.result = copy;
};
