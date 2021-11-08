<template>
    <div class="form-group">
        <div class="row no-gutters" id="image-size">
            <div class="col-12 col-sm-6">
                <label
                    class="mt-2 mb-0"
                    for="canvas-format"
                >{{$t('images.create.format')}}</label>
                <div class="input select">
                    <ModelSelect
                        :options="sizes"
                        :value="sizeSelected"
                        @input="setSize($event)"
                        class="form-control"
                        id="canvas-format"
                        required="true"></ModelSelect>
                </div>
            </div>
            <div class="col-6 col-sm-3 pr-1 pr-sm-0 pl-sm-2">
                <div class="input number">
                    <label
                        class="mt-2 mb-0"
                        for="canvas-width-setter"
                    >{{$t('images.create.width')}}</label>
                    <input :disabled="!custom"
                           class="form-control"
                           id="canvas-width-setter"
                           :max="maxSize"
                           :min="minSize"
                           step="1"
                           type="number"
                           v-model.number="width">
                </div>
            </div>
            <div class="col-6 col-sm-3 pl-1 pl-sm-2">
                <div class="input number">
                    <label
                        class="mt-2 mb-0"
                        for="canvas-height-setter"
                    >{{$t('images.create.height')}}</label>
                    <input :disabled="!custom"
                           class="form-control"
                           id="canvas-height-setter"
                           :max="maxSize"
                           :min="minSize"
                           step="1"
                           type="number"
                           v-model.number="height">
                </div>
            </div>
        </div>
        <div
            v-if="width > maxSize || height > maxSize"
            class="alert alert-danger mt-3"
            role="alert">
          {{$t('images.create.oversizeError', {maxWidth: maxSize, maxHeight: maxSize})}}
        </div>
        <div
            class="alert alert-warning mt-3"
            role="alert"
            v-if="width*height > 3000**2">
            {{$t('images.create.oversizeWarning')}}
        </div>
    </div>
</template>

<script>
    import {ModelSelect} from 'vue-search-select'

    const customSize = '999-custom';
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
                sizes: [
                    {value: '1-1080x1080', text: this.$t('images.create.sizes.square')},
                    {value: '2-1200x630', text: this.$t('images.create.sizes.fbTimeline')},
                    {value: '3-1920x1080', text: this.$t('images.create.sizes.fbEvent')},
                    {value: '4-1200x628', text: this.$t('images.create.sizes.fbWebsite')},
                    {value: '5-1920x1080', text: this.$t('images.create.sizes.video')},
                    {value: '6-1024x512', text: this.$t('images.create.sizes.twFeed')},
                    {value: '7-1080x1920', text: this.$t('images.create.sizes.instaStory')},
                    {value: customSize, text: this.$t('images.create.sizes.custom')},
                ],
                sizeSelected: null,
                minSize,
                maxSize,
            }
        },

        created() {
            this.setSize(this.sizes[0].value);
        },

        methods: {
            setSize(value) {
                this.sizeSelected = value;

                this.custom = customSize === value;

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
            }
        },

        watch: {
            width() {
                const width = this.sanitizeSize(this.width)
                this.$store.commit('canvas/setImageWidth', width)
            },

            height() {
                const height = this.sanitizeSize(this.height)
                this.$store.commit('canvas/setImageHeight', height)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-file-input {
        display: none;
    }
</style>
