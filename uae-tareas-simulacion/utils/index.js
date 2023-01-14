
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export const factorial = (n) => {
  let acomulado = 1
  while (true) {
    if (n <= 1)
      return acomulado;
    acomulado = acomulado*n;
    if (acomulado > Number.MAX_VALUE)
      return Number.MAX_VALUE
    n--
  }
}
