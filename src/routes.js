import HomePage from './pages/home.vue';
import About from './pages/About.vue';
import NotFoundPage from './pages/not-found.vue';

import MySchedule from './pages/schedule/MySchedule'
import GroupSchedule from './pages/schedule/GroupSchedule'
import ViewEvent from './pages/schedule/ViewEvent'
import CreateEvent from './pages/schedule/CreateEventMobile'
import SignUp from './pages/signup.vue';
import CreateGroup from './pages/creategroup.vue';
import Enroll from './pages/enroll.vue';
import StartUp from './pages/startup.vue';

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
    path: '/about/',
    component: About,
  },
  {
    path :'/my-schedule/',
    component: MySchedule,
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
    path: '/group/:groupId/',
    component: Group
  },
  {
    path: '/group/:groupId/schedule/',
    component: GroupSchedule
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
