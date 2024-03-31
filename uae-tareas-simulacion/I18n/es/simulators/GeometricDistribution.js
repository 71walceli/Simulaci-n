import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";

import { objectToQueryString } from "../../../misc";


export const META = {
  abbreviation: "Geom.",
  title: "Distribución Geométrica",
  url: "/simulador-distribucion-geometrica",
}
export function Description() {
  const { replace } = useRouter()

  return <>
    <p>
      La distribución geométrica es una distribución de probabilidad discreta que permite calcular
      el número de veces hasta que ocurra un caso de éxito, contando efecttivamente cuántas pruebas
      se necesitan hasta encontrar un resultado esperado, dada una probabilidad constante.
    </p>
    <p>
      Fórmula:
    </p>
    <p>
      <Latex>{String.raw`$\mathbb{P}(X = x) = (1-p)^{x-1} p$`}</Latex>
    </p>
    <p>
      Variables:
    </p>
    <ul>
      <li><Latex>$X$</Latex>: Variable aleatoria que indica cuántos ensayos antes del primer éxito.</li>
      <li><Latex>$k$</Latex>: Numero de ensayos antes del primer éxito</li>
      <li><Latex>$p$</Latex>: probabilidad de éxito</li>
    </ul>
    <p>
      Indicaciones:
    </p>
    <ul>
      <li><Latex>{String.raw`$0 < p < 1$`}</Latex></li>
    </ul>
    <p>Ejemplo:</p>
    <ul>
      <li>
        <Link replace href="?n=100&p=0.5" >
          Simular moneda (<Latex>$p = 0.5$</Latex>)
        </Link>
      </li>
      <li>
        <Link replace href="?n=100&p=0.166666666667" >
          Simular moneda (<Latex>$p = \frac 1 6$</Latex>)
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
          Generar...
        </Link>
      </li>
    </ul>
  </>;
}
