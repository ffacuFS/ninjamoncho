import { SHAPES, POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START } from '../../utils.js';
const { TRIANGLE, SQUARE, DIAMOND,ESTRELLA } = SHAPES;

export default class Game extends Phaser.Scene {
  score;
  defeat;
  timer;
  constructor() {
    super("Game");
  }

  init() {
    this.defeat = false;
    this.shapesRecolected = {
      [TRIANGLE]: { count: 0, score: 10},
      [SQUARE]: { count: 0, score: 20 },
      [DIAMOND]: { count: 0, score: 30 },
      [ESTRELLA]: {count:0, score: -30}
    };
    console.log(this.shapesRecolected)
  }

  create() {
    
    this.add.image(400, 300, "sky").setScale(0.555);

    
   let platforms = this.physics.add.staticGroup();
  platforms.create(400, 568,"ground").setScale(2).refreshBody();
  platforms.create(200,400,"ground").setScale(0.4).refreshBody();
  platforms.create(700,290,"ground").setScale(0.8).refreshBody();

    
    this.shapesGroup = this.physics.add.group();
    
    this.time.addEvent({
      delay: 2500,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    
    this.player = this.physics.add.sprite(100, 450, "ninja");
    this.player.setCollideWorldBounds(true);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.shapesGroup);
    this.physics.add.collider(platforms, this.shapesGroup);

    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape, 
      null, 
      this
    );
    this.physics.add.overlap(
      this.shapesGroup,
      platforms,
      this.reduce,
      null,
      this
    );

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score:" + this.score, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFFFFF",
    });

    this.timer = 50;
    this.timerText = this.add.text(750, 20, this.timer, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFFFFF",
    });
  }

  update() {
    if (this.score>200) {
      this.scene.start("Win");
    }

    if(this.defeat){
      this.scene.start("defeat")
      
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
    } else {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(250);
      } else {
        this.player.setVelocityX(0);
      }
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-300);
    }
  }

  
  addShape() {
    const randomShape = Phaser.Math.RND.pick([DIAMOND, SQUARE, TRIANGLE,ESTRELLA]);

    const randomX = Phaser.Math.RND.between(0, 800);

    this.shapesGroup.create(randomX, 0, randomShape)
      .setCircle(32, 0, 0)
      .setBounce(0.8)
      .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);

    console.log("shape is added", randomX, randomShape);
  }

  
  collectShape(player, shape) {
    shape.disableBody(true, true);

    const shapeName = shape.texture.key;
    const percentage = shape.getData(POINTS_PERCENTAGE);
    const scoreNow = this.shapesRecolected[shapeName].score * percentage;
    this.score += scoreNow;
    this.scoreText.setText(`Score: ${this.score.toString()}`);
    
    this.shapesRecolected[shapeName].count++;
  }

  onSecond(){
    this.timer--;
    this.timerText.setText(this.timer);
    if(this.timer == 0){
      this.defeat = true;
    }
  }

  
  reduce(shape, platform){
    const newPercentage = shape.getData(POINTS_PERCENTAGE) - 0.25;
    console.log(shape.texture.key, newPercentage);
    shape.setData(POINTS_PERCENTAGE, newPercentage);
    if (newPercentage <= 0) {
      shape.disableBody(true, true);
      return;
    }

    const text = this.add.text(shape.body.position.x+10, shape.body.position.y, "- 25%", {
      fontSize: "22px",
      fontStyle: "bold",
      fill: "red",
    });
    setTimeout(() => {
      text.destroy();
    }, 200);
  }
}
