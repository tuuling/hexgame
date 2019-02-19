export const changeCords = (x: number, y: number) => ({
  type: 'CHANGE_CORDS',
  payload: {
    mouseCords: {
      x: x,
      y: y
    }
  }
});