Vue.component('vault', {
    template: `
    <div class="vault">
        <app-header
            @addItem="itemPopup = true"
            v-model="search"
            :highlightSave="changed"
        />
        <transition-group
            v-if="list"
            name="list-item"
            tag="div"
            class="list"
        >
            <item
                v-for="(item, index) in list"
                :key="item.id"
                :data="item"
                :location="itemLocation(index)"
                @remove="removeItem(item.id)"
                @move="move(index, $event)"
                @add="
                    itemPopup = true
                    addIndex = data.indexOf(item)
                "
                @edit="
                    itemPopup = true
                    activeItem = item
                "
            />
        </transition-group>
        <div
            v-if="!list || list.length <= 0"
            class="vault__empty-notice"
        >
            <p v-if="search">Search couldn't find any matching titles</p>
            <p v-else>Your list is empty</p>
        </div>
        <item-popup
            v-model="itemPopup"
            :data="activeItem"
            @close="activeItem = null"
            @confirm="saveItem($event)"
        />
    </div>`,
    data () {
        return {
            itemPopup: false,
            activeItem: null,
            addIndex: null,
            search: ""
        }
    },
    props: {
        data: { type: Array, default: () => [] },
        changed: { type: Boolean, default: false }
    },
    computed: {
        list () {
            if (!this.search) {
                return this.data
            } else {
                let search = this.search.toLowerCase().trim().split(" ")
                let list = this.data.filter((item) => {
                    let title = item.title.toLowerCase().trim().split(" ")
                    let fullMatch = true
                    
                    for (let i = 0; i < search.length; i++) {
                        let match = false
                        for (let j = 0; j < title.length; j++) {
                            if (title[j].indexOf(search[i]) > -1) {
                                match = true
                                title.splice(j, 1)
                                break
                            }
                        }
                        if (!match) {
                            fullMatch = false
                            break
                        }
                    }
                    
                    if (fullMatch) return item
                })

                return list
            }
        }
    },
    created () {
        document.onkeydown = this.handleEscape
        document.onkeypress = this.hotSearch
    },
    beforeDestroy() {
        document.onkeydown = null
        document.onkeypress = null
    },
    methods: {
        saveItem (item) {
            if (item.id) {
                if (JSON.stringify(this.activeItem) !== JSON.stringify(item)) {
                    this.$root.notify({
                        icon: "check",
                        color: "success",
                        title: "Updated",
                        text: item.title
                    })
                }

                let index = this.data.indexOf(this.activeItem)
                Vue.set(this.data, index, item)
            } else {
                let id = 1
                if (this.data.length > 0) {
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].id > id) id = this.data[i].id
                    }
                }
                item.id = id + 1
                if (this.addIndex !== null) {
                    if (this.addIndex === 0) {
                        this.data.unshift(item)
                    } else {
                        this.data.splice(this.addIndex, 0, item)
                    }
                } else {
                    this.data.push(item)
                }

                this.$root.notify({
                    icon: "check",
                    color: "success",
                    title: "Added",
                    text: item.title
                })
            }

            this.$nextTick(() => {
                if (!this.activeItem && this.addIndex === null) window.scroll({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' })
                this.itemPopup = false
                this.activeItem = null
                this.addIndex = null
            })
        },
        removeItem (id) {
            const index = this.data.indexOf(this.data.find(item => item.id === id))
            this.$root.notify({
                icon: "trash",
                color: "error",
                title: "Removed",
                text: this.data[index].title
            })
            this.data.splice(index, 1)
        },
        move (index, move) {
            let target = this.data[this.data.indexOf(this.list[index + move])]
            Vue.set(this.data, this.data.indexOf(this.list[index + move]), { ...this.data[this.data.indexOf(this.list[index])] })
            Vue.set(this.data, this.data.indexOf(this.list[index]), { ...target })
        },
        itemLocation (index) {
            if (this.list.length === 1) return "both"
            if (index === 0) return "top"
            if (index + 1 === this.list.length) return "bottom"
            return ""
        },
        hotSearch (event) {
            if (
                !this.itemPopup &&
                !this.$root.passwordPopup && 
                document.activeElement.tagName !== 'input' &&
                event.keyCode !== 13 // Enter
            ) {
                let searchInput = document.getElementsByClassName("search__input")[0].getElementsByTagName("input")[0]
                searchInput.focus()
            }
        },
        handleEscape (event) {
            if (event.keyCode === 27) {

                if (this.itemPopup) {
                    this.itemPopup = false
                    return
                }

                if (this.$root.passwordPopup) {
                    this.$root.passwordPopup = false
                    return
                }

                let searchInput = document.getElementsByClassName("search__input")[0].getElementsByTagName("input")[0]
                if (this.search || document.activeElement === searchInput) {
                    this.search = ""
                    document.activeElement.blur()
                    return
                }

                this.$emit("logout")
            }
        }
    }
})