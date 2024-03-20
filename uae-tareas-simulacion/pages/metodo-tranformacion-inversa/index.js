import { Form, InputNumber, ButtonGroup, Button, Message } from "rsuite"
import { SchemaModel, NumberType, StringType } from "schema-typed"
import React, { useEffect, useRef } from "react"
import Latex from "react-latex-next"
import { useRouter } from "next/router"

import { useWindowSize } from "../../hooks/useWindowSize"
import { ResponsiveTable } from "../../Components/ResponsiveTable"
import { randomNumbers } from "../../data/formats"
import { BaseLayout } from "../../Components/BaseLayout"
import { Description, META } from "../../I18n/es/simulators/InverseTransformationMethod"
import { useSchemaModelValidator } from "../../controllers/useSchemaModelValidator"

import "../../utils"


const InverseTransformationMethod = (props) => {
  //#region configuracion
  const _formularioLimpio = {
    funcionProbabilidad: {},
    cantidadNumeros: 3,
    cantidadSimulaciones: 0,
  };
  
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametros, setParametros] = React.useState({
    funcionProbabilidad: [],
    cantidadSimulaciones: 0,
  })
  const [resultados, setResultados] = React.useState([])
  const validadorFuncionProbabilidad = React.useMemo(
    () => {
      const schema = {}
      for (let i = 0; i < datosFormulario.cantidadNumeros; i++) {
        schema[`p_${i}`] = NumberType("Requerido").range(0, 1, "Debe estar entre 0 y 1")
          .isRequired("Requerido")
        schema[`x_${i}`] = NumberType("Requerido").isRequired("Requerido")
      }
      return SchemaModel(schema)
    }, 
    [datosFormulario.cantidadNumeros]
  )
  const [erroresFormulario, setErroresFormulario] = React.useState({
    funcionProbabilidad: {},
    cantidadSimulaciones: "Requerido",
  });
  const windowSize = useWindowSize();
  useEffect(() => console.log({ datosFormulario }), [datosFormulario])
  useEffect(() => console.log({ erroresFormulario }), [erroresFormulario])
  
  const funcionProbabilidad = {}
  funcionProbabilidad.generarParametros = React.useCallback(
    () => {
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
    }, 
    [datosFormulario.funcionProbabilidad, parametros.cantidadNumeros]
  )
  funcionProbabilidad.sumatoriaProbabilidades = React.useMemo(
    () => Number(Object.entries(datosFormulario.funcionProbabilidad)
      .filter(([key, value]) => key.startsWith("p") && !Number.isNaN(value))
      .map(([key, value]) => value).reduce((total, value) => total + Number(value), 0).toFixed(7)
    ),
    [datosFormulario.funcionProbabilidad]
  ),
  funcionProbabilidad.validacioesAdicionales = React.useCallback(() => {
    const validaciones =
      [
        {
          criterio: () => funcionProbabilidad.sumatoriaProbabilidades === 1,
          mensaje: "La suma de las probabilidades (P) debe ser igual a 1.",
        },
        {
          criterio: () => funcionProbabilidad.generarParametros()
            .filter(asociacion => Number.isNaN(asociacion.x)).length === 0 && 
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

  const calcular = (_datosFormulario) => {
    const cantidadSimulaciones = Number(_datosFormulario.cantidadSimulaciones)
    setParametros(_parametros => {
      const obtenerPorMetodoTransformacionInversa = (funcionProbabilidad, u) => {
        let probabilidadAcumulada = 0
        for (let i = 0; i < funcionProbabilidad.length; i++) {
          probabilidadAcumulada += funcionProbabilidad[i].p
          if (u < probabilidadAcumulada) {
            return funcionProbabilidad[i].x
          }
        }
      }

      const generarFuncionProbablilidad = (_datosFuncionProbabilidad) => {
        // TODO Optimizar
        const nuevosDatos = []
        for (let i = 0; i < _datosFormulario.cantidadNumeros; i++) {
          const valorProbabilidad = Number(_datosFuncionProbabilidad[`p_${i}`])
          const valor_x = Number(_datosFuncionProbabilidad[`x_${i}`])
          nuevosDatos.push({
            p: valorProbabilidad !== NaN && 0 <= valorProbabilidad && valorProbabilidad <= 1
              ? valorProbabilidad : 0,
            x: Number(valor_x)
          })
        }
        return nuevosDatos
      }

      const funcionProbabilidad = generarFuncionProbablilidad(_datosFormulario.funcionProbabilidad)
      const nuevosResultados = Array(cantidadSimulaciones).fill(0).map(_ => {
        const u = Math.random()
        return {
          u,
          x: obtenerPorMetodoTransformacionInversa(funcionProbabilidad, u),
        }
      })
      setResultados(nuevosResultados)

      return ({
        ..._parametros,
        cantidadSimulaciones: cantidadSimulaciones,
        funcionProbabilidad: funcionProbabilidad,
      })
    })
  }
  //#endregion

  const { query } = useRouter()
  const schemaModelValidator = useSchemaModelValidator({
    x: StringType().isRequired().addRule(v => /^(-?(\d+(\.\d+)?))(,-?(\d+(\.\d+)?))*$/gm.test(v)),
    p: StringType().isRequired().addRule(v => /^((0(\.\d+)?))(,(0(\.\d+)?))*$/gm.test(v)),
    n: NumberType().isInteger().min(0),
  })
  useEffect(() => {
    if (Object.keys(query).length === 0) {
      return
    }
    if (schemaModelValidator.isValid(query)) {
      const p = query.p.split(",")
      const x = query.x.split(",")
      
      setDatosFormulario(df => {
        df = {
          ...df,
          funcionProbabilidad: Array(x.length).fill(null)
            .map((_, i) => ({
              [`p_${i}`]: Number(p[i]),
              [`x_${i}`]: Number(x[i]),
            }))
            .reduce((all, cur) => Object.assign(all, cur), {}),
          cantidadNumeros: p.length,
          cantidadSimulaciones: Number(query.n),
        }
        calcular(df)
        return df
      })
    }
  }, [query])

  return (
    <BaseLayout title={META.title} rightContent={<Description />}>
      <Form
        formValue={datosFormulario}
        formError={erroresFormulario}
        model={SchemaModel({
          cantidadSimulaciones: NumberType("requerido")
            .range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo").isRequired("Requerido"),
        })}
        onChange={valor => {
          setDatosFormulario(df => ({
            ...df,
            cantidadSimulaciones: valor.cantidadSimulaciones,
          }))
        }}
        onCheck={errores => {
          setErroresFormulario(ef => {
            console.log({ef_1: ef, errores})
            return ({
              ...errores,
            })
          })
        }}
      >
        <Form.Group controlId="cantidadSimulaciones">
          <Form.ControlLabel>Número de simulaciones</Form.ControlLabel>
          <Form.Control accepter={InputNumber} min={1} name="cantidadSimulaciones" />
        </Form.Group>
      </Form>
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario.funcionProbabilidad}
        formError={erroresFormulario}
        model={validadorFuncionProbabilidad}
        onChange={valor => {
          console.log({ valor })
          setDatosFormulario(df => ({
            ...df,
            funcionProbabilidad: valor,
          }))
        }}
        onCheck={errores => {
          setErroresFormulario(ef => {
            console.log({ef_2: ef, errores})
            return ({
              ...errores,
            })
          })
        }}
      >
        <ResponsiveTable 
          columns={[
            { title: "Probabilidad", }, 
            { title: "Valor x", },
            { title: <i className="bi bi-list" />, },
          ]}
          rows={Array(datosFormulario.cantidadNumeros).fill(null)
            .map((_, i) => [
              <Form.Group key={`p_${i}`} controlId={`p_${i}`}>
                <Form.Control accepter={InputNumber}
                  errorPlacement="bottomEnd"
                  min={0} max={1}
                  name={`p_${i}`} step={0.01}
                />
              </Form.Group>,
              <Form.Group key={`x_${i}`} controlId={`x_${i}`}>
                <Form.Control accepter={InputNumber}
                  errorPlacement="bottomEnd"
                  name={`x_${i}`}
                />
              </Form.Group>,
              <Button key={`${i}_actions`} color="red" appearance="primary"  className="m-1"
                disabled={datosFormulario.cantidadNumeros < 3} 
                onClick={() => {
                  setDatosFormulario(df => {
                    const funcionProbabilidad = {...df.funcionProbabilidad}
                    for (let i = i; i < datosFormulario.cantidadNumeros; i++) {
                      if (funcionProbabilidad[`p_${i+1}`]) {
                        console.log(`p_${i}`)
                        funcionProbabilidad[`p_${i}`] = funcionProbabilidad[`p_${i+1}`]
                      }
                      if (funcionProbabilidad[`x_${i+1}`]) {
                        console.log(`x_${i}`)
                        funcionProbabilidad[`x_${i}`] = funcionProbabilidad[`x_${i+1}`]
                      }
                    }
                    return {...df, funcionProbabilidad, cantidadNumeros: df.cantidadNumeros-1}
                  })
                }}
              >
                <i className="bi bi-trash" />
              </Button>
            ])
            .concat([[ 
              <div key="footer-sum" className="m-3">
                <Latex>{String.raw`$\sum$`}</Latex>
                &nbsp;
                {funcionProbabilidad.sumatoriaProbabilidades}
              </div>,
              null,
              <Button key="footer-actions" appearance="primary" className="m-1" onClick={() => {
                setDatosFormulario(df => ({...df, cantidadNumeros: df.cantidadNumeros+1}))
              }}>
                <i className="bi bi-plus" />
              </Button>
            ]])
          }
        />
        {funcionProbabilidad.validacioesAdicionales().length > 0 && (
          <Message type="error">
            <h4>Errores de vali                                                                   dación</h4>
            <ul>{
              funcionProbabilidad.validacioesAdicionales().map((error) => (
                <li key={error.hashCode()} className="derecha">{ error }</li>
              ))
            }</ul>
          </Message>
        )}
      </Form>
      <ButtonGroup>
        <Button appearance="primary" onClick={() => calcular(datosFormulario)}>Siguiente</Button>
      </ButtonGroup>
      {resultados.length > 0 &&
        <ResponsiveTable columns={randomNumbers.columns} rows={resultados} />
      }
    </BaseLayout>
  );
};
export default InverseTransformationMethod
