import { Form, Button, ButtonGroup, InputNumber } from "rsuite"
import { NumberType, SchemaModel } from "schema-typed";
import React, { useEffect, useMemo } from "react"
import Latex from "react-latex-next";
import { useRouter } from "next/router";

import { factorial } from "../../utils";
import { useWindowSize } from "../../hooks/useWindowSize";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { Accordion } from "../../Components/Accordion";
import { counts, probabilityDistribution, randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { T } from "../../I18n";
import { Chart } from "../../Components/Charts";


const _20230116_1_dostribucion_poison = (props) => {
  const { query: _query, locale } = useRouter()

  const _formularioLimpio = {
    promedio: "10",
    noSimulaciones: "100",
  };
  const _esquemaFormulario = SchemaModel({
    promedio: NumberType(T[locale].errors.forms.numeric)
      .range(0, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
      .addRule(v => v > 0, T[locale].errors.forms.number.positive)
      .isRequired(T[locale].errors.forms.required),
    noSimulaciones: NumberType(T[locale].errors.forms.numeric)
      .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
      .isInteger(T[locale].errors.forms.number.integer)
      .isRequired(T[locale].errors.forms.required),
  });
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametrosAlgoritmo, setParametrosAlgoritmo] = React.useState(_formularioLimpio);
  const [resultados, setResultados] = React.useState({});
  const [erroresFormulario, setErroresFormulario] = React.useState({});
  const windowSize = useWindowSize();

  const poisson = (i, promedio) => {
    console.log({
      i,
      promedio,
      E: Math.E,
      factorial: factorial(i),
    })
    return Math.E ** -promedio * promedio ** i / factorial(i);
  }
  const calcular = (parameters) => {
    const promedio = Number(parameters.promedio);
    const noSimulaciones = Number(parameters.noSimulaciones);
    
    const probabilidad1 = poisson(0, promedio);
    const funcionProbabilidad = [
      {
        i: 0, 
        probabilidad: probabilidad1,
        probabilidadAcumulada: probabilidad1,
      }
    ]
    const resultados = []
    for (let i = 1; i <= noSimulaciones; i++) {
      resultados.push({ u: Math.random() })
    }
    
    for (let i = 0; i < noSimulaciones; i++) {
      const u = resultados[i].u
      for (let j = 0; j< 170; j++) {  // WHY 170?
        if (!funcionProbabilidad[j]) {
          const probabilidad = poisson(j, promedio);
          funcionProbabilidad.push({
            i: j, 
            probabilidad,
            probabilidadAcumulada: funcionProbabilidad[j-1].probabilidadAcumulada +probabilidad,
          })
        }
        const probabilidadAcumulada = funcionProbabilidad[j].probabilidadAcumulada
        if (u < probabilidadAcumulada) {
          resultados[i].x = j
          break
        }
      }
    }

    setParametrosAlgoritmo({ funcionProbabilidad })

    // TODO Count values either by counting result.x values to improve performance.
    const conteos = []
    for (let i = 0; i <= promedio; i++) {
      const conteo = resultados.filter(r => r.x === i).length;
      if (conteo > 0)
        conteos.push({ i, conteo })
    }
    console.log({ funcionProbabilidad, resultados, conteos })
    setResultados({ resultados, conteos })
  };

  const query = useMemo(() => ({
    promedio: _query.l,
    noSimulaciones: _query.n,
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


  const SimInfo = T[locale].simulators.poissonDistribution;
  return (
    <BaseLayout title={SimInfo.META.title} rightContent={<SimInfo.Description />} >
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario} formError={erroresFormulario}
        model={_esquemaFormulario}
        onChange={setDatosFormulario} onCheck={setErroresFormulario}
        onSubmit={() => calcular(datosFormulario)}
      >
        <Form.Group controlId="promedio">
          <Form.ControlLabel>{T[locale].fields.average} <Latex>$\lambda $</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} min={0} name="promedio" min={0} />
        </Form.Group>
        <Form.Group controlId="noSimulaciones">
          <Form.ControlLabel>{T[locale].fields.numSimulations}</Form.ControlLabel>
          <Form.Control accepter={InputNumber} min={1} name="noSimulaciones" />
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
export default _20230116_1_dostribucion_poison
