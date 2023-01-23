<template>
    <div class="form-group">
        <div id="image-size" class="row no-gutters">
            <div :class="{'col-sm-6': !rotatable, 'col-sm-5': rotatable}"
                 class="col-12"
            >
                <label
                    class="mt-2 mb-0"
                    for="canvas-format"
                >{{ $t('images.create.size') }}</label>
                <div class="input select">
                    <ModelSelect
                        id="canvas-format"
                        :options="sizes"
                        :value="sizeIdSelected"
                        class="form-control"
                        required="true"
                        @input="setSize($event)"/>
                </div>
            </div>
            <template v-if="isMediaScreen">
                <AImageSize
                    v-model.number="width"
                    :class="{'col-6': !rotatable, 'col-5': rotatable}"
                    :disabled="!custom"
                    :label="$t('images.create.widthPx')"
                    :max-size="maxSize"
                    :min-size="minSize"
                    class="col-sm-3 pr-1 pr-sm-0 pl-sm-2"
                />
                <AImageSize
                    v-model.number="height"
                    :class="{'col-6': !rotatable, 'col-5': rotatable}"
                    :disabled="!custom"
                    :label="$t('images.create.heightPx')"
                    :max-size="maxSize"
                    :min-size="minSize"
                    class="col-sm-3 pl-1 pl-sm-2"
                />
            </template>
            <template v-else-if="isMediaPrint">
                <AImageSize
                    v-model.number="widthMM"
                    :class="{'col-6': !rotatable, 'col-5': rotatable}"
                    :disabled="!custom"
                    :label="$t('images.create.widthMm')"
                    :max-size="maxSizeMM"
                    :min-size="minSizeMM"
                    class="col-sm-3 pr-1 pr-sm-0 pl-sm-2"
                />
                <AImageSize
                    v-model.number="heightMM"
                    :class="{'col-6': !rotatable, 'col-5': rotatable}"
                    :disabled="!custom"
                    :label="$t('images.create.heightMm')"
                    :max-size="maxSizeMM"
                    :min-size="minSizeMM"
                    class="col-sm-3 pl-1 pl-sm-2"
                />
            </template>
            <div class="col-2 col-sm-1 pl-1 pl-sm-2">
                <button
                    v-if="rotatable"
                    id="rotateBtn"
                    :title="$t('images.create.switchOrientation')"
                    class="btn btn-secondary btn-sm w-100"
                    @click="rotate()"
                >
                    <i class="mdi mdi-rotate-right"></i>
                </button>
            </div>
        </div>
        <div
            v-if="width > maxSize || height > maxSize"
            class="alert alert-danger mt-3"
            role="alert">
            {{ $t('images.create.oversizeError', {maxWidth: maxSize, maxHeight: maxSize}) }}
        </div>
        <div
            v-if="hugeCanvas"
            class="alert alert-warning mt-3"
            role="alert">
            {{ $t('images.create.oversizeWarning') }}
        </div>
    </div>
</template>

<script>
import {ModelSelect} from 'vue-search-select'
import {HugeImageSurfaceLimit, Inch2mm, Media, StyleSetTypes} from "../../service/canvas/Constants";
import {ImageSizeIds, ImageSizes} from "../../service/canvas/ImageSizes";
import {mapGetters} from "vuex";
import AImageSize from "../atoms/AImageSize.vue";

const minSize = 100
const maxSize = 16384 // https://stackoverflow.com/a/11585939

export default {
    name: "MSizeBlock",
    components: {AImageSize, ModelSelect},

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
        ...mapGetters({
            styleSet: "canvas/getStyleSet",
            logoId: 'canvas/getLogoId',
            format: 'canvas/getFormat',
            resolution: 'canvas/getResolution',
            sizeSelected: 'canvas/getSelectedImageSize',
            media: 'canvas/getMedia',
        }),

        sizeIdSelected: {
            get() {
                return this.sizeSelected.id;
            },
            set(value) {
                const size = ImageSizes.find(el => el.id === value);
                this.$store.commit('canvas/setSelectedImageSize', size);
            }
        },

        rotated: {
            get() {
                return this.$store.getters['canvas/getRotated'];
            },
            set(value) {
                this.$store.commit('canvas/setRotated', value);
            }
        },

        rotatable() {
            return this.sizeSelected.rotatable;
        },

        sizes() {
            return ImageSizes
                .filter(
                    size => size.media === this.media
                )
                .filter(
                    size => !size.excludeStyleSets.find(styleSet => styleSet === this.styleSet)
                )
                .map(
                    size => ({value: size.id, text: this.$t(size.labelKey)})
                );
        },

        widthMM: {
            get() {
                return this.px2mm(this.width);
            },
            set(value) {
                this.width = this.mm2px(value);
            },
        },

        heightMM: {
            get() {
                return this.px2mm(this.height);
            },
            set(value) {
                this.height = this.mm2px(value);
            }
        },

        maxSizeMM() {
            return this.px2mm(maxSize);
        },

        minSizeMM() {
            return this.px2mm(minSize);
        },

        isMediaScreen() {
            return this.sizeSelected.media === Media.screen;
        },

        isMediaPrint() {
            return this.sizeSelected.media === Media.print;
        },

        hugeCanvas() {
            return this.width * this.height > HugeImageSurfaceLimit;
        },
    },

    created() {
        this.setSize(this.sizeIdSelected);
    },

    methods: {
        setSize(value) {
            this.sizeIdSelected = value;

            this.custom = ImageSizeIds.customScreen === value
                || ImageSizeIds.customPrint === value;

            if (this.custom) {
                return;
            }

            if (!this.sizeSelected.rotatable) {
                this.rotated = false;
            }

            const height = Math.round(this.sizeSelected.height);
            const width = Math.round(this.sizeSelected.width);

            if (this.rotated) {
                // noinspection JSSuspiciousNameCombination
                this.height = width;
                // noinspection JSSuspiciousNameCombination
                this.width = height;
            } else {
                this.height = height;
                this.width = width;
            }
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

        px2mm(value) {
            return Math.round(value * (Inch2mm / this.resolution));
        },

        mm2px(value) {
            return Math.round(value * (this.resolution / Inch2mm));
        },

        rotate() {
            this.rotated = !this.rotated;

            if (this.custom) {
                // noinspection JSSuspiciousNameCombination
                const height = this.width;
                // noinspection JSSuspiciousNameCombination
                this.width = this.height;
                this.height = height;
            } else {
                this.setSize(this.sizeIdSelected);
            }
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
            if (StyleSetTypes.young === newVal && this.sizeIdSelected === ImageSizeIds.fbCoverGreen) {
                this.setSize(ImageSizeIds.fbCoverYoung);
            }

            if (StyleSetTypes.young !== newVal && this.sizeIdSelected === ImageSizeIds.fbCoverYoung) {
                this.setSize(ImageSizeIds.fbCoverGreen);
            }
        },

        media(newVal) {
            if (Media.print === newVal) {
                this.setSize(ImageSizeIds.customPrint);
            } else {
                this.setSize(ImageSizeIds.customScreen)
            }
        },
    }
}
</script>

<style lang="scss">
#rotateBtn {
    margin-top: 2.1rem;
    height: 2.5rem;
}
</style>
