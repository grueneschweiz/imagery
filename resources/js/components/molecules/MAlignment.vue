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
                return this.$store.getters['canvas/getBars'].filter(bar => bar.text.length).length > 0
            },

            getStyleSet() {
                return this.$store.getters['canvas/getStyleSet']
            },

            options() {
                if (this.hasBars) {
                    if(this.getStyleSet === 'greenV2' || this.getStyleSet === 'greenV2Centered') {
                        return [
                            {value: Alignments.left, text: this.$t('images.create.barsLeft')},
                            {value: Alignments.center, text: this.$t('images.create.barsCentered')},
                            {value: Alignments.right, text: this.$t('images.create.barsRight')},
                        ];
                    } else {
                        return [
                            {value: Alignments.right, text: this.$t('images.create.barsLeft')},
                            {value: Alignments.left, text: this.$t('images.create.barsRight')},
                        ];
                    }
                } else {
                    return [
                        {value: Alignments.right, text: this.$t('images.create.logoLeft')},
                        {value: Alignments.left, text: this.$t('images.create.logoRight')},
                    ];
                }
            }
        },
        watch: {
            alignment(newVal, oldVal) {
                this.applyCorrectStyleSet(newVal);
            }
        },
        methods: {
            applyCorrectStyleSet(newAlignment) {
                if (this.getStyleSet === 'greenV2' && newAlignment === Alignments.center) {
                    this.$store.commit('canvas/setStyleSet', 'greenV2Centered');
                } else if (this.getStyleSet === 'greenV2Centered' && newAlignment !== Alignments.center) {
                    this.$store.commit('canvas/setStyleSet', 'greenV2');
                }
            }
        }
    }
</script>
