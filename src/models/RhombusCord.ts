export default class RhombusCord {
  x: number;
  y: number;

  public static readonly cellSize = { width: 92, height: 46 };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static pixelToIso(x: number, y: number, decimals = 0) {

    let isoX = (x - (y * 2)) / (this.cellSize.width);
    let isoY = (y + Math.floor(x / 2) - (this.cellSize.width / 2)) / this.cellSize.height;

    if(decimals !== 0) {
      isoX = Number(Math.floor(Number(isoX+'e'+decimals))+'e-'+decimals);
      isoY = Number(Math.floor(Number(isoY+'e'+decimals))+'e-'+decimals);
    } else {
      isoX = Math.floor(isoX);
      // noinspection JSSuspiciousNameCombination
      isoY = Math.floor(isoY);
    }

    return { isoX, isoY }
  }

  public static offsetToPixel(q: number, r: number) {
    const offset = !(r % 2) ? (this.cellSize.width / 2) : 0;
    const x = (this.cellSize.width / 2) + (q * (this.cellSize.width)) + offset;
    const y = (this.cellSize.height / 2) + (r * this.cellSize.height / 2);

    return { x, y };
  }

  public static pixelToOffset(x: number, y: number) {
    const iso = this.pixelToIso(x, y);
    return this.isoToOffset(iso.isoX, iso.isoY);
  }

  public static isoToOffset(x: number, y: number) {
    const col = Math.ceil(x / 2 + y / 2);
    const row = y + -x;
    return { q: col, r: row }
  }

  public static offsetToIso(col: number, row: number) {
    const y = col + Math.floor(row / 2);
    const x = -Math.ceil(row / 2) + col;

    return { x, y };
  }

  static fromKey(key: string) {
    const parseKey = key.match(/(-?\d+)[x](-?\d+)/);

    if (parseKey) {
      const [, x, y] = parseKey.map(function (item) {
        return parseInt(item)
      });
      return new this(x, y)
    } else {
      throw new Error('Invalid key');
    }

  }

  static fromOffsetKey(key: string) {
    const parseKey = key.match(/(-?\d+)[q](-?\d+)/);

    if (parseKey) {
      const [, q, r] = parseKey.map(function (item) {
        return parseInt(item)
      });
      return RhombusCord.fromOffset(q, r)
    } else {
      throw new Error('Invalid key');
    }

  }

  static fromOffset(col: number, row: number) {

    const iso = this.offsetToIso(col, row);

    return new this(iso.x, iso.y);
  }

  static fromPixel(x: number, y: number) {
    const iso = RhombusCord.pixelToIso(x, y);
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

  public toIso(decimals = 0) {
    return RhombusCord.pixelToIso(this.pixel.x, this.pixel.y, decimals);
  }

}