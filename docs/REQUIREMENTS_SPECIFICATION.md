# myMuse 要件定義書（Requirements Specification Document）

**バージョン**: 1.0  
**作成日**: 2026-02-17  
**プロジェクト名**: myMuse - 次世代作家支援プラットフォーム  
**タグライン**: 「創作の未来をともに描くパートナー」

---

## 1. プロジェクト概要

### 1.1 製品ビジョン
myMuseは、Gemini AIの全知性（Unified Context）を搭載した次世代作家支援プラットフォームです。プロジェクトごとにAIとの会話履歴、プロット、設定、執筆本文が完全に統合され、説明不要で文脈を理解する執筆体験を提供します。

### 1.2 対象ユーザー
- プロ・アマチュア作家
- Web小説作家
- 脚本家
- ストーリーライター
- 同人作家
- 執筆を趣味とする一般ユーザー

### 1.3 技術スタック
| カテゴリ | 技術 |
|---------|------|
| バックエンド | Hono (TypeScript) |
| フロントエンド | Vanilla JavaScript + Tailwind CSS |
| データベース | Cloudflare D1 (SQLite) |
| AI | Google Gemini API (gemini-2.0-flash) |
| 画像生成 | NovelAI API (NAI Diffusion 3) |
| チャートライブラリ | Chart.js |
| アイコン | Font Awesome 6.4 |
| フォント | Google Fonts (Shippori Mincho, Noto Sans/Serif JP他) |
| デプロイ | Cloudflare Pages |

---

## 2. 機能要件

### 2.1 UI/UX構造

#### 2.1.1 レスポンシブレイアウト
- **PC/タブレット（768px以上）**: 3カラムレイアウト
  - 左サイドバー（264px）: プロジェクト管理
  - 中央メインエリア: タブ切り替えで執筆機能
  - 右サイドバー（320px）: AIパートナー
- **スマートフォン（768px未満）**: シングルカラム + ボトムナビゲーション
  - ボトムナビ: ホーム / 執筆 / 管理 / 設定

#### 2.1.2 テーマ機能
| 機能 | 仕様 |
|------|------|
| ライトモード | 白基調のUI |
| ダークモード | 暗い背景のUI（目に優しい） |
| 切り替え | ユーザー設定で即時反映 |
| 永続化 | LocalStorageとDBに保存 |

#### 2.1.3 多言語対応（12言語）
| 言語コード | 言語名 | 特殊対応 |
|-----------|--------|---------|
| ja | 日本語 | デフォルト言語 |
| en | English | - |
| zh | 中文 | - |
| ko | 한국어 | - |
| es | Español | - |
| fr | Français | - |
| de | Deutsch | - |
| pt | Português | - |
| ru | Русский | - |
| ar | العربية | RTL（右から左）対応 |
| hi | हिन्दी | - |
| th | ไทย | - |

---

### 2.2 認証システム

#### 2.2.1 ログイン機能
```
POST /api/auth/login
Request: { email: string, password: string }
Response: { user: User, sessionId: string }
```
- メールアドレスとパスワードでログイン
- セッションID発行（30日間有効）
- 不存在ユーザーの場合、新規登録を案内

#### 2.2.2 新規登録機能
```
POST /api/auth/signup
Request: { name: string, email: string, password: string }
Response: { user: User, sessionId: string }
```
- 名前、メールアドレス、パスワードで登録
- 初期AIクレジット: 10,000
- 重複メールアドレスチェック

#### 2.2.3 ゲストログイン機能
- ランダムな一時アカウントを自動生成
- 全機能の試用が可能
- 一定期間後にデータ削除

#### 2.2.4 セッション管理
```
GET /api/auth/me
Header: X-Session-Id: string
Response: { user: User | null }
```
- セッションIDをHTTPヘッダーで認証
- LocalStorageにセッションID保存
- 30日後に自動失効

---

### 2.3 左サイドバー：プロジェクト管理

