<template>
    <div>
        <div class="form-group">
            <label
                class="mb-0"
                for="font-size"
            >{{$t('images.create.fontSize')}}</label>
            <input
                :disabled="tooMuchText"
                :max="fontSizeMax"
                :min="fontSizeMin"
                @input="draw"
                class="form-control-range"
                id="font-size"
                step="1"
                type="range"
                v-model.number="fontSize"
            >
        </div>

        <div class="form-group">
            <label
                class="mb-0"
                for="font-size"
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

            <div class="alert alert-warning" role="alert" v-if="tooMuchText">
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
        BarTypes as Types,
        ColorSchemes
    } from "../../service/canvas/Constants";
    import ABar from "../atoms/ABar";
    import CanvasItemFactoryMixin from "../../mixins/CanvasItemFactoryMixin";

    const defaultMinFontSizeFactor = 0.1
    const defaultMaxFontSizeFactor = 0.9

    export default {
        name: "MBarBlock",
        components: {ABar},
        mixins: [CanvasItemFactoryMixin],

        data() {
            return {
                fontSizeMax: 100,
                tooMuchText: false,
                block: null,
            }
        },

        computed: {
            ...mapGetters({
                styleSet: 'canvas/getStyleSet',
                alignment: 'canvas/getAlignment',
                imageHeight: 'canvas/getImageHeight',
                imageWidth: 'canvas/getImageWidth',
                colorSchema: 'canvas/getColorSchema',
                bars: 'canvas/getBars',
            }),

            fontSize: {
                get() {
                    return this.$store.getters['canvas/getFontSize']
                },
                set(val) {
                    if (val > 0) {
                        this.$store.dispatch('canvas/setFontSize', val)
                    }
                }
            },

            buttonClassSubline() {
                if (ColorSchemes.greengreen === this.colorSchema) {
                    return 'btn-secondary';
                } else {
                    return 'btn-outline-secondary';
                }
            },

            fontSizeMin() {
                const minFontSizeFactor = this.block?.minFontSizeFactor || defaultMinFontSizeFactor

                // base the minimal font size on a normalized side length of
                // the image.
                // to get a normalized side length, square the image width,
                // and multiply it with the height, then take the third root.
                // this way we only violate the corporate design rules on slim
                // portrait images (without violation, we can't write anything
                // meaning full on a instagram story)
                const cube = this.imageHeight * this.imageWidth ** 2;
                const sideNormalized = Math.pow(cube, 1 / 3);
                const min = sideNormalized * minFontSizeFactor;
                return Math.ceil(min);
            },

            showAddSublineBtn() {
                return this.bars
                    .filter(bar => bar.type === BarTypes.subline)
                    .length === 0
            }
        },

        mounted() {
            this.draw()
        },

        methods: {
            setupBlock() {
                const canvases = this.bars.map(bar => bar.canvas)
                if (canvases.length) {
                    this.block = this.createBarBlock(canvases)
                } else {
                    this.block = null
                }
            },

            draw() {
                this.setupBlock()

                if (!this.block) {
                    return
                }

                this.block.alignment = this.alignment;

                this.block.draw(); // called twice. first call is needed to determine size for content based font adjustment
                const fitsInImage = this.adjustFontSize();

                if (fitsInImage) {
                    this.$emit('drawn', this.block.draw());
                }
            },

            adjustFontSize() {
                const maxFontSizeFactor = this.block?.maxFontSizeFactor || defaultMaxFontSizeFactor
                const min = this.fontSizeMin;
                const maxWidth = this.imageWidth * maxFontSizeFactor;
                const imageToBlockRatio = maxWidth / this.block.width;
                let max = this.fontSize * imageToBlockRatio;
                max = Math.floor(max); // the range slider wants integers

                if (this.fontSize < min) {
                    this.fontSize = min;
                    return false;
                }

                if (max < min) {
                    this.fontSize = min;
                    this.fontSizeMax = min;
                    this.tooMuchText = true;
                    return false;
                } else {
                    this.tooMuchText = false;
                }

                if (this.block.width > maxWidth) {
                    this.fontSizeMax = max;
                    this.fontSize = max;
                    return false;
                }

                this.fontSizeMax = max;

                return true;
            },

            addSubline() {
                const subline = {
                    type: Types.subline,
                    schema: BarSchemes.white,
                    text: 'Subline',
                    canvas: null,
                    padding: 0,
                }

                this.$store.dispatch(
                    'canvas/addBar',
                    {index: this.bars.length, bar: subline}
                )
            },
        },

        watch: {
            imageWidth() {
                this.draw();
            },
            imageHeight() {
                this.draw();
            },
            bars() {
                this.draw()
            },
            styleSet() {
                this.draw()
            },
        }
    }
</script>

<style scoped>

</style>
