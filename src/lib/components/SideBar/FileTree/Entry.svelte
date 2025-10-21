<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type Props = HTMLButtonAttributes & {
        children: Snippet;
        className?: string;
    }
    let {
    	children,
    	className,
    	...props
    }: Props = $props();
</script>


<button
    class="flex gap-2 items-center p-2 md:py-0 text-sm cursor-pointer group relative text-gray-200
            rounded-sm hover:bg-gray-600 hover:border-green-500
            transition-all duration-150 w-full
            {className}"
    {...props}
>
    {@render children()}
</button>
