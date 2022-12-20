<template>
    <AButtonGroup
        :options="options"
        :title="$t('images.create.layout')"
        @input="$emit('input', $event)"
        class="form-group"
        v-model="alignment"
    ></AButtonGroup>
</template>
<script>
    import {Alignments} from "../../service/canvas/Constants";
    import AButtonGroup from "../atoms/AButtonGroup";

    export default {
        name: 'MAlignment',
        components: {AButtonGroup},
        computed: {
            alignment: {
                get() {
                    return this.$store.getters['canvas/getAlignment']
                },
                set(value) {
                    this.$store.commit('canvas/setAlignment', value)
                }
            },

            hasBars() {
                return this.$store.getters['canvas/hasBars']
            },

            options() {
                if (this.hasBars) {
                    return [
                        {value: Alignments.left, text: this.$t('images.create.barsLeft')},
                        {value: Alignments.right, text: this.$t('images.create.barsRight')},
                    ];
                } else {
                    return [
                        {value: Alignments.right, text: this.$t('images.create.logoLeft')},
                        {value: Alignments.left, text: this.$t('images.create.logoRight')},
                    ];
                }
            }
        }
    }
</script>