#### 2.3.1 プロジェクト構造
```
【プロジェクト種別】
1. スタンドアロンプロジェクト
   - 単体の執筆プロジェクト
   - 独自の設定・プロット・執筆内容

2. ライブラリ（シリーズ）
   - 複数のエピソード（子プロジェクト）を束ねる親
   - 共通設定（キャラ、世界観、専門用語）を子に継承
   - is_library: true

3. 子プロジェクト（エピソード）
   - ライブラリに属する個別の話
   - 親から設定を継承 + 話固有の設定
   - library_id: string（親のID）
```

#### 2.3.2 プロジェクトCRUD操作
| 操作 | エンドポイント | 説明 |
|-----|---------------|------|
| 一覧取得 | `GET /api/projects?userId={id}` | ユーザーのプロジェクト一覧 |
| 新規作成 | `POST /api/projects` | プロジェクト作成 |
| 詳細取得 | `GET /api/projects/{id}` | 単体プロジェクト取得 |
| 更新 | `PUT /api/projects/{id}` | プロジェクト情報更新 |
| 削除 | `DELETE /api/projects/{id}` | ソフトデリート（ゴミ箱へ） |
| 復元 | `POST /api/projects/{id}/restore` | ゴミ箱から復元 |

#### 2.3.3 フォルダ管理
```
POST /api/folders
Request: { user_id: string, name: string, parent_id?: string }
```
- 階層的フォルダ構造
- プロジェクトをフォルダに整理

#### 2.3.4 ゴミ箱機能
- ソフトデリート: `deleted_at`にタイムスタンプ
- 30日間復元可能
- 30日後に自動完全削除
- ゴミ箱一覧: `GET /api/trash?userId={id}`

#### 2.3.5 全文検索
```
GET /api/search?userId={id}&q={query}
Response: { results: SearchResult[] }
```
検索対象:
- プロジェクトのタイトル・説明
- 執筆本文
- アイデア
- プロット構造

#### 2.3.6 創作カレンダー
| 機能 | 説明 |
|------|------|
| メモ機能 | 任意の日付にメモ追加（黄色背景） |
| 締め切り設定 | 締め切り日を設定（赤色強調） |
| 残り日数表示 | 締め切りまでの日数を自動計算 |
| 月別表示 | カレンダー形式で表示 |

```
POST /api/calendar
Request: { user_id, project_id?, event_date, title, description?, is_deadline }
```

#### 2.3.7 言語切り替え
- ドロップダウンで12言語から選択
- 即時UI反映
- LocalStorageとDBに保存

#### 2.3.8 AI利用量メーター
- 残りAIクレジット表示
- プログレスバーで視覚化
- AI呼び出しごとに1クレジット消費

---

### 2.4 中央メインエリア：タブ機能

#### 2.4.1 タブ構成
| タブ名 | アイコン | 機能概要 |
|--------|---------|---------|
| 設定・資料 | fa-cog | プロジェクト設定、キャラ、世界観、専門用語 |
| ネタ考案 | fa-lightbulb | AIアイデア生成、プロットメモ、採用管理 |
| プロット | fa-sitemap | テンプレート選択、構成編集 |
| ライティング | fa-pen-fancy | 本文執筆、フォーマット |
| 挿絵 | fa-image | AI画像生成（開発中） |
| 分析・批評 | fa-chart-pie | 感情曲線、成分チャート、ペルソナ評価 |
| 相談AI | fa-comments | AIとのチャット |
| 実績 | fa-trophy | バッジ、進捗トラッキング |

---

### 2.5 設定・資料タブ（Settings & Materials Tab）

#### 2.5.1 プロジェクト種別による表示分岐

**A. ライブラリ（シリーズ）設定画面**
- 紫色のヘッダーバナー
- シリーズ全体のジャンル設定
- シリーズ説明
- 子プロジェクト（話）一覧
- 共通キャラクター設定
- 共通専門用語
- 共通世界観設定
- 設定AIアシスタント（チャット）
- 「シリーズ設定を保存」ボタン
- 自動同期オプション（保存時に全話へ反映）

