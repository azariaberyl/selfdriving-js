import Controller from './controller';

export default class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controller: Controller;
  acceleration: number;
  speed: number;
  maxSpeed: number;
  friction: number;
  angle: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.acceleration = 1;
    this.speed = 0;
    this.maxSpeed = 5;
    this.friction = 0.3;

    this.angle = 0;

    this.controller = new Controller();
  }

  update() {
    if (this.controller.forward) {
      this.speed -= this.acceleration;
    }
    if (this.controller.reverse) {
      this.speed += this.acceleration;
    }
    if (this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed / 2;
    }
    if (this.speed <= -this.maxSpeed) {
      this.speed = -this.maxSpeed;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 1 ? 1 : -1;
      if (this.controller.left) {
        this.angle -= 0.03 * flip;
      }
      if (this.controller.right) {
        this.angle += 0.03 * flip;
      }
    }
    this.x += Math.sin(this.angle) * this.speed;
    this.y += Math.cos(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    if (ctx === null) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.rotate(-this.angle);
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}
