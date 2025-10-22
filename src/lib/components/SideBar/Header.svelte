<script>
    import { page } from '$app/state';

    let { tape } = $derived(page.params);
</script>

<div class="flex items-center gap-2 px-4 h-12 text-gray-100">
    <h2 class="text-xl font-semibold uppercase tracking-wide">Tape:</h2>
    <h3 class="italic">
        {tape}
    </h3>
</div>
