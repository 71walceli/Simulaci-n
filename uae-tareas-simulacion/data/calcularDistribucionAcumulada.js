
export const calcularDistribucionAcumulada = (distribucion) => {
  let probabilidadAcumulada = 0

  return distribucion.map(px => {
    probabilidadAcumulada += px.p

    return ({
      ...px,
      pA: probabilidadAcumulada,
    })
  })
}