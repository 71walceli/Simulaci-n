import { Form, Input, MaskedInput, Button, CustomProvider, ButtonGroup, InputNumber, Container, Header, Sidebar, Content } from "rsuite"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { NumberType, SchemaModel } from "schema-typed";
import React from "react"
import Head from 'next/head'

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
    const [tamañoVentana, setTamañoVentana] = React.useState({
        width: 0,
        height: 0,
    });

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

    return (
        <CustomProvider theme="dark">
            <Head>
                <title>Algoritmo Congruencial Multiplicativo</title>
            </Head>
            <Container>
                <Header>
                    <h3>Algoritmo Congruencial Multiplicativo</h3>
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
                            <Form.Group controlId="a">
                                <Form.ControlLabel>Parámetro a</Form.ControlLabel>
                                <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="a" />
                            </Form.Group>
                            <Form.Group controlId="m">
                                <Form.ControlLabel>Módulo (m)</Form.ControlLabel>
                                <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="m" />
                            </Form.Group>
                            <Form.Group controlId="x0">
                                <Form.ControlLabel>Semilla (x0)</Form.ControlLabel>
                                <Form.Control accepter={InputNumber} defaultValue={0} min={1} name="x0" />
                            </Form.Group>
                            <Form.Group controlId="n">
                                <Form.ControlLabel>Cantidad de números generados (n)</Form.ControlLabel>
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
                            <Table style={{
                                maxWidth: (tamañoVentana.width > 480) && "75%" || "100%",
                                margin: "0 auto"
                            }}>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>X</Th>
                                        <Th>U(0, 1)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {valores_x.map((valores, índice) => (
                                        <Tr key={índice}>
                                            <Td>{índice}</Td>
                                            <Td>{valores}</Td>
                                            <Td>
                                                <div className="redondear">
                                                    {valores / Number(parametrosAlgoritmo.m)}
                                                </div>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>}
                    </Content>
                </Container>
            </Container>
        </CustomProvider>
    );
};
export default _20221106_1_algorirmo_congruencial_multiplicativo
