<script setup lang="ts">

</script>


<template>
  <div class="flex flex-col h-screen">
    <AuthHeader/>
    <div class="flex-1 flex flex-col items-center justify-center p-3 md:px-0">
      <slot/>
    </div>
    <AuthFooter/>
  </div>
</template>