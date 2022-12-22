<template>
    <div class="form-group">
        <div id="image-size" class="row no-gutters">
            <div class="col-12 col-sm-6">
                <label
                    class="mt-2 mb-0"
                    for="canvas-format"
                >{{ $t('images.create.format') }}</label>
                <div class="input select">
                    <ModelSelect
                        id="canvas-format"
                        :options="sizes"
                        :value="sizeSelected"
                        class="form-control"
                        required="true"
                        @input="setSize($event)"/>
                </div>
            </div>
            <div class="col-6 col-sm-3 pr-1 pr-sm-0 pl-sm-2">
                <div class="input number">
                    <label
                        class="mt-2 mb-0"
                        for="canvas-width-setter"
                    >{{ $t('images.create.width') }}</label>
                    <input id="canvas-width-setter"
                           v-model.number="width"
                           :disabled="!custom"
                           :max="maxSize"
                           :min="minSize"
                           class="form-control"
                           step="1"
                           type="number">
                </div>
            </div>
            <div class="col-6 col-sm-3 pl-1 pl-sm-2">
                <div class="input number">
                    <label
                        class="mt-2 mb-0"
                        for="canvas-height-setter"
                    >{{ $t('images.create.height') }}</label>
                    <input id="canvas-height-setter"
                           v-model.number="height"
                           :disabled="!custom"
                           :max="maxSize"
                           :min="minSize"
                           class="form-control"
                           step="1"
                           type="number">
                </div>
            </div>
        </div>
        <div
            v-if="width > maxSize || height > maxSize"
            class="alert alert-danger mt-3"
            role="alert">
            {{ $t('images.create.oversizeError', {maxWidth: maxSize, maxHeight: maxSize}) }}
        </div>
        <div
            v-if="width*height > 3000**2"
            class="alert alert-warning mt-3"
            role="alert">
            {{ $t('images.create.oversizeWarning') }}
        </div>
    </div>
</template>

<script>
    import {ModelSelect} from 'vue-search-select'
    import {StyleSetTypes, ImageSizes} from "../../service/canvas/Constants";

    const minSize = 100
    const maxSize = 10000

    export default {
        name: "MSizeBlock",
        components: {ModelSelect},

        data() {
            return {
                width: 0,
                height: 0,
                custom: false,
                minSize,
                maxSize,
            }
        },

        computed: {
            styleSet() {
                return this.$store.getters['canvas/getStyleSet'];
            },

            sizeSelected: {
                get() {
                    return this.$store.getters['canvas/getSelectedImageSize'];
                },
                set(value) {
                    this.$store.commit('canvas/setSelectedImageSize', value);
                }
            },

            logoId() {
                return this.$store.getters['canvas/getLogoId'];
            },

            sizes() {
                const all = [
                    {value: ImageSizes[10], text: this.$t('images.create.sizes.square'), limitStyleSet: []},
                    {value: ImageSizes[20], text: this.$t('images.create.sizes.fbTimeline'), limitStyleSet: []},
                    {
                        value: ImageSizes.fbCoverGreen,
                        text: this.$t('images.create.sizes.fbCoverGreen'),
                        limitStyleSet: [StyleSetTypes.green, StyleSetTypes.greenCentered]
                    },
                    {
                        value: ImageSizes.fbCoverYoung,
                        text: this.$t('images.create.sizes.fbCover'),
                        limitStyleSet: [StyleSetTypes.young]
                    },
                    {
                        value: ImageSizes[30],
                        text: this.$t('images.create.sizes.fbEvent'),
                        limitStyleSet: []
                    },
                    {value: ImageSizes[40], text: this.$t('images.create.sizes.fbWebsite'), limitStyleSet: []},
                    {value: ImageSizes[50], text: this.$t('images.create.sizes.video'), limitStyleSet: []},
                    {value: ImageSizes[60], text: this.$t('images.create.sizes.twFeed'), limitStyleSet: []},
                    {value: ImageSizes[70], text: this.$t('images.create.sizes.instaStory'), limitStyleSet: []},
                    {value: ImageSizes.custom, text: this.$t('images.create.sizes.custom'), limitStyleSet: []},
                ];

                return all.filter(
                    size => size.limitStyleSet.length === 0
                        || size.limitStyleSet.find(styleSet => styleSet === this.styleSet)
                );
            },
        },

        created() {
            this.setSize(this.sizes[0].value);
        },

        methods: {
            setSize(value) {
                this.sizeSelected = value;

                this.custom = ImageSizes.custom === value;

                if (this.custom) {
                    return;
                }

                const dims = value.split('-')[1].split('x');

                this.width = parseInt(dims[0]);
                this.height = parseInt(dims[1]);
            },

            sanitizeSize(value) {
                const size = parseInt(value)
                if (size >= minSize && size <= maxSize) {
                    return size
                }
                if (size > maxSize) {
                    return maxSize
                }
                return minSize
            },
        },

        watch: {
            width() {
                const width = this.sanitizeSize(this.width)
                this.$store.commit('canvas/setImageWidth', width)
            },

            height() {
                const height = this.sanitizeSize(this.height)
                this.$store.commit('canvas/setImageHeight', height)
            },

            styleSet(newVal) {
                if (StyleSetTypes.young === newVal && this.sizeSelected === ImageSizes.fbCoverGreen) {
                    this.sizeSelected = ImageSizes.fbCoverYoung;
                }

                if (StyleSetTypes.young !== newVal && this.sizeSelected === ImageSizes.fbCoverYoung) {
                    this.sizeSelected = ImageSizes.fbCoverGreen;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
