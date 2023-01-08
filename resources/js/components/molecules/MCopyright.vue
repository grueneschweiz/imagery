<template>
    <div class="m-copyright form-group">
        <label for="image_copyright">{{$t('images.create.copyright')}}</label>
        <input
            class="form-control"
            id="image_copyright"
            maxlength="192"
            type="text"
            v-model="copyrightText"
            :placeholder="$t('images.create.copyOptional')"
        >
    </div>
</template>

<script>
    export default {
        name: "MCopyright",

        computed: {
            copyrightText: {
                get() {
                    return this.$store.getters['canvas/getCopyrightText'];
                },
                set(value) {
                    this.$store.dispatch('canvas/setCopyrightText', value);
                }
            },
        },

        methods: {
            updateLegalOriginator(value) {
                this.$store.commit('legal/update', {key: 'originator', value: value});
            },
        },

        watch: {
            copyrightText(val) {
                this.updateLegalOriginator(val);
            },
        }
    }
</script>

<style scoped>

</style>