**B. 子プロジェクト（エピソード）設定画面**
- 青色のヘッダーバナー（親ライブラリへのリンク付き）
- 親の共通設定プレビュー（折りたたみ可能、読み取り専用）
- ジャンル（親から継承、読み取り専用）
- この話の目標
- この話の登場人物（新登場キャラなど）
- この話の専門用語
- この話の舞台
- この話の構成
- 設定AIアシスタント（チャット）
- 「この話の設定を保存」ボタン

**C. スタンドアロンプロジェクト設定画面**
- ジャンル設定（複数選択可能）
- 描きたい物語（テーマ、メッセージ）
- キャラ設定
- 専門用語
- 世界観設定
- 各話アウトライン
- 設定AIアシスタント（チャット）
- 「設定を保存」ボタン

#### 2.5.2 ジャンル一覧（30種類）

**フィクション - 伝統**
- 純文学、現代文学、ファンタジー、SF、ミステリー、サスペンス、ホラー、恋愛小説、歴史小説、冒険・アクション、ライトノベル、児童文学

**Web小説 / 現代ジャンル**
- LitRPG、Progression Fantasy、GameLit、異世界、アーバンファンタジー、コージーミステリー

**アジアンWeb小説**
- 仙侠、武侠、修真

**ノンフィクション**
- エッセイ、評論・批評、ビジネス書、自己啓発書、哲学書、社会学・文化論、歴史書、科学解説書、ジャーナリズム、伝記・自伝

#### 2.5.3 設定AIアシスタント
- リアルタイムチャット機能
- キャラ深掘り、設定チェック、アイデア提案
- クイックプロンプトボタン
- 設定コンテキストを自動参照

---

### 2.6 ネタ考案タブ（Ideas Tab）

#### 2.6.1 AIアイデア生成
```
POST /api/ai/generate-ideas
Request: { genre: string, keywords: string, count: 3|5|10 }
Response: { ideas: [{ title, content, genre }] }
```
- ジャンル選択
- キーワード入力
- 生成数指定（3/5/10案）
- JSON形式でアイデア配列を返却

#### 2.6.2 アイデア管理
| 操作 | エンドポイント |
|-----|---------------|
| 一覧取得 | `GET /api/projects/{id}/ideas` |
| 追加 | `POST /api/projects/{id}/ideas` |
| 採用 | `PUT /api/ideas/{id}/adopt` |
| 採用解除 | `PUT /api/ideas/{id}/unadopt` |
| 削除 | `DELETE /api/ideas/{id}` |

#### 2.6.3 アイデア採用フロー
1. AIがアイデアを生成
2. ユーザーが「採用」ボタンをクリック
3. `adopted = 1`に更新
4. 採用アイデアはAIコンテキストに自動統合
5. プロット・執筆時にAIが参照

#### 2.6.4 プロットメモ（自由記述）
- ワードプロセッサ形式の自由記述エリア
- アウトライン表示切り替え
- AIチャットとの連携

---

### 2.7 プロットタブ（Plot Tab）

#### 2.7.1 プロットテンプレート
| テンプレート | 構成要素 |
|-------------|---------|
| 起承転結 | 起・承・転・結（日本伝統） |
| 三幕構成 | 第一幕・第二幕・第三幕（ハリウッド式） |
| ブレイク・スナイダー | Save the Cat! 15ビート |
| 英雄の旅 | Hero's Journey（神話構造） |

#### 2.7.2 プロット操作
```
GET /api/projects/{id}/plot
PUT /api/plots/{id}
Request: { template: string, structure: JSON }
```
- テンプレート選択
- 各セクションのテキスト編集
- AI補完機能（空欄を自動埋め）

---

### 2.8 ライティングタブ（Writing Tab）

#### 2.8.1 エディタ機能
| 機能 | 説明 |
|------|------|
| オートセーブ | 1秒デバウンスで自動保存 |
| 手動保存 | Ctrl+S / ⌘+S |
| 保存インジケータ | 保存中/保存済み/未保存 表示 |
| 文字数カウント | リアルタイム更新 |

