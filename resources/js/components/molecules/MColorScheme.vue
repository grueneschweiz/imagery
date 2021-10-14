<template>
    <div class="form-group">
        <AButtonGroup
            :options="options"
            :title="$t('images.create.colorScheme')"
            v-model="scheme"
        ></AButtonGroup>
        <small v-if="scheme === schemes.greengreen"
        >{{$t('images.create.greengreenWarning')}}</small>
    </div>
</template>
<script>
    import {ColorSchemes} from "../../service/canvas/Constants";
    import AButtonGroup from "../atoms/AButtonGroup";

    export default {
        name: 'MColorScheme',
        components: {AButtonGroup},
        data() {
            return {
                schemes: ColorSchemes,
                options: [
                    {value: ColorSchemes.white, text: this.$t('images.create.white')},
                    {value: ColorSchemes.green, text: this.$t('images.create.green')},
                    {value: ColorSchemes.greengreen, text: this.$t('images.create.greengreen')},
                ],
            }
        },
        computed: {
            scheme: {
                get() {
                    return this.$store.getters['canvas/getColorSchema']
                },
                set(val) {
                    this.$store.dispatch('canvas/setColorSchema', val)
                }
            }
        },
    }
</script>
