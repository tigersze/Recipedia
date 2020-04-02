Template.load('templates.html');

//Global Initialization
//*******************************************************************//
var main = document.getElementById('main');
var sub = document.getElementById('sub');
var warning = document.getElementById('warning');
var navBar = document.getElementById('nav-bar');
var recipesButton = document.getElementById('recipes-button');
var searchButton = document.getElementById('search-button');
var uploadButton = document.getElementById('upload-button');
var settingsButton = document.getElementById('settings-button');

var displayContainer = document.getElementById('display');

var searchField = document.createElement('DIV');
var recipeList = document.createElement('DIV');
var recipeUploadField = document.createElement('DIV');
var settingsField = document.createElement('DIV');

var recipeCardsBuffer = [];
var uploaded_profile = false;
var uploaded_recipe = false;
//*******************************************************************//

function AJAXPost(url, formData, onReadyStateHandler){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log('[AJAX Data]: "' + this.responseText + '"');
            onReadyStateHandler(JSON.parse(this.responseText));
            var res = JSON.parse(this.responseText);
                if(res.upload_profile == "success"){
                    document.getElementById("message").innerHTML = "Upload profile sucessful";
                }
                else if(res.upload_recipe == "success"){
                    document.getElementById("response").innerHTML = "Upload recipe sucessful";
                }
                else if(res.upload_profile == "fail"){
                    document.getElementById("message").innerHTML = "Upload profile failed, try again!";
                }
                else if(res.upload_recipe == "fail"){
                    document.getElementById("response").innerHTML = res.error;
                }          
        }
    }
    xhr.open('POST', url, true);
    xhr.send(formData);
}
function upload_profile(){
    validate();
    var form_data = new FormData();
    form_data.append("first_name",document.getElementById("first_name").value);
    form_data.append("last_name",document.getElementById("last_name").value);
    form_data.append("age",document.getElementById("age").value);
    form_data.append("prefer_category",document.getElementById("prefer_category").value);
    form_data.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    AJAXPost("../upload_profile/upload_profile.php",form_data,function(data){
        searchName(data.user);
        display_profilepic();
    });  
}

function display_profilepic(){
    var profileImage = settingsField.children[0].children[0].children[0];
    var formData = new FormData();
    AJAXPost(
        'firstname.php',
        formData,
        function(data){
            if (data.pic != ''){
                console.log(data.pic)
                var result = "../upload_profile/" + data.pic;
                profileImage.src = result;
            }
            else{
                profileImage.src = "https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg";
            }
        }
    );
}

function upload_recipe(){
    var form_data = new FormData();
    form_data.append("dish",document.getElementById("dish").value);
    form_data.append("category",document.getElementById("category").value);
    form_data.append("in1",document.getElementById("in1").value);
    form_data.append("intype1",document.getElementById("intype1").value);
    form_data.append("in2",document.getElementById("in2").value);
    form_data.append("intype2",document.getElementById("intype2").value);
    form_data.append("in3",document.getElementById("in3").value);
    form_data.append("intype3",document.getElementById("intype3").value);
    form_data.append("in4",document.getElementById("in4").value);
    form_data.append("intype4",document.getElementById("intype4").value);
    form_data.append("in5",document.getElementById("in5").value);
    form_data.append("intype5",document.getElementById("intype5").value);
    form_data.append("steps",document.getElementById("steps").value);
    form_data.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    AJAXPost("../upload_recipe/upload_recipe.php",form_data,function(data){});
}
//Naive router implementation
function route(){
    var route = location.hash;
    if(!route)
        route = '#recipes';
    switch(route){
        case '#recipes': recipesButton.onclick(); break;
        case '#search': searchButton.onclick(); break;
        case '#upload': uploadButton.onclick(); break;
        case '#settings': settingsButton.onclick(); break;
    }
}
window.onhashchange = route;

//Create transistion effect for display update
function refreshDisplayAnimation(refreshHandler){
    displayContainer.style.opacity = '0';
    setTimeout(
        function(){
            refreshHandler();
            displayContainer.style.opacity = '1';
        },
        200
    );
}

function utilArrayToggleValue(arr, val){
    if(!arr.includes(val)){
        arr.push(val);
        return;
    }
    arr.splice(arr.indexOf(val), 1);
}

