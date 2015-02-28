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
var cocos2dApp = cc.Application.extend({
    // `this.config` holds the configuration defined in www/cocos2d.js
    config:document['ccConfig'],
    // Constructor of the game application
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        // init debug setting in Cocos2d
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        // setup game stage with canvas element specified by ccConfig.tag
        cc.setup(this.config['tag']);
        // Finish launching
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();
        var designSize = cc.size(800, 480);

        // set file search path to "asset"
        var searchPaths = [];
        searchPaths.push("asset");
        cc.FileUtils.getInstance().setSearchPaths(searchPaths);

        /**
         * Sets the resolution policy with designed view size in points.
         * The resolution policy include: 
         * [1] EXACT_FIT       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.
         * [2] NO_BORDER       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.
         * [3] SHOW_ALL        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.
         * [4] FIXED_HEIGHT    Scale the content's height to screen's height and proportionally scale its width
         * [5] FIXED_WIDTH     Scale the content's width to screen's width and proportionally scale its height
         * See [official documentation](https://github.com/chukong/cocos-docs/blob/master/manual/framework/html5/v2/resolution-policy-design/en.md) for details.
         */
        cc.EGLView.getInstance().setDesignResolutionSize(designSize.width, designSize.height, cc.RESOLUTION_POLICY.SHOW_ALL);
        // This is only useful if the game is run in browser
        cc.EGLView.getInstance().resizeWithBrowserSize(true);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        // load resources defined in g_resources
        // see definition of g_resources in www/src/resource.js
        cc.LoaderScene.preload(g_resources, function () {
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    }
});

// Create an instance of Cocos2d game app.
// See www/src/myApp.js for definition of MyScene.
var myApp = new cocos2dApp(MyScene);
