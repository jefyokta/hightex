import { Node as PMNode } from '@tiptap/pm/model'
import { EditorState, Transaction } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

import { NodePosArray } from '../types/node'

import { TableMeasurement,TableGroup,TableSplitResult,TableMapping } from '../types/table'
export class TableHandler {
  private static instance: TableHandler
  private measurementCache: Map<string, TableMeasurement> = new Map()
  private tableGroups: Map<string, TableGroup> = new Map()

  static getInstance(): TableHandler {
    if (!this.instance) {
      this.instance = new TableHandler()
    }
    return this.instance
  }

  private getTableCacheKey(node: PMNode): string {
    // Include content size and JSON to ensure cache invalidation on content changes
    return `${node.attrs.figureId}-${node.content.size}-${JSON.stringify(node.toJSON())}`
  }

  measureTable(node: PMNode, view: EditorView): TableMeasurement {

    const cacheKey = this.getTableCacheKey(node)
    const cached = this.measurementCache.get(cacheKey)
    if (cached) return cached

    const table = node.child(1)
    const rows = table?.content.content

    const caption = node.child(0)
    // console.log(rows);

    const rowHeights = this.measureRowHeights(rows, view)
    const headerRowCount = this.getHeaderRowCount(table)



    const cumulativeHeights = rowHeights.reduce((acc, height) => {
      const prev = acc[acc.length - 1] || 0
      acc.push(prev + height)
      return acc
    }, [] as number[])

    const measurement: TableMeasurement = {
      rowHeights,
      headerRowCount,
      totalHeight: cumulativeHeights[cumulativeHeights.length - 1] + caption.nodeSize || 0,
      breakPoints: [],
      cumulativeHeights,
      captionHeight:caption.nodeSize
    }

    if (measurement.totalHeight > 0) {
      this.measurementCache.set(cacheKey, measurement)
    }

    return measurement
  }

  splitTableAtHeight(
    node: PMNode, // figure node
    availableHeight: number,
    measurement: TableMeasurement,
    schema: EditorState['schema'],
    pageHeight: number,
  ): TableSplitResult {

    console.log(measurement)
      //ambil attributenya
    const figureAttrs = node.attrs
    const caption = node.child(0)


    availableHeight -= caption.nodeSize
    const table = node.child(1)
    console.log(table)

    //ini row
    const rows = table.content.content
    const headerRowCount = this.getHeaderRowCount(node.child(1))

    const tables: PMNode[] = []
    let mapping: { from: number; to: number }[] = []
    const groupId = figureAttrs.groupId || `table-group-${Date.now()}`

    if (measurement.totalHeight <= availableHeight) {
      const newTable = schema.nodes.table.create({ ...table.attrs, groupId }, table.content)
      const figure = schema.nodes.figureTable.create({ ...figureAttrs, groupId }, [caption, newTable])
      return { tables: [figure], mapping: [], groupId }
    }

    // Cari split point
    let splitIndex = headerRowCount
    let currentHeight = measurement.rowHeights
      .slice(0, headerRowCount)
      .reduce((a, b) => a + b, 0)

    for (let i = headerRowCount; i < measurement.rowHeights.length; i++) {
      if (currentHeight + measurement.rowHeights[i] > availableHeight) break
      currentHeight += measurement.rowHeights[i]
      splitIndex = i + 1
    }

    const firstRows = rows.slice(0, splitIndex)
    const firstTable = schema.nodes.table.create({ ...table.attrs, groupId }, firstRows)
    const firstFigure = schema.nodes.figureTable.create({ ...figureAttrs, groupId }, [caption, firstTable])
    tables.push(firstFigure)

    if (splitIndex < rows.length) {
      const remainingRows = rows.slice(splitIndex)
      const remainingTable = schema.nodes.table.create({ ...table.attrs, groupId }, remainingRows)
      const remainingFigure = schema.nodes.figureTable.create({ ...figureAttrs, groupId }, [caption, remainingTable])

      const remainingMeasurement: TableMeasurement = {
        ...measurement,
        rowHeights: measurement.rowHeights.slice(splitIndex),
        cumulativeHeights: measurement.cumulativeHeights
          .slice(splitIndex)
          .map((h) => h - currentHeight),
        totalHeight: measurement.rowHeights
          .slice(splitIndex)
          .reduce((a, b) => a + b, 0),
        breakPoints: [],
      }

      if (remainingMeasurement.totalHeight > pageHeight) {
        const result = this.splitTableAtHeight(
          remainingFigure,
          pageHeight,
          remainingMeasurement,
          schema,
          pageHeight,
        )

        const adjustedMapping = result.mapping.map(({ from, to }) => ({
          from: from + splitIndex,
          to: to + firstFigure.nodeSize,
        }))

        tables.push(...result.tables)
        mapping = [...mapping, ...adjustedMapping]
      } else {
        tables.push(remainingFigure)
      }
    }

    const originalFigure = node.attrs.groupId
      ? this.tableGroups.get(node.attrs.groupId)?.originalTable || node
      : node

    this.tableGroups.set(groupId, {
      tables,
      originalTable: originalFigure,
      positions: [],
    })

    return { tables, mapping, groupId  }
  }


