<template>
  <Navbar />
  <body class="w-full pt-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
    <div class="flex gap-4 flex-wrap justify-around flex-row">
      <!--Inputs -->
      <div class="flex gap-4 justify-around flex-col">
        <div
          class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="fileInput"
              >Upload file</label
            >
            <input
              accept=".csv"
              id="fileInput"
              class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
              @change="handleFileUpload"
            />
          </div>
          <div class="relative mt-4 mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="trackingIdColName"
              >Tracking ID Column Name</label
            >
            <input
              class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="trackingIdColName"
              type="text"
              placeholder="Enter Tracking ID Column Name"
              v-model="trackingIdColName"
            />
            <button
              class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="createSet"
            >
              Confirm
            </button>
          </div>
        </div>
        <div
          class="flex gap-4 flex-col justify-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <div>
            <label for="search" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tracking ID</label>
            <div class="relative mb-4">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                id="search"
                ref="userInputElement"
                placeholder="Enter Tracking ID"
                tabindex="0"
                type="search"
                @keydown.enter="search"
                v-model.trim="userInput"
              />
              <button
                type="submit"
                class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="search"
              >
                Search
              </button>
            </div>
          </div>

          <div class="flex flex-row justify-between items-center">
            <div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="isTableVisible" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show Table</span>
              </label>
            </div>
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="generateTableData"
            >
              Refresh Table
            </button>
          </div>
        </div>
      </div>

      <!--Outputs-->
      <div
        class="max-w-sm p-6 w-72 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        v-show="isResultVisible"
      >
        <h3 class="block mb-2 font-medium text-gray-900 dark:text-white text-2xl text-center">Result</h3>
        <div class="mb-2 font-medium text-gray-900 dark:text-white text-sm text-center">
          <p>{{ resultMessage }}</p>
        </div>

        <div id="lights" class="flex flex-col mt-4 gap-4">
          <div
            v-for="result in results"
            :key="result.bg"
            :class="[
              result.status ? result.bg : '',
              'h-16',
              'border',
              'border-gray-200',
              'rounded-full',
              'shadow',
              'dark:border-gray-700',
            ]"
          ></div>
        </div>
      </div>
    </div>

    <div class="mt-4 relative overflow-x-auto" v-show="isTableVisible">
      <table class="text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Tracking ID</th>
            <th scope="col" class="px-6 py-3">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ row.id }}
            </th>
            <td class="px-6 py-4">{{ row.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</template>

<script setup lang="ts">
import { Navbar } from './components'
import { parse } from 'papaparse'
import { reactive, ref } from 'vue'

const jsonData = ref('')
const userInput = ref('')
const trackingIdColName = ref('Tracking ID')

const userInputElement = ref<HTMLInputElement | null>(null)

const isResultVisible = ref(false)
const resultMessage = ref('')
const isTableVisible = ref(false)
const results = reactive([
  {
    status: false,
    bg: 'bg-red-200',
  },
  {
    status: false,
    bg: 'bg-yellow-500',
  },
  {
    status: false,
    bg: 'bg-green-800',
  },
])
const trackingMap: Map<string, number> = new Map()
const tableData = ref<Record<string, string | number>[]>([])

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parse(file, {
    header: true,
    complete: (results: { data: Record<string, string> }) => {
      jsonData.value = JSON.stringify(results.data)
      createSet()
    },
  })
}

const createSet = () => {
  const data = JSON.parse(jsonData.value)
  data.map((item: Record<string, string>) => trackingMap.set(item[trackingIdColName.value], 0))
}

const search = () => {
  const input = userInput.value
  if (!input) return

  isResultVisible.value = true
  userInput.value = ''
  userInputElement.value?.focus()

  const count = trackingMap.get(input)

  if (count === undefined) {
    resultMessage.value = `${input} Not Found`
    results[1].status = true
  } else if (count >= 1) {
    resultMessage.value = `${input} Duplicate Found`
    results[0].status = true
  } else {
    resultMessage.value = `${input} found`
    results[2].status = true
    trackingMap.set(input, count + 1)
  }

  // Reset all status properties to false except the one that matches the result
  results.forEach(item => {
    item.status = item === results[count === undefined ? 1 : count >= 1 ? 0 : 2]
  })
}

const generateTableData = () => {
  if (isTableVisible.value) {
    tableData.value = []
    trackingMap.forEach((value, key) => {
      if (!value)
        tableData.value.push({
          id: key,
          count: value,
        })
    })
  }
}
</script>
