# myMuse バックアップ & 運用ガイド

## 📦 バックアップの仕組み

### Cloudflare D1 自動バックアップ

Cloudflare D1は**自動的に毎日スナップショット**を作成します。

| 項目 | 詳細 |
|------|------|
| 頻度 | 毎日自動 |
| 保持期間 | 過去30日間 |
| 復元方法 | Cloudflareダッシュボードから |

**復元手順:**
1. [Cloudflareダッシュボード](https://dash.cloudflare.com/) にログイン
2. Workers & Pages → D1 → mymuse-db を選択
3. 「Backups」タブを開く
4. 復元したい日付のバックアップを選択
5. 「Restore」をクリック

### 手動バックアップコマンド

```bash
# ローカルデータベースのバックアップ
npm run db:backup:local

# ローカルデータベースのSQLエクスポート
npm run db:export

# 本番データベースのエクスポート
wrangler d1 export mymuse-db --output=backup.sql
```

### 管理者ページからのエクスポート

1. `/admin` にアクセス
2. 「エクスポート」タブを選択
3. 「全データエクスポート」または「個別ユーザーエクスポート」をクリック
4. JSONファイルがダウンロードされます

---

## 🔐 管理者アクセス

### 管理者の設定方法

`src/routes/api.ts` の以下の配列にメールアドレスを追加:

```typescript
const ADMIN_EMAILS = [
  'admin@ratio-lab.com',
  'info@ratio-lab.com',
  // 新しい管理者のメールアドレスを追加
];
```

### 管理者ページへのアクセス

1. **URL直接**: `https://your-domain.com/admin`
2. **設定画面**: ログイン後、設定 → 「管理者ダッシュボード」リンク

---

## 🚀 デプロイ手順

### 初回デプロイ

```bash
# 1. Cloudflare認証
npx wrangler login

# 2. 本番D1データベース作成
npx wrangler d1 create mymuse-db-production

# 3. wrangler.jsonc の database_id を更新
# 出力されたIDを "local-dev-db" と置き換え

# 4. マイグレーション適用
npx wrangler d1 migrations apply mymuse-db-production

# 5. ビルド＆デプロイ
npm run deploy:prod
```

### 更新デプロイ

```bash
# 通常の更新
npm run deploy:prod

# マイグレーションがある場合
npx wrangler d1 migrations apply mymuse-db-production
npm run deploy:prod
```

---

## ⚠️ 危険なコマンド

| コマンド | 説明 | 危険度 |
|----------|------|--------|
| `npm run db:reset:local` | ローカルDBを完全リセット | 🔴 高 |
| `wrangler d1 delete` | D1データベースを削除 | 🔴 高 |

**注意**: `db:reset:local` は5秒間のカウントダウン後に実行されます。Ctrl+Cでキャンセル可能。

---

## 📊 監視項目

管理者ダッシュボードで確認できる項目:

| 項目 | 説明 |
|------|------|
| 今月の売上 | KOMOJU決済の合計 |
| 総ユーザー数 | 登録ユーザー数 |
| プレミアムユーザー | 有料プラン購入者 |
| 総作品数 | 作成されたプロジェクト数 |
| AI利用量 | 消費されたクレジット |
| 決済履歴 | 最近50件の決済 |

---

## 🔧 トラブルシューティング

### データが消えた場合

1. **Cloudflareダッシュボード**からD1バックアップを復元
2. または管理者ページの**エクスポートデータ**から手動復元

### 管理者ページにアクセスできない

1. `ADMIN_EMAILS`にメールアドレスが含まれているか確認
2. ログインしているか確認
3. セッションが有効か確認

### 決済が失敗する

1. KOMOJU管理画面でAPIキーを確認
2. `.dev.vars`に`KOMOJU_SECRET_KEY`が設定されているか確認
3. PM2ログを確認: `pm2 logs --nostream`

---

## 📞 サポート連絡先

- **技術的な問題**: 開発者へエスカレーション
- **決済・アカウント**: info@ratio-lab.com

最終更新: 2026-02-27
