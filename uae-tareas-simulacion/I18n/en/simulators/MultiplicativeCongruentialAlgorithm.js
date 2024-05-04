import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "M. C. A.",
  title: "Multiplicative Congruential Algorithm",
  url: "/algorirmo-congruencial-multiplicativo",
}
export function Description() {
  const { replace } = useRouter()

  return (
    <>
      <p>
        The multiplicative congruential algorithm is a method for generating sequences of
        pseudo-random numbers. This type of algorithm is used in computational simulation, games,
        cryptography, and other applications where it is necessary to generate apparently
        random numbers.
      </p>
      <p>
        Formula:
      </p>
      <p>
        <Latex>{String.raw`$$X_{n+1} = ( \alpha \cdot x_n)\,\rm{mod}\,m$$`}</Latex>
      </p>
      <p>
        Variables:
      </p>
      <ul>
        <li><Latex>{String.raw`$x$`}</Latex>: Random variable</li>
        <li><Latex>{String.raw`$n$`}</Latex>: nth generated number</li>
        <li><Latex>{String.raw`$x_0$`}</Latex>: First number</li>
        <li><Latex>{String.raw`$\alpha$`}</Latex>: Multiplier</li>
        <li><Latex>{String.raw`$m$`}</Latex>: Module</li>
      </ul>
      <p>Instructions:</p>
      <p>
        It is important to choose appropriate values 
        for <Latex>{String.raw`$\alpha$`}</Latex> and <Latex>{String.raw`$m$`}</Latex> to 
        ensure that the algorithm generates pseudo-random numbers of good quality. It
        is recommended that <Latex>$m$</Latex> and <Latex>{String.raw`$\alpha$`}</Latex> have
        specific properties, such as not sharing common factors with each other.
      </p>
      <p>Interpretation:</p>
      <p>
        The application of the algorithm allows obtaining as many random values as necessary.
      </p>
      <ul>
        <li>
          <Latex>$x$</Latex> is an integer between 0 and <Latex>$m$</Latex>
        </li>
        <li>
          <Latex>{String.raw`$u = \frac x m$`}</Latex>
        </li>
      </ul>
      <p>Example:</p>
      <ul>
        <li>
          <Link href="?a=7&x0=9&m=61&n=100" replace>
            <Latex>$a = 7, x_0 = 9, m = 61$</Latex>
          </Link>
        </li>
        <li>
          <Link href="?a=447&x0=1881&m=34&n=100" replace>
            <Latex>$a = 447, x_0 = 1881, m = 34$</Latex>
          </Link>
        </li>
        <li>
          <Link href="#" onClick={(e) => {
            e.preventDefault();
            const m = Math.round(Math.random() * 1000);
            const a = Math.round(Math.random() * m);
            const x0 = Math.round(Math.random() * m);
            
            replace(objectToQueryString({a, m, x0, n: 100}));
          }}>
            <i className="bi bi-shuffle me-1" />
            Generate...
          </Link>
        </li>
      </ul>
    </>
  );
}
