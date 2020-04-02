var TE = {
    templateCollections : {},
    globalInitialise : function(url, initialiseHandler){
        var templateField = document.createElement('DIV');
        fetch(url)
            .then((response) => response.text())
            .then((html) => {
                templateField.innerHTML = html;
                var templates = templateField.childNodes;
                var template; for(template of templates)
                    if(template.nodeType == 1)
                        this.templateCollections[template.getAttribute('template')] = template;
                templateField = null;
                initialiseHandler();
            })
            .catch((error) => {
                document.getElementsByTagName('body')[0].innerHTML = 
                    "<h1>Template Files not found, unable to proceed :(</h1><h3 style='color:red'>" + error + "</h3>" ;
            });
    },
    fetchTemplate : function(templateID){
        return this.templateCollections[templateID].cloneNode(true);
    }
}