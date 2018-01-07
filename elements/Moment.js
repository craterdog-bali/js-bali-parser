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


/*
 * This element class captures the state and methods associated with a
 * moment element.
 */
var moment = require('moment');
var FORMATS = [
    '<Y>',
    '<Y-MM>',
    '<Y-MM-DD>',
    '<Y-MM-DDTHH>',
    '<Y-MM-DDTHH:mm>',
    '<Y-MM-DDTHH:mm:ss>',
    '<Y-MM-DDTHH:mm:ss.SSS>'
];


/**
 * This constructor creates a new moment element.
 * 
 * @param {string} value The value of the moment.
 * @returns {Moment} The new moment element.
 */
function Moment(value) {
    if (value) {
        for (var i = 0; i < FORMATS.length; i++) {
            var attempt = moment(value, FORMATS[i], true);  // true means strict mode
            if (attempt.isValid()) {
                this.value = attempt;
                this.format = FORMATS[i];
                break;
            } 
        }
        if (!this.value) throw new Error('MOMENT: An invalid value was passed to the constructor: ' + value);
    } else {
        this.value = moment();  // use the current date and time
        this.format = FORMATS[6];  // full date time format
    }
    return this;
}
Moment.prototype.constructor = Moment;
exports.Moment = Moment;


/**
 * This method returns a string representation of the moment element.
 * 
 * @returns {string} The string representation of the moment element.
 */
Moment.prototype.toString = function() {
    return this.value.format(this.format);
};