/// <reference path="phaser-3.16.2/phaser.d.ts"/>

class Config {
	public static readonly CANVAS_WIDTH:number = 960;
	public static readonly CANVAS_HEIGHT:number = 1280;
	public static readonly TIME_OUT:number = 3 * 1000;
	public static readonly POINT:number = 10;
	public static readonly LIVES:number = 2;

	/**
		@summary コンストラクタ
	*/
	constructor(){
	}
}

class MainScene extends Phaser.Scene {

	private m_Bg:Phaser.GameObjects.Image;

	private m_Header:Phaser.Physics.Arcade.Image;

	private m_LivesText:Phaser.GameObjects.Text;
	private m_LivesCnt:number;

	private m_ScoreText:Phaser.GameObjects.Text;
	private m_Score:number;

	private m_BallGroup:Phaser.GameObjects.Group;
	private m_Ball:Phaser.Physics.Arcade.Image;
	private m_BallCnt:number;

	private m_VausGroup:Phaser.GameObjects.Group;
	private m_Vaus:Phaser.Physics.Arcade.Image;

	private m_BlockGroup:Phaser.GameObjects.Group;
	private m_BlockCnt:number;

	private m_EraserGroup:Phaser.GameObjects.Group;
	private m_Eraser:Phaser.Physics.Arcade.Image;

	private m_GameState = {
		'Init'      : 0,
		'Wait'      : 1,
		'Run'       : 2,
		'GameClear' : 3,
		'GameOver'  : 4,
		'End'       : 5
	}
	private m_CurrentGameState:number;

	private m_TimeElapsed:number;

