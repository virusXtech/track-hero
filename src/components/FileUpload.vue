<template>
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="fileInput">Upload file</label>
    <input
      :accept="acceptedFileFormats"
      id="fileInput"
      class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      type="file"
      @change="handleFileUpload"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FileUpload',
}
</script>

<script setup lang="ts">
defineProps({
  acceptedFileFormats: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'onFileUpload', file: File): void
}>()

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  emit('onFileUpload', file)
}
</script>
