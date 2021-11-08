<template>
    <div class="m-copyright form-group">
        <label for="image_copyright">{{$t('images.create.copyright')}}</label>
        <input
            class="form-control"
            id="image_copyright"
            maxlength="192"
            type="text"
            v-model="value"
            :placeholder="$t('images.create.copyOptional')"
        >
    </div>
</template>

<script>
    import {Copyright} from "../../service/canvas/elements/Copyright";
    import {mapGetters} from "vuex";

    const colorCopyrightBorder = '#666666'
    const colorCopyrightNoBorder = '#ffffff'

    export default {
        name: "MCopyright",

        data() {
            return {
                block: new Copyright(),
                value: '',
            }
        },

        computed: {
            ...mapGetters({
                imageHeight: 'canvas/getImageHeight',
                imageWidth: 'canvas/getImageWidth',
                hasBorder: 'canvas/getHasBorder',
            }),
            color() {
                return this.hasBorder ? colorCopyrightBorder : colorCopyrightNoBorder
            }
        },

        mounted() {
            this.draw();
        },

        methods: {
            updateLegalOriginator(value) {
                this.$store.commit('legal/update', {key: 'originator', value: value});
            },

            draw() {
                const text = this.value
                    ? this.$t('images.create.imageCopyInfo', {photographer: this.value})
                    : '';

                this.block.width = this.imageWidth;
                this.block.height = this.imageHeight;
                this.block.text = text;
                this.block.color = this.color;

                this.$emit('drawn', this.block.draw());
            },
        },

        watch: {
            value(val) {
                this.updateLegalOriginator(val);
                this.draw();
            },

            imageWidth() {
                this.draw();
            },

            imageHeight() {
                this.draw();
            },

            color() {
                this.draw();
            },
        }
    }
</script>

<style scoped>

</style>
