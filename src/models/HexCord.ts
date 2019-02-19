export class HexCord {

  x: number;
  y: number;
  z: number;

  constructor(q: number, r: number) {
    this.x = q;
    this.y = r;
    this.z = -r-q;

  }

  static fromOffset(col: number, row: number) {
    let q = col - (row + (row&1)) / 2;

    return new this(q, row);
  }

  get key() {
    return `${this.x}x${this.y}x${this.z}`;
  }

  round() {
    let rx = Math.round(this.x);
    let ry = Math.round(this.y);
    let rz = Math.round(this.z);

    let x_diff = Math.abs(rx - this.x);
    let y_diff = Math.abs(ry - this.y);
    let z_diff = Math.abs(rz - this.z);

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry-rz
    } else if (y_diff > z_diff){
      ry = -rx-rz
    } else {
      rz = -rx-ry
    }

    this.x = rx;
    this.y = ry;
    this.z = rz;

    return this;
  }

}