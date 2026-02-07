// 呈现结构如下：
Layout (最外层容器)
├── DrawerBg (移动端遮罩，点击关闭侧边栏)
├── Sidebar (左侧导航菜单)
└── MainContainer (右侧主区域)
    ├── Navbar (顶部导航)
    └── AppMain (主要内容页，内部有 <router-view> 显示路由页面)
