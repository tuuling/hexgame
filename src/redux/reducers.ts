function setCord(state = { mouseCords: { x: 1, y: 1 }}, action: any) {
  switch (action.type) {
  case 'CHANGE_CORDS':
    return { ...state, ...action.payload };
  default:
    return state
  }
}

export default setCord;