	/**
		@summary コンストラクタ
	*/
	constructor(){
		super({ key: 'MainScene' });
		this.m_LivesCnt = Config.LIVES;
		this.m_Score = 0;
		this.m_BallCnt = 0;
		this.m_BlockCnt = 0;
		this.m_CurrentGameState = this.m_GameState.Init;
		this.m_TimeElapsed = 0;

console.log(this.m_CurrentGameState);

	}
	/**
		@summary プリロード処理
	*/
	public preload():void{
		this.load.image('bg', 'src/img/bg.png');
		this.load.image('bg-head', 'src/img/bg-head.png');
		this.load.image('ball', 'src/img/ball.png');
		this.load.image('vaus', 'src/img/vaus.png');
		this.load.atlas('block', 'src/img/block/sprite.png', 'src/img/block/sprite.json');
		this.load.atlas('wall', 'src/img/wall/sprite.png', 'src/img/wall/sprite.json');
	}
	/**
		@summary 生成処理
	*/
	public create():void{

		this.physics.world.setBoundsCollision(true, true, true, false); //ワールドのコライダーを設定

		this.m_Bg = this.add.image(Config.CANVAS_WIDTH/2,Config.CANVAS_HEIGHT/2,'bg');
		this.m_Header = this.physics.add.staticImage(Config.CANVAS_WIDTH/2, 60, 'bg-head');
		this.m_ScoreText = this.add.text(
			30,30,
			'Score : '+this.m_Score.toString(),
			{fontFamily:'Arial', fontSize:48, color:'#f5f5f5'}
		);
		this.m_LivesText = this.add.text(
			Config.CANVAS_WIDTH/2,30,
			'Lives : '+this.m_LivesCnt.toString(),
			{fontFamily:'Arial', fontSize:48, color:'#f5f5f5'}
		);

		//各ゲームオブジェクトに当たり判定を設定
		this.m_BallGroup = this.physics.add.group();
		this.m_VausGroup = this.physics.add.group({immovable:true});
		this.m_BlockGroup = this.physics.add.group({immovable:true});
		this.m_EraserGroup = this.physics.add.staticGroup();
		this.physics.add.collider(this.m_BallGroup, this.m_Header);
		this.physics.add.collider(this.m_BallGroup, this.m_BlockGroup, this.onBlockHit, null, this);
		this.physics.add.collider(this.m_BallGroup, this.m_VausGroup, this.onVausHit, null, this);
		this.physics.add.collider(this.m_BallGroup, this.m_EraserGroup, this.onEraserHit, null, this);

		//ブロック生成
		this.createBlock(6, 10);

		//バウス(ラケット)生成
		this.m_Vaus = this.m_VausGroup.create(Config.CANVAS_WIDTH / 2, 1100, 'vaus');

		//ボール生成
		this.createBall();

		//イレーサー生成
		this.m_Eraser = this.m_EraserGroup.create(Config.CANVAS_WIDTH/2, Config.CANVAS_HEIGHT+25, 'wall', 'horizontal-red');

		//クリックイベントの設定
		this.input.on('pointerup', (pointer) => {
			if (this.m_CurrentGameState == this.m_GameState.Wait)
			{
				this.m_CurrentGameState = this.m_GameState.Run;
				this.m_Ball.setVelocity(-180,-600);
			}
		}, this);

		this.m_CurrentGameState = this.m_GameState.Wait;

	}
	/**
		@summary 更新処理
	*/
	public update(_time,_delta):void{

		if(this.m_CurrentGameState == this.m_GameState.Run || this.m_CurrentGameState == this.m_GameState.Wait){
			this.m_Vaus.x = this.game.input.activePointer.x;
			if (this.m_Vaus.x < 96)
			{
				this.m_Vaus.x = 96;
			}
			else if (this.m_Vaus.x > Config.CANVAS_WIDTH - 96)
			{
				this.m_Vaus.x = Config.CANVAS_WIDTH - 96;
			}
		}

		if(this.m_CurrentGameState == this.m_GameState.Wait && this.m_BallCnt > 0)
		{
			this.m_Ball.x = this.m_Vaus.x;
		}

		if((this.m_CurrentGameState == this.m_GameState.Run || this.m_CurrentGameState == this.m_GameState.Wait) && this.m_LivesCnt < 0)
		{
			this.m_CurrentGameState = this.m_GameState.GameOver;
			console.log('Game Over!');
		}
		else if(this.m_CurrentGameState == this.m_GameState.GameOver)
		{
//TODO
		}

		if(this.m_CurrentGameState == this.m_GameState.Run && this.m_BlockCnt <= 0)
		{
			this.m_CurrentGameState = this.m_GameState.GameClear;
			console.log('Game Clear!');
		}
	}
	/**
		@summary ブロックヒット時
	*/
	private onBlockHit(_ball:Phaser.Physics.Arcade.Sprite, _block:Phaser.Physics.Arcade.Sprite):void {
		_block.destroy();
		this.m_Score += Config.POINT;
		this.m_ScoreText.text = 'Score : '+this.m_Score;
		this.m_BlockCnt--;
		console.log('BlockCnt : '+this.m_BlockCnt);
	}
	/**
		@summary バウス(ラケット)ヒット時
	*/
	private onVausHit(_ball:Phaser.Physics.Arcade.Image, _vaus:Phaser.Physics.Arcade.Image):void {

		let diff = 0;

		if (_ball.x < _vaus.x)
		{
			//  Ball is on the left-hand side of the paddle
			diff = _vaus.x - _ball.x;
			_ball.setVelocityX(-10 * diff);
		}
		else if (_ball.x > _vaus.x)
		{
			//  Ball is on the right-hand side of the paddle
			diff = _ball.x -_vaus.x;
			_ball.setVelocityX(10 * diff);
		}
		else
		{
			//  Ball is perfectly in the middle
			//  Add a little random X to stop it bouncing straight up!
			_ball.setVelocityX(2 + Math.random() * 8);
		}
	}
	/**
		@summary イレーサーヒット時
	*/
	private onEraserHit(_ball:Phaser.Physics.Arcade.Image, _eraser:Phaser.Physics.Arcade.Image):void {

		_ball.destroy();
		this.m_BallCnt--;

		if(this.m_CurrentGameState == this.m_GameState.Run && this.m_BallCnt <= 0){
			this.m_CurrentGameState = this.m_GameState.Wait;
			this.createBall();
			this.m_LivesCnt--;
			this.m_LivesText.text = (this.m_LivesCnt >= 0) ? 'Lives : '+ this.m_LivesCnt.toString() : 'Lives : 0';
		}

	}
	/**
		@summary ブロック生成
	*/
	private createBlock(_row:number, _column:number):void {

		let frames:string[] = this.textures.get('block').getFrameNames();

		let block_width:number = 96;
		let block_height:number = 48;
		let block_offset_x:number = block_width / 2;
		let block_offset_y:number = block_height / 2;

		for(let i:number = 0; i < _row; i++)
		{
			for(let j:number = 0; j < _column; j++)
			{
				this.m_BlockGroup.create(
					block_width * j + block_offset_x,
					block_height * i + block_offset_y + 280,
					'block', frames[i%6]
				);
				this.m_BlockCnt++;
			}
		}

		console.log(this.m_BlockCnt);
	}
	/**
		@summary ボール生成
	*/
	private createBall():void{
		if(this.m_CurrentGameState == this.m_GameState.Init || 
			this.m_CurrentGameState == this.m_GameState.Wait)
		{
			this.m_Ball = this.m_BallGroup.create(Config.CANVAS_WIDTH / 2, 1025, 'ball').setCollideWorldBounds(true).setBounce(1);
			this.m_BallCnt++;
		}
	}
	/**
		@summary シーン遷移
	*/
	private translateScene(_sceneName:string):void{
		this.scene.start(_sceneName);
	}
}

class Main {

	public m_PhaserGameConfig:GameConfig;
	public m_PhaserGame:Phaser.Game;

	constructor(_canvasParent:HTMLElement) {

		this.m_PhaserGameConfig = {
			type:Phaser.AUTO,
			scale:{
				parent: _canvasParent,
				mode: Phaser.Scale.FIT,
				width: Config.CANVAS_WIDTH,
				height: Config.CANVAS_HEIGHT
			},
			physics:{
				default:'arcade',
				arcade:{
					// gravity: { y:100 },
					debug: true
				}
			},
			scene: [MainScene]
		}

		this.m_PhaserGame = new Phaser.Game(this.m_PhaserGameConfig);

	}
}

var main:Main;
window.onload = () => {
	main = new Main(<HTMLElement>document.getElementById('CanvasParent'));
}
