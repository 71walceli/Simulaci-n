import { Form, InputNumber, ButtonGroup, Button, Message } from "rsuite"
import { SchemaModel, NumberType, StringType } from "schema-typed"
import React, { useEffect, useMemo, useRef } from "react"
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
  const [funcionProbabilidad, setFuncionProbabilidad] = React.useState([])
  const funcionProbabilidadVistaFormulario = useMemo(
    () => funcionProbabilidad
      .map((item, index) => {
        const _item = {}

        if (item.p) { _item[`p_${index}`] = item.p }
        else _item[`p_${index}`] = ""
        if (item.x) { _item[`x_${index}`] = item.x }
        else _item[`x_${index}`] = ""

        return _item
      })
      .reduce((all, item) => Object.assign(all, item), {}), 
    [funcionProbabilidad]
  )
  useEffect(() => console.log({funcionProbabilidad}), [funcionProbabilidad])
  useEffect(() => console.log({formularioFuncionProbabilidad}), [formularioFuncionProbabilidad])
  const [cantidadNumeros, setCantidadNumeros] = React.useState(3)
  const [cantidadSimulaciones, setCantidadSimulaciones] = React.useState(0)
  
  const [parametros, setParametros] = React.useState({
    funcionProbabilidad: [],
    cantidadSimulaciones: 0,
  })
  const [resultados, setResultados] = React.useState([])
  
  const validadorFuncionProbabilidad = React.useMemo(
    () => {
      const schema = {}
      for (let i = 0; i < cantidadNumeros; i++) {
        schema[`p_${i}`] = NumberType("Requerido").range(0, 1, "Debe estar entre 0 y 1")
          .isRequired("Requerido")
        schema[`x_${i}`] = NumberType("Requerido").isRequired("Requerido")
      }
      return SchemaModel(schema)
    }, 
    [cantidadNumeros]
  )
  const [erroresFormulario, setErroresFormulario] = React.useState({
    p_0: "Requerido",
    p_1: "Requerido",
    p_2: "Requerido",
    x_0: "Requerido",
    x_1: "Requerido",
    x_2: "Requerido",
    cantidadSimulaciones: "Requerido",
  });
  const windowSize = useWindowSize();
  useEffect(() => console.log({ erroresFormulario }), [erroresFormulario])
  
  const sumatoriaProbabilidades = React.useMemo(
    () => {
      const result = Number(funcionProbabilidad
        .filter(({ p }) => !Number.isNaN(p))
        .reduce((total, { p }) => total + Number(p), 0).toFixed(7)
      )
      return !Number.isNaN(result) ? result : 0
    },
    [funcionProbabilidad]
  )
  const validacioesAdicionales = React.useMemo(() => {
    const validaciones =
      [
        {
          criterio: () => sumatoriaProbabilidades === 1,
          mensaje: "La suma de las probabilidades (P) debe ser igual a 1.",
        },
        {
          criterio: () => Object.entries(erroresFormulario || {}).length === 0,
          mensaje: "Debe llenar todos los campos de manera correcta.",
        },
        {
          criterio: () => {
            const valores_x = funcionProbabilidad.map(v => v.x).filter(x => x).sort()
            return valores_x.findIndex((x, i) => x === valores_x[i-1]) === -1
          },
          mensaje: "No puede haber 2 valores de X iguales.",
        },
      ]
    return validaciones.map(regla => !regla.criterio() && regla.mensaje).filter(error => error)
  }, [funcionProbabilidad, parametros.cantidadNumeros])

  const calcular = ({funcionProbabilidad, cantidadSimulaciones}) => {
    setParametros(_parametros => {
      // TODO Preccomute accumulated values
      const obtenerPorMetodoTransformacionInversa = (funcionProbabilidad, u) => {
        let probabilidadAcumulada = 0
        for (let i = 0; i < funcionProbabilidad.length; i++) {
          probabilidadAcumulada += funcionProbabilidad[i].p
          if (u < probabilidadAcumulada) {
            return funcionProbabilidad[i].x
          }
        }
      }

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
      const smallestLength = p.length < x.length ? p.length : x.length
      if (smallestLength < 3) {
        // TODO Warn user that 2 value pairs are needed at least.
        return
      }
      
      setFuncionProbabilidad(Array(x.length).fill(null)
        .map((_, i) => ({
          p: Number(p[i]),
          x: Number(x[i]),
        }))
      )
      setCantidadNumeros(smallestLength)
      setCantidadSimulaciones(Number(query.n))
      calcular({funcionProbabilidad, cantidadSimulaciones})
    }
  }, [query])

  return (
    <BaseLayout title={META.title} rightContent={<Description />}>
      <Form
        formValue={{cantidadSimulaciones}}
        formError={erroresFormulario}
        model={SchemaModel({
          cantidadSimulaciones: NumberType("requerido")
            .range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo").isRequired("Requerido"),
        })}
        onChange={value => setCantidadSimulaciones(Number(value.cantidadSimulaciones))}
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
        formValue={funcionProbabilidadVistaFormulario}
        formError={erroresFormulario}
        model={validadorFuncionProbabilidad}
        onChange={value => {
          console.log({value})
          const getIndex = key => Number(key.substring(2))
          const maxIndex = Object.keys(value)
            .map(getIndex)
            .reduce((max, number) => number > max ? number : max, 0)
          const _funcionProbabilidad = Array.from({length: maxIndex+1}, () => ({}))

          Object.entries(value).forEach(([key, value]) => {
            console.log({ key,value })
            if (key.startsWith("p") && value !== undefined && value !== "") {
              _funcionProbabilidad[getIndex(key)].p = Number(value)
            }
            if (key.startsWith("x") && value !== undefined && value !== "") {
              _funcionProbabilidad[getIndex(key)].x = Number(value)
            }
          })

          setFuncionProbabilidad(_funcionProbabilidad)
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
          rows={Array(cantidadNumeros).fill(null)
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
                disabled={cantidadNumeros < 3} 
                onClick={() => {
                  setFuncionProbabilidad(fp => {
                    fp = [...fp]
                    fp.splice(i, 1)
                    console.log({fp})
                    return fp
                  })
                  setCantidadNumeros(cn => cn-1)
                }}
              >
                <i className="bi bi-trash" />
              </Button>
            ])
            .concat([[ 
              <div key="footer-sum" className="m-3">
                <Latex>{String.raw`$\sum$`}</Latex>
                &nbsp;
                {sumatoriaProbabilidades}
              </div>,
              null,
              <Button key="footer-actions" appearance="primary" className="m-1" onClick={() => {
                setCantidadNumeros(cn => cn+1)
              }}>
                <i className="bi bi-plus" />
              </Button>
            ]])
          }
        />
        {validacioesAdicionales.length > 0 && (
          <Message type="error">
            <h4>Errores de vali                                                                   dación</h4>
            <ul>{
              validacioesAdicionales.map((error) => (
                <li key={error.hashCode()} className="derecha">{ error }</li>
              ))
            }</ul>
          </Message>
        )}
      </Form>
      <ButtonGroup>
        <Button appearance="primary" disabled={validacioesAdicionales.length !== 0}
          onClick={() => calcular({funcionProbabilidad, cantidadSimulaciones})}
        >
          Siguiente
        </Button>
      </ButtonGroup>
      {resultados.length > 0 &&
        <ResponsiveTable columns={randomNumbers.columns} rows={resultados} />
      }
    </BaseLayout>
  );
};
export default InverseTransformationMethod
