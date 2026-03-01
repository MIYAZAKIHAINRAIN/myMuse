// Admin Dashboard Page HTML
export const adminPageHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>myMuse 管理者ダッシュボード</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            'gothic': ['"Noto Sans JP"', 'sans-serif'],
          },
          colors: {
            muse: {
              primary: '#6366f1',
              secondary: '#8b5cf6',
              accent: '#ec4899',
            }
          }
        }
      }
    }
  </script>
  
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <style>
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
    .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #6366f1; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body class="bg-gray-100 font-gothic min-h-screen">
  <div id="admin-app">
    <!-- Loading state -->
    <div id="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-gray-600">認証確認中...</p>
      </div>
    </div>
    
    <!-- Access denied -->
    <div id="access-denied" class="hidden flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-lock text-red-500 text-2xl"></i>
        </div>
        <h1 class="text-xl font-bold text-gray-800 mb-2">アクセス権限がありません</h1>
        <p class="text-gray-600 mb-6">このページは管理者のみアクセスできます。</p>
        <a href="/app" class="inline-block bg-muse-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition">
          アプリに戻る
        </a>
      </div>
    </div>
    
    <!-- Admin Dashboard -->
    <div id="dashboard" class="hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a href="/app" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="text-xl font-bold text-gray-800">
              <i class="fas fa-cog text-muse-primary mr-2"></i>
              myMuse 管理者ダッシュボード
            </h1>
          </div>
          <div id="admin-user" class="text-sm text-gray-600"></div>
        </div>
      </header>
      
      <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Revenue Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500">今月の売上</h3>
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-yen-sign text-green-600"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-800" id="stat-revenue-month">¥0</p>
            <p class="text-sm text-gray-500 mt-1">今日: <span id="stat-revenue-today">¥0</span></p>
          </div>
          
          <!-- Users Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500">総ユーザー数</h3>
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-users text-blue-600"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-800" id="stat-users-total">0</p>
            <p class="text-sm text-gray-500 mt-1">
              プレミアム: <span id="stat-users-premium">0</span> / 
              今週: <span id="stat-users-week">+0</span>
            </p>
          </div>
          
          <!-- Projects Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500">総作品数</h3>
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-book text-purple-600"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-800" id="stat-projects">0</p>
            <p class="text-sm text-gray-500 mt-1">総文字数: <span id="stat-words">0</span></p>
          </div>
          
          <!-- AI Credits Card -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500">AI利用量</h3>
              <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-robot text-pink-600"></i>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-800" id="stat-ai-consumed">0</p>
            <p class="text-sm text-gray-500 mt-1">残り合計: <span id="stat-ai-remaining">0</span></p>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="bg-white rounded-xl shadow-sm mb-8">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px flex-wrap">
              <button onclick="switchTab('payments')" id="tab-payments" class="tab-btn px-6 py-4 text-sm font-medium text-muse-primary border-b-2 border-muse-primary">
                <i class="fas fa-credit-card mr-2"></i>決済履歴
              </button>
              <button onclick="switchTab('users')" id="tab-users" class="tab-btn px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <i class="fas fa-users mr-2"></i>ユーザー管理
              </button>
              <button onclick="switchTab('invites')" id="tab-invites" class="tab-btn px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <i class="fas fa-ticket-alt mr-2"></i>招待コード
              </button>
              <button onclick="switchTab('export')" id="tab-export" class="tab-btn px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <i class="fas fa-download mr-2"></i>エクスポート
              </button>
              <button onclick="switchTab('logs')" id="tab-logs" class="tab-btn px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <i class="fas fa-history mr-2"></i>ログ
              </button>
            </nav>
          </div>
          
          <!-- Payments Tab -->
          <div id="content-payments" class="p-6">
            <h3 class="text-lg font-semibold mb-4">最近の決済</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">日時</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">ユーザー</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">プラン</th>
                    <th class="px-4 py-3 text-right font-medium text-gray-600">金額</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600">ステータス</th>
                  </tr>
                </thead>
                <tbody id="payments-table" class="divide-y divide-gray-100">
                  <tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">読み込み中...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Users Tab -->
          <div id="content-users" class="p-6 hidden">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">ユーザー一覧</h3>
              <div class="relative">
                <input type="text" id="user-search" placeholder="メールまたは名前で検索..." 
                       class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary focus:border-transparent"
                       onkeyup="if(event.key==='Enter')searchUsers()">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">ユーザー</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">プラン</th>
                    <th class="px-4 py-3 text-right font-medium text-gray-600">クレジット</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">登録日</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody id="users-table" class="divide-y divide-gray-100">
                  <tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">読み込み中...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Invites Tab -->
          <div id="content-invites" class="p-6 hidden">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">招待コード管理</h3>
              <button onclick="showCreateInviteModal()" class="bg-muse-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
                <i class="fas fa-plus mr-2"></i>新規作成
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">コード</th>
                    <th class="px-4 py-3 text-left font-medium text-gray-600">説明</th>
                    <th class="px-4 py-3 text-right font-medium text-gray-600">ボーナス</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600">プレミアム付与</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600">使用回数</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600">状態</th>
                    <th class="px-4 py-3 text-center font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody id="invites-table" class="divide-y divide-gray-100">
                  <tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">読み込み中...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Logs Tab -->
          <div id="content-logs" class="p-6 hidden">
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">操作ログ</h3>
              <div class="flex items-center gap-4 mb-4">
                <select id="log-filter-type" class="px-3 py-2 border border-gray-300 rounded-lg" onchange="loadLogs()">
                  <option value="">すべてのアクション</option>
                  <option value="credit_grant">クレジット付与</option>
                  <option value="premium_change">プレミアム変更</option>
                  <option value="invite_create">招待コード作成</option>
                  <option value="invite_toggle">招待コード切替</option>
                  <option value="data_export">データエクスポート</option>
                </select>
                <button onclick="loadLogs()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                  <i class="fas fa-sync-alt mr-2"></i>更新
                </button>
              </div>
              <div class="overflow-x-auto bg-gray-50 rounded-lg">
                <table class="w-full text-sm">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-3 text-left font-medium text-gray-600">日時</th>
                      <th class="px-4 py-3 text-left font-medium text-gray-600">管理者</th>
                      <th class="px-4 py-3 text-left font-medium text-gray-600">アクション</th>
                      <th class="px-4 py-3 text-left font-medium text-gray-600">対象</th>
                      <th class="px-4 py-3 text-left font-medium text-gray-600">詳細</th>
                    </tr>
                  </thead>
                  <tbody id="admin-logs-table" class="divide-y divide-gray-200">
                    <tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">読み込み中...</td></tr>
                  </tbody>
                </table>
              </div>
              <div id="admin-logs-pagination" class="flex justify-center mt-4 gap-2"></div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold mb-4">エラーログ</h3>
              <div class="flex items-center gap-4 mb-4">
                <select id="error-log-filter" class="px-3 py-2 border border-gray-300 rounded-lg" onchange="loadErrorLogs()">
                  <option value="">すべてのエラー</option>
                  <option value="api">API エラー</option>
                  <option value="auth">認証エラー</option>
                  <option value="payment">決済エラー</option>
                  <option value="database">データベースエラー</option>
                </select>
                <button onclick="loadErrorLogs()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                  <i class="fas fa-sync-alt mr-2"></i>更新
                </button>
              </div>
              <div class="overflow-x-auto bg-red-50 rounded-lg">
                <table class="w-full text-sm">
                  <thead class="bg-red-100">
                    <tr>
                      <th class="px-4 py-3 text-left font-medium text-red-700">日時</th>
                      <th class="px-4 py-3 text-left font-medium text-red-700">カテゴリ</th>
                      <th class="px-4 py-3 text-left font-medium text-red-700">エンドポイント</th>
                      <th class="px-4 py-3 text-left font-medium text-red-700">ユーザー</th>
                      <th class="px-4 py-3 text-left font-medium text-red-700">エラー内容</th>
                    </tr>
                  </thead>
                  <tbody id="error-logs-table" class="divide-y divide-red-200">
                    <tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">読み込み中...</td></tr>
                  </tbody>
                </table>
              </div>
              <div id="error-logs-pagination" class="flex justify-center mt-4 gap-2"></div>
            </div>
          </div>
          
          <!-- Export Tab -->
          <div id="content-export" class="p-6 hidden">
            <h3 class="text-lg font-semibold mb-4">データエクスポート</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-database text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">全データエクスポート</h4>
                    <p class="text-sm text-gray-500">ユーザー、プロジェクト、決済データ</p>
                  </div>
                </div>
                <button onclick="exportAllData()" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  <i class="fas fa-download mr-2"></i>JSONでエクスポート
                </button>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-user text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">個別ユーザーエクスポート</h4>
                    <p class="text-sm text-gray-500">特定ユーザーの全データ</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <input type="text" id="export-user-id" placeholder="ユーザーID" 
                         class="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                  <button onclick="exportUserData()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    エクスポート
                  </button>
                </div>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 class="font-semibold text-yellow-800 mb-2">
                <i class="fas fa-info-circle mr-2"></i>バックアップについて
              </h4>
              <p class="text-sm text-yellow-700">
                本番環境のデータバックアップは、Cloudflareダッシュボードから自動バックアップを設定してください。
                D1データベースは毎日自動でスナップショットが作成されます（過去30日間保持）。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Create Invite Modal -->
    <div id="modal-create-invite" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold">新規招待コード作成</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">コード</label>
            <input type="text" id="invite-code" placeholder="例: LAUNCH-2026" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <input type="text" id="invite-description" placeholder="例: 発売記念キャンペーン" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ボーナスクレジット</label>
            <input type="number" id="invite-credits" placeholder="0" value="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary">
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="invite-premium" class="w-4 h-4 text-muse-primary rounded">
            <label for="invite-premium" class="text-sm text-gray-700">プレミアムを付与する</label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">最大使用回数（空欄で無制限）</label>
            <input type="number" id="invite-max-uses" placeholder="無制限" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary">
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onclick="hideCreateInviteModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            キャンセル
          </button>
          <button onclick="createInviteCode()" class="px-4 py-2 bg-muse-primary text-white rounded-lg hover:bg-indigo-600 transition">
            作成
          </button>
        </div>
      </div>
    </div>
    
    <!-- Grant Credits Modal -->
    <div id="modal-grant-credits" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold">クレジット付与</h3>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">対象: <span id="grant-user-email" class="font-medium"></span></p>
          <input type="hidden" id="grant-user-id">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">付与するクレジット数</label>
            <input type="number" id="grant-amount" placeholder="例: 10000" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">理由（任意）</label>
            <input type="text" id="grant-reason" placeholder="例: キャンペーン付与" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-muse-primary">
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onclick="hideGrantCreditsModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            キャンセル
          </button>
          <button onclick="grantCredits()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            付与
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script>
    // State
    let sessionId = localStorage.getItem('sessionId');
    let currentUser = null;
    
    // API helper
    const api = axios.create({
      baseURL: '/api',
      headers: { 'Content-Type': 'application/json' }
    });
    
    api.interceptors.request.use(config => {
      if (sessionId) config.headers['X-Session-Id'] = sessionId;
      return config;
    });
    
    // Initialize
    async function init() {
      if (!sessionId) {
        showAccessDenied();
        return;
      }
      
      try {
        const { data } = await api.get('/admin/check');
        if (!data.isAdmin) {
          showAccessDenied();
          return;
        }
        
        currentUser = data.user;
        document.getElementById('admin-user').textContent = currentUser.email;
        
        // Show dashboard
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Load data
        await Promise.all([
          loadStats(),
          loadPayments(),
          loadUsers(),
          loadInviteCodes(),
          loadLogs(),
          loadErrorLogs()
        ]);
      } catch (error) {
        console.error('Init error:', error);
        showAccessDenied();
      }
    }
    
    function showAccessDenied() {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('access-denied').classList.remove('hidden');
    }
    
    // Tab switching
    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-muse-primary', 'border-b-2', 'border-muse-primary');
        btn.classList.add('text-gray-500');
      });
      document.getElementById('tab-' + tab).classList.remove('text-gray-500');
      document.getElementById('tab-' + tab).classList.add('text-muse-primary', 'border-b-2', 'border-muse-primary');
      
      document.querySelectorAll('[id^="content-"]').forEach(content => content.classList.add('hidden'));
      document.getElementById('content-' + tab).classList.remove('hidden');
    }
    
    // Load stats
    async function loadStats() {
      try {
        const { data } = await api.get('/admin/stats');
        
        document.getElementById('stat-revenue-month').textContent = '¥' + (data.revenue.thisMonth.amount || 0).toLocaleString();
        document.getElementById('stat-revenue-today').textContent = '¥' + (data.revenue.today.amount || 0).toLocaleString();
        document.getElementById('stat-users-total').textContent = (data.users.total || 0).toLocaleString();
        document.getElementById('stat-users-premium').textContent = (data.users.premium || 0).toLocaleString();
        document.getElementById('stat-users-week').textContent = '+' + (data.users.thisWeek || 0);
        document.getElementById('stat-projects').textContent = (data.projects.total || 0).toLocaleString();
        document.getElementById('stat-words').textContent = (data.content.totalWords || 0).toLocaleString() + '字';
        document.getElementById('stat-ai-consumed').textContent = (data.credits.estimatedConsumed || 0).toLocaleString() + '字';
        document.getElementById('stat-ai-remaining').textContent = (data.credits.totalRemaining || 0).toLocaleString() + '字';
      } catch (error) {
        console.error('Load stats error:', error);
      }
    }
    
    // Load payments
    async function loadPayments() {
      try {
        const { data } = await api.get('/admin/payments');
        const tbody = document.getElementById('payments-table');
        
        if (!data.payments || data.payments.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">決済履歴がありません</td></tr>';
          return;
        }
        
        tbody.innerHTML = data.payments.map(p => \`
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-600">\${new Date(p.created_at).toLocaleString('ja-JP')}</td>
            <td class="px-4 py-3">
              <div class="font-medium text-gray-800">\${p.user_name || '不明'}</div>
              <div class="text-xs text-gray-500">\${p.email || ''}</div>
            </td>
            <td class="px-4 py-3 text-gray-600">\${getPlanName(p.payment_type)}</td>
            <td class="px-4 py-3 text-right font-medium">¥\${(p.amount || 0).toLocaleString()}</td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 text-xs rounded-full \${getStatusClass(p.status)}">\${getStatusText(p.status)}</span>
            </td>
          </tr>
        \`).join('');
      } catch (error) {
        console.error('Load payments error:', error);
      }
    }
    
    function getPlanName(type) {
      const names = {
        'standard': 'スタンダード',
        'addon_100k': '追加10万文字',
        'addon_300k': '追加30万文字',
        'addon_12m': '追加1200万文字'
      };
      return names[type] || type;
    }
    
    function getStatusClass(status) {
      const classes = {
        'completed': 'bg-green-100 text-green-700',
        'pending': 'bg-yellow-100 text-yellow-700',
        'cancelled': 'bg-red-100 text-red-700',
        'failed': 'bg-red-100 text-red-700'
      };
      return classes[status] || 'bg-gray-100 text-gray-700';
    }
    
    function getStatusText(status) {
      const texts = {
        'completed': '完了',
        'pending': '保留中',
        'cancelled': 'キャンセル',
        'failed': '失敗'
      };
      return texts[status] || status;
    }
    
    // Load users
    async function loadUsers(search = '') {
      try {
        const { data } = await api.get('/admin/users' + (search ? '?search=' + encodeURIComponent(search) : ''));
        const tbody = document.getElementById('users-table');
        
        if (!data.users || data.users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">ユーザーが見つかりません</td></tr>';
          return;
        }
        
        tbody.innerHTML = data.users.map(u => \`
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="font-medium text-gray-800">\${u.name || '名前なし'}</div>
              <div class="text-xs text-gray-500">\${u.email}</div>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full \${u.is_premium ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}">
                \${u.is_premium ? 'プレミアム' : '無料'}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-medium">\${(u.ai_credits || 0).toLocaleString()}</td>
            <td class="px-4 py-3 text-gray-600">\${new Date(u.created_at).toLocaleDateString('ja-JP')}</td>
            <td class="px-4 py-3 text-center">
              <button onclick="showGrantCreditsModal('\${u.id}', '\${u.email}')" 
                      class="text-green-600 hover:text-green-800 mr-2" title="クレジット付与">
                <i class="fas fa-coins"></i>
              </button>
              <button onclick="togglePremium('\${u.id}', \${u.is_premium ? 'false' : 'true'})" 
                      class="text-purple-600 hover:text-purple-800 mr-2" title="プレミアム切替">
                <i class="fas fa-crown"></i>
              </button>
              <button onclick="exportUserData('\${u.id}')" 
                      class="text-blue-600 hover:text-blue-800" title="エクスポート">
                <i class="fas fa-download"></i>
              </button>
            </td>
          </tr>
        \`).join('');
      } catch (error) {
        console.error('Load users error:', error);
      }
    }
    
    function searchUsers() {
      const search = document.getElementById('user-search').value;
      loadUsers(search);
    }
    
    // Load invite codes
    async function loadInviteCodes() {
      try {
        const { data } = await api.get('/admin/invite-codes');
        const tbody = document.getElementById('invites-table');
        
        if (!data.codes || data.codes.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">招待コードがありません</td></tr>';
          return;
        }
        
        tbody.innerHTML = data.codes.map(c => \`
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 font-mono font-medium text-gray-800">\${c.code}</td>
            <td class="px-4 py-3 text-gray-600">\${c.description || '-'}</td>
            <td class="px-4 py-3 text-right">\${(c.credits_bonus || 0).toLocaleString()}</td>
            <td class="px-4 py-3 text-center">
              \${c.grants_premium ? '<i class="fas fa-check text-green-600"></i>' : '<i class="fas fa-times text-gray-400"></i>'}
            </td>
            <td class="px-4 py-3 text-center">\${c.current_uses || 0} / \${c.max_uses || '∞'}</td>
            <td class="px-4 py-3 text-center">
              <span class="px-2 py-1 text-xs rounded-full \${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                \${c.is_active ? '有効' : '無効'}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button onclick="toggleInviteCode('\${c.id}')" 
                      class="\${c.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}" 
                      title="\${c.is_active ? '無効にする' : '有効にする'}">
                <i class="fas \${c.is_active ? 'fa-ban' : 'fa-check'}"></i>
              </button>
            </td>
          </tr>
        \`).join('');
      } catch (error) {
        console.error('Load invite codes error:', error);
      }
    }
    
    // Create invite code
    function showCreateInviteModal() {
      document.getElementById('modal-create-invite').classList.remove('hidden');
    }
    
    function hideCreateInviteModal() {
      document.getElementById('modal-create-invite').classList.add('hidden');
    }
    
    async function createInviteCode() {
      const code = document.getElementById('invite-code').value.trim();
      const description = document.getElementById('invite-description').value.trim();
      const creditsBonus = parseInt(document.getElementById('invite-credits').value) || 0;
      const grantsPremium = document.getElementById('invite-premium').checked;
      const maxUses = parseInt(document.getElementById('invite-max-uses').value) || null;
      
      if (!code) {
        alert('コードを入力してください');
        return;
      }
      
      try {
        await api.post('/admin/invite-codes', { code, description, creditsBonus, grantsPremium, maxUses });
        hideCreateInviteModal();
        loadInviteCodes();
        
        // Reset form
        document.getElementById('invite-code').value = '';
        document.getElementById('invite-description').value = '';
        document.getElementById('invite-credits').value = '0';
        document.getElementById('invite-premium').checked = false;
        document.getElementById('invite-max-uses').value = '';
      } catch (error) {
        alert(error.response?.data?.error || '招待コードの作成に失敗しました');
      }
    }
    
    async function toggleInviteCode(codeId) {
      try {
        await api.post('/admin/invite-codes/' + codeId + '/toggle');
        loadInviteCodes();
      } catch (error) {
        alert('招待コードの更新に失敗しました');
      }
    }
    
    // Grant credits
    function showGrantCreditsModal(userId, email) {
      document.getElementById('grant-user-id').value = userId;
      document.getElementById('grant-user-email').textContent = email;
      document.getElementById('grant-amount').value = '';
      document.getElementById('grant-reason').value = '';
      document.getElementById('modal-grant-credits').classList.remove('hidden');
    }
    
    function hideGrantCreditsModal() {
      document.getElementById('modal-grant-credits').classList.add('hidden');
    }
    
    async function grantCredits() {
      const userId = document.getElementById('grant-user-id').value;
      const amount = parseInt(document.getElementById('grant-amount').value);
      const reason = document.getElementById('grant-reason').value;
      
      if (!amount || amount <= 0) {
        alert('有効なクレジット数を入力してください');
        return;
      }
      
      try {
        await api.post('/admin/users/' + userId + '/credits', { amount, reason });
        hideGrantCreditsModal();
        loadUsers();
        loadStats();
        alert('クレジットを付与しました');
      } catch (error) {
        alert(error.response?.data?.error || 'クレジットの付与に失敗しました');
      }
    }
    
    // Toggle premium
    async function togglePremium(userId, isPremium) {
      if (!confirm(isPremium === 'true' ? 'プレミアムを付与しますか？' : 'プレミアムを解除しますか？')) return;
      
      try {
        await api.post('/admin/users/' + userId + '/premium', { isPremium: isPremium === 'true' });
        loadUsers();
        loadStats();
      } catch (error) {
        alert('プレミアム設定の変更に失敗しました');
      }
    }
    
    // Export data
    async function exportAllData() {
      try {
        const { data } = await api.get('/admin/export/all');
        downloadJson(data, 'mymuse-export-all-' + new Date().toISOString().split('T')[0] + '.json');
      } catch (error) {
        alert('エクスポートに失敗しました');
      }
    }
    
    async function exportUserData(userId) {
      const id = userId || document.getElementById('export-user-id').value.trim();
      if (!id) {
        alert('ユーザーIDを入力してください');
        return;
      }
      
      try {
        const { data } = await api.get('/admin/export/user/' + id);
        downloadJson(data, 'mymuse-export-user-' + id + '.json');
      } catch (error) {
        alert('エクスポートに失敗しました');
      }
    }
    
    function downloadJson(data, filename) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    // Load admin logs
    let currentLogPage = 1;
    async function loadLogs(page = 1) {
      currentLogPage = page;
      const filter = document.getElementById('log-filter-type').value;
      try {
        const { data } = await api.get('/admin/logs/admin' + '?page=' + page + '&limit=20' + (filter ? '&action=' + filter : ''));
        const tbody = document.getElementById('admin-logs-table');
        
        if (!data.logs || data.logs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">操作ログがありません</td></tr>';
          document.getElementById('admin-logs-pagination').innerHTML = '';
          return;
        }
        
        tbody.innerHTML = data.logs.map(log => \`
          <tr class="hover:bg-gray-100">
            <td class="px-4 py-3 text-gray-600 whitespace-nowrap">\${new Date(log.created_at).toLocaleString('ja-JP')}</td>
            <td class="px-4 py-3 text-gray-800">\${log.admin_email}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full \${getActionClass(log.action)}">\${getActionText(log.action)}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">\${log.target_type ? log.target_type + ': ' + (log.target_id || '-') : '-'}</td>
            <td class="px-4 py-3 text-gray-600 max-w-xs truncate" title="\${log.details || ''}">\${log.details || '-'}</td>
          </tr>
        \`).join('');
        
        // Pagination
        renderPagination('admin-logs-pagination', data.pagination, loadLogs);
      } catch (error) {
        console.error('Load admin logs error:', error);
        document.getElementById('admin-logs-table').innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-red-500">ログの読み込みに失敗しました</td></tr>';
      }
    }
    
    function getActionClass(action) {
      const classes = {
        'credit_grant': 'bg-green-100 text-green-700',
        'premium_change': 'bg-purple-100 text-purple-700',
        'invite_create': 'bg-blue-100 text-blue-700',
        'invite_toggle': 'bg-yellow-100 text-yellow-700',
        'data_export': 'bg-gray-100 text-gray-700'
      };
      return classes[action] || 'bg-gray-100 text-gray-700';
    }
    
    function getActionText(action) {
      const texts = {
        'credit_grant': 'クレジット付与',
        'premium_change': 'プレミアム変更',
        'invite_create': '招待コード作成',
        'invite_toggle': '招待コード切替',
        'data_export': 'データエクスポート'
      };
      return texts[action] || action;
    }
    
    // Load error logs
    let currentErrorPage = 1;
    async function loadErrorLogs(page = 1) {
      currentErrorPage = page;
      const filter = document.getElementById('error-log-filter').value;
      try {
        const { data } = await api.get('/admin/logs/errors' + '?page=' + page + '&limit=20' + (filter ? '&category=' + filter : ''));
        const tbody = document.getElementById('error-logs-table');
        
        if (!data.logs || data.logs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">エラーログがありません</td></tr>';
          document.getElementById('error-logs-pagination').innerHTML = '';
          return;
        }
        
        tbody.innerHTML = data.logs.map(log => \`
          <tr class="hover:bg-red-100">
            <td class="px-4 py-3 text-gray-600 whitespace-nowrap">\${new Date(log.created_at).toLocaleString('ja-JP')}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full \${getErrorCategoryClass(log.category)}">\${getErrorCategoryText(log.category)}</span>
            </td>
            <td class="px-4 py-3 text-gray-600 font-mono text-xs">\${log.endpoint || '-'}</td>
            <td class="px-4 py-3 text-gray-600">\${log.user_email || '匿名'}</td>
            <td class="px-4 py-3 text-red-700 max-w-xs truncate" title="\${log.error_message || ''}">\${log.error_message || '-'}</td>
          </tr>
        \`).join('');
        
        // Pagination
        renderPagination('error-logs-pagination', data.pagination, loadErrorLogs);
      } catch (error) {
        console.error('Load error logs error:', error);
        document.getElementById('error-logs-table').innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-red-500">エラーログの読み込みに失敗しました</td></tr>';
      }
    }
    
    function getErrorCategoryClass(category) {
      const classes = {
        'api': 'bg-orange-100 text-orange-700',
        'auth': 'bg-red-100 text-red-700',
        'payment': 'bg-pink-100 text-pink-700',
        'database': 'bg-purple-100 text-purple-700'
      };
      return classes[category] || 'bg-gray-100 text-gray-700';
    }
    
    function getErrorCategoryText(category) {
      const texts = {
        'api': 'API',
        'auth': '認証',
        'payment': '決済',
        'database': 'DB'
      };
      return texts[category] || category || '不明';
    }
    
    // Pagination helper
    function renderPagination(elementId, pagination, loadFunc) {
      if (!pagination || pagination.totalPages <= 1) {
        document.getElementById(elementId).innerHTML = '';
        return;
      }
      
      let html = '';
      const { page, totalPages } = pagination;
      
      if (page > 1) {
        html += \`<button onclick="\${loadFunc.name}(\${page - 1})" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">前へ</button>\`;
      }
      
      for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        html += \`<button onclick="\${loadFunc.name}(\${i})" class="px-3 py-1 \${i === page ? 'bg-muse-primary text-white' : 'bg-gray-200 hover:bg-gray-300'} rounded">\${i}</button>\`;
      }
      
      if (page < totalPages) {
        html += \`<button onclick="\${loadFunc.name}(\${page + 1})" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">次へ</button>\`;
      }
      
      document.getElementById(elementId).innerHTML = html;
    }
    
    // Initialize on load
    init();
  </script>
</body>
</html>`;
