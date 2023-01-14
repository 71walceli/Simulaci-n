import { 
  Form, Button, CustomProvider, ButtonGroup, InputNumber, Container, Header, Content, Divider 
} from "rsuite"
import { Table as SuperResponsiveTable, Thead, Tbody, Tr, Th, Td } 
  from 'react-super-responsive-table'
import { NumberType, SchemaModel } from "schema-typed";
import React from "react"
import Head from 'next/head'
import { factorial } from "../../utils";

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
  // TODO put ii in its own hook
  const [tamañoVentana, setTamañoVentana] = React.useState({
    width: 0,
    height: 0,
  });

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

  // TODO Import from another hook
  const adjustSizes = () => {
    setTamañoVentana({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  React.useEffect(() => {
    if (formulario.current) {
      formulario.current.check();
    }
    window.addEventListener("resize", adjustSizes);
    return () => {
      window.removeEventListener("resize", adjustSizes);
      formulario.current = null;
    };
  }, [formulario]);

  const tableStyle = {
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    width: "auto",
  }

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
            <Form layout={tamañoVentana.width > 420 && "horizontal" || "vertical"}
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
              <div>
                <Divider />
                <h4>Distribución de probabilidad</h4>
                <div style={tableStyle}>
                  <SuperResponsiveTable style={{
                    maxWidth: (tamañoVentana.width > 480) && "75%" || "100%",
                    margin: "0 auto"
                  }}>
                    <Thead>
                      <Tr>
                        <Th>i</Th>
                        <Th>Probabilidad</Th>
                        <Th>Prob. acumulada</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {parametrosAlgoritmo.funcionProbabilidad.map((valores) => (
                        <Tr key={valores.i}>
                          <Td>{valores.i}</Td>
                          <Td>{valores.probabilidad}</Td>
                          <Td>{valores.probabilidadAcumulada}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </SuperResponsiveTable>
                </div>
              </div>
            )}
            {resultados?.resultados?.length > 0 && (
              <div>
                <Divider />
                <h4>Resultados de simulación</h4>
                <div style={tableStyle}>
                  <SuperResponsiveTable style={{
                    maxWidth: (tamañoVentana.width > 480) && "75%" || "100%",
                    margin: "0 auto"
                  }}>
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>U(0, 1)</Th>
                        <Th>X</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {resultados.resultados.map((valores, índice) => (
                        <Tr key={índice}>
                          <Td>{índice}</Td>
                          <Td>{valores.u}</Td>
                          <Td>{valores.x}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </SuperResponsiveTable>
                </div>
              </div>
            )}
            {resultados?.conteos?.length > 0 && (
              <div>
                <Divider />
                <h4>Conteo de valores</h4>
                <div style={tableStyle}>
                  <SuperResponsiveTable style={{
                    maxWidth: (tamañoVentana.width > 480) && "75%" || "100%",
                    margin: "0 auto"
                  }}>
                    <Thead>
                      <Tr>
                        <Th>i</Th>
                        <Th>Conteo</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {resultados.conteos.map((valores) => (
                        <Tr key={valores.i}>
                          <Td>{valores.i}</Td>
                          <Td>{valores.conteo}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </SuperResponsiveTable>
                </div>
              </div>
            )}
          </Content>
        </Container>
      </Container>
    </CustomProvider>
  );
};
export default _20230116_1_dostribucion_poison
