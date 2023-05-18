export default class Defeat extends Phaser.Scene {
    constructor(){
        super("defeat")
    }
    create(){
        this.add.image(400, 300,"defeat")
        .setScale(2)
        .setInteractive()
        .on('pointerdown', () => this.scene.start('Game')); ;
        
    }
}