Vue.component('notify', {
    template: `
    <transition-group
        name="notification"
        tag="div"
        class="notify"
    >
        <notification
            v-for="(item, index) in data"
            :key="item"
            :style="'top:' + (72 * index + 20) + 'px;'"
            :data="item"
            @remove="$root.notifications.splice(index, 1)"
        />
    </transition-group>`,
    props: {
        data: { type: Array, default: () => [] }
    }
})