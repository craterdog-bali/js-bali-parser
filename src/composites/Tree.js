/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This collection class implements a tree data structure. Each node in the tree may
 * contain zero or more children. A node with no children is an elemental component.
 * Tree nodes may also be any other type of component including catalogs, lists, sets,
 * stacks, and ranges. Collectively, all of the components including the tree nodes
 * are used to build up the parse trees that result from parsing strings containing
 * Bali Document Notation™.
 */
const utilities = require('../utilities');
const abstractions = require('../abstractions');
const Exception = require('./Exception').Exception;


// PUBLIC FUNCTIONS

/**
 * This function creates a new tree node component.
 * 
 * @param {String} type The type of the tree node component.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Tree} The new tree node component.
 */
function Tree(type, debug) {
    abstractions.Composite.call(this, type, debug);

    if (!this.isProcedural()) {
        const exception = new Exception({
            $module: '/bali/composites/Tree',
            $procedure: '$Tree',
            $exception: '$invalidParameter',
            $parameter: type,
            $text: 'An invalid tree type was passed to the constructor.'
        });
        if (this.debug > 0) console.error(exception.toString());
        throw exception;
    }

    // the array is a private attribute so methods that use it are defined in the constructor
    const array = [];

    this.toArray = function() {
        return array.slice();  // return a copy of the array
    };

    this.getSize = function() {
        return array.length;
    };

    this.addChild = function(child) {
        if (this.debug > 1) {
            const validator = new utilities.Validator(this.debug);
            validator.validateType('/bali/composites/Tree', '$addChild', '$child', child, [
                '/bali/abstractions/Component'
            ]);
        }
        child = this.convert(child, this.debug);
        array.push(child);
        child.getParent = function() { return this; };
    };

    this.getChild = function(index) {
        if (this.debug > 1) {
            const validator = new utilities.Validator(this.debug);
            validator.validateType('/bali/composites/Tree', '$getChild', '$index', index, [
                '/javascript/Number'
            ]);
        }
        index = this.normalizeIndex(index, array.length) - 1;  // JS uses zero based indexing
        return array[index];
    };

    this.getParent = function() { };  // will be reset by parent when added as a child

    this.getIterator = function() {
        const iterator = new utilities.Iterator(array);
        return iterator;
    };

    return this;
}
Tree.prototype = Object.create(abstractions.Composite.prototype);
Tree.prototype.constructor = Tree;
exports.Tree = Tree;


// PUBLIC METHODS

/**
 * This method determines whether or not this component supports iteration:
 * <pre>
 *  * iterator
 * </pre>
 * 
 * @returns {Boolean} Whether or not this component supports iteration.
 */
Tree.prototype.isSequential = function() {
    return true;
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {NodeVisitor} visitor The visitor that wants to visit this tree node.
 */
Tree.prototype.acceptVisitor = function(visitor) {
    // call the visitor method for the specific type of tree node
    const functionName = 'visit' + this.getType().slice(1);  // remove the leading '$'
    visitor[functionName](this);
};
