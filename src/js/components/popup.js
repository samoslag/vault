Vue.component('popup', {
    template: `
    <transition name="popup">
        <div v-if="visible" class="popup">
            <div class="popup__container">
                <div v-if="title" class="popup__head">
                    <span class="popup__title">{{ title }}</span>
                    <button
                        class="popup__close-btn"
                        @click="$emit('close')"
                    >
                        <icon icon="times"/>
                    </button>
                </div>
                <div class="popup__content">
                    <slot/>
                </div>
            </div>
        </div>
    </transition>`,
    props: {
        visible: { type: Boolean, default: true },
        title: { type: String, default: "" }
    },
    created () {
        document.body.style.overflow = "hidden"
        this.$emit("created")
    },
    mounted () {
        this.$emit("mounted")
    },
    beforeDestroy() {
        document.body.style.overflow = null
        this.$emit("beforeDestroy")
    }
})