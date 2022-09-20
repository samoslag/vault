Vue.component('notification', {
    template: `
    <div
        class="notification__wrapper"
        @click="$emit('remove')"
        @mouseover="stopTimer()"
        @mouseout="startTimer()"
    >
        <div
            class="notification"
            :class="'notification--' + data.color"
        >
        <div
                v-if="data.icon"
                class="notification__icon"
                :class="'notification__icon--' + data.icon"
            >
                <icon :icon="data.icon"/>
            </div>
            <div class="notification__content">
                <span
                    v-if="data.title"
                    class="notification__title"
                >{{ data.title }}</span>
                <span
                    v-if="data.text"
                    class="notification__text"
                >{{ data.text }}</span>
            </div>
            
        </div>
    </div>`,
    props: {
        data: { type: Object, default: () => {} }
    },
    created () {
        this.startTimer()
    },
    beforeDestroy() {
        this.stopTimer()
    },
    methods: {
        startTimer () {
            this.$options.timer = setTimeout(() => {
                this.$emit("remove")
            }, 3000)
        },
        stopTimer () {
            clearTimeout(this.$options.timer)
        }
    },
    timer: null
})