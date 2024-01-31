import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useWindowSize } from '../../hooks/useWindowSize'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import styles from "./style.module.css"


export const ResponsiveTable = ({ columns, rows, keyField, ...props }) => {
  const windowSize = useWindowSize()
  
  const containerStyle = {
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    width: "auto",
  }

  return <>
    <div style={containerStyle}>
      <Table className={styles.responsiveTable}
        style={{
          maxWidth: (windowSize.width > 480) ? "75%" : "100%",
          margin: "0 auto"
        }}
      >
        <Thead className={styles.stickyHeaders}>
          <Tr>
            {columns.map(h => <Th key={h.key}>{h.title}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, i) => (
            <Tr key={keyField ? row[keyField] || i : i}>
              {columns.map((h, j) => <Td key={h.key || j}>{row[h.key || j]}</Td>)}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  </>
}
