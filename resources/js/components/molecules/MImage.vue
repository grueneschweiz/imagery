<template>
    <figure
        :style="`width: ${thumbWidth}px; height: ${thumbHeight}px;`"
        class="m-image mb-0"
    >
        <img
            class="m-image__image"
            :class="{
                transparent: data.background === 'transparent',
                'm-image__image--show-download': showDownload
            }"
            @click="toggleDetails()"
            :src="data.thumb_src"
            :alt="data.keywords"
            :style="`width: ${thumbWidth}px; height: ${thumbHeight}px;`"
            loading="lazy"
        >
        <transition name="fade"
                    enter-active-class="fadeInUp"
                    leave-active-class="fadeOutDown">
            <figcaption
                class="m-image__caption"
                v-if="open"
            >
                <p class="" v-if="loading">{{$t('images.gallery.loading')}}</p>
                <p v-else v-html="created"/>
                <div class="btn-group" role="group">
                    <button
                        :aria-expanded="showDownload"
                        class="btn btn-outline-primary btn-sm dropdown-toggle"
                        data-toggle="dropdown"
                        type="button"
                        @click="showDownload = !showDownload"
                    >
                      {{$t('images.gallery.download')}}
                    </button>
                    <div :class="{'show': showDownload}" class="m-image__download-dropdown dropdown-menu">
                        <a
                            :download="`image.${data.file_type}`"
                            :href="downloadUrlDigital"
                            class="dropdown-item"
                            @click="showDownload = false"
                        >{{$t('images.gallery.digital')}}</a>
                        <a
                            :href="downloadUrlSelfPrint"
                            class="dropdown-item"
                            download="image.pdf"
                            @click="showDownload = false"
                        >{{$t('images.gallery.selfPrint')}}</a>
                        <a
                            :class="{disabled: !data.bleed}"
                            :href="downloadUrlProfessionalPrint"
                            class="dropdown-item"
                            download="image.pdf"
                            @click="showDownload = false"
                        >{{$t('images.gallery.professionalPrint')}}</a>
                    </div>
                </div>
                <button
                    v-if="canDeleteImage"
                    @click="remove()"
                    class="btn btn-link btn-sm"
                >{{$t('images.gallery.delete')}}
                </button>
            </figcaption>
        </transition>
    </figure>
</template>

<script>
    import TimeAgo from 'javascript-time-ago';
    import english from 'javascript-time-ago/locale/en';
    import french from 'javascript-time-ago/locale/fr';
    import german from 'javascript-time-ago/locale/de';
    import {mapGetters} from "vuex";
    import Api from "../../service/Api";
    import SnackbarMixin from "../../mixins/SnackbarMixin";
    import escape from 'lodash/escape';
    import UnauthorizedHandlerMixin from "../../mixins/UnauthorizedHandlerMixin";
    import {ColorEncodings, FileFormats} from "../../service/canvas/Constants";

    const lang = {
        en: english,
        fr: french,
        de: german
    };

    TimeAgo.addLocale(lang[user.lang]);
    const timeAgo = new TimeAgo(`${user.lang}-CH`);

    export default {
        name: "MImage",
        mixins: [SnackbarMixin, UnauthorizedHandlerMixin],

        data() {
            return {
                creator: null,
                open: this.showDetails,
                showDownload: false,
            }
        },

        props: {
            data: {required: true, type: Object},
            showDetails: {required: true, type: Boolean},
            viewWidth: {required: true, type: Number},
        },

        computed: {
            ...mapGetters({
                getUserById: 'users/getById',
                loading: 'users/loading',
                currentUser: 'user/object',
            }),

            created() {
                const time = timeAgo.format(new Date(this.data.created_at));
                return this.$t('images.gallery.createdAtBy', {timeAgo: time, user: this.creatorString});
            },

            creatorString() {
                // loading
                if (null === this.creator) {
                    return '...';
                }

                // deleted
                if (false === this.creator) {
                    return this.$t('images.gallery.userUnknown');
                }

                const name = escape(`${this.creator.first_name} ${this.creator.last_name}`); // XSS: OK
                const email = encodeURIComponent(escape(this.creator.email)); // XSS: OK

                return `<a href="mailto:${email}">${name}</a>`;
            },

            canDeleteImage() {
                const superAdmin = this.currentUser.super_admin;
                const myImage = this.data.user_id === this.currentUser.id;

                return superAdmin || myImage;
            },

            thumbWidth() {
                if (this.viewWidth < 768) {
                    return this.viewWidth - 30; // see css
                }

                if (this.viewWidth < 992) {
                    return (this.viewWidth / 2) - 15; // see css
                }

                return 300; // see css
            },

            thumbHeight() {
                const imgRatio = this.data.width / this.data.height;
                return this.thumbWidth / imgRatio;
            },

            downloadUrlDigital() {
                const url = new URL(this.data.src);
                url.searchParams.append('format', this.data.file_type);
                url.searchParams.append('color_profile', ColorEncodings.sRGB);
                url.searchParams.append('bleed', '0');
                url.searchParams.append('resolution', this.data.resolution);

                return url.href
            },

            downloadUrlSelfPrint() {
                const url = new URL(this.data.src);
                url.searchParams.append('format', FileFormats.pdf);
                url.searchParams.append('color_profile', ColorEncodings.FOGRA51);
                url.searchParams.append('bleed', '0');
                url.searchParams.append('resolution', this.data.resolution);

                return url.href
            },

            downloadUrlProfessionalPrint() {
                const url = new URL(this.data.src);
                url.searchParams.append('format', FileFormats.pdf);
                url.searchParams.append('color_profile', ColorEncodings.FOGRA51);
                url.searchParams.append('bleed', '1');
                url.searchParams.append('resolution', this.data.resolution);

                return url.href
            },
        },

        methods: {
            toggleDetails() {
                this.open = !this.open;

                if (this.open) {
                    this.$emit('opened');
                } else {
                    this.showDownload = false;
                }

                if (null === this.creator){
                    // do not use users store as non admins can't use the index
                    // method. however they can query single users by id.
                    Api().get(`/users/${this.data.user_id}`)
                        .then(resp => this.creator = resp.data)
                        .catch(error => this.handleUnauthorized(error))
                        .catch(() => this.creator = false);
                }
            },

            remove() {
                Api().delete(`/images/${this.data.id}`)
                    .then(() => this.$emit('removed'))
                    .catch(error => this.handleUnauthorized(error))
                    .catch(error =>
                        this.snackErrorRetry(error, this.$t('images.gallery.deleteError'))
                            .then(this.remove)
                    );
            },
        },

        watch: {
            showDetails(value) {
                this.open = value;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .m-image {
        width: 100%;
        position: relative;
        cursor: pointer;
        overflow: hidden;

        &__image--show-download {
            overflow: visible;
        }

        &__image.transparent {
                // https://stackoverflow.com/a/35362074
                background-image: linear-gradient(45deg, #d7d7d7 25%, transparent 25%),
                linear-gradient(-45deg, #d7d7d7 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #d7d7d7 75%),
                linear-gradient(-45deg, transparent 75%, #d7d7d7 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }

        &__caption {
            animation-duration: 0.4s;
            cursor: default;
            position: absolute;
            bottom: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            padding: 0.5em;
        }

        &__download-dropdown {
            transform: translateY(0);
        }
    }
</style>
