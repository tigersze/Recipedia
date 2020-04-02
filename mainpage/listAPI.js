var vdom, listIndexing = {}, maxLength = 0;

function listInit(listElement, listCount){
    maxLength = listCount;
    vdom = new MinVDOM(listElement);
    var i; for(i = 0; i < listCount; i++){
        var card = vdom.vnode('div', 
            {
                class : 'mg d20 w18 x1 screen h10 h-auto margin elevate-3 border-2', 
                style : 'overflow : hidden; margin-top: 10px;'
            },
            {
                dishID : -1
            }
        );
        var imgField = vdom.vnode('div', 
            {
                class : 'mr d12 screen h7',
                style : 'background-color: #EEE;border-bottom: 1px solid #EEEEEE;'
            },
            {}
        );
        var imgBucket = vdom.vnode('div', 
            {
                class : 'media-bucket mr d20 h19 v-center'
            },
            {}
        );
        var img = vdom.vnode('img', {src : ''}, {});
        var more = vdom.vnode('div', {
            class : 'media-bucket elevate-3 click-effect',
            $style : {
                position: 'absolute',
                height: '48px',
                width: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: '#444',
                color: 'white',
                margin: '10px'
            }
        }, {
            innerHTML : '<i class="material-icons" style="font-size: 36px;">zoom_in</i>',
            dishID : -1,
            onclick : function(){
                displaySub(this.dishID);
            }
        });
        var bottBar = vdom.vnode('div', 
            {
                class : 'mr d12 screen h1',
                style : 'border-bottom: 1px solid #EEEEEE; background-color: white'
            },
            {}
        );
        var textCol = vdom.vnode('div', 
            {
                class : 'mc d12 w8'
            },
            {}
        );
        var textFie = vdom.vnode('div',
            {
                class : 'text-bucket huge d12 x1 v-center'
            },
            {}
        );
        var text = vdom.vtext('TITLE');
        var like = vdom.vnode('div',
            {
                class : 'mc d12 w2',
            },
            {}
        );
        var likeIcon = vdom.vnode('i',
            {
                class : 'material-icons center',
                $style : {
                    fontSize : '36px',
                    color : '#BBB',
                    cursor : 'pointer',
                    transition : '0.5s'
                }
            },
            {
                dishID : -1,
                onclick : function(){
                    var userID = getCookie('userID');
                    //var bypass = getCookie('bypass_isset');
                    var dishID = this.dishID;
                    var cardLocation = this.cardLocation;
                    var formData = new FormData();
                    formData.append('userID', userID);
                    formData.append('dishID', dishID);
                    formData.append('like', 1);
                    AJAXPost(
                        'likes.php',
                        formData,
                        function(data){
                            if(data.valid == 'F')
                                return displayWarning(
                                    '[Like]: Invalid userID,' +
                                    'This will not happen in normal situations,' +
                                    'Please contact our administrator for help.'
                                );
                            if(data.status == 'F')
                                return displayWarning('[Dislike]: Error! Unable to dislike...');
                            app.recipes[cardLocation].like = data.status;
                            renderList(app.extract('recipes'), 10);
                        }
                    );
                }
            }
        );
        var likeIconDes = vdom.vtext('thumb_up_alt');
        var dislike = vdom.vnode('div',
            {
                class : 'mc d12 w2',
            },
            {}
        );
        var dislikeIcon = vdom.vnode('i',
            {
                class : 'material-icons center',
                $style : {
                    fontSize : '36px',
                    color : '#BBB',
                    cursor : 'pointer',
                    transition : '0.5s',
                }
            },
            {
                dishID : -1,
                onclick : function(){
                    var userID = getCookie('userID');
                    var dishID = this.dishID;
                    var cardLocation = this.cardLocation;
                    var formData = new FormData();
                    formData.append('userID', userID);
                    formData.append('dishID', dishID);
                    formData.append('like', -1);
                    AJAXPost(
                        'likes.php',
                        formData,
                        function(data){
                            if(data.valid == 'F')
                                return displayWarning(
                                    '[Dislike]: Invalid userID,' +
                                    'This will not happen in normal situations,' +
                                    'Please contact our administrator for help.'
                                );
                            if(data.status == 'F')
                                return displayWarning('[Dislike]: Error! Unable to dislike...');
                            app.recipes[cardLocation].like = data.status;
                            renderList(app.extract('recipes'), 10);
                        }
                    );
                }
            }
        );
        var dislikeIconDes = vdom.vtext('thumb_down_alt');

        vdom.push(imgField, card);
        vdom.push(more, imgField);
        vdom.push(imgBucket, imgField);
        vdom.push(img, imgBucket);
        
        vdom.push(bottBar, card);
        vdom.push(textCol, bottBar);
        vdom.push(textFie, textCol);
        vdom.push(text, textFie);

        vdom.push(like, bottBar);
        vdom.push(likeIcon, like);
        vdom.push(likeIconDes, likeIcon);

        vdom.push(dislike, bottBar);
        vdom.push(dislikeIcon, dislike);
        vdom.push(dislikeIconDes, dislikeIcon);

        listIndexing[i] = {
            main : card,
            image : img,
            more : more,
            title : text,
            likeIcon : likeIcon,
            dislikeIcon : dislikeIcon
        }
    }
}

function renderList(list, count){
    var len = list.length;
    var i, item, card, like; for(i = 0; i < maxLength; i++){
        card = listIndexing[i];
        if(i >= len || i >= count){
            vdom.pull(card.main);
            continue;
        }
        vdom.push(card.main);
        item = list[i];
        vdom.content(card.title, item.dishName);
        vdom.attribute(card.image, 'src', item.imgUrl);
        vdom.property(card.more, 'dishID', item.dishID);
        like = item.like;
        if(app.userID.length){
            vdom.style(card.likeIcon, 'color', like == 1 ? '#20E371' : '#BBB');
            vdom.style(card.dislikeIcon, 'color', like == -1 ? '#FF4D00' : '#BBB');
            vdom.style(card.likeIcon, 'display', 'block');
            vdom.style(card.dislikeIcon, 'display', 'block');
        }else{
            vdom.style(card.likeIcon, 'display', 'none');
            vdom.style(card.dislikeIcon, 'display', 'none');
        }
        vdom.property(card.likeIcon, 'dishID', item.dishID);
        vdom.property(card.likeIcon, 'cardLocation', i);
        vdom.property(card.dislikeIcon, 'dishID', item.dishID);
        vdom.property(card.dislikeIcon, 'cardLocation', i);
    }
    vdom.render();
}