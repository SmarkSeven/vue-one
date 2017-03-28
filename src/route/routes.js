import Home from '../components/Home';
import Profile from '../components/Profile';
import A from '../components/A';
import B from '../components/B';
import C from '../components/C';
import Search from '../components/Search';
import EssayPage from '../components/EssayPage';
import MusicPage from '../components/MusicPage';
import MoviePage from '../components/MoviePage';
import QuestionPage from '../components/QuestionPage';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/reading',
    component: Home,
  },
  {
    path: '/music',
    component: Home,
  },
  {
    path: '/movie',
    component: Home,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/profile/ablsum',
    component: A,
  },
  {
    path: '/profile/right',
    component: C,
  },
  {
    path: 'right',
    component: B,
  },
  {
    path: '/essay/:id',
    component: EssayPage,
  },
  {
    path: '/music/:id',
    component: MusicPage,
  },
  {
    path: '/movie/:id',
    component: MoviePage,
  },
  {
    path: '/question/:id',
    component: QuestionPage,
  },
];

export default routes;
