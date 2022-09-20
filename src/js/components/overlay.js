Vue.component('overlay', {
    template: `
    <transition name="overlay">
        <div
            v-if="visible"
            class="overlay"
            @click="$emit('click')"
            :style="'background-color: rgba(0, 0, 0, 0.' + opacity + ');'"
        />
    </transition>`,
    props: {
        visible: { type: Boolean, default: false },
        opacity: { type: String, default: "25" }
    }
})