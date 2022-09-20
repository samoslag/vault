Vue.component('app-button', {
    template: `
    <button
        class="button"
        :class="{
            'button--small': size === 'small',
            'button--large': size === 'large',
            'button--primary': type === 'primary',
            'button--transparent': type === 'transparent',
            'button--loading': loading
        }"
        :disabled="disabled || loading"
        @click="$emit('click')"
    >
        <div v-if="icon" class="button__icon">
            <icon :icon="icon"/>
        </div>
        <span v-if="text || $slots.default">
            {{ text }}
            <slot/>
        </span>
    </button>`,
    props: {
        text: { type: "String", default: "" },
        icon: { type: String, default: "" },
        size: { type: String, default: "" },
        type: { type: String, default: "" },
        disabled: { type: Boolean, default: false },
        loading: { type: Boolean, default: false }
    }
})