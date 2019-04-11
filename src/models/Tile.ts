import RhombusCord from './RhombusCord';
import grassTile from '../images/grass-tile.png';
import sandTile from '../images/sand-tile.png';

const tilemap = new Map<string, string>([
  ['grass', grassTile],
  ['sand', sandTile]
]);

export default class Tile {
  cord: RhombusCord;
  type: string;

  constructor(cord: RhombusCord, type: string) {
    this.cord = cord;
    this.type = type;
  }

  get tileImage() {
    return tilemap.get(this.type);
  }
}