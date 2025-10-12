<script lang="ts">
    import FileTreeComp from "./FileTreeComp.svelte";
    import type { Snippet } from "svelte";

    type Props = {
        header?: Snippet;
        bottom?: Snippet;
        className?: string;
    };
    let {
        header,
        bottom,
        className
    }: Props = $props();
</script>
<!-- <span class="py-4">
    <Header />
</span> -->
<span class={[
    "overflow-auto overscroll-none flex flex-col justify-between",
    className ?? "",
]}>
    <div class="">
        {@render header?.()}
        <FileTreeComp />
    </div>
    {@render bottom?.()}
</span>
