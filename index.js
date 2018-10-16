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

// GENERAL UTILITIES

exports.formatter = require('./src/utilities/DocumentFormatter');
exports.parser = require('./src/utilities/DocumentParser');
exports.codex = require('./src/utilities/Codex');


// ABSTRACT TYPES

exports.types = require('./src/abstractions/Types');
exports.Component = require('./src/abstractions/Component').Component;
exports.Element = require('./src/abstractions/Element').Element;
exports.Composite = require('./src/abstractions/Composite').Composite;
exports.Collection = require('./src/abstractions/Collection').Collection;
exports.SortableCollection = require('./src/abstractions/SortableCollection').SortableCollection;
exports.OrderedCollection = require('./src/abstractions/OrderedCollection').OrderedCollection;


// PRIMITIVE ELEMENT TYPES

exports.Angle = require('./src/elements/Angle').Angle;
exports.Binary = require('./src/elements/Binary').Binary;
exports.Complex = require('./src/elements/Complex').Complex;
exports.Duration = require('./src/elements/Duration').Duration;
exports.Identifier = require('./src/elements/Identifier').Identifier;
exports.Moment = require('./src/elements/Moment').Moment;
exports.Percent = require('./src/elements/Percent').Percent;
exports.Probability = require('./src/elements/Probability').Probability;
exports.Reference = require('./src/elements/Reference').Reference;
exports.Source = require('./src/elements/Source').Source;
exports.Symbol = require('./src/elements/Symbol').Symbol;
exports.Tag = require('./src/elements/Tag').Tag;
exports.Template = require('./src/elements/Template').Template;
exports.Text = require('./src/elements/Text').Text;
exports.Version = require('./src/elements/Version').Version;


// PRIMITIVE COMPOSITE TYPES

exports.Association = require('./src/composites/Association').Association;
exports.Document = require('./src/composites/Document').Document;
exports.Seal = require('./src/composites/Seal').Seal;
exports.Parameters = require('./src/composites/Parameters').Parameters;
exports.Iterator = require('./src/composites/Iterator').Iterator;
exports.Range = require('./src/composites/Range').Range;
exports.List = require('./src/composites/List').List;
exports.Set = require('./src/composites/Set').Set;
exports.Stack = require('./src/composites/Stack').Stack;
exports.Catalog = require('./src/composites/Catalog').Catalog;
exports.Tree = require('./src/composites/Tree').Tree;
exports.Procedure = require('./src/composites/Procedure').Procedure;

