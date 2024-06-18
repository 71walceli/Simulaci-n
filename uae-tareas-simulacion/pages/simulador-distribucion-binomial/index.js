import { Form, Button, ButtonGroup, InputNumber } from "rsuite"
import { NumberType, SchemaModel } from "schema-typed";
import React, { useEffect, useMemo } from "react"
import Latex from "react-latex-next";
import { useRouter } from "next/router";

import { factorial } from "../../utils";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Accordion } from "../../Components/Accordion";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { counts, probabilityDistribution, randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { T } from "../../I18n"
import { Chart } from "../../Components/Charts";


const _20221219_2_simulador_distribucion_binomial = (props) => {
  const { query: _query, locale } = useRouter()
  const _formularioLimpio = {
    probabilidad: "0",
    noSimulaciones: "10",
    noElementos: "3",
  };
  const _esquemaFormulario = SchemaModel({
    probabilidad: NumberType(T[locale].errors.forms.numeric)
      .range(0, 1, T[locale].errors.forms.number.probabilityExclusive)
      .addRule(v => 0 < v && v < 1, T[locale].errors.forms.number.probabilityExclusive)
      .isRequired(T[locale].errors.forms.required),
      noSimulaciones: NumberType(T[locale].errors.forms.numeric)
        .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.positive)
        .isInteger(T[locale].errors.forms.number.integer)
        .isRequired(T[locale].errors.forms.required),
      noElementos: NumberType(T[locale].errors.forms.numeric)
        .range(2, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.positive)
        .isInteger(T[locale].errors.forms.number.integer)
        .isRequired(T[locale].errors.forms.required),
    });
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametrosAlgoritmo, setParametrosAlgoritmo] = React.useState(_formularioLimpio);
  const [resultados, setResultados] = React.useState({});
  const [erroresFormulario, setErroresFormulario] = React.useState({
    probabilidad: T[locale].errors.forms.required,
  });
  const windowSize = useWindowSize();

  // Function to calculate the value of nCr
  const calculate_nCr = (n, r) => factorial(n) / (factorial(r) * factorial(n - r))

  const calcular = (parameters) => {
    const probabilidad = Number(parameters.probabilidad);
    const noSimulaciones = Number(parameters.noSimulaciones);
    const noElementos = Number(parameters.noElementos);

    const funcionProbabilidad = []
    let probabilidadAcumulada = 0
    for (let i = 0; i < noElementos + 1; i++) {
      const noCombinaciones = calculate_nCr(noElementos, i);
      const probabilidad_x = noCombinaciones * probabilidad ** i * (1 - probabilidad) ** (noElementos - i)
      probabilidadAcumulada = probabilidadAcumulada + probabilidad_x
      const asociacion = {
        i: i,
        noCombinaciones: noCombinaciones,
        probabilidad: probabilidad_x,
        probabilidadAcumulada,
      }
      funcionProbabilidad.push(asociacion)
      if (funcionProbabilidad[i].probabilidadAcumulada > 1) 
        break
    }
    setParametrosAlgoritmo({ funcionProbabilidad })

    const resultados = []
    for (let i = 0; i < noSimulaciones; i++) {
      const u = Math.random()
      let x = NaN
      for (let j = 0; j < funcionProbabilidad.length; j++) {
        const asociacion = funcionProbabilidad[j]
        if (u < asociacion.probabilidadAcumulada) {
          x = asociacion.i
          break
        }
      }
      resultados.push({ u, x })
    }

    const conteos = []
    for (let i = 0; i <= noElementos; i++) {
      const conteo = resultados.filter(r => r.x === i).length;
      if (conteo > 0)
        conteos.push({ i, conteo })
    }
    console.log({ funcionProbabilidad, resultados, conteos })
    setResultados({ resultados, conteos })
  };

  const query = useMemo(() => ({
    probabilidad: _query.p,
    noSimulaciones: _query.n,
    noElementos: _query.k,
  }), [_query])
  useEffect(() => {
    if (Object.keys(query).length === 0)
      return;
    const validationResult = _esquemaFormulario.check(query)
    if (Object.values(validationResult).filter(x => x.hasError).length === 0) {
      console.log({query, validationResult})
      calcular(query)
      setDatosFormulario(query)
      setErroresFormulario({})
    }
  }, [query])


  const SimInfo = T[locale].simulators.binomialDistribution;
  return (
    <BaseLayout title={SimInfo.META.title} rightContent={<SimInfo.Description />} >
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario} formError={erroresFormulario}
        model={_esquemaFormulario}
        onChange={setDatosFormulario} onCheck={setErroresFormulario}
        onSubmit={() => calcular(datosFormulario)}
      >
        <Form.Group controlId="probabilidad">
          <Form.ControlLabel>{T[locale].fields.probability} <Latex>$p$</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0}
            min={0} max={1} step={0.01} name="probabilidad"
          />
        </Form.Group>
        <Form.Group controlId="noSimulaciones">
          <Form.ControlLabel>{T[locale].fields.numSimulations}</Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={10} min={1}
            name="noSimulaciones"
          />
        </Form.Group>
        <Form.Group controlId="noElementos">
          <Form.ControlLabel>{T[locale].fields.numElements} <Latex>$k$</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={3} min={1}
            name="noElementos"
          />
        </Form.Group>
        <ButtonGroup>
          <Button type="submit" appearance="primary"
            disabled={Object.entries(erroresFormulario).length > 0}
          >
            {T[locale].compute}
          </Button>
        </ButtonGroup>
      </Form>
      {parametrosAlgoritmo?.funcionProbabilidad?.length > 0 && <>
        <Chart type="Line" title={T[locale].probabilityFunction} style={{maxHeight: "80vh"}}
          data={{
            labels: parametrosAlgoritmo.funcionProbabilidad.map(r => r.i),
            datasets: [
              {
                label: T[locale].fields.probability,
                data:parametrosAlgoritmo.funcionProbabilidad.map(r => ({x:r.i,y:r.probabilidad})),
                backgroundColor: "#ccf",
                borderColor: "lightblue",
              },
              {
                label: T[locale].fields.accProbability,
                data: parametrosAlgoritmo.funcionProbabilidad.map(r => ({ 
                  x: r.i,
                  y: r.probabilidadAcumulada
                })),
                backgroundColor: "#888",
                borderColor: "#ccc",
                fill: true,
              },
            ],
          }}
          options={{
            scales: {
              x: {
                title: randomNumbers.columns[1].titleTextOnly,
              },
              y: {
                title: T[locale].fields.probability,
              },
            }
          }}
        />
        <Accordion header={T[locale].probabilityFunction}>
          <ResponsiveTable keyField="i" 
            columns={T[locale].results.tables.probabilityDistribution.columns}
            rows={parametrosAlgoritmo.funcionProbabilidad}
          />
        </Accordion>
      </>
      }
      {resultados?.resultados?.length > 0 && <>
        <Chart type="Scatter" title={T[locale].simulationResults}
          data={{
            datasets: [{
              data: resultados.resultados.map((r,i) => ({ x: i, y: r.x })),
              backgroundColor: "#aaa",
            }],
          }}
          options={{
            scales: {
              x: {
                title: randomNumbers.columns[1].titleTextOnly,
              },
              y: {
                title: randomNumbers.columns[0].titleTextOnly,
              },
            }
          }}
        />
        <Accordion header={T[locale].simulationResults} style={{ marginTop: "1em" }}>
          <ResponsiveTable columns={randomNumbers.columns} rows={resultados.resultados} />
        </Accordion>
      </>}
      {resultados?.conteos?.length > 0 && <>
        <Chart type="Bar" title={T[locale].valuesCount}
          data={{
            labels: resultados.conteos.map(r => r.i),
            datasets: [
              {
                data: resultados.conteos.map(r => ({ x: r.i, y: r.conteo })),
                backgroundColor: "#aaa",
              }
            ],
          }}
          options={{
            scales: {
              x: {
                title: randomNumbers.columns[1].titleTextOnly,
              },
              y: {
                title: T[locale].results.tables.counts.columns[1].title ,
              },
            }
          }}
        />
        <Accordion header={T[locale].valuesCount} style={{ marginTop: "2em" }}>
          <ResponsiveTable keyField="i" columns={T[locale].results.tables.counts.columns} 
            rows={resultados.conteos} 
          />
        </Accordion>
      </>}
    </BaseLayout>
  );
};
export default _20221219_2_simulador_distribucion_binomial
