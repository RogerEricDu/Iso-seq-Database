<template>
  <div class="home-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo">
          <svg-icon icon-class="dashboard" />
          <span>Iso-Seq<span class="highlight">DB</span></span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <el-button type="primary" size="small" @click="goToDashboard" class="dashboard-btn">
            Dashboard
          </el-button>
        </div>
      </div>
    </nav>

    <!-- Hero 区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="badge">
          <span class="dot"></span>
          Iso-Seq Transcript Database
        </div>
        <h1 class="hero-title">
          Explore Full-Length<br>
          <span class="gradient-text">Transcriptome</span> with Ease
        </h1>
        <p class="hero-subtitle">
          A comprehensive database for Iso-Seq transcript analysis,
          providing high-quality full-length transcript sequences and expression data
        </p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="goToDashboard" class="btn-primary">
            Launch Database
          </el-button>
          <el-button size="large" plain @click="scrollToFeatures" class="btn-secondary">
            Learn More
          </el-button>
        </div>

        <!-- 统计信息 -->
        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">{{ stats.transcripts }}+</div>
            <div class="stat-label">Transcripts</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.genes }}+</div>
            <div class="stat-label">Genes</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.samples }}</div>
            <div class="stat-label">Samples</div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- 快速查询区域 -->
    <div id="about" class="quick-search-section">
      <div class="quick-search-card">
        <h3>Quick Search</h3>
        <p>Enter a transcript ID or gene name to get started</p>
        <div class="quick-search-input">
          <el-input
            v-model="quickKeyword"
            placeholder="e.g., transcript_001, TP53, BRCA1"
            size="large"
            @keyup.enter.native="quickSearch"
          />
          <el-button type="primary" size="large" @click="quickSearch">
            Search
          </el-button>
        </div>
<!--         <div class="example-queries">
          <span>Examples:</span>
          <el-button type="text" @click="setExample('TP53')">TP53</el-button>
          <el-button type="text" @click="setExample('transcript_001')">transcript_001</el-button>
          <el-button type="text" @click="setExample('BRCA1')">BRCA1</el-button>
        </div> -->
      </div>
    </div>

    <!-- Features 区域 -->
    <div id="features" class="features-section">
      <div class="section-header">
        <span class="section-badge">Features</span>
        <h2>Powerful Features for Transcript Analysis</h2>
        <p>Everything you need to explore and analyze Iso-Seq transcript data</p>
      </div>
      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon" :style="{ background: feature.color }">
            <svg-icon :icon-class="feature.icon" />
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <svg-icon icon-class="dashboard" />
          <span>Iso-Seq<span class="highlight">DB</span></span>
        </div>
        <p>&copy; 2024 Iso-Seq Transcript Database. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      quickKeyword: '',
      stats: {
        transcripts: 12500,
        genes: 4500,
        samples: 156
      },
      features: [
        {
          title: 'Transcript Search',
          description: 'Quickly search transcripts by ID, gene name, or genomic location with auto-complete suggestions.',
          icon: 'form',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          title: 'Expression Analysis',
          description: 'View expression levels across different samples and conditions with interactive charts.',
          icon: 'table',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          title: 'Structure Visualization',
          description: 'Explore full-length transcript sequences with coverage plots and annotation tracks.',
          icon: 'example',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
          title: 'Annotation Information',
          description: 'Access comprehensive gene and transcript annotation data.',
          icon: 'annotation-dots',
          color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
          title: 'Sample Browser',
          description: 'Browse and filter samples across different conditions and tissue types.',
          icon: 'tree',
          color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
          title: 'Data Download',
          description: 'Download transcript sequences, expression matrices, and analysis results.',
          icon: 'data',
          color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        }
      ]
    }
  },
  methods: {
    goToDashboard() {
      this.$router.push('/dashboard')
    },
    scrollToFeatures() {
      const featuresSection = document.getElementById('features')
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' })
      }
    },
    quickSearch() {
      if (this.quickKeyword.trim()) {
        // 跳转到 transcript search 页面并传递参数
        this.$router.push({
          path: '/search/information/transcriptSearch',
          query: { keyword: this.quickKeyword }
        })
      }
    },
    setExample(example) {
      this.quickKeyword = example
      this.quickSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow-x: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  animation: float 20s infinite;
}

.circle-1 {
  width: 500px;
  height: 500px;
  top: -250px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: 100px;
  left: -100px;
  animation-delay: 5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  bottom: 50%;
  right: 20%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 导航栏 */
.navbar {
  position: relative;
  z-index: 10;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: white;

  .highlight {
    color: #667eea;
  }
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;

  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }
}

.dashboard-btn {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
}

/* Hero 区域 */
.hero-section {
  position: relative;
  z-index: 10;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.2);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  color: #a8b2ff;
  margin-bottom: 30px;
  backdrop-filter: blur(5px);
}

.dot {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 20px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 32px;
  font-size: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 32px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
}

/* 统计信息 */
.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
}

/* Features 区域 */
.features-section {
  position: relative;
  z-index: 10;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.02);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-badge {
  display: inline-block;
  background: rgba(102, 126, 234, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #667eea;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 36px;
  color: white;
  margin-bottom: 16px;
}

.section-header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  ::v-deep .svg-icon {
    font-size: 28px;
    color: white;
  }
}

.feature-card h3 {
  color: white;
  font-size: 20px;
  margin-bottom: 12px;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* 快速查询区域 */
.quick-search-section {
  position: relative;
  z-index: 10;
  padding: 80px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.quick-search-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quick-search-card h3 {
  color: white;
  font-size: 28px;
  margin-bottom: 12px;
}

.quick-search-card p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
}

.quick-search-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  ::v-deep .el-input__inner {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
      border-color: #667eea;
    }
  }
}

.example-queries {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;

  ::v-deep .el-button--text {
    color: #667eea;

    &:hover {
      color: #764ba2;
    }
  }
}

/* Footer */
.footer {
  position: relative;
  z-index: 10;
  padding: 40px;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 16px;

  .highlight {
    color: #667eea;
  }
}

.footer p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
  }

  .stats {
    gap: 30px;
  }

  .stat-number {
    font-size: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .quick-search-input {
    flex-direction: column;
  }

  .nav-links {
    a:not(.dashboard-btn) {
      display: none;
    }
  }
}
</style>