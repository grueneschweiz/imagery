<template>
    <div>
        <div class="form-group">
            <label
                class="mb-0"
                for="font-size"
            >{{$t('images.create.fontSize')}}</label>
            <input
                v-model.number="fontSizePercent"
                :disabled="!textFitsImage"
                :max="100"
                class="form-control-range"
                id="font-size"
                step="1"
                type="range"
                :min="1"
            >
        </div>

        <div class="form-group">
            <label
                class="mb-0"
            >{{$t('images.create.bars')}}</label>

            <ABar
                v-for="idx in bars.keys()"
                :key="idx"
                :index="idx"
            />

            <button
                :class="buttonClassSubline"
                v-if="showAddSublineBtn"
                class="btn"
                @click="addSubline"
            >{{$t('images.create.sublineAdd')}}
            </button>

            <div v-if="!textFitsImage" class="alert alert-warning" role="alert">
                {{$t('images.create.tooMuchText')}}
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {
        BarSchemes,
        BarTypes,
        ColorSchemes,
        StyleSetTypes
    } from "../../service/canvas/Constants";
    import ABar from "../atoms/ABar";

    export default {
        name: "MBarBlock",
        components: {ABar},

        data() {
            return {
                fontSizePercentBeforeReset: 0,
            }
        },

        computed: {
            ...mapGetters({
                styleSet: 'canvas/getStyleSet',
                alignment: 'canvas/getAlignment',
                colorSchema: 'canvas/getColorSchema',
                bars: 'canvas/getBars',
                textFitsImage: 'canvas/getTextFitsImage',
            }),

            fontSizePercent: {
                get() {
                    return this.$store.getters['canvas/getFontSizePercent']
                },
                set(val) {
                    if (val > 0) {
                        this.$store.dispatch('canvas/setFontSizePercent', val)
                    }
                }
            },

            buttonClassSubline() {
                switch (this.colorSchema) {
                    case ColorSchemes.white:
                        return 'btn-outline-dark'
                    case ColorSchemes.greengreen:
                        return 'btn-secondary'
                    default:
                        return 'btn-outline-secondary'
                }
            },

            showAddSublineBtn() {
                return this.bars
                    .filter(bar => bar.type === BarTypes.subline)
                    .length === 0
            },

            sublineSchema() {
                if (this.styleSet === StyleSetTypes.young) {
                    return BarSchemes.transparent
                }

                return ColorSchemes.greengreen === this.colorSchema
                    ? BarSchemes.green
                    : BarSchemes.white
            },
        },

        mounted() {
            this.maybeRemoveSubline()
        },

        methods: {
            addSubline() {
                const subline = {
                    type: BarTypes.subline,
                    schema: this.sublineSchema,
                    text: 'Subline',
                    canvas: null,
                    padding: 0,
                }

                this.$store.dispatch(
                    'canvas/addBar',
                    {index: this.bars.length, bar: subline}
                )
            },

            maybeRemoveSubline() {
                // remove sublines for style set young
                if (this.styleSet === StyleSetTypes.young) {
                    this.bars.forEach((bar, idx) => {
                        if (bar.type === BarTypes.subline && 'Subline' === bar.text) {
                            this.$store.dispatch('canvas/removeBar', {index: idx})
                        }
                    })
                }
            },

            maybeRemoveHeadline() {
                // remove third headline for style set young
                if (this.styleSet === StyleSetTypes.young) {
                    // remove first primary headline if there are two
                    const primaryHeadlines = this.bars.filter(
                        bar => bar.type === BarTypes.headline
                            && (bar.schema === BarSchemes.white || bar.schema === BarSchemes.green)
                    );
                    if (primaryHeadlines.length > 1) {
                        this.$store.commit('canvas/removeBar', {index: 0})
                    }

                    // remove first secondary headline if there are two
                    const secondaryHeadlines = this.bars.filter(
                        bar => bar.type === BarTypes.headline
                            && (bar.schema === BarSchemes.magenta)
                    );
                    if (secondaryHeadlines.length > 1) {
                        this.$store.commit('canvas/removeBar', {index: 1})
                    }
                }
            }
        },

        watch: {
            styleSet() {
                this.maybeRemoveSubline()
                this.maybeRemoveHeadline()
            },
            textFitsImage(val) {
                if (!val) {
                    this.fontSizePercentBeforeReset = this.fontSizePercent
                    this.fontSizePercent = 1
                } else {
                    this.fontSizePercent = this.fontSizePercentBeforeReset
                }
            },
        }
    }
</script>

<style scoped>

</style>
