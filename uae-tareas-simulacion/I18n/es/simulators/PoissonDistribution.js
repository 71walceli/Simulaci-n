import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "Poisson",
  title: "Distribución de Poisson",
  url: "/simulador-distribucion-poisson",
}
export function Description() {
  const { replace } = useRouter()

  return <>
    <p>
      La distribución de Poisson es una distribución de probabilidad discreta que permite entender 
      cuántas veces un evento puede ocurrir en un periodo de tiempo o en un espacio definido, 
      cuando los eventos ocurren de forma independiente a una tasa promedio constante. Es 
      especialmente útil para modelar fenómenos donde la ocurrencia de eventos es rara pero se puede
      esperar un número considerable de eventos en un gran número de intervalos.
    </p>
    <p>
      Fórmula:
    </p>
    <p>
      <Latex>{String.raw`$\mathbb{P}(X = k)= \frac {\lambda^k e^\lambda} {k!}$`}</Latex>
    </p>
    <p>
      Variables:
    </p>
    <ul>
      <li><Latex>$e = 2.71828...$</Latex>, constante de Euler</li>
      <li><Latex>$\lambda$</Latex>: Valor promedio esperado</li>
      <li><Latex>$k$</Latex>: Número de éxitos favorables</li>
      <li><Latex>$k!$</Latex>: Factorial de <Latex>$k$</Latex></li>
    </ul>
    <p>
      Indicaciones:
    </p>
    <ul>
      <li><Latex>$\lambda$</Latex> debe ser un número entero positivo.</li>
    </ul>
    <p>Ejemplo:</p>
    <ul>
      <li>
        <Link replace href="?n=100&l=7" >
          <Latex>$\lambda = 7$</Latex>
        </Link>
      </li>
      <li>
        <Link replace href="?n=100&l=10" >
          <Latex>$\lambda = 10$</Latex>
        </Link>
      </li>
      <li>
        <Link replace href="?n=100&l=33" >
          <Latex>$\lambda = 33$</Latex>
        </Link>
      </li>
      <li>
        <Link href="#" onClick={(e) => {
          e.preventDefault()
          replace(objectToQueryString({
            l: Math.round(Math.random()*255), 
            n: 100,
          }))
        }}>
          <i className="bi bi-shuffle me-1" />
          Generar...
        </Link>
      </li>
    </ul>
  </>;
}
