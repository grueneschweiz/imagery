<template>
    <div class="form-group">
        <label class="mb-0 d-block">{{$t('images.create.background')}}</label>
        <div class="btn-group btn-group-toggle">
            <label v-if="gradientBackgroundAvailable"
                   :class="{'active': backgroundType === backgroundTypes.gradient}"
                   class="btn btn-secondary btn-sm">
                <input
                    :value="backgroundTypes.gradient"
                    name="background"
                    type="radio"
                    v-model="backgroundType"
                >{{$t('images.create.backgroundGreen')}}
            </label>
            <label :class="{'active': backgroundType === backgroundTypes.transparent}"
                   v-if="!hugeCanvas"
                   class="btn btn-secondary btn-sm"
            >
                <input
                    :value="backgroundTypes.transparent"
                    name="background"
                    type="radio"
                    v-model="backgroundType"
                >{{$t('images.create.backgroundTransparent')}}
            </label>
            <label :class="{'active': backgroundType === backgroundTypes.image}"
                   class="btn btn-secondary btn-sm">
                <input
                    :value="backgroundTypes.image"
                    name="background"
                    type="radio"
                    v-model="backgroundType"
                    @click="$refs.uploader.click()"
                >{{$t('images.create.backgroundImage')}}
            </label>
        </div>

        <div
            v-if="backgroundType === backgroundTypes.image && hugeImage"
            class="alert alert-warning mt-1"
            role="alert">
            {{$t('images.create.hugeImage', {maxWidth: hugeImageSideLenLimit, maxHeight: hugeImageSideLenLimit})}}
        </div>

        <div
            v-if="backgroundType === backgroundTypes.image && backgroundImage"
            class="form-group m-background-block__zoom"
        >
            <div
                :style="`width: ${Math.min((1-scaleUpLimit)*100, 99)}%;`"
                class="m-background-block__scale-up-zone"
            />
            <label
                class="mb-0 mt-2"
                for="image-zoom"
            >{{$t('images.create.imageZoom')}}</label>
            <input
                :max="1"
                :min="0"
                class="form-control-range"
                id="image-zoom"
                step="0.01"
                type="range"
                v-model.number="zoom"
            >
            <small
                :class="{'m-background-block__scale-up-desc--visible': zoom > scaleUpLimit}"
                class="m-background-block__scale-up-desc"
            >
                {{$t('images.create.scaleUpDesc')}}
            </small>
        </div>

        <input
            @change="setImage($event)"
            class="custom-file-input"
            ref="uploader"
            type="file"
            :accept="acceptedMimeTypes"
        >

        <div
            class="alert alert-warning mt-1"
            role="alert"
            v-if="backgroundType === backgroundTypes.image && imageTooSmall">
            {{$t('images.create.imageTooSmall')}}
        </div>
    </div>
</template>

