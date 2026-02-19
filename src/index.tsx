import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';
import { landingPageHtml } from './landing';

type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use('/api/*', cors());

// API Routes
app.route('/api', api);

// Static files
app.use('/static/*', serveStatic({ root: './public' }));

// Landing page (root)
app.get('/', (c) => {
  return c.html(landingPageHtml);
});

// Landing page explicit route
app.get('/landing', (c) => {
  return c.html(landingPageHtml);
});

// Main App HTML
app.get('/app', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>myMuse - 創作の未来をともに描くパートナー</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;500;600;700&family=BIZ+UDMincho&family=Merriweather:wght@400;700&family=Roboto:wght@300;400;500;700&family=Georgia&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            'mincho': ['"Shippori Mincho"', '"Noto Serif JP"', '"BIZ UDMincho"', 'serif'],
            'gothic': ['"Noto Sans JP"', 'sans-serif'],
            'western': ['Merriweather', 'Roboto', 'sans-serif'],
          },
          colors: {
            muse: {
              primary: '#6366f1',
              secondary: '#8b5cf6',
              accent: '#ec4899',
              dark: '#1e1b4b',
              light: '#f5f3ff',
            }
          }
        }
      }
    }
  </script>
  
  <!-- Icons -->
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
    
    /* Vertical Writing */
    .writing-vertical {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      line-height: 2;
    }
    
    /* Animation */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
    .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
    .animate-pulse-slow { animation: pulse 2s infinite; }
    
    /* ZEN Mode */
    .zen-mode .sidebar-left,
    .zen-mode .sidebar-right,
    .zen-mode .header { display: none !important; }
    .zen-mode .main-content { margin: 0 !important; width: 100% !important; max-width: 100% !important; }
    .zen-mode { position: relative; }
    .zen-mode::before {
      content: 'ESCで終了';
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0,0,0,0.3);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      z-index: 1000;
      opacity: 0.4;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .zen-mode:hover::before {
      opacity: 0.7;
    }
    
    /* RTL Support */
    [dir="rtl"] { direction: rtl; text-align: right; }
    
    /* Calendar */
    .calendar-memo { background-color: #fef08a; }
    .calendar-deadline { background-color: #fca5a5; }
    
    /* Editor Placeholder */
    .editor-placeholder:empty:before {
      content: attr(data-placeholder);
      color: #9ca3af;
      pointer-events: none;
    }
    
    /* Tabs active state */
    .tab-active { border-bottom: 3px solid #6366f1; color: #6366f1; font-weight: 600; }
    
    /* Loading spinner */
    .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #6366f1; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-gothic">
  <div id="app"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="/static/app.js?v=${Date.now()}"></script>
</body>
</html>`);
});

export default app;
