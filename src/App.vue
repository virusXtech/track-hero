<template>
  <Navbar />
  <Notification :notification="notification.text" :show="notification.visible" @hide="handleHideNotification" />
  <MainContainer>
    <div class="flex gap-4 flex-wrap justify-around flex-row">
      <!--Inputs -->
      <div class="flex gap-4 justify-around flex-col">
        <Card class="flex gap-4 justify-around flex-col">
          <FileUpload accepted-file-formats=".csv" @on-file-upload="handleFileUpload" />
          <InputWithButton
            button-label="Confirm"
            default-value="Tracking ID"
            input-id="trackingIdColName"
            label="Tracking ID Column Name"
            placeholder="Enter Tracking ID Column Name"
            @confirm="createSet"
          />
        </Card>

        <Card>
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
              <div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="isTableVisible" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show Table</span>
                </label>
              </div>
              <THButton @press="generateTableData">Refresh Table</THButton>
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

    <DataTable
      :columns="[
        { name: 'Tracking Id', id: 'trackingId' },
        { name: 'Count', id: 'count' },
      ]"
      :rows="tableData"
      v-show="isTableVisible"
      class="flex justify-center items-center mt-8"
    />
  </MainContainer>
</template>

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

const jsonData = ref('')
const trackingIdColName = ref('Tracking ID')

const isResultVisible = ref(false)
const resultMessage = ref('')
const isTableVisible = ref(false)
const tableData = ref<Record<string, string | number>[]>([])
const totalIds = ref(0)
const scannedIds = ref(0)

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

const trackingMap: Map<string, number> = new Map()

const handleHideNotification = () => {
  notification.text = ''
  notification.visible = false
}

const handleFileUpload = (file: File) => {
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
  const data = JSON.parse(jsonData.value) as Record<string, string>[]

  totalIds.value = data.length
  notification.text = `${totalIds.value} Tracking ID Found`
  notification.visible = true

  data.map(item => trackingMap.set(item[trackingIdColName.value], 0))
}

const search = (input: string) => {
  if (!input) return

  isResultVisible.value = true

  const count = trackingMap.get(input)

  if (count === undefined) {
    resultMessage.value = `${input} Not Found`
    results[0].status = true
  } else if (count >= 1) {
    resultMessage.value = `${input} Duplicate Found`
    results[1].status = true
  } else {
    resultMessage.value = `${input} found`
    results[2].status = true
    trackingMap.set(input, count + 1)
    scannedIds.value += 1
  }

  // Reset all status properties to false except the one that matches the result
  results.forEach(item => {
    item.status = item === results[count === undefined ? 0 : count >= 1 ? 1 : 2]
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
