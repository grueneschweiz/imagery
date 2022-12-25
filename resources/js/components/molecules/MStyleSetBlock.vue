<template>
    <div v-if="! logoType && usableStyleSets.length > 1" class="form-group">
        <label class="mb-0 d-block">{{$t('images.create.styleSet')}}</label>
        <div class="btn-group btn-group-toggle">
            <label :class="{'active': isGreenStyleSet}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="styleSet"
                    :value="greenStyleSetButtonValue"
                    name="styleSet"
                    type="radio"
                >{{$t('images.create.styleSetGreen')}}
            </label>
            <label :class="{'active': styleSet === styleSetTypes.young}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="styleSet"
                    :value="styleSetTypes.young"
                    name="styleSet"
                    type="radio"
                >{{$t('images.create.styleSetYoung')}}
            </label>
        </div>
    </div>
</template>

<script>
    import {StyleSetTypes, LogoTypes} from "../../service/canvas/Constants";
    import {ImageSizes} from "../../service/canvas/ImageSizes";
    import {mapGetters} from "vuex";

    export default {
        name: "MStyleSetBlock",

        data() {
            return {
                styleSetTypes: StyleSetTypes,
            }
        },

        computed: {
            ...mapGetters({
              getLogoById: 'logosUsable/getById',
              usableLogos: 'logosUsable/getAll',
              currentLogoId: 'canvas/getLogoId',
              selectedImageSize: 'canvas/getSelectedImageSize',
            }),

            styleSet: {
                get() {
                    return this.$store.getters['canvas/getStyleSet'];
                },
                set(value) {
                    this.$store.commit('canvas/setStyleSet', value);
                },
            },

            logoType() {
                if (! this.currentLogoId) {
                    return null
                }

                const logo = this.getLogoById(this.currentLogoId)

                if (! logo) {
                    return null;
                }

                return logo.type
            },

            usableLogoTypes() {
                return this.usableLogos
                    .map(logo => logo.type)
                    .filter((type, index, array) => array.indexOf(type) === index)
            },

            usableStyleSets() {
                const logoTypes = this.usableLogoTypes

                if (logoTypes.length === 0) {
                    return [
                        StyleSetTypes.green,
                        StyleSetTypes.young
                    ]
                }

                return logoTypes
                  .map(this.getStyleSetFromLogoType)
            },

            logoDefaultStyleSet() {
                if (!this.logoType) {
                    return null;
                }

                return this.getStyleSetFromLogoType(this.logoType);
            },

            greenStyleSetButtonValue() {
                return this.selectedImageSize === ImageSizes.fbCoverGreen
                    ? StyleSetTypes.greenCentered
                    : StyleSetTypes.green;
            },

            isGreenStyleSet() {
                return this.styleSet === StyleSetTypes.green
                    || this.styleSet === StyleSetTypes.greenCentered
            }
        },

        methods: {
            getStyleSetFromLogoType(logoType) {
                switch (logoType) {
                    case LogoTypes["giovani-verdi"]:
                    case LogoTypes["jeunes-vert-e-s"]:
                    case LogoTypes["junge-gruene"]:
                        return StyleSetTypes.young

                    default:
                      return StyleSetTypes.green
                }
            },

            applyCorrectStyleSet() {
                const style = this.logoDefaultStyleSet || this.styleSet;

                if (StyleSetTypes.young === style) {
                    this.styleSet = StyleSetTypes.young;
                } else if (ImageSizes.fbCoverGreen === this.selectedImageSize) {
                    this.styleSet = StyleSetTypes.greenCentered;
                } else {
                    this.styleSet = StyleSetTypes.green;
                }
            },
        },

        mounted() {
            if (this.usableStyleSets.length === 1) {
                this.styleSet = this.usableStyleSets[0]
            }
        },

        watch: {
            logoType() {
                this.applyCorrectStyleSet();
            },

            selectedImageSize() {
                this.applyCorrectStyleSet();
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>
