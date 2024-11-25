<script setup lang="ts">
definePageMeta({
  title: 'Dashboard',
})
</script>

<template>
  <div>
    Dashboard
    <NuxtPage/>
    <pre>{{$route}}</pre>
  </div>
</template>