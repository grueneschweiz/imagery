<template>
    <div class="form-group">
        <span
            class="mb-0"
        >{{ $t('images.create.shadow') }}</span>
        <div class="custom-control custom-switch">
            <input
                id="shadow-top-switch"
                v-model="top"
                class="custom-control-input"
                type="checkbox"
            >
            <label
                class="custom-control-label"
                for="shadow-top-switch"
            >{{ $t('images.create.shadowTop') }}</label>
        </div>
        <div class="custom-control custom-switch">
            <input
                id="shadow-bottom-switch"
                v-model="bottom"
                class="custom-control-input"
                type="checkbox"
            >
            <label
                class="custom-control-label"
                for="shadow-bottom-switch"
            >{{ $t('images.create.shadowBottom') }}</label>
        </div>
    </div>
</template>

<script>

export default {
    name: 'MShadowBlock',

    computed: {
        top: {
            get() {
                return this.$store.getters['canvas/getHasTopShadow']
            },
            set(val) {
                this.$store.dispatch('canvas/setHasTopShadow', val)
            }
        },

        bottom: {
            get() {
                return this.$store.getters['canvas/getHasBottomShadow']
            },
            set(val) {
                this.$store.dispatch('canvas/setHasBottomShadow', val)
            }
        },
    },
}
</script>

<style scoped>

</style>