#### 2.8.2 執筆モード
| モード | 説明 |
|--------|------|
| 横書き | 左から右への通常表示 |
| 縦書き | 右から左への日本語縦組み |
| 英数字正立 | 縦書き時に英数字を正立表示 |
| 英数字横倒し | 縦書き時に英数字を横倒し表示 |

#### 2.8.3 ZENモード
- サイドバー非表示
- ヘッダー非表示
- 執筆エリアのみ全画面表示
- ESCキーで終了
- 集中執筆環境

#### 2.8.4 Smart Font System
- 日本語フォント: Shippori Mincho, Noto Serif JP, BIZ UDMincho
- 英語フォント: Merriweather, Georgia
- 言語に応じた最適フォント自動選択

#### 2.8.5 テキスト書式
| 書式 | マークダウン記法 |
|------|-----------------|
| 見出し1 | `# テキスト` |
| 見出し2 | `## テキスト` |
| 見出し3 | `### テキスト` |
| 和風見出し | `【テキスト】` |

#### 2.8.6 エクスポート機能
| 形式 | 対応状況 |
|------|---------|
| TXT | ✅ 実装済み |
| HTML | ✅ 実装済み |
| Markdown | ✅ 実装済み |
| RTF | ✅ 実装済み |
| PDF | ✅ 印刷機能経由 |
| HTML (ZIP) | ⏳ 準備中 |
| DOCX | ⏳ 準備中 |
| EPUB | ⏳ 準備中 |
| ODT | ⏳ 準備中 |

#### 2.8.7 音声読み上げ
- Web Speech API使用
- 選択テキストまたは全文を読み上げ
- 言語に応じた読み上げ音声
- 読み上げ速度: 0.9倍速

---

### 2.9 挿絵タブ（Illustration Tab）

#### 2.9.1 AI画像生成（開発中）
```
POST /api/illustration/generate
Request: {
  prompt: string,
  negative_prompt?: string,
  width?: number,
  height?: number,
  steps?: number,
  reference_image?: string,
  projectContext?: object
}
Response: { imageUrl: string (base64) }
```

#### 2.9.2 NovelAI統合
- モデル: NAI Diffusion 3 (nai-diffusion-3)
- サンプラー: k_euler_ancestral
- デフォルト解像度: 512x768
- ネガティブプロンプト対応
- 参照画像からのImg2Img対応

#### 2.9.3 プロジェクトコンテキスト連携
- 世界観設定をプロンプトに自動追加
- キャラクター設定の反映
- 一貫性のある挿絵生成

---

### 2.10 分析・批評タブ（Analysis Tab）

#### 2.10.1 作品分析
```
POST /api/ai/analyze
Request: { content: string }
Response: {
  analysis: {
    emotionCurve: [...],
    radarChart: [...]
  }
}
```

#### 2.10.2 感情曲線グラフ
| 項目 | 説明 |
|------|------|
| X軸 | 物語の進行度（0-100%） |
| Y軸 | 感情値（-100〜+100） |
| ラベル | 各ポイントの場面説明 |

**感情値の基準**:
- +100: 歓喜、大勝利、感動的な再会
- +75: 喜び、成功、希望の光
- +50: 明るい展開、前向きな変化
- +25: やや明るい、期待感
- 0: 中立、日常描写
- -25: やや暗い、不安の影
- -50: 悲しみ、困難、失敗
- -75: 深い悲しみ、絶望感
- -100: 最大の悲劇、死

#### 2.10.3 作品成分レーダーチャート
評価軸（各0-100）:
- アクション
- ロマンス
- ミステリー
- コメディ
- ドラマ
- ファンタジー

#### 2.10.4 ペルソナ評価
AIが複数の読者ペルソナになりきって批評:
- 客観的な文芸批評家
- 熱心なファン
- 厳しい編集者

#### 2.10.5 分析AIチャット
```
POST /api/ai/chat
Request: {
  action: 'analysis_chat',
  message: string,
  content: string,
  context: { persona, writing, plot, chatHistory }
}
```
- 分析結果に基づく対話
- 改善点の深掘り
- 具体的なシーン・キャラクター名を引用

