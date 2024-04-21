import { metaList, simulators } from "./simulators"


export const T = {
  errors: {
    forms: {
      required: "Required",
      numeric: "Nust be numeric",
      number: {
        probabilityExclusive: "Must be a probability (0 < p < 1)",
        probability: "Must be a probability (0 <= p <= 1)",
        positive: "Must be positive (x > 0)",
        integer: "Must be an integer, not decinal",
      },
    }
  },
  fields: {
    probabolity: "Probability",
    numSimulations: "# Simulations",
    average: "Average Value",
  },
  simulators,
  metaList,
  compute: "Compute",
  probabilityFunction: "Probability Function",
  simulationResults: "Simulation Results",
  valuesCount: "Values Count",
}
