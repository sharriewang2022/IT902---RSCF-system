import React, { useEffect, useState }  from 'react'
import { CategoryType } from "../../util/variableTypes";
import { getCategoryList } from "../../api/categoryApi";
import './index.css'

import {
  Column,
  Table as ReactTable,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  flexRender,
} from '@tanstack/react-table'

function CategoryListView() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo<ColumnDef<CategoryType>[]>(
    () => [
      {
        header: 'Category Base Info',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'CategoryID',
            cell: info => info.getValue(),
            header: () => <span>Category ID</span>,
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.CategoryName,
            id: 'CategoryName',
            cell: info => info.getValue(),
            header: () => <span>Category Name</span>,
            footer: props => props.column.id,
          },
        ],
      },
      {
        header: 'Category Details',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'ParentName',
            header: () => 'ParentName',
            footer: props => props.column.id,
          },
          {
            header: 'More Info',
            columns: [
              {
                accessorKey: 'ManufacturerID',
                header: () => <span>Manufacturer</span>,
                footer: props => props.column.id,
              },
              {
                accessorKey: 'SupplierID',
                header: 'Supplier',
                footer: props => props.column.id,
              },
              {
                accessorKey: 'specs',
                header: 'Remark',
                footer: props => props.column.id,
              },
            ],
          },
        ],
      },
    ],
    []
  )

  const getCategoryTableData = async () => {    
    var categoryList = await getCategoryList();
    setData(categoryList);
  }

  useEffect(() => {
    getCategoryTableData()  
  }, []);

  const [data, setData] = useState<any>(getCategoryList());
 
  const refreshData = async () => {    
    var categoryList = await getCategoryList();
    setData(categoryList);
  }

  return (
    <>
      <Table
        {...{
          data,
          columns,
        }}
      />
      <hr />
      <div>
        <button className="btn btn-primary buttonMargin" onClick={() => rerender()}>Force Rerender</button>
        <button className="btn btn-primary" onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </>
  )
}

function Table({
  data,
  columns,
}: {
  data: any
  columns: ColumnDef<CategoryType>[]
}) {
  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    
    debugTable: true,
  })

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </div>
  )
}
function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: ReactTable<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}
 
export default CategoryListView;

 