---

### 2.11 相談AIタブ（Consultation Tab）

#### 2.11.1 永続チャット機能
- プロジェクト別のチャット履歴
- スレッド形式で会話を管理
- 過去の会話をコンテキストに含む

#### 2.11.2 チャットデータ構造
```
chat_history {
  id: TEXT PRIMARY KEY,
  project_id: TEXT,
  thread_id: TEXT,
  role: 'user' | 'assistant',
  content: TEXT,
  tab_context: TEXT,
  created_at: DATETIME
}
```

#### 2.11.3 Unified Context
AIは以下のコンテキストを自動参照:
- プロット構造
- キャラクター設定
- 世界観設定
- カレンダー予定・締め切り
- 採用済みアイデア
- 過去のチャット履歴（直近10件）
- 現在の執筆内容

---

### 2.12 実績タブ（Achievements Tab）

#### 2.12.1 バッジシステム
| ティア | 色 |
|--------|-----|
| プラチナ | シルバーグラデーション |
| ゴールド | ゴールドグラデーション |
| シルバー | シルバー |
| ブロンズ | ブロンズ |
| 頑張ってね | グレー |

#### 2.12.2 AI実績生成
```
POST /api/ai/generate-achievements
Request: { writingStats: object }
Response: { achievements: [{ badge_type, badge_title, badge_description }] }
```

#### 2.12.3 進捗トラッキング
- 月次の執筆目標
- 達成度プログレスバー
- 獲得バッジ一覧

---

### 2.13 右サイドバー：AIパートナー

#### 2.13.1 クイックアクション
| アクション | API action | 説明 |
|-----------|------------|------|
| 続きを書く | continue | 自然な流れで続きを生成 |
| 書き直す | rewrite | 表現を改善して再生成 |
| 拡張 | expand | 描写を豊かに拡張 |
| 校正 | proofread | 誤字脱字・文法チェック |
| 要約 | summarize | 主要ポイントを要約 |
| 翻訳 | translate | 指定言語に翻訳 |
| タイトル案 | title | 5つのタイトル案を提案 |

#### 2.13.2 文体変換
| スタイル | API action | 説明 |
|---------|------------|------|
| 敬語 | style_formal | 丁寧語に変換 |
| カジュアル | style_casual | くだけた表現に変換 |
| 文学的 | style_literary | 詩的・文学的な表現に変換 |

#### 2.13.3 カスタム指示
- 自由記述のプロンプト入力
- 目標文字数指定
- `custom`アクションで処理

#### 2.13.4 AIレスポンス履歴
- タイムライン形式で過去の生成結果表示
- 結果の採用・コピー機能
- 履歴は右サイドバーに表示

---

## 3. データモデル

### 3.1 データベーススキーマ

