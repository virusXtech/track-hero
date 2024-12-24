export type TData = {
  'Order Id': string
  'SKU': string
  'Tracking ID': string
  'count': number
}

export type TColumn = {
  id: string
  header: string
  accessorKey: string
  enableSorting?: boolean
  enableCopy?: boolean
}
