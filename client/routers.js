// 懒加载貌似有毒, 在访问了超过4个children之后就没法访问了
// 采用chunk合成同步块解决问题
const auth = () => import('./components/auth/Auth.vue')
const login = () => import('./components/auth/Login.vue')
const register = () => import('./components/auth/Register.vue')

const manage = () => import('@/components/manage/Manage.vue')
const userList = () => import(/* webpackChunkName: "manage" */ '@/components/user/UserList.vue')
const userEdit = () => import(/* webpackChunkName: "manage" */ '@/components/user/UserEdit.vue')
const pokemonList = () => import(/* webpackChunkName: "manage" */ '@/components/pokemon/PokemonList.vue')
const pokemonEdit = () => import(/* webpackChunkName: "manage" */ '@/components/pokemon/PokemonEdit.vue')
const itemList = () => import(/* webpackChunkName: "manage" */ '@/components/item/ItemList.vue')
const itemEdit = () => import(/* webpackChunkName: "manage" */ '@/components/item/ItemEdit.vue')
const skillList = () => import(/* webpackChunkName: "manage" */ '@/components/skill/SkillList.vue')
const skillEdit = () => import(/* webpackChunkName: "manage" */ '@/components/skill/SkillEdit.vue')
const personList = () => import(/* webpackChunkName: "manage" */ '@/components/person/PersonList.vue')
const personEdit = () => import(/* webpackChunkName: "manage" */ '@/components/person/PersonEdit.vue')
const eggGroupList = () => import(/* webpackChunkName: "manage" */ '@/components/eggGroup/EggGroupList.vue')
const eggGroupEdit = () => import(/* webpackChunkName: "manage" */ '@/components/eggGroup/EggGroupEdit.vue')
const versionList = () => import(/* webpackChunkName: "manage" */ '@/components/version/VersionList.vue')
const versionEdit = () => import(/* webpackChunkName: "manage" */ '@/components/version/VersionEdit.vue')
const propertyList = () => import(/* webpackChunkName: "manage" */ '@/components/property/PropertyList.vue')
const propertyEdit = () => import(/* webpackChunkName: "manage" */ '@/components/property/PropertyEdit.vue')
const featureList = () => import(/* webpackChunkName: "manage" */ '@/components/feature/FeatureList.vue')
const featureEdit = () => import(/* webpackChunkName: "manage" */ '@/components/feature/FeatureEdit.vue')

export default [
  {
    path: '/',
    name: 'auth',
    component: auth,
    children: [{
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        requiredAuth: false
      }
    }, {
      path: '/register',
      name: 'register',
      component: register,
      meta: {
        requiredAuth: false
      }
    }]
  },
  {
    path: '/manage',
    name: 'manage',
    component: manage,
    meta: {
      requiredAuth: true
    },
    children: [{
      path: 'user/list',
      name: 'user-list',
      component: userList
    }, {
      path: 'user/edit/:id?',
      name: 'user-edit',
      component: userEdit
    }, {
      path: 'pokemon/list',
      name: 'pokemon-list',
      component: pokemonList
    }, {
      path: 'pokemon/edit/:id?',
      name: 'pokemon-edit',
      component: pokemonEdit
    }, {
      path: 'item/list',
      name: 'item-list',
      component: itemList
    }, {
      path: 'item/edit/:id?',
      name: 'item-edit',
      component: itemEdit
    }, {
      path: 'skill/list',
      name: 'skill-list',
      component: skillList
    }, {
      path: 'skill/edit/:id?',
      name: 'skill-edit',
      component: skillEdit
    }, {
      path: 'person/list',
      name: 'person-list',
      component: personList
    }, {
      path: 'person/edit/:id?',
      name: 'person-edit',
      component: personEdit
    }, {
      path: 'egg/list',
      name: 'eggGroup-list',
      component: eggGroupList
    }, {
      path: 'egg/edit/:id?',
      name: 'eggGroup-edit',
      component: eggGroupEdit
    }, {
      path: 'version/list',
      name: 'version-list',
      component: versionList
    }, {
      path: 'version/edit/:id?',
      name: 'version-edit',
      component: versionEdit
    }, {
      path: 'property/list',
      name: 'property-list',
      component: propertyList
    }, {
      path: 'property/edit/:id?',
      name: 'property-edit',
      component: propertyEdit
    }, {
      path: 'feature/list',
      name: 'feature-list',
      component: featureList
    }, {
      path: 'feature/edit/:id?',
      name: 'feature-edit',
      component: featureEdit
    }]
  }
]
