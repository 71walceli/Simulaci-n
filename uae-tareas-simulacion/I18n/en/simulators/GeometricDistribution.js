import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "Geo.",
  title: "Geometric Distribution",
  url: "/simulador-distribucion-geometrica",
}
export function Description() {
  const { replace } = useRouter()

  return (
    <>
      <p>
        The geometric distribution is a discrete probability distribution that allows us to calculate the number of times until a successful case occurs, effectively counting how many trials are needed to find an expected result, given a constant probability.
      </p>
      <p>
        Formula:
      </p>
      <p>
        <Latex>{String.raw`$\mathbb{P}(X = x) = (1-p)^{x-1} p$`}</Latex>
      </p>
      <p>
        Variables:
      </p>
      <ul>
        <li><Latex>$X$</Latex>: Random variable that indicates how many trials before the first success.</li>
        <li><Latex>$k$</Latex>: Number of trials before the first success</li>
        <li><Latex>$p$</Latex>: Probability of success</li>
      </ul>
      <p>
        Instructions:
      </p>
      <ul>
        <li><Latex>{String.raw`$0 < p < 1$`}</Latex></li>
      </ul>
      <p>Example:</p>
      <ul>
        <li>
          <Link replace href="?n=100&p=0.5">
            Simulate coin (<Latex>$p = 0.5$</Latex>)
          </Link>
        </li>
        <li>
          <Link replace href="?n=100&p=0.166666666667">
            Simulate coin (<Latex>$p = \frac 1 6$</Latex>)
          </Link>
        </li>
        <li>
          <Link href="#" onClick={(e) => {
            e.preventDefault()
            replace(objectToQueryString({
              p: Math.random(),
              n: 100,
            }))
          }}>
            <i className="bi bi-shuffle me-1" />
            Generate...
          </Link>
        </li>
      </ul>
    </>
  )
}

