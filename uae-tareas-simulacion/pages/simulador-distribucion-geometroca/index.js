import { 
  Form, Button, CustomProvider, ButtonGroup, InputNumber, Container, Header, Content, Divider 
} from "rsuite"
import { NumberType, SchemaModel } from "schema-typed";
import React from "react"
import Head from 'next/head'
import { useWindowSize } from "../../hooks/useWindowSize";
import { Accordion } from "../../Components/Accordion";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { counts, probabilityDistribution, randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { SIMULADORES } from '../../I18n/es/simulators';


const _20221230_1_simulador_distribucion_geometroca = (props) => {
  const _formularioLimpio = {
    probabilidad: "0",
    noSimulaciones: "100",
  };
  const _esquemaFormulario = SchemaModel({
    probabilidad: NumberType("Requerido").range(0, 1, "Debe ser una probabilidad válida.")
      .addRule(v => 0 < v && v < 1, "No debe ser nula u total").isRequired("Requerido"),
    noSimulaciones: NumberType("Requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isInteger("Debe ser entero.").isRequired("Requerido"),
  });
  const formulario = React.useRef();
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametrosAlgoritmo, setParametrosAlgoritmo] = React.useState(_formularioLimpio);
  const [resultados, setResultados] = React.useState({});
  const [erroresFormulario, setErroresFormulario] = React.useState({
    probabilidad: "Requerido",
    noSimulaciones: "Requerido",
  });
  // TODO put ii in its own hook
  const windowSize = useWindowSize();

  const calcular = () => {
    const probabilidad = Number(datosFormulario.probabilidad);
    const noSimulaciones = Number(datosFormulario.noSimulaciones);
    
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

  React.useEffect(() => {
    if (formulario.current) {
      formulario.current.check();
    }
    return () => {
      formulario.current = null;
    };
  }, [formulario]);

  const tableStyle = {
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
  }

  const INDICE = 4;
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
        <ButtonGroup>
          <Button type="submit" appearance="primary"
            disabled={Object.entries(erroresFormulario).length > 0}
          >
            Calcular
          </Button>
        </ButtonGroup>
      </Form>
      {/* TODO Hcer componente de tablas estándar */}
      {parametrosAlgoritmo?.funcionProbabilidad?.length > 0 && (
        <Accordion header="Distribución Geométrica" defaultExpanded>
          <ResponsiveTable keyField="i" columns={probabilityDistribution.columns}
            rows={parametrosAlgoritmo.funcionProbabilidad}
          />
        </Accordion>
      )}
      {resultados?.resultados?.length > 0 && (
        <Accordion header="Resultados de simulación" style={{ marginTop: "1em" }}>
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
export default _20221230_1_simulador_distribucion_geometroca
