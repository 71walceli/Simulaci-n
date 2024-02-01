import { 
  Form, Button, CustomProvider, ButtonGroup, InputNumber, Container, Header, Content, Divider, PanelGroup, Panel 
} from "rsuite"
import { Table as SuperResponsiveTable, Thead, Tbody, Tr, Th, Td } 
  from 'react-super-responsive-table'
import { NumberType, SchemaModel } from "schema-typed";
import React from "react"
import Head from 'next/head'
import { factorial } from "../../utils";
import { useWindowSize } from "../../hooks/useWindowSize";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { Accordion } from "../../Components/Accordion";
import { counts, probabilityDistribution, randomNumbers } from "../../data/formats";


const _20230116_1_dostribucion_poison = (props) => {
  const _formularioLimpio = {
    promedio: "10",
    noSimulaciones: "100",
  };
  const _esquemaFormulario = SchemaModel({
    promedio: NumberType("Requerido")
      .range(0, Number.MAX_SAFE_INTEGER, "Debe ser un real positivo")
      .addRule(v => v > 0, "No debe ser nulo.").isRequired("Requerido"),
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
  const windowSize = useWindowSize();

  const calcular = () => {
    const poisson = (i) => Math.E ** -promedio * promedio ** i / factorial(i)
    const promedio = Number(datosFormulario.promedio);
    const noSimulaciones = Number(datosFormulario.noSimulaciones);
    
    const probabilidad1 = Math.E ** -promedio;
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
      for (let j = 0; j< 170; j++) {
        if (!funcionProbabilidad[j]) {
          const probabilidad = poisson(j);
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

  return (
    <CustomProvider theme="dark">
      <Head>
        <title>Simulador Distribución Poisson</title>
      </Head>
      <Container>
        <Header>
          <h3>Simulador Distribución Poisson</h3>
        </Header>
        <Container style={{
          maxHeight: "100%",
        }}>
          <Content style={{
            textAlign: "center",
          }}>
            <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
              formValue={datosFormulario} formError={erroresFormulario}
              model={_esquemaFormulario}
              onChange={setDatosFormulario} onCheck={setErroresFormulario}
              onSubmit={calcular} ref={formulario}
            >
              <Form.Group controlId="promedio">
                <Form.ControlLabel>Valor promedio L</Form.ControlLabel>
                <Form.Control accepter={InputNumber} min={0} name="promedio"
                />
              </Form.Group>
              <Form.Group controlId="noSimulaciones">
                <Form.ControlLabel># Simulaciones</Form.ControlLabel>
                <Form.Control accepter={InputNumber} min={1}
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
          </Content>
        </Container>
      </Container>
    </CustomProvider>
  );
};
export default _20230116_1_dostribucion_poison
