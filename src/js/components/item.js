Vue.component('item', {
    template: `
    <div class="list-item__wrapper">
        <div class="list-item__add-section">
            <button
                class="list-item__add-btn"
                @click="$emit('add')"
            >
                <icon icon="add"/>
            </button>
        </div>
        <div class="list-item">
            <div class="list-item__main">
                <div class="list-item__title">{{ data.title }}</div>
                <div
                    v-if="
                        data.username ||
                        data.email ||
                        data.key ||
                        data.hint
                    "
                    class="list-item__info"
                >
                    <div
                        v-for="(item, index) in generateItems"
                        :key="item.id"
                        class="list__info-item"
                        tabindex="0"
                        @focus="select(item.name)"
                    >
                        <icon :icon="item.icon"/>
                        <span :ref="item.name">{{ data[item.name] }}</span>
                    </div>
                </div>
                <p
                    v-if="data.note"
                    v-html="linkify(data.note)"
                    class="list-item__note"
                ></p>
            </div>
            <div class="list-item__hidden-info">
                <div
                    v-if="data.password"
                    tabindex="0"
                    class="list-item__password"
                    @focus="showPassword = true"
                    @blur="showPassword = false"
                >
                    <div
                        v-if="!showPassword"
                        class="list-item__hidden-password"
                        >
                        <icon
                            v-for="i in data.password.length"
                            :key="i"
                            icon="circle"
                        />
                    </div>
                    <span v-if="showPassword">{{ data.password }}</span>
                </div>
                <app-button
                    v-if="data.password"
                    class="list-item__copy"
                    :class="{'list-item__copy--copied': copied}"
                    :icon="copied ? 'check' : 'clone'"
                    :text="copied ? 'Copied' : 'Copy'"
                    size="small"
                    @click="copy()"
                />
                <app-button
                    class="list-item__more"
                    :class="{'list-item__more--active': dropdown}"
                    icon="dots"
                    size="small"
                    @click="dropdown = !dropdown"
                />
                <dropdown
                    v-model="dropdown"
                    class="list-item__dropdown"
                >
                    <app-button
                        class="list-item__edit-btn"
                        icon="edit"
                        text="Edit"
                        @click="
                            $emit('edit')
                            dropdown = false
                        "
                    />
                    <app-button
                        v-if="location !== 'both' && location !== 'top'"
                        class="list-item__move-btn"
                        icon="arrow-up"
                        text="Move up"
                        @click="
                            $emit('move', -1)
                            dropdown = false
                        "
                    />
                    <app-button
                        v-if="location !== 'both' && location !== 'bottom'"
                        class="list-item__move-btn"
                        icon="arrow-down"
                        text="Move down"
                        @click="
                            $emit('move', 1)
                            dropdown = false
                        "
                    />
                    <app-button
                        icon="trash"
                        text="Remove"
                        @click="remove()"
                    />
                </dropdown>
            </div>
        </div>
    </div>`,
    items: [
        {
            name: "username",
            icon: "user"
        },
        {
            name: "email",
            icon: "email"
        },
        {
            name: "key",
            icon: "key"
        },{
            name: "hint",
            icon: "bulb"
        }
    ],
    copiedTimer: null,
    data () {
        return {
            showPassword: false,
            copied: false,
            dropdown: false
        }
    },
    props: {
        data: { type: Object, default: () => {} },
        location: { type: String, default: "" }
    },
    computed: {
        generateItems () {
            return this.$options.items.filter(item => this.data[item.name])
        }
    },
    methods: {
        select (ref) {
            let el = this.$refs[ref][0]
            let range = document.createRange()
            range.selectNode(el)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(range)
        },
        copy () {
            let el = document.createElement("textarea")
            el.value = this.data.password
            document.body.appendChild(el)
            el.select()
            el.setSelectionRange(0, 99999) // For mobile devices
            document.execCommand("copy")
            document.body.removeChild(el)

            if (this.copied) {
                clearTimeout(this.$options.copiedTimer)
            } else {
                this.copied = true
            }
            this.$options.copiedTimer = setTimeout(() => {
                this.copied = false
            }, 3000)
        },
        linkify (text) {
            let urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '" target="_blank">' + url + '</a>'
            })
        },
        remove () {
            this.dropdown = false
            this.$nextTick(() => this.$emit('remove'))
        }
    }
})