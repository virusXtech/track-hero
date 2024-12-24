<template>
  <Navbar />
  <Notification :notification="notification.text" :show="notification.visible" @hide="handleHideNotification" />
  <MainContainer>
    <section id="home" class="flex items-center justify-center h-screen">
      <div class="flex gap-4 flex-wrap justify-between flex-row">
        <!--Inputs -->
        <div class="flex gap-4 justify-center flex-col">
          <Card class="flex gap-4 justify-around flex-col">
            <FileUpload accepted-file-formats=".csv" @on-file-upload="handleFileUpload" />
          </Card>

          <Card v-show="rows.length">
            <div class="flex gap-4 flex-col justify-center">
              <InputWithButton
                button-label="Search"
                input-id="trackingId"
                :has-icon="true"
                label="Tracking ID"
                placeholder="Enter Tracking ID"
                :reset-after-confirm="true"
                @confirm="search"
              >
                <template #icon>
                  <SearchIcon />
                </template>
              </InputWithButton>
              <div class="flex flex-row justify-between items-center">
                <THButton @press="scrollToTable">View Table</THButton>
              </div>
            </div>
          </Card>
        </div>

        <!--Outputs-->
        <Card v-show="isResultVisible" class="w-72 flex flex-col mt-4 gap-4">
          <div>
            <Typography class="text-2xl">Result</Typography>
            <Typography>{{ resultMessage }}</Typography>
          </div>

          <div id="lights" class="flex flex-col mt-4 gap-4">
            <div
              v-for="result in results"
              :key="result.bg"
              :class="[result.status ? result.bg : '']"
              class="h-16 border border-gray-200 rounded-full shadow dark:border-gray-700"
            ></div>
          </div>

          <div>
            <Typography class="text-2xl">Progress</Typography>
            <Typography>{{ scannedIds }} / {{ totalIds }}</Typography>
          </div>
        </Card>
      </div>
    </section>

    <section id="table" v-show="rows.length">
      <DataTable
        :columns="columns"
        :rows="rows"
        class="flex justify-center items-center"
        @copy="toast('Copied to clipboard')"
      />
    </section>
  </MainContainer>
</template>

<script lang="ts">
const trackingIdColName = 'Tracking ID'
const orderIdColName = 'Order Id'
const skuColName = 'SKU'

const columns: TColumn[] = [
  {
    id: 'trackingId',
    header: 'Tracking ID',
    accessorKey: trackingIdColName,
    enableSorting: true,
  },
  {
    id: 'orderId',
    header: 'Order Id',
    accessorKey: orderIdColName,
    enableSorting: true,
    enableCopy: true,
  },
  {
    id: 'sku',
    header: 'SKU',
    accessorKey: skuColName,
    enableSorting: true,
  },
  {
    id: 'count',
    header: 'Count',
    accessorKey: 'count',
    enableSorting: true,
  },
]
</script>

<script setup lang="ts">
import {
  Card,
  DataTable,
  FileUpload,
  InputWithButton,
  MainContainer,
  Navbar,
  Notification,
  SearchIcon,
  THButton,
  Typography,
} from './components'
import { parse } from 'papaparse'
import { reactive, ref } from 'vue'
import PositiveAudio from './assets/positive.wav'
import DuplicateAudio from './assets/duplicate.wav'
import NotFoundAudio from './assets/not-found.wav'
import { TColumn, TData } from './types'

const isResultVisible = ref(false)
const resultMessage = ref('')
const totalIds = ref(0)
const scannedIds = ref(0)

const tableData = ref<Record<string, TData>>({})
const rows = ref<TData[]>([])
const notification = reactive({
  visible: false,
  text: '',
})
const results = reactive([
  {
    status: false,
    bg: 'bg-red-600',
  },
  {
    status: false,
    bg: 'bg-yellow-300',
  },
  {
    status: false,
    bg: 'bg-green-500',
  },
])

const handleHideNotification = () => {
  notification.text = ''
  notification.visible = false
}

const handleFileUpload = (file: File) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parse(file, {
    header: true,
    complete: (results: { data: Record<string, string>[] }) => {
      initializeProcess(results.data)
    },
  })
}

const initializeProcess = (excelData: Record<string, string>[]) => {
  for (const row of excelData) {
    if (row[trackingIdColName] === undefined) {
      continue
    }
    tableData.value[row[trackingIdColName]] = {
      [trackingIdColName]: row[trackingIdColName],
      [orderIdColName]: row[orderIdColName],
      [skuColName]: row[skuColName],
      count: 0,
    }
  }

  rows.value = Object.values(tableData.value) as TData[]

  totalIds.value = Object.keys(tableData.value).length
  scannedIds.value = 0

  isResultVisible.value = false

  results.forEach(item => (item.status = false))
  toast('File Uploaded Successfully')
}

const toast = (message: string) => {
  notification.text = message
  notification.visible = true
}

const search = (userInput: string) => {
  if (!userInput) return

  isResultVisible.value = true

  const row = tableData.value[userInput]

  results.forEach(item => (item.status = false))

  if (row === undefined) {
    resultMessage.value = `${userInput} Not Found`
    results[0].status = true
    new Audio(NotFoundAudio).play()
  } else if (row.count >= 1) {
    resultMessage.value = `${userInput} Duplicate Found`
    results[1].status = true
    new Audio(DuplicateAudio).play()
  } else {
    resultMessage.value = `${userInput} found`
    results[2].status = true
    scannedIds.value += 1
    row.count += 1
    tableData.value[userInput] = row
    new Audio(PositiveAudio).play()
  }

  rows.value = Object.values(tableData.value) as TData[]
}

const scrollToTable = () => {
  document.getElementById('table')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
