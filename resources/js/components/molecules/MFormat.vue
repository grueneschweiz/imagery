<template>
    <div class="form-group">
        <label class="mb-0 d-block">{{ $t('images.create.format') }}</label>
        <div class="btn-group btn-group-toggle">
            <label :class="{'active': format === formats.digital}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="format"
                    :value="formats.digital"
                    name="format"
                    type="radio"
                >{{ $t('images.create.formatDigital') }}
            </label>
            <label :class="{'active': format === formats.printSelf}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="format"
                    :value="formats.printSelf"
                    name="format"
                    type="radio"
                >{{ $t('images.create.formatPrintSelf') }}
            </label>
            <label :class="{'active': format === formats.printProfessional}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="format"
                    :value="formats.printProfessional"
                    name="format"
                    type="radio"
                >{{ $t('images.create.formatPrintProfessional') }}
            </label>
        </div>

        <button
            :title="$t('images.create.help')"
            class="btn btn-link btn-sm btn-link pt-0 pb-0"
            @click="showHelp = !showHelp"
        >
            <i class="mdi mdi-help-outline"></i>
        </button>

        <AFormatHelp
            v-model="showHelp"
        />
    </div>
</template>

<script>
import {Formats} from "../../service/canvas/Constants";
import AFormatHelp from "../atoms/AFormatHelp.vue";

export default {
    name: "MFormat",
    components: {AFormatHelp},

    data() {
        return {
            formats: Formats,
            showHelp: false,
        }
    },

    computed: {
        format: {
            get() {
                return this.$store.getters['canvas/getFormat'];
            },
            set(value) {
                this.$store.commit('canvas/setFormat', value);
            },
        }
    },
}
</script>

<style scoped>

</style>
