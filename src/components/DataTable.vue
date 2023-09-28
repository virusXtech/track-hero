<template>
  <div class="mt-4 relative overflow-x-auto">
    <table class="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-for="column in columns" :key="column.id" scope="col" class="px-6 py-3">{{ column.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ row.id }}
          </th>
          <td class="px-6 py-4">{{ row.count }}</td>
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
import { PropType } from 'vue'

defineProps({
  columns: {
    type: Object as PropType<
      {
        name: string
        id: string
      }[]
    >,
    required: true,
  },
  rows: {
    type: Object as PropType<Record<string, string | number>[]>,
    required: true,
  },
})
</script>
