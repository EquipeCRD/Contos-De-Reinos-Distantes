/*-------------------------------------------------------------*/
/*           Contos de Reinos Distantes                        */
/*-------------------------------------------------------------*/

class sceneMenuPrincipal extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'sceneMenuPrincipal' });
    }

    init(){

    }

    preload ()
    {
        this.load.image("bg", "../../resources/style/images/jogo/bgmenu.png");
    }

    create ()
    {
        this.bg = this.add.image(420, 300, 'bg');

        this.input.manager.enabled = true;

        const ButtonB = this.add.text(70, 270, 'Jogar', {fontSize:'50px', fill: '#000000', fontFamily: 'pixel font'});
        ButtonB.setInteractive();

        
        ButtonB.on('pointerdown', function(){
            this.scene.start('sceneMain')
        },this);

        const ButtonC = this.add.text(700, 270, 'Ranking', {fontSize:'50px', fill: '#000000', fontFamily: 'pixel font' });
        ButtonC.setInteractive();

        ButtonC.on('pointerdown', function(){
            this.scene.start('sceneMain')
        },this);
    }

    update ()
    {
        
    }

}

class SceneMain extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'sceneMain' });
    }

    init(){
    }
    preload ()
    {
        var barraCarregamento = this.add.graphics();

        this.load.image('logo', '../../resources/style/images/jogo/test.jpg');
        /*
		 * for (var i = 0; i < 100; i++) { this.load.image('logo'+i,
		 * '../../resources/style/images/jogo/test.jpg'); }
		 */

        this.load.on('progress', function (value) {
            console.log(value);
            barraCarregamento.clear();
            barraCarregamento.fillStyle(0x37ac26, 1);
            barraCarregamento.fillRect(320, 280, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
                    
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
         
        this.load.on('complete', function () {
            console.log('complete');
            barraCarregamento.destroy();

            textoCarregando.destroy();
            percentText.destroy();
        });

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var textoCarregando = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Carregando...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        textoCarregando.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // -------------------Tiles-------------------------
        this.load.image('tiles', '../../resources/assets/tilesets/praia.png');
        this.load.tilemapTiledJSON('map', '../../resources/assets/json/ilha.json');
        // --------------------------------------------------
        
        this.load.image('spot', '../../resources/assets/sprites/spot.png');
        // Sprite
        this.load.spritesheet('arqueiro', '../../resources/assets/sprites/arqueirotier0.png', { frameWidth: 40, frameHeight: 40, });
   

    }

    create ()
    {
    	this.input.on('pointerup', this.handleClick); 
    	// var logo = this.add.image(400, 300, 'logo');
        // -------------------Tiles-------------------------
        this.map = this.make.tilemap({key: "map"});

        var tiles = this.map.addTilesetImage("praia", "tiles");
        // layer = layer statico("NomeDoLayerNoJSON", this.vardoTileset,xOrigem,
		// yOrigem)
        this.belowLayer = this.map.createStaticLayer( "terreno", tiles,0, 0);
        this.aboveLayer = this.map.createStaticLayer( "detalhes", tiles,0, 0);
        this.worldLayer = this.map.createStaticLayer( "obstaculo", tiles,0, 0);

        // --------------------------------------------------
        var arqueiro = this.add.sprite(20, 20, 'arqueiro', 1);
        arqueiro.setDepth(1);
        game.player = arqueiro;

            this.anims.create({
                key: 'swalk',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 0, end: 2 }),
                frameRate: 16,
                repeat: -1,
                yoyo: true,
            });
            this.anims.create({
                key: 'ewalk',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 3, end: 5 }),
                frameRate: 16,
                repeat: -1,
                yoyo: true,
            });
            this.anims.create({
                key: 'nwalk',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 6, end: 8 }),
                frameRate: 16,
                repeat: -1,
                yoyo: true,
            });
            this.anims.create({
                key: 'wwalk',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 9, end: 11 }),
                frameRate: 16,
                repeat: -1,
                yoyo: true,
            });
            this.anims.create({
                key: 'satac',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 12, end: 14 }),
                frameRate: 16,
                repeat: 0,
            });
            this.anims.create({
                key: 'eatac',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 15, end: 17 }),
                frameRate: 16,
                repeat: 0,
                yoyo: true,
            });
            this.anims.create({
                key: 'natac',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 18, end: 20 }),
                frameRate: 16,
                repeat: 0,
            });
            this.anims.create({
                key: 'watac',
                frames: this.anims.generateFrameNumbers('arqueiro', { start: 21, end: 23 }),
                frameRate: 16,
                repeat: 0,
            });
            
        
            game.marker = this.add.graphics();
            game.marker.lineStyle(2, 0x00cc00, 1);
            game.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

        
        
            game.finder = new EasyStar.js();
            
            var grid = [];
            for(var y = 0; y < this.map.height; y++){
                var col = [];
                for(var x = 0; x < this.map.width; x++){
                    col.push(this.getTileID(x,y));
                }
                grid.push(col);
            }
            game.finder.setGrid(grid);


            var tileset = this.map.tilesets[0];
            var properties = tileset.tileProperties;
            var acceptableTiles = [];

            // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
            // and see what properties have been entered in Tiled.
            for(var i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
                if(!properties.hasOwnProperty(i)) {
                    // If there is no property indicated at all, it means it's a walkable tile
                    acceptableTiles.push(i+1);
                    continue;
                }
                if(!properties[i].collide) acceptableTiles.push(i+1);
                if(properties[i].cost) game.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
            }
            game.finder.setAcceptableTiles(acceptableTiles);
        /*
		 * this.arrayTabuleiro = []; var tileSize = 40; var ROW = 0; var COL =
		 * 1; for(var i = 0; i < 15; i++){ this.arrayTabuleiro[i] = []; for(var
		 * j = 0; j < 15; j++){ // var spot =
		 * this.add.sprite(this.tileDestination(j, COL), //
		 * this.tileDestination(i, ROW), "spot") this.arrayTabuleiro[i][j] = {
		 * img : this.add.image((i*tileSize+20),(j*tileSize+20),'spot'), posx:
		 * i, posy: j } this.arrayTabuleiro[i][j].img.setInteractive();
		 * this.arrayTabuleiro[i][j].img.on('pointerdown', function(){
		 * alert("x=" + this.x + " y=" + this.y); }) } }
		 */
        const norte = this.add.text(700, 50, 'N', {fontSize:'50px', fill: '#fff', fontFamily: 'pixel font'});
        norte.setInteractive();

        norte.on('pointerdown', function(){
        	arqueiro.anims.play('nwalk');
        });
        const este = this.add.text(750, 100, 'E', {fontSize:'50px', fill: '#fff', fontFamily: 'pixel font'});
        este.setInteractive();

        este.on('pointerdown', function(){
        	arqueiro.anims.play('ewalk');
        });
        const sul = this.add.text(700, 150, 'S', {fontSize:'50px', fill: '#fff', fontFamily: 'pixel font'});
        sul.setInteractive();

        sul.on('pointerdown', function(){
        	arqueiro.anims.play('swalk');
        });
        const oeste = this.add.text(650, 100, 'W', {fontSize:'50px', fill: '#fff', fontFamily: 'pixel font'});
        oeste.setInteractive();

        oeste.on('pointerdown', function(){
        	arqueiro.anims.play('wwalk');
        });
