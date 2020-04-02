//Template.js
//Author: Chan Hing Nin Harry (Alphaharrius)
//Lightweight utility for loading templates from a single file
!function(global){

    function log(caller, msg){
        console.log('[Template, ' + caller + ']: ' + msg);
    }

    function warn(caller, msg){
        console.warn('[Template, ' + caller + ']: ' + msg);
    }

    var Template = global.Template = {};
    
    Object.defineProperty(
        Template, 
        '$fetched', 
        {
            writable : false,
            enumerable : false,
            configurable : true,
            value : {}
        }
    );

    Template.load = function(url){
        var parse = document.createElement('div');
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);
        if(req.status === 200){
            parse.innerHTML = req.responseText;
            var index, template, nodeType, 
            templates = parse.childNodes, count = templates.length;
            var i = 0, fetched = 0, template; for(;i < count; i++){
                template = templates[i];
                nodeType = template.nodeType;
                if(nodeType !== 1) continue;
                fetched++;
                index = template.getAttribute('template');
                this.$fetched[index] = template;
            }
            parse = undefined;
            return log('load', 'Fetched ' + fetched + ' templates from "' + url + '"');
        }else
            return warn('load', 'Unable to load, template file not found...');
    }

    Template.retrieve = function(index){
        var $ = this;
        var template = 
            new DOMParser()
                .parseFromString(
                    $.$fetched[index].outerHTML, 
                    'text/html')
                .body
                .children[0];
        if(template === undefined)
            return warn('retrieve', 'The given index have not been fetched...');
        return template;
    }


}(this);