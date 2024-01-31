import { 
  CustomProvider, Container, Header, Content, Form, InputNumber, ButtonGroup, Button, Divider, 
  Message, Steps
} from "rsuite"
import { Table as SuperResponsiveTable, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { SchemaModel, NumberType } from "schema-typed"
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft"
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons/faArrowAltCircleRight"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Head from 'next/head'

import "../../utils/"
import { useWindowSize } from "../../hooks/useWindowSize"
import { ResponsiveTable } from "../../Components/ResponsiveTable"
import { randomNumbers } from "../../data/formats"


const _20221114_1_metodo_tranformacion_inversa = (props) => {
  //#region configuracion
  const titulo = "Método de Transformación Inversa"
  const _formularioLimpio = {
    cantidadNumeros: {
      n: 0
    },
    funcionProbabilidad: {
    },
    cantidadSimulaciones: {
      n: 0
    },
  };
  const _esquemaFormulario = {
    cantidadNumeros: SchemaModel({
      n: NumberType("requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
        .isRequired("Requerido"),
    }),
    cantidasSimulaciones: SchemaModel({
      n: NumberType("requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
        .isRequired("Requerido"),
    }),
  };

  // TODO Poner todo lo de cada uno de los formulariios en su propio objeto
  const formularioCantidadNumeros = React.useRef();
  const formularioDatosFuncionProbabilidad = React.useRef();
  const formularioParametrosSimulacion = React.useRef();
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametros, setParametros] = React.useState({
    cantidadNumeros: 0,
    funcionProbabilidad: [],
    cantidadSimulaciones: 0,
  })
  const [resultados, setResultados] = React.useState([])
  const [erroresFormulario, setErroresFormulario] = React.useState({
    cantidadNumeros: {
      n: "Requerido",
    },
    funcionProbabilidad: {
    },
    cantidadSimulaciones: {
      n: "Requerido",
    },
  });
  const windowSize = useWindowSize();
  const [pasoAsistente, setPasoAsistente] = React.useState(0)

  const generarEsquemaFuncionProbabilidad = React.useCallback(() => {
      const schema = {}
      for (let i = 0; i < parametros.cantidadNumeros; i++) {
        schema[`p_${i}`] = NumberType("Requerido").range(0, 1, "Debe estar entre 0 y 1")
          .isRequired("Requerido")
        schema[`x_${i}`] = NumberType("Requerido").isRequired("Requerido")
      }
      return SchemaModel(schema)
    }
    , [parametros.cantidadNumeros]
  )

  const funcionProbabilidad = {}
  funcionProbabilidad.generarParametros = React.useCallback(() => {
      // TODO Optimizar
      const nuevosDatos = []
      for (let i=0; i<parametros.cantidadNumeros; i++) {
        const valorProbabilidad = Number(datosFormulario.funcionProbabilidad[`p_${i}`]);
        const valor_x = Number(datosFormulario.funcionProbabilidad[`x_${i}`]);
        nuevosDatos.push({ 
          p: valorProbabilidad !== NaN && 0 <= valorProbabilidad 
            && valorProbabilidad <= 1 ? valorProbabilidad : 0,
          x: Number(valor_x)
        })
      }
      return nuevosDatos
    }
    , [datosFormulario.funcionProbabilidad, parametros.cantidadNumeros]
  )
  funcionProbabilidad.sumatoriaProbabilidades = () => Number(funcionProbabilidad.generarParametros()
    .reduce( (probabilidad1, asociacion) => probabilidad1+asociacion.p ,  0 ).toFixed(7)),
  funcionProbabilidad.validacioesAdicionales = React.useCallback(() => {
    const validaciones =
      [
        {
          criterio: () => funcionProbabilidad.sumatoriaProbabilidades() === 1,
          mensaje: "La suma de las probabilidades (P) debe ser igual a 1.",
        },
        {
          criterio: () => funcionProbabilidad.generarParametros()
            .filter(asociacion => Number.isNaN(asociacion.x)).length === 0 && 
              funcionProbabilidad.generarParametros().length !== 0 &&
              Object.entries(erroresFormulario.funcionProbabilidad || {}).length === 0
          ,
          mensaje: "Debe llenar todos los valores de X de manera correcta",
        },
        {
          criterio: () => {
            const valores = funcionProbabilidad.generarParametros()
            const counter = {}
            for (let i=0; i<valores.length; i++) {
              const x = valores[i].x;
              if (!Number.isNaN(x)) 
                counter[x] = counter[x] ? counter[x]+1 : 1
              if (counter[x] > 1)
                return false
              // TODO Si se cuentan más de 2 elementos, regresar 2 veces.
            }
            return true
          }
          ,
          mensaje: "No puede haber 2 valores de X que sean iguales",
        },
      ]
    return validaciones.map(regla => !regla.criterio() && regla.mensaje).filter(error => error)
  }, [datosFormulario.funcionProbabilidad, parametros.cantidadNumeros])

  // TODO Poner en su propio componente
  const BotonAtras = React.forwardRef((props, ref) => (
    <Button appearance="ghost" ref={ref} {...props}>
      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
      {" "}
      Anterior
    </Button>
  ))
  BotonAtras.displayName = "BotonAtras"
  const BotonSiguiente = React.forwardRef((props, ref) => (
    <Button appearance="primary" color="green" ref={ref} {...props}>
      Siguiente
      {" "}
      <FontAwesomeIcon icon={faArrowAltCircleRight} />
    </Button>
  ))
  BotonSiguiente.displayName = "BotonSiguiente"

  React.useEffect(() => {
    formularioCantidadNumeros.current?.check();
    formularioDatosFuncionProbabilidad.current?.check();
    formularioParametrosSimulacion.current?.check();
    return () => {
      formularioCantidadNumeros.current = null;
      formularioDatosFuncionProbabilidad.current = null;
      formularioParametrosSimulacion.current = null;
    };
  }, [formularioCantidadNumeros, formularioDatosFuncionProbabilidad, formularioParametrosSimulacion]);
  //#endregion

  return (
    <CustomProvider theme="dark">
      <Head>
        <title>{titulo}</title>
      </Head>
      <Container>
        <Header>
          <h3>{titulo}</h3>
        </Header>
        <Container style={{
          maxHeight: "100%",
        }}>
          <Content style={{
            textAlign: "center",
          }}>
            <Steps current={pasoAsistente} className="padding-iem-south"
              vertical={windowSize.width < 600}
            >
              {/* TODO Add click handler */}
              <Steps.Item title="Cantidad de datos" />
              <Steps.Item title="Función de probabilidad" />
              <Steps.Item title="Parámetros de simulación" />
              <Steps.Item title="Resultados" />
            </Steps>
            {/* TODO Add buttons at botton, don't repeat them */}
            {pasoAsistente === 0 && 
              <div>
                <Form
                  formValue={datosFormulario.cantidadNumeros}
                  formError={erroresFormulario.cantidadNumeros}
                  model={_esquemaFormulario.cantidadNumeros}
                  onChange={valor => {
                    setDatosFormulario({
                      ...datosFormulario,
                      cantidadNumeros: valor,
                    })
                  }}
                  onCheck={valor => {
                    setErroresFormulario({
                      ...erroresFormulario,
                      cantidadNumeros: valor,
                    })
                  }}
                  onSubmit={() => {
                    const camposDeMas =
                      parametros.cantidadNumeros - datosFormulario.cantidadNumeros.n
                    // TODO Mejor usar modal de rsuite
                    if (parametros.cantidadNumeros !== 0 && camposDeMas > 0
                      && !confirm("AL asignar un número de campos menor, los "
                        + "valores eliminados no podrán ser recuperados. "
                        + "¿Desea continuar?"
                      )
                    ) {
                      return
                    }
                    const nuevaCantidad = Number(datosFormulario.cantidadNumeros.n);
                    setParametros({
                      funcionProbabilidad: [],
                      cantidadNumeros: nuevaCantidad,
                      cantidasSimulaciones: parametros.cantidadSimulaciones,
                    })
                    if (camposDeMas > 0) {
                      const nuevosDatos = {
                        ...datosFormulario.funcionProbabilidad
                      }
                      const camposParaBorrar = Object.keys(nuevosDatos)
                        .filter(campo =>
                          Number(campo.split("_")[1]) > nuevaCantidad - 1
                        )
                      camposParaBorrar.map(campo => delete nuevosDatos[campo])
                      setDatosFormulario({
                        ...datosFormulario,
                        funcionProbabilidad: nuevosDatos
                      })
                      // TODO Splice parametros.funcionProbabilidad
                    }
                    setPasoAsistente(1)
                  }}
                  ref={formularioCantidadNumeros}
                >
                  <Form.Group controlId="n">
                    <Form.ControlLabel>Cantidad de valores</Form.ControlLabel>
                    <Form.Control accepter={InputNumber} min={1} name="n" />
                  </Form.Group>
                  <ButtonGroup>
                    {/* TODO Poner en su propio componente */}
                    <Button type="button" appearance="ghost" color="red">
                      Borrar todo
                    </Button>
                    <BotonSiguiente type="submit"
                      disabled={
                        Object.entries(erroresFormulario.cantidadNumeros || {}).length > 0
                      }
                    />
                  </ButtonGroup>
                </Form>
              </div>
            }
            {pasoAsistente === 1 && parametros.cantidadNumeros > 0 &&
              <div>
                <Divider />
                <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
                  formValue={datosFormulario.funcionProbabilidad}
                  formError={erroresFormulario.funcionProbabilidad}
                  model={generarEsquemaFuncionProbabilidad()}
                  onChange={valor => {
                    setDatosFormulario({
                      ...datosFormulario,
                      funcionProbabilidad: valor,
                    })
                  }}
                  onCheck={valor => {
                    setErroresFormulario({
                      ...erroresFormulario,
                      funcionProbabilidad: valor,
                    })
                  }}
                  onSubmit={() => {
                    setParametros({
                      // TODO Considerar el resto de parámetros.
                      cantidadNumeros: parametros.cantidadNumeros,
                      funcionProbabilidad: funcionProbabilidad.generarParametros()
                    })
                    setPasoAsistente(2)
                  }}
                  ref={formularioDatosFuncionProbabilidad}
                >
                  <ResponsiveTable 
                    columns={[
                      { title: "Probabilidad", }, 
                      { title: "Valor x", },
                    ]}
                    rows={Array(parametros.cantidadNumeros).fill(null)
                      .map((_, i) => [
                        <Form.Group controlId={`p_${i}`}>
                          <Form.Control accepter={InputNumber}
                            errorPlacement="bottomEnd"
                            min={0} max={1}
                            name={`p_${i}`} step={0.01}
                          />
                        </Form.Group>,
                        <Form.Group controlId={`x_${i}`}>
                          <Form.Control accepter={InputNumber}
                            errorPlacement="bottomEnd"
                            name={`x_${i}`}
                          />
                        </Form.Group>,
                      ])
                      .concat([[ funcionProbabilidad.sumatoriaProbabilidades() ]])
                    }
                  />
                  {funcionProbabilidad.validacioesAdicionales().length > 0 && (
                    <Message type="error">
                      <h4>Errores de validación</h4>
                      <ul>{
                        funcionProbabilidad.validacioesAdicionales().map((error) => (
                          <li key={error.hashCode()} className="derecha">{ error }</li>
                        ))
                      }</ul>
                    </Message>
                  )}
                  <ButtonGroup>
                    <BotonAtras type="button" onClick={() => setPasoAsistente(pasoAsistente -1)} />
                    <BotonSiguiente type="submit" appearance="primary"
                      disabled={
                        funcionProbabilidad.validacioesAdicionales().length > 0
                      }
                    />
                  </ButtonGroup>
                </Form>
              </div>
            }
            {pasoAsistente === 2 && parametros.funcionProbabilidad.length > 0 && 
              <div>
                <Divider />
                <Form
                  formValue={datosFormulario.cantidadSimulaciones}
                  formError={erroresFormulario.cantidadSimulaciones}
                  model={_esquemaFormulario.cantidasSimulaciones}
                  onChange={valor => {
                    setDatosFormulario({
                      ...datosFormulario,
                      cantidadSimulaciones: valor,
                    })
                  }}
                  onCheck={valor => {
                    setErroresFormulario({
                      ...erroresFormulario,
                      cantidadSimulaciones: valor,
                    })
                  }}
                  onSubmit={() => {
                    const obtenerPorMetodoTransformacionInversa = u => {
                      let probabilidadAcumulada = 0
                      for (let i=0; i<parametros.funcionProbabilidad.length; i++) {
                        probabilidadAcumulada += parametros.funcionProbabilidad[i].p
                        if (u < probabilidadAcumulada) {
                          return parametros.funcionProbabilidad[i].x
                        }
                      }
                    }

                    const cantidadSimulaciones = Number(datosFormulario.cantidadSimulaciones.n);
                    setParametros({
                      ...parametros,
                      cantidadSimulaciones: cantidadSimulaciones
                    })
                    const nuevosResultados = Array(cantidadSimulaciones).fill(0).map(_ => {
                      const u = Math.random();
                      return { u: u, x: obtenerPorMetodoTransformacionInversa(u), }
                    })
                    console.log(nuevosResultados)
                    setResultados(nuevosResultados)
                    setPasoAsistente(3)
                  }}
                  ref={formularioParametrosSimulacion}
                >
                  <Form.Group controlId="n">
                    <Form.ControlLabel>Número de simulaciones</Form.ControlLabel>
                    <Form.Control accepter={InputNumber} min={1} name="n" />
                  </Form.Group>
                  <ButtonGroup>
                    <BotonAtras type="button" onClick={() => setPasoAsistente(pasoAsistente -1)} />
                    <BotonSiguiente type="submit"
                      disabled={
                        Object.entries(erroresFormulario.cantidadSimulaciones || {}).length > 0
                      }
                    />
                  </ButtonGroup>
                </Form>
              </div>
            }
            {pasoAsistente === 3 && resultados.length > 0 &&
              <div>
                <ResponsiveTable columns={randomNumbers.columns} rows={resultados} />
                <ButtonGroup>
                  <BotonAtras onClick={() => setPasoAsistente(pasoAsistente -1)} />
                  <BotonSiguiente disabled />
                </ButtonGroup>
              </div>
            }
          </Content>
        </Container>
      </Container>
    </CustomProvider>
  );
};
export default _20221114_1_metodo_tranformacion_inversa
