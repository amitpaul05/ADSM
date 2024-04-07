import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
      // component: () => import('../views/AppointmentView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/SignInView.vue')
      component: () => import('../views/SignInView.vue'),
    },

    {
      path: '/appointment',
      name: 'appointment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AppointmentView.vue')
    },
    {
      path: '/apoints/:id', // Dynamic path with ":id"
      name: 'appoint-detail',
      component: () => import('../views/TrackAppointView.vue'),
      props: true // Pass route params as props to the component
    }
    // {
    //   path: '/additional-info',
    //   name: 'edit',
    //   component: () => import('../views/DocAdditionalInfoView.vue'),
      
    //   meta: {
    //     requiresAuth : true,
    //   }
    // }
  ]
})

// const getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     const removeListener = onAuthStateChanged(
//       getAuth(),
//       (user) =>{
//         removeListener();
//         resolve(user);
//       },
//       reject,
//     )
//   })
// }

// router.beforeEach(async (to, from, next) => {
//   if(to.matched.some((record) => record.meta.requiresAuth)) {
//     if (await getCurrentUser()) {
//       next();
//     }
//     else{
//       alert('you do not have acces')
//       next('/')
//     }
//   }
//   else {
//     next();
//   }
// });

export default router
