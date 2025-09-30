<script lang="ts">
    type Props = {
        textWidth?: number;
        delay?: number;
        className?: string;
    };

    let {
        textWidth = 120,
        delay = 0,
        className = ""
    }: Props = $props();

    const delays = [0, 75, 150, 300, 500, 700];
    const classes = ["", "delay-75", "delay-150", "delay-300", "delay-500", "delay-700"];

    // Fonction pour générer les classes de délai
    function getDelayClass(delay: number) {
        const index = delays.indexOf(delay);
        return index !== -1 ? classes[index] : "";
    }
</script>

<div class="animate-pulse {getDelayClass(delay)} {className}">
    <div class="flex gap-2 items-center px-2 py-1 rounded-sm">
        <div class="w-4 h-4 bg-gray-600 rounded"></div>
        <div class="h-4 bg-gray-600 rounded flex-1" style="max-width: {textWidth}px"></div>
    </div>
</div>