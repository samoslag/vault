Vue.component('app-input', {
    template: `
    <div
        class="input"
        :class="{
            'input--active': value,
            'input--password': type === 'password',
            'input--error': error
        }"
        :key="error ? error : false"
    >
        <p
            v-if="error"
            class="input__error"
            v-html="error"
        />
        <div class="input__wrapper">
            <div v-if="icon" class="input__icon">
                <icon :icon="icon"/>
            </div>
            <input
                v-if="component === 'input'"
                class="input__input"
                :type="setType"
                :required="required"
                :value="value"
                :readonly="readonly"
                :disabled="disabled"
                :autocomplete="autocomplete"
                :autofocus="autofocus"
                :maxlength="maxlength"
                :min="min"
                :max="max"
                :placeholder="placeholder"
                @blur="$emit('blur', $event)"
                @change="$emit('change', $event)"
                @focus="$emit('focus', $event)"
                @keydown.enter="$emit('enter', $event)"
                @input="
                    $emit('input', $event)
                    $emit('update', $event.target.value)
                "
            />
            <textarea
                v-if="component === 'textarea'"
                class="input__input"
                :type="setType"
                :required="required"
                :value="value"
                :readonly="readonly"
                :disabled="disabled"
                :autocomplete="autocomplete"
                :autofocus="autofocus"
                :maxlength="maxlength"
                :min="min"
                :max="max"
                :rows="rows"
                :placeholder="placeholder"
                @blur="$emit('blur', $event)"
                @change="$emit('change', $event)"
                @focus="$emit('focus', $event)"
                @keydown.enter="$emit('enter', $event)"
                @input="
                    $emit('input', $event)
                    $emit('update', $event.target.value)
                "
            />
            <div
                v-if="label"
                class="input__label"
                v-html="label"
            />
            <button
                v-if="type === 'password'"
                class="input__toggle-visible"
                :class="{'input__toggle-visible--active': setType === 'text'}"
                :title="setType === 'password' ? 'Show password' : 'Hide password'"
                :key="setType"
                @click="toggleVisible()"
                tabindex="-1"
            >
                <icon :icon="setType === 'password' ? 'eye' : 'eye-slash'"/>
            </button>
            <div class="input__line" aria-hidden="true"/>
        </div>
    </div>
    `,
    model: {
        prop: "value",
        event: "update",
    },
    props: {
        label: { type: String, default: "" },
        value: { type: [String, Number], default: "" },
        type: { type: String, default: "text" },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        component: { type: String, default: "input" },
        rows: { type: String, default: undefined },
        readonly: { type: Boolean, default: false },
        autocomplete: { type: Boolean, default: false },
        autofocus: { type: Boolean, default: false },
        maxlength: { type: String, default: undefined },
        min: { type: String, default: undefined },
        max: { type: String, default: undefined },
        icon: { type: String, default: "" },
        placeholder: { type: String, default: "" },
        error: { type: String, default: "" }
    },
    data () {
        return  {
            setType: "text"
        }
    },
    created () {
        this.setType = this.type
    },
    methods: {
        toggleVisible () {
            if (this.setType === "text") {
                this.setType = "password"
            } else {
                this.setType = "text"
            }
        }
    }
})