<script>
import {BackgroundTypes, HugeImageSurfaceLimit, StyleSetTypes} from "../../service/canvas/Constants";
    import SnackbarMixin from "../../mixins/SnackbarMixin";
    import loadImage from "blueimp-load-image";
    import {mapGetters} from "vuex";

    const mimeTypesAllowed = [
        'image/jpeg',
        'image/png',
        'image/svg',
        'image/svg+xml'
    ];

    export default {
        name: "MBackgroundBlock",
        components: {},
        mixins: [SnackbarMixin],

        data() {
            return {
                mimeType: null,
                backgroundTypes: BackgroundTypes,
                hugeImageSideLenLimit: Math.sqrt(HugeImageSurfaceLimit),
            }
        },

        computed: {
            ...mapGetters({
                imageHeight: 'canvas/getImageHeight',
                imageWidth: 'canvas/getImageWidth',
                styleSet: 'canvas/getStyleSet',
                user: 'user/object',
                scaleUpLimit: 'canvas/getScaleUpLimit',
            }),

            backgroundType: {
                get() {
                    return this.$store.getters['canvas/getBackgroundType']
                },
                set(value) {
                    if (BackgroundTypes.image === value && !this.backgroundImage) {
                        return
                    }

                    this.$store.dispatch('canvas/setBackgroundType', value)
                }
            },

            backgroundImage: {
                get() {
                    return this.$store.getters['canvas/getBackgroundImage']
                },
                set(value) {
                    this.$store.dispatch('canvas/setBackgroundImage', value)
                }
            },

            zoom: {
                get() {
                    return this.$store.getters['canvas/getBackgroundZoom']
                },
                set(value) {
                    this.$store.dispatch('canvas/setBackgroundZoom', value)
                }
            },

            imageTooSmall() {
                if (!this.backgroundImage) {
                    return false;
                }

                if (this.backgroundImage.width < this.imageWidth) {
                    return true;
                }

                if (this.backgroundImage.height < this.imageHeight) {
                    return true;
                }

                return false;
            },

            hugeImage() {
                if (!this.backgroundImage) {
                    return false;
                }

                return this.backgroundImage.width * this.backgroundImage.height > HugeImageSurfaceLimit;
            },

            hugeCanvas() {
                return this.imageWidth * this.imageHeight > HugeImageSurfaceLimit;
            },

            gradientBackgroundAvailable() {
                return this.styleSet === StyleSetTypes.green
                    || this.styleSet === StyleSetTypes.greenCentered;
            },

            acceptedMimeTypes() {
                return mimeTypesAllowed.join(',');
            },
        },

        mounted() {
            this.setWatermarkText();

            if (this.styleSet === StyleSetTypes.young) {
                this.backgroundType = BackgroundTypes.placeholder
            }
        },

        methods: {
            setWatermarkText() {
                const text = this.$t('images.create.placeholderWatermark', {first_name: this.user?.first_name ?? ''})
                this.$store.dispatch('canvas/setBackgroundWatermarkText', text)
            },

            setImage(event) {
                if (!event.target.files.length) {
                    return; // no file was selected
                }

                const blob = event.target.files[0];

                if (this.mimeValidate(blob.type)) {
                    this.mimeType = blob.type;

                    loadImage(
                        blob,
                        this.onImageLoaded,
                        {orientation: true, canvas: true}
                    );
                }
            },

            onImageLoaded(image) {
                this.backgroundImage = image
                this.backgroundType = BackgroundTypes.image
                this.$store.dispatch('canvas/setBackgroundImageMimeType', this.mimeType)
                this.$store.commit('legal/reset')
            },

            mimeValidate(type) {
                if (mimeTypesAllowed.indexOf(type) === -1) {
                    this.snackErrorDismiss(
                        `"${type}" is not a supported mime type.`,
                        this.$t('images.create.mimeInvalid')
                    );

                    return false;
                }

                return true;
            },

            adjustZoom(dimNew, dimOld) {
                if (!dimOld) {
                    return;
                }

                const ratio = dimNew / dimOld;
                this.zoom *= ratio;
            },

            maybeDisableTransparentBackground() {
                if (this.hugeCanvas && this.backgroundType === BackgroundTypes.transparent) {
                    if (this.styleSet === StyleSetTypes.young) {
                        this.backgroundType = BackgroundTypes.placeholder
                    } else {
                        this.backgroundType = BackgroundTypes.gradient;
                    }

                    this.snackErrorDismiss(
                        new Error(`Max canvas size for transparent background is: ${HugeImageSurfaceLimit}px²`),
                        this.$t('images.create.transparentBackgroundDisabled'),
                    );
                }
            },
        },

        watch: {
            image() {
                this.zoom = 0;
            },
            imageWidth(valueNew, valueOld) {
                this.adjustZoom(valueNew, valueOld);
                this.maybeDisableTransparentBackground();
            },
            imageHeight(valueNew, valueOld) {
                this.adjustZoom(valueNew, valueOld);
                this.maybeDisableTransparentBackground();
            },
            styleSet(valueNew) {
                if (StyleSetTypes.young === valueNew && BackgroundTypes.gradient === this.backgroundType) {
                    this.backgroundType = BackgroundTypes.placeholder
                }
                if ((StyleSetTypes.green === valueNew || StyleSetTypes.greenCentered === valueNew )
                    && BackgroundTypes.placeholder === this.backgroundType) {
                    this.backgroundType = BackgroundTypes.gradient
                }
            },
            user() {
                this.setWatermarkText();
            },
        },
    }
</script>

<style lang="scss" scoped>
    .custom-file-input {
        display: none;
    }

    .m-background-block__zoom {
        position: relative;
    }

    .m-background-block__scale-up-desc {
        color: darkred;
        opacity: 0;
        width: 100%;
        text-align: right;
        display: block;
        transition: all 0.4s ease;
    }

    .m-background-block__scale-up-desc--visible {
        opacity: 1;
    }

    .m-background-block__scale-up-zone {
        position: absolute;
        right: 0;
        height: 8px;
        background: rgba(227, 52, 47, 0.35);
        user-select: none;
        pointer-events: none;
        top: 37.6px;
        border-radius: 0 8px 8px 0;
    }
</style>
