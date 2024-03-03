import { Form, Input, MaskedInput, Button, CustomProvider, ButtonGroup, InputNumber, Container, Header, Sidebar, Content, Divider } from "rsuite"
import { NumberType, SchemaModel } from "schema-typed";
import React from "react"
import Head from 'next/head'
import { factorial } from "../../utils";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Accordion } from "../../Components/Accordion";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { counts, probabilityDistribution, randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { SIMULADORES } from '../../I18n/es/simulators';


const _20221219_2_simulador_distribucion_binomial = (props) => {
  const _formularioLimpio = {
    probabilidad: "0",
    noSimulaciones: "10",
    noElementos: "3",
  };
  const _esquemaFormulario = SchemaModel({
    probabilidad: NumberType("Requerido").range(0, 1, "Debe ser una probabilidad válida.")
      .addRule(v => 0 < v && v < 1, "No debe ser nula u total").isRequired("Requerido"),
    noSimulaciones: NumberType("Requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isInteger("Debe ser entero.").isRequired("Requerido"),
    noElementos: NumberType("Requerido").range(2, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isInteger("Debe ser entero.").isRequired("Requerido"),
  });
  const formulario = React.useRef();
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametrosAlgoritmo, setParametrosAlgoritmo] = React.useState(_formularioLimpio);
  const [resultados, setResultados] = React.useState({});
  const [erroresFormulario, setErroresFormulario] = React.useState({
    probabilidad: "Requerido",
    noSimulaciones: "Requerido",
    noElementos: "Requerido",
  });
  const [valores_x, setValores_x] = React.useState();
  // TODO put ii in its own hook
  const windowSize = useWindowSize();

  // Function to calculate the value of nCr
  const calculate_nCr = (n, r) => factorial(n) / (factorial(r) * factorial(n - r))

  const calcular = () => {
    const probabilidad = Number(datosFormulario.probabilidad);
    const noSimulaciones = Number(datosFormulario.noSimulaciones);
    const noElementos = Number(datosFormulario.noElementos);

    //const _valores_x = Array(noElementos).fill(0).map((_, i) => i);

    const funcionProbabilidad = []
    for (let i = 0; i < noElementos + 1; i++) {
      const noCombinaciones = calculate_nCr(noElementos, i);
      const probabilidad_x = noCombinaciones * probabilidad ** i * (1 - probabilidad) ** (noElementos - i)
      const asociacion = {
        i: i,
        noCombinaciones: noCombinaciones,
        probabilidad: probabilidad_x,
      }
      funcionProbabilidad.push(asociacion)
    }
    funcionProbabilidad[0].probabilidadAcumulada = funcionProbabilidad[0].probabilidad
    for (let i = 1; i <= noElementos; i++) {
      funcionProbabilidad[i] = {
        ...funcionProbabilidad[i],
        probabilidadAcumulada: 
          funcionProbabilidad[i - 1].probabilidadAcumulada + funcionProbabilidad[i].probabilidad,
      }
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

  React.useEffect(() => {
    if (formulario.current) {
      formulario.current.check();
    }
    return () => {
      formulario.current = null;
    };
  }, [formulario]);

  const INDICE = 3;
  return (
    <BaseLayout title={SIMULADORES[INDICE].title}>
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario} formError={erroresFormulario}
        model={_esquemaFormulario}
        onChange={setDatosFormulario} onCheck={setErroresFormulario}
        onSubmit={calcular} ref={formulario}
      >
        <Form.Group controlId="probabilidad">
          <Form.ControlLabel>Probabilidad de éxito</Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0}
            min={0} max={1} step={0.01} name="probabilidad"
          />
        </Form.Group>
        <Form.Group controlId="noSimulaciones">
          <Form.ControlLabel># Simulaciones</Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={10} min={1}
            name="noSimulaciones"
          />
        </Form.Group>
        <Form.Group controlId="noElementos">
          <Form.ControlLabel># Elementos</Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={3} min={1}
            name="noElementos"
          />
        </Form.Group>
        <ButtonGroup>
          <Button type="submit" appearance="primary"
            disabled={Object.entries(erroresFormulario).length > 0}
          >
            Calcular
          </Button>
        </ButtonGroup>
      </Form>
      {parametrosAlgoritmo?.funcionProbabilidad?.length > 0 && (
        <Accordion header="Distribución de probabilidad" defaultExpanded>
          <ResponsiveTable keyField="i" columns={probabilityDistribution.columns}
            rows={parametrosAlgoritmo.funcionProbabilidad}
          />
        </Accordion>
      )}
      {resultados?.resultados?.length > 0 && (
        <Accordion header="Resultados de simulación" style={{ marginTop: "2em" }}>
          <ResponsiveTable columns={randomNumbers.columns}
            rows={resultados.resultados}
          />
        </Accordion>
      )}
      {resultados?.conteos?.length > 0 && (
        <Accordion header="Conteo de valores" defaultExpanded style={{ marginTop: "2em" }}>
          <ResponsiveTable keyField="i" columns={counts.columns} rows={resultados.conteos} />
        </Accordion>
      )}
    </BaseLayout>
  );
};
export default _20221219_2_simulador_distribucion_binomial
