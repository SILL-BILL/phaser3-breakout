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
    /**
        @summary コンストラクタ
    */
    function Config() {
    }
    Config.CANVAS_WIDTH = 960;
    Config.CANVAS_HEIGHT = 1280;
    Config.TIME_OUT = 3 * 1000;
    Config.POINT = 10;
    Config.LIVES = 2;
    return Config;
}());
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    /**
        @summary コンストラクタ
    */
    function MainScene() {
        var _this = _super.call(this, { key: 'MainScene' }) || this;
        _this.m_LivesCnt = Config.LIVES;
        _this.m_Score = 0;
        _this.m_BallCnt = 0;
        _this.m_BlockCnt = 0;
        return _this;
    }
    /**
        @summary プリロード処理
    */
    MainScene.prototype.preload = function () {
        this.load.image('bg', 'src/img/bg.png');
        this.load.image('bg-head', 'src/img/bg-head.png');
        this.load.image('ball', 'src/img/ball.png');
        this.load.image('vaus', 'src/img/vaus.png');
        this.load.atlas('block', 'src/img/block/sprite.png', 'src/img/block/sprite.json');
        this.load.atlas('wall', 'src/img/wall/sprite.png', 'src/img/wall/sprite.json');
    };
    /**
        @summary 生成処理
    */
    MainScene.prototype.create = function () {
        this.physics.world.setBoundsCollision(true, true, true, false);
        this.m_Bg = this.add.image(Config.CANVAS_WIDTH / 2, Config.CANVAS_HEIGHT / 2, 'bg');
        this.m_Header = this.physics.add.staticImage(Config.CANVAS_WIDTH / 2, 60, 'bg-head');
        this.m_ScoreText = this.add.text(0, 30, 'Score : ' + this.m_Score.toString(), { fontFamily: 'Arial', fontSize: 48, color: '#f5f5f5' });
        this.m_LivesText = this.add.text(Config.CANVAS_WIDTH / 2, 30, 'Lives : ' + this.m_LivesCnt.toString(), { fontFamily: 'Arial', fontSize: 48, color: '#f5f5f5' });
        this.m_BallGroup = this.physics.add.group();
        this.m_VausGroup = this.physics.add.group({ immovable: true });
        this.m_BlockGroup = this.physics.add.group({ immovable: true });
        this.m_EraserGroup = this.physics.add.staticGroup();
        this.physics.add.collider(this.m_BallGroup, this.m_Header);
        this.physics.add.collider(this.m_BallGroup, this.m_BlockGroup, this.onBlockHit, null, this);
        this.physics.add.collider(this.m_BallGroup, this.m_VausGroup, this.onVausHit, null, this);
        this.physics.add.collider(this.m_BallGroup, this.m_EraserGroup, this.onEraserHit, null, this);
        this.createBlock(6, 10);
        this.m_Vaus = this.m_VausGroup.create(Config.CANVAS_WIDTH / 2, 1100, 'vaus');
        this.m_Ball = this.m_BallGroup.create(Config.CANVAS_WIDTH / 2, 1000, 'ball').setCollideWorldBounds(true).setBounce(1).setVelocity(-180, -600);
        this.m_BallCnt++;
        this.m_Eraser = this.m_EraserGroup.create(Config.CANVAS_WIDTH / 2, Config.CANVAS_HEIGHT + 25, 'wall', 'horizontal-red');
    };
    /**
        @summary 更新処理
    */
    MainScene.prototype.update = function (_time, _delta) {
        this.m_Vaus.x = this.game.input.activePointer.x;
        if (this.m_Vaus.x < 96) {
            this.m_Vaus.x = 96;
        }
        else if (this.m_Vaus.x > Config.CANVAS_WIDTH - 96) {
            this.m_Vaus.x = Config.CANVAS_WIDTH - 96;
        }
        if (this.m_LivesCnt < 0) {
            console.log('Game Over!');
        }
        if (this.m_BlockCnt <= 0) {
            console.log('Game Clear!');
        }
    };
    /**
        @summary ブロックヒット時
    */
    MainScene.prototype.onBlockHit = function (_ball, _block) {
        _block.destroy();
        this.m_Score += Config.POINT;
        this.m_ScoreText.text = 'Score : ' + this.m_Score;
        this.m_BlockCnt--;
        console.log('BlockCnt : ' + this.m_BlockCnt);
    };
    /**
        @summary バウス(ラケット)ヒット時
    */
    MainScene.prototype.onVausHit = function (_ball, _vaus) {
        var diff = 0;
        if (_ball.x < _vaus.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _vaus.x - _ball.x;
            _ball.setVelocityX(-10 * diff);
        }
        else if (_ball.x > _vaus.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _vaus.x;
            _ball.setVelocityX(10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.setVelocityX(2 + Math.random() * 8);
        }
    };
    /**
        @summary イレーサーヒット時
    */
    MainScene.prototype.onEraserHit = function (_ball, _eraser) {
        _ball.destroy();
        this.m_BallCnt--;
        if (this.m_BallCnt <= 0) {
            this.m_LivesCnt--;
            this.m_LivesText.text = 'Lives : ' + this.m_LivesCnt.toString();
        }
    };
    /**
        @summary ブロック生成
    */
    MainScene.prototype.createBlock = function (_row, _column) {
        var frames = this.textures.get('block').getFrameNames();
        var block_width = 96;
        var block_height = 48;
        var block_offset_x = block_width / 2;
        var block_offset_y = block_height / 2;
        for (var i = 0; i < _row; i++) {
            for (var j = 0; j < _column; j++) {
                this.m_BlockGroup.create(block_width * j + block_offset_x, block_height * i + block_offset_y + 280, 'block', frames[i % 6]);
                this.m_BlockCnt++;
            }
        }
        console.log(this.m_BlockCnt);
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
                    // gravity: { y:100 },
                    debug: false
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
