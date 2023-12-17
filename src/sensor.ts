import Car from './car';
import { Intersection as Touch } from './types/sensor';
import { getIntersection, lerp } from './utils';

export default class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  rayAngle: number;
  rays: { x: number; y: number }[][];
  readings: (Touch | null | undefined)[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 20;
    this.rayLength = 250;
    this.rayAngle = Math.PI / 1.618;
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: { x: number; y: number }[][]) {
    this.#castRays();
    this.readings = [];
    this.rays.forEach((val) => {
      const getReading = this.#getReading(val, roadBorders);
      this.readings.push(getReading);
    });
  }
  #getReading(ray: { x: number; y: number }[], roadBorders: { x: number; y: number }[][]) {
    const touches: Touch[] = [];
    roadBorders.forEach((border) => {
      const touch: Touch | null = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) {
        touches.push(touch);
      }
    });

    if (touches.length === 0) {
      return null;
    }
    const offsets = touches.map((touch) => touch.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((touch) => touch.offset === minOffset);
  }

  #castRays() {
    this.rays = [];
    for (let index = 0; index < this.rayCount; index++) {
      const rayAngle =
        lerp(this.rayAngle / 2, -this.rayAngle / 2, this.rayCount === 1 ? 0.5 : index / (this.rayCount - 1)) +
        this.car.angle;
      const startPoint = { x: this.car.x, y: this.car.y };
      const endPoint = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([startPoint, endPoint]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.rays.forEach((ray, index) => {
      let end = ray[1];
      const reading = this.readings[index];
      if (reading) {
        end = reading;
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.beginPath();
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }
}
