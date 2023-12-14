import './style.css';
import Car from './car';
import Road from './road';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(100, 100, 30, 50);

animate();

function animate() {
  if (ctx === null) return;
  car.update();

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}
