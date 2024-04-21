import Link from "next/link";
import { useRouter } from "next/router";
import Latex from "react-latex-next";
import { objectToQueryString } from "../../../misc";

export const META = {
  abbreviation: "A. C. M.",
  title: "Algoritmo Congruencial Multiplicativo",
  url: "/algorirmo-congruencial-multiplicativo",
}
export function Description() {
  const { replace } = useRouter()

  return <>
    <p>
      El algoritmo congruencial multiplicativo es un método para generar secuencias de números
      pseudoaleatorios. Este tipo de algoritmo se utiliza en la simulación computacional, juegos,
      criptografía, y otras aplicaciones donde es necesario generar números aparentemente
      aleatorios.
    </p>
    <p>
      La fórmula general del algoritmo congruencial multiplicativo es:
    </p>
    <p>
      <Latex>{String.raw`$$X_{n+1} = ( \alpha \cdot x_n)\,\rm{mod}\,m$$`}</Latex>
    </p>
    <p>
      Donde:
    </p>
    <ul>
      <li><Latex>{String.raw`$x$`}</Latex>: Variable aleatoria</li>
      <li><Latex>{String.raw`$n$`}</Latex>: Enésimo número generado</li>
      <li><Latex>{String.raw`$x_0$`}</Latex>: Primer número</li>
      <li><Latex>{String.raw`$\alpha$`}</Latex>: Multiplicador</li>
      <li><Latex>{String.raw`$m$`}</Latex>: Módulo</li>
    </ul>
    <p>
      Es importante elegir valores adecuados para
      <Latex>{String.raw`$\alpha$`}</Latex>
      y
      <Latex>{String.raw`$m$`}</Latex>
      para garantizar que el algoritmo genere números pseudoaleatorios de buena calidad. Se
      recomienda que
      <Latex>{String.raw`$m$`}</Latex>
      <Latex>{String.raw`$\alpha$`}</Latex>
      tenga propiedades específicas, como no cmmpartir factores en común con este último.
    </p>
    <p>Ejemplo:</p>
    <ul>
      <li>
        <Link href="?a=7&x0=9&m=61&n=100" replace>
          <Latex>$a = 7, x_0 = 9, m = 61$</Latex>
        </Link>
      </li>
      <li>
        <Link href="?a=447&x0=1881&m=34&n=100" replace>
          <Latex>$a = 447, x_0 = 1881, m = 34</Latex>
        </Link>
      </li>
      <li>
        <Link href="#" onClick={(e) => {
          e.preventDefault()
          const m = Math.round(Math.random() * 1000);
          const a = Math.round(Math.random() * m);
          const x0 = Math.round(Math.random() * m);
          
          replace(objectToQueryString({a, m, x0, n: 100}))
        }}>
          <i className="bi bi-shuffle me-1" />
          Generar...
        </Link>
      </li>
    </ul>
  </>;
}
