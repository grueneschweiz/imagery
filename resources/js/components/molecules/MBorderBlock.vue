<template>
    <div v-if="styleHasBorder" class="form-group">
        <label
            class="mb-0"
            for="border-switch"
        >{{$t('images.create.border')}}</label>
        <div class="custom-control custom-switch">
            <input
                class="custom-control-input"
                id="border-switch"
                type="checkbox"
                v-model="border"
            >
            <label
                class="custom-control-label"
                for="border-switch"
            >{{$t('images.create.borderShow')}}</label>
            <small
                class="d-block"
                v-if="!border"
            >{{$t('images.create.borderNone')}}</small>
        </div>
    </div>
</template>

<script>
    import {Border} from "../../service/canvas/elements/Border";
    import ASelect from "../atoms/ASelect";
    import {mapGetters} from "vuex";
    import {StyleSetTypes} from "../../service/canvas/Constants";

    export default {
        name: "MBorderBlock",
        components: {ASelect},
        data() {
            return {
                block: new Border(),
            }
        },

        computed: {
            ...mapGetters({
                imageHeight: 'canvas/getImageHeight',
                imageWidth: 'canvas/getImageWidth',
                styleSet: 'canvas/getStyleSet',
            }),

            border: {
                get() {
                    return this.$store.getters['canvas/getHasBorder']
                },
                set(val) {
                    this.$store.dispatch('canvas/setHasBorder', val)
                }
            },

            styleHasBorder() {
                return StyleSetTypes.green === this.styleSet
            }
        },

        mounted() {
            this.draw()

            // enable / disable border only in next tick so the border with is
            // calculated and set first, as the placement of the bars depends
            // on it.
            this.$nextTick(() => this.border = this.styleHasBorder)
        },

        methods: {
            draw() {
                this.block.width = this.imageWidth;
                this.block.height = this.imageHeight;
                this.block.border = this.border;
                this.$emit('drawn', this.block.draw());
                this.$store.commit('canvas/setBorderWidth', this.block.borderWidth)
            },
        },

        watch: {
            imageWidth() {
                this.draw();
            },
            imageHeight() {
                this.draw();
            },
            border() {
                this.draw();
            },
            styleSet() {
                this.border = this.styleHasBorder;
            }
        },
    }
</script>

<style scoped>

</style>
