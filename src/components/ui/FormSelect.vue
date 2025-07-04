<!-- FormSelect.vue -->

<template>
  <div class="flex flex-col space-y-1 w-full">
    <label class="font-medium text-sm">{{ label }}</label>
    <select
      :value="modelValue"
      :required="required"
      @change="e => emit('update:modelValue', optionValue ? options[e.target.selectedIndex - 1][optionValue] : e.target.value)"
      class="border rounded-lg px-3 py-2 w-full bg-white focus:outline-none focus:ring focus:ring-primary/40">
      <option disabled value="">Selecciona…</option>
      <option v-for="opt in options" :key="opt[optionValue] || opt.id" :value="opt[optionValue] || opt.id">
        {{ opt[optionName] || opt.nombre }}
      </option>
    </select>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  optionName: { type: String, default: 'nombre' },
  optionValue: { type: String, default: 'id' },
  required: Boolean
})
const emit = defineEmits(['update:modelValue'])
</script>