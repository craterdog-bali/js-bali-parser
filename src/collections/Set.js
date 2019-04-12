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
 * This collection class implements an ordered set of components that does not allow
 * duplicate items. A set automatically orders its items based on the natural order
 * defined by the <code>Comparator</code> class.
 */
const utilities = require('../utilities');
const abstractions = require('../abstractions');
const composites = require('../composites');
const Catalog = require('./Catalog').Catalog;


// PUBLIC CONSTRUCTORS

/**
 * This constructor creates a new set component with optional parameters that are
 * used to parameterize its type.
 * 
 * @param {Parameters} parameters Optional parameters used to parameterize this set. 
 * @param {Comparator} comparator An optional comparator.
 * @returns {Set} The new set.
 */
function Set(parameters, comparator) {
    parameters = parameters || new composites.Parameters(new Catalog());
    if (!parameters.getParameter('$type')) parameters.setParameter('$type', '/bali/types/Set/v1');
    abstractions.Collection.call(this, utilities.types.SET, parameters);

    // the comparator and tree are private attributes so methods that use
    // them are defined in the constructor
    comparator = comparator || new utilities.Comparator();
    const tree = new RandomizedTree(comparator);

    this.acceptVisitor = function(visitor) {
        visitor.visitSet(this);
    };

    this.toArray = function() {
        const array = [];
        const iterator = new TreeIterator(tree);
        while (iterator.hasNext()) array.push(iterator.getNext());
        return array;
    };

    this.getComparator = function() {
        return comparator;
    };
    
    this.getSize = function() {
        return tree.size;
    };
    
    this.getIterator = function() {
        return new TreeIterator(tree);
    };
    
    this.getIndex = function(item) {
        item = this.convert(item);
        return tree.index(item) + 1;  // convert to ordinal based indexing
    };
    
    this.getItem = function(index) {
        index = this.normalizeIndex(index) - 1;  // convert to javascript zero based indexing
        return tree.node(index).value;
    };
    
    this.addItem = function(item) {
        item = this.convert(item);
        return tree.insert(item);
    };
    
    this.removeItem = function(item) {
        item = this.convert(item);
        return tree.remove(item);
    };
    
    this.removeItems = function(items) {
        var count = 0;
        const iterator = items.getIterator();
        while (iterator.hasNext()) {
            const item = iterator.getNext();
            if (this.removeItem(item)) {
                count++;
            }
        }
        return count;
    };

    this.deleteAll = function() {
        tree.clear();
    };
    

    return this;
}
Set.prototype = Object.create(abstractions.Collection.prototype);
Set.prototype.constructor = Set;
exports.Set = Set;


// PUBLIC FUNCTIONS

/**
 * This function returns a new set that contains all the items that are in
 * the first set or the second set or both.
 *
 * @param {Set} first The first set to be operated on.
 * @param {Set} second The second set to be operated on.
 * @returns {Set} The resulting set.
 */
Set.or = function(first, second) {
    const result = new Set();
    result.addItems(first);
    result.addItems(second);
    return result;
};


/**
 * This function returns a new set that contains the items that are in
 * both the first set and the second set.
 *
 * @param {Set} first The first set to be operated on.
 * @param {Set} second The second set to be operated on.
 * @returns {Set} The resulting set.
 */
Set.and = function(first, second) {
    const result = new Set(first.getParameters(), first.comparator);
    const iterator = first.getIterator();
    while (iterator.hasNext()) {
        const item = iterator.getNext();
        if (second.containsItem(item)) {
            result.addItem(item);
        }
    }
    return result;
};


/**
 * This function returns a new set that contains the items that are in
 * the first set but not in the second set.
 *
 * @param {Set} first The first set to be operated on.
 * @param {Set} second The second set to be operated on.
 * @returns {Set} The resulting set.
 */
Set.sans = function(first, second) {
    const result = new Set(first.getParameters(), first.comparator);
    result.addItems(first);
    result.removeItems(second);
    return result;
};


/**
 * This function returns a new set that contains all the items that are in
 * the first set or the second set but not both.
 *
 * @param {Set} first The first set to be operated on.
 * @param {Set} second The second set to be operated on.
 * @returns {Set} The resulting set.
 */
