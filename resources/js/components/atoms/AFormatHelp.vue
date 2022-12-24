<template>
    <div
        v-if="value"
        class="mt-2 alert alert-info alert-dismissible"
        role="alert"
    >
        <h4 class="alert-heading">{{ heading }}</h4>
        <p>{{ desc }}</p>
        <ul>
            <li>{{ $t('images.create.fileFormat', {'format': fileFormat}) }}</li>
            <li>{{ $t('images.create.colorEncoding', {'encoding': colorEncoding}) }}</li>
            <li v-if="format !== formats.digital">{{ $t('images.create.resolution', {'resolution': '300dpi'}) }}</li>
            <li v-if="format === formats.printSelf">{{ $t('images.create.noBleed', {'bleed': '3mm'}) }}</li>
            <li v-if="format === formats.printProfessional">{{
                    $t('images.create.bleedAndCropMarks', {'bleed': '3mm'})
                }}
            </li>
        </ul>

        <button
            class="close"
            @click="$emit('input', false)"
        >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<script>
import {Formats} from "../../service/canvas/Constants";

export default {
    name: "AFormatHelp",

    props: {
        value: {
            type: Boolean,
            required: true,
        }
    },

    data() {
        return {
            formats: Formats
        }
    },

    computed: {
        format() {
            return this.$store.getters['canvas/getFormat'];
        },

        heading() {
            switch (this.format) {
                case Formats.digital:
                    return this.$t('images.create.formatDigital');
                case Formats.printSelf:
                    return this.$t('images.create.formatPrintSelf');
                case Formats.printProfessional:
                    return this.$t('images.create.formatPrintProfessional');
            }
        },

        desc() {
            switch (this.format) {
                case Formats.digital:
                    return this.$t('images.create.formatDigitalHelp');
                case Formats.printSelf:
                    return this.$t('images.create.formatPrintSelfHelp');
                case Formats.printProfessional:
                    return this.$t('images.create.formatPrintProfessionalHelp');
            }
        },

        fileFormat() {
            switch (this.format) {
                case Formats.digital:
                    return 'PNG';
                case Formats.printSelf:
                case Formats.printProfessional:
                    return 'PDF';
            }
        },

        colorEncoding() {
            switch (this.format) {
                case Formats.digital:
                    return 'sRGB';
                case Formats.printSelf:
                case Formats.printProfessional:
                    return 'CMYK';
            }
        },
    },
}
</script>

<style scoped>

</style>
