<template>
    <div v-if="! logoType && usableStyleSets.length > 1" class="form-group">
        <label class="mb-0 d-block">{{$t('images.create.styleSet')}}</label>
        <div class="btn-group btn-group-toggle">
            <label :class="{'active': styleSet === styleSetTypes.green}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="styleSet"
                    :value="styleSetTypes.green"
                    name="background"
                    type="radio"
                >{{$t('images.create.styleSetGreen')}}
            </label>
            <label :class="{'active': styleSet === styleSetTypes.young}"
                   class="btn btn-secondary btn-sm">
                <input
                    v-model="styleSet"
                    :value="styleSetTypes.young"
                    name="background"
                    type="radio"
                >{{$t('images.create.styleSetYoung')}}
            </label>
        </div>
    </div>
</template>

<script>
    import {StyleSetTypes, LogoTypes} from "../../service/canvas/Constants";
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
            }
        },

        mounted() {
            if (this.usableStyleSets.length === 1) {
                this.styleSet = this.usableStyleSets[0]
            }
        },

        watch: {
            logoType(type) {
                this.styleSet = this.getStyleSetFromLogoType(type)
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>