#### users（ユーザー）
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  language TEXT DEFAULT 'ja',
  theme TEXT DEFAULT 'light',
  ai_credits INTEGER DEFAULT 10000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### projects（プロジェクト）
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  status TEXT DEFAULT 'active',
  deadline DATE,
  target_word_count INTEGER DEFAULT 0,
  folder_id TEXT,
  pinned_plot TEXT,
  is_library INTEGER DEFAULT 0,      -- ライブラリフラグ
  library_id TEXT,                   -- 親ライブラリID
  library_settings TEXT,             -- JSON: 共通設定
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### folders（フォルダ）
```sql
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

#### ideas（アイデア）
```sql
CREATE TABLE ideas (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  genre TEXT,
  adopted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### plots（プロット）
```sql
CREATE TABLE plots (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  template TEXT DEFAULT 'kishotenketsu',
  structure TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### characters（キャラクター）
```sql
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  voice_settings TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### world_settings（世界観設定）
```sql
CREATE TABLE world_settings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### writings（執筆本文）
```sql
CREATE TABLE writings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  chapter_number INTEGER DEFAULT 1,
  chapter_title TEXT,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  writing_direction TEXT DEFAULT 'horizontal',
  font_family TEXT DEFAULT 'Noto Sans JP',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### chat_history（チャット履歴）
```sql
CREATE TABLE chat_history (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tab_context TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### calendar_events（カレンダーイベント）
```sql
CREATE TABLE calendar_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_deadline INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

#### achievements（実績）
```sql
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  badge_title TEXT NOT NULL,
  badge_description TEXT,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### sessions（セッション）
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 4. API仕様

### 4.1 認証API
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /api/auth/signup | 新規登録 |
| POST | /api/auth/login | ログイン |
| POST | /api/auth/logout | ログアウト |
| GET | /api/auth/me | セッション確認 |

### 4.2 ユーザーAPI
| メソッド | パス | 説明 |
|---------|------|------|
| PUT | /api/users/{id} | ユーザー情報更新 |
| DELETE | /api/users/{id} | アカウント削除 |

### 4.3 プロジェクトAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects | プロジェクト一覧 |
| POST | /api/projects | プロジェクト作成 |
| GET | /api/projects/{id} | プロジェクト詳細 |
| PUT | /api/projects/{id} | プロジェクト更新 |
| DELETE | /api/projects/{id} | プロジェクト削除 |
| POST | /api/projects/{id}/restore | ゴミ箱から復元 |

### 4.4 フォルダAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/folders | フォルダ一覧 |
| POST | /api/folders | フォルダ作成 |
| DELETE | /api/folders/{id} | フォルダ削除 |

### 4.5 執筆API
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects/{id}/writings | 執筆一覧 |
| POST | /api/projects/{id}/writings | 章追加 |
| PUT | /api/writings/{id} | 執筆更新 |

### 4.6 プロットAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects/{id}/plot | プロット取得 |
| PUT | /api/plots/{id} | プロット更新 |

### 4.7 アイデアAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects/{id}/ideas | アイデア一覧 |
| POST | /api/projects/{id}/ideas | アイデア追加 |
| PUT | /api/ideas/{id}/adopt | アイデア採用 |
| PUT | /api/ideas/{id}/unadopt | 採用解除 |
| DELETE | /api/ideas/{id} | アイデア削除 |

### 4.8 キャラクターAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects/{id}/characters | キャラクター一覧 |
| POST | /api/projects/{id}/characters | キャラクター追加 |
| PUT | /api/characters/{id} | キャラクター更新 |
| DELETE | /api/characters/{id} | キャラクター削除 |

### 4.9 世界観設定API
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects/{id}/world-settings | 設定一覧 |
| POST | /api/projects/{id}/world-settings | 設定追加 |

### 4.10 チャットAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/projects/{id}/chat | メッセージ取得 |
| GET | /api/projects/{id}/chat/threads | スレッド一覧 |
| POST | /api/projects/{id}/chat | メッセージ送信 |

### 4.11 カレンダーAPI
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/calendar | イベント取得 |
| POST | /api/calendar | イベント追加 |
| PUT | /api/calendar/{id} | イベント更新 |
| DELETE | /api/calendar/{id} | イベント削除 |

### 4.12 検索API
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/search | 全文検索 |
| GET | /api/trash | ゴミ箱一覧 |

### 4.13 実績API
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/users/{id}/achievements | 実績一覧 |
| POST | /api/users/{id}/achievements | 実績追加 |

### 4.14 AI API
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /api/ai/generate | AI生成（汎用） |
| POST | /api/ai/analyze | 作品分析 |
| POST | /api/ai/generate-ideas | アイデア生成 |
| POST | /api/ai/deadline-advice | 締め切りアドバイス |
| POST | /api/ai/generate-achievements | 実績生成 |
| POST | /api/ai/chat | AIチャット |

### 4.15 画像生成API
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /api/illustration/generate | 挿絵生成 |
| POST | /api/novelai/generate | NovelAI直接呼び出し |

---

## 5. AI統合仕様

### 5.1 Gemini API設定
```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: messages,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  }
);
```

### 5.2 Unified Context構造
```typescript
interface GeminiContext {
  plot?: string;
  characters?: { name: string; description: string }[];
  worldSettings?: { category: string; title: string; content: string }[];
  chatHistory?: { role: string; content: string }[];
  calendarEvents?: { date: string; title: string; is_deadline: boolean }[];
  currentWriting?: string;
  adoptedIdeas?: { title: string; content: string }[];
  projectGenres?: string;
  storyOutline?: {
    characters?: string;
    terminology?: string;
    worldSetting?: string;
    storyGoal?: string;
    episodes?: string;
  };
  ideasDocument?: string;
  adoptedIdeasText?: string;
}
```

### 5.3 AIアクション一覧
| action値 | 説明 | 出力形式 |
|---------|------|---------|
| continue | 続きを書く | テキスト |
| rewrite | 書き直す | テキスト |
| expand | 拡張 | テキスト |
| proofread | 校正 | テキスト |
| summarize | 要約 | テキスト |
| translate | 翻訳 | テキスト |
| title | タイトル案 | テキスト（5案） |
| style_formal | 敬語変換 | テキスト |
| style_casual | カジュアル変換 | テキスト |
| style_literary | 文学的変換 | テキスト |
| generate_ideas | アイデア生成 | JSON配列 |
| analyze | 作品分析 | JSON |
| plot_complete | プロット補完 | テキスト |
| custom | カスタム指示 | テキスト |
| consultation | 相談チャット | テキスト |
| achievement | 実績生成 | JSON配列 |
| ideas_chat | ネタ考案チャット | テキスト |
| settings_chat | 設定AIチャット | テキスト |
| analysis_chat | 分析AIチャット | テキスト |

---

## 6. 将来拡張（未実装機能）

### 6.1 認証拡張
- [ ] Firebase Authentication統合
- [ ] Supabase Auth統合
- [ ] Google OAuth
- [ ] Twitter OAuth

### 6.2 音声機能
- [ ] VOICEVOX API統合
- [ ] キャラクター別音声設定
- [ ] 小説の自動朗読

### 6.3 エクスポート拡張
- [ ] DOCX正式対応
- [ ] PDF直接生成
- [ ] EPUB生成
- [ ] 印刷用組版

### 6.4 課金機能
- [ ] Stripe統合
- [ ] プラン管理
- [ ] AIクレジット購入

### 6.5 コラボレーション
- [ ] リアルタイム同期
- [ ] 共同編集機能
- [ ] コメント機能

### 6.6 AI拡張
- [ ] Grok API対応
- [ ] OpenAI API対応
- [ ] AIプロバイダー切り替え

---

## 7. 非機能要件

### 7.1 パフォーマンス
- ページロード: 3秒以内
- API応答: 500ms以内（AI除く）
- オートセーブ: 1秒デバウンス

### 7.2 セキュリティ
- セッションベース認証
- HTTPS必須
- CORS設定
- サニタイズ処理

### 7.3 可用性
- Cloudflare Pagesのグローバル配信
- D1データベースの自動バックアップ
- エッジロケーションでの配信

### 7.4 プライバシー
- ユーザーデータはAI学習に使用しない
- 執筆内容の暗号化保存（将来）
- データエクスポート機能

---

## 8. 開発・デプロイ情報

### 8.1 開発環境URL
```
https://3000-i7zwfspjsy8t2g4v1o5hr-b9b802c4.sandbox.novita.ai
```

### 8.2 デプロイコマンド
```bash
# ビルド
npm run build

# 開発サーバー起動
npm run dev:sandbox

# D1マイグレーション（ローカル）
npm run db:migrate:local

# D1マイグレーション（本番）
npm run db:migrate:prod

# Cloudflare Pagesデプロイ
npm run deploy
```

### 8.3 環境変数
| 変数名 | 説明 |
|--------|------|
| GEMINI_API_KEY | Google Gemini APIキー |
| NOVELAI_API_KEY | NovelAI APIキー |
| AI_PROVIDER | AIプロバイダー（gemini/grok/openai） |
| DB | D1データベースバインディング |

---

## 更新履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0 | 2026-02-17 | 初版作成 |

---

**myMuse** - 創作の未来をともに描くパートナー 🎭✨
