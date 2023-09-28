<template>
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" :for="inputId">
      {{ label }}
    </label>
    <div class="relative">
      <slot name="icon"></slot>
      <input
        :class="hasIcon ? 'pl-10' : ''"
        class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        :id="inputId"
        type="text"
        :placeholder="placeholder"
        ref="inputElement"
        v-model.trim="input"
        @keydown.enter="handleClick"
      />
      <THButton
        class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        @press="handleClick"
      >
        {{ buttonLabel }}
      </THButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { THButton } from '../components'
import { ref, defineEmits, onMounted } from 'vue'

const { defaultValue, resetAfterConfirm } = defineProps({
  buttonLabel: { type: String, required: true },
  defaultValue: { type: String, required: false, default: '' },
  hasIcon: { type: Boolean, required: false, default: false },
  inputId: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, required: true },
  resetAfterConfirm: { type: Boolean, require: false, default: false },
})

const input = ref('')
const inputElement = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{ (e: 'confirm', value: string): void }>()

const handleClick = () => {
  emit('confirm', input.value)
  if (resetAfterConfirm) input.value = ''
  inputElement.value?.focus()
}

onMounted(() => {
  input.value = defaultValue
})
</script>
