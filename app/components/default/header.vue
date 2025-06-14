<script lang="ts" setup>
defineEmits(['openSideMenu', 'openMobileMenu'])

</script>

<template>
	<header class="dark:border-slate-800 border-b flex justify-between items-center p-2 w-full">
		<div class="flex items-center gap-2">
			<div class="hidden lg:block">
				<Button class="!p-1" severity="contrast" variant="text" @click="$emit('openSideMenu')">
					<Icon name="tabler:menu-2" size="1.5em"/>
				</Button>
			</div>
			<nuxt-link class="flex items-center gap-2" to="/">
				<img alt="MOH Logo" class="h-12" src="~/assets/images/moh-logo.svg"/>
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