/*
 * for(var i=0;i<15;i++){ for(var j=0;j<15;j++){
 * player[i][j].anims.play(i+'a'+j, true); } }
 */

        

    }
    
    update ()
    {
    	
    	var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
    	var pointerTileX = this.map.worldToTileX(worldPoint.x);
    	var pointerTileY = this.map.worldToTileY(worldPoint.y);
    	if (pointerTileX<16&&pointerTileX<16){
        	game.marker.x = this.map.tileToWorldX(pointerTileX);
            game.marker.y = this.map.tileToWorldY(pointerTileY);
            game.marker.setVisible(!this.checkCollision(pointerTileX,pointerTileY));
    	}
    }
    
    getTileID (x,y)
    {
        var tile = this.map.getTileAt(x, y, 'obstaculo');
        return tile.index;
    }
    
    checkCollision (x,y)
    {
        var tile = this.map.getTileAt(x, y, 'obstaculo');
        return tile.properties.collide == true;
    }
    
    handleClick(pointer){
    	var x = pointer.x;
    	var y = pointer.y;
        var toX = Math.floor(x/40);
        var toY = Math.floor(y/40);
        var fromX = Math.floor(game.player.x/40);
        var fromY = Math.floor(game.player.y/40);
        console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

        game.finder.findPath(fromX, fromY, toX, toY, function( path ) {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                console.log(path);
                Game.moveCharacter(path);
            }
        });
        game.finder.calculate(); // don't forget, otherwise nothing happens
    }
    
    moveCharacter(path){
        // Sets up a list of tweens, one for each tile to walk, that will be
		// chained by the timeline
        var tweens = [];
        for(var i = 0; i < path.length-1; i++){
            var ex = path[i+1].x;
            var ey = path[i+1].y;
            tweens.push({
                targets: game.player,
                x: {value: ex*this.map.tileWidth, duration: 200},
                y: {value: ey*this.map.tileHeight, duration: 200}
            });
        }    
    }	


}
var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    parent: 'jogo',
    pixelArt: true,
    scene: [ sceneMenuPrincipal, SceneMain ]
};

var game = new Phaser.Game(config);