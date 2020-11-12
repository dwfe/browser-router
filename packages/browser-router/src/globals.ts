export const excludeFirstSymbol = (symbol: string, target: string | undefined): string | undefined =>
  target
    ? target[0] === symbol ? target.slice(1) : target
    : target
;