  private measureRowHeights(rows: readonly PMNode[], view: EditorView): number[] {
    return rows.map((row, index) => {
      return row.nodeSize
        console.log(row)
      //   try {
      //     // First try to get the DOM element
      //     const dom = view.nodeDOM(row.pos) as HTMLElement
      //     if (dom) {
      //       const rect = dom.getBoundingClientRect()
      //       if (rect.height > 0) {
      //         // Add a small buffer to account for borders/margins
      //         return Math.ceil(rect.height)
      //       }
      //     }

      //     // If DOM element is not available, estimate height based on content
      //     const cells = row.content.content
      //     const cellHeights = cells.map((cell) => {
      //       const { content } = cell
      //       let lineCount = 1 // Start with at least one line

      //       // Count line breaks in the content
      //       content.forEach((node) => {
      //         if (node.type.name === 'text') {
      //           // Count newlines in text content
      //           lineCount += (node.text?.match(/\n/g) || []).length
      //         } else if (node.type.name === 'hard_break') {
      //           lineCount += 1
      //         }
      //       })

      //       // Use actual cell height
      //       return lineCount * MIN_PARAGRAPH_HEIGHT
      //     })

      //     // Use maximum cell height as row height
      //     return Math.max(...cellHeights)
      //   } catch (error) {
      //     console.warn(`Failed to measure row ${index}`, error)
      //     return MIN_PARAGRAPH_HEIGHT
      //   }
    })
  }

  private getHeaderRowCount(node: PMNode): number {

    return node.attrs.headerRows || 1
  }

//   splitTableAtHeight(
//     node: PMNode,
//     availableHeight: number,
//     measurement: TableMeasurement,
//     schema: EditorState['schema'],
//     pageHeight: number,
//   ): TableSplitResult {
//     const rows = node.content.content
//     const headerRowCount = this.getHeaderRowCount(node)
//     const tables: PMNode[] = []
//     let mapping: { from: number; to: number }[] = []

//     // Check if table is already part of a group
//     const groupId = node.attrs.groupId || `table-group-${Date.now()}`

//     // If table fits in available height, return as is with groupId
//     if (measurement.totalHeight <= availableHeight) {
//       const table = schema.nodes.table.create(
//         {
//           ...node.attrs,
//           groupId,
//         },
//         node.content,
//       )
//       return { tables: [table], mapping: [], groupId }
//     }

//     // Find split point for current page
//     let splitIndex = headerRowCount
//     let currentHeight = measurement.rowHeights
//       .slice(0, headerRowCount)
//       .reduce((a, b) => a + b, 0)

//     for (let i = headerRowCount; i < measurement.rowHeights.length; i++) {
//       if (currentHeight + measurement.rowHeights[i] > availableHeight) {
//         break
//       }
//       currentHeight += measurement.rowHeights[i]
//       splitIndex = i + 1
//     }

//     // Create first table with header rows
//     const firstTableRows = rows.slice(0, splitIndex)
//     const firstTable = schema.nodes.table.create(
//       {
//         ...node.attrs,
//         groupId,
//       },
//       firstTableRows,
//     )
//     tables.push(firstTable)

//     // Handle remaining rows
//     if (splitIndex < rows.length) {
//       const remainingRows = rows.slice(splitIndex)
//       const remainingTable = schema.nodes.table.create(
//         {
//           ...node.attrs,
//           groupId,
//         },
//         remainingRows,
//       )

//       const remainingMeasurement = {
//         ...measurement,
//         rowHeights: measurement.rowHeights.slice(splitIndex),
//         cumulativeHeights: measurement.cumulativeHeights
//           .slice(splitIndex)
//           .map((h) => h - currentHeight),
//         totalHeight: measurement.rowHeights
//           .slice(splitIndex)
//           .reduce((a, b) => a + b, 0),
//       }

//       // Recursively split remaining table if needed
//       if (remainingMeasurement.totalHeight > pageHeight) {
//         const result = this.splitTableAtHeight(
//           remainingTable,
//           pageHeight,
//           remainingMeasurement,
//           schema,
//           pageHeight,
//         )

//         // Adjust mapping for the offset caused by the first table
//         const firstTableSize = firstTable.nodeSize
//         const adjustedMapping = result.mapping.map(({ from, to }) => ({
//           from: from + splitIndex,
//           to: to + firstTableSize,
//         }))

//         tables.push(...result.tables)
//         mapping = [...mapping, ...adjustedMapping]
//       } else {
//         tables.push(remainingTable)
//       }
//     }

//     // Store or update table group
//     const originalTable = node.attrs.groupId
//       ? this.tableGroups.get(node.attrs.groupId)?.originalTable || node
//       : node

//     this.tableGroups.set(groupId, {
//       tables,
//       originalTable,
//       positions: [], // Positions will be updated in buildNewDocument
//     })

//     return { tables, mapping, groupId }
//   }

