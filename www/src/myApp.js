/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    byebye: function() {
        var scene = cc.Director.getInstance().getRunningScene();
        scene.removeChild(scene.layer);
    },
    ctor: function() {
        this._super();
        this.setKeyboardEnabled(true);
    },
    onKeyDown : function(key) {
       cc.log(key);
    },
    init:function() {

        // 1. super init first
        this._super();

        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            // button unpressed image
            s_CloseNormal,
            // button pressed image
            s_CloseSelected,
            // button pressed handler
            this.byebye, this);
        // set anchor point to the center of the item
        closeItem.setAnchorPoint(0.5, 0.5);
        // create a menu with closeItem
        var menu = cc.Menu.create(closeItem);
        // set position of the menu to (0,0)
        menu.setPosition(0, 0);
        // add menu to this layer
        this.addChild(menu, 1);
        // set position of closeItem to bottom right
        // position is calculated based on the anchor set above
        closeItem.setPosition(size.width - 20, 20);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Thomas Sucks", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create(s_HelloWorld);
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setScale(size.height/this.sprite.getContentSize().height);
        this.addChild(this.sprite, 0);
    }
});

// Define MyScene as a subclass of cc.Scene
var MyScene = cc.Scene.extend({
    // on entering the scene, following code will be executed
    onEnter:function () {
        this._super();
        // create and add a layer to the scene
        this.layer = new MyLayer();
        this.addChild(this.layer);
        this.layer.init();
    },
    startGame: function() {
        this.removeChild(this.layer);
        // create and add a layer to the scene
        this.layer = new PongLayer();
        this.addChild(this.layer);
        this.layer.init();
    }
});
