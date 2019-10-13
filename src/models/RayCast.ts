import Fraction from 'fraction.js/fraction';

/*
* This code is from https://theshoemaker.de/2016/02/ray-casting-in-2d-grids/ with slight modifications:
* castRay method returns an array or arrays
* array starts from 0 instead of 1
* possibility to go into negative on X and Y axis
* Fraction is used to get consistent floating point calculations. Mainly problem when cutting exactly between two cells.
* Ray is cast from start to end, not to infinity
* if two hits are possible (dtY == dtX) both are returned
* Going infinitely(dir == 0) on one axis fixed
* */

const size = 100;

const getHelpers = (pos: number, dir: number): [number, number, Fraction, Fraction] => {
  const tile = Math.floor(pos / size);

  let dTile: number, dt: Fraction;

  if (dir > 0) {
    dTile = 1;
    dt = new Fraction(tile + 1).mul(size).sub(pos).div(dir);
  } else if (dir === 0) {
    dTile = 0;
    dt = new Fraction(Number.MAX_SAFE_INTEGER);
    return [tile, dTile, dt, new Fraction(Number.MAX_SAFE_INTEGER)];
  } else {
    dTile = -1;
    dt = new Fraction(tile).mul(size).sub(pos).div(dir);
  }

  return [tile, dTile, dt, new Fraction(dTile * size).div(dir)];
};

export const castRay = (start: { x: number, y: number }, end: { x: number, y: number }) => {

  const grid: string[][] = [];
  const ray = { x: end.x - start.x, y: end.y - start.y };

  // eslint-disable-next-line prefer-const
  let [tileX, dtileX, dtX, ddtX] = getHelpers(start.x, ray.x);
  // eslint-disable-next-line prefer-const
  let [tileY, dtileY, dtY, ddtY] = getHelpers(start.y, ray.y);

  if ((ray.x * ray.x) + (ray.y * ray.y) > 0) {

    const checkwhile = (tileX: number, tileY: number) => {
      let xend;
      let yend;
      if (dtileX > 0)
        xend = tileX <= Math.floor(end.x / size);
      else
        xend = tileX >= Math.floor(end.x / size);

      if (dtileY >= 0)
        yend = tileY <= Math.floor(end.y / size);
      else
        yend = tileY >= Math.floor(end.y / size);

      return xend && yend;
    };

    grid.push([`${tileX}x${tileY}`]);

    do {
      const newItem = [];

      if (dtY.compare(dtX) > 0) {
        tileX = tileX + dtileX;
        const dt = dtX;
        dtX = dtX.add(ddtX).sub(dt);
        dtY = dtY.sub(dt);
      } else {
        if (dtY.equals(dtX) && checkwhile(tileX + dtileX, tileY)) {
          newItem.push(`${tileX + dtileX}x${tileY}`);
        }

        tileY = tileY + dtileY;
        const dt = dtY;
        dtX = dtX.sub(dt);
        dtY = dtY.add(ddtY).sub(dt)
      }
      newItem.push(`${tileX}x${tileY}`);
      grid.push(newItem);
    }
    while (checkwhile(tileX, tileY));
    grid.pop();
  } else {
    grid.push([`${tileX}x${tileY}`]);
  }

  return grid;
};