import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "Binomial",
  title: "Binomial Distribution",
  url: "/simulador-distribucion-binomial",
}
export function Description() {
  const { replace } = useRouter()

  return (
    <>
      <p>
        The binomial distribution is a discrete probability distribution that describes the number of successes in a sequence of
        <Latex>$n$</Latex>
        independent trials, where each trial has only two possible outcomes: success or failure. Each trial is considered independent, and the probability of success is constant across all trials. This distribution is parameterized by two parameters:
        <Latex>$n$</Latex>,
        which represents the total number of trials, and
        <Latex>$p$</Latex>,
        which is the probability of success in each trial.
      </p>
      <p>
        Formula:
      </p>
      <p>
        <Latex>{String.raw`$\mathbb{P}(X = k)= {n \choose k} \, p^k (1-p)^{n-k}$`}</Latex>
      </p>
      <p>
        Variables:
      </p>
      <ul>
        <li><Latex>$X$</Latex>: Random variable for the number of successes</li>
        <li><Latex>$k$</Latex>: Number of favorable successes</li>
        <li><Latex>$n$</Latex>: Total number of trials</li>
        <li><Latex>$p$</Latex>: Probability of success</li>
        <li>
          <Latex>{String.raw`$ {n \choose k} = \frac{n!}{k! (n -k)!}$`}</Latex>
          <br />
          Binomial coefficient
        </li>
      </ul>
      <p>
        Instructions:
      </p>
      <ul>
        <li><Latex>$n$</Latex> must be a positive integer.</li>
        <li><Latex>$p$</Latex> must be a number in the interval [0, 1], representing a probability.</li>
      </ul>
      <p>Example:</p>
      <ul>
        <li>
          <Link replace href="?n=100&p=0.5&k=10">
            Simulate 10 coins
          </Link>
        </li>
        <li>
          <Link replace href="?n=100&p=0.166666666666667&k=20">
            Simulate the same value for 20 dice
          </Link>
        </li>
        <li>
          <Link href="#" onClick={(e) => {
            e.preventDefault()
            replace(objectToQueryString({
              k: Math.round(Math.random() * 255),
              p: Math.random(),
              n: 100
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

