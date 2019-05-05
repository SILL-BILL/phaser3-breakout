/// <reference path="phaser-3.16.2/phaser.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.CANVAS_WIDTH = 960;
    Config.CANVAS_HEIGHT = 1280;
    Config.TIME_OUT = 300 * 1000;
    Config.BLOCK_MAX = 60;
    return Config;
}());
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super.call(this, { key: 'MainScene' }) || this;
    }
    MainScene.prototype.preload = function () {
        this.load.image('bg', 'src/img/bg.png');
        this.load.image('bg-head', 'src/img/bg-head.png');
    };
    MainScene.prototype.create = function () {
        this.m_Bg = this.add.image(Config.CANVAS_WIDTH / 2, Config.CANVAS_HEIGHT / 2, 'bg');
        this.m_Header = this.physics.add.staticGroup().create(Config.CANVAS_WIDTH / 2, 60, 'bg-head');
    };
    MainScene.prototype.update = function (_time, _delta) {
    };
    return MainScene;
}(Phaser.Scene));
var Main = /** @class */ (function () {
    function Main(_canvasParent) {
        this.m_PhaserGameConfig = {
            type: Phaser.AUTO,
            scale: {
                parent: _canvasParent,
                mode: Phaser.Scale.FIT,
                width: Config.CANVAS_WIDTH,
                height: Config.CANVAS_HEIGHT
            },
            physics: {
                "default": 'arcade',
                arcade: {
                    gravity: { y: 100 },
                    debug: true
                }
            },
            scene: [MainScene]
        };
        this.m_PhaserGame = new Phaser.Game(this.m_PhaserGameConfig);
    }
    return Main;
}());
var main;
window.onload = function () {
    main = new Main(document.getElementById('CanvasParent'));
};
