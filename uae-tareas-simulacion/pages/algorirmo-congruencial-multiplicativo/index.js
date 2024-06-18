import { Form, Button, ButtonGroup, InputNumber } from "rsuite";
import { NumberType, SchemaModel } from "schema-typed";
import React, { useEffect } from "react";
import Latex from "react-latex-next";
import { useRouter } from "next/router";

import { useWindowSize } from "../../hooks/useWindowSize";
import { ResponsiveTable } from "../../Components/ResponsiveTable";
import { randomNumbers } from "../../data/formats";
import { BaseLayout } from "../../Components/BaseLayout";
import { T } from "../../I18n";
import { Accordion } from "../../Components/Accordion";
import { Chart } from "../../Components/Charts";


const MCA = () => {
  const { query, locale } = useRouter()

  const _formularioLimpio = {
    a: "0",
    m: "0",
    x0: "0",
    n: "100",
  };
  const _esquemaFormulario = SchemaModel({
    a: NumberType(T[locale].errors.forms.numeric)
      .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
      .isInteger(T[locale].errors.forms.number.integer)
      .isRequired(T[locale].errors.forms.required),
    m: NumberType(T[locale].errors.forms.numeric)
      .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
      .isInteger(T[locale].errors.forms.number.integer)
      .isRequired(T[locale].errors.forms.required),
    x0: NumberType(T[locale].errors.forms.numeric)
      .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
      .isInteger(T[locale].errors.forms.number.integer)
      .isRequired(T[locale].errors.forms.required),
    n: NumberType(T[locale].errors.forms.numeric)
      .range(1, Number.MAX_SAFE_INTEGER, T[locale].errors.forms.number.positive)
      .isInteger(T[locale].errors.forms.number.integer)
      .isRequired(T[locale].errors.forms.required),
  });
  const formulario = React.useRef();
  const [datosFormulario, setDatosFormulario] = React.useState(_formularioLimpio);
  const [parametrosAlgoritmo, setParametrosAlgoritmo] = React.useState(_formularioLimpio);
  const [erroresFormulario, setErroresFormulario] = React.useState({
    a: T[locale].errors.forms.required,
    m: T[locale].errors.forms.required,
    x0: T[locale].errors.forms.required,
  });
  const [valores_x, setValores_x] = React.useState();
  const windowSize = useWindowSize();

  const calcular = (parametros) => {
    const var_a = Number(parametros.a);
    const var_m = Number(parametros.m);
    const var_x0 = Number(parametros.x0);
    const var_n = Number(parametros.n);

    const _valores_x = [var_x0];

    for (let i = 1; i < var_n + 1; i++) {
      const x_anterior = _valores_x[i - 1];
      const x_actual = (var_a * x_anterior) % var_m;
      _valores_x.push(x_actual);
    }
    setValores_x(_valores_x);
    setParametrosAlgoritmo(parametros)
  };

  useEffect(() => {
    if (Object.keys(query).length === 0)
      return;
    const validationResult = _esquemaFormulario.check(query)
    if (Object.values(validationResult).filter(x => x.hasError).length === 0) {
      console.log({query, validationResult})
      calcular(query)
      setDatosFormulario(() => query)
      setErroresFormulario({})
    }
  }, [query])


  const SimInfo = T[locale].simulators.multiplicativeCongruentialAlgorithm;
  return (
    <BaseLayout title={SimInfo.META.title} rightContent={<SimInfo.Description />}>
      <Form layout={windowSize.width > 420 && "horizontal" || "vertical"}
        formValue={datosFormulario} formError={erroresFormulario}
        model={_esquemaFormulario}
        onChange={setDatosFormulario} onCheck={setErroresFormulario}
        onSubmit={() => calcular(datosFormulario)} ref={formulario}
      >
        <Form.Group controlId="a">
          <Form.ControlLabel>{T[locale].fields.multiplier} <Latex>{String.raw`$\alpha$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="a" />
        </Form.Group>
        <Form.Group controlId="m">
          <Form.ControlLabel>{T[locale].fields.modulus} <Latex>{String.raw`$m$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="m" />
        </Form.Group>
        <Form.Group controlId="x0">
          <Form.ControlLabel>{T[locale].fields.seed} <Latex>{String.raw`$x_n$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="x0" />
        </Form.Group>
        <Form.Group controlId="n">
          <Form.ControlLabel>{T[locale].fields.numSimulations} <Latex>{String.raw`$N$`}</Latex></Form.ControlLabel>
          <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="n" />
        </Form.Group>
        <ButtonGroup>
          <Button type="submit" appearance="primary"
            disabled={Object.entries(erroresFormulario).length > 0}
          >
            {T[locale].compute}
          </Button>
        </ButtonGroup>
      </Form>
      {valores_x && <>
        <Chart type="Scatter" title={T[locale].simulationResults}
          data={{
            datasets: [{
              data: valores_x.map((x,i) => ({ x: i, y: x / Number(parametrosAlgoritmo.m) })),
              backgroundColor: "#aaa",
            }],
          }}
          options={{
            scales: {
              x: {
                title: randomNumbers.columns[1].titleTextOnly,
              },
              y: {
                title: randomNumbers.columns[0].titleTextOnly,
                max: 1,
                min: 0,
              },
            }
          }}
        />
        <Accordion header={T[locale].simulationResults} style={{ marginTop: "1em" }}>
          <ResponsiveTable columns={randomNumbers.columns}
            rows={valores_x.map(x => ({ x, u: x / Number(parametrosAlgoritmo.m) }))}
          />
        </Accordion>
      </>}
    </BaseLayout>
  );
};
export default MCA
