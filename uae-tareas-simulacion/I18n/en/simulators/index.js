import * as binomialDistribution from "./BinomialDistribution";
import * as geometricDistribution from "./GeometricDistribution";
import * as inverseTransformationMethod from "./InverseTransformationMethod";
import * as multiplicativeCongruentialAlgorithm from "./MultiplicativeCongruentialAlgorithm";
import * as poissonDistribution from "./PoissonDistribution";


export const simulators = {
  multiplicativeCongruentialAlgorithm,
  inverseTransformationMethod,
  binomialDistribution,
  poissonDistribution,
  geometricDistribution,
};
export const metaList = Object.values(simulators).map(s => s.META)
