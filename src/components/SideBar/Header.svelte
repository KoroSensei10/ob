<script>
    import { page } from "$app/state";

    let tape = $derived(page.params.tape);

</script>
<div class="bg-gray-900 border-b border-gray-700 p-4 flex items-center gap-2">
    <h2 class="text-xl font-semibold text-gray-100 uppercase tracking-wide">
        Cassette:
    </h2>
    <h3 class="italic">
        {tape}
    </h3>
</div>
