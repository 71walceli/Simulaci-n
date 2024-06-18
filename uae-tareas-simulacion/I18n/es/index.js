import Latex from "react-latex-next"
import { metaList, simulators } from "./simulators"


const accProbability = "Prob. Acumulada"
export const T = {
  errors: {
    forms: {
      required: "Requerido",
      numeric: "Debe ser un número",
      number: {
        probabilityExclusive: "Debe ser una probabilidad (0 < p < 1)",
        probability: "Debe ser una probabilidad (0 <= p <= 1)",
        positive: "Debe ser positivo (x > 0)",
        integer: "Debe ser entero, no decinal",
      },
    }
  },
  fields: {
    probability: "Probabilidad",
    accProbability,
    value: "Valor",
    numSimulations: "# Simulaciones",
    average: "Valor promedio",
    numElements: "# Elementos",
    multiplier: "Multiplicador", 
    modulus: "Módulo",
    seed: "Semilla", 
  },
  simulators,
  metaList,
  compute: "Calcular",
  probabilityFunction: "Función de probabilidad",
  simulationResults: "Resultados de simulación",
  valuesCount: "Conteo de valores",
  validationErrors: "Errores de validación",
  probabilitySims: "Simuladores de Probabilidad",
  META: {
    title: "Ciencia de Datos Simplificado: Herramienta Gratuita e Interactiva de Distribución de Probabilidad",
    description: "¡Domina la Ciencia de datos! Esta herramienta te permite explorar diversas distribuciones de probabilidad (Binomial, Poisson, Geométrica) basadas en Números Aleatorios. Genera datos aleatorios, personaliza parámetros y visualiza resultados para una investigación profunda.",
  },
  results: {
    graphs: "Gráficos",
    tables: {
      probabilityDistribution: {
        columns: [
          {
            title: <i><Latex>$i$</Latex></i>,
            titleTextOnly: "i",
            key: "i",
          },
          {
            title: "Probabilidad",
            key: "probabilidad",
          },
          {
            title: accProbability,
            key: "probabilidadAcumulada",
          },
        ]
      },
      counts: {
        columns: [
          {
            title: <Latex>$i$</Latex>,
            key: "i",
          },
          {
            title: "Conteo",
            key: "conteo",
          },
        ]
      }
    },
  },
}
