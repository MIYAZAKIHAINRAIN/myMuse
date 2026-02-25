// Landing Page HTML
export const landingPageHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>myMuse - 創作の未来をともに描くAIパートナー</title>
  <meta name="description" content="myMuseは小説家・作家のためのAI創作支援アプリ。執筆補助、プロット構成、キャラクター開発をAIがサポート。あなたの物語を、もっと遠くへ。">
  <meta name="keywords" content="小説, 執筆, AI, 創作支援, プロット, キャラクター, 作家, ライター">
  
  <!-- OGP -->
  <meta property="og:title" content="myMuse - 創作の未来をともに描くAIパートナー">
  <meta property="og:description" content="小説家・作家のためのAI創作支援アプリ。執筆補助、プロット構成、キャラクター開発をAIがサポート。">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/static/og-image.png">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            'mincho': ['"Shippori Mincho"', 'serif'],
            'gothic': ['"Noto Sans JP"', 'sans-serif'],
          },
          colors: {
            muse: {
              primary: '#6366f1',
              secondary: '#8b5cf6',
              accent: '#ec4899',
              dark: '#1e1b4b',
            }
          },
          animation: {
            'float': 'float 6s ease-in-out infinite',
            'glow': 'glow 2s ease-in-out infinite alternate',
            'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
          }
        }
      }
    }
  </script>
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  
  <style>
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes glow {
      from { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
      to { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-bg {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
    }
    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
    }
    .scroll-reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease-out;
    }
    .scroll-reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body class="font-gothic bg-gray-50 text-gray-800">
  
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-feather-alt text-white text-lg"></i>
          </div>
          <span class="text-xl font-bold gradient-text">myMuse</span>
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-gray-600 hover:text-indigo-600 transition">機能</a>
          <a href="#ai" class="text-gray-600 hover:text-indigo-600 transition">AI機能</a>
          <a href="#pricing" class="text-gray-600 hover:text-indigo-600 transition">料金</a>
          <a href="#faq" class="text-gray-600 hover:text-indigo-600 transition">FAQ</a>
        </div>
        <div class="flex items-center gap-3">
          <a href="/app" class="hidden sm:block text-gray-600 hover:text-indigo-600 transition">ログイン</a>
          <a href="/app" class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-300/50 transition-all">
            無料で始める
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" style="animation-delay: -3s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Copy -->
        <div class="text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-indigo-200 text-sm mb-6 backdrop-blur">
            <i class="fas fa-sparkles text-yellow-400"></i>
            <span>AI搭載の次世代創作支援ツール</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-mincho">
            あなたの物語を、<br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              もっと遠くへ。
            </span>
          </h1>
          
          <p class="text-lg sm:text-xl text-indigo-200 mb-8 leading-relaxed">
            myMuseは、小説家・作家のためのAI創作パートナー。<br class="hidden sm:block">
            プロット構成からキャラクター開発、執筆まで。<br class="hidden sm:block">
            あなたの創作を、AIが全力でサポートします。
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/app" class="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all flex items-center justify-center gap-2 group">
              <span>無料で始める</span>
              <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
            <a href="#features" class="px-8 py-4 bg-white/10 text-white rounded-full font-medium text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur">
              <i class="fas fa-play-circle"></i>
              <span>機能を見る</span>
            </a>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div class="text-center">
              <div class="text-3xl font-bold text-white">∞</div>
              <div class="text-indigo-300 text-sm">無制限の創作</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">2種</div>
              <div class="text-indigo-300 text-sm">AIエンジン搭載</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">8言語</div>
              <div class="text-indigo-300 text-sm">多言語対応</div>
            </div>
          </div>
        </div>
        
        <!-- Right: App Preview -->
        <div class="relative">
          <div class="relative z-10 animate-float">
            <div class="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              <!-- App mockup header -->
              <div class="bg-gray-800 px-4 py-3 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="flex-1 text-center text-gray-400 text-sm">myMuse</div>
              </div>
              <!-- App mockup content -->
              <div class="p-4 bg-gradient-to-br from-gray-900 to-gray-800">
                <div class="flex gap-4">
                  <!-- Sidebar mock -->
                  <div class="w-16 space-y-3">
                    <div class="w-10 h-10 mx-auto bg-indigo-600 rounded-xl flex items-center justify-center">
                      <i class="fas fa-folder-open text-white text-sm"></i>
                    </div>
                    <div class="w-10 h-10 mx-auto bg-gray-700 rounded-xl flex items-center justify-center">
                      <i class="fas fa-pen-fancy text-gray-400 text-sm"></i>
                    </div>
                    <div class="w-10 h-10 mx-auto bg-gray-700 rounded-xl flex items-center justify-center">
                      <i class="fas fa-chart-line text-gray-400 text-sm"></i>
                    </div>
                  </div>
                  <!-- Main content mock -->
                  <div class="flex-1 space-y-3">
                    <div class="bg-gray-700/50 rounded-lg p-3">
                      <div class="text-white text-sm font-medium mb-2">資料集</div>
                      <div class="flex gap-2 flex-wrap">
                        <span class="px-2 py-1 bg-indigo-600/30 text-indigo-300 rounded text-xs">ジャンル</span>
                        <span class="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">キャラ</span>
                        <span class="px-2 py-1 bg-pink-600/30 text-pink-300 rounded text-xs">世界観</span>
                      </div>
                    </div>
                    <div class="bg-gray-700/50 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-robot text-indigo-400"></i>
                        <span class="text-white text-sm">AIアシスタント</span>
                      </div>
                      <div class="bg-gray-600/50 rounded p-2 text-gray-300 text-xs">
                        キャラクターの性格を深掘りしましょう...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Floating badges -->
          <div class="absolute -top-4 -right-4 z-20 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg animate-float" style="animation-delay: -2s;">
            <i class="fas fa-check mr-1"></i>買い切り1,600円
          </div>
          <div class="absolute -bottom-4 -left-4 z-20 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-lg animate-float" style="animation-delay: -4s;">
            <i class="fas fa-brain mr-1"></i>Gemini + Grok搭載
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
      <i class="fas fa-chevron-down text-2xl"></i>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 scroll-reveal">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4">
          <i class="fas fa-magic"></i>
          <span>主な機能</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold mb-4 font-mincho">
          創作のすべてを、<span class="gradient-text">ひとつのアプリで</span>
        </h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          アイデア出しから執筆、分析まで。myMuseがあなたの創作活動をトータルサポート。
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal">
          <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-folder-open text-white text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-3">資料集</h3>
          <p class="text-gray-600 leading-relaxed">
            ジャンル、キャラクター、世界観、専門用語をまとめて管理。シリーズ作品でも設定を共有できます。
          </p>
        </div>
        
        <!-- Feature 2 -->
        <div class="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal" style="animation-delay: 0.1s;">
          <div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-sitemap text-white text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-3">プロット構成</h3>
          <p class="text-gray-600 leading-relaxed">
            起承転結や三幕構成など、テンプレートを使って物語の骨組みを整理。構成力を高めます。
          </p>
        </div>
        
        <!-- Feature 3 -->
        <div class="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal" style="animation-delay: 0.2s;">
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-pen-fancy text-white text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-3">執筆エディタ</h3>
          <p class="text-gray-600 leading-relaxed">
            集中できるZENモード、縦書き/横書き切り替え、音声読み上げ機能で快適な執筆体験を。
          </p>
        </div>
        
        <!-- Feature 4 -->
        <div class="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal" style="animation-delay: 0.3s;">
          <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-chart-line text-white text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-3">作品分析</h3>
          <p class="text-gray-600 leading-relaxed">
            感情曲線、ジャンル分析、AIペルソナによる読者視点の評価で作品を客観的に分析。
          </p>
        </div>
        
        <!-- Feature 5 -->
        <div class="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal" style="animation-delay: 0.4s;">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-layer-group text-white text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-3">シリーズ管理</h3>
          <p class="text-gray-600 leading-relaxed">
            長編小説やシリーズ作品を親子構造で管理。キャラや世界観を全話で共有できます。
          </p>
        </div>
        
        <!-- Feature 6 -->
        <div class="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 scroll-reveal" style="animation-delay: 0.5s;">
          <div class="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-calendar-alt text-white text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-3">執筆カレンダー</h3>
          <p class="text-gray-600 leading-relaxed">
            締め切り管理、執筆記録の可視化。目標達成に向けてAIがアドバイスします。
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- AI Section -->
  <section id="ai" class="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16 scroll-reveal">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-indigo-200 text-sm mb-4 backdrop-blur">
          <i class="fas fa-brain"></i>
          <span>デュアルAIシステム</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold mb-4 font-mincho">
          2つのAIが、あなたの創作を支える
        </h2>
        <p class="text-indigo-200 text-lg max-w-2xl mx-auto">
          創作支援に特化したGeminiと、リサーチに強いGrok。<br>
          それぞれの得意分野で、あなたをサポートします。
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Gemini -->
        <div class="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 scroll-reveal">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
              <i class="fas fa-sparkles text-white text-2xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold">Gemini</h3>
              <p class="text-indigo-300">創作支援AI</p>
            </div>
          </div>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>続きの文章を自然に生成</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>キャラクターの性格を深掘り</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>プロットの相談・アドバイス</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>文体変換（文語・口語・詩的）</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>作品の客観的な分析・評価</span>
            </li>
          </ul>
        </div>
        
        <!-- Grok -->
        <div class="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 scroll-reveal" style="animation-delay: 0.2s;">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <i class="fas fa-search text-white text-2xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold">Grok</h3>
              <p class="text-emerald-300">リサーチAI</p>
            </div>
          </div>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>時代考証・歴史調査</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>専門知識・用語の調べもの</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>トレンド・市場動向の分析</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>設定の矛盾チェック</span>
            </li>
            <li class="flex items-start gap-3">
              <i class="fas fa-check-circle text-green-400 mt-1"></i>
              <span>ファクトチェック・検証</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- AI Demo -->
      <div class="mt-16 max-w-3xl mx-auto scroll-reveal">
        <div class="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          <div class="bg-gray-800 px-4 py-3 flex items-center gap-2">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-gray-400 text-sm ml-2">AIアシスタント</span>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-end">
              <div class="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                主人公の性格をもっと魅力的にしたい
              </div>
            </div>
            <div class="flex justify-start">
              <div class="bg-gray-700 text-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                <p class="mb-2">素敵な目標ですね！魅力的なキャラクターには「意外性」が大切です。</p>
                <p>例えば、強そうな主人公が意外と甘いものが好きだったり、クールに見えて実は照れ屋だったり。そんな「ギャップ」を入れてみてはいかがでしょう？</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 scroll-reveal">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm mb-4">
          <i class="fas fa-tag"></i>
          <span>シンプルな料金体系</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold mb-4 font-mincho">
          <span class="gradient-text">買い切り</span>で、ずっと使える
        </h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          サブスク疲れにさよなら。一度の購入で、基本機能がずっと使えます。
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Main Plan -->
        <div class="bg-white rounded-3xl p-8 border-2 border-indigo-500 shadow-xl relative scroll-reveal">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium">
            おすすめ
          </div>
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold mb-2">myMuse 買い切りプラン</h3>
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-5xl font-bold gradient-text">¥1,600</span>
              <span class="text-gray-500">（税込）</span>
            </div>
            <p class="text-gray-500 mt-2">約40万文字分のAI利用付き</p>
          </div>
          
          <ul class="space-y-4 mb-8">
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-green-600 text-sm"></i>
              </div>
              <span>すべての基本機能が使い放題</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-green-600 text-sm"></i>
              </div>
              <span>Gemini + Grok デュアルAI</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-green-600 text-sm"></i>
              </div>
              <span>プロジェクト数無制限</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-green-600 text-sm"></i>
              </div>
              <span>クラウド同期・バックアップ</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-green-600 text-sm"></i>
              </div>
              <span>今後のアップデート無料</span>
            </li>
          </ul>
          
          <a href="/app" class="block w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-center hover:shadow-lg hover:shadow-indigo-300/50 transition-all">
            今すぐ始める
          </a>
        </div>
        
        <!-- Token Plans -->
        <div class="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm scroll-reveal" style="animation-delay: 0.2s;">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold mb-2">追加トークン</h3>
            <p class="text-gray-500">AI利用分が足りなくなったら</p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <span class="font-bold">ライト</span>
                <span class="text-gray-500 text-sm ml-2">30万文字</span>
              </div>
              <span class="text-xl font-bold">¥500</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <span class="font-bold">スタンダード</span>
                <span class="text-gray-500 text-sm ml-2">70万文字</span>
              </div>
              <span class="text-xl font-bold">¥1,000</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div>
                <span class="font-bold text-indigo-600">プロ</span>
                <span class="text-indigo-500 text-sm ml-2">1,200万文字</span>
                <span class="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-xs">お得</span>
              </div>
              <span class="text-xl font-bold text-indigo-600">¥10,000</span>
            </div>
          </div>
          
          <div class="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p class="text-amber-700 text-sm flex items-start gap-2">
              <i class="fas fa-info-circle mt-0.5"></i>
              <span>ベータ期間中は全機能無料でお試しいただけます！</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="py-24 bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 scroll-reveal">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4 font-mincho">
          よくある質問
        </h2>
      </div>
      
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-2xl overflow-hidden scroll-reveal">
          <button class="w-full px-6 py-5 text-left flex items-center justify-between font-medium" onclick="toggleFaq(this)">
            <span>AIが生成した文章の著作権は誰のものですか？</span>
            <i class="fas fa-chevron-down transition-transform"></i>
          </button>
          <div class="px-6 pb-5 hidden">
            <p class="text-gray-600">AIを補助ツールとして使用し、ユーザーが創作・編集した作品の著作権はユーザーに帰属します。myMuseはユーザーのコンテンツを一切使用・販売しません。</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-2xl overflow-hidden scroll-reveal">
          <button class="w-full px-6 py-5 text-left flex items-center justify-between font-medium" onclick="toggleFaq(this)">
            <span>オフラインでも使えますか？</span>
            <i class="fas fa-chevron-down transition-transform"></i>
          </button>
          <div class="px-6 pb-5 hidden">
            <p class="text-gray-600">基本的な執筆機能はオフラインでも使用できます。ただし、AI機能やクラウド同期にはインターネット接続が必要です。</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-2xl overflow-hidden scroll-reveal">
          <button class="w-full px-6 py-5 text-left flex items-center justify-between font-medium" onclick="toggleFaq(this)">
            <span>データは安全に保管されますか？</span>
            <i class="fas fa-chevron-down transition-transform"></i>
          </button>
          <div class="px-6 pb-5 hidden">
            <p class="text-gray-600">はい。すべてのデータは暗号化されてCloudflareのセキュアなインフラに保存されます。また、AI処理時もデータがモデル学習に使用されることはありません。</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-2xl overflow-hidden scroll-reveal">
          <button class="w-full px-6 py-5 text-left flex items-center justify-between font-medium" onclick="toggleFaq(this)">
            <span>返金はできますか？</span>
            <i class="fas fa-chevron-down transition-transform"></i>
          </button>
          <div class="px-6 pb-5 hidden">
            <p class="text-gray-600">購入から7日以内であれば、理由を問わず全額返金いたします。まずはベータ版で無料でお試しください。</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-2xl overflow-hidden scroll-reveal">
          <button class="w-full px-6 py-5 text-left flex items-center justify-between font-medium" onclick="toggleFaq(this)">
            <span>スマートフォンでも使えますか？</span>
            <i class="fas fa-chevron-down transition-transform"></i>
          </button>
          <div class="px-6 pb-5 hidden">
            <p class="text-gray-600">はい。myMuseはレスポンシブデザインに対応しており、スマートフォンやタブレットでも快適にご利用いただけます。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 hero-bg text-white relative overflow-hidden">
    <div class="absolute inset-0">
      <div class="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
    </div>
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-mincho scroll-reveal">
        あなたの物語が、<br>待っています。
      </h2>
      <p class="text-xl text-indigo-200 mb-10 scroll-reveal">
        今すぐ無料で始めて、AIと一緒に創作の世界へ。
      </p>
      <a href="/app" class="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-xl hover:shadow-xl hover:shadow-white/20 transition-all scroll-reveal group">
        <span>無料で始める</span>
        <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-feather-alt text-white"></i>
            </div>
            <span class="text-xl font-bold text-white">myMuse</span>
          </div>
          <p class="text-sm">創作の未来をともに描くAIパートナー</p>
        </div>
        
        <div>
          <h4 class="text-white font-medium mb-4">製品</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#features" class="hover:text-white transition">機能</a></li>
            <li><a href="#ai" class="hover:text-white transition">AI機能</a></li>
            <li><a href="#pricing" class="hover:text-white transition">料金</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-white font-medium mb-4">サポート</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#faq" class="hover:text-white transition">よくある質問</a></li>
            <li><a href="/app" class="hover:text-white transition">お問い合わせ</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-white font-medium mb-4">法的情報</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/app" class="hover:text-white transition">利用規約</a></li>
            <li><a href="/app" class="hover:text-white transition">プライバシーポリシー</a></li>
            <li><a href="/app" class="hover:text-white transition">特定商取引法に基づく表記</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm">© 2024 myMuse. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white transition"><i class="fab fa-twitter text-xl"></i></a>
          <a href="#" class="hover:text-white transition"><i class="fab fa-github text-xl"></i></a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Scroll reveal animation
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
    
    // FAQ toggle
    function toggleFaq(button) {
      const content = button.nextElementSibling;
      const icon = button.querySelector('i');
      
      content.classList.toggle('hidden');
      icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  </script>
</body>
</html>`;
