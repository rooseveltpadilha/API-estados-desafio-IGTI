let lista = ["biz", "fez", "luz", "pus", "vez", "bala", "bola", "bolo", "casa", "cola", "faca",
  "fogo", "braca", "cabra", "flume", "traca", "truca"]
  .sort((a, b) => {
    if (a.length === b.length) {
      return a.localeCompare(b);
    }
    return b.length - a.length;
  });

console.log(lista);