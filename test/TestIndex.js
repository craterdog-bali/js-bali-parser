/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

var mocha = require('mocha');
var expect = require('chai').expect;

describe('Bali Component Framework™', function() {

    describe('Test the require of the top level index.', function() {

        it('should create the initial task context', function() {
            var bali = require('../index.js');
            expect(bali).to.exist;  // jshint ignore:line
        });

    });

});