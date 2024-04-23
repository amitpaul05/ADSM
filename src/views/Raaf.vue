<template>
    <nav :class="navClasses">
      <div class="text-6xl">
        Autometic Doctor Serial management
      </div>
    </nav>
    <div class="mx-auto">
        <div v-if="patients.length" class="w-2/3 mx-auto">
            <button class="button bg-slate-500 p-4 rounded-md flex ml-auto mb-7">Start Today's Schedule</button>
            <h2 class="text-2xl font-bold mb-4 text-center">Today's Patients</h2>
            <table class="w-full mx-auto">
                
                <thead>
                    <tr>
                        <th class="py-2 px-4 ">Serial</th>
                        <th class="py-2 px-4 ">Patient Name</th>
                        <th class="py-2 px-4 ">Phone</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patient in patients" :key="patient.id" class="text-center">
                        <td class="py-2 px-4">{{ patient.serial }}</td>
                        <td class="py-2 px-4 ">{{ patient.name }}</td>
                        <td class="py-2 px-4 ">{{ patient.phone }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h1 class="text-center text-4xl">You Do not have any appointment Today</h1>
        </div>
    </div>
    <div class="mx-auto">
        <div v-if="patients.length" class="w-2/3 mx-auto">
            <button class="button bg-slate-500 p-4 rounded-md flex ml-auto mb-7">Start Today's Schedule</button>
            <h2 class="text-2xl font-bold mb-4 text-center">Today's Patients</h2>
            <table class="w-full mx-auto">
                
                <thead>
                    <tr>
                        <th class="py-2 px-4 ">Serial</th>
                        <th class="py-2 px-4 ">Patient Name</th>
                        <th class="py-2 px-4 ">Phone</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patient in patients" :key="patient.id" class="text-center">
                        <td class="py-2 px-4">{{ patient.serial }}</td>
                        <td class="py-2 px-4 ">{{ patient.name }}</td>
                        <td class="py-2 px-4 ">{{ patient.phone }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h1 class="text-center text-4xl">You Do not have any appointment Today</h1>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const isFixed = ref(false);
  
  const handleScroll = () => {
    const navbar = document.querySelector('nav');
    const distance = navbar.offsetTop + navbar.offsetHeight;
  
    isFixed.value = window.pageYOffset >= distance;
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  
  const navClasses = () => {
    return {
      'w-full': true,
      'text-center': true,
      'py-8': true,
      'fixed': isFixed.value,
      'top-0': isFixed.value,
      'bg-white': isFixed.value,
      'shadow-md': isFixed.value,
      'z-10': isFixed.value
    };
  };
  </script>
  
  <style>
  .fixed-transition {
    transition: top 0.3s;
  }
  </style>
  