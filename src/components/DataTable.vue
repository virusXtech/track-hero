<template>
  <div class="mt-4">
    <table class="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            scope="col"
            class="px-6 py-3 text-left text-sm font-semibold"
            :class="{
              'cursor-pointer select-none': header.column.getCanSort(),
            }"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            {{ { asc: ' ↑', desc: '↓' }[header.column.getIsSorted()] }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="whitespace-nowrap text-sm px-6 py-4"
            :class="{
              flex: cell.column.columnDef.enableCopy,
            }"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            <span
              v-if="cell.column.columnDef.enableCopy"
              @click="copyToClipboard(cell.getValue())"
              class="cursor-pointer ml-2"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                  stroke-width="1.5"
                />
                <path
                  opacity="0.5"
                  d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                  stroke-width="1.5"
                />
              </svg>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DataTable',
}
</script>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import type { PropType } from 'vue'
import {
  useVueTable,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/vue-table'
import { TColumn, TData } from '../types'

const props = defineProps({
  rows: {
    type: Array as PropType<TData[]>,
    required: true,
  },
  columns: {
    type: Array as PropType<TColumn[]>,
    required: true,
  },
})
const emits = defineEmits(['copy'])

const { rows, columns } = toRefs(props)

const sorting = ref<SortingState>([])
const filter = ref('')

const table = ref()

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  emits('copy')
}

watch(
  [rows, columns],
  () => {
    table.value = useVueTable({
      data: rows.value,
      columns: columns.value,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        get sorting() {
          return sorting.value
        },
        get globalFilter() {
          return filter.value
        },
      },
      onSortingChange: updaterOrValue => {
        sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
      },
    })
  },
  { immediate: true },
)
</script>
