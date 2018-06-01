import HomePage from './pages/home.vue';
import About from './pages/About.vue';
import FormPage from './pages/form.vue';
import DynamicRoutePage from './pages/dynamic-route.vue';
import NotFoundPage from './pages/not-found.vue';

import Schedule from './pages/schedule/ScheduleMobile'
import ViewEvent from './pages/schedule/ViewEvent'
import CreateEvent from './pages/schedule/CreateEventMobile'
import SignUp from './pages/signup.vue';
import CreateGroup from './pages/creategroup.vue';
import Enroll from './pages/enroll.vue';
import StartUp from './pages/startup.vue';

import PanelLeftPage from './pages/panel-left.vue';
import PanelRightPage from './pages/panel-right.vue';

import Panel from './pages/Component/Panel';
import Profile from './pages/User/Profile';
import MyGroup from './pages/Group/MyGroup';
import Group from './pages/Group/Group';

export default [
  {
    path: '/startup',
    component : StartUp,
  },
  {
    path: '/enroll-group/',
    component : Enroll,
  },
  {
    path: '/create-group/',
    component : CreateGroup,
  },
  {
    path: '/signup',
    component : SignUp
  },
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage,
  },
  {
    path: '/panel-right/',
    component: PanelRightPage,
  },
  {
    path: '/about/',
    component: About,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path :'/my-schedule/',
    component: Schedule,
  },
  {
    path :'/event/',
    component: ViewEvent,
  },
  {
    path :'/create-event/',
    component: CreateEvent,
  }
  ,{
    path: '/panel/',
    component: Panel,
  },
  {
      path: '/profile/',
      component: Profile
  },
  {
      path: '/my-group/',
      component: MyGroup
  },
  {
      path: '/group/:groupId',
      component: Group
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
