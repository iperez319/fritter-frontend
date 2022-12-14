import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import FreetDetailPage from './components/Freet/FreetDetailPage.vue';
import CommentDetailPage from './components/Comment/CommentDetailPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import VersionPage from './components/Version/VersionPage.vue';
import ProfilePage from './components/Account/ProfilePage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/freets/:freetId', name: 'Freet Detail', component: FreetDetailPage},
  {path: '/comments/:commentId', name: 'Comment Detail', component: CommentDetailPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/profile/:username', name: 'Profile Page', component: ProfilePage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/version/:parentId', name: 'Version History', component: VersionPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

const secured_routes = ['Freet Detail', 'Comment Detail', 'Version History']

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (secured_routes.includes(to.name) && !router.app.$store.state.username) {
      next({name: 'Login'});
      return;
    }
  }

  next();
});

export default router;
