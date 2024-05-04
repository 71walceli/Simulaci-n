import { metaList, simulators } from "./simulators"


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
    probabolity: "Probabilidad",
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
}
