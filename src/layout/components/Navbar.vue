<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu" v-if="!isHomePage">
      <el-button 
        type="primary" 
        size="small" 
        @click="goToHome"
        class="home-btn"
      >
        <i class="el-icon-s-home"></i>
        Back to Home
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // 判断是否在首页
    isHomePage() {
      return this.$route.path === '/'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    flex: 1;
    margin-left: 10px;
  }

  .right-menu {
    margin-right: 20px;
    
    .home-btn {
      padding: 8px 16px;
      font-size: 14px;
      
      i {
        margin-right: 5px;
      }
    }
  }
}
</style>