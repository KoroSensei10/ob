<script lang="ts">
    import '../app.css';
    import { registerDefaultPlugins } from '$lib/plugins';
    
    // Register default editor plugins on app initialization
    registerDefaultPlugins();
    
    let {
    	children,
    } = $props();
</script>

{@render children?.()}