this.Colorant = {

    paint : function(){

        console.log('[Colorant]: Scanning for color class...');
        var cnt = 0;
        var nodes = document.querySelectorAll('*');
        var i, node, nodeType, classList, len = nodes.length; 
        for(i = 0; i < len; i++){
            node = nodes[i];
            nodeType = node.nodeType;
            if(nodeType !== 1 && nodeType !== 2)
                continue;
            classList = node.classList;
            var c, l, color, className; 
            for(c = 0, l = classList.length; c < l; c++){
                className = classList[c];
                if(className[1] != ':')
                    continue;
                color = className.slice(2);
                if(className[0] == 'b')
                    node.style.backgroundColor = color;
                else if(className[0] == 't')
                    node.style.color = color;
                else continue;
                classList.remove(className);
                cnt++;
            }
    
        }

        console.log('[Colorant]: Updated ' + cnt + ' color classes!');
    
    }

};