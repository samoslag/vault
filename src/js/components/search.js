Vue.component('search', {
    template: `
    <div class="search">
        <button
            v-if="value"
            class="search__clear"
            @click="$emit('update', '')"
        >
            <icon icon="times"/>
        </button>
        <app-input
            class="search__input"
            placeholder="Search ..."
            :icon="value ? '' : 'search'"
            :value="value"
            @update="$emit('update', $event)"
        />
    </div>`,
    model: {
        prop: "value",
        event: "update",
    },
    props: {
        value: { type: String, default: "" }
    }
})