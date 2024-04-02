<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import { inject } from 'vue';

const { is_loggedin, onetimesignup, hasSpecificField } = inject('authState');

const is_expended = ref(false)


const togglemenushow = () => {
    if (is_expended.value != true) {
        is_expended.value = !is_expended.value
    }
}


const togglemenuhide = () => {
    if (is_expended.value != false) {
        is_expended.value = !is_expended.value
    }
}
const togglemenu = () => {
    is_expended.value = !is_expended.value
}
</script>

<template>
    <aside :class="`${is_expended && 'is-expended'}`" @mouseenter="togglemenushow" @mouseleave="togglemenuhide">
        <div class="menu-toggle-wrap">
            <button @click="togglemenu" class="menu-toggle">
                <font-awesome-icon :icon="['fas', 'angle-double-right']" class="toggle-btn" />
            </button>
        </div>
        <div class="logo">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
        </div>
        <div class="devider">
            <hr>
        </div>
        <div class="menu">
            <RouterLink to="/" class="duration-300">
                <transition :name="$route.meta.transition || 'fade'">
                    <div class="nav-link">
                        <font-awesome-icon :icon="['fas', 'house']" class="menu-icon" /> <span class="text">Home</span>
                    </div>
                </transition>
            </RouterLink>
            <RouterLink to="/about" class="duration-500">
                <transition :name="$route.meta.transition || 'fade'">
                    <div class="nav-link">
                        <span><font-awesome-icon :icon="['fas', 'eye']" class="menu-icon" /></span>
                        <span class="text">About</span>

                    </div>
                </transition>
            </RouterLink>
            <div v-if="is_loggedin">
                <RouterLink to="/sign-in">
                    <transition :name="$route.meta.transition || 'fade'">
                        <div class="nav-link">
                            <span><font-awesome-icon :icon="['fas', 'user-plus']" class="menu-icon" /></span>
                            <span class="text">sign-in</span>
                        </div>
                    </transition>
                </RouterLink>
            </div>

        </div>

    </aside>
</template>

<style lang="scss" scoped>
a {
    display: flex;
}

aside {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: var(--dark);
    color: var(--light);
    padding: 1rem;
    width: calc(2rem + 2rem);
    height: 100vh;
    border-radius: 0 15px 15px 0;
    transform: 0.4s ease-out;
    transition: 0.4s ease-in;
    overflow: hidden;

    .menu {
        width: 4rem;
        transition: 0.3s cubic-bezier(0.4, -0.3, 0.99, 0.95);
        padding-top: 2rem;

        .router-link-exact-active {
            display: flex;
            margin-left: -8px;
            border-radius: 10px;
            background-color: var(--dark-alt);
            max-height: 30px;

        }

        .nav-link {
            display: flex;
            font-size: 1.2rem;
            padding: 4px;
            margin-left: 15px;


            .menu-icon {
                margin-right: 1rem;
            }

        }

        .text {
            opacity: 0;
            transition: 0.2s ease-out;
            overflow: hidden;
        }


    }

    .devider {
        width: 0.2rem;
        transition: 0.4s ease-out;
    }


    .logo {
        margin-bottom: 1rem;
        margin-top: 1rem;
        transform: rotate(-90deg);

        img {
            width: 2rem;
            transition: 0.4s ease-out;
        }
    }



    .menu-toggle-wrap {
        display: flex;
        transition: 0.4s ease-out;

        position: relative;
        top: 0;

        .menu-toggle {
            transition: 0.5s ease-out;

            .toggle-btn {
                color: var(--light);
            }

            &:hover {
                .toggle-btn {
                    color: var(--primary);
                    transform: translateX(0.5rem);
                }
            }
        }
    }

    &.is-expended {
        .devider {
            width: 8rem;
            transition: 0.4s ease-out;
        }

        align-items: center;
        width: var(--sidebar-width);
        transition: 0.4s ease-out;

        .logo {
            img {
                width: 6rem;
                transition: 0.4s ease-out;
            }
        }

        .menu {
            // display: grid;
            width: var(--sidebar-width);
            transition: 0.3s cubic-bezier(0.4, -0.3, 0.99, 0.95);

            .router-link-exact-active {
                width: 270px;
                margin-left: 4%;
                border-radius: 10px;
                background-color: var(--dark-alt);
            }

            .nav-link {
                display: flex;
                width: 270px;
                justify-content: flex-start;

                margin-left: 15px;
                border-radius: 10px;


            }

            .text {
                opacity: 1;
                transition: 0.4s ease-in;
            }

        }



        .nav-link:hover {
            background-color: var(--dark-alt);
        }

        .menu-toggle-wrap {
            justify-content: flex-end;

            // margin-top: -3rem;
            .menu-toggle {
                transform: rotate(-180deg);
                transition: 0.5s ease-out;

            }
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }


}
</style>