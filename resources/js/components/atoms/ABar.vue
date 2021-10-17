<template>
    <div class="container-fluid mb-1">
        <div class="row">
            <input
                :class="inputClass"
                class="form-control col"
                type="text"
                v-model="text"
            />
            <button
                :class="buttonClass"
                :title="$t('images.create.barAdd')"
                :disabled="!cloneable"
                class="btn ml-1"
                @click="clone"><i class="mdi mdi-add"></i></button>
            <button
                :class="buttonClass"
                :title="$t('images.create.barRemove')"
                :disabled="!deletable"
                class="btn ml-1"
                @click="remove"><i class="mdi mdi-remove"></i></button>
        </div>
    </div>
</template>

<script>
    import SnackbarMixin from "../../mixins/SnackbarMixin";
    import {
        BarTypes as Types,
        BarSchemes,
        BarTypes,
        ColorSchemes, StyleSetTypes
    } from "../../service/canvas/Constants";
    import FontFaceObserver from "fontfaceobserver";
    import CanvasItemFactoryMixin from "../../mixins/CanvasItemFactoryMixin";
    import {mapGetters} from "vuex";

    const sublineHeadlineSizeRatio = 0.4;

    export default {
        name: "ABar",
        mixins: [SnackbarMixin, CanvasItemFactoryMixin],

        data() {
            return {
                drawObj: this.createBar(),
            }
        },

        props: {
            index: {
                required: true,
                type: Number
            },
        },

        computed: {
            ...mapGetters({
                styleSet: 'canvas/getStyleSet',
                alignment: 'canvas/getAlignment',
                imageWidth: 'canvas/getImageWidth',
                baseFontSize: 'canvas/getFontSize',
                bars: 'canvas/getBars',
                colorSchema: 'canvas/getColorSchema'
            }),

            bar() {
                return this.bars[this.index]
            },

            text: {
                get() {
                    return this.bar.text
                },
                set(val) {
                    this.$set(this.bar, 'text', val)
                    this.draw()
                }
            },

            fontSize() {
                if (this.bar.type === Types.headline) {
                    return this.baseFontSize;
                } else {
                    return this.baseFontSize * sublineHeadlineSizeRatio;
                }
            },

            barSchema() {
                if (BarSchemes.magenta === this.bar.schema) {
                    return this.bar.schema
                }

                if (BarTypes.headline === this.bar.type) {
                    return ColorSchemes.white === this.colorSchema
                        ? BarSchemes.white
                        : BarSchemes.green
                }

                if (BarTypes.subline === this.bar.type) {
                    if (StyleSetTypes.young === this.styleSet) {
                        return BarSchemes.transparent
                    }

                    return ColorSchemes.greengreen === this.colorSchema
                        ? BarSchemes.green
                        : BarSchemes.white
                }

                return BarSchemes.green
            },

            buttonClass() {
                switch (this.barSchema) {
                    case BarSchemes.green:
                        return 'btn-secondary'

                    case BarSchemes.magenta:
                        return this.colorSchema === ColorSchemes.white
                            ? 'btn-outline-primary'
                            : 'btn-primary'

                    case BarSchemes.white:
                        return 'btn-outline-secondary'

                    case BarSchemes.transparent:
                        return 'btn-outline-dark'
                }
            },

            inputClass() {
                switch (this.barSchema) {
                    case BarSchemes.magenta:
                        return 'magenta'

                    case BarSchemes.transparent:
                        return 'dark'

                    default:
                        return 'green'
                }
            },

            cloneable() {
                if (this.bar.type === BarTypes.headline) {
                    return this.bars
                        .filter(bar => bar.type === BarTypes.headline)
                        .length < 3
                }
                if (this.bar.type === BarTypes.subline) {
                    return this.bars
                        .filter(bar => bar.type === BarTypes.subline)
                        .length < 2
                }
                return false
            },

            deletable() {
                if (this.bar.type === BarTypes.headline) {
                    return this.bars
                        .filter(bar =>
                            bar.type === this.bar.type
                            && bar.schema === this.bar.schema
                        )
                        .length > 1
                }
                return this.bar.type === BarTypes.subline
            },
        },

        mounted() {
            this.draw()
            this.loadFonts().then(this.draw)
        },

        methods: {
            draw() {
                this.drawObj.text = this.bar.text;
                this.drawObj.alignment = this.alignment;
                this.drawObj.type = this.bar.type;
                this.drawObj.schema = this.barSchema;
                this.drawObj.fontSize = this.fontSize;
                this.drawObj.imageWidth = this.imageWidth;

                this.bar.canvas = this.drawObj.draw()

                this.bar.padding = this.drawObj.padding;

                this.$store.dispatch(
                    'canvas/setBar',
                    {index: this.index, bar: {...this.bar}}
                )
            },

            loadFonts() {
                const timeout = 10000;
                const sanukFat = new FontFaceObserver('SanukFat');
                const sanukBold = new FontFaceObserver('SanukBold');
                const bowlbyOneSc = new FontFaceObserver('Bowlby One SC');
                const madaBold = new FontFaceObserver('Mada');

                return Promise.all([
                    sanukFat.load(null, timeout),
                    sanukBold.load(null, timeout),
                    bowlbyOneSc.load(null, timeout),
                    madaBold.load(null, timeout),
                ])
                    .catch(
                        error => this.snackErrorDismiss(
                            error,
                            this.$t('images.create.fontLoadingFailed')
                        )
                    );
            },

            remove() {
                this.$store.dispatch('canvas/removeBar', {index: this.index})
            },

            clone() {
                if (this.bar.type === BarTypes.headline
                    && this.bar.schema === BarSchemes.magenta) {
                    const message = this.$t('images.create.headlineSecondaryAdd')
                    if (confirm(message)) {
                        return
                    }
                }

                this.$store.dispatch(
                    'canvas/addBar',
                    {index: this.index, bar: {...this.bar}}
                )
            }
        },

        watch: {
            alignment() {
                this.draw()
            },
            baseFontSize() {
                this.draw()
            },
            imageWidth() {
                this.draw()
            },
            styleSet() {
                this.drawObj = this.createBar()
                this.draw()
            },
            colorSchema() {
                this.draw()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .magenta {
        color: $primary;
    }

    .green {
        $lightGreen: rgba($secondary, .25);
        color: darken($secondary, 5);

        &:focus {
            border-color: $secondary;
            box-shadow: 0 0 0 0.2rem $lightGreen;
        }
    }
</style>
