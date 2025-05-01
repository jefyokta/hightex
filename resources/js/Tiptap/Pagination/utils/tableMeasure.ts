import { Fragment, Node as PMNode, Schema } from '@tiptap/pm/model'
import { EditorState, Transaction } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

import { NodePosArray } from '../types/node'

import { TableMeasurement,TableGroup,TableSplitResult,TableMapping } from '../types/table'
import { Provider } from '@/Provider'
export class TableHandler {
    private static instance: TableHandler
    private measurementCache = new Map<string, TableMeasurement>()
    private static tableGroups = Provider.tableGroups()
    private rowMinHeight = 20.5;
    private captionMinHeight = 24;

    static getInstance(): TableHandler {
      if (!this.instance) {
        this.instance = new TableHandler()
      }
      return this.instance
    }

    private getTableCacheKey(node: PMNode): string {
      return `${node.attrs.figureId}-${node.content.size}-${JSON.stringify(node.toJSON())}`
    }

    measureTable(node: PMNode, view: EditorView): TableMeasurement {
      const cacheKey = this.getTableCacheKey(node)
      const cached = this.measurementCache.get(cacheKey)
      if (cached) return cached

      let table = node.child(0)
      let caption: PMNode | undefined = undefined
      let captionHeight = 0

      if (node.type.name === 'figureTable') {
        caption = node.child(0)
        table = node.child(1)
        captionHeight = this.measureCaption(caption, view)
      }

      const rows = table.content.content
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
        totalHeight: (cumulativeHeights[cumulativeHeights.length - 1] ?? 0) + captionHeight,
        breakPoints: [],
        cumulativeHeights,
        captionHeight,
      }

      if (measurement.totalHeight > 0) {
        this.measurementCache.set(cacheKey, measurement)
      }

      return measurement
    }

    splitTableAtHeight(
      node: PMNode,
      availableHeight: number,
      measurement: TableMeasurement,
      schema: EditorState['schema'],
      pageHeight: number,
      view: EditorView
    ): TableSplitResult {
      const figureAttrs = node.attrs
      const caption = node.child(0)
      const table = node.child(1)

      availableHeight -= this.measureCaption(caption, view)

      const rows = table.content.content.filter(c => c.type.name ==='tableRow')
      const headerRowCount = this.getHeaderRowCount(table)

      const tables: PMNode[] = []
      let mapping: { from: number; to: number }[] = []

      const groupId = figureAttrs.groupId || `table-group-${Date.now()}`

      if (measurement.totalHeight <= availableHeight) {
        const newTable = schema.nodes.table.create({ ...table.attrs, groupId }, table.content)
        const figure = schema.nodes.figureTable.create({ ...figureAttrs, groupId }, [caption, newTable])
        return { tables: [figure], mapping: [], groupId }
      }

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
      const firstTable = schema.nodes.table.create({ ...table.attrs}, Fragment.fromArray(firstRows))
      const firstFigure = schema.nodes.figureTable.create({ ...figureAttrs, groupId }, Fragment.fromArray([caption,firstTable]))
      tables.push(firstFigure)

      if (splitIndex < rows.length) {
        const remainingRows = [ ...rows.slice(splitIndex)]
        // const remainingRows = [...rows.slice(0, headerRowCount), ...rows.slice(splitIndex)]
        const remainingTable = schema.nodes.table.create({ ...table.attrs}, Fragment.fromArray(remainingRows))
        const remainingFigure = schema.nodes.splittedTable.create({ groupId }, remainingTable)

        tables.push(remainingFigure)
      }

      const originalFigure = figureAttrs.groupId
        ? TableHandler.tableGroups.get(figureAttrs.groupId)?.originalTable || node
        : node

      TableHandler.tableGroups.set(groupId, {
        tables,
        originalTable: originalFigure,
        positions: [],
      })

      return { tables, mapping, groupId }
    }

    private measureRowHeights(rows: readonly PMNode[], view: EditorView): number[] {
      return rows.map(row => {
        let height = 0
        view.state.doc.descendants((node, pos) => {
          if (node === row) {
            const domNode = view.nodeDOM(pos) as HTMLElement | null
            if (domNode) {
              height = domNode.offsetHeight
            }
            return false
          }
          return true
        })
        return height || this.rowMinHeight
      })
    }

    private measureCaption(node: PMNode, view: EditorView): number {
      let pos: number | undefined = undefined
      view.state.doc.descendants((n, p) => {
        if (node === n) {
          pos = p
          return false
        }
        return true
      })

      if (pos != null) {
        const dom = view.nodeDOM(pos) as HTMLElement | null
        console.log(dom?.getBoundingClientRect())
        if (dom) return dom.getBoundingClientRect().height || this.captionMinHeight
      }
      return this.captionMinHeight
    }

    private getHeaderRowCount(node: PMNode): number {
      let count = 0
      node.content.content.forEach(row => {
        if (row.child(0) && row.child(0)?.type.name === 'tableHeader') {
          count++
        }

      })
      return count || 1
    }

    handleTableOperation(
      tr: Transaction,
      pos: number,
      operation: (table: PMNode) => PMNode
    ): Transaction {
        const table = tr.doc.nodeAt(pos)
        console.log("tablesdsad",table)
      if (!table || (table.type.name !== 'figureTable' || 'splittedTable')) return tr

      const group = this.getTableGroup(table)
      const updatedTable = operation(table)
      tr = tr.replaceWith(pos, pos + table.nodeSize, updatedTable)

      if (group) {
        group.positions.forEach(groupPos => {
          if (groupPos !== pos) {
            const otherTable = tr.doc.nodeAt(groupPos)
            if (otherTable) {
              const updatedOtherTable = operation(otherTable)
              tr = tr.replaceWith(groupPos, groupPos + otherTable.nodeSize, updatedOtherTable)
            }
          }
        })
      }

      return tr
    }

    mergeTableGroup(
      groupId: string,
      contentNodes: NodePosArray,
      schema:Schema
    ): PMNode | undefined {
      const tableNodes = contentNodes.filter(({ node }) =>
        node.attrs.groupId === groupId &&
        (node.type.name === 'figureTable' || node.type.name === 'splittedTable')
      )

      if (!tableNodes.length) return undefined
      const group = TableHandler.tableGroups.get(groupId)
      if (!group?.tables.length) return undefined

      const allRows = tableNodes.reduce((rows, { node }, index) => {
        const tableNode = node.type.name === 'figureTable'
          ? node.child(1)
          : node.child(0)

        const tableRows = tableNode.content.content
        return [...rows, ...tableRows]
      }, [] as PMNode[])


      return group.originalTable.type.create(
        { ...group.originalTable.attrs, groupId },

        // [tableNodes.filter(r=>r.node.type.name ==='splittedTable')[0].node ,schema.nodes.table.create({},allRows)]
        [group.originalTable.content.content[0] ,schema.nodes.table.create({},allRows)]
      )
    }

    getTableGroup(table: PMNode): TableGroup | undefined {
      if (!table.attrs.groupId) return undefined
      return TableHandler.tableGroups.get(table.attrs.groupId)
    }

    trackTableGroup(
      groupId: string,
      tables: PMNode[],
      positions: number[],
      originalTable: PMNode,
    ): void {
      TableHandler.tableGroups.set(groupId, {
        tables,
        positions,
        originalTable,
      })
    }

    static getTableGroups(){

        return this.tableGroups
    }
  }
