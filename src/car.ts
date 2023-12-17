import Controller from './controller';
import Sensor from './sensor';
import { polyIntersect } from './utils';

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
  sensor: Sensor;
  polygon: { x: number; y: number }[] = [];
  damaged: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.acceleration = 1;
    this.speed = 0;
    this.maxSpeed = 5;
    this.friction = 0.3;
    this.damaged = false;

    this.angle = 0;

    this.controller = new Controller();
    this.sensor = new Sensor(this);
  }

  update(roadBorders: { x: number; y: number }[][]) {
    debugger;
    if (!this.damaged) {
      this.#move();
      this.damaged = this.#assesDamage(roadBorders);
      this.polygon = this.#createPolygon(roadBorders);
    }
    this.sensor.update(roadBorders);
  }
  #assesDamage(roadBorders: { x: number; y: number }[][]): boolean {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  #createPolygon(roadBorders: { x: number; y: number }[][]) {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - rad * Math.sin(this.angle + alpha),
      y: this.y - rad * Math.cos(this.angle + alpha),
    });

    points.push({
      x: this.x - rad * Math.sin(this.angle - alpha),
      y: this.y - rad * Math.cos(this.angle - alpha),
    });
    points.push({
      x: this.x + rad * Math.sin(this.angle + alpha),
      y: this.y + rad * Math.cos(this.angle + alpha),
    });
    points.push({
      x: this.x + rad * Math.sin(this.angle - alpha),
      y: this.y + rad * Math.cos(this.angle - alpha),
    });
    return points;
  }

  #move() {
    if (this.controller.forward) {
      this.speed -= this.acceleration + 5;
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
    ctx.beginPath();
    if (this.damaged) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'green';
    }
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let index = 1; index < this.polygon.length; index++) {
      ctx.lineTo(this.polygon[index].x, this.polygon[index].y);
    }
    ctx.fill();
    this.sensor.draw(ctx);
  }
}
