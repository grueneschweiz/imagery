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
import {mapGetters} from "vuex"
import {Shadow} from "../../service/canvas/elements/Shadow"

export default {
    name: 'MShadowBlock',

    data() {
        return {
            block: new Shadow(),
        }
    },

    computed: {
        ...mapGetters({
            imageHeight: 'canvas/getImageHeight',
            imageWidth: 'canvas/getImageWidth',
        }),

        top: {
            get() {
                return this.$store.getters['canvas/getHasTopShadow']
            },
            set(val) {
                this.$store.dispatch('canvas/setHasTopShadow', val)
                this.draw()
            }
        },

        bottom: {
            get() {
                return this.$store.getters['canvas/getHasBottomShadow']
            },
            set(val) {
                this.$store.dispatch('canvas/setHasBottomShadow', val)
                this.draw()
            }
        },
    },

    mounted() {
        this.draw()
    },

    methods: {
        draw() {
            this.block.top = this.top
            this.block.bottom = this.bottom
            this.block.width = this.imageWidth
            this.block.height = this.imageHeight
            this.$emit('drawn', this.block.draw())
        },
    },

    watch: {
        imageWidth() {
            this.draw();
        },
        imageHeight() {
            this.draw();
        },
    },
}
</script>

<style scoped>

</style>