  handleTableOperation(
    tr: Transaction,
    pos: number,
    operation: (table: PMNode) => PMNode,
  ): Transaction {
    const table = tr.doc.nodeAt(pos)
    if (!table || table.type.name !== 'table') return tr

    // If table is part of a group, apply operation to all tables in the group
    const group = this.getTableGroup(table)
    if (group) {
      // First apply operation to this specific table
      const updatedTable = operation(table)
      tr = tr.replaceWith(pos, pos + table.nodeSize, updatedTable)

      // Then update all other tables in the group
      group.positions.forEach((groupPos) => {
        if (groupPos !== pos) {
          const otherTable = tr.doc.nodeAt(groupPos)
          if (otherTable) {
            const updatedOtherTable = operation(otherTable)
            tr = tr.replaceWith(
              groupPos,
              groupPos + otherTable.nodeSize,
              updatedOtherTable,
            )
          }
        }
      })
    } else {
      // Single table operation
      const updatedTable = operation(table)
      tr = tr.replaceWith(pos, pos + table.nodeSize, updatedTable)
    }

    return tr
  }
  mergeTableGroup(
    groupId: string,
    contentNodes: NodePosArray,
  ): PMNode | undefined {
    const tableNodeswithGroupId = contentNodes.filter(
      ({ node }) =>
        node.attrs.groupId === groupId && node.type.name === 'figureTable',
    )
    if (!tableNodeswithGroupId.length) return undefined
    const group = this.tableGroups.get(groupId)
    if (!group?.tables.length) return undefined
    // Get all rows, handling header rows correctly
    const allRows = tableNodeswithGroupId.reduce((rows, { node }, index) => {
      if (!node.content) return rows
      const tableRows = node.content.content
      console.log(tableRows)
      // Only include header rows from the first table
      //   const contentRows =
      //     index === 0 ? tableRows : tableRows.slice(this.getHeaderRowCount(table))
      return [...rows, ...tableRows]
    }, [] as PMNode[])

    // Create merged table with original attributes
    return group.originalTable.type.create(
      { ...group.originalTable.attrs, groupId },
      allRows,
    )
  }

  getTableGroup(table: PMNode): TableGroup | undefined {
    if (!table.attrs.groupId) return undefined
    return this.tableGroups.get(table.attrs.groupId)
  }

  trackTableGroup(
    groupId: string,
    tables: PMNode[],
    positions: number[],
    originalTable: PMNode,
  ): void {
    this.tableGroups.set(groupId, {
      tables,
      positions,
      originalTable,
    })
  }
}
