<template>
    <div class="form-group">
        <label class="mb-0 d-block">{{$t('images.create.styleSet')}}</label>
        <div class="btn-group btn-group-toggle">
            <label :class="{'active': type === types.green}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="type"
                    :value="types.green"
                    name="background"
                    type="radio"
                >{{$t('images.create.styleSetGreen')}}
            </label>
            <label :class="{'active': type === types.young}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="type"
                    :value="types.young"
                    name="background"
                    type="radio"
                >{{$t('images.create.styleSetYoung')}}
            </label>
        </div>
    </div>
</template>

<script>
    import {StyleSetTypes} from "../../service/canvas/Constants";

    export default {
        name: "MStyleSetBlock",

        data() {
            return {
                types: StyleSetTypes,
            }
        },

        computed: {
            type: {
                get() {
                    return this.$store.getters['canvas/getStyleSet'];
                },
                set(value) {
                    return this.$store.commit('canvas/setStyleSet', value);
                },
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>
