// Legal Pages HTML (Terms of Service and Privacy Policy)

const legalPageStyles = `
  <link rel="icon" type="image/png" href="/static/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; }
    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  </style>
`;

const legalPageHeader = `
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="/static/favicon.png" alt="ハザクラ" class="w-10 h-10 rounded-xl">
        <span class="text-xl font-bold gradient-text">ハザクラ</span>
      </a>
      <a href="/app" class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all text-sm">
        アプリへ
      </a>
    </div>
  </nav>
`;

const legalPageFooter = `
  <footer class="bg-gray-100 py-8 mt-16">
    <div class="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
      <div class="flex justify-center gap-6 mb-4">
        <a href="/terms" class="hover:text-indigo-600 transition">利用規約</a>
        <a href="/privacy" class="hover:text-indigo-600 transition">プライバシーポリシー</a>
        <a href="https://www.ratio-lab.com/tokutei" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 transition">特定商取引法に基づく表記</a>
      </div>
      <p>© 2026 ハザクラ / RATIO Lab. All rights reserved.</p>
    </div>
  </footer>
`;

export const termsPageHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>利用規約 - ハザクラ</title>
  ${legalPageStyles}
</head>
<body class="bg-gray-50 min-h-screen">
  ${legalPageHeader}
  
  <main class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8 text-center">利用規約</h1>
    
    <div class="bg-white rounded-2xl shadow-sm p-8 space-y-8">
      <p class="text-gray-600">最終更新日: 2026年3月1日</p>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第1条（適用）</h2>
        <p class="text-gray-700 leading-relaxed">
          本規約は、RATIO Lab.（以下「当社」）が提供するAI創作支援サービス「ハザクラ」（以下「本サービス」）の利用条件を定めるものです。ユーザーは、本規約に同意した上で本サービスを利用するものとします。
        </p>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第2条（定義）</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>「ユーザー」とは、本サービスを利用する個人または法人を指します。</li>
          <li>「コンテンツ」とは、ユーザーが本サービス上で作成・保存するテキスト、データ等を指します。</li>
          <li>「AI機能」とは、本サービスが提供する人工知能による文章生成・分析機能を指します。</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第3条（アカウント）</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>ユーザーは、正確な情報を登録してアカウントを作成するものとします。</li>
          <li>アカウント情報の管理責任はユーザーにあります。</li>
          <li>アカウントの第三者への譲渡・貸与は禁止します。</li>
        </ol>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第4条（料金・決済）</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>本サービスの料金体系は、無料プランおよび有料プラン（買い切り）で構成されます。</li>
          <li>有料プランの料金は、購入時に表示される金額とします。</li>
          <li>決済はKOMOJU決済サービスを通じて行われます。</li>
          <li>購入済みのトークン（AI利用分）に有効期限はありません。</li>
        </ol>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第5条（著作権）</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>ユーザーが作成したコンテンツの著作権は、ユーザーに帰属します。</li>
          <li>AI機能を使用して生成されたコンテンツについても、ユーザーが編集・創作した部分の著作権はユーザーに帰属します。</li>
          <li>当社は、ユーザーのコンテンツをサービス改善目的で使用することはありません。</li>
        </ol>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第6条（禁止事項）</h2>
        <p class="text-gray-700 mb-2">ユーザーは、以下の行為を行ってはなりません：</p>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>サービスの運営を妨害する行為</li>
          <li>他のユーザーまたは第三者の権利を侵害する行為</li>
          <li>不正アクセスまたはシステムへの攻撃</li>
          <li>虚偽情報の登録</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第7条（サービスの変更・停止）</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>当社は、事前の通知なくサービス内容を変更できるものとします。</li>
          <li>システム保守、天災等の理由により、サービスを一時停止することがあります。</li>
          <li>サービス停止により生じた損害について、当社は責任を負いません。</li>
        </ol>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第8条（免責事項）</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>AI機能による生成結果の正確性・適切性について、当社は保証しません。</li>
          <li>ユーザー間のトラブルについて、当社は責任を負いません。</li>
          <li>データの消失について、当社は故意または重大な過失がない限り責任を負いません。</li>
        </ol>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第9条（準拠法・裁判管轄）</h2>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>本規約の解釈は、日本法に準拠します。</li>
          <li>本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
        </ol>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">第10条（お問い合わせ）</h2>
        <p class="text-gray-700 leading-relaxed">
          本規約に関するお問い合わせは、以下までご連絡ください。<br>
          <strong>RATIO Lab.</strong><br>
          メール: info@ratio-lab.com
        </p>
      </section>
    </div>
  </main>
  
  ${legalPageFooter}
