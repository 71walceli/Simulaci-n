import Latex from "react-latex-next"
import { metaList, simulators } from "./simulators"


const accProbability = "Acc. Probability"
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
    probability: "Probability",
    accProbability,
    value: "Value",
    numSimulations: "# Simulations",
    average: "Average Value",
    numElements: "# Elements",
    multiplier: "Multiplier", 
    modulus: "Modulus",
    seed: "Seed", 
  },
  simulators,
  metaList,
  compute: "Compute",
  probabilityFunction: "Probability Function",
  simulationResults: "Simulation Results",
  valuesCount: "Values Count",
  validationErrors: "Validation errors",
  probabilitySims: "Probability Simulators",
  META: {
    title: "Data Science Made Easy: Free Interactive Probability Distribution Tool",
    description: "Master data analysis! This tool lets you explore various probability distributions (Binomial, Poisson, Geometric) based on Random Numbers. Generate random data, customize parameters, and visualize results for in-depth research.",
  },
  results: {
    graphs: "Graphs",
    tables: {
      probabilityDistribution: {
        columns: [
          {
            title: <i><Latex>$i$</Latex></i>,
            titleTextOnly: "i",
            key: "i",
          },
          {
            title: "Probability",
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
            titleTextOnly: "i",
            key: "i",
          },
          {
            title: "Counts",
            key: "conteo",
          },
        ]
      }
      
    },
  },
}
