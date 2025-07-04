<!-- FormSplitInput.vue -->

<template>
  <div class="flex flex-col space-y-1 w-full">
    <label class="font-medium text-sm">{{ label }}</label>
    <div class="flex gap-2">
      <input type="number" min="0"
             :value="teoria"
             @input="e => emit('update:teoria', Number(e.target.value))"
             placeholder="Teoría"
             class="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:ring-primary/40" />
      <input type="number" min="0"
             :value="practica"
             @input="e => emit('update:practica', Number(e.target.value))"
             placeholder="Práctica"
             class="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:ring-primary/40" />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
  teoria: [String, Number],
  practica: [String, Number]
})
const emit = defineEmits(['update:teoria', 'update:practica'])
</script>
