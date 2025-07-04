<!-- FormTextarea.vue -->

<template>
  <div class="flex flex-col space-y-1 w-full">
    <label v-if="label" class="font-medium text-sm">{{ label }}</label>
    <textarea
      :placeholder="placeholder"
      :value="modelValue"
      :rows="rows"
      :required="required"
      @input="e => emit('update:modelValue', e.target.value)"
      class="border rounded-lg px-3 py-2 w-full resize-y min-h-[6rem] focus:outline-none focus:ring focus:ring-primary/40"></textarea>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
  modelValue: String,
  placeholder: String,
  rows: { type: Number, default: 4 },
  required: Boolean
})
const emit = defineEmits(['update:modelValue'])
</script>
