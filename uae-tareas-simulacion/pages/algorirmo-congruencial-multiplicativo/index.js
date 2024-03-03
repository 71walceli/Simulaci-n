import { Form, Button, CustomProvider, ButtonGroup, InputNumber, Container, Header, Content } from "rsuite";
import { NumberType, SchemaModel } from "schema-typed";
import React from "react";
import Head from 'next/head';
import { useWindowSize } from "../../hooks/useWindowSize";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { SIMULADORES } from '../../I18n/es/simulators';
import Latex from "react-latex-next";


const _20221106_1_algorirmo_congruencial_multiplicativo = (props) => {
  const _formularioLimpio = {
    a: "0",
    m: "0",
    x0: "0",
    n: "0",
  };
  const _esquemaFormulario = SchemaModel({
    a: NumberType("requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isRequired("Requerido"),
    m: NumberType("requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isRequired("Requerido"),
    x0: NumberType("requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isRequired("Requerido"),
    n: NumberType("requerido").range(1, Number.MAX_SAFE_INTEGER, "Debe ser positivo")
      .isInteger("Debe ser entero.").isRequired("Requerido"),
  });
  const formulario = React.useRef();
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametrosAlgoritmo, setParametrosAlgoritmo] = React.useState(_formularioLimpio);
  const [erroresFormulario, setErroresFormulario] = React.useState({
    a: "Requerido",
    m: "Requerido",
    x0: "Requerido",
    n: "Requerido",
  });
  const [valores_x, setValores_x] = React.useState();
  const windowSize = useWindowSize();

  const calcular = () => {
    const var_a = Number(datosFormulario.a);
    const var_m = Number(datosFormulario.m);
    const var_x0 = Number(datosFormulario.x0);
    const var_n = Number(datosFormulario.n);

    //const _valores_u = [{ i: 0, x: x0, u: x0/m, }]
    const _valores_x = [var_x0];

    for (let i = 1; i < var_n + 1; i++) {
      const x_anterior = _valores_x[i - 1];
      const x_actual = (var_a * x_anterior) % var_m;
      _valores_x.push(x_actual);
    }
    setValores_x(_valores_x);
    setParametrosAlgoritmo(datosFormulario)
  };

  React.useEffect(() => {
    if (formulario.current) {
      formulario.current.check();
    }
    return () => {
      formulario.current = null;
    };
  }, [formulario]);

  const INDICE = 0;
  return (
    <BaseLayout title={SIMULADORES[INDICE].title} rightContent={SIMULADORES[INDICE].description}>
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario} formError={erroresFormulario}
        model={_esquemaFormulario}
        onChange={setDatosFormulario} onCheck={setErroresFormulario}
        onSubmit={calcular} ref={formulario}
      >
        <Form.Group controlId="a">
          <Form.ControlLabel>Multiplicador <Latex>{String.raw`$\alpha$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="a" />
        </Form.Group>
        <Form.Group controlId="m">
          <Form.ControlLabel>Módulo <Latex>{String.raw`$m$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="m" />
        </Form.Group>
        <Form.Group controlId="x0">
          <Form.ControlLabel>Semilla <Latex>{String.raw`$x_n$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="x0" />
        </Form.Group>
        <Form.Group controlId="n">
          <Form.ControlLabel>Cantidad de números generados <Latex>{String.raw`$N$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="n" />
        </Form.Group>
        <ButtonGroup>
          <Button type="submit" appearance="primary"
            disabled={Object.entries(erroresFormulario).length > 0}
          >
            Calcular
          </Button>
        </ButtonGroup>
      </Form>
      {valores_x &&
        <ResponsiveTable columns={randomNumbers.columns}
          rows={valores_x.map(x => ({ x, u: x / Number(parametrosAlgoritmo.m) }))}
        />
      }
    </BaseLayout>
  );
};
export default _20221106_1_algorirmo_congruencial_multiplicativo
