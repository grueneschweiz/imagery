<template>
    <div>
        <div class="input number">
            <label
                class="mt-2 mb-0"
            >{{ label }}</label>
            <input :disabled="disabled"
                   :max="maxSize"
                   :min="minSize"
                   class="form-control"
                   step="1"
                   type="number"
                   v-bind:value="value"
                   @input="$emit('input', $event.target.value)">
        </div>
    </div>
</template>
<script>
export default {
    name: 'AImageSize',
    props: {
        value: {
            type: Number,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: true,
        },
        maxSize: {
            type: Number,
            required: true,
        },
        minSize: {
            type: Number,
            required: true,
        },
        label: {
            type: String,
            required: true
        }
    }
}
</script>
