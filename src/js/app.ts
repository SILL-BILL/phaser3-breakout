/// <reference path="phaser-3.16.2/phaser.d.ts"/>

class Config {
	public static readonly CANVAS_WIDTH:number = 960;
	public static readonly CANVAS_HEIGHT:number = 1280;
	public static readonly TIME_OUT:number = 300 * 1000;
	public static readonly BLOCK_MAX:number = 60;

	constructor(){
	}
}

class MainScene extends Phaser.Scene {

	private m_Bg:Phaser.GameObjects.Image;

	constructor(){
		super({ key: 'MainScene' });
	}
	
	public preload():void{
		this.load.image('bg', 'src/img/bg.png');
	}
	public create():void{
		this.m_Bg = this.add.image(Config.CANVAS_WIDTH/2,Config.CANVAS_HEIGHT/2,'bg');
	}
	public update(_time,_delta):void{
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
					gravity: { y:100 },
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
