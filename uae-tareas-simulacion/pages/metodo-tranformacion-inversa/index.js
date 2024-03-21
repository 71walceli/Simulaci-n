import { Form, InputNumber, ButtonGroup, Button, Message } from "rsuite"
import { SchemaModel, NumberType, StringType } from "schema-typed"
import React, { useEffect, useMemo, useState } from "react"
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
  const [funcionProbabilidad, setFuncionProbabilidad] = useState([])
  const funcionProbabilidadVista = useMemo(
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
  const [cantidadNumeros, setCantidadNumeros] = useState(3)
  const [cantidadSimulaciones, setCantidadSimulaciones] = useState(0)
  
  const [parametros, setParametros] = useState({
    funcionProbabilidad: [],
    cantidadSimulaciones: 0,
  })
  const [resultados, setResultados] = useState([])
  
  const validadorFuncionProbabilidad = useMemo(
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
  const [erroresFormulario, setErroresFormulario] = useState({
    cantidadSimulaciones: "Requerido",
  });
  const [erroresFuncionProbabilidad, setErroresFuncionProbabilidad] = useState([
    { p: "Requerido", x: "Requerido" },
    { p: "Requerido", x: "Requerido" },
    { p: "Requerido", x: "Requerido" },
  ])
  const erroresFuncionProbabilidadVista = useMemo(
    () => erroresFuncionProbabilidad
      .map((item, index) => {
        const _item = {}

        if (item.p) { _item[`p_${index}`] = item.p }
        if (item.x) { _item[`x_${index}`] = item.x }

        return _item
      })
      .reduce((all, item) => Object.assign(all, item), {}), 
    [funcionProbabilidad, cantidadNumeros]
  )
  
  const windowSize = useWindowSize();
  
  const sumatoriaProbabilidades = useMemo(
    () => {
      const result = Number(funcionProbabilidad
        .filter(({ p }) => !Number.isNaN(p))
        .reduce((total, { p }) => total + Number(p), 0).toFixed(7)
      )
      return !Number.isNaN(result) ? result : 0
    },
    [funcionProbabilidad]
  )
  const validacioesAdicionales = useMemo(() => {
    const validaciones =
      [
        {
          criterio: () => sumatoriaProbabilidades === 1,
          mensaje: "La suma de las probabilidades (P) debe ser igual a 1.",
        },
        {
          criterio: () => erroresFormulario.cantidadSimulaciones === undefined
            && erroresFuncionProbabilidad.reduce(
              (total, pair) => total + Object.entries(pair).length, 0
          ) === 0,
          mensaje: "Debe llenar todos los campos de manera correcta.",
        },
        {
          criterio: () => {
            const valores_x = funcionProbabilidad.map(v => v.x).filter(x => x).sort()
            return valores_x.findIndex((x, i) => x === valores_x[i - 1]) === -1
          },
          mensaje: "No puede haber 2 valores de X iguales.",
        },
      ]
    return validaciones.map(regla => !regla.criterio() && regla.mensaje).filter(error => error)
  }, [funcionProbabilidad, cantidadNumeros, erroresFormulario])

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
      const pValues = query.p.split(",")
      const xValues = query.x.split(",")

      const xValues_sorted = xValues.sort()
      if (
        xValues_sorted.findIndex((x, i) => x === xValues_sorted[i - 1]) === -1
          && pValues.reduce((total, p) => total + p, 0) === 1
      ) {
        return
      }

      const _cantidadSimulaciones = Number(query.n)
      const smallestLength = pValues.length < xValues.length ? pValues.length : xValues.length
      if (smallestLength < 3) {
        // TODO Warn user that 2 value pairs are needed at least.
        return
      }
      setErroresFuncionProbabilidad([])
      setErroresFormulario({})
      
      const _funcionProbabilidad = Array(xValues.length).fill(null)
        .map((_, i) => ({
          p: Number(pValues[i]),
          x: Number(xValues[i]),
        }))
      setFuncionProbabilidad(_funcionProbabilidad)
      setCantidadNumeros(smallestLength)
      setCantidadSimulaciones(Number(query.n))
      
      calcular({
        funcionProbabilidad: _funcionProbabilidad, 
        cantidadSimulaciones: _cantidadSimulaciones
      })
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
        formValue={funcionProbabilidadVista}
        formError={erroresFuncionProbabilidadVista}
        model={validadorFuncionProbabilidad}
        onChange={value => {
          const getIndex = key => Number(key.substring(2))
          const maxIndex = Object.keys(value)
            .map(getIndex)
            .reduce((max, number) => number > max ? number : max, 0)
          const _funcionProbabilidad = Array.from({length: maxIndex+1}, () => ({}))

          Object.entries(value).forEach(([key, value]) => {
            if (key.startsWith("p") && value !== undefined && value !== "") {
              _funcionProbabilidad[getIndex(key)].p = Number(value)
            }
            if (key.startsWith("x") && value !== undefined && value !== "") {
              _funcionProbabilidad[getIndex(key)].x = Number(value)
            }
          })

          setFuncionProbabilidad(_funcionProbabilidad)
        }}
        onCheck={errors => {
          const getIndex = key => Number(key.substring(2))
          const maxIndex = Object.keys(errors)
            .map(getIndex)
            .reduce((max, number) => number > max ? number : max, 0)
          const _funcionProbabilidadErrores = Array.from({length: maxIndex+1}, () => ({}))

          Object.entries(errors).forEach(([key, value]) => {
            if (key.startsWith("p") && value !== undefined && value !== "") {
              _funcionProbabilidadErrores[getIndex(key)].p = value
            }
            if (key.startsWith("x") && value !== undefined && value !== "") {
              _funcionProbabilidadErrores[getIndex(key)].x = value
            }
          })

          setErroresFuncionProbabilidad(_funcionProbabilidadErrores)
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
                    return fp
                  })
                  setErroresFuncionProbabilidad(efp => {
                    efp = [...efp]
                    efp.splice(i, 1)
                    return efp
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
                setErroresFuncionProbabilidad(efp => [...efp].concat({ p: "Requerido", x: "Requerido" }))
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
