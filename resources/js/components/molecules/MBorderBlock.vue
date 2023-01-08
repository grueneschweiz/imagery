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
    import ASelect from "../atoms/ASelect";
    import {mapGetters} from "vuex";
    import {StyleSetTypes} from "../../service/canvas/Constants";

    export default {
        name: "MBorderBlock",
        components: {ASelect},

        computed: {
            ...mapGetters({
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

        watch: {
            styleSet() {
                this.border = this.styleHasBorder;
            }
        },
    }
</script>

<style scoped>

</style>
