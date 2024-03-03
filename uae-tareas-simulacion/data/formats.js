import Latex from "react-latex-next"

export const probabilityDistribution = {
  columns: [
    {
      title: <i>i</i>,
      key: "i",
    },
    {
      title: "Probabilidad",
      key: "probabilidad",
    },
    {
      title: "Prob. Acumulada",
      key: "probabilidadAcumulada",
    },
  ]
}

export const randomNumbers = {
  columns: [
    {
      title: <Latex>{String.raw`$U (0, 1)$`}</Latex>,
      key: "u",
    },
    {
      title: <Latex>{String.raw`$X$`}</Latex>,
      key: "x",
    },
  ]
}

export const counts = {
  columns: [
    {
      title: "i",
      key: "i",
    },
    {
      title: "Conteo",
      key: "conteo",
    },
  ]
}
