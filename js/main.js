// 主要JavaScript文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化工具提示
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    
    // 搜索功能
    const searchForm = document.querySelector('.search-container form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                // 这里可以实现实际的搜索逻辑
                alert('搜索功能将在后续版本中实现，您搜索的是: ' + searchTerm);
            }
        });
    }
    
    // 添加卡片动画效果
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('fade-in');
    });
    
    // 收藏功能
    const favoriteLinks = document.querySelectorAll('a[href="#"][class*="star"]');
    favoriteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('收藏功能将在后续版本中实现');
        });
    });
    
    // 响应式侧边栏
    const sidebarToggle = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show-mobile');
        });
    }
});