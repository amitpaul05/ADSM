<!-- ItemDetail.vue -->
<template>
    <div class="grid-row justify-center mx-auto">
      <h2>This is the Appointment detail page</h2>
      <p>Patient ID: {{ itemId }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  // Define a ref for itemId
  const itemId = ref('');
  
  // Use onMounted to access the itemId
  onMounted(() => {
    console.log(itemId.value); // Access itemId through ref
  });
  
  // Extract itemId from useRoute().params
  const routeParams = useRoute().params;
  itemId.value = routeParams.id;
  </script>