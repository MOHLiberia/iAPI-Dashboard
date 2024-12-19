<script setup lang="ts">
defineEmits(['openSideMenu', 'openMobileMenu'])

</script>

<template>
  <header class="dark:border-slate-800 border-b flex justify-between items-center p-2 w-full">
    <div class="flex items-center gap-2">
      <div class="hidden lg:block">
        <Button variant="text" severity="contrast" @click="$emit('openSideMenu')" class="!p-1">
          <Icon name="tabler:menu-2" size="1.5em"/>
        </Button>
      </div>
      <nuxt-link to="/" class="flex items-center gap-2">
        <img src="~/assets/images/moh-logo.svg" alt="MOH Logo" class="h-12"/>
        <div class="text-sm">
          <p>Interoperability API</p>
          <p>Dashboard</p>
        </div>
      </nuxt-link>
    </div>
    <div class="flex gap-2 items-center">
      <DarkModeToggle/>
      <ProfileMenu/>
      <MobileMenu/>
    </div>
  </header>
</template>

<style scoped>

</style>