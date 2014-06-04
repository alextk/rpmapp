/*
 * jqExt - jQuery extensions and native javascript extensions
 *
 * Version: 0.0.4
 * Build: 33
 * Copyright 2011 Alex Tkachev
 *
 * Dual licensed under MIT or GPLv2 licenses
 *   http://en.wikipedia.org/wiki/MIT_License
 *   http://en.wikipedia.org/wiki/GNU_General_Public_License
 *
 * Date: 16 Oct 2013 16:03:36
 */

/**
 * Define jQuery.ext namespace and extender utility methods
 */
(function($) {

  /**
   * @namespace $.ext
   * a namespace that contains all jqExt custom classes and utility methods. jqExt doesn't pollute global namespace
   * and groups all its code inside $.ext namespace.
   */
  $.ext = {
    /** special variable that is used to break from event fire and enumeration looping */
    $break: {}
  };

  /**
   * @namespace $.ext.mixins
   * a namespace where all mixins are defined and can be included into objects
   */
  $.ext.mixins = {};

  /**
   * @object {public} $.ext.Extender
   * Extender is an object with two static utility functions that allow to easily extend jQuery: to add utility methods
   * on jQuery object and to create plugins (that will be available as wrapped set methods).
   */
  $.ext.Extender = {

    /**
     * @function {public static void} ?
     * Add methods that will be available on jQuery wrapped set instance
     * @param {Hash} methods - hash of methodName: function
     * @param {optional boolean} keepOriginal - if true, original method will be kept under jq_original_[methodName]
     */
    addWrapedSetMethods: function(methods, keepOriginal) {
      for (var m in methods) {
        if (keepOriginal && jQuery.fn[m]) {
          jQuery.fn['jq_original_' + m] = jQuery.fn[m];
        }
        jQuery.fn[m] = methods[m];
      }
    },

    /**
     * @function {public static void} ?
     * Add methods that will be available on jQuery object instance
     * @param {Hash} methods - hash of methodName: function
     */
    addUtilityMethods: function(methods) {
      for (var m in methods) {
        jQuery[m] = methods[m];
      }
    }
  };

})(jQuery);
(function($) {

  /**
   * @namespace Object
   */
  var mixin = {

    keys: function(obj) {
      var results = [];
      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          results.push(property);
        }
      }
      return results;
    },

    //return new object that contains only given attributes as parameter
    slice: function(obj, attributes){
      var result = {};
      for(var property in obj){
        if (obj.hasOwnProperty(property) && attributes.include(property)) {
          result[property] = obj[property];
        }
      }
      return result;
    },

    each: function(obj, iterator, context){
      try {
        if(arguments.length == 2) context = obj;
        for(var property in obj){
          if (obj.hasOwnProperty(property)) {
            iterator.call(context, property, obj[property]);
          }
        }
      } catch (e) {
        if (e != $.ext.$break) throw e;
      }
    }

  };

  // use native browser JS 1.6 implementation if available
  if (Object.keys) { delete mixin.keys; }

  $.extend(Object, mixin);

})(jQuery);
/**
 * Add utility method to jQuery object to test for additional parameters types
 */
