<template>
    <div class="blog-container">
        <!-- 粒子背景 -->
        <div id="particles-js"></div>

        <div class="content-wrapper">
            <!-- 头部标题/导航 -->
            <header class="blog-header">
                <h1 class="logo">My Markdown Blog</h1>
                <div class="actions">
                    <button class="btn-modern btn-primary" @click="$router.push({ name: 'create' })">
                        <i class="icon-plus"></i> 新建文章
                    </button>
                </div>
            </header>

            <main class="main-layout">
                <!-- 左侧文章列表 -->
                <section class="articles-column">
                    <div class="filter-status" v-if="filterDate || filterTag">
                        <span>正在筛选: {{ filterDate || filterTag }}</span>
                        <a href="javascript:;" @click="clearFilter">清除筛选</a>
                    </div>
                    <div class="article-card" v-for="(item, index) in filteredList" :key="item.id">
                        <div class="card-header">
                            <span class="author-badge"><i class="icon-user"></i> {{ item.author }}</span>
                            <span class="date-badge"><i class="icon-time"></i> {{ formatTime(item.created_at) }}</span>
                        </div>
                        <div class="card-content">
                            <router-link :to="{ path: 'article/' + item.id }" class="article-title">
                                {{ item.title }}
                            </router-link>
                            <p class="article-excerpt">{{ getExcerpt(item.content) }}</p>
                        </div>
                        <div class="card-footer">
                            <div class="tags">
                                <span class="tag" v-for="tag in getTags(item.content)" :key="tag"
                                    @click.stop="filterByTag(tag)">
                                    #{{ tag }}
                                </span>
                            </div>
                            <router-link :to="{ name: 'edit', params: { id: item.id } }" class="btn-edit-icon"
                                title="编辑文章">
                                <i class="icon-edit"></i>
                            </router-link>
                        </div>
                    </div>
                    <div v-if="filteredList.length === 0" class="no-data">
                        暂无相关文章
                    </div>
                </section>

                <!-- 右侧工具栏 -->
                <aside class="sidebar-column">
                    <!-- 日历组件 -->
                    <div class="sidebar-block glass-card">
                        <h3 class="sidebar-title">日历</h3>
                        <div class="calendar-widget">
                            <div class="calendar-header">
                                <button @click="prevMonth">&lt;</button>
                                <span>{{ currentYM }}</span>
                                <button @click="nextMonth">&gt;</button>
                            </div>
                            <div class="calendar-weekdays">
                                <span v-for="d in weekdays" :key="d">{{ d }}</span>
                            </div>
                            <div class="calendar-grid">
                                <div v-for="(day, idx) in calendarDays" :key="idx"
                                    :class="['calendar-day', { 'other-month': !day.isCurrentMonth, 'has-article': day.count > 0, 'selected': filterDate === day.fullDate }]"
                                    @click="filterByDate(day.fullDate)">
                                    {{ day.date }}
                                    <span class="dot" v-if="day.count > 0"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 标签云 -->
                    <div class="sidebar-block glass-card">
                        <h3 class="sidebar-title">标签云</h3>
                        <div class="tag-cloud">
                            <div v-for="(count, tag) in allTags" :key="tag"
                                :class="['cloud-tag', { 'active': filterTag === tag }]" @click="filterByTag(tag)">
                                <i class="icon-tag"></i>
                                <span class="tag-name">{{ tag }}</span>
                                <span class="tag-count">({{ count }})</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            <!-- 底部页脚与友情链接 -->
            <footer class="blog-footer glass-card">
                <div class="footer-section">
                    <h3 class="footer-title">友情链接</h3>
                    <div class="friend-links">
                        <a href="https://vuejs.org/" target="_blank" class="friend-link">Vue.js</a>
                        <a href="https://nodejs.org/" target="_blank" class="friend-link">Node.js</a>
                        <a href="https://github.com/" target="_blank" class="friend-link">GitHub</a>
                        <a href="https://google.com/" target="_blank" class="friend-link">Google</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 My Markdown Blog. Built with Love.</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mdList: [],
            filterDate: null,
            filterTag: null,
            viewDate: new Date(), // 用于日历显示的基准日期
            weekdays: ['日', '一', '二', '三', '四', '五', '六']
        }
    },
    computed: {
        filteredList() {
            return this.mdList.filter(item => {
                let matchDate = true
                let matchTag = true
                if (this.filterDate) {
                    let d = new Date(item.created_at)
                    let ymd = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
                    matchDate = ymd === this.filterDate
                }
                if (this.filterTag) {
                    matchTag = this.getTags(item.content).includes(this.filterTag)
                }
                return matchDate && matchTag
            })
        },
        currentYM() {
            return `${this.viewDate.getFullYear()}年${this.viewDate.getMonth() + 1}月`
        },
        calendarDays() {
            const year = this.viewDate.getFullYear()
            const month = this.viewDate.getMonth()
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)

            const startDay = firstDay.getDay()
            const totalDays = lastDay.getDate()

            let days = []

            // 上个月补充
            const prevMonthLastDay = new Date(year, month, 0).getDate()
            for (let i = startDay - 1; i >= 0; i--) {
                days.push({
                    date: prevMonthLastDay - i,
                    isCurrentMonth: false,
                    fullDate: null
                })
            }

            // 本月
            for (let i = 1; i <= totalDays; i++) {
                let dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
                let count = this.mdList.filter(item => {
                    let d = new Date(item.created_at)
                    let ymd = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
                    return ymd === dateStr
                }).length

                days.push({
                    date: i,
                    isCurrentMonth: true,
                    fullDate: dateStr,
                    count: count
                })
            }

            // 下个月补充
            const remaining = 42 - days.length
            for (let i = 1; i <= remaining; i++) {
                days.push({
                    date: i,
                    isCurrentMonth: false,
                    fullDate: null
                })
            }

            return days
        },
        allTags() {
            let tags = {}
            this.mdList.forEach(item => {
                this.getTags(item.content).forEach(t => {
                    tags[t] = (tags[t] || 0) + 1
                })
            })
            return tags
        }
    },
    mounted() {
        this.fetchArticles()
        this.initParticles()
    },
    methods: {
        fetchArticles() {
            var that = this
            this.$http.get('/api/article/listArticles')
                .then((response) => {
                    that.mdList = response.body.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                })
        },
        initParticles() {
            if (window.particlesJS) {
                particlesJS('particles-js', {
                    "particles": {
                        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                        "color": { "value": "#42b983" },
                        "shape": { "type": "circle" },
                        "opacity": { "value": 0.5, "random": false },
                        "size": { "value": 3, "random": true },
                        "line_linked": { "enable": true, "distance": 150, "color": "#42b983", "opacity": 0.4, "width": 1 },
                        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }
                    },
                    "retina_detect": true
                })
            }
        },
        formatTime(time) {
            if (!time) return ''
            let date = new Date(time)
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        },
        getExcerpt(content) {
            if (!content) return ''
            let lines = content.split('\n')
            // 模式：匹配由三个及以上 -, *, _ 组成的水平线行
            const hrRegex = /^([-*_])\1{2,}$/

            let mainText = lines.filter((line, index) => {
                let trimmed = line.trim()
                // 过滤前三行（标题、标签和其后的空行/水平线）以及所有水平线模式
                if (index < 3 || hrRegex.test(trimmed)) return false
                return trimmed.length > 0
            }).join(' ').replace(/[#*`>~-]/g, '').trim() // 增加对 - 的过滤

            return mainText.substring(0, 100) + (mainText.length > 100 ? '...' : '')
        },
        getTags(content) {
            if (!content) return []
            let tagLine = content.split('\n')[1] || ''
            if (tagLine.includes('标签')) {
                let tags = tagLine.split(/[:：]/)[1] || ''
                return tags.trim().split(/\s+/).filter(t => t && t !== '未分类')
            }
            return []
        },
        filterByDate(date) {
            if (!date) return
            this.filterDate = (this.filterDate === date) ? null : date
            this.filterTag = null
        },
        filterByTag(tag) {
            this.filterTag = (this.filterTag === tag) ? null : tag
            this.filterDate = null
        },
        clearFilter() {
            this.filterDate = null
            this.filterTag = null
        },
        prevMonth() {
            this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1)
        },
        nextMonth() {
            this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1)
        }
    }
}
</script>

