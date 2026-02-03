# myMuse - 次世代作家支援プラットフォーム

<p align="center">
  <strong>「執筆のすべてを把握し、寄り添う全知の相棒」</strong>
</p>

## 🎯 プロジェクト概要

myMuseは、Gemini AIの全知性（Unified Context）を搭載した次世代作家支援プラットフォームです。プロジェクトごとにAIとの会話履歴、プロット、設定、執筆本文が完全に統合され、説明不要で文脈を理解する体験を提供します。

## 🌐 URL

- **開発環境**: https://3000-i7zwfspjsy8t2g4v1o5hr-b9b802c4.sandbox.novita.ai
- **本番環境**: Cloudflare Pagesへデプロイ予定

## ✅ 実装済み機能

### UI/UX構造
- **3カラム・レイアウト** (PC/タブレット): 左：管理 / 中：執筆 / 右：AI
- **ボトムナビゲーション** (スマートフォン): ホーム/執筆/管理/設定
- **ダークモード/ライトモード** 切り替え対応
- **12言語対応** (日本語、英語、中国語、韓国語、スペイン語、フランス語、ドイツ語、ポルトガル語、ロシア語、アラビア語(RTL)、ヒンディー語、タイ語)

### 左サイドバー：管理と習慣
- ✅ **プロジェクト管理**: フォルダ作成/新規プロジェクト作成/切替
- ✅ **ゴミ箱機能**: 30日間復元可能
- ✅ **全文検索**: プロジェクト内の全データ横断検索
- ✅ **創作カレンダー**: メモ機能（黄色背景）、締め切り設定（赤色強調）
- ✅ **言語切り替え**: 12言語対応
- ✅ **AI利用量メーター**: クレジット残量表示

### 中央メインエリア：執筆キャンバス
- ✅ **ネタ考案タブ**: ジャンル/キーワード入力、生成数指定(3/5/10案)、採用ボタン
- ✅ **プロットタブ**: テンプレート選択(起承転結、三幕構成、ブレイク・スナイダー)、AI補完
- ✅ **ライティングタブ**:
  - プロット参照エリア（ピン留め）
  - ZENモード（集中モード）
  - 縦書き/横書き切り替え
  - Smart Font System（日本語フォント対応）
  - 音声読み上げ（Web Speech API）
  - エクスポート（TXT, HTML）
- ✅ **分析・批評タブ**: 感情曲線グラフ、作品成分レーダーチャート、3ペルソナ評価
- ✅ **相談AIタブ**: チャット履歴（プロジェクト別永続保存）、全知性コンテキスト

### 右サイドバー：AIパートナー
- ✅ **クイックアクション**: 続きを書く/書き直す/拡張/校正/要約/翻訳/タイトル案
- ✅ **文体変換**: 敬語/カジュアル/文学的
- ✅ **カスタム指示**: プロンプト入力欄、目標文字数
- ✅ **インタラクティブ・チャット履歴**: タイムライン形式表示

### AI機能
- ✅ **Gemini API統合** (gemini-2.0-flash)
- ✅ **Unified Context**: プロット、設定、チャット履歴、カレンダー予定を統合
- ✅ **分析・批評ユニット**: マルチペルソナ評価、感情グラフ、レーダーチャート
- ✅ **締め切りアドバイス**: 残日数から1日の目標文字数算出

### システム
- ✅ **認証システム**: セッション管理
- ✅ **オートセーブ**: 執筆内容の自動保存
- ✅ **データ同期**: D1データベース使用
- ✅ **プライバシー保護**: ユーザーデータはAI学習に使用しない設計

## 🔮 未実装機能（将来の拡張）

- ⏳ Firebase Auth / Supabase Auth 統合
- ⏳ VOICEVOX API 統合（音声読み上げ拡張）
- ⏳ 実績解除システム（バッジ生成）
- ⏳ DOCX/PDF/EPUB エクスポート
- ⏳ Stripe 決済統合
- ⏳ リアルタイム同期（複数デバイス間）

## 📁 プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx          # メインHonoアプリケーション
│   ├── routes/
│   │   └── api.ts         # APIルート（全CRUD操作、AI連携）
│   ├── types/
│   │   └── index.ts       # TypeScript型定義
│   └── utils/
│       ├── gemini.ts      # Gemini API統合
│       └── i18n.ts        # 多言語対応
├── public/
│   └── static/
│       └── app.js         # フロントエンドJavaScript
├── migrations/
│   └── 0001_initial_schema.sql  # D1データベーススキーマ
├── seed.sql               # デモデータ
├── wrangler.jsonc         # Cloudflare設定
├── package.json
└── README.md
```

## 🗄️ データモデル

### 主要テーブル
- **users**: ユーザー情報、言語設定、テーマ、AIクレジット
- **projects**: 執筆プロジェクト、締め切り、目標文字数
- **folders**: プロジェクトフォルダ
- **writings**: 執筆本文、章管理
- **plots**: プロット（テンプレート別構造）
- **ideas**: ネタ考案結果
- **characters**: キャラクター設定
- **world_settings**: 世界観設定
- **chat_history**: AIチャット履歴（プロジェクト別）
- **calendar_events**: カレンダーイベント、締め切り
- **achievements**: 実績バッジ
- **sessions**: 認証セッション

## 🚀 使用方法

### ローカル開発

```bash
# 依存関係インストール
npm install

# D1マイグレーション実行
npm run db:migrate:local

# デモデータ投入
npm run db:seed

# 開発サーバー起動
npm run build
npm run dev:sandbox
```

### アクセス

1. アプリにアクセス
2. 任意のメールアドレスでログイン（デモ用: 自動アカウント作成）
3. 新規プロジェクト作成 or デモプロジェクト選択
4. 5つのタブを使って執筆を開始

## 🛠️ 技術スタック

- **Backend**: Hono (TypeScript)
- **Frontend**: Vanilla JS + Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **AI**: Google Gemini API (gemini-2.0-flash)
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Shippori Mincho, Noto Sans/Serif JP, etc.)
- **Deployment**: Cloudflare Pages

## 📝 API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - セッション確認

### プロジェクト
- `GET /api/projects` - プロジェクト一覧
- `POST /api/projects` - 新規作成
- `GET /api/projects/:id` - 詳細取得
- `PUT /api/projects/:id` - 更新
- `DELETE /api/projects/:id` - 削除（ゴミ箱へ）
- `POST /api/projects/:id/restore` - 復元

### 執筆・コンテンツ
- `GET /api/projects/:id/writings` - 執筆一覧
- `PUT /api/writings/:id` - 執筆更新
- `GET /api/projects/:id/plot` - プロット取得
- `PUT /api/plots/:id` - プロット更新
- `GET /api/projects/:id/ideas` - アイデア一覧
- `POST /api/projects/:id/ideas` - アイデア追加

### AI
- `POST /api/ai/generate` - AI生成（続き書く、書き直す、等）
- `POST /api/ai/analyze` - 作品分析
- `POST /api/ai/generate-ideas` - アイデア生成
- `POST /api/ai/deadline-advice` - 締め切りアドバイス

### その他
- `GET /api/search` - 全文検索
- `GET /api/calendar` - カレンダーイベント
- `GET /api/trash` - ゴミ箱

## 📄 ライセンス

MIT License

---

**myMuse** - あなたの創作活動に寄り添う、全知のミューズ 🎭✨
