<template>
    <div class="form-group">
        <label class="mb-0 d-block">{{$t('images.create.background')}}</label>
        <div class="btn-group btn-group-toggle">
            <label v-if="gradientBackgroundAvailable"
                   :class="{'active': background === backgroundTypes.gradient}"
                   class="btn btn-secondary btn-sm">
                <input
                    :value="backgroundTypes.gradient"
                    name="background"
                    type="radio"
                    v-model="background"
                >{{$t('images.create.backgroundGreen')}}
            </label>
            <label :class="{'active': background === backgroundTypes.transparent}"
                   class="btn btn-secondary btn-sm">
                <input
                    :value="backgroundTypes.transparent"
                    name="background"
                    type="radio"
                    v-model="background"
                >{{$t('images.create.backgroundTransparent')}}
            </label>
            <label :class="{'active': background === backgroundTypes.image}"
                   class="btn btn-secondary btn-sm">
                <input
                    :value="backgroundTypes.image"
                    name="background"
                    type="radio"
                    v-model="background"
                    @click="$refs.uploader.click()"
                >{{$t('images.create.backgroundImage')}}
            </label>
        </div>

        <div v-if="background === backgroundTypes.image && image && !imageTooSmall" class="form-group">
            <label
                class="mb-0 mt-2"
                for="image-zoom"
            >{{$t('images.create.imageZoom')}}</label>
            <input
                :max="1"
                :min="0"
                @input="zoomImage()"
                class="form-control-range"
                id="image-zoom"
                step="0.01"
                type="range"
                v-model.number="zoom"
            >
        </div>

        <input
            @change="setImage($event)"
            class="custom-file-input"
            ref="uploader"
            type="file"
        >

        <div
            class="alert alert-warning"
            role="alert"
            v-if="background === backgroundTypes.image && imageTooSmall">
            {{$t('images.create.imageTooSmall')}}
        </div>
    </div>
</template>

<script>
    import {BackgroundTypes, StyleSetTypes} from "../../service/canvas/Constants";
    import SnackbarMixin from "../../mixins/SnackbarMixin";
    import BackgroundGradient from "../../service/canvas/elements/background/BackgroundGradient";
    import BackgroundTransparent from "../../service/canvas/elements/background/BackgroundTransparent";
    import BackgroundImage from "../../service/canvas/elements/background/BackgroundImage";
    import loadImage from "blueimp-load-image";
    import {mapGetters} from "vuex";
    import BackgroundPlaceholder from "../../service/canvas/elements/background/BackgroundPlaceholder";

    const mimeTypesAllowed = [
        'image/jpeg',
        'image/png',
        'image/svg',
        'image/svg+xml'
    ];

    let requestedAnimationFrame;

    export default {
        name: "MBackgroundBlock",
        components: {},
        mixins: [SnackbarMixin],

        data() {
            return {
                block: null,
                image: null,
                mimeType: null,
                backgroundTypes: BackgroundTypes,
                zoom: 0,
            }
        },

        computed: {
            ...mapGetters({
                imageHeight: 'canvas/getImageHeight',
                imageWidth: 'canvas/getImageWidth',
                styleSet: 'canvas/getStyleSet',
                user: 'user/object',
            }),

            background: {
                get() {
                    return this.$store.getters['canvas/getBackgroundType']
                },
                set(value) {
                    if (BackgroundTypes.image === value && !this.image) {
                        return
                    }

                    this.$store.dispatch('canvas/setBackgroundType', value)
                }
            },

            imageTooSmall() {
                if (!this.image) {
                    return false;
                }

                if (this.image.width < this.imageWidth) {
                    return true;
                }

                if (this.image.height < this.imageHeight) {
                    return true;
                }

                return false;
            },

            gradientBackgroundAvailable() {
                return this.styleSet === StyleSetTypes.green;
            },
        },

        mounted() {
            if (this.styleSet === StyleSetTypes.young) {
                this.background = BackgroundTypes.placeholder
            }

            this.$nextTick(this.draw)
        },

        methods: {
            draw() {
                let canvas;

                switch (this.background) {
                    case BackgroundTypes.placeholder:
                        canvas = this.drawPlaceholder();
                        break;

                    case BackgroundTypes.gradient:
                        canvas = this.drawGradient();
                        break;

                    case BackgroundTypes.transparent:
                        canvas = this.drawTransparent();
                        break;

                    case BackgroundTypes.image:
                        canvas = this.drawImage();
                        break;
                }

                this.$emit('drawn', canvas);
            },

            drawPlaceholder() {
                this.block = this.backgroundFactory(BackgroundPlaceholder)
                this.block.watermarkText = this.$t('images.create.placeholderWatermark', {first_name: this.user?.first_name ?? ''})
                return this.block.draw()
            },

            drawGradient() {
                this.block = this.backgroundFactory(BackgroundGradient);
                return this.block.draw();
            },

            drawTransparent() {
                this.block = this.backgroundFactory(BackgroundTransparent);
                return this.block.draw();
            },

            drawImage() {
                this.block = this.backgroundFactory(BackgroundImage);
                this.block.image = this.image;
                this.block.zoom = this.zoom;

                try {
                    return this.block.draw();
                } catch (e) {
                    this.snackErrorDismiss(
                        e,
                        this.$t('images.create.uploadedImageNotProcessable')
                    );
                }
            },

            backgroundFactory(type) {
                const bg = new type();
                bg.width = this.imageWidth;
                bg.height = this.imageHeight;

                return bg;
            },

            zoomImage() {
                if (requestedAnimationFrame) {
                    window.cancelAnimationFrame(requestedAnimationFrame);
                }

                requestedAnimationFrame = window.requestAnimationFrame(() => {
                    this.block.zoom = this.zoom;
                    this.$emit('drawn', this.block.draw());
                });
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
                this.image = image
                this.background = BackgroundTypes.image
                this.$store.dispatch('canvas/setBackgroundImage', {image: image, mimeType: this.mimeType})
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
                const ratio = dimNew / dimOld;
                this.zoom *= ratio;
            }
        },

        watch: {
            background() {
                this.$nextTick(this.draw)
            },
            image() {
                this.zoom = 0;
                this.draw();
            },
            imageWidth(valueNew, valueOld) {
                this.adjustZoom(valueNew, valueOld);
                this.draw();
            },
            imageHeight(valueNew, valueOld) {
                this.adjustZoom(valueNew, valueOld);
                this.draw();
            },
            styleSet(valueNew) {
                if (StyleSetTypes.young === valueNew && BackgroundTypes.gradient === this.background) {
                    this.background = BackgroundTypes.placeholder
                }
                if (StyleSetTypes.green === valueNew && BackgroundTypes.placeholder === this.background) {
                    this.background = BackgroundTypes.gradient
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .custom-file-input {
        display: none;
    }
</style>
