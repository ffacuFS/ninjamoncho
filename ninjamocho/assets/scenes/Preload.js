import { SHAPES } from '../../utils.js';
const { TRIANGLE, SQUARE, DIAMOND,ESTRELLA } = SHAPES;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.image("sky", "./assets/images/sky.png");
    this.load.image("ground", "./assets/images/platform.png");
    this.load.image("ninja", "./assets/images/ninja.png");
    this.load.image(SQUARE, "./assets/images/square.png");
    this.load.image(DIAMOND, "./assets/images/diamond.png");
    this.load.image(TRIANGLE, "./assets/images/triangle.png");
    this.load.image("win", "./assets/images/winner.png")
    this.load.image(ESTRELLA,"./assets/images/estrella.png");
    this.load.image("defeat","./assets/images/defeat.png")
  }

  create() {
    this.scene.start("Game");
  }
}