Set.xor = function(first, second) {
    const result = new Set(first.getParameters(), first.comparator);
    const iterator1 = first.getIterator();
    var item1;
    const iterator2 = second.getIterator();
    var item2;
    while (iterator1.hasNext() && iterator2.hasNext()) {
        if (item1 === undefined) item1 = iterator1.getNext();
        if (item2 === undefined) item2 = iterator2.getNext();
        const signum = item1.comparedTo(item2);
        switch (signum) {
            case -1:
                result.addItem(item1);
                item1 = undefined;
                break;
            case 0:
                item1 = undefined;
                item2 = undefined;
                break;
            case 1:
                result.addItem(item2);
                item2 = undefined;
                break;
        }
    }
    while (iterator1.hasNext()) {
        item1 = iterator1.getNext();
        result.addItem(item1);
    }
    while (iterator2.hasNext()) {
        item2 = iterator2.getNext();
        result.addItem(item2);
    }
    return result;
};


// PRIVATE CLASSES

/*
 * The set class is backed by a binary tree (treap) structure. Therefore,
 * it can be traversed more efficiently using a custom iterator. This class implements a tree iterator.
 */

function TreeIterator(tree) {

    // the tree, current slot index, and previous and next pointers are private attributes
    // so methods that use them are defined in the constructor
    var currentSlot = 0;  // the slot before the first item
    var previous = undefined;
    var next = minimum(tree.root);

    this.toStart = function() {
        currentSlot = 0;  // the slot before the first item
        previous = undefined;
        next = minimum(tree.root);
    };

    this.toSlot = function(slot) {
        currentSlot = slot;
        previous = tree.node(slot - 1);  // javascript index of item before the slot
        next = successor(previous);
    };

    this.toEnd = function() {
        currentSlot = tree.size;  // the slot after the last item
        previous = maximum(tree.root);
        next = undefined;
    };

    this.hasPrevious = function() {
        return currentSlot > 0;
    };

    this.hasNext = function() {
        return currentSlot < tree.size;
    };

    this.getPrevious = function() {
        if (!this.hasPrevious()) return;
        const value = previous.value;
        next = previous;
        previous = predecessor(next);
        currentSlot--;
        return value;
    };

    this.getNext = function() {
        if (!this.hasNext()) return;
        const value = next.value;
        previous = next;
        next = successor(previous);
        currentSlot++;
        return value;
    };

    return this;
}
TreeIterator.prototype.constructor = TreeIterator;


/*
 * This class implements a randomized self balancing binary search tree structure (treap).
 * It maintains an ordering of the values in the tree and provides O(log(n)) search and
 * update performance.
 */

function RandomizedTree(comparator) {
    // NOTE: we don't want to make these attributes private because of the performance
    // issues with having each node in the tree have its own local methods.
    this.size = 0;
    this.comparator = comparator;
    return this;
}
RandomizedTree.prototype.constructor = RandomizedTree;


RandomizedTree.prototype.contains = function(value) {
    return this.find(value) !== undefined;
};


RandomizedTree.prototype.index = function(value) {
    var index = 0;
    var candidate = minimum(this.root);
    while (candidate && !this.comparator.componentsAreEqual(candidate.value, value)) {
        candidate = successor(candidate);
        index++;
    }
    if (candidate) {
        return index;
    } else {
        return -1;
    }
};


RandomizedTree.prototype.node = function(index) {
    var candidate = minimum(this.root);
    while (index > 0 && index < this.size) {
        candidate = successor(candidate);
        index--;
    }
    return candidate;
};


RandomizedTree.prototype.insert = function(value) {
    // handle the empty tree case
    if (this.root === undefined) {
        this.root = {value: value, priority: Math.random()};
        this.size++;
        return true;
    }

    // find the parent of the new node
    var parent;
    var candidate = this.root;
    while (candidate && candidate.value) {
        parent = candidate;
        switch (this.comparator.compareComponents(candidate.value, value)) {
            case 1:
                candidate = candidate.left;
                break;
            case 0:
                // the value is already in the tree
                return false;
            case -1:
                candidate = candidate.right;
                break;
        }
    }

    // insert the new node as a child of the parent
    const child = { value: value, parent: parent, priority: Math.random()};
    switch (this.comparator.compareComponents(parent.value, value)) {
        case 1:
            parent.left = child;
            break;
        case 0:
        case -1:
            parent.right = child;
            break;
    }
    this.size++;

    // rebalance the tree by randomized priorities
    while (child !== this.root) {
        parent = child.parent;
        if (parent.priority < child.priority) {
            if (child === parent.left) {
                this.rotateRight(parent);
            } else {
                this.rotateLeft(parent);
            }
        } else {
            break;
        }
    }
    return true;
};