//This function is used for handling select event of a selection set with common name
//When the selectedHandler will be applied to the clicked element
//The outsiderHandler will be applied to the rest of the elements
//This function is created to handler nav-bar selections
//Can be used to implement a custom radio button or checkbox field
function utilInjectHandlerToNameSelectionSet(name, selectedHandler, outsiderHandler){
    var nameSet = document.getElementsByName(name);
    var setElement; for(setElement of nameSet){
        setElement.siblings = [];
        var elem; for(elem of nameSet)
            if(!elem.isEqualNode(setElement))
                setElement.siblings.push(elem);
        setElement.onclick = function(){
            selectedHandler(this);
            var outsider; for(outsider of this.siblings)
                outsiderHandler(outsider);
        }
    }
}

//Universal function for creating a displayContainer
//fitting field cards for a htmlElement
function utilCreateField(htmlElement){
    htmlElement.className = 'mg d15 w14 screen h13 elevate-3 center border-3';
    htmlElement.style.overflowY = 'scroll';
    htmlElement.style.backgroundColor = '#FFF';

    htmlElement.scrollPosition = 0;

    return htmlElement;
}

function utilAddTagToElement(element, tagName, color){
    var tag = document.createElement('DIV');
    tag.classList.add('tag');
    tag.innerHTML = tagName;
    tag.style.color = color;
    tag.style.border = '2px solid ' + color;
    element.appendChild(tag);
}

function initialiseNavBar(){
    recipesButton.style.cursor = 'pointer';
    searchButton.style.cursor = 'pointer';
    uploadButton.style.cursor = 'pointer';
    settingsButton.style.cursor = 'pointer';

    recipesButton.classList.add('animative');
    searchButton.classList.add('animative');
    uploadButton.classList.add('animative');
    settingsButton.classList.add('animative');

    recipesButton.associatedElement = recipeList;
    searchButton.associatedElement = searchField;
    uploadButton.associatedElement = recipeUploadField;
    settingsButton.associatedElement = settingsField;

    utilInjectHandlerToNameSelectionSet(
        'nav',
        function(elem){
            var hash = elem.getAttribute('href');
            if(hash != 'recipes' && app.userID == '')
                return displayWarning('This function is not accessible, Please login first...');
            elem.style.backgroundColor = '#00DAA7';
            elem.style.color = '#FFFFFF';
            location.href = location.href.split('#')[0] + '#' + elem.getAttribute('href');
            updateDisplayPage(elem.associatedElement);
            if(elem === settingsButton)
                display_profilepic();
        },
        function(elem){
            if(location.hash == '#' + elem.getAttribute('href'))
                return;
            elem.style.backgroundColor = '#FFFFFF';
            elem.style.color = '#4D4D4D';
        }
    );
}

//Initialise the searchField element
function createSearchField(){
    var field = utilCreateField(searchField);
    field.currentTags = [];
    var searchAlgorithmButton = Template.retrieve('search');
    searchAlgorithmButton.classList.add('click-effect');
    searchAlgorithmButton.children[0].children[0].innerHTML = 'search';
    searchAlgorithmButton.children[1].innerHTML = 'Search with Selected Ingredients';
    searchAlgorithmButton.style.color = '#FFF';
    searchAlgorithmButton.style.backgroundColor = '#00B58B';
    searchAlgorithmButton.onclick = function(){searchRecipe()};
    var innerBox = Template.retrieve('innerBox');
    innerBox.appendChild(searchAlgorithmButton);
    field.appendChild(innerBox);

    AJAXPost(
        'fetchTags.php',
        null,
        function(data){
            var col = {};
            col['Others'] = createCollapsible(searchField.children[0], 'Others');
            var tagName, subTag;
            var i, item, len = data.length; for(i = 0; i < len; i++){
                item = data[i];
                tagName = item.tagName,
                subTag = item.subTag.length == 0 ? 
                    'Others' : item.subTag;
                if(subTag != 'Others' && col[subTag] === undefined)
                    col[subTag] = createCollapsible(searchField.children[0], subTag);
                createCheckListItem(col[subTag], tagName);
            }
        }
    );

}

//Initialise the recipeList
function createRecipeList(){
    recipeList.classList.add('mg');
    recipeList.style.overflowX = 'visible';
    recipeList.style.overflowY = 'scroll';
    recipeList.scrollPosition = 0;

    var recommendButton = Template.retrieve('popular');
    recommendButton.classList.add('click-effect');
    recommendButton.classList.add('elevate-4');
    recommendButton.classList.add('w13');
    recommendButton.classList.add('x1');

    recommendButton.onclick = searchRecipe.bind(null, []);

    recipeList.appendChild(recommendButton);

    listInit(recipeList, 10);
}

