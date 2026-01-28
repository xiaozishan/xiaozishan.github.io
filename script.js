// 导航栏滚动效果
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// 导航链接平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 文件上传功能
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFiles = document.getElementById('uploadedFiles');

// 点击上传区域
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

// 文件选择
fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

// 处理文件
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        displayFile(files[i]);
    }
}

 // GitHub 仓库配置
   const GITHUB_REPO = 'xiaozishan/xiaozishan.github.io';
   const GITHUB_API_URL = 'https://api.github.com';

   // 显示文件
   async function displayFile(file) {
       const fileItem = document.createElement('div');
       fileItem.className = 'file-item fade-in';

       // 获取文件扩展名
       const fileExtension = file.name.split('.').pop().
   toUpperCase();

       // 格式化文件大小
       const fileSize = formatFileSize(file.size);

       fileItem.innerHTML = `
           <div class="file-icon">${fileExtension}</div>
           <div class="file-info">
               <div class="file-name">${file.name}</div>
               <div class="file-size">${fileSize}</div>
               <div class="upload-status">上传中...</div>
           </div>
           <button class="file-remove" title="移除文件">
               <svg width="20" height="20" viewBox="0 0 24 24"
   fill="none" stroke="currentColor" stroke-width="2">
                   <line x1="18" y1="6" x2="6" y2="18"></line>
                   <line x1="6" y1="6" x2="18" y2="18"></line>
               </svg>
           </button>
       `;

       // 移除文件
       const removeBtn = fileItem.querySelector('.file-remove');
       removeBtn.addEventListener('click', (e) => {
           e.stopPropagation();
           fileItem.style.animation = 'fadeIn 0.3s ease-out
   reverse';
           setTimeout(() => {
               fileItem.remove();
           }, 300);
       });

       uploadedFiles.appendChild(fileItem);

       // 上传文件到 GitHub
       try {
           await uploadToGitHub(file);
           const uploadStatus = fileItem.querySelector(
   '.upload-status');
           uploadStatus.textContent = '上传成功 ✓';
           uploadStatus.style.color = '#28a745';
       } catch (error) {
           console.error('上传失败:', error);
           const uploadStatus = fileItem.querySelector(
   '.upload-status');
           uploadStatus.textContent = '上传失败 ✗';
           uploadStatus.style.color = '#dc3545';
       }

       // 如果是代码文件，显示预览
       if (isCodeFile(file.name)) {
           displayCodePreview(file);
       }
   }

   // 上传文件到 GitHub
   async function uploadToGitHub(file) {
       const reader = new FileReader();
       return new Promise((resolve, reject) => {
           reader.onload = async (e) => {
               try {
                   const content = e.target.result;
                   const base64Content = btoa(content);

                   const path = `uploads/${file.name}`;
                   const url = `${GITHUB_API_URL}/repos/
   ${GITHUB_REPO}/contents/${path}`;

                   let sha = null;
                   try {
                       const existingFile = await fetch(url);
                       if (existingFile.ok) {
                           const existingData = await
   existingFile.json();
                           sha = existingData.sha;
                       }
                   } catch (err) {}

                   const response = await fetch(url, {
                       method: 'PUT',
                       headers: {
                           'Content-Type': 'application/json',
                           'Authorization': `token
   ${getGitHubToken()}`,
                       },
                       body: JSON.stringify({
                           message: `Upload file: ${file.name}`,
                           content: base64Content,
                           sha: sha
                       })
                   });

                   if (!response.ok) throw new Error('GitHub API
   请求失败');
                   resolve();
               } catch (error) {
                   reject(error);
               }
           };
           reader.onerror = () => reject(reader.error);
           reader.readAsBinaryString(file);
       });
   }

   // 获取 GitHub Token
   function getGitHubToken() {
       let token = localStorage.getItem('github_token');
       if (!token) {
           token = prompt('请输入 GitHub Personal Access
   Token:\n\n要创建
   Token，请访问：\nhttps://github.com/settings/tokens\n\n需要勾选
   "repo" 权限');
           if (token) {
               localStorage.setItem('github_token', token);
           }
       }
       return token;
   }
// 简单的语法高亮（基础版本）
function highlightSyntax(codeElement) {
    let code = codeElement.textContent;
    
    // 关键字
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export', 'class', 'extends', 'new', 'this', 'true', 'false', 'null', 'undefined'];
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        code = code.replace(regex, `<span style="color: #ff79c6;">${keyword}</span>`);
    });
    
    // 字符串
    code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color: #f1fa8c;">$&</span>');
    
    // 注释
    code = code.replace(/(\/\/.*$)/gm, '<span style="color: #6272a4;">$&</span>');
    
    // 函数名
    code = code.replace(/(\w+)(?=\s*\()/g, '<span style="color: #50fa7b;">$1</span>');
    
    codeElement.innerHTML = code;
}

// 作品集数据
const portfolioData = [
    {
        title: '项目一：Web应用',
        description: '基于React和Node.js的全栈Web应用，包含用户认证、数据管理等功能。',
        tags: ['React', 'Node.js', 'MongoDB'],
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        title: '项目二：移动应用',
        description: '使用React Native开发的跨平台移动应用，支持iOS和Android。',
        tags: ['React Native', 'Firebase', 'TypeScript'],
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        title: '项目三：数据分析平台',
        description: '基于Python和机器学习的数据分析平台，提供智能数据洞察。',
        tags: ['Python', 'TensorFlow', 'Flask'],
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
];

// 渲染作品集
function renderPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    portfolioData.forEach((item, index) => {
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'col-lg-4 col-md-6';
        portfolioCard.style.animationDelay = `${index * 0.2}s`;
        
        portfolioCard.innerHTML = `
            <div class="portfolio-card fade-in">
                <div class="portfolio-image" style="background: ${item.gradient}">
                    <span>${item.title.charAt(0)}</span>
                </div>
                <div class="portfolio-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="portfolio-tags">
                        ${item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioCard);
    });
}

// 页面加载时渲染作品集
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolio();
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// 观察所有section
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加回到顶部按钮（可选）
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 500) {
        // 可以在这里添加回到顶部按钮的显示逻辑
    }
});

// 响应式导航菜单
const navbarCollapse = document.querySelector('.navbar-collapse');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: true
            });
        }
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
