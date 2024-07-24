export function incrementNumber(bet) {
  switch (true) {
    case (bet <= 10):
      return 1;
    case (bet < 100):
      return 5;
    default:
      return 10;
  }
}
