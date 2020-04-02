//Watcher.js
//version: 1.0.5
//Author: Alphaharrius (Harry)
//Description:  
//  A utility for creating an object with 
//  getters and setters for variables
(
    function(global, factory){
        global.Watcher = factory();
    }
)(
    this,
    function(){

        function isDef(w){
            return w !== null && w !== undefined;
        }

        function isObject(w){
            return w !== null && typeof w === 'object';
        }

        var $keys = Object.keys;
        function keys(w){
            $keys.call(w);
        }

        var $isArray = Array.isArray;
        function isArray(w){
            return $isArray(w);
        }

        var $hasOwnProperty = Object.prototype.hasOwnProperty;
        function has(w, prop){
            return $hasOwnProperty.call(w, prop);
        }

        var $defineProperty = Object.defineProperty;
        function defineProperty($par, prop, $attrib){
            $defineProperty.call(null, $par, prop, $attrib);
        }

        var $defineProperties = Object.defineProperties;
        function defineProperties($par, $props){
            $defineProperties.call(null, $par, $props);
        }

        function warn(w){
            console.warn(w);
        }

        function _inject$Init(Watcher){

            var $init = function (){
                defineProperties(
                    this,
                    {
                        _val : {
                            enumerable : false,
                            writable : true,
                            value : {}
                        },
                        _setter : {
                            enumerable : false,
                            writable : true,
                            value : {}
                        },
                        _getter : {
                            enumerable : false,
                            writable : true,
                            value : {}
                        },
                        _settings : {
                            enumerable : true,
                            writable : true,
                            value : {
                                _global_setter_isolation : false,
                                _global_getter_isolation : true
                            }
                        }
                    }
                );
                delete this._init;
            }

            Watcher.prototype._init = $init;

        }

        function _inject$Watch(Watcher){

            //Watch API
            //  [Watcher Object].watch(PROPERTY_NAME, PROPERTY_VALUE, SETTER, GETTER)
            //      This function wraps the feature to insert a new property
            //      to a Watcher object, the inserted property is being watched
            //      and the associated setter or getter function will be provoked.
            //      Any setter and getters with undefined or null type will be
            //      converted to an empty function automatically
            //  [Watcher Object].unwatch(PROPERTY_NAME)
            //      This function wraps a safe deletion action of property of
            //      a Watcher object, the associated value, setter and getter
            //      will be safely removed.

            var $watch = function(prop, val, setter, getter){
                setter = 
                    isDef(setter) ? 
                        setter : 
                        function(){};
                getter = 
                    isDef(getter) ? 
                        getter : 
                        function(){};
                this._val[prop] = val;
                this._setter[prop] = setter.bind(this);
                this._getter[prop] = getter.bind(this);
                defineProperty(
                    this, 
                    prop, 
                    {
                        enumerable : true,
                        configurable : true,
                        set : function(newVal){
                            var oldVal = this._val[prop];
                            this._val[prop] = newVal;
                            if(!this._settings._global_setter_isolation)
                                this._setter[prop](prop, newVal);
                            return oldVal;
                        },
                        get : function(){
                            if(!this._settings._global_getter_isolation)
                                this._getter[prop]();
                            return this._val[prop];
                        }
                    }
                );

                return this;
            }

            var $unwatch = function(prop){
                if(!has(this, prop))
                    warn('Cannot unwatch undefined property.');
                delete this._val[prop];
                delete this._setter[prop];
                delete this._getter[prop];
                delete this[prop];

                return this;
            }

            Watcher.prototype.watch = $watch;
            Watcher.prototype.unwatch = $unwatch;

        }

        var _push = Array.prototype.push,
            _pop = Array.prototype.pop,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            _splice = Array.prototype.splice,
            _sort = Array.prototype.sort,
            _reverse = Array.prototype.reverse,
            _concat = Array.prototype.concat;
        
        function push(arr, w){
            return _push.call(arr, w);
        }

        function pop(arr){
            return _pop.call(arr);
        }

        function shift(arr){
            return _shift.call(arr);
        }

        function unshift(arr, w){
            return _unshift.call(arr, w);
        }

        function sort(arr, w){
            return _sort.call(arr, w);
        }

        function reverse(arr){
            return _reverse.call(arr);
        }

        function _inject$Inject(Watcher){

            //Inject API
            //  [Watcher Object].setter(PROPERTY_NAME, SETTER)
            //  [Watcher Object].getter(PROPERTY_NAME, GETTER)
            //      These function wraps the injection of setter or
            //      getter to a defined property within a Watcher
            //      object, existing setter or getter will be replaced.

            var $setter = function(prop, setter){
                if(!has(this, prop))
                    warn('Cannot inject to undefined property.');
                this._setter[prop] = setter;

                return this;
            }

            var $getter = function(prop, getter){
                if(!has(this, prop))
                    warn('Cannot inject to undefined property.');
                this._setter[prop] = getter;

                return this;
            }

            Watcher.prototype.setter = $setter;
            Watcher.prototype.getter = $getter;

        }

        function _inject$Inspect(Watcher){
            //Inspect API
            //  [Watcher Object].inspect(PROPERTY_NAME)
            //      This function allows the watcher to watch on
            //      all functional object mutation of a defined 
            //      property within a Watcher Object by, for example
            //      Array.prototype.push, setter of the parent
            //      property will be provoked per mutation.
            //  [Watcher Object].[Array Property].add(ARRAY)
            //      This injected method is to add all elements from
            //      ARRAY to the Array Property of a Watcher Object.
            //  [Watcher Object].[Array Property].clear()
            //      This injected method is to clear an array property
            //      of a Watcher Object, the result property will be a
            //      empty array with length 0.
            //  [Watcher Object].extract(PROPERTY_NAME)
            //      This function is intended for the extraction of
            //      a defined object / array type property of a Watcher 
            //      Object, all functional property injected by the
            //      Watcher will be filtered.
            
            var $inspect = function(prop){

                if(!has(this, prop))
                    warn('Cannot inspect undefined property.');
                
                var $prop = this[prop];

                if(!isObject($prop))
                    warn('Cannot inspect non-object property.');

                var $callSetter = function(prop){
                    if(!this._settings._global_setter_isolation)
                        this._setter[prop](prop, this[prop]);
                }.bind(this, prop);

                var $callGetter = function(prop){
                    if(!this._settings._global_getter_isolation)
                        this._getter[prop](prop, this[prop]);
                }.bind(this, prop);

                var $observeSubProperties = function($parent, prop){
                    
                    var $prop = $parent[prop];
                    $parent._val[prop] = $parent[prop];

                    defineProperty(
                        $parent, 
                        prop, 
                        {
                            enumerable : true,
                            configurable : true,
                            set : function(newVal){
                                var oldVal = $parent._val[prop];
                                $parent._val[prop] = newVal;
                                $callSetter();
                                return oldVal;
                            },
                            get : function(){
                                $callGetter();
                                return $parent._val[prop];
                            }
                        }
                    );

                    if(!isObject($prop))
                        return this;

                    defineProperties(
                        $prop,
                        {
                            _val : {
                                enumerable : false,
                                writable : true,
                                value : {}
                            }
                        }
                    );

                    if(isArray($prop))
                        defineProperties(
                            $prop, 
                            {
                                push : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(w){
                                        var $ = push(this, w);
                                        $callSetter();
                                        $observeSubProperties(this, this.length - 1);
                                        return $;
                                    }
                                },
                                pop : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(){
                                        var $ = pop(this);
                                        $callSetter();
                                        return $;
                                    }
                                },
                                shift : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(){
                                        var $ = shift(this);
                                        $callSetter();
                                        return $;
                                    }
                                },
                                unshift : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(w){
                                        var $ = unshift(this, w);
                                        $callSetter();
                                        return $;
                                    }            
                                },
                                splice : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(){
                                        var args = [];
                                        var arg; for(arg of arguments)
                                            push(args, arg);
                                        var $ = _splice.apply(this, args);
                                        $callSetter();
                                        return $;
                                    }
                                },
                                sort : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(w){
                                        sort(this, w);
                                        $callSetter();
                                    }
                                },
                                reverse : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(){
                                        reverse(this);
                                        $callSetter();
                                    }
                                },
                                add : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(arr){
                                        var e; for(e of arr)
                                            this.push(e);
                                        $callSetter();
                                        return this.length;
                                    }
                                },
                                clear : {
                                    enumerable : false,
                                    writable : true,
                                    value : function(){
                                        this.splice(0, this.length);
                                    }
                                }
                            }
                        );

                    var subProp; for(subProp of $keys($prop)){
                        if(has($prop, subProp))
                            $observeSubProperties($prop, subProp);
                    }
                    
                }

                $observeSubProperties(this, prop, []);


                return this;
                
            }

            var $extract = function(prop){

                if(!has(this, prop))
                    warn('Cannot extract undefined property.');
                
                var $prop = this[prop];

                if(!isObject($prop))
                    warn('Cannot extract non-object property.');

                return isArray($prop) ? 
                    (
                        function(){
                            var arr = [];
                            var $sub; for($sub of $prop)
                                push(arr, $sub);
                            return arr;
                        }
                    )() : 
                    (
                        function(){
                            var obj = {};
                            var key; for(key of keys($prop))
                                if(has($prop, key))
                                    obj[key] = $prop[key];
                            return obj;
                        }
                    )();

            }

            Watcher.prototype.inspect = $inspect;
            Watcher.prototype.extract = $extract;

        }

        function Watcher(){
            if(
                !(this instanceof Watcher)
            ) warn('The constructor of Watcher must be called with the new keyword.');
            this._init();
        }

        _inject$Init(Watcher);
        _inject$Watch(Watcher);
        _inject$Inject(Watcher);
        _inject$Inspect(Watcher);

        return Watcher;
    }
);