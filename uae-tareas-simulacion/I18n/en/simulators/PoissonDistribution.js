import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "Poisson",
  title: "Poisson Distribution",
  url: "/simulador-distribucion-poisson",
}
export function Description() {
  const { replace } = useRouter()

  return (
    <>
      <p>
        The Poisson distribution is a discrete probability distribution that allows us to understand how many times an event can occur in a time period or a defined space, when events occur independently at a constant average rate. It is especially useful for modeling phenomena where the occurrence of events is rare but a considerable number of events can be expected in a large number of intervals.
      </p>
      <p>
        Formula:
      </p>
      <p>
        <Latex>{String.raw`$\mathbb{P}(X = k)= \frac {\lambda^k e^\lambda} {k!}$`}</Latex>
      </p>
      <p>
        Variables:
      </p>
      <ul>
        <li><Latex>$e = 2.71828...$</Latex>, Euler's constant</li>
        <li><Latex>$\lambda$</Latex>: Expected average value</li>
        <li><Latex>$k$</Latex>: Number of favorable successes</li>
        <li><Latex>$k!$</Latex>: Factorial of <Latex>$k$</Latex></li>
      </ul>
      <p>
        Instructions:
      </p>
      <ul>
        <li><Latex>$\lambda$</Latex> must be a positive integer.</li>
      </ul>
      <p>Example:</p>
      <ul>
        <li>
          <Link replace href="?n=100&l=7">
            <Latex>$\lambda = 7$</Latex>
          </Link>
        </li>
        <li>
          <Link replace href="?n=100&l=10">
            <Latex>$\lambda = 10$</Latex>
          </Link>
        </li>
        <li>
          <Link replace href="?n=100&l=33">
            <Latex>$\lambda = 33$</Latex>
          </Link>
        </li>
        <li>
          <Link href="#" onClick={(e) => {
            e.preventDefault()
            replace(objectToQueryString({
              l: Math.round(Math.random() * 255),
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