RandomizedTree.prototype.remove = function(value) {
    const candidate = this.find(value);
    if (candidate) {
        // rotate the candidate down to leaf
        this.rotateDown(candidate);

        // then remove it
        if (candidate.left === undefined) {
            this.replace(candidate, candidate.right);
        } else if (candidate.right === undefined) {
            this.replace(candidate, candidate.left);
        } else {
            const successor = minimum(candidate.right);
            if (successor.parent !== candidate) {
                this.replace(successor, successor.right);
                successor.right = candidate.right;
                successor.right.parent = successor;
            }
            this.replace(candidate, successor);
            successor.left = candidate.left;
            successor.left.parent = successor;
        }

        // clean up
        candidate.value = undefined;
        candidate.parent = undefined;
        candidate.left = undefined;
        candidate.right = undefined;
        candidate.priority = undefined;
        this.size--;
        return true;
    } else {
        // the value was not found in the tree
        return false;
    }
};


RandomizedTree.prototype.clear = function() {
    this.root = undefined;
    this.size = 0;
};


RandomizedTree.prototype.find = function(value) {
    var candidate = this.root;
    while (candidate && candidate.value) {
        switch (this.comparator.compareComponents(candidate.value, value)) {
            case -1:
                candidate = candidate.right;
                break;
            case 0:
                return candidate;
            case 1:
                candidate = candidate.left;
                break;
        }
    }
    return candidate;
};

RandomizedTree.prototype.replace = function(old, replacement) {
    if (old.parent === undefined) {
        this.root = replacement;
    } else if (old === old.parent.left) {
        old.parent.left = replacement;
    } else {
        old.parent.right = replacement;
    }
    if (replacement) {
        replacement.parent = old.parent;
    }
};


RandomizedTree.prototype.rotateLeft = function(node) {
    const temporary = node.right;
    temporary.parent = node.parent;

    node.right = temporary.left;
    if (node.right) {
        node.right.parent = node;
    }

    temporary.left = node;
    node.parent = temporary;

    if (temporary.parent) {
        if (node === temporary.parent.left) {
            temporary.parent.left = temporary;
        } else {
            temporary.parent.right = temporary;
        }
    } else {
        this.root = temporary;
    }
};


RandomizedTree.prototype.rotateRight = function(node) {
    const temporary = node.left;
    temporary.parent = node.parent;

    node.left = temporary.right;
    if (node.left) {
        node.left.parent = node;
    }

    temporary.right = node;
    node.parent = temporary;

    if (temporary.parent) {
        if (node === temporary.parent.left) {
            temporary.parent.left = temporary;
        } else {
            temporary.parent.right = temporary;
        }
    } else {
        this.root = temporary;
    }
};


RandomizedTree.prototype.rotateDown = function(node) {
    while (true) {
        if (node.left) {
            var leftHigherPriority = node.right === undefined || node.left.priority >= node.right.priority;
            if (leftHigherPriority) {
                this.rotateRight(node);
            } else {
                this.rotateLeft(node);
            }
        } else if (node.right) {
            this.rotateLeft(node);
        } else {
            break;
        }
    }
};


// PRIVATE FUNCTIONS

function minimum(node) {
    while (node && node.left) {
        node = node.left;
    }
    return node;
}


function maximum(node) {
    while (node && node.right) {
        node = node.right;
    }
    return node;
}


function predecessor(node) {
    if (node.left) {
        // there is a left branch, so the predecessor is the rightmost node of that subtree
        return maximum(node.left);
    } else {
        // it is the lowest ancestor whose right child is also an ancestor of node
        var current = node;
        var parent = node.parent;
        while (parent && current === parent.left) {
            current = parent;
            parent = parent.parent;
        }
        return parent;
    }
}


function successor(node) {
    if (node.right) {
        // there is a right branch, so the successor is the leftmost node of that subtree
        return minimum(node.right);
    } else {
        // it is the lowest ancestor whose left child is also an ancestor of node
        var current = node;
        var parent = node.parent;
        while (parent && current === parent.right) {
            current = parent;
            parent = parent.parent;
        }
        return parent;
    }
}

