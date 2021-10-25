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
import {ColorSchemes, StyleSetTypes} from "../../service/canvas/Constants";
    import AButtonGroup from "../atoms/AButtonGroup";

    export default {
        name: 'MColorScheme',
        components: {AButtonGroup},
        data() {
            return {
                schemes: ColorSchemes,
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
            },

            styleSet() {
                return this.$store.getters['canvas/getStyleSet']
            },

            options() {
                const options = [
                  {value: ColorSchemes.white, text: this.$t('images.create.white')},
                  {value: ColorSchemes.green, text: this.$t('images.create.green')},
                ]

                if (StyleSetTypes.green === this.styleSet) {
                    options.push(
                        {value: ColorSchemes.greengreen, text: this.$t('images.create.greengreen')}
                    );
                }

                return options
            }
        },

        watch: {
            styleSet() {
                if (StyleSetTypes.young === this.styleSet
                    && ColorSchemes.greengreen === this.scheme) {
                    this.scheme = ColorSchemes.green
                }
            }
        },
    }
</script>
