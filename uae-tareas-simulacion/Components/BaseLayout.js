import Head from "next/head"
import { Container, Header, Content, Sidebar, CustomProvider, Nav, Tag, Drawer, Whisper, Popover } from "rsuite"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import _ from "lodash"

import { LANGUAGES, T } from "../I18n"

import 'katex/dist/katex.min.css'


export const BaseLayout = ({title, children, rightContent, ...props}) => {
  const { locale, pathname, query, push } = useRouter()
  const [ drawerOpen, setDrawerOpen ] = useState(false)
  const [ drawerContent, setDrawerContent ] = useState()
  const [ placement, setPlacement ] = useState()

  const handleDrawer = (content, placement) => {
    setDrawerOpen(Boolean(content))
    setDrawerContent(content)
    setPlacement(content ? placement : null)
  }

  const SidebarMenu = () => 
    <Nav vertical appearance="subtle">
      {T[locale].metaList.map(s => {
        const active = pathname === s.url

        return <Nav.Item key={s.url} href={s.url} as={Link} active={active}
          style={{ flexWrap: "wrap" }}
        >
          <Tag color={active ? "blue" : "grey"}>{s.abbreviation}</Tag>
          <p className="w-100">{s.title}</p>
        </Nav.Item>
      })}
    </Nav>

  useEffect(() => handleDrawer(), [pathname, query])

  return <>
    <CustomProvider theme="dark">
      <Head>
        <title>{title}</title>
      </Head>
      <Container style={{ 
        backgroundColor: "black", 
        maxHeight: "calc( 100vh - 3em )",
        height: "calc( 100vh - 3em )",
        overflowY: "hidden",
      }}>
        <Header className="border-bottom">
          <Nav className="d-flex w-100">
            <Nav.Item as={Link} href="/"><i className="bi bi-house"/></Nav.Item>
            <Nav.Item className="d-xs-block d-lg-none"
              onClick={() => handleDrawer(<SidebarMenu />, "left")}
            >
              <i className="bi bi-list"/>
            </Nav.Item>
            <Nav.Item style={{ 
              flexBasis: 1, 
              flexShrink: 0, 
              flexGrow: 1, 
              fontWeight: "bolder",
              color: "white",
            }}>
              <span className="mx-auto">{title}</span>
            </Nav.Item>
            <Nav.Item className="d-xs-block d-xl-none"
              onClick={() => handleDrawer(rightContent, "right")}
            >
              <i className="bi bi-question"/>
            </Nav.Item>
            <Nav.Item><i className="bi bi-sliders"/></Nav.Item>
            <Whisper trigger="click" placement="auto" speaker={
              <Popover full>
                <Nav vertical>
                  {LANGUAGES.map(l => <Nav.Item key={l.code} 
                    onClick={() => push(pathname, pathname, { locale: l.code })}
                  >
                    {l.name}
                  </Nav.Item>)}
                </Nav>
              </Popover>
            }>
              <Nav.Item><i className="bi bi-translate"/></Nav.Item>
            </Whisper>
          </Nav>
        </Header>
        <Content style={{ 
          backgroundColor: "black",  
          maxHeight: "calc( 100vh - 3em - 37px )",
          height: "calc( 100vh - 3em - 37px )",
          overflowY: "hidden",
        }}>
          <Container>
            <Sidebar className="d-none d-lg-block d-xl-block d-xxl-block pe-3 overflow-auto" style={{
              maxHeight: "calc( 100vh - 3em - 37px )",
              height: "calc( 100vh - 3em - 37px )",
            }}>
              <SidebarMenu />
            </Sidebar>
            <Content style={{
              minHeight: "calc( 100vh - 3em - 37px )",
              height: "calc( 100vh - 3em - 37px )",
              maxHeight: "calc( 100vh - 3em - 37px )",
              overflowY: "hidden",
            }}>
              <div className="mt-3 "/>
              <div className="overflow-auto" style={{ 
                backgroundColor: "#222",
                minHeight: "calc( 100vh - 3em - 37px - 1rem )",
                height: "calc( 100vh - 3em - 37px - 1rem )",
                maxHeight: "calc( 100vh - 3em - 37px - 1rem )",
              }}>
                {children}
              </div>
            </Content>
            <Sidebar className="d-none d-xl-block d-xxl-block ps-3 pt-2" style={{
              maxHeight: "calc( 100vh - 3em - 37px )",
              height: "calc( 100vh - 3em - 37px )",
              overflowY: "hidden",
            }}>
              <div className="overflow-auto" style={{
                maxHeight: "calc( 100vh - 3em - 37px - 1rem )",
                height: "calc( 100vh - 3em - 37px - 1rem )",
              }}>
                {rightContent}
              </div>
            </Sidebar>
          </Container>
        </Content>
      </Container>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement={placement} 
        size="xs"
        onExited={() => {
          setPlacement(null)
          setDrawerContent(null)
        }}
      >
        <Drawer.Body>
          {drawerContent}
        </Drawer.Body>
      </Drawer>
    </CustomProvider>
  </>
}