<style scoped>
/* 综合样式：玻璃拟态与现代布局 */
.blog-container {
    position: relative;
    min-height: 100vh;
    background: #f0f4f8;
    color: #2c3e50;
    overflow-x: hidden;
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
}

.content-wrapper {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
.blog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0;
    margin-bottom: 20px;
}

.logo {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
}

.btn-modern {
    padding: 10px 25px;
    border-radius: 30px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(66, 185, 131, 0.2);
}

.btn-primary {
    background: #42b983;
    color: white;
}

.btn-modern:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(66, 185, 131, 0.3);
}

/* Layout */
.main-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 30px;
}

/* Articles */
.articles-column {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.filter-status {
    background: rgba(66, 185, 131, 0.1);
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 4px solid #42b983;
}

.article-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 25px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.article-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

.card-header {
    display: flex;
    gap: 15px;
    font-size: 0.85rem;
    color: #7f8c8d;
    margin-bottom: 15px;
}

.article-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #2c3e50;
    text-decoration: none;
    display: block;
    margin-bottom: 12px;
    transition: color 0.3s;
}

.article-title:hover {
    color: #42b983;
}

.article-excerpt {
    color: #5d6d7e;
    line-height: 1.6;
    margin-bottom: 20px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    background: rgba(66, 185, 131, 0.1);
    color: #42b983;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.2s;
}

