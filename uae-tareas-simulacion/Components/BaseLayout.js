import Head from "next/head"
import { Container, Header, Content, Sidebar, CustomProvider, Navbar, Nav, Tag } from "rsuite"
import { SIMULADORES } from '../I18n/es/simulators'
import Link from "next/link"
import { useRouter } from "next/router"

import 'katex/dist/katex.min.css'



export const BaseLayout = ({title, children, rightContent, ...props}) => {
  const {pathname} = useRouter()

  return <>
    <CustomProvider theme="dark">
      <Head>
        <title>{title}</title>
      </Head>
      <Container style={{ backgroundColor: "black",  }}>
        <Header className="border-bottom">
          <Nav className="d-flex w-100">
            <Nav.Item as={Link} href="/"><i className="bi bi-house"/></Nav.Item>
            <Nav.Item><i className="bi bi-list"/></Nav.Item>
            <Nav.Item style={{ 
              flexBasis: 1, 
              flexShrink: 0, 
              flexGrow: 1, 
              fontWeight: "bolder",
              color: "white",
            }}>
              <span className="mx-auto">{title}</span>
            </Nav.Item>
            <Nav.Item><i className="bi bi-question"/></Nav.Item>
            <Nav.Item><i className="bi bi-sliders"/></Nav.Item>
          </Nav>
        </Header>
        <Content style={{ backgroundColor: "black",  }}>
          <Container>
            <Sidebar className="d-none d-lg-block d-xl-block d-xxl-block pe-3" style={{}}>
              <Nav vertical>
                {SIMULADORES.map(s => {
                  const active = pathname === s.url
                  
                  return <Nav.Item key={s.url} href={s.url} as={Link} active={active}
                    style={{ flexWrap: "wrap" }}
                  >
                    <Tag color={active ? "blue" : "grey"}>{s.abbreviation}</Tag>
                    <p className="w-100">{s.title}</p>
                  </Nav.Item>
                })}
              </Nav>
            </Sidebar>
            <Content>
              <div className="mt-3 "/>
              <div style={{ backgroundColor: "#222", minHeight: "calc( 100vh - 60px - 3em )" }}>
                {children}
              </div>
            </Content>
            <Sidebar className="d-none d-xl-block d-xxl-block ps-3 pt-2">
              {rightContent}
            </Sidebar>
          </Container>
        </Content>
      </Container>
    </CustomProvider>
  </>
}
