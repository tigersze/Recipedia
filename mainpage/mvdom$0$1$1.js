//MinVirtualDOM.js beta build 0.1.1
//Authored 2019 Chan Hing Nin Harry (Alphaharrius)
//Description
//Implementation of Shallow Virtual DOM Algorithm
//Shallow Virtual DOM does not have a node tree
//with child nodes as sub properties of parent node,
//instead uses index referencing to trace relations
//and the HTMLElement associated to the virtual node.
//The rendering method of this Virtual DOM Algorithm
//is a difference trace rendering pipeline including 
//an overlapping optimisation to prevent redundant
//or repeative rendering operations. Trace rendering
//made use of a pre-referenced trace of the HTMLElement
//linked to the virtual node, updates can be made
//directly instead of looking up the actual DOM.
//New In 0.1.1
//The element creation method used in beta build
//is abandoned, we are now using dom api to create
//element for the element traces.
//The updating method of text node is previously 
//computational expensive as it recreate the text
//node for every change in text content. The new
//method will be treating textContent as attribute
//and update it within the update buffer.
//Upcoming
//The current update of style and class attribute
//is computational wise redundant, every change is
//then applied to the entire attribute. The new method
//should only update the specific set of style or class
//changed in the update process.
(function(global, factory){ global.MinVDOM = factory(); })
(this, function(){

    //Syntax Style:
    //  [Objects] => $OBJECT_NAME
    //  [Arrays] => ARRAY_NAMEs
    //  [Variables] => VAR_NAME
    //  [Util Functions] => FUNCTION_NAME()
    //  [Function Objects] => $$FUNCTION_NAME()

    //Util Functions
    //According to experienced programmer, 
    //using these utils will help compiler
    //generates better vm code.

    //Check is variable is defined
    function isDef(v){
        return v !== null && v !== undefined;
    }

    //Check if variable is undefined
    function isUnDef(v){
        return v !== null && v === undefined;
    }

    //CHeck is variable is Object
    function isObject(v){
        return v !== null && typeof v === 'object';
    }

    var $$push = Array.prototype.push;
    var $$includes = Array.prototype.includes;
    function push($arr, val){
        return $$push.call($arr, val);
    }
    
    //This push method ensures the distinction of
    //element value within the target array.
    function distinctPush($arr, val){
        if($$includes.call($arr, val))
            return $arr;
        return push($arr, val);
    }

    //Remove an element from array by value,
    //only the first match will be removed
    function remove (arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1)
                return arr.splice(index, 1);
        }
    }

    var $$keys = Object.keys;
    function keys($object){
        return $$keys.call(null, $object);
    }

    //Similar to for each, the operated
    //object will be binded to this keyword
    function forKeys($object, $$handler){
        var _keys = keys($object);
        var length = _keys.length;
        var i, key; for(i = 0; i < length; i++){
            key = _keys[i], val = $object[key];
            $$handler.bind($object, key).call();
        }
    }

    var $$hasOwnProperty = 
        Object
            .prototype
            .hasOwnProperty;
    function hasOwn($object, prop){
        return $$hasOwnProperty
            .call($object, prop);
    }

    //Cloning of JSON object by recursive function,
    //all layers of the object will be cloned, when
    //the order of properties within object type might
    //change, the element order of array type will not
    //be affected, thus it is safe to use.
    //Some types of data might be mutated during the
    //process, but the main use of this function is
    //for cloning nodes, thus it is safe to use.
    function deepClone($object){
        var $clone = {};
        function clone($0, $1){
            var props = keys($0);
            var propsSize = props.length;
            var i; for(i = 0; i < propsSize; i++){
                var prop = props[i];
                var val0 = $0[prop];
                if(!isObject(val0)){
                    $1[prop] = val0;
                    continue;
                }
                $1[prop] = Array.isArray(val0) ? [] : {};
                clone($0[prop], $1[prop]);
            }
        }
        clone($object, $clone);
        return $clone;
    }

    //DOM API
    var htmlElementProto = HTMLElement.prototype;
    var $$appendChild = htmlElementProto.appendChild;
    var $$removeChild = htmlElementProto.removeChild;
    function appendChild(element, child){
        return $$appendChild.call(element, child);
    }
    function removeChild(element, child){
        return $$removeChild.call(element, child);
    }

    function warn(caller, msg){
        console.warn('[MinVDOM, ' + caller + ']:' + msg);
    }

    //GLOBAL CONSTANTS
    const VNODE_TYPE_ELEMENT = 1;
    const VNODE_TYPE_ATTRIB = 2;
    const VNODE_TYPE_TEXT = 3;

    const VNODE_INDEX_HOST = '#host';

    function injectVirtualNodeInterface(MinVDOM){

        /**
         * [MinVDOM Object].vnode
         * @param {String} vnodeTag -This must be a valid HTML tag.
         * @param {JSON} $attributes -This defines the HTMLElement attributes.
         * @param {JSON} $properties -This defines the associated properties.
         */
        function $$vnode(vnodeTag, $attributes, $properties){
            var vnode = '#' + this.vnodesCount++;
            this.$vnodes[vnode] = {
                type : VNODE_TYPE_ELEMENT,
                tag : vnodeTag,
                $attrib : $attributes,
                $prop : $properties,
                parent : VNODE_INDEX_HOST,
                $children : [],
                $descendant : [],
            };
            this._createNodeTrace(vnode);
            return vnode;
        }

        function $$vtext(text){
            var vnode = '#' + this.vnodesCount++;
            this.$vnodes[vnode] = {
                type : VNODE_TYPE_TEXT,
                parent : '',
                $attrib : {text : text},
                $descendant : []
            }
            this._createNodeTrace(vnode);
            return vnode;
        }

        function $$vattrib(vattribTag, $attributes, $properties){
            var vnode = '#' + this.vnodesCount++;
            this.$vnodes[vnode] = {
                type : VNODE_TYPE_ATTRIB,
                tag : vattribTag,
                $attrib : $attributes,
                $prop : $properties,
                $children : [],
                $descendant : [],
            }
            this._createNodeTrace(vnode);
            return vnode;
        }

        function $$push(vnode, parent){
            //Checks if vnode is defined
            var $vnode = this.$vnodes[vnode];
            var $vDOM = this.$virtualDOM;
            if(isUnDef($vnode))
                warn('VnodePush', 'The given node index <' + vnode + '> is undefined.');
            if(hasOwn($vDOM, vnode))
                this.pull(vnode);
            //Clone the vnode object for adding to the vDOM
            $vnode = deepClone($vnode);
            if(isDef(parent)){
                $vnode.parent = parent;
                var $parent = isDef($vDOM[parent]) ?
                    $vDOM[parent] : 
                    this.$vnodes[parent];
                $parent.$children.push(vnode);
                var descendants = $vnode.$descendant;
                var descCount = descendants.length;
                var pDescendants;
                while(parent != VNODE_INDEX_HOST){
                    $parent = isDef($vDOM[parent]) ?
                        $vDOM[parent] : 
                        this.$vnodes[parent];
                    pDescendants = $parent.$descendant;
                    distinctPush(pDescendants, vnode);
                    var i; for(i = 0; i < descCount; i++)
                        distinctPush(pDescendants, descendants[i]);
                    parent = $parent.parent;
                }
            }else
                $vnode.parent = VNODE_INDEX_HOST;
            this.$virtualDOM[vnode] = $vnode;
        }

        function $$pull(vnode){
            //Checks if vnode is defined
            var $vnodes = this.$vnodes;
            if(!hasOwn($vnodes, vnode))
                warn('VnodePull', 'The given node index <' + vnode + '> is undefined.');
            var $vDOM = this.$virtualDOM;
            var $vnode = $vDOM[vnode];
            if(isUnDef($vnode))
                return;
            var parent = $vnode.parent;
            if(parent != VNODE_INDEX_HOST){
                var $parent = $vDOM[parent] ? 
                    $vDOM[parent] : $vnodes[parent];
                remove($parent.$children, vnode);
                remove($parent.$descendant, vnode);
                parent = $parent.parent;
                var descendants = $vnode.$descendant;
                var descCount = descendants.length;
                var pDescendants;
                while(parent != VNODE_INDEX_HOST){
                    $parent = $vDOM[parent];
                    pDescendants = $parent.$descendant;
                    remove(pDescendants, vnode);
                    var i; for(i = 0; i < descCount; i++)
                        remove(pDescendants, descendants[i]);
                    parent = $parent.parent;
                }
            }
            $vnodes[vnode] = deepClone($vnode);
            delete $vDOM[vnode];
        }

        function $$content(vnode, text){
            var $vnodes = this.$vnodes;
            var $vnode = isDef(this.$virtualDOM[vnode]) ? 
                this.$virtualDOM[vnode] : $vnodes[vnode];
            if(!hasOwn($vnodes, vnode))
                warn('VnodeAttribute', 'The given node index <' + vnode + '> is undefined.');
            if($vnode.type != VNODE_TYPE_TEXT)
                warn('VnodeAttribute', 'Unable to set text for non text node.');
            $vnode.$attrib.text = text;
        }

        function $$attribute(vnode, attribute, value){
            var $vnodes = this.$vnodes;
            var $vnode = isDef(this.$virtualDOM[vnode]) ? 
                this.$virtualDOM[vnode] : $vnodes[vnode];
            if(!hasOwn($vnodes, vnode))
                warn('VnodeAttribute', 'The given node index <' + vnode + '> is undefined.');
            if($vnode.type == VNODE_TYPE_TEXT)
                warn('VnodeAttribute', 'Unable to set attribute of text node.');
            $vnode.$attrib[attribute] = value;
        }

        function $$trace(vnode){
            var $vnodes = this.$vnodes;
            if(!hasOwn($vnodes, vnode))
                warn('VnodeTrace', 'The given node index <' + vnode + '> is undefined.');
            return $vnodesTrace[vnode];
        }

        MinVDOM.prototype.vnode = $$vnode;
        MinVDOM.prototype.vtext = $$vtext;
        MinVDOM.prototype.vattrib = $$vattrib;
        MinVDOM.prototype.content = $$content;
        MinVDOM.prototype.attribute = $$attribute;
        MinVDOM.prototype.trace = $$trace;
        MinVDOM.prototype.push = $$push;
        MinVDOM.prototype.pull = $$pull;

    }

    function injectRenderMethods(MinVDOM){

        function createNodeTrace(vnode){
            var $vnode = this.$vnodes[vnode];
            var trace;
            if($vnode.type == VNODE_TYPE_TEXT)
                trace = document.createTextNode($vnode.$attrib.text);
            else{
                trace = document.createElement($vnode.tag);
                var $attribute = $vnode.$attrib;
                var attributes = keys($attribute);
                var len = attributes.length;
                var i, attribute; for(i = 0; i < len; i++){
                    attribute = attributes[i];
                    trace.setAttribute(attribute, $attribute[attribute]);
                }
                var $property = $vnode.$prop;
                var properties = keys($property);
                var len = properties.length;
                var i, property; for(i = 0; i < len; i++){
                    property = properties[i];
                    trace[property] = $property[property];
                }
            }
            this.$vnodeTraces[vnode] = trace;
            return trace;
        }

        function renderPrepare(targets){

            var $vDOM = this.$virtualDOM;
            var $rDOM = this.$renderDOM;

            if(isDef(targets)){
                var $vTarget = {};
                var $rTarget = {};
                var len = targets.length;
                var i, vnode, $vnode; for(i = 0; i < len; i++){
                    vnode = targets[i];
                    $vnode = $vDOM[vnode];
                    if(isDef($vnode))
                        $vTarget[vnode] = $vnode;
                    $vnode = $rDOM[vnode];
                    if(isDef($vnode))
                        $rTarget[vnode] = $vnode;
                    $vDOM = $vTarget;
                    $rDOM = $rTarget;
                }
            }

            var $rBuffer = this.$renderBuffer;
            var $uBuffer = this.$updateBuffer;
            var $dBuffer = this.$deleteBuffer;

            function comDiffToBuffer($aDOM, $bDOM, $buffer){
                var nodes = keys($aDOM);
                var nodesCount = nodes.length;
                var node, $aNode, $bNode;
                var i; for(i = 0; i < nodesCount; i++){
                    node = nodes[i];
                    $aNode = $aDOM[node];
                    $bNode = $bDOM[node];

                    //These code below requires a rewrite...
                    //If node is not text node, check attributes
                    //The fix is to change text into an attribute
                    //So the flow of the below code can be converted to:
                    //  1.  Iterative check on attributes of each node
                    //  2.  If node doesn't exist on bDOM, 
                    //      or node is a text node,
                    //      skip children checkings

                    //Check for attributes mutation or change,
                    //This method is not final, remain for beta stage
                    var $aAttrib = $aNode.$attrib;
                    var $bAttrib = isDef($bNode) ? $bNode.$attrib : {};
                    var aAttribs = keys($aAttrib);
                    var aAttribsCount = aAttribs.length;
                    var c, attrib; for(c = 0; c < aAttribsCount; c++){
                        attrib = aAttribs[c];
                        if(isUnDef($bAttrib) || $aAttrib[attrib] != $bAttrib[attrib]){
                            if(isUnDef($uBuffer[node]))
                                $uBuffer[node] = [];
                            distinctPush($uBuffer[node], attrib);
                        }
                    }

                    if(isUnDef($bNode)){
                        $buffer[node] = true;
                        continue;
                    }

                    if($aNode.type == VNODE_TYPE_TEXT)
                        continue;

                    var addRest = false;
                    var children = $aNode.$children;
                    var bChildren = $bNode.$children;
                    var childrenCount = children.length;
                    var child, bChild;
                    for(c = 0; c < childrenCount; c++){
                        child = children[c];
                        bChild = bChildren[c];
                        if(addRest){
                            $buffer[child] = true;
                            continue;
                        }
                        if(isUnDef(bChild) || children[c] != bChild){
                            addRest = true;
                            $buffer[child] = true;
                        }
                    }

                }
            }

            comDiffToBuffer($vDOM, $rDOM, $rBuffer);
            comDiffToBuffer($rDOM, $vDOM, $dBuffer);

        }

        function renderRender(){

            var $vDOM = this.$virtualDOM;
            var $rDOM = this.$renderDOM;
            var $vTrace = this.$vnodeTraces;
            var $rBuffer = this.$renderBuffer;
            var $dBuffer = this.$deleteBuffer;

            forKeys(
                $dBuffer, 
                function(vnode){
                    if(isDef($rBuffer[vnode]))
                        return;
                    removeChild(
                        $vTrace[
                            $rDOM[vnode].parent
                        ],
                        $vTrace[vnode]
                    );
                }
            );

            forKeys(
                $rBuffer,
                function(vnode){
                    var $vnode = $vDOM[vnode];
                    var trace = $vTrace[vnode];
                    appendChild(
                        $vTrace[
                            $vnode.parent
                        ],
                        trace
                    )
                }
            )

        }

        function renderUpdate(){

            var $uBuffer = this.$updateBuffer;
            var $vnodes = this.$vnodes;
            var $vDOM = this.$virtualDOM;
            var $vTrace = this.$vnodeTraces;
            forKeys(
                $uBuffer,
                function(vnode){
                    var $vnode = $vDOM[vnode] ? 
                        $vDOM[vnode] : 
                        $vnodes[vnode];
                    if($vnode.type == VNODE_TYPE_TEXT){
                        $vTrace[vnode].textContent = $vnode.$attrib.text;
                        return;
                    }
                    var trace = $vTrace[vnode];
                    var $attrib = isDef($vnode) ? 
                        $vnode.$attrib : 
                        $vnodes[vnode].$attrib;
                    var attribs = $uBuffer[vnode];
                    var length = attribs.length;
                    var i; for(i = 0; i < length; i++){
                        var attrib = attribs[i];
                        if(isDef($attrib[attrib]))
                            trace.setAttribute(attrib, $attrib[attrib]);
                        else    
                            trace.removeAttribute(attrib);
                    }
                }
            )
            
        }

        function renderWrap(){
            //The use of deepClone to copy the entire
            //VirtualDOM to the RenderDOM might be inefficient
            //and computational wise redundant, yet the simplicity
            //of this method leaves me to use it for now.
            //For a VirtualDOM with small element count, this
            //method have minimal effect on performance,
            //so we will leave it be for the beta stage
            //of this project.

            //These logs are for operation count checking of the pipeline
            // console.log('[MinVDOM]: deleted ' + keys(this.$deleteBuffer).length);
            // console.log('[MinVDOM]: rendered ' + keys(this.$renderBuffer).length);
            // console.log('[MinVDOM]: updated ' + keys(this.$updateBuffer).length);
            this.$renderDOM = deepClone(this.$virtualDOM);
            this.$renderBuffer = {};
            this.$updateBuffer = {};
            this.$deleteBuffer = {};
        }

        function $$render(targets){
            console.log('[MinVDOM]: render start...');
            var t1 = performance.now();
            this._renderPrepare(targets);
            this._renderRender();
            this._renderUpdate();
            this._renderWrap();
            var t2 = performance.now();
            console.log('[MinVDOM]: this rendering took ' + (t2 - t1) + ' milliseconds');
        }

        MinVDOM.prototype._createNodeTrace = createNodeTrace;
        MinVDOM.prototype._renderPrepare = renderPrepare;
        MinVDOM.prototype._renderRender = renderRender;
        MinVDOM.prototype._renderUpdate = renderUpdate;
        MinVDOM.prototype._renderWrap = renderWrap;
        MinVDOM.prototype.render = $$render;
    }

    function injectVirtualDOMAPI(MinVDOM){
        function $$import($vDOM){
            if(!isObject($vDOM))
                warn('VDOMImport', 'The given VirtualDOM is invalid.');
            this.$virtualDOM = deepClone($vDOM);
        }
        function $$export(){
            return deepClone(this.$renderDOM);
        }
        MinVDOM.prototype.import = $$import;
        MinVDOM.prototype.export = $$export;
    }

    function MinVDOM(hostElement){
        if(!this instanceof MinVDOM)
            warn('Constructor', 'Constructor must be called with the new keyword.');
        this.hostElement = hostElement;
        this.vnodesCount = 0;
        this.$vnodes = {};
        this.$virtualDOM = {};
        this.$vnodeTraces = {};
        this.$renderDOM = {};
        this.$renderBuffer = {};
        this.$updateBuffer = {};
        this.$deleteBuffer = {};

        this.$vnodeTraces[VNODE_INDEX_HOST] = hostElement;
    }

    MinVDOM.version = '0.1.1';
    injectVirtualNodeInterface(MinVDOM);
    injectRenderMethods(MinVDOM);
    injectVirtualDOMAPI(MinVDOM);

    return MinVDOM;

});