</body>
</html>`;

export const privacyPageHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プライバシーポリシー - ハザクラ</title>
  ${legalPageStyles}
</head>
<body class="bg-gray-50 min-h-screen">
  ${legalPageHeader}
  
  <main class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8 text-center">プライバシーポリシー</h1>
    
    <div class="bg-white rounded-2xl shadow-sm p-8 space-y-8">
      <p class="text-gray-600">最終更新日: 2026年3月1日</p>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">1. はじめに</h2>
        <p class="text-gray-700 leading-relaxed">
          RATIO Lab.（以下「当社」）は、AI創作支援サービス「ハザクラ」（以下「本サービス」）において、ユーザーの個人情報の保護を重要な責務と考えています。本プライバシーポリシーは、当社が収集する情報、その利用方法、およびユーザーの権利について説明します。
        </p>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">2. 収集する情報</h2>
        <p class="text-gray-700 mb-4">当社は、以下の情報を収集することがあります：</p>
        
        <h3 class="font-bold text-gray-800 mb-2">2.1 アカウント情報</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1 mb-4">
          <li>メールアドレス</li>
          <li>ユーザー名（ニックネーム）</li>
          <li>パスワード（ハッシュ化して保存）</li>
        </ul>
        
        <h3 class="font-bold text-gray-800 mb-2">2.2 利用データ</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1 mb-4">
          <li>作成したプロジェクト・作品データ</li>
          <li>AI機能の利用履歴</li>
          <li>決済履歴</li>
        </ul>
        
        <h3 class="font-bold text-gray-800 mb-2">2.3 自動収集データ</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
          <li>サービス利用状況</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">3. 情報の利用目的</h2>
        <p class="text-gray-700 mb-2">収集した情報は、以下の目的で利用します：</p>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>本サービスの提供・運営</li>
          <li>ユーザーサポートの提供</li>
          <li>決済処理</li>
          <li>サービスの改善・新機能の開発</li>
          <li>不正利用の防止</li>
          <li>法令に基づく対応</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">4. 情報の第三者提供</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
        </p>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づく開示請求があった場合</li>
          <li>決済処理に必要な範囲で決済事業者（KOMOJU）に提供する場合</li>
          <li>サービス提供に必要な範囲で業務委託先に提供する場合</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">5. AI機能とデータの取り扱い</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>AI機能の利用時、ユーザーの入力データはAI処理のために一時的に外部AIサービス（Grok、Gemini）に送信されます。</li>
          <li>送信されたデータは、AIサービス提供元のモデル学習には使用されません。</li>
          <li>ユーザーの作品データは、当社のAIモデルの学習には使用しません。</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">6. データの保管</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>ユーザーデータは、Cloudflareのセキュアなインフラストラクチャに保存されます。</li>
          <li>パスワードはハッシュ化して保存され、平文では保存しません。</li>
          <li>通信はSSL/TLSで暗号化されています。</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">7. ユーザーの権利</h2>
        <p class="text-gray-700 mb-2">ユーザーは、以下の権利を有します：</p>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>アクセス権</strong>: 保存されている個人情報の開示を請求できます。</li>
          <li><strong>訂正権</strong>: 不正確な情報の訂正を請求できます。</li>
          <li><strong>削除権</strong>: アカウント削除により、個人情報の削除を請求できます。</li>
          <li><strong>データポータビリティ</strong>: 作品データのエクスポートが可能です。</li>
        </ul>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">8. Cookieの使用</h2>
        <p class="text-gray-700 leading-relaxed">
          本サービスは、セッション管理のためにCookie（またはローカルストレージ）を使用します。これにより、ログイン状態の維持や設定の保存が可能になります。
        </p>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">9. 未成年者の利用</h2>
        <p class="text-gray-700 leading-relaxed">
          本サービスは、13歳未満の方の利用を想定していません。13歳未満の方が本サービスを利用する場合は、保護者の同意が必要です。
        </p>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">10. ポリシーの変更</h2>
        <p class="text-gray-700 leading-relaxed">
          当社は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、サービス内での通知またはメールでお知らせします。
        </p>
      </section>
      
      <section>
        <h2 class="text-xl font-bold mb-4 text-indigo-600">11. お問い合わせ</h2>
        <p class="text-gray-700 leading-relaxed">
          本ポリシーに関するお問い合わせは、以下までご連絡ください。<br>
          <strong>RATIO Lab.</strong><br>
          メール: info@ratio-lab.com
        </p>
      </section>
    </div>
  </main>
  
  ${legalPageFooter}
</body>
</html>`;
