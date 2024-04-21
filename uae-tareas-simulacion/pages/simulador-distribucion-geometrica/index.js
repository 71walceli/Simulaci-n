import { Form, Button, ButtonGroup, InputNumber } from "rsuite"
import { NumberType, SchemaModel } from "schema-typed";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react"
import Latex from "react-latex-next";

import { useWindowSize } from "../../hooks/useWindowSize";
import { Accordion } from "../../Components/Accordion";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { counts, probabilityDistribution, randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { Description, META } from "../../I18n/es/simulators/GeometricDistribution";
import { T } from "../../I18n"


const _20221230_1_simulador_distribucion_geometroca = (props) => {
  const { query: _query, locale } = useRouter()
  console.log({locale, T})

  const _formularioLimpio = {
    probabilidad: "0",
    noSimulaciones: "100",
  };
  const _esquemaFormulario = SchemaModel({
    probabilidad: NumberType(T[locale].errors.forms.numeric)
      .range(0, 1, T[locale].errors.forms.number.probabilityExclusive)
      .addRule(v => 0 < v && v < 1, T[locale].errors.forms.number.probabilityExclusive)
      .isRequired(T[locale].errors.forms.required),
    noSimulaciones: NumberType(T[locale].errors.forms.numeric)
      .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
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

  const calcular = (parameters) => {
    const probabilidad = Number(parameters.probabilidad);
    const noSimulaciones = Number(parameters.noSimulaciones);
    
    const resultados = []
    for (let i = 1; i <= noSimulaciones; i++) {
      resultados.push({ u: Math.random() })
    }
    
    const funcionProbabilidad = []
    for (let i = 0; i < noSimulaciones; i++) {
      const u = resultados[i].u
      for (let j = 0; ; j++) {
        if (!funcionProbabilidad[j]) {
          funcionProbabilidad.push({
            i: j+1,
            probabilidad: (1 -probabilidad)**(j-1+1) * probabilidad,
            probabilidadAcumulada: 1-(1-probabilidad)**(j+2+1)
          })
        }
        const probabilidadAcumulada = funcionProbabilidad[j].probabilidadAcumulada
        if (u < probabilidadAcumulada) {
          resultados[i].x = j+1
          break
        }
      }
    }

    setParametrosAlgoritmo({ funcionProbabilidad })

    const conteos = []
    for (let i = 0; i <= resultados.length; i++) {
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

  return (
    <BaseLayout title={T[locale].simulators.geometricDistribution.META.title} 
      rightContent={<Description />}
    >
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario} formError={erroresFormulario}
        model={_esquemaFormulario}
        onChange={setDatosFormulario} onCheck={setErroresFormulario}
        onSubmit={() => calcular(datosFormulario)}
      >
        <Form.Group controlId="probabilidad">
          <Form.ControlLabel>{T[locale].fields.probabolity} <Latex>$p$</Latex></Form.ControlLabel>
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
        <ButtonGroup>
          <Button type="submit" appearance="primary"
            disabled={Object.entries(erroresFormulario).length > 0}
          >
            {T[locale].compute}
          </Button>
        </ButtonGroup>
      </Form>
      {parametrosAlgoritmo?.funcionProbabilidad?.length > 0 && (
        <Accordion header={T[locale].probabilityFunction} defaultExpanded>
          <ResponsiveTable keyField="i" columns={probabilityDistribution.columns}
            rows={parametrosAlgoritmo.funcionProbabilidad}
          />
        </Accordion>
      )}
      {resultados?.resultados?.length > 0 && (
        <Accordion header={T[locale].simulationResults} style={{ marginTop: "1em" }}>
          <ResponsiveTable columns={randomNumbers.columns} 
            rows={resultados.resultados}
          />
        </Accordion>
      )}
      {resultados?.conteos?.length > 0 && (
        <Accordion header={T[locale].valuesCount} defaultExpanded style={{ marginTop: "2em" }}>
          <ResponsiveTable keyField="i" columns={counts.columns} rows={resultados.conteos} />
        </Accordion>
      )}
    </BaseLayout>
  );
};
export default _20221230_1_simulador_distribucion_geometroca
