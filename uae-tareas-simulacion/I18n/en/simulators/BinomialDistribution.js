import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "Binomial",
  title: "Distribución Binomial",
  url: "/simulador-distribucion-binomial",
}
export function Description() {
  const { replace } = useRouter()

  return <>
    <p>
      La distribución binomial es una distribución de probabilidad discreta que describe el número 
      de éxitos en una secuencia de
      <Latex>$n$</Latex>
      ensayos independientes, donde cada ensayo tiene únicamente dos resultados posibles: éxito o 
      fracaso. Cada ensayo se considera independiente, y la probabilidad de éxito es constante en 
      todos los ensayos. Esta distribución está parametrizada por dos parámetros: 
      <Latex>$n$</Latex>, 
      que representa el número total de ensayos, y 
      <Latex>$p$</Latex>, 
      que es la probabilidad de éxito en cada ensayo.
    </p>
    <p>
      Fórmula:
    </p>
    <p>
      <Latex>{String.raw`$\mathbb{P}(X = k)= {n \choose k} \, p^k (1-p)^{n-k}$`}</Latex>
    </p>
    <p>
      Variables:
    </p>
    <ul>
      <li><Latex>$X$</Latex>: Variable aleatoria del número de éxitos</li>
      <li><Latex>$k$</Latex>: Número de éxitos favorables</li>
      <li><Latex>$n$</Latex>: Número total de ensayos</li>
      <li><Latex>$p$</Latex>: Probabilidad de éxito</li>
      <li>
        <Latex>{String.raw`$ {n \choose k} = \frac{n!}{k! (n -k)!}$`}</Latex>
        <br />
        Distribución binomial
      </li>
    </ul>
    <p>
      Indicaciones:
    </p>
    <ul>
      <li><Latex>$n$</Latex> debe ser un número entero positivo.</li>
      <li><Latex>$p$</Latex> debe ser un número en el intervalo [0, 1], representando una probabilidad.</li>
    </ul>
    <p>Ejemplo:</p>
    <ul>
      <li>
        <Link replace href="?n=100&p=0.5&k=10" >
          Simular 10 monedas
        </Link>
      </li>
      <li>
        <Link replace href="?n=100&p=0.166666666666667&k=20" >
          Simular mismo valor para 20 dados
        </Link>
      </li>
      <li>
        <Link href="#" onClick={(e) => {
          e.preventDefault()
          replace(objectToQueryString({
            k: Math.round(Math.random()*255), 
            p: Math.random(), 
            n: 100
          }))
        }}>
          <i className="bi bi-shuffle me-1" />
          Generar...
        </Link>
      </li>
    </ul>
  </>;
}