.tag:hover {
    background: #42b983;
    color: white;
}

.btn-edit-icon {
    color: #bdc3c7;
    transition: color 0.3s;
    font-size: 1.2rem;
}

.btn-edit-icon:hover {
    color: #3498db;
}

/* Sidebar Blocks */
.sidebar-column {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
}

.sidebar-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(66, 185, 131, 0.2);
}

/* Calendar Widget */
.calendar-widget {
    font-size: 0.9rem;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.calendar-header button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #42b983;
}

.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    color: #95a5a6;
    margin-bottom: 10px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    position: relative;
}

.calendar-day:hover {
    background: rgba(66, 185, 131, 0.1);
    color: #42b983;
}

.calendar-day.other-month {
    opacity: 0.3;
}

.calendar-day.has-article {
    font-weight: bold;
    color: #2c3e50;
}

.calendar-day.selected {
    background: #42b983 !important;
    color: white !important;
}

.calendar-day .dot {
    position: absolute;
    bottom: 4px;
    width: 4px;
    height: 4px;
    background: #42b983;
    border-radius: 50%;
}

.calendar-day.selected .dot {
    background: white;
}

/* Tag Cloud (图示优化) */
.tag-cloud {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cloud-tag {
    cursor: pointer;
    background: #444;
    /* 深灰色背景 */
    color: #4facfe;
    /* 亮蓝色文字 */
    padding: 10px 15px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.cloud-tag i {
    margin-right: 12px;
    font-size: 1.1rem;
    color: #4facfe;
}

.tag-name {
    font-weight: 500;
    flex: 1;
}

.tag-count {
    background: none;
    /* 移除背景 */
    padding: 0;
    font-size: 1rem;
    /* 调大字号 */
    margin-left: 8px;
    opacity: 1;
    /* 增加不透明度 */
    color: inherit;
    font-weight: 600;
    /* 加粗一点 */
}

.cloud-tag:hover,
.cloud-tag.active {
    background: #333;
    border-color: #4facfe;
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.cloud-tag.active {
    background: #4facfe;
    color: white;
}

.cloud-tag.active i,
.cloud-tag.active .tag-count {
    color: white;
}

.no-data {
    text-align: center;
    padding: 50px;
    color: #bdc3c7;
    font-style: italic;
}

/* Response */
@media (max-width: 992px) {
    .main-layout {
        grid-template-columns: 1fr;
    }

    .blog-header {
        flex-direction: column;
        gap: 20px;
    }
}

/* Footer & Friend Links */
.blog-footer {
    margin-top: 50px;
    padding: 30px;
    text-align: center;
}

.footer-section {
    margin-bottom: 20px;
}

.footer-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #2c3e50;
    position: relative;
    display: inline-block;
}

.footer-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: #42b983;
    border-radius: 2px;
}

.friend-links {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

.friend-link {
    color: #5d6d7e;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 5px 10px;
}

.friend-link:hover {
    color: #42b983;
    transform: translateY(-2px);
}

.footer-bottom {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding-top: 20px;
    color: #95a5a6;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .friend-links {
        gap: 15px;
    }
}
</style>
