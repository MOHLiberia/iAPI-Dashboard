import {useRoute, useRouter} from 'vue-router'
import {ref, watch, onMounted} from 'vue'

interface Breadcrumb {
    path: string
    meta: {
        label?: string
        icon?: string
    }
}

export function useBreadcrumbs() {
    const route = useRoute()
    const router = useRouter()
    const breadcrumbs = ref<Breadcrumb[]>([])

    const updateBreadcrumbs = () => {
        const fullPath = route.path
        const requestPath = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath
        const crumbs = requestPath.split('/')
        let path = ''
        const breadcrumbSet = new Set()

        const resolvedCrumbs: Breadcrumb[] = []

        crumbs.forEach((crumb) => {
            if (crumb) {
                path += `/${crumb}`
                const matched = router.getRoutes().find((r) => r.path === path)

                if (matched && !breadcrumbSet.has(matched.path)) {
                    breadcrumbSet.add(matched.path)
                    resolvedCrumbs.push({
                        path: matched.path,
                        meta: matched.meta || {},
                    })
                }
            }
        })

        // Ensure current route is included
        if (!breadcrumbSet.has(route.path)) {
            resolvedCrumbs.push({
                path: route.path,
                meta: route.meta || {},
            })
        }

        breadcrumbs.value = resolvedCrumbs
    }

    // Safe lifecycle handling
    onMounted(updateBreadcrumbs)
    watch(() => route.path, updateBreadcrumbs)

    return {breadcrumbs}
}
