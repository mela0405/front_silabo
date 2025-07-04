<!-- FormInput.vue -->

<template>
  <div class="flex flex-col space-y-1 w-full">
    <label class="font-medium text-sm">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @input="e => emit('update:modelValue', e.target.value)"
      class="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:ring-primary/40"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean,
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue'])
</script>