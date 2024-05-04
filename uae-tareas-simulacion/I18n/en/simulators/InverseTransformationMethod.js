import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "I. T. M.",
  title: "Inverse Transformation Method",
  url: "/metodo-tranformacion-inversa",
}
export function Description() {
  const { replace } = useRouter()

  return (
    <>
      <p>
        The inverse transform method is a technique used in statistics and probability theory to generate random variables with a specific distribution from uniformly distributed random variables. The main idea is to transform uniform variables in the interval [0, 1] into variables with the desired distribution using the inverse function of the cumulative distribution function (CDF) of the target variable.
      </p>
      <p>
        Variables:
      </p>
      <ul>
        <li>
          <Latex>$x$</Latex>: Variable assigned to the probability <Latex>$p$</Latex>
        </li>
        <li><Latex>$p$</Latex>: Probability variable</li>
        <li><Latex>$f$</Latex>: Probability density function</li>
      </ul>
      <p>
        Instructions:
      </p>
      <ul>
        <li><Latex>{String.raw`$\sum p = 1$`}</Latex></li>
        <li>Each value of <Latex>$x$</Latex> must be different</li>
      </ul>
      <p>Example:</p>
      <ul>
        <li>
          <Link href="?n=100&p=0.5,0.5&x=1,2" replace>
            Simulate Coin
          </Link>
        </li>
        <li>
          <Link replace
            href="?n=100&p=0.16666666666666666,0.16666666666666666,0.16666666666666667,0.16666666666666666,0.16666666666666666,0.16666666666666667&x=1,2,3,4,5,6"
          >
            Simulate Dice
          </Link>
        </li>
        <li>
          <Link href="#" onClick={(e) => {
            e.preventDefault()
            const sum = data => data.reduce((all, cur) => all + cur)
            const _n = 2 + Math.round(Math.random() * 18);
            let p = Array(_n).fill(null).map(() => Math.random())
            let pSum = sum(p)
            p = p.map(_p => _p / pSum)
            pSum = sum(p)
            if (pSum < 1) {
              const randomIndex = Math.random() * _n;
              p[randomIndex] = 0
              p[randomIndex] = 1 - sum(p)
            }

            const x = Array(_n).fill(null).map((_, i) => i + 1)

            replace(objectToQueryString({ p: p.join(), x: x.join(), n: 100 }))
          }}>
            <i className="bi bi-shuffle me-1" />
            Generate...
          </Link>
        </li>
      </ul>
    </>
  )
}

export const T = {
  allFieldsMustBeCorrect: "All fields must be filled correctly",
  sumOfProbEqual1: "Sum of probabilities (P) must equal 1.",
  NoTwoSameValues: "Can't have 2 of same X values.",
}
