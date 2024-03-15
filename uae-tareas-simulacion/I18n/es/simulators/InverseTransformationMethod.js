import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";
import { objectToQueryString } from "../../../misc";

export const META = {
  abbreviation: "M. T. I.",
  title: "Método de Transformación Inversa",
  url: "/metodo-tranformacion-inversa",
}
export function Description() {
  const { replace } = useRouter()

  return <>
    <p>
      El método de transformación inversa es una técnica utilizada en estadística y teoría de 
      probabilidad para generar variables aleatorias con una distribución específica a partir de 
      variables aleatorias uniformemente distribuidas. La idea principal es transformar variables 
      uniformes en el intervalo [0, 1] en variables con la distribución deseada mediante una función
      inversa a la distribución acumulativa (CDF) de la variable objetivo.
    </p>
    <p>
      Variables:
    </p>
    <ul>
      <li><Latex>$x$</Latex>: Variable asignada a la probabilidad <Latex>$p$</Latex></li>
      <li><Latex>$p$</Latex>: Variable de probabilidad</li>
      <li><Latex>$f$</Latex>: Función de probabilidad</li>
    </ul>
    <p>
      Indicaciones:
    </p>
    <ul>
      <li><Latex>{String.raw`$\sum p = 1$`}</Latex></li>
      <li>Cada valor de <Latex>$x$</Latex> debe ser direrente</li>
    </ul>
    <p>Ejemplo:</p>
    <ul>
      <li>
        <Link href="?n=100&p=0.5,0.5&x=1,2" replace>
          Simular moneda
        </Link>
      </li>
      <li>
        <Link replace
          href="?n=100&p=0.16666666666666666,0.16666666666666666,0.16666666666666667,0.16666666666666666,0.16666666666666666,0.16666666666666667&x=1,2,3,4,5,6" 
        >
          Simular dado
        </Link>
      </li>
      <li>
        <Link href="#" onClick={(e) => {
          e.preventDefault()
          const sum = data => data.reduce((all, cur) => all+cur)
          const _n = 2+Math.round(Math.random()*18);
          let p = Array(_n).fill(null).map(() => Math.random())
          let pSum = sum(p)
          p = p.map(_p => _p / pSum)
          pSum = sum(p)
          if (pSum < 1) {
            const randomIndex = Math.random() * _n;
            p[randomIndex] = 0
            p[randomIndex] = 1 - sum(p)
          }
          
          const x = Array(_n).fill(null).map((_,i) => i)
          
          replace(objectToQueryString({p: p.join(), x: x.join(), n: 100}))
        }}>
          <i className="bi bi-shuffle me-1" />
          Generar...
        </Link>
      </li>
    </ul>
  </>;
}