jQuery.ext.Extender.addUtilityMethods({

  /**
   * @function {public static boolean} $.?
   * @param obj
   */
  isBoolean: function(obj){
    return jQuery.type(obj) === "boolean";
  },

  /**
   * @function {public static boolean} $.?
   * @param obj
   */
  isNumber: function(obj){
    return jQuery.type(obj) === "number";
  },

  /**
   * @function {public static boolean} $.?
   * @param obj
   */
  isDate: function(obj){
    return jQuery.type(obj) === "date";
  },

  /**
   * @function {public static boolean} $.?
   * @param obj
   */
  isString: function(obj){
    return jQuery.type(obj) === "string";
  },

  /**
   * @function {public static boolean} $.?
   * @param obj
   */
  isUndefined: function(obj){
    return jQuery.type(obj) === "undefined";
  }

});
(function($) {

  /**
   * @namespace $.ext.mixins.Enumerable
   * Enumerable provides a large set of useful methods for enumerations — objects that act as collections of values.
   * Enumerable is a mixin: a set of methods intended not for standaone use, but for incorporation into other objects.
   * jqExt mixes Enumerable into Array class (making all methods of Enumerable available on array instances).
   *
   * The Enumerable module basically makes only one requirement on your object: it must provide a method
   * named `_each` (note the leading underscore) that will accept a function as its unique argument,
   * and will contain the actual "raw iteration" algorithm, invoking its argument with each element in turn.
   * jqExt provides this method for array implementation (adds it to Array.prototype), but if you want to mix enumerable
   * into your own object, you have to implement _each method.
   *
   * <p> @depends $.ext </p>
   */
  var Enumerable = {

    /**
     * <h6>Example:</h6>
     * <pre>
     *  ['one', 'two', 'three'].each(alert);
     *  // Alerts "one", then alerts "two", then alerts "three"
     * </pre>
     *
     * @function {public Enumerable} ?
     * Calls <tt>iterator</tt> for each item in the collection.
     * @param {Function} iterator - A <tt>Function(item, index)</tt> that expects an item in the collection as the first argument and a numerical index as the second.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns this enumerable instance
     **/
    each: function(iterator, context) {
      var index = 0;
      if(arguments.length == 1) context = this;
      try {
        this._each(function(value) {
          iterator.call(context, value, index++);
        });
      } catch (e) {
        if (e != $.ext.$break) throw e;
      }
      return this;
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  ['Hitch', "Hiker's", 'Guide', 'to', 'the', 'Galaxy'].collect(function(s) {
     *    return s.charAt(0).toUpperCase();
     *  });
     *  // -> ['H', 'H', 'G', 'T', 'T', 'G']
     *
     *  [1,2,3,4,5].collect(function(n) {
     *    return n * n;
     *  });
     *  // -> [1, 4, 9, 16, 25]
     * </pre>
     *
     * @function {public Array} ?
     * Returns the result of applying `iterator` to each element. If no `iterator` is provided, the elements are simply copied to the returned array.
     * @param {Function} iterator - The iterator function to apply to each element in the enumeration. The function result is what will be returned for that item.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns the result of applying `iterator` to each element
     *
     **/
    collect: function(iterator, context) {
      if(arguments.length == 1) context = this;
      var results = [];
      this.each(function(value, index) {
        results.push(iterator.call(context, value, index));
      });
      return results;
    },

    /**
     * <h6>Example:</h6>
     * <pre>
     *  [1, 'two', 3, 'four', 5].select($.isString);
     *  // -> ['two', 'four']
     * </pre>

     * @function {public Array} ?
     * Returns all the elements for which the iterator returned a truthy value.
     * @param {Function} iterator - An iterator function to use to test the elements.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns array of elements for which iterater returned true
     **/
    select: function(iterator, context) {
      if(arguments.length == 1) context = this;
      var results = [];
      this.each(function(value, index) {
        if (iterator.call(context, value, index)) results.push(value);
      });
      return results;
    },

    /**
     * <h6>Example:</h6>
     * <pre>
     *  [1, 'two', 3, 'four', 5].detect($.isString);
     *  // -> 'two'
     * </pre>

     * @function {public Array} ?
     * Returns first element for which the iterator returned a truthy value. If no element is found, undefined is returned
     * @param {Function} iterator - An iterator function to use to test the elements.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns array of elements for which iterater returned true
     **/
    detect: function(block, context) {
      if(arguments.length == 1) context = this;
      var result = undefined;
      this.each(function(value, index) {
        if (block.call(context, value, index)){
          result = value;
          throw $.ext.$break;
        }
      });
      return result;
    },

    /**
     * <h6>Example:</h6>
     * <pre>
     *  [1, 'two', 3, 'four', 5].select($.isString);
     *  // -> ['two', 'four']
     * </pre>

     * @function {public Array} ?
     * Returns all the elements for which the iterator returned a false value.
     * @param {Function} iterator - An iterator function to use to test the elements.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns array of elements for which iterater returned false
     **/
    reject: function(iterator, context) {
      if(arguments.length == 1) context = this;
      var results = [];
      this.each(function(value, index) {
        if (!iterator.call(context, value, index)) results.push(value);
      });
      return results;
    },

    /**
     * Elements are either compared directly, or by first calling `iterator` and comparing returned values.
     * If multiple "max" elements (or results) are equivalent, the one closest
     * to the end of the enumeration is returned.
     *
     * If provided, `iterator` is called with two arguments: The element being
     * evaluated, and its index in the enumeration; it should return the value
     * `max` should consider (and potentially return).
     *
     * <h6>Examples:</h6>
     * <pre>
     *  ['c', 'b', 'a'].max();
     *  // -> 'c'
     *
     *  [1, 3, '3', 2].max();
     *  // -> '3' (because both 3 and '3' are "max", and '3' was later)
     *
     *  ['zero', 'one', 'two'].max(function(item) { return item.length; });
     *  // -> 4
     * </pre>
     *
     * @function {public ?} ?
     * Returns the maximum element (or element-based `iterator` result), or `undefined` if the enumeration is empty.
     * @param {optional Function} iterator - An optional function to use to evaluate each element in the enumeration; the function should return the value to test. If this is not provided, the element itself is tested.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns maxiumum element of the enumeration
     **/
    max: function(iterator, context) {
      if(arguments.length == 1) context = this;
      iterator = $.isFunction(iterator) ? iterator : null;
      var result = undefined;
      this.each(function(value, index) {
        if(iterator) value = iterator.call(context, value, index);
        if (result == undefined || value > result)
          result = value;
      });
      return result;
    },

    /**
     * Elements are either compared directly, or by first calling `iterator` and comparing returned values.
     * If multiple "min" elements (or results) are equivalent, the one closest
     * to the beginning of the enumeration is returned.
     *
     * If provided, `iterator` is called with two arguments: The element being
     * evaluated, and its index in the enumeration; it should return the value
     * `min` should consider (and potentially return).
     *
     * <h6>Examples:</h6>
     * <pre>
     *  ['c', 'b', 'a'].min();
     *  // -> 'a'
     *
     *  [3, 1, '1', 2].min();
     *  // -> 1 (because both 1 and '1' are "min", and 1 was earlier)
     *
     *  ['un', 'deux', 'trois'].min(function(item) { return item.length; });
     *  // -> 2
     * </pre>
     *
     * @function {public ?} ?
     * Returns the minimum element (or element-based `iterator` result), or `undefined` if the enumeration is empty.
     * @param {optional Function} iterator - An optional function to use to evaluate each element in the enumeration; the function should return the value to test. If this is not provided, the element itself is tested.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns minimum element of the enumeration
     **/
    min: function(iterator, context) {
      if(arguments.length == 1) context = this;
      iterator = $.isFunction(iterator) ? iterator : null;
      var result = undefined;
      this.each(function(value, index) {
        if(iterator) value = iterator.call(context, value, index);
        if (result == undefined || value < result)
          result = value;
      });
      return result;
    },

    /**
     * @function {public int} ?
     * Returns sum of all collection items (or element-based `iterator` result), or `0` if the enumeration is empty.
     * @param {optional Function} iterator - An optional function to use to evaluate each element in the enumeration; the function should return the value to add to sum. If this is not provided, the element itself is added.
     * @param {optional Object} context - the scope in which to call <tt>iterator</tt>. Affects what the keyword <tt>this</tt> means inside <tt>iterator</tt>.
     * @returns sum of all collection items
     */
    sum: function(iterator, context) {
      if(arguments.length == 1) context = this;
      iterator = $.isFunction(iterator) ? iterator : null;
      var result = 0;
      this.each(function(value, index) {
        if(iterator) value = iterator.call(context, value, index);
        result += value;
      });
      return result;
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  [1,4,10,2,22].include(10);
     *  // -> true
     *
     *  ['hello', 'world'].include('HELLO');
     *  // -> false ('hello' != 'HELLO')
     *
     *  [1, 2, '3', '4', '5'].include(3);
     *  // -> true ('3' == 3)
     * </pre>
     *
     * @function {public boolean} ?
     * Checks if given object included in this collection. Comparison is based on `==` comparison
     * operator (equality with implicit type conversion)
     * @param {Object} item - the object to check for inclusion in this collection
     * @returns true if given object is included
     **/
    include: function(item) {
      if ($.isFunction(this.indexOf)) return this.indexOf(item) != -1;

      return this.detect(function(value) { return value == item }) != undefined;
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  ['hello', 'world'].invoke('toUpperCase');
     *  // -> ['HELLO', 'WORLD']
     *
     *  ['hello', 'world'].invoke('substring', 0, 3);
     *  // -> ['hel', 'wor']
     *
     *  [1, 2, '3', '4', '5'].include(3);
     *  // -> true ('3' == 3)
     * </pre>
     *
     * @function {public Array} ?
     * Invokes the same method, with the same arguments, for all items in a collection. Returns an array of the results of the method calls.
     * @param {String} method - name of the method to invoke.
     * @param {optional ...} args - optional arguments to pass to the method.
     * @returns array of the results of the method calls.
     **/
    invoke: function(method) {
      var args = $.makeArray(arguments).slice(1);
      return this.map(function(value) {
        return value[method].apply(value, args);
      });
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  ['hello', 'world', 'this', 'is', 'nice'].property('length');
     *  // -> [5, 5, 4, 2, 4]
     *
     *  ['hello', 'world'].invoke('substring', 0, 3);
     *  // -> ['hel', 'wor']
     *
     *  [1, 2, '3', '4', '5'].include(3);
     *  // -> true ('3' == 3)
     * </pre>
     *
     * @function {public Array} ?
     * Fetches the same property for all items in a collection. Returns an array of the results of the property values.
     * @param {String} property - name of the property to return.
     * @returns array of the values of property on collection items
     **/
    property: function(property) {
      var results = [];
      this.each(function(value) {
        results.push(value[property]);
      });
      return results;
    }

  };

  //define some aliases
  /** @function {public Array} ? alias for {@link collect} */
  Enumerable.map = Enumerable.collect;

  //add module to jquery ext modules collection
  $.ext.mixins.Enumerable = Enumerable;


})(jQuery);
(function($) {

  /**
   * @namespace Array
   * <p>@depends $.ext.mixins.Enumerable</p>
   */
  var mixin = {

    /**
     * <h6>Example:</h6>
     * <pre>
     *  var stuff = ['Apple', 'Orange', 'Juice', 'Blue'];
     *  stuff.clear();
     *  // -> []
     *  stuff
     *  // -> []
     * </pre>
     *
     * @function {public Array} ?
     * Clears the array (makes it empty) and returns the array reference.
     *
     * @returns new string with all whiteshapce removed from the start and end of this string
     */
    clear: function() {
      this.length = 0;
      return this;
    },

    /**
     * @function {public Array} ?
     * Returns a duplicate of the array, leaving the original array intact.
     **/
    clone: function() {
      return Array.prototype.slice.call(this, 0);
    },

    /**
     * @function {public ?} ?
     * Returns array's first item (e.g. <tt>array[0]</tt>).
     **/
    first: function() {
      return this[0];
    },

    /**
     * @function {public ?} ?
     * Returns array's last item (e.g. <tt>array[array.length - 1]</tt>).
     **/
    last: function() {
      return this[this.length - 1];
    },

    /**
     * <h6>Example:</h6>
     * <pre>
     *  [3, 5, 6, 1, 20].indexOf(1)
     *  // -> 3
     *
     *  [3, 5, 6, 1, 20].indexOf(90)
     *  // -> -1 (not found)
     *
     *  ['1', '2', '3'].indexOf(1);
     *  // -> -1 (not found, 1 !== '1')
     * </pre>
     *
     * @function {public int} ?
     * Returns the index of the first occurrence of <tt>item</tt> within the array,
     * or <tt>-1</tt> if <tt>item</tt> doesn't exist in the array. Compares items using *strict equality* (===).
     * @param {?} item - value that may or may not be in the array.
     * @param {optional int} offset - number of initial items to skip before beginning the search.
     * @returns index of first occurence of <tt>item</tt> in the array or <tt>-1</tt> if not found.
     **/
    indexOf: function(item, i) {
      i = i || 0;
      var length = this.length;
      if (i < 0) i = length + i;
      for (; i < length; i++)
        if (this[i] === item) return i;
      return -1;
    },

    /**
     * @function {public int} ?
     * Returns the position of the last occurrence of <tt>item</tt> within the array or <tt>-1</tt> if <tt>item</tt> doesn't exist in the array.
     * @param {?} item - value that may or may not be in the array.
     * @param {optional int} offset - number of items at the end to skip before beginning the search.
     * @returns position of the last occurrence of <tt>item</tt> within the array or <tt>-1</tt> if not found
     * @see indexOf
     **/
    lastIndexOf: function(item, i) {
      i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
      var n = this.slice(0, i).reverse().indexOf(item);
      return (n < 0) ? n : i - n - 1;
    },

    /**
     * @function {public Array} ?
     * Remove item at specified index. Modifies this instance of array.
     * @param {int} index - index to remove item at
     * @return this array instance
     */
    removeAt: function(index) {
      if (index >= 0 && index < this.length){
        var rest = this.slice(index + 1);
        this.length = index;
        this.push.apply(this, rest);
      }
      return this;
    },

    /**
     * @function {public Array} ?
     * Remove given item from this array instance. Note if multiple occurences of this item are present, all of them are removed.
     * @param {?} item - remove this item from array
     * @returns this array instance
     */
    remove: function(item) {
      do{
        var index = this.indexOf(item);
        this.removeAt(index);
      }while(index >= 0);
      return this;
    },

    /**
     * @function {public Array} ?
     * Returns the index of the first object in self such that is == to obj. If a block is given instead of an argument, returns first object for which block is true. Returns -1 if no match is found.
     * @param {?} item_or_block - remove this item from array
     * @returns index or -1 if no match found
     */
    index: function(item_or_block, context){
      if(!$.isFunction(item_or_block)) return this.indexOf(item_or_block);
      if(arguments.length == 1) context = this;

      var result = -1;
      this.each(function(value, index) {
        if (item_or_block.call(context, value, index)) {
          result = index;
          throw $.ext.$break;
        }
      });
      return result;
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  [1, 3, 4].append(10, 20, 30)
     *  // -> [1, 3, 4, 10, 20 ,30]
     *
     *  a = ['hello', 'world']
     *  a.append('!', '!!!']
     *  a
     *  // -> ['hello', 'world', '!', '!!!']
     *
     * </pre>
     *
     * @function {public Array} ?
     * Add items to the end of this array and returns the array (for chaining)
     * @param {...} - variable list of items to append to the end of array
     * @returns this array instance modified to include passed items. Note that no new array instance is created
     **/
    append: function(){
      if(arguments.length > 0) this.push.apply(this, arguments);
      return this;
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  [1, 3, 4].prepend(10, 20, 30)
     *  // -> [10, 20 ,30, 1, 3, 4]
     *
     *  a = ['hello', 'world']
     *  a.append('!', '!!!']
     *  a
     *  // -> ['!', '!!!', 'hello', 'world']
     *
     * </pre>
     *
     * @function {public Array} ?
     * Add items to the start of this array and returns the array (for chaining)
     * @param {...} - variable list of items to add to the start of array
     * @returns this array instance modified to include passed items. Note that no new array instance is created
     **/
    prepend: function(){
      for(var i=arguments.length-1; i>=0; i--){
        this.unshift(arguments[i]);
      }
      return this;
    },

    /**
     * <h6>Examples:</h6>
     * <pre>
     *  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].n_groups_of(3)
     *  // -> [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
     *
     * </pre>
     *
     * @function {public Array} ?
     * Split this array to equal sized groups of given size. Last group might be smaller than size.
     * @param {Integer} size - number of items in
     * @returns array of arrays (each item is an array of given size)
     **/
    in_groups_of: function(size){
      var result = [];
      var a = this.clone();
      while (a.length > 0) result.push(a.splice(0, size));
      return result;
    },

    /**
     * @function {public void} ?
     * This method is required for mixin in the enumerable module. Uses javascript 1.6 Array.prototype.forEach native implementation if present.
     * @param iterator
     * @param context
     */
    _each: function(iterator, context) {
      for (var i = 0, length = this.length >>> 0; i < length; i++) {
        if (i in this) iterator.call(context, this[i], i, this);
      }
    }

  };

  // use native browser JS 1.6 implementation if available
  if (Array.prototype.indexOf){ delete mixin.indexOf; }
  if (Array.prototype.lastIndexOf){ delete mixin.lastIndexOf; }
  if (Array.prototype.forEach){ mixin._each = Array.prototype.forEach; }

  //define aliases
  //mixin.delete = mixin.remove; // NOTE!! delete is a reservred keyword, generates syntax error in some browsers to use it as method/attribute name
  mixin.deleteAt = mixin.removeAt;

  $.extend(Array.prototype, mixin);
  $.extend(Array.prototype, $.ext.mixins.Enumerable);


})(jQuery);
/*
 strftime for Javascript
 Copyright (c) 2008, Philip S Tellis <philip@bluesmoon.info>
 All rights reserved.

 This code is distributed under the terms of the BSD licence

 Redistribution and use of this software in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions
 and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of
 conditions and the following disclaimer in the documentation and/or other materials provided
 with the distribution.
 * The names of the contributors to this file may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * \file strftime.js
 * \author Philip S Tellis \<philip@bluesmoon.info\>
 * \version 1.3
 * \date 2008/06
 * \brief Javascript implementation of strftime
 *
 * Implements strftime for the Date object in javascript based on the PHP implementation described at
 * http://www.php.net/strftime  This is in turn based on the Open Group specification defined
 * at http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html This implementation does not
 * include modified conversion specifiers (i.e., Ex and Ox)
 *
 * The following format specifiers are supported:
 *
 * \copydoc formats
 *
 * \%a, \%A, \%b and \%B should be localised for non-English locales.
 *
 * \par Usage:
 * This library may be used as follows:
 * \code
 *     var d = new Date();
 *
 *     var ymd = d.strftime('%Y/%m/%d');
 *     var iso = d.strftime('%Y-%m-%dT%H:%M:%S%z');
 *
 * \endcode
 *
 * \sa \link Date.prototype.strftime Date.strftime \endlink for a description of each of the supported format specifiers
 * \sa Date.strftime_helper.locales for localisation information
 * \sa http://www.php.net/strftime for the PHP implementation which is the basis for this
 * \sa http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html for feedback
 */

//! Date extension object - all supporting objects go in here.
Date.strftime_helper = {};

//! Utility methods
Date.strftime_helper.util = {};

/**
 \brief Left pad a number with something
 \details Takes a number and pads it to the left with the passed in pad character
 \param x	The number to pad
 \param pad	The string to pad with
 \param r	[optional] Upper limit for pad.  A value of 10 pads to 2 digits, a value of 100 pads to 3 digits.
 Default is 10.

 \return The number left padded with the pad character.  This function returns a string and not a number.
 */
Date.strftime_helper.util.xPad=function(x, pad, r)
{
  if(typeof(r) == 'undefined')
  {
    r=10;
  }
  for( ; parseInt(x, 10)<r && r>1; r/=10)
    x = pad.toString() + x;
  return x.toString();
};

/**
 \brief Localised strings for days of the week and months of the year.
 \details
 To create your own local strings, add a locale object to the locales object.
 The key of your object should be the same as your locale name.  For example:
 en-US,
 fr,
 fr-CH,
 de-DE
 Names are case sensitive and are described at http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
 Your locale object must contain the following keys:
 \param a	Short names of days of week starting with Sunday
 \param A	Long names days of week starting with Sunday
 \param b	Short names of months of the year starting with January
 \param B	Long names of months of the year starting with February
 \param c	The preferred date and time representation in your locale
 \param p	AM or PM in your locale
 \param P	am or pm in your locale
 \param x	The  preferred date representation for the current locale without the time.
 \param X	The preferred time representation for the current locale without the date.

 \sa Date.strftime_helper.locales.en for a sample implementation
 \sa \ref localisation for detailed documentation on localising strftime for your own locale
 */
Date.strftime_helper.locales = { };

/**
 * \brief Localised strings for English (British).
 * \details
 * This will be used for any of the English dialects unless overridden by a country specific one.
 * This is the default locale if none specified
 */
Date.strftime_helper.locales.en = {
  a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  c: '%a %d %b %Y %T %Z',
  p: ['AM', 'PM'],
  P: ['am', 'pm'],
  x: '%d/%m/%y',
  X: '%T'
};

Date.strftime_helper.locales['he-IL'] = {
  a: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  A: ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'],
  b: ['ינ', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
  B: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
  c: '%a %d %b %Y %T %Z',
  p: ['AM', 'PM'],
  P: ['am', 'pm'],
  x: '%d/%m/%y',
  X: '%T'
};

//! \cond FALSE
// Localised strings for US English
Date.strftime_helper.locales['en-US'] = Date.strftime_helper.locales.en;
Date.strftime_helper.locales['en-US'].c = '%a %d %b %Y %r %Z';
Date.strftime_helper.locales['en-US'].x = '%D';
Date.strftime_helper.locales['en-US'].X = '%r';

// Localised strings for British English
Date.strftime_helper.locales['en-GB'] = Date.strftime_helper.locales.en;

// Localised strings for Australian English
Date.strftime_helper.locales['en-AU'] = Date.strftime_helper.locales['en-GB'];
//! \endcond

//! \brief List of supported format specifiers.
/**
 * \details
 * \arg \%a - abbreviated weekday name according to the current locale
 * \arg \%A - full weekday name according to the current locale
 * \arg \%b - abbreviated month name according to the current locale
 * \arg \%B - full month name according to the current locale
 * \arg \%c - preferred date and time representation for the current locale
 * \arg \%C - century number (the year divided by 100 and truncated to an integer, range 00 to 99)
 * \arg \%d - day of the month as a decimal number (range 01 to 31)
 * \arg \%D - same as %m/%d/%y
 * \arg \%e - day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')
 * \arg \%g - like %G, but without the century
 * \arg \%G - The 4-digit year corresponding to the ISO week number
 * \arg \%h - same as %b
 * \arg \%H - hour as a decimal number using a 24-hour clock (range 00 to 23)
 * \arg \%I - hour as a decimal number using a 12-hour clock (range 01 to 12)
 * \arg \%j - day of the year as a decimal number (range 001 to 366)
 * \arg \%m - month as a decimal number (range 01 to 12)
 * \arg \%M - minute as a decimal number
 * \arg \%n - newline character
 * \arg \%p - either `AM' or `PM' according to the given time value, or the corresponding strings for the current locale
 * \arg \%P - like %p, but lower case
 * \arg \%r - time in a.m. and p.m. notation equal to %I:%M:%S %p
 * \arg \%R - time in 24 hour notation equal to %H:%M
 * \arg \%S - second as a decimal number
 * \arg \%t - tab character
 * \arg \%T - current time, equal to %H:%M:%S
 * \arg \%u - weekday as a decimal number [1,7], with 1 representing Monday
 * \arg \%U - week number of the current year as a decimal number, starting with
 *            the first Sunday as the first day of the first week
 * \arg \%V - The ISO 8601:1988 week number of the current year as a decimal number,
 *            range 01 to 53, where week 1 is the first week that has at least 4 days
 *            in the current year, and with Monday as the first day of the week.
 * \arg \%w - day of the week as a decimal, Sunday being 0
 * \arg \%W - week number of the current year as a decimal number, starting with the
 *            first Monday as the first day of the first week
 * \arg \%x - preferred date representation for the current locale without the time
 * \arg \%X - preferred time representation for the current locale without the date
 * \arg \%y - year as a decimal number without a century (range 00 to 99)
 * \arg \%Y - year as a decimal number including the century
 * \arg \%z - numerical time zone representation
 * \arg \%Z - time zone name or abbreviation
 * \arg \%% - a literal `\%' character
 */
Date.strftime_helper.formats = {
  a: function(d) { return Date.strftime_helper.locales[d.locale].a[d.getDay()]; },
  A: function(d) { return Date.strftime_helper.locales[d.locale].A[d.getDay()]; },
  b: function(d) { return Date.strftime_helper.locales[d.locale].b[d.getMonth()]; },
  B: function(d) { return Date.strftime_helper.locales[d.locale].B[d.getMonth()]; },
  c: 'toLocaleString',
  C: function(d) { return Date.strftime_helper.util.xPad(parseInt(d.getFullYear()/100, 10), 0); },
  d: ['getDate', '0'],
  e: ['getDate', ' '],
  g: function(d) { return Date.strftime_helper.util.xPad(parseInt(Date.strftime_helper.util.G(d)/100, 10), 0); },
  G: function(d) {
    var y = d.getFullYear();
    var V = parseInt(Date.strftime_helper.formats.V(d), 10);
    var W = parseInt(Date.strftime_helper.formats.W(d), 10);

    if(W > V) {
      y++;
    } else if(W===0 && V>=52) {
      y--;
    }

    return y;
  },
  H: ['getHours', '0'],
  I: function(d) { var I=d.getHours()%12; return Date.strftime_helper.util.xPad(I===0?12:I, 0); },
  j: function(d) {
    var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
    ms += d.getTimezoneOffset()*60000;
    var doy = parseInt(ms/60000/60/24, 10)+1;
    return Date.strftime_helper.util.xPad(doy, 0, 100);
  },
  m: function(d) { return Date.strftime_helper.util.xPad(d.getMonth()+1, 0); },
  M: ['getMinutes', '0'],
  p: function(d) { return Date.strftime_helper.locales[d.locale].p[d.getHours() >= 12 ? 1 : 0 ]; },
  P: function(d) { return Date.strftime_helper.locales[d.locale].P[d.getHours() >= 12 ? 1 : 0 ]; },
  S: ['getSeconds', '0'],
  u: function(d) { var dow = d.getDay(); return dow===0?7:dow; },
  U: function(d) {
    var doy = parseInt(Date.strftime_helper.formats.j(d), 10);
    var rdow = 6-d.getDay();
    var woy = parseInt((doy+rdow)/7, 10);
    return Date.strftime_helper.util.xPad(woy, 0);
  },
  V: function(d) {
    var woy = parseInt(Date.strftime_helper.formats.W(d), 10);
    var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
    // First week is 01 and not 00 as in the case of %U and %W,
    // so we add 1 to the final result except if day 1 of the year
    // is a Monday (then %W returns 01).
    // We also need to subtract 1 if the day 1 of the year is
    // Friday-Sunday, so the resulting equation becomes:
    var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
    if(idow == 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
    {
      idow = 1;
    }
    else if(idow === 0)
    {
      idow = Date.strftime_helper.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
    }

    return Date.strftime_helper.util.xPad(idow, 0);
  },
  w: 'getDay',
  W: function(d) {
    var doy = parseInt(Date.strftime_helper.formats.j(d), 10);
    var rdow = 7-Date.strftime_helper.formats.u(d);
    var woy = parseInt((doy+rdow)/7, 10);
    return Date.strftime_helper.util.xPad(woy, 0, 10);
  },
  y: function(d) { return Date.strftime_helper.util.xPad(d.getFullYear()%100, 0); },
  Y: 'getFullYear',
  z: function(d) {
    var o = d.getTimezoneOffset();
    var H = Date.strftime_helper.util.xPad(parseInt(Math.abs(o/60), 10), 0);
    var M = Date.strftime_helper.util.xPad(o%60, 0);
    return (o>0?'-':'+') + H + M;
  },
  Z: function(d) { return d.toString().replace(/^.*\(([^)]+)\)$/, '$1'); },
  '%': function(d) { return '%'; }
};

/**
 \brief List of aggregate format specifiers.
 \details
 Aggregate format specifiers map to a combination of basic format specifiers.
 These are implemented in terms of Date.strftime_helper.formats.

 A format specifier that maps to 'locale' is read from Date.strftime_helper.locales[current-locale].

 \sa Date.strftime_helper.formats
 */
Date.strftime_helper.aggregates = {
  c: 'locale',
  D: '%m/%d/%y',
  h: '%b',
  n: '\n',
  r: '%I:%M:%S %p',
  R: '%H:%M',
  t: '\t',
  T: '%H:%M:%S',
  x: 'locale',
  X: 'locale'
};

//! \cond FALSE
// Cache timezone values because they will never change for a given JS instance
Date.strftime_helper.aggregates.z = Date.strftime_helper.formats.z(new Date());
Date.strftime_helper.aggregates.Z = Date.strftime_helper.formats.Z(new Date());
//! \endcond

//! List of unsupported format specifiers.
/**
 * \details
 * All format specifiers supported by the PHP implementation are supported by
 * this javascript implementation.
 */
Date.strftime_helper.unsupported = { };

/**
 * \mainpage strftime for Javascript
 *
 * \section toc Table of Contents
 * - \ref intro_sec
 * - <a class="el" href="strftime.js">Download full source</a> / <a class="el" href="strftime-min.js">minified</a>
 * - \subpage usage
 * - \subpage format_specifiers
 * - \subpage localisation
 * - \link strftime.js API Documentation \endlink
 * - \subpage demo
 * - \subpage changelog
 * - \subpage faq
 * - <a class="el" href="http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html">Feedback</a>
 * - \subpage copyright_licence
 *
 * \section intro_sec Introduction
 *
 * C and PHP developers have had access to a built in strftime function for a long time.
 * This function is an easy way to format dates and times for various display needs.
 *
 * This library brings the flexibility of strftime to the javascript Date object
 *
 * Use this library if you frequently need to format dates in javascript in a variety of ways.  For example,
 * if you have PHP code that writes out formatted dates, and want to mimic the functionality using
 * progressively enhanced javascript, then this library can do exactly what you want.
 *
 *
 *
 *
 * \page usage Example usage
 *
 * \section usage_sec Usage
 * This library may be used as follows:
 * \code
 *     var d = new Date();
 *
 *     var ymd = d.strftime('%Y/%m/%d');
 *     var iso = d.strftime('%Y-%m-%dT%H:%M:%S%z');
 *
 * \endcode
 *
 * \subsection examples Examples
 *
 * To get the current time in hours and minutes:
 * \code
 * 	var d = new Date();
 * 	d.strftime("%H:%M");
 * \endcode
 *
 * To get the current time with seconds in AM/PM notation:
 * \code
 * 	var d = new Date();
 * 	d.strftime("%r");
 * \endcode
 *
 * To get the year and day of the year for August 23, 2009:
 * \code
 * 	var d = new Date('2009/8/23');
 * 	d.strftime("%Y-%j");
 * \endcode
 *
 * \section demo_sec Demo
 *
 * Try your own examples on the \subpage demo page.  You can use any of the supported
 * \subpage format_specifiers.
 *
 *
 *
 *
 * \page localisation Localisation
 * You can localise strftime by implementing the short and long forms for days of the
 * week and months of the year, and the localised aggregates for the preferred date
 * and time representation for your locale.  You need to add your locale to the
 * Date.strftime_helper.locales object.
 *
 * \section localising_fr Localising for french
 *
 * For example, this is how we'd add French language strings to the locales object:
 * \dontinclude index.html
 * \skip Generic french
 * \until };
 * The % format specifiers are all defined in \ref formats.  You can use any of those.
 *
 * This locale definition may be included in your own source file, or in the HTML file
 * including \c strftime.js, however it must be defined \em after including \c strftime.js
 *
 * The above definition includes generic french strings and formats that are used in France.
 * Other french speaking countries may have other representations for dates and times, so we
 * need to override this for them.  For example, Canadian french uses a Y-m-d date format,
 * while French french uses d.m.Y.  We fix this by defining Canadian french to be the same
 * as generic french, and then override the format specifiers for \c x for the \c fr-CA locale:
 * \until End french
 *
 * You can now use any of the French locales at any time by setting \link Date.prototype.locale Date.locale \endlink
 * to \c "fr", \c "fr-FR", \c "fr-CA", or any other french dialect:
 * \code
 *     var d = new Date("2008/04/22");
 *     d.locale = "fr";
 *
 *     d.strftime("%A, %d %B == %x");
 * \endcode
 * will return:
 * \code
 *     mardi, 22 avril == 22.04.2008
 * \endcode
 * While changing the locale to "fr-CA":
 * \code
 *     d.locale = "fr-CA";
 *
 *     d.strftime("%A, %d %B == %x");
 * \endcode
 * will return:
 * \code
 *     mardi, 22 avril == 2008-04-22
 * \endcode
 *
 * You can use any of the format specifiers defined at \ref formats
 *
 * The locale for all dates defaults to the value of the \c lang attribute of your HTML document if
 * it is set, or to \c "en" otherwise.
 * \note
 * Your locale definitions \b MUST be added to the locale object before calling
 * \link Date.prototype.strftime Date.strftime \endlink.
 *
 * \sa \ref formats for a list of format specifiers that can be used in your definitions
 * for c, x and X.
 *
 * \section locale_names Locale names
 *
 * Locale names are defined in RFC 1766. Typically, a locale would be a two letter ISO639
 * defined language code and an optional ISO3166 defined country code separated by a -
 *
 * eg: fr-FR, de-DE, hi-IN
 *
 * \sa http://www.ietf.org/rfc/rfc1766.txt
 * \sa http://www.loc.gov/standards/iso639-2/php/code_list.php
 * \sa http://www.iso.org/iso/country_codes/iso_3166_code_lists/english_country_names_and_code_elements.htm
 *
 * \section locale_fallback Locale fallbacks
 *
 * If a locale object corresponding to the fully specified locale isn't found, an attempt will be made
 * to fall back to the two letter language code.  If a locale object corresponding to that isn't found
 * either, then the locale will fall back to \c "en".  No warning will be issued.
 *
 * For example, if we define a locale for de:
 * \until };
 * Then set the locale to \c "de-DE":
 * \code
 *     d.locale = "de-DE";
 *
 *     d.strftime("%a, %d %b");
 * \endcode
 * In this case, the \c "de" locale will be used since \c "de-DE" has not been defined:
 * \code
 *     Di, 22 Apr
 * \endcode
 *
 * Swiss german will return the same since it will also fall back to \c "de":
 * \code
 *     d.locale = "de-CH";
 *
 *     d.strftime("%a, %d %b");
 * \endcode
 * \code
 *     Di, 22 Apr
 * \endcode
 *
 * We need to override the \c a specifier for Swiss german, since it's different from German german:
 * \until End german
 * We now get the correct results:
 * \code
 *     d.locale = "de-CH";
 *
 *     d.strftime("%a, %d %b");
 * \endcode
 * \code
 *     Die, 22 Apr
 * \endcode
 *
 * \section builtin_locales Built in locales
 *
 * This library comes with pre-defined locales for en, en-GB, en-US and en-AU.
 *
 *
 *
 *
 * \page format_specifiers Format specifiers
 *
 * \section specifiers Format specifiers
 * strftime has several format specifiers defined by the Open group at
 * http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
 *
 * PHP added a few of its own, defined at http://www.php.net/strftime
 *
 * This javascript implementation supports all the PHP specifiers
 *
 * \subsection supp Supported format specifiers:
 * \copydoc formats
 *
 * \subsection unsupportedformats Unsupported format specifiers:
 * \copydoc unsupported
 *
 *
 *
 *
 * \page demo strftime demo
 * <div style="float:right;width:45%;">
 * \copydoc formats
 * </div>
 * \htmlinclude index.html
 *
 *
 *
 *
 * \page faq FAQ
 *
 * \section how_tos Usage
 *
 * \subsection howtouse Is there a manual on how to use this library?
 *
 * Yes, see \ref usage
 *
 * \subsection wheretoget Where can I get a minified version of this library?
 *
 * The minified version is available <a href="strftime-min.js" title="Minified strftime.js">here</a>.
 *
 * \subsection which_specifiers Which format specifiers are supported?
 *
 * See \ref format_specifiers
 *
 * \section whys Why?
 *
 * \subsection why_lib Why this library?
 *
 * I've used the strftime function in C, PHP and the Unix shell, and found it very useful
 * to do date formatting.  When I needed to do date formatting in javascript, I decided
 * that it made the most sense to just reuse what I'm already familiar with.
 *
 * \subsection why_another Why another strftime implementation for Javascript?
 *
 * Yes, there are other strftime implementations for Javascript, but I saw problems with
 * all of them that meant I couldn't use them directly.  Some implementations had bad
 * designs.  For example, iterating through all possible specifiers and scanning the string
 * for them.  Others were tied to specific libraries like prototype.
 *
 * Trying to extend any of the existing implementations would have required only slightly
 * less effort than writing this from scratch.  In the end it took me just about 3 hours
 * to write the code and about 6 hours battling with doxygen to write these docs.
 *
 * I also had an idea of how I wanted to implement this, so decided to try it.
 *
 * \subsection why_extend_date Why extend the Date class rather than subclass it?
 *
 * I tried subclassing Date and failed.  I didn't want to waste time on figuring
 * out if there was a problem in my code or if it just wasn't possible.  Adding to the
 * Date.prototype worked well, so I stuck with it.
 *
 * I did have some worries because of the way for..in loops got messed up after json.js added
 * to the Object.prototype, but that isn't an issue here since {} is not a subclass of Date.
 *
 * My last doubt was about the Date.strftime_helper namespace that I created.  I still don't like this,
 * but I felt that \c ext at least makes clear that this is external or an extension.
 *
 * It's quite possible that some future version of javascript will add an \c ext or a \c locale
 * or a \c strftime property/method to the Date class, but this library should probably
 * check for capabilities before doing what it does.
 *
 * \section curiosity Curiosity
 *
 * \subsection how_big How big is the code?
 *
 * \arg 26K bytes with documentation
 * \arg 4242 bytes minified using <a href="http://developer.yahoo.com/yui/compressor/">YUI Compressor</a>
 * \arg 1477 bytes minified and gzipped
 *
 * \subsection how_long How long did it take to write this?
 *
 * 15 minutes for the idea while I was composing this blog post:
 * http://tech.bluesmoon.info/2008/04/javascript-date-functions.html
 *
 * 3 hours in one evening to write v1.0 of the code and 6 hours the same
 * night to write the docs and this manual.  As you can tell, I'm fairly
 * sleepy.
 *
 * Versions 1.1 and 1.2 were done in a couple of hours each, and version 1.3
 * in under one hour.
 *
 * \section contributing Contributing
 *
 * \subsection how_to_rfe How can I request features or make suggestions?
 *
 * You can leave a comment on my blog post about this library here:
 * http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html
 *
 * \subsection how_to_contribute Can I/How can I contribute code to this library?
 *
 * Yes, that would be very nice, thank you.  You can do various things.  You can make changes
 * to the library, and make a diff against the current file and mail me that diff at
 * philip@bluesmoon.info, or you could just host the new file on your own servers and add
 * your name to the copyright list at the top stating which parts you've added.
 *
 * If you do mail me a diff, let me know how you'd like to be listed in the copyright section.
 *
 * \subsection copyright_signover Who owns the copyright on contributed code?
 *
 * The contributor retains copyright on contributed code.
 *
 * In some cases I may use contributed code as a template and write the code myself.  In this
 * case I'll give the contributor credit for the idea, but will not add their name to the
 * copyright holders list.
 *
 *
 *
 *
 * \page copyright_licence Copyright & Licence
 *
 * \section copyright Copyright
 * \dontinclude strftime.js
 * \skip Copyright
 * \until rights
 *
 * \section licence Licence
 * \skip This code
 * \until SUCH DAMAGE.
 *
 *
 *
 * \page changelog ChangeLog
 *
 * \par 1.3 - 2008/06/17:
 * - Fixed padding issue with negative timezone offsets in %r
 *   reported and fixed by Mikko <mikko.heimola@iki.fi>
 * - Added support for %P
 * - Internationalised %r, %p and %P
 *
 * \par 1.2 - 2008/04/27:
 * - Fixed support for c (previously it just returned toLocaleString())
 * - Add support for c, x and X
 * - Add locales for en-GB, en-US and en-AU
 * - Make en-GB the default locale (previous was en)
 * - Added more localisation docs
 *
 * \par 1.1 - 2008/04/27:
 * - Fix bug in xPad which wasn't padding more than a single digit
 * - Fix bug in j which had an off by one error for days after March 10th because of daylight savings
 * - Add support for g, G, U, V and W
 *
 * \par 1.0 - 2008/04/22:
 * - Initial release with support for a, A, b, B, c, C, d, D, e, H, I, j, m, M, p, r, R, S, t, T, u, w, y, Y, z, Z, and %
 */
jQuery.extend(Date.prototype, /** @scope Date */{
  locale: 'en-US',

  /**
   * @function {public long} ?
   * Returns number of miliseconds between given date and this date. If date is not given, return number of miliseconds elapsed from now
   * @param {optional Date} from - calculate elapsed miliseconds from this date to given from date. Defaults to now date.
   * @returns number of miliseconds between given date and this date. if date is not given, return number of miliseconds elapsed from now
   */
  getElapsed: function(from){
    return Math.abs((from || new Date()).getTime() - this.getTime());
  },

  /**
   * @function {public Date} ?
   * Returns date of this day with hours, minutes, seconds and miliseconds set to 0
   */
  beginningOfDay: function(){
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0, 0);
  },

  /**
   * @function {public Date} ?
   * Returns date of this day with hours, minutes, seconds and miliseconds set to 23:59:59:999
   */
  endOfDay: function(){
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 23, 59, 59, 999);
  },

  /**
   * @function {public Date} ?
   * Returns next day date beginning of day (for example if this date is 23/09/2012 11:33 -> 24/09/2012 00:00
   */
  nextDay: function(){
    var tmp = new Date(this.endOfDay().getTime() + 100);
    return tmp.beginningOfDay();
  },

  /**
   * @function {public Date} ?
   * Returns previous day date at beginning of day (for example if this date is 23/09/2012 11:33 -> 22/09/2012 00:00
   */
  prevDay: function(){
    var tmp = new Date(this.beginningOfDay().getTime() - 100);
    return tmp.beginningOfDay();
  },

  /**
   * @function {public Date} ?
   * Returns date of the next month (if today is 25/12/2012 --> 01/01/2013)
   */
  nextMonth: function(){
    if(this.getMonth() == 11){
      return new Date(this.getFullYear() + 1, 0, 1);
    }else{
      return new Date(this.getFullYear(), this.getMonth() + 1, 1);
    }
  },

  /**
   * @function {public Date} ?
   * Returns date of the previous month (if today is 25/01/2012 --> 01/12/2011)
   */
  prevMonth: function(){
    if(this.getMonth() == 0){
      return new Date(this.getFullYear() - 1, 11, 1);
    }else{
      return new Date(this.getFullYear(), this.getMonth() - 1, 1);
    }
  },

  /**
   * @function {public Date} ?
   * Returns date of the first day of this date's month (if today is 25/01/2012 --> 01/01/2012)
   */
  beginningOfMonth: function(){
    return new Date(this.getFullYear(), this.getMonth(), 1);
  },

  /**
   * @function {public Date} ?
   * Returns date of the last day of this date's month (if today is 25/01/2012 --> 31/01/2012)
   */
  endOfMonth: function(){
    var tmp = new Date(this.nextMonth() - 1);
    return new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  },

  /**
   * @function {public Date} ?
   * Formats current date by given strftime pattern and returns resulting string
   * (see man strftime or http://hacks.bluesmoon.info/strftime/demo.html)
   */
  strftime: function(format){
    // Fix locale if declared locale hasn't been defined
    // After the first call this condition should never be entered unless someone changes the locale
    if(!(this.locale in Date.strftime_helper.locales)){
      this.locale = 'en-US';
    }

    var d = this;
    // First replace aggregates
    while(format.match(/%[cDhnrRtTxXzZ]/)){
      format = format.replace(/%([cDhnrRtTxXzZ])/g, function(m0, m1){
        var f = Date.strftime_helper.aggregates[m1];
        return (f == 'locale' ? Date.strftime_helper.locales[d.locale][m1] : f);
      });
    }


    // Now replace formats - we need a closure so that the date object gets passed through
    var str = format.replace(/%([aAbBCdegGHIjmMpPSuUVwWyY%])/g, function(m0, m1){
      var f = Date.strftime_helper.formats[m1];
      if(typeof(f) == 'string'){
        return d[f]();
      }else if(typeof(f) == 'function'){
        return f.call(d, d);
      }else if(typeof(f) == 'object' && typeof(f[0]) == 'string'){
        return Date.strftime_helper.util.xPad(d[f[0]](), f[1]);
      }else{
        return m1;
      }
    });
    d = null;
    return str;
  }

});
(function($) {

  $.extend(Function, {

  });

  $.extend(Function.prototype, {

    /**
     * Whenever the resulting "bound" function is called, it will call the original ensuring that this is set to context.
     * Also optionally curries arguments for the function (meaning you can burn arguments in when binding and they will be passed to the function)
     * @function {public Function} Function.?
     * Binds this function to the given context by wrapping it in another function and returning the wrapper.
     * @param {Object} context - the object in which context this function will be invoked (this variable will be context)
     * @returns wrapped function with context and bind arguments burnt in.
     */
    bind: function(context) {
      if (arguments.length < 2 && $.isUndefined(arguments[0])) {
        return this;
      }

      var self = this;
      var bindArgs = null; //remove context argument
      if (arguments.length > 1) {
        bindArgs = Array.prototype.slice.call(arguments, 1);
      }

      return function() {
        //append method arguments to bind arguments and call the original function in context
        var a = arguments;
        if (bindArgs) {
          a = bindArgs;
          if (arguments.length > 0) {
            var aLength = a.length, argsLength = arguments.length;
            while (argsLength--) {
              a[aLength + argsLength] = arguments[argsLength]; //this is the fastest was of appending elements to array
            }
          }
        }
        return self.apply(context, a);
      };
    }

  });

})(jQuery);
(function($) {

  $.extend(Math, {
    /**
     * @property {public static Function} Math.?
     * return uuid compliant with rfc4122 version 4
     */
    uuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    // Converts from degrees to radians.
    degreesToRadians: function(degrees) {
      return degrees * Math.PI / 180;
    },

    // Converts from radians to degrees.
    radiansToDegrees: function(radians) {
      return radians * 180 / Math.PI;
    }

  });


})(jQuery);
jQuery.extend(RegExp, {

  /**
   * @function {public String} RegExp.?
   * Escapes the passed string for use in a regular expression
   * @param {String} str - string in which special regular expression character will be escaped
   * @returns escaped regular expession string
   */
  escape : function(str) {
    return str.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
  }

});
(function($) {

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  /** @scope String */
  var mixin = {

    /**
     * @function {public String} ?
     * Returns copy of this string when first letter is uppercase and other letters downcased
     * @returns copy of this string when first letter is uppercase and other letters downcased
     */
    capitalize: function() {
      return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    },

    /**
     * @function {public String} ?
     * Converts underscored or dasherized string to a camelized one
     * @return copy of this string when its words are camelized
     */
    camelize: function(){
      var result = this.trim().replace(/[-_\s]+(.)?/g, function(match, ch){ return ch.toUpperCase(); });
      result = result.charAt(0).toUpperCase() + result.substring(1);
      return result;
    },

    /**
     * @function {public String} ?
     * Converts a camelized or dasherized string into an underscored one
     * @return copy of this string when its words are separated by underscore
     */
    underscore: function(){
      return this.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    /**
     * @function {public String} ?
     * Converts a underscored or camelized string into an dasherized one
     * @return copy of this string when its words are separated by dash
     */
    dasherize: function(){
      return this.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    /**
     * <pre>
     * "This is a {0} string using the {1} method".format("formatted", "inline")
     * //will return: "This is a formatted string using the inline method"
     * </pre>
     *
     * @function {public String} ?
     * Replace this string {0},{1},{2}... tokens (variables) with passed arguments.
     * {0} corresponds to first argument, {1} to second, etc.
     * @param  {String...} args - variable number of arguments to act as variables into the string format
     * @returns formatted string as described above
     */
    format: function() {
      var txt = this;
      for (var i = 0; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
        txt = txt.replace(exp, arguments[i]);
      }
      return txt;
    },

    /**
     * @function {public boolean} ?
     * This method checks if this string starts with given string as parameter
     * @param {String} other - string to check if this string starts with
     * @returns true if this string starts with given string
     */
    startsWith: function(other) {
      return this.lastIndexOf(other, 0) === 0;
    },

    /**
     * @function {public boolean} ?
     * This method checks if given string is included in this string
     * @param anotherString {String} - check if it is contained in this string instance
     * @returns true if given string is included in this string
     */
    include: function(anotherString) {
      return this.indexOf(anotherString) != -1;
    },

    /**
     * @function {public boolean} ?
     * This method checks if this string ends with given string as parameter
     * @param {String} other - string to check if this string ends with
     * @returns true if this string ends with given string
     */
    endsWith: function(other) {
      var d = this.length - other.length;
      return d >= 0 && this.indexOf(other, d) === d;
    },

    /**
     * @function {public String} ?
     * Removes all whitespace from start and end of this string
     * @returns new string with all whiteshapce removed from the start and end of this string
     */
    trim: function() {
      return this.replace(/^\s+|\s+$/, '');
    },

    ltrim: function(){
      return this.replace(/^\s+/, '');
    },

    rtrim: function(){
      return this.replace(/\s+$/, '');
    },

    lpad: function(length, padStr) {
      var padlen = length - this.length;
      return strRepeat(padStr||' ', padlen) + this;
    },

    rpad: function(length, padStr) {
      var padlen = length - this.length;
      return this + strRepeat(padStr||' ', padlen);
    },

    lrpad: function(length, padStr) {
      var padlen = length - this.length;
      return strRepeat(padStr||' ', Math.ceil(padlen/2)) + this
        + strRepeat(padStr||' ', Math.floor(padlen/2));
    }

  };

  // use native browser JS 1.6 implementation if available
  if (String.prototype.trim){ mixin.trim = String.prototype.trim; }
  if (String.prototype.trimLeft){ mixin.ltrim = String.prototype.trimLeft; }
  if (String.prototype.trimRight){ mixin.rtrim = String.prototype.trimRight; }

  //define aliases
  mixin.contains = mixin.include;
  mixin.strip = mixin.trim;
  mixin.lstrip = mixin.ltrim;
  mixin.rstrip = mixin.rtrim;

  $.extend(String.prototype, mixin);

})(jQuery);

(function($) {

  /**
   * @object {public static} $.Event.Keys
   * Defines contants for common keycode mappings
   */
  $.Event.Keys = {
    /** @variable ? backspace key */
    BACKSPACE: 8,
    /** @variable ? tab key */
    TAB: 9,
    /** @variable ? alias for enter key */
    RETURN: 13,
    /** @variable ? enter key */
    ENTER: 13,
    /** @variable ? esc key */
    ESC: 27,
    /** @variable ? left arrow key */
    LEFT: 37,
    /** @variable ? up arrow key */
    UP: 38,
    /** @variable ? right arrow key */
    RIGHT: 39,
    /** @variable ? down arrow key */
    DOWN: 40,
    /** @variable ? backspace key */
    DELETE: 46,
    /** @variable ? home key */
    HOME: 36,
    /** @variable ? end key */
    END: 35,
    /** @variable ? page up key */
    PAGE_UP: 33,
    /** @variable ? page down key */
    PAGE_DOWN: 34,
    /** @variable ? insert key */
    INSERT: 45
  };

  $.extend($.Event.prototype,
    /**
     * @class $.Event
     * jQuery event object extended functionality documentation
     */
    {

      /**
       * @function {public void} ?
       * Stop event propagation and prevent default action
       */
      stopEvent: function() {
        this.preventDefault();
        this.stopPropagation();
      },

      /**
       * @function {public boolean} ?
       */
      isSpecialKey : function() {
        var k = this.which;
        return  (this.ctrlKey) || this.isNavKeyPress() ||
          (k == $.Event.Keys.BACKSPACE) || // Backspace
          (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
          (k >= 44 && k <= 46);   // Print Screen, Insert, Delete
      },

      /**
       * @function {public boolean} ?
       * This method checks if key that was pressed was navigation key: tab, enter, esc, arrow keys, pageup/down, home or end
       * @returns true if navigation key was pressed
       */
      isNavKeyPress : function() {
        var k = this.which;
        return (k >= 33 && k <= 40) || // Page Up/Down, End, Home, Left, Up, Right, Down
          k == $.Event.Keys.RETURN || k == $.Event.Keys.TAB || k == $.Event.Keys.ESC;
      },

      /**
       * @function {public boolean} ?
       */
      isBackspaceKey: function() {
        return this.which == $.Event.Keys.BACKSPACE;
      },

      /**
       * @function {public boolean} ?
       */
      isDeleteKey: function() {
        return this.which == $.Event.Keys.DELETE;
      },

      /**
       * @function {public boolean} ?
       */
      isTabKey: function() {
        return this.which == $.Event.Keys.TAB;
      },

      /**
       * @function {public boolean} ?
       */
      isEnterKey: function() {
        return this.which == $.Event.Keys.RETURN;
      },

      /**
       * @function {public boolean} ?
       */
      isEscKey: function() {
        return this.which == $.Event.Keys.ESC;
      },

      /**
       * @function {public boolean} ?
       */
      isUpKey: function() {
        return this.which == $.Event.Keys.UP;
      },

      /**
       * @function {public boolean} ?
       */
      isDownKey: function() {
        return this.which == $.Event.Keys.DOWN;
      }

    });


})(jQuery);
jQuery.ext.Extender.addUtilityMethods({

  /**
   * @namespace System information object parsed from browser navigator.userAgent property
   * @memberOf $
   */
  systemInfo: function() {

    var ua = navigator.userAgent.toLowerCase();

    /** @ignore */
    var check = function(r) {
      return r.test(ua);
    };


    var info = {
      browser: { },
      os: {}
    };

    info.browser.isStrict = document.compatMode == "CSS1Compat";
    info.browser.isSecure = /^https/i.test(window.location.protocol);

    info.browser.isOpera = check(/opera/);
    info.browser.isChrome = check(/\bchrome\b/);
    info.browser.isWebKit = check(/webkit/);
    info.browser.isSafari = !info.browser.isChrome && check(/safari/);
    info.browser.isSafari2 = info.browser.isSafari && check(/applewebkit\/4/); // unique to Safari 2
    info.browser.isSafari3 = info.browser.isSafari && check(/version\/3/);
    info.browser.isSafari4 = info.browser.isSafari && check(/version\/4/);
    info.browser.isIE = !info.browser.isOpera && check(/msie/);
    info.browser.isIE7 = info.browser.isIE && check(/msie 7/);
    info.browser.isIE8 = info.browser.isIE && check(/msie 8/);
    info.browser.isIE6 = info.browser.isIE && !info.browser.isIE7 && !info.browser.isIE8;
    info.browser.isGecko = !info.browser.isWebKit && check(/gecko/);
    info.browser.isGecko2 = info.browser.isGecko && check(/rv:1\.8/);
    info.browser.isGecko3 = info.browser.isGecko && check(/rv:1\.9/);
    info.browser.isBorderBox = info.browser.isIE && !info.browser.isStrict;

    info.os.isWindows = check(/windows|win32/);
    info.os.isMac = check(/macintosh|mac os x/);
    info.os.isAir = check(/adobeair/);
    info.os.isLinux = check(/linux/);

    return info;

  }()

}, true);
(function($) {

  /**
   * @namespace $.ext.mixins.Observable
   * This is a module (=mixin), that can be included in any object prototype to provide that object instances with
   * event handling capabilities.
   */
  var ObservableModule = {

    __initListeners: function(eventName) {
      this.__listeners = this.__listeners || {};
      this.__listeners[eventName] = this.__listeners[eventName] || [];
    },

    /**
     * There are 3 parameter forms, see below for detailed parameter information. Examples:
     * <pre>
     *   //Bind single event to handler
     *   obj.on('someEvent', handlerFunc, scope, [arg1, arg2, arg3]);
     *
     *   //Bind multiple events to the same handler
     *   obj.on('event1 event2 event3', handlerFunc, scope, [arg1, arg2, arg3]);
     *
     *   //Bind multiple events to different handles with the same scope and bind args:
     *   obj.on({
     *    event1: handlerFunc1,
     *    event2: handlerFunc2,
     *    scope: sameScopeObj,
     *    args: [1,2,3]
     *   });
     *
     *   //Bind multiple events to different handles with various scope and bind args:
     *   obj.on({
     *    event1: { fn: handlerFunc1, scope: otherObj1, args: [1,2,3] },
     *    event2: { fn: handlerFunc2, scope: otherObj2, args: [4,5,6] }
     *   });
     * </pre>
     *
     * @function {public void} ?
     * Add listener to this object.
     * @paramset Classic
     * @param {String} eventName - name of the event (or multiple events names separated by space)
     * @param {Function} handler - function to invoke when event is fired
     * @param {optional Object} scope - the scope to invoke handler function in. If not specified or null, defaults to the object firing the event
     * @param {optional Object} args - arguments to pass to the handler function as part of the event object (bindArgs property of the event object)
     * <pre>
     *   //<b>Bind single event to handler</b>: <u>someEvent</u> of <u>obj</u> will be bound to <u>handlerFunc</u> which will be
     *   //invoked in scope <u>scope</u>, and event object <u>bindArgs</u> property will be <u>[arg1, arg2, arg3]</u>
     *   obj.on('someEvent', handlerFunc, scope, [arg1, arg2, arg3]);
     *
     *   //Bind multiple events to the same handler
     *   obj.on('event1 event2 event3', handlerFunc, scope, [arg1, arg2, arg3]);
     * </pre>
     *
     * @paramset Config object - type 1
     * @param {Object} options - configuration hash with keys being event names and values handler functions. In addition, scope and args keys can be specified.
     * @... {Function} eventName1 - key is the event name, value is handler function
     * @... {optional Object} scope - the scope to invoke all handler functions in. If not specified or null, defaults to the object firing the event
     * @... {optional Object} args - arguments to pass to all handler functions as part of the event object (bindArgs property of the event object)
     * <pre>
     *   //Bind multiple events to different handles with the same scope and bind args:
     *   obj.on({
     *    event1: handlerFunc1,
     *    event2: handlerFunc2,
     *    scope: sameScopeObj,
     *    args: [1,2,3]
     *   });
     * </pre>
     *
     * @paramset Config object - type 2
     * @param {Object} options - configuration hash with keys being event names and values configuration objects. In addition, scope and args keys can be specified.
     * @... {Function} eventName1 - key is the event name, value is configuration object with the following keys:
     * <ul>
     *   <li><code><span class="type">Function</span> fn</code> - function to invoke when event is fired</li>
     *   <li><code>[ <span class="type">Object</span> scope ]</code> - scope to invoke fn in</li>
     *   <li><code>[ <span class="type">Object</span> args ]</code> - bind args to pass as part of event object</li>
     * </ul>
     * @... {optional Object} scope - the scope to invoke all handler functions in. If not specified or null, defaults to the object firing the event
     * @... {optional Object} args - arguments to pass to all handler functions as part of the event object (bindArgs property of the event object)
     *
     * <pre>
     *   //Bind multiple events to different handles with various scope and bind args:
     *   obj.on({
     *    event1: { fn: handlerFunc1, scope: otherObj1, args: [1,2,3] },
     *    event2: { fn: handlerFunc2, scope: otherObj2, args: [4,5,6] }
     *   });
     * </pre>
     */
    addListener: function(eventName, handler, scope, args) {
      if ($.type(eventName) === "string" && eventName.length > 0) { //event name is string: use form1
        if (eventName.indexOf(' ') == -1) {
          handler = handler || null;
          var listenerObj = {fn: handler, scope: scope || this, args: args || null};
          if (!this.hasListener(eventName, listenerObj.fn, listenerObj.scope, listenerObj.args)) {
            this.__initListeners(eventName);
            this.__listeners[eventName].push(listenerObj);
          }
        } else { //attach multiple events to the same handler, e.g: obj.on('focus blur', function(e){ alert(e) })
          var eventNames = eventName.split(' ');
          for (var i = 0; i < eventNames.length; i++) {
            this.addListener.call(this, eventNames[i], handler, scope, args);
          }
        }
      } else { //event name is object (use form2): attaching multiple listeners to multiple events
        var globalOpts = eventName;
        for (var name in globalOpts) {
          if (name != 'scope' && name != 'args'){ //skip scope and args keys (can't be event names)
            var eventOptsOrHandler = globalOpts[name];
            this.addListener(name, eventOptsOrHandler.fn || eventOptsOrHandler, eventOptsOrHandler.scope || globalOpts.scope, {args: eventOptsOrHandler.args || globalOpts.args});
          }
        }
      }
      return this;
    },

    /**
     * Usages:
     *  - Remove specific listener for event: obj.removeListener('someEvent', eventListener)
     *  - Remove all listeners for event: obj.removeListener('someEvent')
     *  - Remove all events: myObject.un()
     *  - Remove multiple listeners for events (if listener value for event is null - all listeners for this event will be unbound):
     *          obj.un({event1: event1Listener, event2: event2Listener, event3: null, ...});
     *  - Remove all listeners for multiple events: myObject.un('event1 event2 event3');
     * @function {public Object} ?
     * Remove listeners from this object.
     */
    removeListener: function(eventName, handler, options) {
      if ($.type(eventName) === "string" && eventName.length > 0) {
        if (eventName.indexOf(' ') == -1) {
          this.__initListeners(eventName);
          if (arguments.length == 1) { //remove all listeners for this eventName
            this.__listeners[eventName].clear();
          } else {
            options = options || {};
            var l = this.findListener(eventName, handler, options.scope || this, options.args || null);
            if (l !== null) {
              this.__listeners[eventName].remove(l);
            }
          }
        } else { //attach multiple events to the same handler, e.g: obj.on('focus blur', function(e){ alert(e) })
          var eventNames = eventName.split(' ');
          for (var i = 0; i < eventNames.length; i++) {
            this.removeListener.call(this, eventNames[i], handler, options);
          }
        }
      } else { //event name is object, attaching multiple listeners to multiple events
        var globalOpts = eventName;
        for (var name in globalOpts) {
          if (name != 'scope' && name != 'args'){ //skip scope and args keys (can't be event names)
            var eventOptsOrHandler = globalOpts[name];
            this.removeListener(name, eventOptsOrHandler.fn || eventOptsOrHandler, eventOptsOrHandler.scope || globalOpts.scope, {args: eventOptsOrHandler.args || globalOpts.args});
          }
        }
      }
      return this;
    },

    /**
     * @function {public boolean} ?
     * Checks if this object has listener.
     * @param eventName
     * @param fn
     * @param scope
     * @param args
     * @returns true if this object has listener for given eventName, handler function scope and args
     */
    hasListener: function(eventName, fn, scope, args) {
      return this.findListener(eventName, fn, scope, args) !== null;
    },

    /**
     * @function {public Object} ?
     * Find listener metadata object that corresponds to given parameters
     * @param eventName
     * @param fn
     * @param scope
     * @param args
     * @returns listenerObject
     * @... {Function} fn - handler function
     * @... {Object} scope - scope in which to invoke handler function
     * @... {Object} args - arguments to pass as part of event
     */
    findListener: function(eventName, fn, scope, args) {
      this.__initListeners(eventName);
      var listeners = this.__listeners[eventName];
      for (var i = 0; i < listeners.length; i++) {
        var l = listeners[i];
        if (l.fn == fn && l.scope == scope && l.args == args){
          return l;
        }
      }
      return null;
    },

    /**
     * Note if one of the listeners throws an error, other listeners don't get invoked, and error is propagated. If your
     * listener can throw error, but you want to allow normal excecution, wrap your listener code in try/catch.
     *
     * @function {public Array} ?
     * Fire all registered listeners for given event name.
     * @param {String} eventName - event name to fire listeners for
     * @param args... - arguments to pass to handler functions after the event object
     * @returns array of listeners return values (in the order of invokation) or false if excecution has been terminated by returning $.ext.$break from handler function (listener)
     */
    fireListener: function(eventName) {
      this.__initListeners(eventName);
      var listenersReturnValues = [];
      var args = $.makeArray(arguments).slice(1); //remove eventName (first argument)
      var e = {eventName: eventName, source: this, bindArgs: null}; //event object
      args.unshift(e); //add event object as the first parameter to the arguments list
      for (var i = 0; i < this.__listeners[eventName].length; ++i) {
        var l = this.__listeners[eventName][i];
        e.bindArgs = l.args;

        var res = l.fn.apply(l.scope, args) || null; //apply listener

        if(res == $.ext.$break){
          return false;
        }

        listenersReturnValues.push(res);
      }
      return listenersReturnValues;
    }

  };

  //define some aliases
  /** @function {public void} ? alias for {@link addListener} */
  ObservableModule.on = ObservableModule.addListener;
  /** @function {public void} ? alias for {@link removeListener} */
  ObservableModule.un = ObservableModule.removeListener;
  /** @function {public Array} ? alias for {@link fireListener} */
  ObservableModule.fire = ObservableModule.fireListener;

  //add module to jquery ext modules collection
  $.ext.mixins.Observable = ObservableModule;

})(jQuery);

(function($) {

  $.ext = $.ext || {};

  /**
   * @namespace $.ext.Class
   * This module defines methods for handling class creation and inheritance.
   */
  $.ext.Class = (function() {
    var __extending = {};

    var ClassMetaDataMixin = {

      getSuperClassMetaData: function() {
        return this.getClassMetaData().superClassMetaData;
      },

      getClassMetaData: function() {
        return this.__clsMetaData;
      },

      /**
       * @return reference to class constructor function (like Horizon.ui.components.Component)
       */
      getClassConstructor: function() {
        return this.getClassMetaData().classConstructor;
      },

      /**
       *
       * @param full (boolean) - if return full name including namespace
       * @return (string) name of the class. if full parameter is true, full name including namespace will be returned
       */
      getClassName: function(full) {
        var cmd = this.getClassMetaData();
        return full ? cmd.fullClassName : cmd.className;
      },

      /**
       * @return (string) namespace this class resides in (if the class is global object, empty string will be returned)
       */
      getNamespace: function() {
        return this.getClassMetaData().namespace;
      },

      /**
       * Check if this class is instance of given class (including inheritance)
       * @param fullClassNameOrConstructor (String | Function) - string with full class name or construction function reference
       * @return (boolean) return true if this class is instance of given full class name (string) or class reference (constructor function)
       */
      instanceOf: function(fullClassNameOrConstructor) {
        return typeof(fullClassNameOrConstructor) == 'string' ? this.__instanceOfByString(fullClassNameOrConstructor) : this.__instanceOfByClass(fullClassNameOrConstructor);
      },

      __instanceOfByString: function(fullClassName) {
        if (this.getClassName(true) == fullClassName) return true;
        var superClassMetaData = this.getSuperClassMetaData();
        while (superClassMetaData) {
          if (superClassMetaData.fullClassName == fullClassName) return true;
          superClassMetaData = superClassMetaData.superClassMetaData;
        }
        return false;
      },

      __instanceOfByClass: function(classConstructor) {
        if (this.getClassConstructor() == classConstructor) return true;
        var superClassMetaData = this.getSuperClassMetaData();
        while (superClassMetaData) {
          if (superClassMetaData.classConstructor == classConstructor) return true;
          superClassMetaData = superClassMetaData.superClassMetaData;
        }
        return false;
      }
    };

    var Inheritance =
    /** @scope $.ext.Class */
    {

      /**
       * @function {public static Class} ?
       * @param {String} fullClassName
       * @param {Class} classParent
       * @param {Object} classDefinition
       */
      create: function(fullClassName, classParent, classDefinition) {
        if (arguments.length == 1) { //no inheritance and no className
          classDefinition = fullClassName;
          classParent = null;
          fullClassName = 'Object';
        } else if (arguments.length == 2) {
          if (typeof(fullClassName) == 'function') { //no className, inheritance only
            classDefinition = classParent;
            classParent = fullClassName;
            fullClassName = 'Object';
          } else if (typeof(fullClassName) == 'string') { //no inheritance, with class name
            classDefinition = classParent;
            classParent = null;
          }
        }

        //this is the class constructor (which in js is simply a function) that will be returned
        var func = function() {
          if (arguments[0] == __extending) {
            return;
          }
          this.initialize.apply(this, arguments);
        };

        //add basic class names handling functions
        func.prototype.initialize = function() {
          //do nothing
        };

        //if there is inheritance
        if (typeof(classParent) == 'function') {
          func.prototype = new classParent(__extending);
          func.prototype.superClass = classParent.prototype;
        }

        //generate className info
        func.prototype.__clsMetaData = {
          classConstructor: func,
          superClassMetaData: func.prototype.__clsMetaData || null,
          fullClassName: fullClassName,
          className: function() {
            var dotIndex = fullClassName.lastIndexOf('.');
            return dotIndex == -1 ? fullClassName : fullClassName.substring(dotIndex + 1);
          }(),
          namespace: function() {
            var dotIndex = fullClassName.lastIndexOf('.');
            return dotIndex == -1 ? "" : fullClassName.substring(0, dotIndex);
          }()
        };

        //apply mixings
        var mixins = [];

        if (!func.prototype.getClassName) mixins.push(ClassMetaDataMixin);

        if (classDefinition && classDefinition.include) {
          if (classDefinition.include.reverse) {
            // methods defined in later mixins should override prior
            mixins = mixins.concat(classDefinition.include.reverse());
          } else {
            mixins.push(classDefinition.include);
          }
          delete classDefinition.include; // clean syntax sugar
        }
        if (classDefinition) Inheritance.inherit(func.prototype, classDefinition);
        for (var i = 0; (mixin = mixins[i]); i++) {
          Inheritance.mixin(func.prototype, mixin);
        }

        //set namespace
        if (func.prototype.__clsMetaData.namespace.length > 0) {
          var ns = Inheritance.namespace(func.prototype.__clsMetaData.namespace);
          ns[func.prototype.__clsMetaData.className] = func;
        }
        return func;
      },

      mixin: function (dest, src, clobber) {
        clobber = clobber || false;
        if (typeof(src) != 'undefined' && src !== null) {
          for (var prop in src) {
            if (clobber || (!dest[prop] && typeof(src[prop]) == 'function')) {
              dest[prop] = src[prop];
            }
          }
        }
        return dest;
      },

      inherit: function(dest, src, fname) {
        if (arguments.length == 3) {
          var ancestor = dest[fname], descendent = src[fname], method = descendent;
          descendent = function() {
            var ref = this.superMethod;
            this.superMethod = ancestor;
            var result = method.apply(this, arguments);
            ref ? this.superMethod = ref : delete this.superMethod;
            return result;
          };
          // mask the underlying method
          descendent.valueOf = function() {
            return method;
          };
          descendent.toString = function() {
            return method.toString();
          };
          dest[fname] = descendent;
        } else {
          for (var prop in src) {
            if (dest[prop] && typeof(src[prop]) == 'function') {
              Inheritance.inherit(dest, src, prop);
            } else {
              dest[prop] = src[prop];
            }
          }
        }
        return dest;
      },

      /**
       * @function {public static Class} ?
       */
      singleton: function() {
        var args = arguments;
        if (args.length == 2 && args[0].getInstance) {
          var klass = args[0].getInstance(__extending);
          // we're extending a singleton swap it out for it's class
          if (klass) {
            args[0] = klass;
          }
        }

        return (function(args) {
          // store instance and class in private variables
          var instance = false;
          var klass = Inheritance.create.apply(args.callee, args);
          return {
            getInstance: function () {
              if (arguments[0] == __extending) return klass;
              if (instance) return instance;
              return (instance = new klass());
            }
          };
        })(args);
      },

      /**
       * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
       * <pre>
       *  //will make sure global (window) variable org with property myorg with property utils is present
       *  $.ext.Class.namespace('org.myorg.utils');
       *  org.myorg.utils.Widget = function() { ... }
       *  org.myorg.MyClass = function(config) { ... }
       * </pre>
       * @function {public static Object} ?
       * Creates namespaces to be used for scoping variables and classes so that they are not global.
       * @param {String} ns - namespace string
       * @returns The namespace object. (the last namespace created)
       */
      namespace: function(ns) {
        ns = ns || "";
        var nsArray = ns.split(".");
        var globalVar = nsArray[0];
        var obj = window[globalVar] = window[globalVar] || {};
        var arr = nsArray.slice(1);
        for (var j = 0; j < arr.length; j++) {
          var v2 = arr[j];
          obj = obj[v2] = obj[v2] || {};
        }
        return obj;
      }
    };

    return Inheritance;

  })();

})(jQuery);

jQuery.ext.Extender.addWrapedSetMethods({

  bindLater: function(type, data, fn, when) {
    var timeout = 200;
    if (arguments.length == 4){
      timeout = Array.prototype.pop.call(arguments); //full form: $().bind('click', {arg1: 2, arg2: 'asdf'}, function(){ //do stuff}, 4000);
    }
    else if (arguments.length == 3 && jQuery.isFunction(data) && jQuery.isNumber(fn)) {
      timeout = Array.prototype.pop.call(arguments);
    }
    else if (arguments.length == 2 && typeof type === "object" && jQuery.isNumber(data)) {
      timeout = Array.prototype.pop.call(arguments);
    }

    var self = this;
    var args = arguments;
    window.setTimeout(function() {
      self.bind.apply(self, args);
    }, timeout);
    return this;
  }

}, true);
jQuery.ext.Extender.addWrapedSetMethods(
  /**
   * @namespace $()
   * jQuery wrapped set methods
   */
  {

    /**
     * Return object that contains this element top,left,bottom,right coordinates relative to the document
     * @param outer (default true) - outerWidth/outerHeight (including padding and borders) coordinates are returned.
     */
    region: function(outer) {
      var self = jQuery(this);

      var offset = self.offset();
      var top = Math.ceil(offset.top);
      var left = Math.ceil(offset.left);
      var w, h;
      if (outer === false) {
        w = self.width();
        h = self.height();
      } else {
        w = self.outerWidth();
        h = self.outerHeight();
      }
      return {top: top, left: left, right: left + w, bottom: top + h};
    },

    outerHeight: function(outerOrHeight, includeMargins) {
      if (!this[0]) return null;

      if (jQuery.isNumber(outerOrHeight)) { //set outerHeight of component
        var delta = this.jq_original_outerHeight(includeMargins) - this.height();
        return this.height(outerOrHeight - delta);
      } else { //invoke original jquery getter
        return this.jq_original_outerHeight.apply(this, arguments);
      }
    },

    outerWidth: function(outerOrWidth, includeMargins) {
      if (!this[0]) return null;

      if (jQuery.isNumber(outerOrWidth)) {
        var delta = this.jq_original_outerWidth(includeMargins) - this.width();
        return this.width(outerOrWidth - delta);
      } else { //invoke original jquery getter
        return this.jq_original_outerWidth.apply(this, arguments);
      }
    },

    /**
     * @function {public boolean} ?
     * Return true if this element is contained inside one of the given parents.
     * @param {Array} possibleParents - array of jQuery wrapped sets or plain elements which are the parents to search for containment of this element
     * @returns true if first element of the wrapped set is contained in at least one of the given parents
     */
    containedIn: function(possibleParents) {
      if (!this[0]) return null;
      if (!jQuery.isArray(possibleParents)) possibleParents = [possibleParents];

      var el = this[0];
      for (var i = 0; i < possibleParents.length; i++) {
        var p = possibleParents[i];
        if (p instanceof jQuery) p = possibleParents[i].get(0);
        if (jQuery.contains(p, el)) return true; //clicked element is inside this component, so no blur is needed
      }
      return false;
    }

  }, true);
