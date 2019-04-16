export default class RhombusCord {
  x: number;
  y: number;

  public static readonly cellSize = { width: 92, height: 46 };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static pixelToIso(x: number, y: number, decimals: number = 0) {

    let isoX = (x - (y * 2)) / (this.cellSize.width);
    let isoY = (y + Math.floor(x / 2) - (this.cellSize.width / 2)) / this.cellSize.height;

    if(decimals !== 0) {
      isoX = Number(Math.floor(Number(isoX+'e'+decimals))+'e-'+decimals);
      isoY = Number(Math.floor(Number(isoY+'e'+decimals))+'e-'+decimals);
    } else {
      isoX = Math.floor(isoX);
      isoY = Math.floor(isoY);
    }

    return { isoX, isoY }
  }

  public static offsetToPixel(q: number, r: number) {
    let offset = !(r % 2) ? (this.cellSize.width / 2) : 0;
    let x = (this.cellSize.width / 2) + (q * (this.cellSize.width)) + offset;
    let y = (this.cellSize.height / 2) + (r * this.cellSize.height / 2);

    return { x, y };
  }

  public static pixelToOffset(x: number, y: number) {
    let iso = this.pixelToIso(x, y);
    return this.isoToOffset(iso.isoX, iso.isoY);
  }

  public static isoToOffset(x: number, y: number) {
    let col = Math.ceil(x / 2 + y / 2);
    let row = y + -x;
    return { q: col, r: row }
  }

  public static offsetToIso(col: number, row: number) {
    let y = col + Math.floor(row / 2);
    let x = -Math.ceil(row / 2) + col;

    return { x, y };
  }

  static fromOffset(col: number, row: number) {

    let iso = this.offsetToIso(col, row);

    return new this(iso.x, iso.y);
  }

  static fromPixel(x: number, y: number) {
    let iso = RhombusCord.pixelToIso(x, y);
    return new this(iso.isoX, iso.isoY);
  }

  get key() {
    return `${this.x}x${this.y}`;
  }

  get offset() {
    return RhombusCord.isoToOffset(this.x, this.y)
  }

  get pixel() {
    return RhombusCord.offsetToPixel(this.offset.q, this.offset.r);
  }

}