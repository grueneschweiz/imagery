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
            <li>{{ $t('images.create.colorProfile', {'profile': colorProfile}) }}</li>
            <template v-if="format !== formats.digital">
                <li>{{ $t('images.create.resolution') }}</li>
                <li v-if="bleed">{{
                        $t('images.create.bleedAndCropMarks', {bleed: `${bleed}mm`})
                    }}
                </li>
                <li v-else>{{ $t('images.create.noBleed') }}</li>
            </template>
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
import {ColorEncodings, Formats} from "../../service/canvas/Constants";
import {mapGetters} from "vuex";

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
            formats: Formats,
        }
    },

    computed: {
        ...mapGetters({
            format: 'canvas/getFormat',
            fileFormat: 'canvas/getFileFormat',
            colorEncoding: 'canvas/getColorEncoding',
            bleed: 'canvas/getBleed',
        }),

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

        colorProfile() {
            switch (this.colorEncoding) {
                case ColorEncodings.sRGB:
                    return 'sRGB';
                case ColorEncodings.FOGRA51:
                    return 'CMYK (PSO coated v3 / FOGRA51)';
            }
        },
    },
}
</script>

<style scoped>

</style>
