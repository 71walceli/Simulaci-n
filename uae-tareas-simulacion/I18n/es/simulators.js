import Latex from "react-latex-next"


export const SIMULADORES = [
  {
    abbreviation: "A. C. M.",
    title: "Algoritmo Congruencial Multiplicativo",
    url: "/algorirmo-congruencial-multiplicativo",
    description: <>
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
    </>
  },
  {
    abbreviation: "M. T. I.",
    title: "Método de Transformación Inversa",
    url: "/metodo-tranformacion-inversa",
  },
  {
    abbreviation: "Binomial",
    title: "Distribución Binomial",
    url: "/simulador-distribucion-binomial",
  },
  {
    abbreviation: "Poisson",
    title: "Distribución Poisson",
    url: "/dostribucion-poison",
  },
  {
    abbreviation: "Geométrica",
    title: "Distribución Geométrica",
    url: "/simulador-distribucion-geometroca",
  },
];
