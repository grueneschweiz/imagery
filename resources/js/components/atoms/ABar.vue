<template>
    <div class="container-fluid mb-1">
        <div class="row">
            <input
                :class="inputClass"
                class="form-control col"
                type="text"
                v-model="text"
            />
            <template v-if="!isStyleYoung || isSubline">
                <button
                    :class="buttonClassAdd"
                    :disabled="!cloneable"
                    :title="$t('images.create.barAdd')"
                    class="btn ml-1"
                    @click="clone"><i class="mdi mdi-add"></i></button>
                <button
                    :class="buttonClassRemove"
                    :disabled="!deletable"
                    :title="$t('images.create.barRemove')"
                    class="btn ml-1"
                    @click="remove"><i class="mdi mdi-remove"></i></button>
            </template>
        </div>
    </div>
</template>

<script>
    import SnackbarMixin from "../../mixins/SnackbarMixin";
    import {
        BarSchemes,
        BarTypes,
        ColorSchemes,
        StyleSetTypes
    } from "../../service/canvas/Constants";
    import FontFaceObserver from "fontfaceobserver";
    import CanvasItemFactoryMixin from "../../mixins/CanvasItemFactoryMixin";
    import {mapGetters} from "vuex";

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

            barSchema() {
                if (BarSchemes.magenta === this.bar.schema) {
                    return this.bar.schema
                }

                if (this.isHeadline) {
                    return ColorSchemes.white === this.colorSchema
                        ? BarSchemes.white
                        : BarSchemes.green
                }

                if (this.isSubline) {
                    if (this.isStyleYoung) {
                        return BarSchemes.transparent
                    }

                    return ColorSchemes.greengreen === this.colorSchema
                        ? BarSchemes.green
                        : BarSchemes.white
                }

                return BarSchemes.green
            },

            buttonClassAdd() {
                if (!this.cloneable) {
                    return 'btn-disabled'
                }

                return this.buttonClass
            },

            buttonClassRemove() {
                if (!this.deletable) {
                    return 'btn-disabled'
                }

                return this.buttonClass
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

            headlineMax() {
                return this.isStyleYoung ? 2 : 3
            },

            cloneable() {
                if (this.isHeadline) {
                    return this.bars
                        .filter(bar => bar.type === BarTypes.headline)
                        .length < this.headlineMax
                }
                if (this.isSubline) {
                    return this.bars
                        .filter(bar => bar.type === BarTypes.subline)
                        .length < 2
                }
                return false
            },

            deletable() {
                if (this.isHeadline) {
                    return this.bars
                        .filter(bar =>
                            bar.type === this.bar.type
                            && bar.schema === this.bar.schema
                        )
                        .length > 1
                }
                return this.isSubline
            },

            isStyleYoung() {
                return this.styleSet === StyleSetTypes.young
            },

            isHeadline() {
                return this.bar.type === BarTypes.headline
            },

            isSubline() {
                return this.bar.type === BarTypes.subline
            },

            isFirstSubline() {
                return this.index === this.bars.findIndex(bar => bar.type === BarTypes.subline)
            }
        },

        mounted() {
            this.draw()
            this.loadFonts().then(this.draw)
        },

        methods: {
            draw() {
                if (! this.bar) {
                    return;
                }

                this.drawObj.text = this.bar.text;
                this.drawObj.alignment = this.alignment;
                this.drawObj.type = this.bar.type;
                this.drawObj.schema = this.barSchema;
                this.drawObj.baseFontSize = this.baseFontSize;
                this.drawObj.imageWidth = this.imageWidth;
                this.drawObj.isFirstSubline = this.isFirstSubline;

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
                if (this.isHeadline
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
            },

            maybeRemoveBar() {
                if ( this.isStyleYoung
                    && this.isHeadline
                    && this.deletable
                ) {
                    this.remove()
                }
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
                this.maybeRemoveBar()
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

    .btn-disabled {
        color: rgba($dark, 0.4);
        border-color: rgba($dark, 0.4);
    }
</style>
