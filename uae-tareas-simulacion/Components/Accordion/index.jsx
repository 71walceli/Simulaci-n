import { PanelGroup, Panel } from "rsuite";

export const Accordion = ({header, children, defaultExpanded, ...props}) => <>
  <PanelGroup accordion 
    {...props}
    style={{ ...props.style, border: "1px grey solid"}} 
  >
    <Panel header={header} defaultExpanded={defaultExpanded}>
      {children}
    </Panel>
  </PanelGroup>
</>