function createRecipeUploadField(){
    var field = utilCreateField(recipeUploadField);
    var uploadTemplate = Template.retrieve('upload');
    field.appendChild(uploadTemplate);
}

function createSettingsField(){
    var field = utilCreateField(settingsField);
    var settingsTemplate = Template.retrieve('setting');
    field.appendChild(settingsTemplate);
}

function getUserJoinTags(userID){
    var userJoinTags = getCookie('userJoinTags');
    var $userJoinTags = userJoinTags.length ? JSON.parse(userJoinTags) : {};
    if($userJoinTags[userID] === undefined)
        $userJoinTags[userID] = {};
    return $userJoinTags;
}

function deepClone($object){
    var $clone = {};
    function clone($0, $1){
        var props = Object.keys($0);
        var propsSize = props.length;
        var i; for(i = 0; i < propsSize; i++){
            var prop = props[i];
            var val0 = $0[prop];
            if(val0 === null || typeof val0 !== 'object'){
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

function pushToUserJoinTags(userID, $userJoinTags, tag){
    tag = '1' + tag;
    if(userID == '')
        return;
    var $user = $userJoinTags[userID] === undefined ?
        {} : deepClone($userJoinTags[userID]);
    var $tag;
    if($user[tag] === undefined)
        $tag = {count : 0};
    else{
        $tag = deepClone($user[tag]);
        delete $user[tag];
    }
    $tag.count++;
    var $sorted = {};
    var tags = Object.keys($user);
    var i, len = tags.length;
    for(i = 0; i < len; i++){
        var inner = tags[i];
        var $inner = $user[inner];
        if($tag.count >= $inner.count){
            $sorted[tag] = $tag;
            $sorted[inner] = $inner;
        }else{
            $sorted[inner] = $inner;
            delete $sorted[tag];
            $sorted[tag] = $tag;
        }
    }
    if(!len)
        $sorted[tag] = $tag;
    $userJoinTags[userID] = $sorted;
}

function searchRecipe(input){
    var tags = input ? input : app.extract('searchCheckList');
    var userID = app.userID;
    var $userJoinTags = getUserJoinTags(app.userID);
    for(var tag of tags)
        pushToUserJoinTags(userID, $userJoinTags, tag);
    setCookie('userJoinTags', JSON.stringify($userJoinTags));
    var formData = new FormData();
    formData.append('userID', userID.length ? userID : '');
    formData.append('tags', tags);
    AJAXPost(
        'search.php',
        formData,
        function(data){
            app.recipes = data.list;
            if(location.hash != '#recipe')
                recipesButton.onclick();
        }
    );
}

function searchUserSuggested(){
    var $tags = getUserJoinTags(app.userID)[app.userID];
    var tags = [];
    for(var tag of Object.keys($tags))
        tags.push(tag.slice(1));
    searchRecipe(tags);
}

function createCollapsible(parent, title){
    var collapsible = Template.retrieve('collapsible');
    var toggle = collapsible.children[0];
    var body = collapsible.children[1];
    
    toggle.children[1].innerHTML = title;
    toggle.toggle = false;
    toggle.associateElement = body;
    toggle.onclick = function(){
        if(!this.toggle){
            this.toggle = true;
            this.children[0].children[0].innerHTML = 'keyboard_arrow_down';
            this.associateElement.style.maxHeight = '500vh';
        }else{
            this.toggle = false;
            this.children[0].children[0].innerHTML = 'keyboard_arrow_right';
            this.associateElement.style.maxHeight = '0px';
        }
    }

    parent.appendChild(collapsible);
    return body;
}

function createCheckListItem(parent, itemName){
    var checkListItem = Template.retrieve('checkListItem');
    checkListItem.itemName = itemName;
    checkListItem.checked = false;
    checkListItem.children[1].innerHTML = itemName;
    checkListItem.onclick = function(){
        utilArrayToggleValue(app.searchCheckList, this.itemName);
    }
    parent.appendChild(checkListItem);
}

function displayWarning(msg){
    document.getElementById('warning-msg').innerHTML = msg;
    warning.style.zIndex = 11;
    warning.style.opacity = 1;
    warning.style.transition = 'opacity 0.5s ease-in-out';
    main.classList.add('blur');
}

function hideWarning(){
    warning.style.opacity = 0;
    setTimeout(
        () => warning.style.zIndex = -1,
        500
    );
    main.classList.remove('blur');
}

function displaySub(dishID){
    sub.style.opacity = 1;
    sub.style.zIndex = 10;
    sub.style.left = '100%';
    navBar.classList.add('blur');
    displayContainer.classList.add('blur');
    setTimeout(
        function(){
            sub.style.transition = '0.2s';
            sub.style.left = '0';
        },
        10
    );
    setTimeout(
        () => sub.style.transition = '',
        210
    );
    var formData = new FormData();
    formData.append('dishID', dishID);
    AJAXPost(
        'lookup.php',
        formData,
        function(data){
            document.getElementById('steps-img').src = data.imgURL;
            document.getElementById('steps-text').innerHTML = '<h1>' + data.dishName + '</h1>' + data.steps;
        }
    );
}

function searchName(userID){
    var formData = new FormData();
    formData.append('userID', userID);
    AJAXPost(
        'firstname.php',
        formData,
        function(data){
            if (data.first_name != ''){
            document.getElementById('user-id').innerHTML = "Hi " + data.first_name;
            }
            else{
                document.getElementById('user-id').innerHTML = userID;
            }
        }
    );
}

function validate(){
        fspan.innerHTML = "";
        lspan.innerHTML = "";
        agespan.innerHTML = "";

        var first = document.getElementById("first_name").value;
        var last = document.getElementById("last_name").value;
        var age = document.getElementById("age").value;
        var regexpname = /^[a-zA-Z]{3,25}$/;
        if(first == "")
        {
          fspan.innerHTML += "Please input first name";
        }
        else if(!first.match(regexpname))
        {
          fspan.innerHTML += "The input must be characters and the length is between 3 to 25";
        }
        if(last == "")
        {
          lspan.innerHTML += "Please input last name";
        }
        else if(!last.match(regexpname))
        {
          lspan.innerHTML += "The input must be characters and the length is between 3 to 25";
        }
        if(age == "")
        {
          agespan.innerHTML += "Please input your age";
        }
        else if (age >= 0 && age <= 120 )
        {
          //do nothing
        }
        else
        {
          agespan.innerHTML += "The input age must be between 0 to 120.";
        }
}

function exitSub(){
    sub.style.transition = '0.2s';
    sub.style.left = '100%';
    navBar.classList.remove('blur');
    displayContainer.classList.remove('blur');
    setTimeout(
        function(){
            sub.style.zIndex = -1;
            sub.style.transition = ''
            sub.style.left = '0';
        },
        200
    );
}

function updateDisplayPage(newPageElement){
    refreshDisplayAnimation(function(){
        var currentNode = displayContainer.childNodes[0];
        currentNode.scrollPosition = currentNode.scrollTop;
        displayContainer.innerHTML = "";
        displayContainer.appendChild(newPageElement);
        newPageElement.scrollTop = newPageElement.scrollPosition;
    });
}

function logout(){
    if(app.userID == '')
        return displayWarning('You have not signed in...');
    setCookie('Username', '', 10000);
    setCookie('bypass', '', 10000);
    location.href = location.origin + location.pathname;
}

var app = new Watcher();

//Scripting Starts Here
initialiseNavBar();
createSearchField();
createRecipeList();
createRecipeUploadField();
createSettingsField();
route();
Colorant.paint();

//Using watcher to create searchField
//By setting app.searchCheckList to [] will clear all entries
//Using Watcher to buffer recipe cards rendering
//Any change to app.recipes will be rendered immediately
app
.watch(
    'userID', 
    '', 
    function(prop, userID){
        var userIDField = document.getElementById('user-id');
        if (userID != ''){
            userIDField.onclick = undefined;
            searchName(userID);}
        else if (userID == ''){
            userIDField.innerHTML = 'Login Now!' ;
        }
    }
)

.watch(
    'searchCheckList', 
    [], 
    function(prop, list){
        localStorage.setItem('searchCheckList', list);
        var checkListItems = document.getElementsByName('tag');
        var checkListItem; for(checkListItem of checkListItems)
            if(list.includes(checkListItem.itemName)){
                checkListItem.children[0].children[0].innerHTML = 'clear';
                checkListItem.style.backgroundColor = '#00EDB6';
                checkListItem.style.color = '#FFF';
            }else{
                checkListItem.children[0].children[0].innerHTML = 'add';
                checkListItem.style.backgroundColor = '#EEE';
                checkListItem.style.color = '#4D4D4D';
            }
    }, 
    null
)
.inspect('searchCheckList')
.watch(
    'recipes',
    [],
    function(prop, list){
        localStorage.setItem('recipes', list);
        renderList(list, 10);
    }
);

app.userID = getCookie('Username');
var bypass = getCookie('bypass');

if(bypass == 'false')
    setCookie('Username', '');

searchUserSuggested();
