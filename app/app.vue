<script lang="ts" setup>
useHead({
	htmlAttrs: {
		lang: 'en'
	},
	link: [
		{
			rel: 'icon',
			type: 'image/png',
			href: '/favicon.png'
		}
	]
})
</script>

<template>
	<ConfirmDialog></ConfirmDialog>
	<Toast position="bottom-right"/>
	<NuxtLayout class="dark:bg-slate-950 bg-slate-50 h-screen">
		<NuxtPage/>
	</NuxtLayout>
</template>
