Vue.component('dropdown', {
    template: `
    <div class="dropdown">
        <transition name="dropdown">
            <div v-if="visible" class="dropdown__container">
                <div class="dropdown__items">
                    <slot/>
                </div>
            </div>
        </transition>
        <overlay :visible="visible" @click="close()" opacity="0"/>
    </div>`,
    model: {
        prop: "visible",
        event: "change"
    },
    props: {
        visible: { type: Boolean, default: false }
    },
    methods: {
        close () {
            this.$emit("change", false)
        }
    }
})