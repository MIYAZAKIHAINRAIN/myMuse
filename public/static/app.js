// myMuse - Next Generation Writer Support Platform
// Main Application JavaScript

// ============================================
// State Management
// ============================================
const state = {
  user: null,
  sessionId: localStorage.getItem('sessionId'),
  currentProject: null,
  projects: [],
  folders: [],
  libraries: [], // ライブラリ（親プロジェクト）一覧
  expandedLibraries: JSON.parse(localStorage.getItem('expandedLibraries') || '{}'), // 展開状態
  currentTab: 'writing',
  language: localStorage.getItem('language') || 'ja',
  theme: localStorage.getItem('theme') || 'light',
  zenMode: false,
  sidebarOpen: { left: true, right: false },
  rightSidebarCollapsed: true, // 右サイドバー折りたたみ状態
  showOutline: false,
  // Mobile UI states
  mobileImmersiveMode: false, // モバイル没入モード
  mobileKeyboardVisible: false, // キーボード表示状態
  mobileAccordionSections: {}, // アコーディオン展開状態
  calendarDate: new Date(),
  calendarEvents: [],
  chatThreads: [],
  currentThread: null,
  chatMessages: [],
  writings: [],
  currentWriting: null,
  plot: null,
  ideas: [],
  characters: [],
  worldSettings: [],
  generatedImages: [], // For illustration tab
  illustrationFiles: [], // Reference files for illustration
  selectedReferenceIdx: null, // Selected reference file index
  storyOutline: null, // Story outline for ideas tab
  ideasDocument: '', // Document content for ideas tab
  ideasChatMessages: [], // Chat messages for ideas AI
  showStoryOutline: true, // Show/hide story outline panel
  showQuickIdeas: false, // Show/hide quick ideas panel
  showIdeasOutline: false, // Show/hide ideas document outline
  analysisChatMessages: [], // Chat messages for analysis AI
  analysisPersona: 'neutral', // Current analysis persona
  analysisChartsOpen: true, // Show/hide analysis charts
  settingsChatMessages: [], // Chat messages for settings AI assistant
  expandedPanel: null, // Currently expanded panel
  lastAnalysisResult: null, // Last analysis result for chart re-rendering
  adoptedIdeasText: '', // Word processor text for adopted ideas
  showAdoptedIdeasPreview: false, // Show/hide adopted ideas preview
  verticalTextMode: localStorage.getItem('verticalTextMode') || 'mixed', // 'mixed' (英語横倒し) or 'upright' (英語正立)
  searchResults: [],
  trash: [],
  isLoading: false,
  aiGenerating: false,
  authMode: 'login', // 'login' or 'signup'
  // Achievement System
  achievements: [],
  monthlyAchievements: [],
  currentMonthProgress: null,
  // Settings Section
  currentSettingsSection: 'genre', // 設定タブの現在選択中のセクション
};

// ============================================
// Translations - 12 Languages Support
// ============================================
const i18n = {
  ja: {
    'app.title': 'myMuse', 'app.tagline': '創作の未来をともに描くパートナー',
    'nav.home': 'ホーム', 'nav.write': '執筆', 'nav.manage': '管理', 'nav.settings': '設定',
    'sidebar.projects': 'プロジェクト', 'sidebar.newProject': '新規プロジェクト', 'sidebar.newFolder': '新規フォルダ',
    'sidebar.trash': 'ゴミ箱', 'sidebar.search': '全文検索', 'sidebar.calendar': '創作カレンダー',
    'sidebar.language': '言語', 'sidebar.aiCredits': 'AI利用量',
    'tab.ideas': 'ネタ考案', 'tab.plot': 'プロット', 'tab.writing': '執筆',
    'tab.settings_materials': '資料集',
    'tab.conception': '構想', 'tab.analysis_chat': '分析・相談',
    'tab.illustration': '挿絵', 'tab.analysis': '分析・批評', 'tab.consultation': '相談AI', 'tab.achievements': '実績',
    'achievement.title': '実績トロフィー', 'achievement.monthly': '今月の実績', 'achievement.all': '獲得バッジ',
    'achievement.progress': '進捗', 'achievement.unlocked': '解除済み', 'achievement.locked': '未解除',
    'achievement.generateNew': 'AIで実績を更新', 'achievement.lastUpdate': '最終更新',
    'achievement.platinum': 'プラチナ', 'achievement.gold': 'ゴールド', 'achievement.silver': 'シルバー',
    'achievement.bronze': 'ブロンズ', 'achievement.encouragement': '頑張ってね',
    'ai.continue': '続きを書く', 'ai.rewrite': '書き直す', 'ai.expand': '拡張', 'ai.proofread': '校正',
    'ai.summarize': '要約', 'ai.translate': '翻訳', 'ai.titleSuggestion': 'タイトル案',
    'ai.formal': '敬語', 'ai.casual': 'カジュアル', 'ai.literary': '文学的',
    'ai.customPrompt': 'カスタム指示', 'ai.targetWords': '目標文字数', 'ai.generate': '生成',
    'writing.zenMode': 'ZENモード', 'writing.vertical': '縦書き', 'writing.horizontal': '横書き',
    'writing.switchToVertical': '縦書きに切替', 'writing.switchToHorizontal': '横書きに切替',
    'writing.textUpright': '正立', 'writing.textSideways': '横倒し', 'writing.textModeTitle': '英数字の表示方法を切り替え',
    'writing.export': 'エクスポート', 'writing.readAloud': '音声読み上げ', 'writing.characters': '文字数',
    'analysis.emotionCurve': '感情曲線', 'analysis.radar': '作品成分チャート', 'analysis.reviews': 'ペルソナ評価',
    'analysis.analyze': '作品を分析する', 'analysis.noContent': '分析するコンテンツがありません',
    'calendar.memo': 'メモ', 'calendar.deadline': '締め切り', 'calendar.daysLeft': '残り日数',
    'settings.profile': 'プロフィール', 'settings.theme': 'テーマ', 'settings.lightMode': 'ライトモード',
    'settings.darkMode': 'ダークモード', 'settings.plan': 'プラン管理', 'settings.betaNote': 'ベータ版につき全機能無料',
    'settings.logout': 'ログアウト', 'settings.deleteAccount': 'アカウント削除',
    'settings.account': 'アカウント管理', 'settings.changePassword': 'パスワード変更',
    'settings.currentPassword': '現在のパスワード', 'settings.newPassword': '新しいパスワード',
    'settings.confirmNewPassword': '新しいパスワード（確認）', 'settings.termsPrivacy': '利用規約・プライバシー',
    'settings.deleteWarning': '注意：この操作は取り消せません',
    'settings.deleteWarningDetail': 'アカウントを削除すると、すべてのプロジェクト、執筆データ、設定が完全に削除されます。',
    'settings.confirmEmail': 'メールアドレスを入力して確認',
    'settings.confirmEmailHint': '確認のため、登録メールアドレスを入力してください',
    'settings.deleteAccountConfirm': '削除する', 'settings.passwordChanged': 'パスワードを変更しました',
    'settings.passwordMismatch': 'パスワードが一致しません', 'settings.accountDeleted': 'アカウントを削除しました',
    'legal.terms': '利用規約', 'legal.privacy': 'プライバシーポリシー', 'legal.lastUpdated': '最終更新日',
    'legal.termsTitle': 'myMuse 利用規約', 'legal.termsAcceptance': '規約への同意',
    'legal.termsAcceptanceText': '本サービスを利用することにより、本利用規約に同意したものとみなされます。',
    'legal.termsService': 'サービスの内容',
    'legal.termsServiceText': 'myMuseは創作活動を支援するためのAIアシスタントサービスです。執筆補助、プロット構成、キャラクター設定などの機能を提供します。',
    'legal.termsUserContent': 'ユーザーコンテンツ',
    'legal.termsUserContentText': 'ユーザーが作成したすべてのコンテンツ（小説、設定、キャラクターなど）の著作権はユーザーに帰属します。当社はユーザーコンテンツを第三者に提供・販売することはありません。',
    'legal.termsAI': 'AI機能について',
    'legal.termsAIText': 'AI機能はGoogle Gemini及びxAI Grokを使用しています。AI生成コンテンツはあくまで参考としてご利用ください。生成されたコンテンツの使用はユーザーの責任において行ってください。',
    'legal.termsProhibited': '禁止事項',
    'legal.termsProhibitedText': '違法なコンテンツの作成、他者の権利を侵害する行為、サービスの不正利用は禁止されています。',
    'legal.termsTermination': 'サービスの終了',
    'legal.termsTerminationText': 'ユーザーはいつでもアカウントを削除してサービスを終了できます。当社は事前通知の上、サービスを終了する権利を有します。',
    'legal.privacyTitle': 'myMuse プライバシーポリシー',
    'legal.privacyCollect': '収集する情報',
    'legal.privacyCollectText': 'メールアドレス、ユーザー名、作成したコンテンツ（プロジェクト、設定など）、利用状況データを収集します。',
    'legal.privacyUse': '情報の利用目的',
    'legal.privacyUseText': 'サービスの提供・改善、ユーザーサポート、サービスに関する通知のために情報を利用します。',
    'legal.privacyAI': 'AI処理について',
    'legal.privacyAIText': 'AI機能を利用する際、入力されたテキストはAIプロバイダー（Google、xAI）に送信されます。これらのプロバイダーはユーザーデータをモデルの学習に使用しない設定で運用しています。',
    'legal.privacyShare': '第三者への提供',
    'legal.privacyShareText': '法的要請がある場合を除き、ユーザーの個人情報を第三者に提供・販売することはありません。',
    'legal.privacySecurity': 'セキュリティ',
    'legal.privacySecurityText': 'データは暗号化して保存され、不正アクセスから保護されています。ただし、インターネット上での完全なセキュリティを保証することはできません。',
    'legal.privacyRights': 'ユーザーの権利',
    'legal.privacyRightsText': 'ユーザーはいつでも自分のデータにアクセス、修正、削除する権利を有します。アカウント設定からこれらの操作を行えます。',
    'legal.privacyContact': 'お問い合わせ',
    'legal.privacyContactText': 'プライバシーに関するお問い合わせは、アプリ内のフィードバック機能よりご連絡ください。',
    'auth.login': 'ログイン', 'auth.signup': '新規登録', 'auth.email': 'メールアドレス',
    'auth.password': 'パスワード', 'auth.passwordConfirm': 'パスワード（確認）', 'auth.name': '名前',
    'common.save': '保存', 'common.cancel': 'キャンセル', 'common.delete': '削除',
    'common.restore': '復元', 'common.adopt': '採用', 'common.loading': '読み込み中...', 'common.error': 'エラーが発生しました',
    'common.generate': '生成', 'common.close': '閉じる', 'common.apply': '適用する',
    'plot.kishotenketsu': '起承転結', 'plot.threeAct': '三幕構成', 'plot.blakeSnyder': 'ブレイク・スナイダー', 'plot.herosJourney': '英雄の旅',
    'plot.ki': '起', 'plot.sho': '承', 'plot.ten': '転', 'plot.ketsu': '結',
    'plot.act1': '第一幕', 'plot.act2': '第二幕', 'plot.act3': '第三幕',
    'genre.literary': '純文学', 'genre.contemporary': '現代文学', 'genre.fantasy': 'ファンタジー',
    'genre.scifi': 'SF', 'genre.mystery': 'ミステリー', 'genre.suspense': 'サスペンス',
    'genre.horror': 'ホラー', 'genre.romance': '恋愛小説', 'genre.historical': '歴史小説',
    'genre.adventure': '冒険・アクション', 'genre.lightnovel': 'ライトノベル', 'genre.children': '児童文学',
    'genre.essay': 'エッセイ', 'genre.critique': '評論・批評', 'genre.business': 'ビジネス書',
    'genre.selfhelp': '自己啓発書', 'genre.philosophy': '哲学書', 'genre.sociology': '社会学・文化論',
    'genre.historyNF': '歴史書', 'genre.science': '科学解説書', 'genre.journalism': 'ジャーナリズム',
    'genre.biography': '伝記・自伝',
    'genre.litrpg': 'LitRPG', 'genre.progression': 'Progression Fantasy', 'genre.cozyMystery': 'コージーミステリー',
    'genre.urbanFantasy': 'アーバンファンタジー', 'genre.xianxia': '仙侠', 'genre.wuxia': '武侠',
    'genre.isekai': '異世界', 'genre.gamelit': 'GameLit', 'genre.cultivation': '修真',
    'idea.generate': 'アイデアを生成', 'idea.count': '生成数', 'idea.keywords': 'キーワード', 'idea.genre': 'ジャンル',
    'chat.placeholder': '相談したいことを入力...', 'chat.empty': 'AIに相談してみましょう', 'chat.hint': 'プロット、キャラクター、文章の悩みなど何でも相談できます',
    // UI messages
    'ui.saving': '保存中...', 'ui.saved': '保存済み', 'ui.unsaved': '未保存', 'ui.saveFailed': '保存に失敗しました',
    'ui.createSeries': 'シリーズを作成', 'ui.addEpisode': '新しい話を追加', 'ui.parentProject': '親プロジェクト',
    'ui.saveSettings': '設定を保存', 'ui.saveSeriesSettings': 'シリーズ設定を保存', 'ui.autoSync': '保存時に各話へ自動反映',
    'ui.projectRef': 'プロジェクト参照', 'ui.genSettings': '生成設定', 'ui.generateIllustration': '挿絵を生成',
    'ui.generatedIllustrations': '生成された挿絵', 'ui.comingSoon': '近日公開予定',
    'ui.illustrationDevNote': 'AI画像生成機能は現在開発中です。近日公開予定！',
    'ui.quickIdeas': 'クイックアイデア生成', 'ui.generateIdeas': 'AIでアイデアを生成してみましょう',
    'ui.adoptIdea': 'このメモを「採用したアイディア」に追加', 'ui.noPlot': 'まだプロット構成が作成されていません',
    'ui.createPlotHint': '「ネタ考案」タブで構成を作成してください', 'ui.noAdoptedIdeas': '「ネタ考案」タブでアイディアを生成・採用してください',
    'ui.cancelAI': 'AI生成をキャンセルしますか？', 'ui.aiCancelled': 'AI生成をキャンセルしました',
    'ui.guestLogin': 'ゲストとしてログインしました！', 'ui.welcomeMsg': 'myMuseへようこそ！',
    'ui.illustrationHint': 'ネタ考案タブのアウトラインと執筆内容を基に、一貫性のある挿絵を生成します',
    'ui.saveEpisodeSettings': 'この話の設定を保存', 'ui.settingsSaved': '設定を保存しました',
    'ui.seriesSettingsSaved': '共通設定を保存しました', 'ui.seriesSettingsSyncedTo': '共通設定を保存し、{count}話に反映しました',
    'ui.adoptedIdeas': '採用したアイディア', 'ui.viewOnly': '参照のみ', 'ui.editInIdeasTab': 'ネタ考案タブで編集',
    'ui.settingsAI': '設定AIアシスタント', 'ui.settingsAIHint': '設定作りの相談ができます',
    'ui.settingsAIPlaceholder': 'キャラ設定や世界観について相談...',
    // Series and project settings
    'ui.parentMaterials': '親資料', 'ui.childMaterials': '子資料',
    'ui.series': 'シリーズ', 'ui.seriesSharedSettings': 'シリーズ共通設定',
    'ui.seriesGenre': 'シリーズのジャンル', 'ui.seriesDescription': 'シリーズの説明',
    'ui.seriesEpisodes': 'このシリーズの話', 'ui.noEpisodes': 'まだ話がありません',
    'ui.episodesSharedSettings': '話のシリーズ共通設定',
    'ui.sharedCharacters': '共通キャラクター設定', 'ui.sharedTerminology': '共通専門用語',
    'ui.sharedWorldSetting': '共通世界観設定', 'ui.seriesShared': 'シリーズ共通',
    'ui.removeFromSeries': 'シリーズから外す', 'ui.createSeriesTitle': 'シリーズ（ライブラリ）を作成',
    'ui.viewSeriesSettings': 'シリーズ共通設定を参照', 'ui.editSeriesSettings': 'シリーズ設定を編集',
    // Episode specific
    'ui.episodeGoal': 'この話の目標', 'ui.episodeGoalHint': 'この話で達成したいこと、見せ場など',
    'ui.episodeGoalPlaceholder': 'この話のクライマックス、伏線、読者に伝えたいこと...',
    'ui.episodeCharacters': 'この話の登場人物', 'ui.episodeCharactersHint': 'この話で新登場するキャラクターや、話固有の設定',
    'ui.episodeCharactersPlaceholder': '【この話で初登場】\n・〇〇: 役割、特徴\n\n【この話での変化】\n...',
    'ui.episodeTerminology': 'この話の専門用語', 'ui.episodeTerminologyPlaceholder': 'この話で新たに登場する用語、概念...',
    'ui.episodeSetting': 'この話の舞台', 'ui.episodeSettingHint': 'この話の具体的な場所、シーン設定',
    'ui.episodeStructure': 'この話の構成', 'ui.episodeOutline': '各話アウトライン',
    // Writing
    'ui.standardText': '標準テキスト', 'ui.outline': 'アウトライン', 'ui.showOutline': 'アウトライン表示',
    // AI assistant
    'ui.aiPartner': 'AIパートナー', 'ui.quickActions': 'クイックアクション',
    'ui.enterCustomPrompt': 'カスタム指示を入力', 'ui.aiResponseHistory': 'AIレスポンス履歴',
    'ui.historyEmptyHint': 'アクションを実行するとここに履歴が表示されます',
    // Settings
    'ui.genreSettings': 'ジャンル', 'ui.charSettings': 'キャラ設定',
    'ui.terminologySettings': '専門用語', 'ui.worldSettings': '世界観設定',
    'ui.storyGoal': '描きたい物語', 'ui.plotStructure': 'プロット構成', 'ui.expand': '拡大',
    'ui.autoSyncHint': 'チェックすると、共通設定が全ての話に反映されます',
    'ui.inheritedFromSeries': 'シリーズから継承', 'ui.notSet': '未設定', 'ui.readOnly': '読み取り専用',
    'ui.selectMultiple': '複数選択可', 'ui.partOfSeries': 'シリーズの一部',
    // Text styles and editing
    'ui.title': 'タイトル', 'ui.heading1': '見出し 1', 'ui.heading2': '見出し 2', 'ui.heading3': '見出し 3',
    'ui.editSettings': '設定を編集', 'ui.characters': '文字',
    'ui.pleaseEnterCustomPrompt': 'カスタム指示を入力してください',
    // Modals
    'ui.createNewSeries': '新しいシリーズ（ライブラリ）を作成',
    'ui.seriesCreateHint': 'シリーズを作成すると、複数の話（プロジェクト）を1つにまとめ、キャラクター設定や世界観を共有できます。',
    'ui.seriesName': 'シリーズ名', 'ui.seriesDescOptional': 'シリーズの説明（任意）',
    'ui.rename': '名前を変更', 'ui.createFirstEpisode': '最初の話を作成',
  },
  en: {
    'app.title': 'myMuse', 'app.tagline': 'Your all-knowing writing companion',
    'nav.home': 'Home', 'nav.write': 'Write', 'nav.manage': 'Manage', 'nav.settings': 'Settings',
    'sidebar.projects': 'Projects', 'sidebar.newProject': 'New Project', 'sidebar.newFolder': 'New Folder',
    'sidebar.trash': 'Trash', 'sidebar.search': 'Search', 'sidebar.calendar': 'Calendar',
    'sidebar.language': 'Language', 'sidebar.aiCredits': 'AI Credits',
    'tab.ideas': 'Ideas', 'tab.plot': 'Plot', 'tab.writing': 'Writing',
    'tab.settings_materials': 'Materials',
    'tab.conception': 'Conception', 'tab.analysis_chat': 'Analysis & Chat',
    'tab.illustration': 'Illustration', 'tab.analysis': 'Analysis', 'tab.consultation': 'AI Chat', 'tab.achievements': 'Achievements',
    'achievement.title': 'Achievements', 'achievement.monthly': 'Monthly Goals', 'achievement.all': 'Badges',
    'achievement.progress': 'Progress', 'achievement.unlocked': 'Unlocked', 'achievement.locked': 'Locked',
    'achievement.generateNew': 'Update with AI', 'achievement.lastUpdate': 'Last Update',
    'achievement.platinum': 'Platinum', 'achievement.gold': 'Gold', 'achievement.silver': 'Silver',
    'achievement.bronze': 'Bronze', 'achievement.encouragement': 'Keep Going',
    'ai.continue': 'Continue', 'ai.rewrite': 'Rewrite', 'ai.expand': 'Expand', 'ai.proofread': 'Proofread',
    'ai.summarize': 'Summarize', 'ai.translate': 'Translate', 'ai.titleSuggestion': 'Title Ideas',
    'ai.formal': 'Formal', 'ai.casual': 'Casual', 'ai.literary': 'Literary',
    'ai.customPrompt': 'Custom Prompt', 'ai.targetWords': 'Target Words', 'ai.generate': 'Generate',
    'writing.zenMode': 'ZEN Mode', 'writing.vertical': 'Vertical', 'writing.horizontal': 'Horizontal',
    'writing.switchToVertical': 'Switch to Vertical', 'writing.switchToHorizontal': 'Switch to Horizontal',
    'writing.textUpright': '|||', 'writing.textSideways': '≡', 'writing.textModeTitle': 'Toggle text orientation',
    'writing.export': 'Export', 'writing.readAloud': 'Read Aloud', 'writing.characters': 'Characters',
    'analysis.emotionCurve': 'Emotion Curve', 'analysis.radar': 'Genre Chart', 'analysis.reviews': 'Reviews',
    'analysis.analyze': 'Analyze Work', 'analysis.noContent': 'No content to analyze',
    'calendar.memo': 'Memo', 'calendar.deadline': 'Deadline', 'calendar.daysLeft': 'Days Left',
    'settings.profile': 'Profile', 'settings.theme': 'Theme', 'settings.lightMode': 'Light Mode',
    'settings.darkMode': 'Dark Mode', 'settings.plan': 'Plan', 'settings.betaNote': 'All features free during beta',
    'settings.logout': 'Logout', 'settings.deleteAccount': 'Delete Account',
    'settings.account': 'Account', 'settings.changePassword': 'Change Password',
    'settings.currentPassword': 'Current Password', 'settings.newPassword': 'New Password',
    'settings.confirmNewPassword': 'Confirm New Password', 'settings.termsPrivacy': 'Terms & Privacy',
    'settings.deleteWarning': 'Warning: This action cannot be undone',
    'settings.deleteWarningDetail': 'Deleting your account will permanently remove all projects, writing data, and settings.',
    'settings.confirmEmail': 'Enter email to confirm',
    'settings.confirmEmailHint': 'Enter your registered email address to confirm',
    'settings.deleteAccountConfirm': 'Delete', 'settings.passwordChanged': 'Password changed successfully',
    'settings.passwordMismatch': 'Passwords do not match', 'settings.accountDeleted': 'Account deleted successfully',
    'legal.terms': 'Terms of Service', 'legal.privacy': 'Privacy Policy', 'legal.lastUpdated': 'Last updated',
    'legal.termsTitle': 'myMuse Terms of Service', 'legal.termsAcceptance': 'Acceptance of Terms',
    'legal.termsAcceptanceText': 'By using this service, you agree to these terms of service.',
    'legal.termsService': 'Service Description',
    'legal.termsServiceText': 'myMuse is an AI assistant service for creative writing. It provides features for writing assistance, plot construction, and character development.',
    'legal.termsUserContent': 'User Content',
    'legal.termsUserContentText': 'All content created by users (novels, settings, characters, etc.) remains the property of the user. We do not share or sell user content to third parties.',
    'legal.termsAI': 'AI Features',
    'legal.termsAIText': 'AI features use Google Gemini and xAI Grok. AI-generated content should be used as reference only. Users are responsible for their use of generated content.',
    'legal.termsProhibited': 'Prohibited Activities',
    'legal.termsProhibitedText': 'Creating illegal content, infringing on others rights, and misusing the service are prohibited.',
    'legal.termsTermination': 'Termination',
    'legal.termsTerminationText': 'Users may delete their account at any time. We reserve the right to terminate the service with prior notice.',
    'legal.privacyTitle': 'myMuse Privacy Policy',
    'legal.privacyCollect': 'Information We Collect',
    'legal.privacyCollectText': 'We collect email addresses, usernames, created content (projects, settings, etc.), and usage data.',
    'legal.privacyUse': 'How We Use Information',
    'legal.privacyUseText': 'We use information to provide and improve the service, user support, and service notifications.',
    'legal.privacyAI': 'AI Processing',
    'legal.privacyAIText': 'When using AI features, input text is sent to AI providers (Google, xAI). These providers are configured not to use user data for model training.',
    'legal.privacyShare': 'Third Party Sharing',
    'legal.privacyShareText': 'We do not share or sell personal information to third parties except when required by law.',
    'legal.privacySecurity': 'Security',
    'legal.privacySecurityText': 'Data is encrypted and protected against unauthorized access. However, complete security on the internet cannot be guaranteed.',
    'legal.privacyRights': 'Your Rights',
    'legal.privacyRightsText': 'Users have the right to access, modify, and delete their data at any time through account settings.',
    'legal.privacyContact': 'Contact',
    'legal.privacyContactText': 'For privacy inquiries, please use the feedback feature in the app.',
    'auth.login': 'Login', 'auth.signup': 'Sign Up', 'auth.email': 'Email',
    'auth.password': 'Password', 'auth.passwordConfirm': 'Confirm Password', 'auth.name': 'Name',
    'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
    'common.restore': 'Restore', 'common.adopt': 'Adopt', 'common.loading': 'Loading...', 'common.error': 'An error occurred',
    'common.generate': 'Generate', 'common.close': 'Close', 'common.apply': 'Apply',
    'plot.kishotenketsu': 'Ki-Sho-Ten-Ketsu', 'plot.threeAct': 'Three Act', 'plot.blakeSnyder': 'Save the Cat!', 'plot.herosJourney': "Hero's Journey",
    'plot.ki': 'Setup', 'plot.sho': 'Development', 'plot.ten': 'Twist', 'plot.ketsu': 'Conclusion',
    'plot.act1': 'Act 1', 'plot.act2': 'Act 2', 'plot.act3': 'Act 3',
    'genre.literary': 'Literary Fiction', 'genre.contemporary': 'Contemporary', 'genre.fantasy': 'Fantasy',
    'genre.scifi': 'Sci-Fi', 'genre.mystery': 'Mystery', 'genre.suspense': 'Thriller',
    'genre.horror': 'Horror', 'genre.romance': 'Romance', 'genre.historical': 'Historical',
    'genre.adventure': 'Adventure/Action', 'genre.lightnovel': 'Light Novel', 'genre.children': "Children's",
    'genre.essay': 'Essay', 'genre.critique': 'Critique', 'genre.business': 'Business',
    'genre.selfhelp': 'Self-Help', 'genre.philosophy': 'Philosophy', 'genre.sociology': 'Sociology',
    'genre.historyNF': 'History (NF)', 'genre.science': 'Science', 'genre.journalism': 'Journalism',
    'genre.biography': 'Biography/Memoir',
    'genre.litrpg': 'LitRPG', 'genre.progression': 'Progression Fantasy', 'genre.cozyMystery': 'Cozy Mystery',
    'genre.urbanFantasy': 'Urban Fantasy', 'genre.xianxia': 'Xianxia', 'genre.wuxia': 'Wuxia',
    'genre.isekai': 'Isekai', 'genre.gamelit': 'GameLit', 'genre.cultivation': 'Cultivation',
    'genre.biography': 'Biography',
    'idea.generate': 'Generate Ideas', 'idea.count': 'Count', 'idea.keywords': 'Keywords', 'idea.genre': 'Genre',
    'chat.placeholder': 'Ask your writing assistant...', 'chat.empty': 'Chat with AI', 'chat.hint': 'Ask about plot, characters, writing style, and more',
    // UI messages
    'ui.saving': 'Saving...', 'ui.saved': 'Saved', 'ui.unsaved': 'Unsaved', 'ui.saveFailed': 'Failed to save',
    'ui.createSeries': 'Create Series', 'ui.addEpisode': 'Add Episode', 'ui.parentProject': 'Parent Project',
    'ui.saveSettings': 'Save Settings', 'ui.saveSeriesSettings': 'Save Series Settings', 'ui.autoSync': 'Auto-sync to all episodes on save',
    'ui.projectRef': 'Project Reference', 'ui.genSettings': 'Generation Settings', 'ui.generateIllustration': 'Generate Illustration',
    'ui.generatedIllustrations': 'Generated Illustrations', 'ui.comingSoon': 'Coming Soon',
    'ui.illustrationDevNote': 'AI image generation is currently under development. Coming soon!',
    'ui.quickIdeas': 'Quick Idea Generation', 'ui.generateIdeas': 'Generate ideas with AI',
    'ui.adoptIdea': 'Add this to adopted ideas', 'ui.noPlot': 'No plot structure yet',
    'ui.createPlotHint': 'Create a plot structure in the Ideas tab', 'ui.noAdoptedIdeas': 'Generate and adopt ideas in the Ideas tab',
    'ui.cancelAI': 'Cancel AI generation?', 'ui.aiCancelled': 'AI generation cancelled',
    'ui.guestLogin': 'Logged in as guest!', 'ui.welcomeMsg': 'Welcome to myMuse!',
    'ui.illustrationHint': 'Generate consistent illustrations based on outline and content',
    'ui.saveEpisodeSettings': 'Save Episode Settings', 'ui.settingsSaved': 'Settings saved',
    'ui.seriesSettingsSaved': 'Series settings saved', 'ui.seriesSettingsSyncedTo': 'Series settings saved and synced to {count} episodes',
    'ui.adoptedIdeas': 'Adopted Ideas', 'ui.viewOnly': 'View Only', 'ui.editInIdeasTab': 'Edit in Ideas Tab',
    'ui.settingsAI': 'Settings AI Assistant', 'ui.settingsAIHint': 'Get help with your settings',
    'ui.settingsAIPlaceholder': 'Ask about characters, world-building...',
    // Series and project settings
    'ui.parentMaterials': 'Parent Materials', 'ui.childMaterials': 'Child Materials',
    'ui.series': 'Series', 'ui.seriesSharedSettings': 'Series Shared Settings',
    'ui.seriesGenre': 'Series Genre', 'ui.seriesDescription': 'Series Description',
    'ui.seriesEpisodes': 'Episodes in this Series', 'ui.noEpisodes': 'No episodes yet',
    'ui.episodesSharedSettings': 'Series Shared Settings',
    'ui.sharedCharacters': 'Shared Character Settings', 'ui.sharedTerminology': 'Shared Terminology',
    'ui.sharedWorldSetting': 'Shared World Setting', 'ui.seriesShared': 'Series Shared',
    'ui.removeFromSeries': 'Remove from Series', 'ui.createSeriesTitle': 'Create Series (Library)',
    'ui.viewSeriesSettings': 'View Series Settings', 'ui.editSeriesSettings': 'Edit Series Settings',
    // Episode specific
    'ui.episodeGoal': 'Episode Goal', 'ui.episodeGoalHint': 'What you want to achieve in this episode',
    'ui.episodeGoalPlaceholder': 'Climax, foreshadowing, message to readers...',
    'ui.episodeCharacters': 'Episode Characters', 'ui.episodeCharactersHint': 'New characters or episode-specific settings',
    'ui.episodeCharactersPlaceholder': '【New in this episode】\n- Character: Role, traits\n\n【Changes】\n...',
    'ui.episodeTerminology': 'Episode Terminology', 'ui.episodeTerminologyPlaceholder': 'New terms appearing in this episode...',
    'ui.episodeSetting': 'Episode Setting', 'ui.episodeSettingHint': 'Specific locations and scenes',
    'ui.episodeStructure': 'Episode Structure', 'ui.episodeOutline': 'Episode Outline',
    // Writing
    'ui.standardText': 'Standard Text', 'ui.outline': 'Outline', 'ui.showOutline': 'Show Outline',
    // AI assistant
    'ui.aiPartner': 'AI Partner', 'ui.quickActions': 'Quick Actions',
    'ui.enterCustomPrompt': 'Enter custom prompt', 'ui.aiResponseHistory': 'AI Response History',
    'ui.historyEmptyHint': 'History will appear here after actions',
    // Settings
    'ui.genreSettings': 'Genre', 'ui.charSettings': 'Character Settings',
    'ui.terminologySettings': 'Terminology', 'ui.worldSettings': 'World Setting',
    'ui.storyGoal': 'Story Goal', 'ui.plotStructure': 'Plot Structure', 'ui.expand': 'Expand',
    'ui.autoSyncHint': 'When checked, shared settings will be applied to all episodes',
    'ui.inheritedFromSeries': 'Inherited from Series', 'ui.notSet': 'Not set', 'ui.readOnly': 'Read Only',
    'ui.selectMultiple': 'Multiple selection', 'ui.partOfSeries': 'Part of series',
    // Text styles and editing
    'ui.title': 'Title', 'ui.heading1': 'Heading 1', 'ui.heading2': 'Heading 2', 'ui.heading3': 'Heading 3',
    'ui.editSettings': 'Edit Settings', 'ui.characters': 'chars',
    'ui.pleaseEnterCustomPrompt': 'Please enter a custom prompt',
    // Modals
    'ui.createNewSeries': 'Create New Series (Library)',
    'ui.seriesCreateHint': 'Creating a series allows you to group multiple episodes together and share character settings and world-building.',
    'ui.seriesName': 'Series Name', 'ui.seriesDescOptional': 'Series Description (optional)',
    'ui.rename': 'Rename', 'ui.createFirstEpisode': 'Create First Episode',
  },
  zh: {
    'app.title': 'myMuse', 'app.tagline': '全知全能的写作伙伴',
    'nav.home': '首页', 'nav.write': '写作', 'nav.manage': '管理', 'nav.settings': '设置',
    'sidebar.projects': '项目', 'sidebar.newProject': '新建项目', 'sidebar.newFolder': '新建文件夹',
    'sidebar.trash': '回收站', 'sidebar.search': '搜索', 'sidebar.calendar': '日历',
    'sidebar.language': '语言', 'sidebar.aiCredits': 'AI额度',
    'tab.ideas': '创意', 'tab.plot': '情节', 'tab.writing': '写作', 'tab.illustration': '插图', 'tab.analysis': '分析', 'tab.consultation': 'AI咨询',
    'ai.continue': '续写', 'ai.rewrite': '重写', 'ai.expand': '扩展', 'ai.proofread': '校对',
    'ai.summarize': '总结', 'ai.translate': '翻译', 'ai.titleSuggestion': '标题建议',
    'ai.formal': '正式', 'ai.casual': '随意', 'ai.literary': '文学',
    'ai.customPrompt': '自定义指令', 'ai.targetWords': '目标字数', 'ai.generate': '生成',
    'writing.zenMode': 'ZEN模式', 'writing.vertical': '竖排', 'writing.horizontal': '横排',
    'writing.switchToVertical': '切换为竖排', 'writing.switchToHorizontal': '切换为横排',
    'writing.textUpright': '|||', 'writing.textSideways': '≡', 'writing.textModeTitle': '切换文字方向',
    'writing.export': '导出', 'writing.readAloud': '朗读', 'writing.characters': '字数',
    'analysis.emotionCurve': '情感曲线', 'analysis.radar': '类型图', 'analysis.reviews': '评价',
    'analysis.analyze': '分析作品', 'analysis.noContent': '没有可分析的内容',
    'settings.profile': '个人资料', 'settings.theme': '主题', 'settings.lightMode': '浅色模式',
    'settings.darkMode': '深色模式', 'settings.logout': '登出', 'settings.betaNote': '测试期间所有功能免费',
    'settings.account': '账户管理', 'settings.changePassword': '修改密码', 'settings.deleteAccount': '删除账户',
    'settings.currentPassword': '当前密码', 'settings.newPassword': '新密码', 'settings.confirmNewPassword': '确认新密码',
    'settings.termsPrivacy': '条款与隐私', 'settings.deleteWarning': '警告：此操作无法撤销',
    'settings.deleteWarningDetail': '删除账户将永久删除所有项目、写作数据和设置。',
    'settings.confirmEmail': '输入邮箱确认', 'settings.confirmEmailHint': '请输入您的注册邮箱以确认',
    'settings.deleteAccountConfirm': '删除', 'settings.passwordChanged': '密码已更改',
    'settings.passwordMismatch': '密码不匹配', 'settings.accountDeleted': '账户已删除',
    'legal.terms': '服务条款', 'legal.privacy': '隐私政策', 'legal.lastUpdated': '最后更新',
    'legal.termsTitle': 'myMuse 服务条款', 'legal.privacyTitle': 'myMuse 隐私政策',
    'legal.termsAcceptance': '条款接受', 'legal.termsAcceptanceText': '使用本服务即表示您同意这些服务条款。',
    'legal.termsService': '服务说明', 'legal.termsServiceText': 'myMuse是一款AI创作助手服务，提供写作辅助、情节构建和角色开发等功能。',
    'legal.termsUserContent': '用户内容', 'legal.termsUserContentText': '用户创建的所有内容（小说、设置、角色等）归用户所有。我们不会向第三方分享或出售用户内容。',
    'legal.termsAI': 'AI功能', 'legal.termsAIText': 'AI功能使用Google Gemini和xAI Grok。AI生成的内容仅供参考，用户对使用生成内容负责。',
    'legal.termsProhibited': '禁止行为', 'legal.termsProhibitedText': '禁止创建非法内容、侵犯他人权利和滥用服务。',
    'legal.termsTermination': '终止', 'legal.termsTerminationText': '用户可随时删除账户。我们保留提前通知后终止服务的权利。',
    'legal.privacyCollect': '收集的信息', 'legal.privacyCollectText': '我们收集邮箱地址、用户名、创建的内容和使用数据。',
    'legal.privacyUse': '信息使用', 'legal.privacyUseText': '我们使用信息来提供和改进服务、用户支持和服务通知。',
    'legal.privacyAI': 'AI处理', 'legal.privacyAIText': '使用AI功能时，输入文本会发送给AI提供商（Google、xAI）。这些提供商配置为不使用用户数据进行模型训练。',
    'legal.privacyShare': '第三方共享', 'legal.privacyShareText': '除法律要求外，我们不会向第三方分享或出售个人信息。',
    'legal.privacySecurity': '安全', 'legal.privacySecurityText': '数据经过加密并受到保护。但无法保证互联网上的完全安全。',
    'legal.privacyRights': '您的权利', 'legal.privacyRightsText': '用户有权随时通过账户设置访问、修改和删除其数据。',
    'legal.privacyContact': '联系方式', 'legal.privacyContactText': '如有隐私问题，请使用应用内的反馈功能。',
    'auth.login': '登录', 'auth.signup': '注册', 'auth.email': '邮箱', 'auth.password': '密码', 'auth.name': '姓名',
    'common.save': '保存', 'common.cancel': '取消', 'common.delete': '删除', 'common.restore': '恢复',
    'common.loading': '加载中...', 'common.error': '发生错误', 'common.generate': '生成', 'common.close': '关闭',
    'plot.kishotenketsu': '起承转合', 'plot.threeAct': '三幕结构', 'plot.blakeSnyder': '救猫咪', 'plot.herosJourney': '英雄之旅',
    'plot.ki': '起', 'plot.sho': '承', 'plot.ten': '转', 'plot.ketsu': '合',
    'plot.act1': '第一幕', 'plot.act2': '第二幕', 'plot.act3': '第三幕',
    'genre.fantasy': '奇幻', 'genre.scifi': '科幻', 'genre.mystery': '推理', 'genre.romance': '言情',
    'genre.xianxia': '仙侠', 'genre.wuxia': '武侠', 'genre.cultivation': '修真', 'genre.isekai': '异世界',
    'genre.litrpg': 'LitRPG', 'genre.progression': '成长流', 'genre.urbanFantasy': '都市奇幻',
    'chat.placeholder': '输入您的问题...', 'chat.empty': '与AI对话', 'chat.hint': '询问情节、人物、写作风格等',
    // UI messages
    'ui.saving': '保存中...', 'ui.saved': '已保存', 'ui.unsaved': '未保存', 'ui.saveFailed': '保存失败',
    'ui.createSeries': '创建系列', 'ui.addEpisode': '添加新篇', 'ui.parentProject': '父项目',
    'ui.saveSettings': '保存设置', 'ui.saveSeriesSettings': '保存系列设置', 'ui.autoSync': '保存时自动同步到所有篇章',
    'ui.projectRef': '项目参考', 'ui.genSettings': '生成设置', 'ui.generateIllustration': '生成插图',
    'ui.generatedIllustrations': '已生成的插图', 'ui.comingSoon': '即将推出',
    'ui.illustrationDevNote': 'AI图像生成功能正在开发中，敬请期待！',
    'ui.quickIdeas': '快速创意生成', 'ui.generateIdeas': '使用AI生成创意',
    'ui.adoptIdea': '添加到采用的创意', 'ui.noPlot': '尚未创建情节结构',
    'ui.createPlotHint': '在创意标签页中创建情节结构', 'ui.noAdoptedIdeas': '在创意标签页中生成并采用创意',
    'ui.cancelAI': '取消AI生成？', 'ui.aiCancelled': 'AI生成已取消',
    'ui.guestLogin': '已以访客身份登录！', 'ui.welcomeMsg': '欢迎来到myMuse！',
    'ui.illustrationHint': '基于大纲和内容生成一致的插图',
    'ui.saveEpisodeSettings': '保存本话设置', 'ui.settingsSaved': '设置已保存',
    'ui.seriesSettingsSaved': '系列设置已保存', 'ui.seriesSettingsSyncedTo': '系列设置已保存并同步到{count}话',
    'ui.adoptedIdeas': '已采用的创意', 'ui.viewOnly': '仅查看', 'ui.editInIdeasTab': '在创意标签页编辑',
    'ui.settingsAI': '设置AI助手', 'ui.settingsAIHint': '获取设置创作帮助',
    'ui.settingsAIPlaceholder': '询问角色设定或世界观...',
    // Series and project settings
    'ui.parentMaterials': '父资料', 'ui.childMaterials': '子资料',
    'ui.series': '系列', 'ui.seriesSharedSettings': '系列共享设置',
    'ui.seriesGenre': '系列类型', 'ui.seriesDescription': '系列简介',
    'ui.seriesEpisodes': '本系列章节', 'ui.noEpisodes': '暂无章节',
    'ui.episodesSharedSettings': '系列共享设置',
    'ui.sharedCharacters': '共享角色设定', 'ui.sharedTerminology': '共享术语',
    'ui.sharedWorldSetting': '共享世界观设定', 'ui.seriesShared': '系列共享',
    'ui.removeFromSeries': '从系列移除', 'ui.createSeriesTitle': '创建系列（图书馆）',
    'ui.viewSeriesSettings': '查看系列设置', 'ui.editSeriesSettings': '编辑系列设置',
    // Episode specific
    'ui.episodeGoal': '本章目标', 'ui.episodeGoalHint': '本章想要达成的目标、亮点等',
    'ui.episodeGoalPlaceholder': '本章高潮、伏笔、想传达给读者的...',
    'ui.episodeCharacters': '本章人物', 'ui.episodeCharactersHint': '新登场角色或本章特定设定',
    'ui.episodeCharactersPlaceholder': '【本章首次登场】\n・角色：角色、特点\n\n【本章变化】\n...',
    'ui.episodeTerminology': '本章术语', 'ui.episodeTerminologyPlaceholder': '本章新出现的术语、概念...',
    'ui.episodeSetting': '本章场景', 'ui.episodeSettingHint': '具体地点和场景设定',
    'ui.episodeStructure': '本章结构', 'ui.episodeOutline': '章节大纲',
    // Writing
    'ui.standardText': '标准文本', 'ui.outline': '大纲', 'ui.showOutline': '显示大纲',
    // AI assistant
    'ui.aiPartner': 'AI伙伴', 'ui.quickActions': '快捷操作',
    'ui.enterCustomPrompt': '输入自定义指令', 'ui.aiResponseHistory': 'AI响应历史',
    'ui.historyEmptyHint': '执行操作后历史将在此显示',
    // Settings
    'ui.genreSettings': '类型', 'ui.charSettings': '角色设定',
    'ui.terminologySettings': '术语', 'ui.worldSettings': '世界观设定',
    'ui.storyGoal': '故事目标', 'ui.plotStructure': '情节结构', 'ui.expand': '展开',
    'ui.autoSyncHint': '勾选后，共享设置将应用于所有章节',
    'ui.inheritedFromSeries': '从系列继承', 'ui.notSet': '未设置', 'ui.readOnly': '只读',
    'ui.selectMultiple': '可多选', 'ui.partOfSeries': '系列的一部分',
    // Text styles and editing
    'ui.title': '标题', 'ui.heading1': '一级标题', 'ui.heading2': '二级标题', 'ui.heading3': '三级标题',
    'ui.editSettings': '编辑设置', 'ui.characters': '字',
    'ui.pleaseEnterCustomPrompt': '请输入自定义提示',
    // Modals
    'ui.createNewSeries': '创建新系列（图书馆）',
    'ui.seriesCreateHint': '创建系列后，可以将多个章节组合在一起，共享角色设定和世界观。',
    'ui.seriesName': '系列名称', 'ui.seriesDescOptional': '系列简介（可选）',
    'ui.rename': '重命名', 'ui.createFirstEpisode': '创建第一章',
  },
  ko: {
    'app.title': 'myMuse', 'app.tagline': '모든 것을 아는 글쓰기 동반자',
    'nav.home': '홈', 'nav.write': '집필', 'nav.manage': '관리', 'nav.settings': '설정',
    'sidebar.projects': '프로젝트', 'sidebar.newProject': '새 프로젝트', 'sidebar.newFolder': '새 폴더',
    'sidebar.trash': '휴지통', 'sidebar.search': '검색', 'sidebar.calendar': '캘린더',
    'sidebar.language': '언어', 'sidebar.aiCredits': 'AI 크레딧',
    'tab.ideas': '아이디어', 'tab.plot': '플롯', 'tab.writing': '집필', 'tab.illustration': '삽화', 'tab.analysis': '분석', 'tab.consultation': 'AI 상담',
    'ai.continue': '계속 쓰기', 'ai.rewrite': '다시 쓰기', 'ai.expand': '확장', 'ai.proofread': '교정',
    'ai.summarize': '요약', 'ai.translate': '번역', 'ai.titleSuggestion': '제목 제안',
    'ai.formal': '격식체', 'ai.casual': '비격식체', 'ai.literary': '문학적',
    'ai.customPrompt': '사용자 정의', 'ai.targetWords': '목표 글자 수', 'ai.generate': '생성',
    'writing.zenMode': 'ZEN 모드', 'writing.vertical': '세로쓰기', 'writing.horizontal': '가로쓰기',
    'writing.switchToVertical': '세로쓰기로 전환', 'writing.switchToHorizontal': '가로쓰기로 전환',
    'writing.textUpright': '|||', 'writing.textSideways': '≡', 'writing.textModeTitle': '텍스트 방향 전환',
    'writing.export': '내보내기', 'writing.readAloud': '읽어주기', 'writing.characters': '글자 수',
    'analysis.analyze': '작품 분석', 'analysis.noContent': '분석할 내용이 없습니다',
    'settings.lightMode': '라이트 모드', 'settings.darkMode': '다크 모드', 'settings.logout': '로그아웃', 'settings.betaNote': '베타 기간 모든 기능 무료',
    'settings.account': '계정 관리', 'settings.changePassword': '비밀번호 변경', 'settings.deleteAccount': '계정 삭제',
    'settings.currentPassword': '현재 비밀번호', 'settings.newPassword': '새 비밀번호', 'settings.confirmNewPassword': '새 비밀번호 확인',
    'settings.termsPrivacy': '이용약관 및 개인정보', 'settings.deleteWarning': '경고: 이 작업은 취소할 수 없습니다',
    'settings.deleteWarningDetail': '계정을 삭제하면 모든 프로젝트, 작성 데이터 및 설정이 영구 삭제됩니다.',
    'settings.confirmEmail': '이메일을 입력하여 확인', 'settings.confirmEmailHint': '확인을 위해 등록된 이메일 주소를 입력하세요',
    'settings.deleteAccountConfirm': '삭제', 'settings.passwordChanged': '비밀번호가 변경되었습니다',
    'settings.passwordMismatch': '비밀번호가 일치하지 않습니다', 'settings.accountDeleted': '계정이 삭제되었습니다',
    'legal.terms': '이용약관', 'legal.privacy': '개인정보 처리방침', 'legal.lastUpdated': '최종 업데이트',
    'legal.termsTitle': 'myMuse 이용약관', 'legal.privacyTitle': 'myMuse 개인정보 처리방침',
    'legal.termsAcceptance': '약관 동의', 'legal.termsAcceptanceText': '본 서비스를 이용함으로써 이 이용약관에 동의하는 것입니다.',
    'legal.termsService': '서비스 설명', 'legal.termsServiceText': 'myMuse는 창작 활동을 위한 AI 어시스턴트 서비스입니다. 글쓰기 지원, 플롯 구성, 캐릭터 개발 등의 기능을 제공합니다.',
    'legal.termsUserContent': '사용자 콘텐츠', 'legal.termsUserContentText': '사용자가 만든 모든 콘텐츠(소설, 설정, 캐릭터 등)는 사용자의 소유입니다. 저희는 사용자 콘텐츠를 제3자에게 공유하거나 판매하지 않습니다.',
    'legal.termsAI': 'AI 기능', 'legal.termsAIText': 'AI 기능은 Google Gemini와 xAI Grok을 사용합니다. AI 생성 콘텐츠는 참고용으로만 사용하세요. 생성된 콘텐츠의 사용에 대한 책임은 사용자에게 있습니다.',
    'legal.termsProhibited': '금지 활동', 'legal.termsProhibitedText': '불법 콘텐츠 생성, 타인의 권리 침해, 서비스 남용은 금지됩니다.',
    'legal.termsTermination': '종료', 'legal.termsTerminationText': '사용자는 언제든지 계정을 삭제할 수 있습니다. 저희는 사전 통지 후 서비스를 종료할 권리를 보유합니다.',
    'legal.privacyCollect': '수집하는 정보', 'legal.privacyCollectText': '이메일 주소, 사용자 이름, 생성된 콘텐츠 및 사용 데이터를 수집합니다.',
    'legal.privacyUse': '정보 사용 방법', 'legal.privacyUseText': '서비스 제공 및 개선, 사용자 지원, 서비스 알림을 위해 정보를 사용합니다.',
    'legal.privacyAI': 'AI 처리', 'legal.privacyAIText': 'AI 기능 사용 시 입력 텍스트가 AI 제공업체(Google, xAI)에 전송됩니다. 이러한 제공업체는 모델 학습에 사용자 데이터를 사용하지 않도록 설정되어 있습니다.',
    'legal.privacyShare': '제3자 공유', 'legal.privacyShareText': '법적 요청이 있는 경우를 제외하고 개인 정보를 제3자에게 공유하거나 판매하지 않습니다.',
    'legal.privacySecurity': '보안', 'legal.privacySecurityText': '데이터는 암호화되어 무단 접근으로부터 보호됩니다. 그러나 인터넷에서 완전한 보안을 보장할 수 없습니다.',
    'legal.privacyRights': '귀하의 권리', 'legal.privacyRightsText': '사용자는 계정 설정을 통해 언제든지 데이터에 접근, 수정, 삭제할 권리가 있습니다.',
    'legal.privacyContact': '연락처', 'legal.privacyContactText': '개인정보 관련 문의는 앱 내 피드백 기능을 이용해 주세요.',
    'auth.login': '로그인', 'auth.signup': '회원가입', 'auth.email': '이메일', 'auth.password': '비밀번호', 'auth.name': '이름',
    'common.save': '저장', 'common.cancel': '취소', 'common.delete': '삭제', 'common.loading': '로딩 중...', 'common.error': '오류가 발생했습니다',
    'chat.placeholder': '질문을 입력하세요...', 'chat.empty': 'AI와 대화하기',
    // UI messages
    'ui.saving': '저장 중...', 'ui.saved': '저장됨', 'ui.unsaved': '미저장', 'ui.saveFailed': '저장 실패',
    'ui.createSeries': '시리즈 만들기', 'ui.addEpisode': '새 화 추가', 'ui.parentProject': '상위 프로젝트',
    'ui.saveSettings': '설정 저장', 'ui.saveSeriesSettings': '시리즈 설정 저장', 'ui.autoSync': '저장 시 모든 화에 자동 동기화',
    'ui.projectRef': '프로젝트 참조', 'ui.genSettings': '생성 설정', 'ui.generateIllustration': '삽화 생성',
    'ui.generatedIllustrations': '생성된 삽화', 'ui.comingSoon': '출시 예정',
    'ui.illustrationDevNote': 'AI 이미지 생성 기능은 현재 개발 중입니다. 곧 출시됩니다!',
    'ui.quickIdeas': '빠른 아이디어 생성', 'ui.generateIdeas': 'AI로 아이디어 생성하기',
    'ui.adoptIdea': '채택한 아이디어에 추가', 'ui.noPlot': '아직 플롯 구조가 없습니다',
    'ui.createPlotHint': '아이디어 탭에서 플롯 구조를 만드세요', 'ui.noAdoptedIdeas': '아이디어 탭에서 아이디어를 생성하고 채택하세요',
    'ui.cancelAI': 'AI 생성을 취소하시겠습니까?', 'ui.aiCancelled': 'AI 생성이 취소되었습니다',
    'ui.guestLogin': '게스트로 로그인했습니다!', 'ui.welcomeMsg': 'myMuse에 오신 것을 환영합니다!',
    'ui.illustrationHint': '개요와 내용을 기반으로 일관된 삽화 생성',
    'ui.saveEpisodeSettings': '이 화의 설정 저장', 'ui.settingsSaved': '설정이 저장되었습니다',
    'ui.seriesSettingsSaved': '시리즈 설정이 저장되었습니다', 'ui.seriesSettingsSyncedTo': '시리즈 설정이 저장되고 {count}화에 동기화되었습니다',
    'ui.adoptedIdeas': '채택한 아이디어', 'ui.viewOnly': '보기 전용', 'ui.editInIdeasTab': '아이디어 탭에서 편집',
    'ui.settingsAI': '설정 AI 어시스턴트', 'ui.settingsAIHint': '설정 작성에 대한 도움받기',
    'ui.settingsAIPlaceholder': '캐릭터 설정이나 세계관에 대해 물어보세요...',
    // Series and project settings
    'ui.parentMaterials': '부모 자료', 'ui.childMaterials': '자식 자료',
    'ui.series': '시리즈', 'ui.seriesSharedSettings': '시리즈 공유 설정',
    'ui.seriesGenre': '시리즈 장르', 'ui.seriesDescription': '시리즈 설명',
    'ui.seriesEpisodes': '이 시리즈의 화', 'ui.noEpisodes': '아직 화가 없습니다',
    'ui.episodesSharedSettings': '시리즈 공유 설정',
    'ui.sharedCharacters': '공유 캐릭터 설정', 'ui.sharedTerminology': '공유 용어',
    'ui.sharedWorldSetting': '공유 세계관 설정', 'ui.seriesShared': '시리즈 공유',
    'ui.removeFromSeries': '시리즈에서 제거', 'ui.createSeriesTitle': '시리즈(라이브러리) 만들기',
    'ui.viewSeriesSettings': '시리즈 설정 보기', 'ui.editSeriesSettings': '시리즈 설정 편집',
    // Episode specific
    'ui.episodeGoal': '이 화의 목표', 'ui.episodeGoalHint': '이 화에서 달성하고 싶은 것, 하이라이트 등',
    'ui.episodeGoalPlaceholder': '이 화의 클라이맥스, 복선, 독자에게 전하고 싶은 것...',
    'ui.episodeCharacters': '이 화의 등장인물', 'ui.episodeCharactersHint': '새로 등장하는 캐릭터나 화별 설정',
    'ui.episodeCharactersPlaceholder': '【이 화에서 첫 등장】\n・캐릭터: 역할, 특징\n\n【이 화에서의 변화】\n...',
    'ui.episodeTerminology': '이 화의 용어', 'ui.episodeTerminologyPlaceholder': '이 화에서 새로 등장하는 용어, 개념...',
    'ui.episodeSetting': '이 화의 무대', 'ui.episodeSettingHint': '구체적인 장소와 장면 설정',
    'ui.episodeStructure': '이 화의 구성', 'ui.episodeOutline': '각 화 개요',
    // Writing
    'ui.standardText': '표준 텍스트', 'ui.outline': '개요', 'ui.showOutline': '개요 표시',
    // AI assistant
    'ui.aiPartner': 'AI 파트너', 'ui.quickActions': '빠른 작업',
    'ui.enterCustomPrompt': '사용자 지정 프롬프트 입력', 'ui.aiResponseHistory': 'AI 응답 기록',
    'ui.historyEmptyHint': '작업 실행 후 기록이 여기에 표시됩니다',
    // Settings
    'ui.genreSettings': '장르', 'ui.charSettings': '캐릭터 설정',
    'ui.terminologySettings': '용어', 'ui.worldSettings': '세계관 설정',
    'ui.storyGoal': '스토리 목표', 'ui.plotStructure': '플롯 구성', 'ui.expand': '확장',
    'ui.autoSyncHint': '체크하면 공유 설정이 모든 화에 적용됩니다',
    'ui.inheritedFromSeries': '시리즈에서 상속', 'ui.notSet': '미설정', 'ui.readOnly': '읽기 전용',
    'ui.selectMultiple': '다중 선택 가능', 'ui.partOfSeries': '시리즈의 일부',
    // Text styles and editing
    'ui.title': '제목', 'ui.heading1': '제목 1', 'ui.heading2': '제목 2', 'ui.heading3': '제목 3',
    'ui.editSettings': '설정 편집', 'ui.characters': '자',
    'ui.pleaseEnterCustomPrompt': '사용자 지정 프롬프트를 입력하세요',
    // Modals
    'ui.createNewSeries': '새 시리즈(라이브러리) 만들기',
    'ui.seriesCreateHint': '시리즈를 만들면 여러 화를 하나로 묶고 캐릭터 설정과 세계관을 공유할 수 있습니다.',
    'ui.seriesName': '시리즈 이름', 'ui.seriesDescOptional': '시리즈 설명 (선택사항)',
    'ui.rename': '이름 바꾸기', 'ui.createFirstEpisode': '첫 화 만들기',
  },
  es: {
    'app.title': 'myMuse', 'app.tagline': 'Tu compañero de escritura omnisciente',
    'nav.home': 'Inicio', 'nav.write': 'Escribir', 'nav.manage': 'Gestionar', 'nav.settings': 'Ajustes',
    'sidebar.projects': 'Proyectos', 'sidebar.newProject': 'Nuevo proyecto', 'sidebar.trash': 'Papelera',
    'sidebar.search': 'Buscar', 'sidebar.calendar': 'Calendario', 'sidebar.language': 'Idioma',
    'tab.ideas': 'Ideas', 'tab.plot': 'Trama', 'tab.writing': 'Escritura', 'tab.illustration': 'Ilustración', 'tab.analysis': 'Análisis', 'tab.consultation': 'Chat AI',
    'ai.continue': 'Continuar', 'ai.rewrite': 'Reescribir', 'ai.expand': 'Expandir', 'ai.proofread': 'Corregir',
    'ai.summarize': 'Resumir', 'ai.translate': 'Traducir', 'ai.titleSuggestion': 'Ideas de título', 'ai.generate': 'Generar',
    'writing.zenMode': 'Modo ZEN', 'writing.export': 'Exportar', 'writing.characters': 'Caracteres',
    'analysis.analyze': 'Analizar obra', 'analysis.noContent': 'No hay contenido para analizar',
    'settings.lightMode': 'Modo claro', 'settings.darkMode': 'Modo oscuro', 'settings.logout': 'Cerrar sesión', 'settings.betaNote': 'Todas las funciones gratis durante la beta',
    'auth.login': 'Iniciar sesión', 'auth.signup': 'Registrarse', 'auth.email': 'Correo', 'auth.password': 'Contraseña', 'auth.name': 'Nombre',
    'common.save': 'Guardar', 'common.cancel': 'Cancelar', 'common.delete': 'Eliminar', 'common.loading': 'Cargando...', 'common.error': 'Ha ocurrido un error',
    'chat.placeholder': 'Escribe tu pregunta...', 'chat.empty': 'Chatea con AI',
  },
  fr: {
    'app.title': 'myMuse', 'app.tagline': 'Votre compagnon d\'écriture omniscient',
    'nav.home': 'Accueil', 'nav.write': 'Écrire', 'nav.manage': 'Gérer', 'nav.settings': 'Paramètres',
    'sidebar.projects': 'Projets', 'sidebar.newProject': 'Nouveau projet', 'sidebar.trash': 'Corbeille',
    'sidebar.search': 'Rechercher', 'sidebar.calendar': 'Calendrier', 'sidebar.language': 'Langue',
    'tab.ideas': 'Idées', 'tab.plot': 'Intrigue', 'tab.writing': 'Écriture', 'tab.illustration': 'Illustration', 'tab.analysis': 'Analyse', 'tab.consultation': 'Chat AI',
    'ai.continue': 'Continuer', 'ai.rewrite': 'Réécrire', 'ai.expand': 'Développer', 'ai.proofread': 'Corriger',
    'ai.summarize': 'Résumer', 'ai.translate': 'Traduire', 'ai.titleSuggestion': 'Idées de titre', 'ai.generate': 'Générer',
    'writing.zenMode': 'Mode ZEN', 'writing.export': 'Exporter', 'writing.characters': 'Caractères',
    'analysis.analyze': 'Analyser l\'œuvre', 'analysis.noContent': 'Aucun contenu à analyser',
    'settings.lightMode': 'Mode clair', 'settings.darkMode': 'Mode sombre', 'settings.logout': 'Déconnexion', 'settings.betaNote': 'Toutes les fonctionnalités gratuites pendant la bêta',
    'auth.login': 'Connexion', 'auth.signup': 'Inscription', 'auth.email': 'Email', 'auth.password': 'Mot de passe', 'auth.name': 'Nom',
    'common.save': 'Enregistrer', 'common.cancel': 'Annuler', 'common.delete': 'Supprimer', 'common.loading': 'Chargement...', 'common.error': 'Une erreur est survenue',
    'chat.placeholder': 'Posez votre question...', 'chat.empty': 'Discutez avec l\'AI',
  },
  de: {
    'app.title': 'myMuse', 'app.tagline': 'Ihr allwissender Schreibbegleiter',
    'nav.home': 'Startseite', 'nav.write': 'Schreiben', 'nav.manage': 'Verwalten', 'nav.settings': 'Einstellungen',
    'sidebar.projects': 'Projekte', 'sidebar.newProject': 'Neues Projekt', 'sidebar.trash': 'Papierkorb',
    'sidebar.search': 'Suchen', 'sidebar.calendar': 'Kalender', 'sidebar.language': 'Sprache',
    'tab.ideas': 'Ideen', 'tab.plot': 'Handlung', 'tab.writing': 'Schreiben', 'tab.illustration': 'Illustration', 'tab.analysis': 'Analyse', 'tab.consultation': 'AI-Chat',
    'ai.continue': 'Fortsetzen', 'ai.rewrite': 'Umschreiben', 'ai.expand': 'Erweitern', 'ai.proofread': 'Korrektur',
    'ai.summarize': 'Zusammenfassen', 'ai.translate': 'Übersetzen', 'ai.titleSuggestion': 'Titelvorschläge', 'ai.generate': 'Generieren',
    'writing.zenMode': 'ZEN-Modus', 'writing.export': 'Exportieren', 'writing.characters': 'Zeichen',
    'analysis.analyze': 'Werk analysieren', 'analysis.noContent': 'Kein Inhalt zum Analysieren',
    'settings.lightMode': 'Heller Modus', 'settings.darkMode': 'Dunkler Modus', 'settings.logout': 'Abmelden', 'settings.betaNote': 'Alle Funktionen während der Beta kostenlos',
    'auth.login': 'Anmelden', 'auth.signup': 'Registrieren', 'auth.email': 'E-Mail', 'auth.password': 'Passwort', 'auth.name': 'Name',
    'common.save': 'Speichern', 'common.cancel': 'Abbrechen', 'common.delete': 'Löschen', 'common.loading': 'Laden...', 'common.error': 'Ein Fehler ist aufgetreten',
    'chat.placeholder': 'Stellen Sie Ihre Frage...', 'chat.empty': 'Mit AI chatten',
  },
  pt: {
    'app.title': 'myMuse', 'app.tagline': 'Seu companheiro de escrita onisciente',
    'nav.home': 'Início', 'nav.write': 'Escrever', 'nav.manage': 'Gerenciar', 'nav.settings': 'Configurações',
    'sidebar.projects': 'Projetos', 'sidebar.newProject': 'Novo projeto', 'sidebar.trash': 'Lixeira',
    'sidebar.search': 'Pesquisar', 'sidebar.calendar': 'Calendário', 'sidebar.language': 'Idioma',
    'tab.ideas': 'Ideias', 'tab.plot': 'Enredo', 'tab.writing': 'Escrita', 'tab.illustration': 'Ilustração', 'tab.analysis': 'Análise', 'tab.consultation': 'Chat AI',
    'ai.continue': 'Continuar', 'ai.rewrite': 'Reescrever', 'ai.expand': 'Expandir', 'ai.proofread': 'Revisar',
    'ai.summarize': 'Resumir', 'ai.translate': 'Traduzir', 'ai.titleSuggestion': 'Sugestões de título', 'ai.generate': 'Gerar',
    'writing.zenMode': 'Modo ZEN', 'writing.export': 'Exportar', 'writing.characters': 'Caracteres',
    'analysis.analyze': 'Analisar obra', 'analysis.noContent': 'Sem conteúdo para analisar',
    'settings.lightMode': 'Modo claro', 'settings.darkMode': 'Modo escuro', 'settings.logout': 'Sair', 'settings.betaNote': 'Todas as funcionalidades grátis durante o beta',
    'auth.login': 'Entrar', 'auth.signup': 'Cadastrar', 'auth.email': 'Email', 'auth.password': 'Senha', 'auth.name': 'Nome',
    'common.save': 'Salvar', 'common.cancel': 'Cancelar', 'common.delete': 'Excluir', 'common.loading': 'Carregando...', 'common.error': 'Ocorreu um erro',
    'chat.placeholder': 'Digite sua pergunta...', 'chat.empty': 'Converse com AI',
  },
  ru: {
    'app.title': 'myMuse', 'app.tagline': 'Ваш всезнающий помощник в писательстве',
    'nav.home': 'Главная', 'nav.write': 'Писать', 'nav.manage': 'Управление', 'nav.settings': 'Настройки',
    'sidebar.projects': 'Проекты', 'sidebar.newProject': 'Новый проект', 'sidebar.trash': 'Корзина',
    'sidebar.search': 'Поиск', 'sidebar.calendar': 'Календарь', 'sidebar.language': 'Язык',
    'tab.ideas': 'Идеи', 'tab.plot': 'Сюжет', 'tab.writing': 'Написание', 'tab.illustration': 'Иллюстрация', 'tab.analysis': 'Анализ', 'tab.consultation': 'Чат AI',
    'ai.continue': 'Продолжить', 'ai.rewrite': 'Переписать', 'ai.expand': 'Расширить', 'ai.proofread': 'Корректура',
    'ai.summarize': 'Резюме', 'ai.translate': 'Перевести', 'ai.titleSuggestion': 'Идеи названия', 'ai.generate': 'Создать',
    'writing.zenMode': 'Режим ZEN', 'writing.export': 'Экспорт', 'writing.characters': 'Символы',
    'analysis.analyze': 'Анализировать', 'analysis.noContent': 'Нет содержимого для анализа',
    'settings.lightMode': 'Светлая тема', 'settings.darkMode': 'Тёмная тема', 'settings.logout': 'Выход', 'settings.betaNote': 'Все функции бесплатны в бета-версии',
    'auth.login': 'Вход', 'auth.signup': 'Регистрация', 'auth.email': 'Email', 'auth.password': 'Пароль', 'auth.name': 'Имя',
    'common.save': 'Сохранить', 'common.cancel': 'Отмена', 'common.delete': 'Удалить', 'common.loading': 'Загрузка...', 'common.error': 'Произошла ошибка',
    'chat.placeholder': 'Введите вопрос...', 'chat.empty': 'Чат с AI',
  },
  ar: {
    'app.title': 'myMuse', 'app.tagline': 'رفيقك الكتابي العليم',
    'nav.home': 'الرئيسية', 'nav.write': 'كتابة', 'nav.manage': 'إدارة', 'nav.settings': 'الإعدادات',
    'sidebar.projects': 'المشاريع', 'sidebar.newProject': 'مشروع جديد', 'sidebar.trash': 'سلة المهملات',
    'sidebar.search': 'بحث', 'sidebar.calendar': 'التقويم', 'sidebar.language': 'اللغة',
    'tab.ideas': 'أفكار', 'tab.plot': 'الحبكة', 'tab.writing': 'الكتابة', 'tab.illustration': 'رسم توضيحي', 'tab.analysis': 'تحليل', 'tab.consultation': 'دردشة AI',
    'ai.continue': 'متابعة', 'ai.rewrite': 'إعادة كتابة', 'ai.expand': 'توسيع', 'ai.proofread': 'تدقيق',
    'ai.summarize': 'تلخيص', 'ai.translate': 'ترجمة', 'ai.titleSuggestion': 'اقتراحات العنوان', 'ai.generate': 'توليد',
    'writing.zenMode': 'وضع ZEN', 'writing.export': 'تصدير', 'writing.characters': 'الأحرف',
    'analysis.analyze': 'تحليل العمل', 'analysis.noContent': 'لا يوجد محتوى للتحليل',
    'settings.lightMode': 'الوضع الفاتح', 'settings.darkMode': 'الوضع الداكن', 'settings.logout': 'تسجيل الخروج', 'settings.betaNote': 'جميع الميزات مجانية خلال الإصدار التجريبي',
    'auth.login': 'تسجيل الدخول', 'auth.signup': 'إنشاء حساب', 'auth.email': 'البريد الإلكتروني', 'auth.password': 'كلمة المرور', 'auth.name': 'الاسم',
    'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.delete': 'حذف', 'common.loading': 'جاري التحميل...', 'common.error': 'حدث خطأ',
    'chat.placeholder': 'اكتب سؤالك...', 'chat.empty': 'تحدث مع AI',
  },
  hi: {
    'app.title': 'myMuse', 'app.tagline': 'आपका सर्वज्ञ लेखन साथी',
    'nav.home': 'होम', 'nav.write': 'लिखें', 'nav.manage': 'प्रबंधन', 'nav.settings': 'सेटिंग्स',
    'sidebar.projects': 'प्रोजेक्ट्स', 'sidebar.newProject': 'नया प्रोजेक्ट', 'sidebar.trash': 'ट्रैश',
    'sidebar.search': 'खोजें', 'sidebar.calendar': 'कैलेंडर', 'sidebar.language': 'भाषा',
    'tab.ideas': 'विचार', 'tab.plot': 'कथानक', 'tab.writing': 'लेखन', 'tab.illustration': 'चित्रण', 'tab.analysis': 'विश्लेषण', 'tab.consultation': 'AI चैट',
    'ai.continue': 'जारी रखें', 'ai.rewrite': 'पुनः लिखें', 'ai.expand': 'विस्तार', 'ai.proofread': 'प्रूफ़रीड',
    'ai.summarize': 'सारांश', 'ai.translate': 'अनुवाद', 'ai.titleSuggestion': 'शीर्षक सुझाव', 'ai.generate': 'उत्पन्न करें',
    'writing.zenMode': 'ZEN मोड', 'writing.export': 'निर्यात', 'writing.characters': 'अक्षर',
    'analysis.analyze': 'कार्य का विश्लेषण', 'analysis.noContent': 'विश्लेषण के लिए कोई सामग्री नहीं',
    'settings.lightMode': 'लाइट मोड', 'settings.darkMode': 'डार्क मोड', 'settings.logout': 'लॉग आउट', 'settings.betaNote': 'बीटा के दौरान सभी सुविधाएं मुफ्त',
    'auth.login': 'लॉगिन', 'auth.signup': 'साइन अप', 'auth.email': 'ईमेल', 'auth.password': 'पासवर्ड', 'auth.name': 'नाम',
    'common.save': 'सहेजें', 'common.cancel': 'रद्द करें', 'common.delete': 'हटाएं', 'common.loading': 'लोड हो रहा है...', 'common.error': 'त्रुटि हुई',
    'chat.placeholder': 'अपना प्रश्न लिखें...', 'chat.empty': 'AI से चैट करें',
  },
  th: {
    'app.title': 'myMuse', 'app.tagline': 'ผู้ช่วยเขียนที่รอบรู้ของคุณ',
    'nav.home': 'หน้าแรก', 'nav.write': 'เขียน', 'nav.manage': 'จัดการ', 'nav.settings': 'ตั้งค่า',
    'sidebar.projects': 'โปรเจกต์', 'sidebar.newProject': 'โปรเจกต์ใหม่', 'sidebar.trash': 'ถังขยะ',
    'sidebar.search': 'ค้นหา', 'sidebar.calendar': 'ปฏิทิน', 'sidebar.language': 'ภาษา',
    'tab.ideas': 'ไอเดีย', 'tab.plot': 'พล็อต', 'tab.writing': 'การเขียน', 'tab.illustration': 'ภาพประกอบ', 'tab.analysis': 'วิเคราะห์', 'tab.consultation': 'แชท AI',
    'ai.continue': 'เขียนต่อ', 'ai.rewrite': 'เขียนใหม่', 'ai.expand': 'ขยาย', 'ai.proofread': 'ตรวจทาน',
    'ai.summarize': 'สรุป', 'ai.translate': 'แปล', 'ai.titleSuggestion': 'แนะนำชื่อเรื่อง', 'ai.generate': 'สร้าง',
    'writing.zenMode': 'โหมด ZEN', 'writing.export': 'ส่งออก', 'writing.characters': 'ตัวอักษร',
    'analysis.analyze': 'วิเคราะห์งาน', 'analysis.noContent': 'ไม่มีเนื้อหาที่จะวิเคราะห์',
    'settings.lightMode': 'โหมดสว่าง', 'settings.darkMode': 'โหมดมืด', 'settings.logout': 'ออกจากระบบ', 'settings.betaNote': 'ฟีเจอร์ทั้งหมดฟรีในช่วงเบต้า',
    'auth.login': 'เข้าสู่ระบบ', 'auth.signup': 'สมัครสมาชิก', 'auth.email': 'อีเมล', 'auth.password': 'รหัสผ่าน', 'auth.name': 'ชื่อ',
    'common.save': 'บันทึก', 'common.cancel': 'ยกเลิก', 'common.delete': 'ลบ', 'common.loading': 'กำลังโหลด...', 'common.error': 'เกิดข้อผิดพลาด',
    'chat.placeholder': 'พิมพ์คำถามของคุณ...', 'chat.empty': 'แชทกับ AI',
  },
};

function t(key) {
  return i18n[state.language]?.[key] || i18n.ja[key] || key;
}

// ============================================
// Early Global Functions (needed for onclick handlers)
// ============================================
window.switchAuthMode = function(mode) {
  console.log('switchAuthMode called with mode:', mode);
  state.authMode = mode;
  console.log('state.authMode set to:', state.authMode);
  render();
  console.log('render() completed');
};

// Debug: allow checking state from console
window.debugState = function() {
  console.log('Current state:', JSON.stringify({
    authMode: state.authMode,
    user: state.user,
    sessionId: state.sessionId
  }));
  return state;
};

// Debug: dump HTML  
window.debugHTML = function() {
  const app = document.querySelector('#app');
  console.log('App innerHTML length:', app?.innerHTML?.length);
  const buttons = app?.querySelectorAll('button');
  console.log('Buttons found:', buttons?.length);
  buttons?.forEach((b, i) => {
    console.log(`Button ${i}:`, b.outerHTML.substring(0, 200));
  });
};

console.log('window.switchAuthMode defined');

// ============================================
// API Helpers
// ============================================
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  if (state.sessionId) {
    config.headers['X-Session-Id'] = state.sessionId;
  }
  return config;
});

// ============================================
// Utility Functions
// ============================================
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function setLanguage(lang) {
  state.language = lang;
  localStorage.setItem('language', lang);
  const dir = ['ar'].includes(lang) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  render();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(state.language === 'ja' ? 'ja-JP' : 'en-US');
}

// Count words/characters based on language
// Japanese/Chinese: count characters (excluding whitespace)
// English/Others: count words
function countWords(text) {
  if (!text) return 0;
  
  const lang = state.language || 'ja';
  
  // Japanese, Chinese, Korean - count characters
  if (['ja', 'zh', 'ko'].includes(lang)) {
    return text.replace(/\s/g, '').length;
  }
  
  // English and other languages - count words
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// Get the appropriate count label based on language
function getCountLabel() {
  const lang = state.language || 'ja';
  if (['ja', 'zh', 'ko'].includes(lang)) {
    return lang === 'zh' ? '字' : '文字';
  }
  return 'words';
}

// Genre options helper
function getGenreOptions() {
  return [
    { value: 'literary', label: t('genre.literary') },
    { value: 'contemporary', label: t('genre.contemporary') },
    { value: 'fantasy', label: t('genre.fantasy') },
    { value: 'scifi', label: t('genre.scifi') },
    { value: 'mystery', label: t('genre.mystery') },
    { value: 'suspense', label: t('genre.suspense') },
    { value: 'horror', label: t('genre.horror') },
    { value: 'romance', label: t('genre.romance') },
    { value: 'historical', label: t('genre.historical') },
    { value: 'adventure', label: t('genre.adventure') },
    { value: 'lightnovel', label: t('genre.lightnovel') },
    { value: 'children', label: t('genre.children') },
    { value: 'essay', label: t('genre.essay') },
    { value: 'critique', label: t('genre.critique') },
    { value: 'business', label: t('genre.business') },
    { value: 'selfhelp', label: t('genre.selfhelp') },
    { value: 'philosophy', label: t('genre.philosophy') },
    { value: 'sociology', label: t('genre.sociology') },
    { value: 'historyNF', label: t('genre.historyNF') },
    { value: 'science', label: t('genre.science') },
    { value: 'journalism', label: t('genre.journalism') },
    { value: 'biography', label: t('genre.biography') },
  ];
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// ============================================
// Data Functions
// ============================================
async function loadProjects() {
  if (!state.user) return;
  try {
    const projectsRes = await api.get(`/projects?userId=${state.user.id}`);
    state.projects = projectsRes.data.projects || [];
  } catch (e) { console.error('Load projects error:', e); }
}

async function loadProjectData(projectId) {
  if (!projectId) return;
  try {
    const [project, writings, plot, ideas, characters, worldSettings, threads] = await Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/projects/${projectId}/writings`),
      api.get(`/projects/${projectId}/plot`),
      api.get(`/projects/${projectId}/ideas`),
      api.get(`/projects/${projectId}/characters`),
      api.get(`/projects/${projectId}/world-settings`),
      api.get(`/projects/${projectId}/chat/threads`),
    ]);
    state.currentProject = project.data.project;
    state.writings = writings.data.writings || [];
    state.currentWriting = state.writings[0] || null;
    state.plot = plot.data.plot;
    state.ideas = ideas.data.ideas || [];
    state.characters = characters.data.characters || [];
    state.worldSettings = worldSettings.data.settings || [];
    state.chatThreads = threads.data.threads || [];
  } catch (e) { console.error('Load project data error:', e); }
}

async function loadChatMessages(threadId) {
  if (!state.currentProject || !threadId) return;
  try {
    const res = await api.get(`/projects/${state.currentProject.id}/chat?threadId=${threadId}`);
    state.chatMessages = res.data.messages || [];
    state.currentThread = threadId;
  } catch (e) { console.error('Load chat error:', e); }
}

async function loadCalendarEvents(year, month) {
  if (!state.user) return;
  try {
    const res = await api.get(`/calendar?userId=${state.user.id}&year=${year}&month=${month}`);
    state.calendarEvents = res.data.events || [];
  } catch (e) { console.error('Load calendar error:', e); }
}

async function loadTrash() {
  if (!state.user) return;
  try {
    const res = await api.get(`/trash?userId=${state.user.id}`);
    state.trash = res.data.projects || [];
  } catch (e) { console.error('Load trash error:', e); }
}

// ============================================
// Auth Functions
// ============================================
async function login(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    state.user = res.data.user;
    state.sessionId = res.data.sessionId;
    localStorage.setItem('sessionId', state.sessionId);
    await loadProjects();
    if (state.projects.length > 0) {
      await loadProjectData(state.projects[0].id);
    }
    render();
  } catch (e) {
    console.error('Login error:', e);
    // Check if the error is "user not found" type
    if (e.response?.status === 401) {
      const errorMsg = e.response?.data?.error || 'ログインに失敗しました';
      // Ask if they want to create an account
      if (confirm(`${errorMsg}\n\nアカウントをお持ちでない場合は、「新規登録」タブから作成してください。\n\n新規登録画面に移動しますか？`)) {
        state.authMode = 'signup';
        render();
        // Pre-fill the email
        setTimeout(() => {
          const emailInput = document.getElementById('signup-email');
          if (emailInput) emailInput.value = email;
        }, 100);
      }
    } else {
      alert(e.response?.data?.error || t('common.error'));
    }
  }
}

async function signup(name, email, password) {
  try {
    const res = await api.post('/auth/signup', { name, email, password });
    state.user = res.data.user;
    state.sessionId = res.data.sessionId;
    localStorage.setItem('sessionId', state.sessionId);
    await loadProjects();
    render();
    alert('アカウントを作成しました！myMuseへようこそ！');
  } catch (e) {
    if (e.response?.data?.error) {
      alert(e.response.data.error);
    } else {
      alert(t('common.error'));
    }
  }
}

async function logout() {
  try {
    await api.post('/auth/logout', { sessionId: state.sessionId });
  } catch (e) {}
  state.user = null;
  state.sessionId = null;
  state.currentProject = null;
  localStorage.removeItem('sessionId');
  render();
}

// Change password handler
window.handleChangePassword = async (event) => {
  event.preventDefault();
  
  const currentPassword = $('#current-password').value;
  const newPassword = $('#new-password').value;
  const confirmPassword = $('#confirm-new-password').value;
  const errorDiv = $('#password-error');
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    errorDiv.textContent = t('settings.passwordMismatch');
    errorDiv.classList.remove('hidden');
    return;
  }
  
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Session-Id': state.sessionId
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to change password');
    }
    
    alert(t('settings.passwordChanged'));
    closeModal('changePassword');
    
    // Clear form
    $('#current-password').value = '';
    $('#new-password').value = '';
    $('#confirm-new-password').value = '';
    errorDiv.classList.add('hidden');
    
  } catch (e) {
    errorDiv.textContent = e.message;
    errorDiv.classList.remove('hidden');
  }
};

// Delete account handler
window.handleDeleteAccount = async (event) => {
  event.preventDefault();
  
  const confirmEmail = $('#delete-confirm-email').value;
  const errorDiv = $('#delete-error');
  
  try {
    const res = await fetch('/api/auth/delete-account', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Session-Id': state.sessionId
      },
      body: JSON.stringify({ confirmEmail })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete account');
    }
    
    alert(t('settings.accountDeleted'));
    
    // Clear local state and redirect to login
    state.user = null;
    state.sessionId = null;
    state.currentProject = null;
    localStorage.removeItem('sessionId');
    closeModal('deleteAccount');
    closeModal('settings');
    render();
    
  } catch (e) {
    errorDiv.textContent = e.message;
    errorDiv.classList.remove('hidden');
  }
};

// Legal tab switcher
window.switchLegalTab = (tab) => {
  const termsTab = $('#legal-tab-terms');
  const privacyTab = $('#legal-tab-privacy');
  const termsContent = $('#legal-content-terms');
  const privacyContent = $('#legal-content-privacy');
  
  if (tab === 'terms') {
    termsTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    termsTab.classList.remove('text-gray-500');
    privacyTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    privacyTab.classList.add('text-gray-500');
    termsContent.classList.remove('hidden');
    privacyContent.classList.add('hidden');
  } else {
    privacyTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    privacyTab.classList.remove('text-gray-500');
    termsTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    termsTab.classList.add('text-gray-500');
    privacyContent.classList.remove('hidden');
    termsContent.classList.add('hidden');
  }
};

// Guest login - creates a temporary account for trying the app
async function guestLogin() {
  try {
    // Generate random guest credentials
    const guestId = Math.random().toString(36).substring(2, 10);
    const guestEmail = `guest_${guestId}@mymuse.temp`;
    const guestName = `ゲストユーザー`;
    const guestPassword = Math.random().toString(36).substring(2, 15);
    
    // Create guest account
    const res = await api.post('/auth/signup', { 
      name: guestName, 
      email: guestEmail, 
      password: guestPassword 
    });
    
    state.user = res.data.user;
    state.sessionId = res.data.sessionId;
    localStorage.setItem('sessionId', state.sessionId);
    
    await loadProjects();
    render();
    
    alert('ゲストとしてログインしました！\n\nすべての機能をお試しいただけます。\n※ゲストデータは一定期間後に削除される場合があります。');
  } catch (e) {
    console.error('Guest login error:', e);
    alert('ゲストログインに失敗しました。もう一度お試しください。');
  }
}
window.guestLogin = guestLogin;

async function checkSession() {
  if (!state.sessionId) return;
  try {
    const res = await api.get('/auth/me');
    if (res.data.user) {
      state.user = res.data.user;
      setTheme(state.user.theme || 'light');
      setLanguage(state.user.language || 'ja');
      await loadProjects();
      if (state.projects.length > 0) {
        await loadProjectData(state.projects[0].id);
      }
    }
  } catch (e) {
    state.sessionId = null;
    localStorage.removeItem('sessionId');
  }
}

// ============================================
// Project Functions
// ============================================
async function createProject(title, genre) {
  if (!state.user) return;
  try {
    const res = await api.post('/projects', {
      user_id: state.user.id,
      title,
      genre
    });
    state.projects.unshift(res.data.project);
    await loadProjectData(res.data.project.id);
    render();
  } catch (e) { alert(t('common.error')); }
}

async function deleteProject(id, permanent = false) {
  try {
    await api.delete(`/projects/${id}?permanent=${permanent}`);
    state.projects = state.projects.filter(p => p.id !== id);
    if (state.currentProject?.id === id) {
      state.currentProject = state.projects[0] || null;
      if (state.currentProject) await loadProjectData(state.currentProject.id);
    }
    render();
  } catch (e) { alert(t('common.error')); }
}

async function restoreProject(id) {
  try {
    await api.post(`/projects/${id}/restore`);
    await loadProjects();
    await loadTrash();
    render();
  } catch (e) { alert(t('common.error')); }
}

// ============================================
// Writing Functions
// ============================================
let saveStatus = 'saved'; // 'saved', 'saving', 'unsaved'

function updateSaveIndicator(status) {
  saveStatus = status;
  const indicator = $('#save-indicator');
  if (!indicator) return;
  
  switch(status) {
    case 'saving':
      indicator.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>${t('ui.saving')}`;
      indicator.className = 'text-sm text-yellow-600 dark:text-yellow-400 flex items-center';
      break;
    case 'saved':
      indicator.innerHTML = `<i class="fas fa-check mr-1"></i>${t('ui.saved')}`;
      indicator.className = 'text-sm text-green-600 dark:text-green-400 flex items-center';
      break;
    case 'unsaved':
      indicator.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${t('ui.unsaved')}`;
      indicator.className = 'text-sm text-red-600 dark:text-red-400 flex items-center';
      break;
  }
}

const autoSaveDebounced = debounce(async (content) => {
  if (!state.currentWriting) return;
  updateSaveIndicator('saving');
  try {
    const previousLength = state.currentWriting.content?.length || 0;
    await api.put(`/writings/${state.currentWriting.id}`, {
      content,
      chapter_title: state.currentWriting.chapter_title,
      writing_direction: state.currentWriting.writing_direction,
      font_family: state.currentWriting.font_family,
    });
    state.currentWriting.content = content;
    state.currentWriting.word_count = countWords(content);
    updateWordCount();
    updateSaveIndicator('saved');
    
    // Track words written
    const wordsAdded = content.length - previousLength;
    if (wordsAdded > 0 && typeof trackActivity === 'function') {
      trackActivity('words', wordsAdded);
    }
  } catch (e) { 
    console.error('Auto-save error:', e);
    updateSaveIndicator('unsaved');
  }
}, 1000);

// Global function for oninput
window.autoSave = (content) => {
  updateSaveIndicator('unsaved');
  autoSaveDebounced(content);
};

// Manual save function
window.manualSave = async () => {
  const editor = $('#editor');
  if (!editor || !state.currentWriting) return;
  
  updateSaveIndicator('saving');
  try {
    await api.put(`/writings/${state.currentWriting.id}`, {
      content: editor.value,
      chapter_title: state.currentWriting.chapter_title,
      writing_direction: state.currentWriting.writing_direction,
      font_family: state.currentWriting.font_family,
    });
    state.currentWriting.content = editor.value;
    state.currentWriting.word_count = countWords(editor.value);
    updateWordCount();
    updateSaveIndicator('saved');
  } catch (e) {
    console.error('Manual save error:', e);
    updateSaveIndicator('unsaved');
    alert('保存に失敗しました: ' + e.message);
  }
};

function updateWordCount() {
  const el = $('#word-count');
  if (el && state.currentWriting) {
    el.textContent = `${state.currentWriting.word_count || 0} ${getCountLabel()}`;
  }
}

// ============================================
// AI Functions
// ============================================
let aiAbortController = null;

async function callAI(action, content, options = {}) {
  // プロジェクトなしでもAI機能は使用可能
  
  // Create new abort controller for this request
  aiAbortController = new AbortController();
  state.aiGenerating = true;
  renderAISidebar(); // Update sidebar to show loading state
  
  try {
    const res = await api.post('/ai/generate', {
      action,
      content,
      projectId: state.currentProject?.id || null,
      userId: state.user?.id,
      currentWriting: state.currentWriting?.content,
      options,
    });
    state.aiGenerating = false;
    aiAbortController = null;
    renderAISidebar(); // Update sidebar to hide loading state
    return res.data.result;
  } catch (e) {
    state.aiGenerating = false;
    aiAbortController = null;
    renderAISidebar(); // Update sidebar to hide loading state
    if (e.name === 'AbortError') {
      console.log('AI generation cancelled');
      return null;
    }
    console.error('AI error:', e);
    return null;
  }
}

window.cancelAIGeneration = () => {
  if (!state.aiGenerating) return;
  
  if (confirm('AI生成をキャンセルしますか？')) {
    if (aiAbortController) {
      aiAbortController.abort();
    }
    state.aiGenerating = false;
    aiAbortController = null;
    render();
    alert('AI生成をキャンセルしました');
  }
};

async function generateIdeas(genre, keywords, count) {
  state.aiGenerating = true;
  render();
  try {
    const res = await api.post('/ai/generate-ideas', { genre, keywords, count });
    state.aiGenerating = false;
    return res.data.ideas || [];
  } catch (e) {
    state.aiGenerating = false;
    console.error('Idea generation error:', e);
    return [];
  }
}

async function analyzeWriting() {
  if (!state.currentWriting?.content) return null;
  state.aiGenerating = true;
  render();
  try {
    const res = await api.post('/ai/analyze', { content: state.currentWriting.content });
    state.aiGenerating = false;
    // Save result for later re-rendering
    state.lastAnalysisResult = res.data.analysis;
    return res.data.analysis;
  } catch (e) {
    state.aiGenerating = false;
    console.error('Analysis error:', e);
    return null;
  }
}

// ============================================
// Chat Functions
// ============================================
async function sendChatMessage(content, tabContext = 'consultation') {
  console.log('sendChatMessage called:', { content, tabContext, currentProject: state.currentProject });
  
  if (!content.trim()) {
    console.error('Empty message');
    return;
  }
  
  const threadId = state.currentThread || crypto.randomUUID();
  state.currentThread = threadId;
  
  // Add user message immediately to UI
  const userMsg = { id: crypto.randomUUID(), role: 'user', content, created_at: new Date().toISOString() };
  state.chatMessages.push(userMsg);
  renderChat();
  
  try {
    // Save user message (only if project exists)
    if (state.currentProject) {
      await api.post(`/projects/${state.currentProject.id}/chat`, {
        thread_id: threadId,
        role: 'user',
        content,
        tab_context: tabContext,
      });
    }
    
    console.log('Calling AI...');
    // Get AI response
    const response = await callAI('consultation', content);
    console.log('AI response:', response);
    
    if (response) {
      const aiMsg = { id: crypto.randomUUID(), role: 'assistant', content: response, created_at: new Date().toISOString() };
      state.chatMessages.push(aiMsg);
      
      // Save AI message (only if project exists)
      if (state.currentProject) {
        await api.post(`/projects/${state.currentProject.id}/chat`, {
          thread_id: threadId,
          role: 'assistant',
          content: response,
          tab_context: tabContext,
        });
      }
      
      // Track AI consultation for achievements
      if (typeof trackActivity === 'function') {
        trackActivity('aiConsultation', 1);
      }
    } else {
      console.error('No response from AI');
      // Add error message
      state.chatMessages.push({ 
        id: crypto.randomUUID(), 
        role: 'assistant', 
        content: 'AIからの応答を取得できませんでした。もう一度お試しください。', 
        created_at: new Date().toISOString() 
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    state.chatMessages.push({ 
      id: crypto.randomUUID(), 
      role: 'assistant', 
      content: 'エラーが発生しました: ' + error.message, 
      created_at: new Date().toISOString() 
    });
  }
  
  renderChat();
}

// ============================================
// Export Functions
// ============================================
function exportAs(format) {
  if (!state.currentWriting?.content) {
    alert('エクスポートするコンテンツがありません');
    return;
  }
  
  const content = state.currentWriting.content;
  const title = state.currentProject?.title || 'document';
  
  // Close export menu
  $('#export-menu')?.classList.add('hidden');
  
  switch (format) {
    case 'txt':
      exportAsTxt(content, title);
      break;
    case 'html':
      exportAsHtml(content, title);
      break;
    case 'html-zip':
      exportAsHtmlZip(content, title);
      break;
    case 'md':
      exportAsMarkdown(content, title);
      break;
    case 'docx':
      exportAsDocx(content, title);
      break;
    case 'pdf':
      exportAsPdf(content, title);
      break;
    case 'odt':
      exportAsOdt(content, title);
      break;
    case 'rtf':
      exportAsRtf(content, title);
      break;
    case 'epub':
      exportAsEpub(content, title);
      break;
    default:
      alert('未対応の形式です');
  }
}

function exportAsTxt(content, title) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${title}.txt`);
}

function exportAsHtml(content, title) {
  const htmlContent = convertToHtml(content, title);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, `${title}.html`);
}

function exportAsHtmlZip(content, title) {
  // For ZIP, we'll create a simple implementation
  // In production, you'd use JSZip library
  alert('HTML (ZIP) エクスポートは現在準備中です。\n通常のHTMLエクスポートをご利用ください。');
  exportAsHtml(content, title);
}

function exportAsMarkdown(content, title) {
  // Content is already in Markdown-like format
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, `${title}.md`);
}

function exportAsDocx(content, title) {
  // Create a simple DOCX using XML structure
  const docxContent = generateDocxContent(content, title);
  const blob = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  downloadBlob(blob, `${title}.docx`);
}

function exportAsPdf(content, title) {
  // 縦書き設定を取得
  const isVertical = state.currentWriting?.writing_direction === 'vertical';
  const textMode = state.verticalTextMode || 'mixed';
  
  // For PDF, we'll use print functionality as a workaround
  const printWindow = window.open('', '_blank');
  const htmlContent = convertToHtml(content, title, true, isVertical, textMode);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.onload = function() {
    printWindow.print();
  };
}

function exportAsOdt(content, title) {
  // ODT is a ZIP-based format similar to DOCX
  // For simplicity, export as RTF which LibreOffice can open
  alert('ODT エクスポートは現在準備中です。\nRTF形式でエクスポートします（LibreOfficeで開けます）。');
  exportAsRtf(content, title);
}

function exportAsRtf(content, title) {
  const rtfContent = convertToRtf(content, title);
  const blob = new Blob([rtfContent], { type: 'application/rtf' });
  downloadBlob(blob, `${title}.rtf`);
}

function exportAsEpub(content, title) {
  // EPUB is a complex format requiring multiple files in a ZIP
  // For now, provide a simplified solution
  alert('EPUB エクスポートは現在準備中です。\nHTML形式でエクスポートし、Calibreなどで変換してください。');
  exportAsHtml(content, title);
}

// Helper function to convert content to styled HTML
function convertToHtml(content, title, forPrint = false, isVertical = false, textMode = 'mixed') {
  const lines = content.split('\n');
  let bodyHtml = '';
  
  lines.forEach(line => {
    if (line.match(/^#\s+(.+)$/)) {
      const text = line.replace(/^#\s+/, '');
      bodyHtml += `<h1 style="font-size: 2em; font-weight: bold; margin: 1em 0 0.5em 0;">${escapeHtml(text)}</h1>\n`;
    } else if (line.match(/^##\s+(.+)$/)) {
      const text = line.replace(/^##\s+/, '');
      bodyHtml += `<h2 style="font-size: 1.5em; font-weight: bold; margin: 1em 0 0.5em 0;">${escapeHtml(text)}</h2>\n`;
    } else if (line.match(/^###\s+(.+)$/)) {
      const text = line.replace(/^###\s+/, '');
      bodyHtml += `<h3 style="font-size: 1.25em; font-weight: bold; margin: 1em 0 0.5em 0;">${escapeHtml(text)}</h3>\n`;
    } else if (line.match(/^【(.+)】$/)) {
      const text = line.replace(/^【|】$/g, '');
      bodyHtml += `<h4 style="font-size: 1.1em; font-weight: bold; margin: 1em 0 0.5em 0;">【${escapeHtml(text)}】</h4>\n`;
    } else if (line.trim() === '') {
      bodyHtml += '<br>\n';
    } else {
      bodyHtml += `<p style="margin: 0.5em 0; line-height: 1.8;">${escapeHtml(line)}</p>\n`;
    }
  });
  
  // text-orientation の値を決定
  // mixed: 英数字は横倒し（伝統的な日本語組版）
  // upright: 全文字を正立
  const textOrientation = textMode === 'upright' ? 'upright' : 'mixed';
  
  // 縦書きスタイル
  const verticalStyles = isVertical ? `
    body {
      writing-mode: vertical-rl;
      -webkit-writing-mode: vertical-rl;
      text-orientation: ${textOrientation};
      -webkit-text-orientation: ${textOrientation};
      height: 100vh;
      overflow-x: auto;
      overflow-y: hidden;
    }
    /* 縦中横（2桁数字用） */
    .tcy {
      text-combine-upright: all;
      -webkit-text-combine: horizontal;
    }
  ` : '';
  
  const printStyles = forPrint ? `
    @media print {
      body { margin: 2cm; }
      @page { 
        margin: 2cm;
        ${isVertical ? 'size: A4 landscape;' : ''} 
      }
    }
  ` : '';
  
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: 'Noto Serif JP', 'Yu Mincho', serif;
      ${isVertical ? '' : 'max-width: 800px;'}
      margin: 0 auto;
      padding: 2em;
      line-height: 1.8;
      color: #333;
    }
    ${verticalStyles}
    ${printStyles}
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

// Helper function to convert content to RTF
function convertToRtf(content, title) {
  const lines = content.split('\n');
  let rtfBody = '';
  
  lines.forEach(line => {
    if (line.match(/^#\s+(.+)$/)) {
      const text = line.replace(/^#\s+/, '');
      rtfBody += `\\pard\\fs48\\b ${escapeRtf(text)}\\b0\\fs24\\par\n`;
    } else if (line.match(/^##\s+(.+)$/)) {
      const text = line.replace(/^##\s+/, '');
      rtfBody += `\\pard\\fs36\\b ${escapeRtf(text)}\\b0\\fs24\\par\n`;
    } else if (line.match(/^###\s+(.+)$/)) {
      const text = line.replace(/^###\s+/, '');
      rtfBody += `\\pard\\fs28\\b ${escapeRtf(text)}\\b0\\fs24\\par\n`;
    } else if (line.trim() === '') {
      rtfBody += '\\par\n';
    } else {
      rtfBody += `\\pard ${escapeRtf(line)}\\par\n`;
    }
  });
  
  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Yu Mincho;}}
{\\info{\\title ${escapeRtf(title)}}}
\\paperw11906\\paperh16838\\margl1440\\margr1440\\margt1440\\margb1440
\\fs24
${rtfBody}
}`;
}

// Helper function to generate simplified DOCX content
function generateDocxContent(content, title) {
  // Note: Real DOCX requires a ZIP file with XML files inside
  // This generates a simple RTF that Word can open
  // For proper DOCX, use docx library or server-side generation
  return convertToRtf(content, title);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRtf(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/[\u0080-\uFFFF]/g, char => `\\u${char.charCodeAt(0)}?`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// Speech Synthesis (TTS)
// ============================================
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

window.readAloud = function() {
  if (!window.speechSynthesis) {
    alert('お使いのブラウザは音声読み上げに対応していません');
    return;
  }
  
  // If currently speaking, stop
  if (currentUtterance) {
    speechSynthesis.cancel();
    currentUtterance = null;
    return;
  }
  
  // Get selected text first, fall back to full content
  const editor = document.getElementById('editor');
  let textToRead = '';
  
  if (editor) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    if (start !== end) {
      // There is selected text
      textToRead = editor.value.substring(start, end);
    }
  }
  
  // If no selection, use full content
  if (!textToRead) {
    textToRead = state.currentWriting?.content || '';
  }
  
  if (!textToRead) {
    alert('読み上げるテキストがありません。\nテキストを選択するか、執筆欄に内容を入力してください。');
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = state.language === 'ja' ? 'ja-JP' : 'en-US';
  utterance.rate = 0.9;
  
  currentUtterance = utterance;
  utterance.onend = () => { currentUtterance = null; };
  utterance.onerror = (e) => { 
    console.error('Speech error:', e);
    currentUtterance = null;
  };
  
  speechSynthesis.speak(utterance);
}

// ============================================
// Render Functions
// ============================================
function render() {
  console.log('render() called, state.authMode:', state.authMode, 'state.user:', state.user);
  const app = $('#app');
  
  if (!state.user) {
    console.log('Rendering login page, isSignup:', state.authMode === 'signup');
    app.innerHTML = renderLoginPage();
    attachEventListeners(); // Attach listeners for login/signup forms
    return;
  }
  
  const isMobile = window.innerWidth < 768;
  
  app.innerHTML = `
    <div class="${state.zenMode ? 'zen-mode' : ''}" id="main-container">
      ${!isMobile ? renderHeader() : ''}
      <div class="flex h-screen ${isMobile ? '' : 'pt-14'}">
        ${!isMobile ? renderLeftSidebar() : ''}
        <main class="flex-1 overflow-hidden ${!isMobile && state.sidebarOpen.left ? 'ml-64' : ''} transition-all duration-300">
          ${renderMainContent()}
        </main>
        ${!isMobile ? renderRightSidebar() : ''}
      </div>
      ${isMobile ? renderMobileNav() : ''}
      ${isMobile ? renderMobileFAB() : ''}
    </div>
    ${renderModals()}
  `;
  
  attachEventListeners();
}

function renderLoginPage() {
  const isSignup = state.authMode === 'signup';
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-2">
            <i class="fas fa-feather-alt text-4xl text-indigo-600"></i>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              myMuse
            </h1>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">${t('app.tagline')}</p>
        </div>
        
        <!-- Tab Switcher -->
        <div class="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1" id="auth-tabs">
          <button type="button" id="login-tab-btn"
            class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${!isSignup ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
            <i class="fas fa-sign-in-alt mr-1"></i>${t('auth.login')}
          </button>
          <button type="button" id="signup-tab-btn"
            class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${isSignup ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
            <i class="fas fa-user-plus mr-1"></i>${t('auth.signup')}
          </button>
        </div>
        
        ${isSignup ? `
        <!-- Signup Form -->
        <form id="signup-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('auth.name')}</label>
            <input type="text" id="signup-name" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="あなたの名前">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('auth.email')}</label>
            <input type="email" id="signup-email" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="your@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('auth.password')}</label>
            <input type="password" id="signup-password" required minlength="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="6文字以上">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">パスワード確認</label>
            <input type="password" id="signup-password-confirm" required minlength="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="パスワードを再入力">
          </div>
          <button type="submit"
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
            <i class="fas fa-user-plus mr-2"></i>${t('auth.signup')}
          </button>
        </form>
        ` : `
        <!-- Login Form -->
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('auth.email')}</label>
            <input type="email" id="login-email" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="your@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('auth.password')}</label>
            <input type="password" id="login-password" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              placeholder="••••••••">
          </div>
          <button type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
            <i class="fas fa-sign-in-alt mr-2"></i>${t('auth.login')}
          </button>
        </form>
        
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">または</span>
          </div>
        </div>
        
        <button onclick="guestLogin()" type="button"
          class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
          <i class="fas fa-user-secret mr-2"></i>ゲストとして試す
        </button>
        `}
        
        <p class="mt-6 text-center text-sm text-gray-500">
          <i class="fas fa-gift mr-1"></i>
          ${t('settings.betaNote')}
        </p>
      </div>
    </div>
  `;
}

function renderHeader() {
  return `
    <header class="header fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-40">
      <div class="flex items-center gap-4">
        <button onclick="toggleSidebar('left')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-bars"></i>
        </button>
        <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          <i class="fas fa-feather-alt mr-2"></i>myMuse
        </h1>
      </div>
      
      <div class="flex items-center gap-2">
        ${state.currentProject ? `
          <span class="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
            <i class="fas fa-book mr-1"></i>${state.currentProject.title}
          </span>
        ` : ''}
        
        <button onclick="toggleZenMode()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="${t("writing.zenMode")}">
          <i class="fas ${state.zenMode ? 'fa-compress' : 'fa-expand'}"></i>
        </button>
        
        <button onclick="openModal('settings')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </header>
  `;
}

function renderLeftSidebar() {
  if (!state.sidebarOpen.left) return '';
  
  // ライブラリに属さないプロジェクト（スタンドアローン）
  const standaloneProjects = state.projects.filter(p => !p.library_id && !p.is_library);
  // ライブラリ（親プロジェクト）一覧
  const libraries = state.projects.filter(p => p.is_library);
  
  return `
    <aside class="sidebar-left fixed left-0 top-14 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 animate-slide-in">
      <div class="p-4 space-y-4">
        <!-- Search -->
        <div class="relative">
          <input type="text" id="global-search" placeholder="${t('sidebar.search')}"
            class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
          <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>
        
        <!-- New Project/Library Buttons -->
        <div class="flex gap-2">
          <button onclick="openModal('newProject')" class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
            <i class="fas fa-plus"></i>
            <span>プロジェクト</span>
          </button>
          <button onclick="openModal('newLibrary')" class="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm" title="シリーズ（ライブラリ）を作成">
            <i class="fas fa-layer-group"></i>
          </button>
        </div>
        
        <!-- Libraries Section -->
        ${libraries.length > 0 ? `
          <div class="space-y-1">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <i class="fas fa-layer-group text-purple-500"></i>
              シリーズ
            </h3>
            ${libraries.map(library => renderLibraryItem(library)).join('')}
          </div>
        ` : ''}
        
        <!-- Projects List -->
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">${t('sidebar.projects')}</h3>
          
          <!-- Standalone Projects (not in library) -->
          ${standaloneProjects.map(project => renderProjectItem(project)).join('')}
        </div>
        
        <!-- Calendar -->
        <button onclick="openModal('calendar')" class="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-calendar-alt"></i>
          <span>${t('sidebar.calendar')}</span>
        </button>
        
        <!-- Achievements -->
        <button onclick="openAchievementModal()" class="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-trophy text-yellow-500"></i>
          <span>${t('tab.achievements')}</span>
        </button>
        
        <!-- Trash -->
        <button onclick="openModal('trash')" class="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-trash-alt"></i>
          <span>${t('sidebar.trash')}</span>
        </button>
        
        <!-- AI Credits -->
        <div class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center justify-between text-sm mb-1">
            <span>${t('sidebar.aiCredits')}</span>
            <span class="font-medium">${state.user?.ai_credits || 0}</span>
          </div>
          <div class="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style="width: ${Math.min(100, (state.user?.ai_credits || 0) / 100)}%"></div>
          </div>
        </div>
        
        <!-- Language Selector -->
        <select id="language-select" onchange="setLanguage(this.value)" class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
          <option value="ja" ${state.language === 'ja' ? 'selected' : ''}>日本語</option>
          <option value="en" ${state.language === 'en' ? 'selected' : ''}>English</option>
          <option value="zh" ${state.language === 'zh' ? 'selected' : ''}>中文</option>
          <option value="ko" ${state.language === 'ko' ? 'selected' : ''}>한국어</option>
          <option value="es" ${state.language === 'es' ? 'selected' : ''}>Español</option>
          <option value="fr" ${state.language === 'fr' ? 'selected' : ''}>Français</option>
          <option value="de" ${state.language === 'de' ? 'selected' : ''}>Deutsch</option>
          <option value="ar" ${state.language === 'ar' ? 'selected' : ''}>العربية</option>
        </select>
      </div>
    </aside>
  `;
}

// ライブラリ（シリーズ）のレンダリング
function renderLibraryItem(library) {
  const isExpanded = state.expandedLibraries[library.id];
  const childProjects = state.projects.filter(p => p.library_id === library.id);
  const isActive = state.currentProject?.id === library.id;
  
  return `
    <div class="rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 mb-2">
      <!-- Library Header -->
      <div class="flex items-center gap-2 px-3 py-2 cursor-pointer transition group
          ${isActive ? 'bg-purple-200 dark:bg-purple-800' : 'hover:bg-purple-100 dark:hover:bg-purple-900/40'}">
        <button onclick="event.stopPropagation(); toggleLibraryExpand('${library.id}')" class="text-purple-500 hover:text-purple-700">
          <i class="fas fa-chevron-${isExpanded ? 'down' : 'right'} text-xs"></i>
        </button>
        <div onclick="selectProject('${library.id}')" class="flex items-center gap-2 flex-1 min-w-0">
          <i class="fas fa-layer-group text-purple-500"></i>
          <span class="flex-1 truncate text-sm font-medium">${library.title}</span>
          <span class="text-xs text-purple-400">${childProjects.length}話</span>
        </div>
        <div class="relative">
          <button onclick="event.stopPropagation(); toggleLibraryMenu('${library.id}')" 
            class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1">
            <i class="fas fa-ellipsis-v text-xs"></i>
          </button>
          <div id="library-menu-${library.id}" class="hidden absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <button onclick="event.stopPropagation(); openAddChildProjectModal('${library.id}')" 
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg">
              <i class="fas fa-plus text-green-500"></i>
              ${t('ui.addEpisode')}
            </button>
            <button onclick="event.stopPropagation(); editLibrarySettings('${library.id}')" 
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="fas fa-cog text-blue-500"></i>
              ${t('ui.editSeriesSettings')}
            </button>
            <button onclick="event.stopPropagation(); renameProject('${library.id}', '${library.title.replace(/'/g, "\\'")}')" 
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="fas fa-edit text-indigo-500"></i>
              ${t('ui.rename')}
            </button>
            <button onclick="event.stopPropagation(); deleteProject('${library.id}', '${library.title.replace(/'/g, "\\'")}')" 
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-b-lg">
              <i class="fas fa-trash"></i>
              ${t('common.delete')}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Child Projects (Expandable) -->
      ${isExpanded ? `
        <div class="border-t border-purple-200 dark:border-purple-700 bg-white/50 dark:bg-gray-800/50">
          ${childProjects.length > 0 ? childProjects.map((child, index) => `
            <div onclick="selectProject('${child.id}')" 
              class="flex items-center gap-2 px-4 py-2 cursor-pointer transition text-sm
                ${state.currentProject?.id === child.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
              <span class="w-6 text-center text-xs text-gray-400">${index + 1}</span>
              <i class="fas fa-file-alt text-gray-400"></i>
              <span class="flex-1 truncate">${child.title}</span>
              <button onclick="event.stopPropagation(); removeFromLibrary('${child.id}')" 
                class="opacity-0 hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1" title="シリーズから外す">
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          `).join('') : `
            <div class="px-4 py-3 text-sm text-gray-500 text-center">
              <i class="fas fa-info-circle mr-1"></i>
              まだ話がありません
            </div>
          `}
          <button onclick="openAddChildProjectModal('${library.id}')" 
            class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition">
            <i class="fas fa-plus"></i>
            ${t('ui.addEpisode')}
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderProjectItem(project) {
  const isActive = state.currentProject?.id === project.id;
  return `
    <div class="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition group relative
        ${isActive ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
      <div onclick="selectProject('${project.id}')" class="flex items-center gap-2 flex-1 min-w-0">
        <i class="fas fa-book-open text-sm"></i>
        <span class="flex-1 truncate text-sm">${project.title}</span>
        ${project.deadline ? '<i class="fas fa-clock text-xs text-orange-500"></i>' : ''}
      </div>
      <div class="relative">
        <button onclick="event.stopPropagation(); toggleProjectMenu('${project.id}')" 
          class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1"
          title="メニュー">
          <i class="fas fa-ellipsis-v text-xs"></i>
        </button>
        <div id="project-menu-${project.id}" class="hidden absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <button onclick="event.stopPropagation(); renameProject('${project.id}', '${project.title.replace(/'/g, "\\'")}')" 
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg">
            <i class="fas fa-edit text-blue-500"></i>
            名前を編集
          </button>
          <button onclick="event.stopPropagation(); deleteProject('${project.id}', '${project.title.replace(/'/g, "\\'")}')" 
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-b-lg">
            <i class="fas fa-trash"></i>
            削除
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMainContent() {
  // 新タブ構成: 資料集 → 執筆 → 分析・相談
  const tabs = ['settings_materials', 'writing', 'analysis_chat'];
  const isMobile = window.innerWidth < 768;
  
  return `
    <div class="h-full flex flex-col">
      <!-- Tabs - モバイルでは自動隠しの対象 -->
      <div class="mobile-tabs-header flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${isMobile ? 'px-2' : 'px-4'} transition-all duration-300">
        ${tabs.map(tab => `
          <button onclick="switchTab('${tab}')" 
            class="${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} font-medium transition ${state.currentTab === tab ? 'tab-active' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
            <i class="fas ${getTabIcon(tab)} ${isMobile ? '' : 'mr-1'}"></i>
            <span class="${isMobile ? 'hidden' : ''}">${t(`tab.${tab}`)}</span>
          </button>
        `).join('')}
      </div>
      
      <!-- Tab Content - モバイルで余白削減 -->
      <div class="flex-1 overflow-y-auto ${isMobile ? 'p-2' : 'p-4'} bg-gray-50 dark:bg-gray-900">
        ${renderTabContent()}
      </div>
    </div>
  `;
}

function getTabIcon(tab) {
  const icons = { 
    settings_materials: 'fa-folder-open', 
    writing: 'fa-pen-fancy', 
    analysis_chat: 'fa-chart-line',  // 分析・相談統合
    // Legacy icons for backward compatibility
    ideas: 'fa-lightbulb', 
    plot: 'fa-sitemap', 
    illustration: 'fa-image', 
    analysis: 'fa-chart-pie', 
    consultation: 'fa-comments', 
    achievements: 'fa-trophy' 
  };
  return icons[tab] || 'fa-circle';
}

function renderTabContent() {
  switch (state.currentTab) {
    case 'settings_materials': return renderSettingsMaterialsTab();
    case 'writing': return renderWritingTab();
    case 'analysis_chat': return renderAnalysisChatTab();  // 新・分析・相談統合
    // Legacy tab support
    case 'analysis': return renderAnalysisChatTab();
    case 'consultation': return renderAnalysisChatTab();
    case 'achievements': return renderAchievementsModal();  // モーダルとして返す
    default: return renderSettingsMaterialsTab();
  }
}

// ============================================
// Settings & Materials Tab (C案: 設定・資料タブ)
// ============================================
function renderSettingsMaterialsTab() {
  const allGenres = [
    // Fiction - Traditional
    { value: 'literary', label: t('genre.literary') },
    { value: 'contemporary', label: t('genre.contemporary') },
    { value: 'fantasy', label: t('genre.fantasy') },
    { value: 'scifi', label: t('genre.scifi') },
    { value: 'mystery', label: t('genre.mystery') },
    { value: 'suspense', label: t('genre.suspense') },
    { value: 'horror', label: t('genre.horror') },
    { value: 'romance', label: t('genre.romance') },
    { value: 'historical', label: t('genre.historical') },
    { value: 'adventure', label: t('genre.adventure') },
    { value: 'lightnovel', label: t('genre.lightnovel') },
    { value: 'children', label: t('genre.children') },
    // Web Novel / Modern Genres
    { value: 'litrpg', label: t('genre.litrpg') },
    { value: 'progression', label: t('genre.progression') },
    { value: 'gamelit', label: t('genre.gamelit') },
    { value: 'isekai', label: t('genre.isekai') },
    { value: 'urbanFantasy', label: t('genre.urbanFantasy') },
    { value: 'cozyMystery', label: t('genre.cozyMystery') },
    // Asian Web Novel
    { value: 'xianxia', label: t('genre.xianxia') },
    { value: 'wuxia', label: t('genre.wuxia') },
    { value: 'cultivation', label: t('genre.cultivation') },
    // Non-Fiction
    { value: 'essay', label: t('genre.essay') },
    { value: 'critique', label: t('genre.critique') },
    { value: 'business', label: t('genre.business') },
    { value: 'selfhelp', label: t('genre.selfhelp') },
    { value: 'philosophy', label: t('genre.philosophy') },
    { value: 'sociology', label: t('genre.sociology') },
    { value: 'historyNF', label: t('genre.historyNF') },
    { value: 'science', label: t('genre.science') },
    { value: 'journalism', label: t('genre.journalism') },
    { value: 'biography', label: t('genre.biography') },
  ];
  
  // Check if current project is a library (series)
  const isLibrary = state.currentProject?.is_library;
  // Check if current project belongs to a library
  const parentLibrary = state.currentProject?.library_id 
    ? state.projects.find(p => p.id === state.currentProject.library_id)
    : null;
  
  // For library: use library_settings
  // For child project: show parent's shared settings as reference
  // For standalone: use storyOutline
  const librarySettings = isLibrary ? (state.currentProject?.library_settings || {}) : {};
  const parentSettings = parentLibrary?.library_settings || {};
  
  const storyOutline = state.storyOutline || {
    characters: '',
    terminology: '',
    worldSetting: '',
    storyGoal: '',
    episodes: ''
  };
  
  const projectGenres = state.currentProject?.genre?.split(',') || state.tempGenres?.split(',') || [];
  
  // If this is a library, render library settings UI
  if (isLibrary) {
    return renderLibrarySettingsTab(allGenres, projectGenres, librarySettings);
  }
  
  // If this project belongs to a library, show parent reference + local settings
  if (parentLibrary) {
    return renderChildProjectSettingsTab(allGenres, projectGenres, storyOutline, parentLibrary, parentSettings);
  }
  
  // Standalone project - original UI
  return renderStandaloneSettingsTab(allGenres, projectGenres, storyOutline);
}

// Helper function to render Plot Structure section (shared by all settings tabs)
function renderPlotStructureSection(description = '物語の骨組みを構成する') {
  let structure = {};
  try { structure = JSON.parse(state.plot?.structure || '{}'); } catch (e) {}
  const template = state.plot?.template || 'kishotenketsu';
  
  const kishoteketsuHtml = `
    <div class="space-y-3">
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-play mr-1"></i>${t('plot.ki')}（起）
        </label>
        <textarea id="plot-ki" rows="3" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="物語の始まり"
          oninput="updatePlotStructure('ki', this.value)">${structure.ki || ''}</textarea>
      </div>
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-arrow-right mr-1"></i>${t('plot.sho')}（承）
        </label>
        <textarea id="plot-sho" rows="3" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="物語の展開"
          oninput="updatePlotStructure('sho', this.value)">${structure.sho || ''}</textarea>
      </div>
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-bolt mr-1"></i>${t('plot.ten')}（転）
        </label>
        <textarea id="plot-ten" rows="3" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="クライマックス"
          oninput="updatePlotStructure('ten', this.value)">${structure.ten || ''}</textarea>
      </div>
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-flag-checkered mr-1"></i>${t('plot.ketsu')}（結）
        </label>
        <textarea id="plot-ketsu" rows="3" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="物語の結末"
          oninput="updatePlotStructure('ketsu', this.value)">${structure.ketsu || ''}</textarea>
      </div>
    </div>
  `;
  
  const threeActHtml = `
    <div class="space-y-3">
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-door-open mr-1"></i>${t('plot.act1')}
        </label>
        <textarea id="plot-act1" rows="4" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="設定、登場人物紹介"
          oninput="updatePlotStructure('act1', this.value)">${structure.act1 || ''}</textarea>
      </div>
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-mountain mr-1"></i>${t('plot.act2')}
        </label>
        <textarea id="plot-act2" rows="4" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="対立と葛藤"
          oninput="updatePlotStructure('act2', this.value)">${structure.act2 || ''}</textarea>
      </div>
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
        <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <i class="fas fa-trophy mr-1"></i>${t('plot.act3')}
        </label>
        <textarea id="plot-act3" rows="4" 
          class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="クライマックス、解決"
          oninput="updatePlotStructure('act3', this.value)">${structure.act3 || ''}</textarea>
      </div>
    </div>
  `;
  
  return `
    <div class="p-5 flex flex-col h-full">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <i class="fas fa-sitemap text-orange-500"></i>
        </div>
        <div>
          <h3 class="font-bold text-lg text-orange-500">${t('ui.plotStructure')}</h3>
          <p class="text-sm text-gray-500">${description}</p>
        </div>
      </div>
      
      <div class="flex gap-2 mb-4">
        <button onclick="setPlotTemplate('kishotenketsu')" 
          class="px-3 py-1.5 text-sm rounded-lg transition ${template === 'kishotenketsu' 
            ? 'bg-orange-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}">
          ${t('plot.kishotenketsu')}
        </button>
        <button onclick="setPlotTemplate('three_act')" 
          class="px-3 py-1.5 text-sm rounded-lg transition ${template === 'three_act' 
            ? 'bg-orange-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}">
          ${t('plot.threeAct')}
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto space-y-3">
        ${template === 'kishotenketsu' ? kishoteketsuHtml : threeActHtml}
      </div>
    </div>
  `;
}

// Helper function to render Settings AI Chat panel
function renderSettingsAIChat() {
  const messages = state.settingsChatMessages || [];
  const isResearchMode = state.settingsAIMode === 'research';
  
  let messagesHtml = '';
  if (messages.length > 0) {
    messagesHtml = messages.map(msg => {
      const alignClass = msg.role === 'user' ? 'justify-end' : 'justify-start';
      const bgClass = msg.role === 'user' 
        ? 'bg-indigo-600 text-white' 
        : msg.isResearch 
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      const content = msg.content.replace(/\n/g, '<br>');
      const icon = msg.isResearch ? '<i class="fas fa-search text-emerald-500 mr-1"></i>' : '';
      return `
        <div class="flex ${alignClass}">
          <div class="max-w-[90%] rounded-lg p-2 text-xs ${bgClass}">
            ${icon}${content}
          </div>
        </div>
      `;
    }).join('');
  } else {
    messagesHtml = `
      <div class="text-center text-gray-500 text-xs py-4">
        <i class="fas fa-comments text-2xl mb-2 text-indigo-300"></i>
        <p class="font-medium">${t('chat.empty')}</p>
      </div>
    `;
  }
  
  const isJa = state.language === 'ja';
  const charLabel = isJa ? 'キャラ深掘り' : 'Character';
  const checkLabel = isJa ? '設定チェック' : 'Check';
  const ideaLabel = isJa ? 'アイデア' : 'Ideas';
  const researchLabel = isJa ? '資料調査' : 'Research';
  const charPrompt = isJa ? 'キャラクターの性格を深掘りしたい' : 'Help me develop character personality';
  const checkPrompt = isJa ? '世界観の矛盾点をチェックして' : 'Check world-building consistency';
  const ideaPrompt = isJa ? '新しい設定のアイデアが欲しい' : 'Suggest new setting ideas';
  const researchPrompt = isJa ? '時代考証や専門知識を調べて' : 'Research historical or technical details';
  
  const buttonContent = state.aiGenerating 
    ? '<div class="spinner" style="width:14px;height:14px;border-width:2px;"></div>' 
    : '<i class="fas fa-paper-plane text-xs"></i>';
  const disabledAttr = state.aiGenerating ? 'disabled' : '';
  
  // AI Mode toggle
  const modeToggleClass = isResearchMode 
    ? 'bg-emerald-500 text-white' 
    : 'bg-indigo-500 text-white';
  const modeName = isResearchMode 
    ? (isJa ? '🔍 リサーチ (Grok)' : '🔍 Research (Grok)')
    : (isJa ? '✨ 創作支援 (Gemini)' : '✨ Creative (Gemini)');
  
  return `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 flex flex-col h-full">
      <div class="p-3 border-b dark:border-gray-700 bg-gradient-to-r ${isResearchMode ? 'from-emerald-500 to-teal-600' : 'from-indigo-500 to-purple-600'} text-white">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold flex items-center gap-2 text-sm">
            <i class="fas ${isResearchMode ? 'fa-search' : 'fa-robot'}"></i>
            ${isResearchMode ? (isJa ? 'リサーチAI' : 'Research AI') : t('ui.settingsAI')}
          </h3>
          <button onclick="toggleSettingsAIMode()" 
            class="px-2 py-0.5 text-xs rounded-full bg-white/20 hover:bg-white/30 transition">
            ${isResearchMode ? (isJa ? '創作モードへ' : 'Creative') : (isJa ? 'リサーチへ' : 'Research')}
          </button>
        </div>
        <p class="text-xs text-white/80 mt-0.5">
          ${isResearchMode 
            ? (isJa ? '資料収集・トレンド調査・ファクトチェック' : 'Research, trends, fact-check')
            : t('ui.settingsAIHint')}
        </p>
      </div>
      
      <!-- Chat Messages -->
      <div id="settings-chat-messages" class="flex-1 overflow-y-auto p-3 space-y-2">
        ${messagesHtml}
      </div>
      
      <!-- Chat Input -->
      <div class="p-2 border-t dark:border-gray-700">
        <div class="flex gap-1">
          <input type="text" id="settings-chat-input" 
            placeholder="${isResearchMode 
              ? (isJa ? '調べたいことを入力...' : 'Enter research query...') 
              : t('ui.settingsAIPlaceholder')}"
            class="flex-1 px-2 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-xs"
            onkeypress="if(event.key === 'Enter') sendSettingsChat()">
          <button onclick="sendSettingsChat()" 
            class="px-2 py-1.5 ${isResearchMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg"
            ${disabledAttr}>
            ${buttonContent}
          </button>
        </div>
        
        <!-- Quick prompts -->
        <div class="flex flex-wrap gap-1 mt-1.5">
          ${isResearchMode ? `
            <button onclick="sendSettingsChatQuick('${isJa ? '江戸時代の暮らしについて調べて' : 'Research daily life in Edo period'}')" 
              class="px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800">
              ${isJa ? '時代考証' : 'Historical'}
            </button>
            <button onclick="sendSettingsChatQuick('${isJa ? '今流行りのジャンルの傾向は？' : 'What are current genre trends?'}')" 
              class="px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800">
              ${isJa ? 'トレンド' : 'Trends'}
            </button>
            <button onclick="sendSettingsChatQuick('${isJa ? 'この設定に矛盾がないか確認して' : 'Check for inconsistencies'}')" 
              class="px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800">
              ${isJa ? 'ファクトチェック' : 'Fact-check'}
            </button>
          ` : `
            <button onclick="sendSettingsChatQuick('${charPrompt}')" 
              class="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              ${charLabel}
            </button>
            <button onclick="sendSettingsChatQuick('${checkPrompt}')" 
              class="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              ${checkLabel}
            </button>
            <button onclick="sendSettingsChatQuick('${ideaPrompt}')" 
              class="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              ${ideaLabel}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// Render settings tab for a Library (Series)
function renderLibrarySettingsTab(allGenres, projectGenres, librarySettings) {
  const childProjects = state.projects.filter(p => p.library_id === state.currentProject?.id);
  const aiChatHtml = renderSettingsAIChat();
  
  // 親資料の設定項目リスト（スタンドアロン版と同じ構成）
  const settingsItems = [
    { id: 'genre', icon: 'fa-tags', label: t('ui.genreSettings') },
    { id: 'storyGoal', icon: 'fa-bullseye', label: t('ui.storyGoal') },
    { id: 'plotStructure', icon: 'fa-sitemap', label: t('ui.plotStructure') },
    { id: 'characters', icon: 'fa-users', label: t('ui.charSettings') },
    { id: 'terminology', icon: 'fa-book', label: t('ui.terminologySettings') },
    { id: 'worldSetting', icon: 'fa-globe', label: t('ui.worldSettings') },
    { id: 'episodes', icon: 'fa-list-ol', label: t('ui.episodeOutline') },
  ];
  
  const currentSection = state.currentSettingsSection || 'genre';
  
  return `
    <div class="h-full flex flex-col">
      <!-- Parent Library Header Banner -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-layer-group text-2xl"></i>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold">${state.currentProject?.title || t('ui.series')}</h2>
            <p class="text-purple-200 text-sm">
              <i class="fas fa-book-open mr-1"></i>${childProjects.length} ${t('ui.episodesSharedSettings')}
            </p>
          </div>
          <span class="px-3 py-1 bg-white/20 rounded-full text-sm">
            <i class="fas fa-crown mr-1"></i>${t('ui.parentMaterials')}
          </span>
        </div>
      </div>
      
      <!-- 項目選択ボタン -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 mb-4">
        <div class="flex flex-wrap gap-2">
          ${settingsItems.map(item => `
            <button onclick="switchSettingsSection('${item.id}')" 
              class="px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentSection === item.id 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
              <i class="fas ${item.icon}"></i>
              <span class="hidden sm:inline">${item.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- メインコンテンツ -->
      <div class="flex-1 flex gap-4 min-h-0">
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col border-2 border-purple-200 dark:border-purple-800">
          ${renderLibrarySectionContent(currentSection, allGenres, projectGenres, librarySettings, childProjects)}
        </div>
        <div class="w-80 xl:w-96 hidden lg:flex flex-col" style="min-height: 500px;">
          ${aiChatHtml}
        </div>
      </div>
      
      <!-- 保存ボタン -->
      <div class="mt-4 flex gap-3">
        <button onclick="toggleSettingsAIChatModal()" 
          class="lg:hidden px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg font-medium flex items-center gap-2">
          <i class="fas fa-robot"></i><span>AI</span>
        </button>
        <button onclick="saveLibrarySettingsFromTab()" 
          class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg font-medium flex items-center justify-center gap-2">
          <i class="fas fa-save"></i>
          ${t('ui.saveSeriesSettings')}
        </button>
      </div>
    </div>
  `;
}

// 親資料の各セクションコンテンツ
function renderLibrarySectionContent(sectionId, allGenres, projectGenres, librarySettings, childProjects) {
  if (sectionId === 'plotStructure') {
    return renderPlotStructureSection('シリーズ全体の骨組み');
  }
  
  const sections = {
    genre: `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <i class="fas fa-tags text-purple-600"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-purple-600">${t('ui.genreSettings')}</h3>
            <p class="text-sm text-gray-500">${t('ui.selectMultiple')}</p>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-lg dark:border-gray-600 bg-purple-50 dark:bg-purple-900/20">
            ${allGenres.map(g => `
              <label class="flex items-center gap-2 cursor-pointer hover:bg-white dark:hover:bg-gray-800 p-2 rounded-lg transition">
                <input type="checkbox" name="project-genre" value="${g.value}" 
                  ${projectGenres.includes(g.value) ? 'checked' : ''}
                  onchange="updateProjectGenre()" class="rounded text-purple-600 focus:ring-purple-500">
                <span class="text-sm">${g.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    storyGoal: `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <i class="fas fa-bullseye text-red-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-red-500">${t('ui.storyGoal')}</h3>
            <p class="text-sm text-gray-500">${t('ui.storyGoalHint')}</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="library-storyGoal"
            placeholder="${t('ui.storyGoalPlaceholder')}"
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
            oninput="updateLibrarySettings('storyGoal', this.value)">${librarySettings.storyGoal || ''}</textarea>
          <button onclick="expandTextarea('library-storyGoal', 'ui.storyGoal')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    characters: `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <i class="fas fa-users text-blue-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-blue-500">${t('ui.charSettings')}</h3>
            <p class="text-sm text-gray-500">${t('ui.charSettingsHint')}</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="library-characters"
            placeholder="【主人公】
名前: 
年齢: 
性格: 

【メインキャラクター】
..."
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateLibrarySettings('shared_characters', this.value)">${librarySettings.shared_characters || ''}</textarea>
          <button onclick="expandTextarea('library-characters', 'ui.sharedCharacters')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-blue-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    terminology: `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <i class="fas fa-book text-green-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-green-500">${t('ui.terminologySettings')}</h3>
            <p class="text-sm text-gray-500">${t('ui.terminologyHint')}</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="library-terminology"
            placeholder="【魔法体系】
・〇〇: 説明

【組織】
・△△: 説明"
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateLibrarySettings('shared_terminology', this.value)">${librarySettings.shared_terminology || ''}</textarea>
          <button onclick="expandTextarea('library-terminology', 'ui.sharedTerminology')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-green-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    worldSetting: `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <i class="fas fa-globe text-yellow-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-yellow-500">${t('ui.worldSettings')}</h3>
            <p class="text-sm text-gray-500">${t('ui.worldSettingsHint')}</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="library-world"
            placeholder="【舞台】
・時代: 
・場所: 

【世界のルール】
..."
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateLibrarySettings('shared_world_setting', this.value)">${librarySettings.shared_world_setting || ''}</textarea>
          <button onclick="expandTextarea('library-world', 'ui.sharedWorldSetting')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-yellow-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    episodes: `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <i class="fas fa-list-ol text-pink-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-pink-500">${t('ui.episodeOutline')} (${childProjects.length})</h3>
            <p class="text-sm text-gray-500">${t('ui.episodeOutlineHint')}</p>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="space-y-2">
            ${childProjects.length > 0 ? childProjects.map((p, i) => `
              <div onclick="selectProject('${p.id}')" class="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer border dark:border-gray-600">
                <span class="w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">${i + 1}</span>
                <span class="flex-1 truncate font-medium">${p.title}</span>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            `).join('') : `
              <div class="text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                <p>${t('ui.noEpisodes')}</p>
              </div>
            `}
          </div>
          <button onclick="openAddChildProjectModal('${state.currentProject?.id}')" 
            class="w-full mt-4 px-4 py-3 border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition">
            <i class="fas fa-plus mr-2"></i>${t('ui.addEpisode')}
          </button>
        </div>
      </div>
    `,
  };
  
  return sections[sectionId] || sections.genre;
}

// Render settings tab for a Child Project (belongs to a library)
function renderChildProjectSettingsTab(allGenres, projectGenres, storyOutline, parentLibrary, parentSettings) {
  const aiChatHtml = renderSettingsAIChat();
  
  // 子資料の設定項目リスト（スタンドアロン版と同じ構成）
  const settingsItems = [
    { id: 'genre', icon: 'fa-tags', label: t('ui.genreSettings') },
    { id: 'storyGoal', icon: 'fa-bullseye', label: t('ui.storyGoal') },
    { id: 'plotStructure', icon: 'fa-sitemap', label: t('ui.plotStructure') },
    { id: 'characters', icon: 'fa-users', label: t('ui.charSettings') },
    { id: 'terminology', icon: 'fa-book', label: t('ui.terminologySettings') },
    { id: 'worldSetting', icon: 'fa-globe', label: t('ui.worldSettings') },
    { id: 'episodes', icon: 'fa-list-ol', label: t('ui.episodeOutline') },
  ];
  
  const currentSection = state.currentSettingsSection || 'storyGoal';
  
  return `
    <div class="h-full flex flex-col">
      <!-- Child Project Header Banner -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white shadow-lg mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-alt text-xl"></i>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold">${state.currentProject?.title || t('sidebar.projects')}</h2>
            <p class="text-indigo-200 text-sm">
              <i class="fas fa-link mr-1"></i>「${parentLibrary.title}」${t('ui.partOfSeries')}
            </p>
          </div>
          <span class="px-3 py-1 bg-white/20 rounded-full text-sm">
            <i class="fas fa-file-alt mr-1"></i>${t('ui.childMaterials')}
          </span>
        </div>
      </div>
      
      <!-- 親資料へのリンク -->
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 mb-4 flex items-center gap-3 border border-purple-200 dark:border-purple-800">
        <i class="fas fa-layer-group text-purple-500"></i>
        <span class="text-sm font-medium text-purple-700 dark:text-purple-300">${t('ui.parentMaterials')}:</span>
        <span class="text-sm text-purple-600 dark:text-purple-400">${parentLibrary.title}</span>
        <button onclick="selectProject('${parentLibrary.id}')" 
          class="ml-auto px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-700 transition flex items-center gap-1">
          <i class="fas fa-external-link-alt"></i>
          ${t('ui.editSeriesSettings')}
        </button>
      </div>
      
      <!-- 項目選択ボタン -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 mb-4">
        <div class="flex flex-wrap gap-2">
          ${settingsItems.map(item => `
            <button onclick="switchSettingsSection('${item.id}')" 
              class="px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentSection === item.id 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
              <i class="fas ${item.icon}"></i>
              <span class="hidden sm:inline">${item.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- メインコンテンツ -->
      <div class="flex-1 flex gap-4 min-h-0">
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          ${renderChildSectionContent(currentSection, allGenres, projectGenres, storyOutline)}
        </div>
        <div class="w-80 xl:w-96 hidden lg:flex flex-col" style="min-height: 500px;">
          ${aiChatHtml}
        </div>
      </div>
      
      <!-- 保存ボタン -->
      <div class="mt-4 flex gap-3">
        <button onclick="toggleSettingsAIChatModal()" 
          class="lg:hidden px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg font-medium flex items-center gap-2">
          <i class="fas fa-robot"></i><span>AI</span>
        </button>
        <button onclick="saveStoryOutline()" 
          class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg font-medium flex items-center justify-center gap-2">
          <i class="fas fa-save"></i>
          ${t('ui.saveEpisodeSettings')}
        </button>
      </div>
    </div>
  `;
}

// 子資料の各セクションコンテンツ（スタンドアロン版と同じ構造）
function renderChildSectionContent(sectionId, allGenres, projectGenres, storyOutline) {
  // スタンドアロン版と同じ関数を使用
  return renderSettingsSectionContent(sectionId, allGenres, projectGenres, storyOutline);
}

// Render settings tab for a Standalone Project (not in a library)
function renderStandaloneSettingsTab(allGenres, projectGenres, storyOutline) {
  const aiChatHtml = renderSettingsAIChat();
  const isMobile = window.innerWidth < 768;
  
  // 設定項目のリスト
  const settingsItems = [
    { id: 'genre', icon: 'fa-tags', color: 'indigo', label: t('ui.genreSettings') },
    { id: 'storyGoal', icon: 'fa-bullseye', color: 'red', label: t('ui.storyGoal') },
    { id: 'plotStructure', icon: 'fa-sitemap', color: 'orange', label: t('ui.plotStructure') },
    { id: 'characters', icon: 'fa-users', color: 'blue', label: t('ui.charSettings') },
    { id: 'terminology', icon: 'fa-book', color: 'green', label: t('ui.terminologySettings') },
    { id: 'worldSetting', icon: 'fa-globe', color: 'yellow', label: t('ui.worldSettings') },
    { id: 'episodes', icon: 'fa-list-ol', color: 'purple', label: t('ui.episodeOutline') },
  ];
  
  // 現在選択中の設定項目（デフォルトはジャンル）
  const currentSettingsSection = state.currentSettingsSection || 'genre';
  
  // モバイル: アコーディオンUI
  if (isMobile) {
    return `
      <div class="h-full flex flex-col mobile-settings-container">
        <!-- アコーディオン形式の設定リスト -->
        <div class="flex-1 overflow-y-auto space-y-2 pb-20 mobile-accordion">
          ${settingsItems.map(item => `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <!-- アコーディオンヘッダー -->
              <button onclick="toggleMobileAccordion('${item.id}')" 
                class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center">
                    <i class="fas ${item.icon} text-${item.color}-600 dark:text-${item.color}-400"></i>
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white">${item.label}</span>
                </div>
                <i id="accordion-icon-${item.id}" class="fas fa-chevron-down text-gray-400 transition-transform duration-300" 
                   style="${state.mobileAccordionSections[item.id] ? 'transform: rotate(180deg);' : ''}"></i>
              </button>
              <!-- アコーディオンコンテンツ -->
              <div id="accordion-content-${item.id}" 
                   class="${state.mobileAccordionSections[item.id] ? '' : 'hidden'} border-t border-gray-100 dark:border-gray-700 p-4 settings-content">
                ${renderSettingsSectionContent(item.id, allGenres, projectGenres, storyOutline)}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- 保存ボタン（固定フッター） -->
        <div class="fixed bottom-16 left-0 right-0 px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-30">
          <div class="flex gap-2">
            <button onclick="toggleSettingsAIChatModal()" 
              class="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg font-medium flex items-center justify-center gap-2">
              <i class="fas fa-robot"></i>
              <span>AI</span>
            </button>
            <button onclick="saveStoryOutline()" 
              class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg font-medium flex items-center justify-center gap-2">
              <i class="fas fa-save"></i>
              ${t('ui.saveSettings')}
            </button>
          </div>
        </div>
        
        <!-- モバイル用AIチャットモーダル -->
        <div id="settings-ai-chat-modal" class="fixed inset-0 bg-black/50 z-50 hidden">
          <div class="absolute inset-4 bottom-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div class="p-3 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
              <h3 class="font-semibold flex items-center gap-2 text-sm">
                <i class="fas fa-robot"></i>
                ${t('ui.settingsAI')}
              </h3>
              <button onclick="toggleSettingsAIChatModal()" class="p-1 hover:bg-white/20 rounded-lg">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div id="settings-chat-messages-mobile" class="flex-1 overflow-y-auto p-3 space-y-2">
            </div>
            <div class="p-3 border-t dark:border-gray-700">
              <div class="flex gap-2">
                <input type="text" id="settings-chat-input-mobile" 
                  placeholder="${t('ui.settingsAIPlaceholder')}"
                  class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                  onkeypress="if(event.key === 'Enter') sendSettingsChatMobile()">
                <button onclick="sendSettingsChatMobile()" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // PC: 従来のタブUI
  return `
    <div class="h-full flex flex-col">
      <!-- 上部: 項目選択ボタン -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 mb-4">
        <div class="flex flex-wrap gap-2">
          ${settingsItems.map(item => `
            <button onclick="switchSettingsSection('${item.id}')" 
              class="px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentSettingsSection === item.id 
                ? `bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-300 ring-2 ring-${item.color}-500` 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
              <i class="fas ${item.icon}"></i>
              <span class="hidden sm:inline">${item.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- メインコンテンツ -->
      <div class="flex-1 flex gap-4 min-h-0">
        <!-- 左: 編集エリア -->
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          ${renderSettingsSectionContent(currentSettingsSection, allGenres, projectGenres, storyOutline)}
        </div>
        
        <!-- 右: AIチャット (レスポンシブ縦長デザイン) -->
        <div class="w-80 xl:w-96 hidden lg:flex flex-col" style="min-height: 500px;">
          ${aiChatHtml}
        </div>
      </div>
      
      <!-- 保存ボタン -->
      <div class="mt-4 flex gap-3">
        <!-- モバイル用AIチャットボタン -->
        <button onclick="toggleSettingsAIChatModal()" 
          class="lg:hidden px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 shadow-lg font-medium flex items-center justify-center gap-2">
          <i class="fas fa-robot"></i>
          <span>AI</span>
        </button>
        <button onclick="saveStoryOutline()" 
          class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg font-medium flex items-center justify-center gap-2">
          <i class="fas fa-save"></i>
          ${t('ui.saveSettings')}
        </button>
      </div>
      
      <!-- モバイル用AIチャットモーダル -->
      <div id="settings-ai-chat-modal" class="fixed inset-0 bg-black/50 z-50 hidden lg:hidden">
        <div class="absolute inset-4 bottom-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div class="p-3 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
            <h3 class="font-semibold flex items-center gap-2 text-sm">
              <i class="fas fa-robot"></i>
              ${t('ui.settingsAI')}
            </h3>
            <button onclick="toggleSettingsAIChatModal()" class="p-1 hover:bg-white/20 rounded-lg">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="settings-chat-messages-mobile" class="flex-1 overflow-y-auto p-3 space-y-2">
          </div>
          <div class="p-3 border-t dark:border-gray-700">
            <div class="flex gap-2">
              <input type="text" id="settings-chat-input-mobile" 
                placeholder="${t('ui.settingsAIPlaceholder')}"
                class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                onkeypress="if(event.key === 'Enter') sendSettingsChatMobile()">
              <button onclick="sendSettingsChatMobile()" 
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 設定セクションの切り替え
window.switchSettingsSection = (sectionId) => {
  state.currentSettingsSection = sectionId;
  render();
};

// プロットテンプレートの切り替え
window.setPlotTemplate = (template) => {
  if (!state.plot) state.plot = {};
  state.plot.template = template;
  render();
};

// プロット構成の更新
window.updatePlotStructure = (key, value) => {
  if (!state.plot) state.plot = {};
  let structure = {};
  try { structure = JSON.parse(state.plot.structure || '{}'); } catch (e) {}
  structure[key] = value;
  state.plot.structure = JSON.stringify(structure);
};

// モバイル用設定AIチャットモーダルのトグル
window.toggleSettingsAIChatModal = () => {
  const modal = document.getElementById('settings-ai-chat-modal');
  if (modal) {
    modal.classList.toggle('hidden');
    // モーダル開いた時にメッセージをコピー
    if (!modal.classList.contains('hidden')) {
      syncSettingsChatToMobile();
    }
  }
};

// デスクトップのチャットメッセージをモバイルに同期
function syncSettingsChatToMobile() {
  const desktopMessages = document.getElementById('settings-chat-messages');
  const mobileMessages = document.getElementById('settings-chat-messages-mobile');
  if (desktopMessages && mobileMessages) {
    mobileMessages.innerHTML = desktopMessages.innerHTML;
    mobileMessages.scrollTop = mobileMessages.scrollHeight;
  }
}

// モバイル用設定チャット送信
window.sendSettingsChatMobile = async () => {
  const input = document.getElementById('settings-chat-input-mobile');
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  input.value = '';
  
  // デスクトップの入力欄に値を設定して送信
  const desktopInput = document.getElementById('settings-chat-input');
  if (desktopInput) {
    desktopInput.value = message;
  }
  
  // 送信処理を実行
  await sendSettingsChat();
  
  // モーダルのメッセージを更新
  setTimeout(() => syncSettingsChatToMobile(), 100);
};

// 各セクションのコンテンツをレンダリング
function renderSettingsSectionContent(sectionId, allGenres, projectGenres, storyOutline) {
  const sections = {
    genre: () => `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <i class="fas fa-tags text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-indigo-600 dark:text-indigo-400">${t('ui.genreSettings')}</h3>
            <p class="text-sm text-gray-500">${t('ui.selectMultiple')}</p>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
            ${allGenres.map(g => `
              <label class="flex items-center gap-2 cursor-pointer hover:bg-white dark:hover:bg-gray-800 p-2 rounded-lg transition">
                <input type="checkbox" name="project-genre" value="${g.value}" 
                  ${projectGenres.includes(g.value) ? 'checked' : ''}
                  onchange="updateProjectGenre()" class="rounded text-indigo-600 focus:ring-indigo-500">
                <span class="text-sm">${g.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    storyGoal: () => `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <i class="fas fa-bullseye text-red-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-red-500">${t('ui.storyGoal')}</h3>
            <p class="text-sm text-gray-500">テーマ、メッセージ、結末のイメージなど</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="settings-storyGoal"
            placeholder="この物語で伝えたいこと、読者に感じてほしいこと、理想の結末...

例:
・テーマ: 友情と成長
・メッセージ: 困難を乗り越える勇気
・結末: 主人公が仲間と共に目標を達成する"
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
            oninput="updateStoryOutline('storyGoal', this.value)">${storyOutline.storyGoal || ''}</textarea>
          <button onclick="expandTextarea('settings-storyGoal', 'ui.storyGoal')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm" title="${t("ui.expand")}">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    plotStructure: () => {
      let structure = {};
      try { structure = JSON.parse(state.plot?.structure || '{}'); } catch (e) {}
      const template = state.plot?.template || 'kishotenketsu';
      
      return `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <i class="fas fa-sitemap text-orange-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-orange-500">${t('ui.plotStructure')}</h3>
            <p class="text-sm text-gray-500">物語の骨組みを構成する</p>
          </div>
        </div>
        
        <!-- テンプレート選択 -->
        <div class="flex gap-2 mb-4">
          <button onclick="setPlotTemplate('kishotenketsu')" 
            class="px-3 py-1.5 text-sm rounded-lg transition ${template === 'kishotenketsu' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}">
            ${t('plot.kishotenketsu')}
          </button>
          <button onclick="setPlotTemplate('three_act')" 
            class="px-3 py-1.5 text-sm rounded-lg transition ${template === 'three_act' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}">
            ${t('plot.threeAct')}
          </button>
        </div>
        
        <!-- プロット構成入力 -->
        <div class="flex-1 overflow-y-auto space-y-3">
          ${template === 'kishotenketsu' ? `
            <div class="space-y-3">
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-play mr-1"></i>${t('plot.ki')}（起）
                </label>
                <textarea id="plot-ki" rows="3" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="物語の始まり、登場人物や世界観の紹介"
                  oninput="updatePlotStructure('ki', this.value)">${structure.ki || ''}</textarea>
              </div>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-arrow-right mr-1"></i>${t('plot.sho')}（承）
                </label>
                <textarea id="plot-sho" rows="3" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="物語の展開、問題や困難の発生"
                  oninput="updatePlotStructure('sho', this.value)">${structure.sho || ''}</textarea>
              </div>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-bolt mr-1"></i>${t('plot.ten')}（転）
                </label>
                <textarea id="plot-ten" rows="3" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="クライマックス、予想外の展開"
                  oninput="updatePlotStructure('ten', this.value)">${structure.ten || ''}</textarea>
              </div>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-flag-checkered mr-1"></i>${t('plot.ketsu')}（結）
                </label>
                <textarea id="plot-ketsu" rows="3" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="物語の結末、解決と余韻"
                  oninput="updatePlotStructure('ketsu', this.value)">${structure.ketsu || ''}</textarea>
              </div>
            </div>
          ` : `
            <div class="space-y-3">
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-door-open mr-1"></i>${t('plot.act1')}
                </label>
                <textarea id="plot-act1" rows="4" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="設定、登場人物紹介、日常世界、きっかけとなる事件"
                  oninput="updatePlotStructure('act1', this.value)">${structure.act1 || ''}</textarea>
              </div>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-mountain mr-1"></i>${t('plot.act2')}
                </label>
                <textarea id="plot-act2" rows="4" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="対立と葛藤、試練、ミッドポイント、最大の危機"
                  oninput="updatePlotStructure('act2', this.value)">${structure.act2 || ''}</textarea>
              </div>
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  <i class="fas fa-trophy mr-1"></i>${t('plot.act3')}
                </label>
                <textarea id="plot-act3" rows="4" 
                  class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                  placeholder="クライマックス、解決、新たな日常"
                  oninput="updatePlotStructure('act3', this.value)">${structure.act3 || ''}</textarea>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
    },
    characters: () => `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <i class="fas fa-users text-blue-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-blue-500">${t('ui.charSettings')}</h3>
            <p class="text-sm text-gray-500">登場人物の名前、性格、役割など</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="settings-characters"
            placeholder="【主人公】
名前: 
年齢: 
性格: 
目標: 
特徴: 

【ヒロイン/サブキャラ】
名前: 
関係性: 
役割: 

【敵/ライバル】
名前: 
動機: "
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateStoryOutline('characters', this.value)">${storyOutline.characters || ''}</textarea>
          <button onclick="expandTextarea('settings-characters', 'ui.charSettings')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-blue-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm" title="${t("ui.expand")}">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    terminology: () => `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <i class="fas fa-book text-green-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-green-500">${t('ui.terminologySettings')}</h3>
            <p class="text-sm text-gray-500">魔法、技術、組織、独自の概念など</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="settings-terminology"
            placeholder="【魔法/スキル】
・ファイアボール: 炎の球を放つ初級魔法
・ヒーリング: 傷を癒す回復魔法

【組織/勢力】
・騎士団: 王国を守る精鋭部隊
・魔導士ギルド: 魔法使いの組合

【独自概念】
・マナ: 魔力の源
・聖獣: 守護者として存在する神聖な生物"
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateStoryOutline('terminology', this.value)">${storyOutline.terminology || ''}</textarea>
          <button onclick="expandTextarea('settings-terminology', 'ui.terminologySettings')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-green-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm" title="${t("ui.expand")}">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    worldSetting: () => `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <i class="fas fa-globe text-yellow-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-yellow-500">${t('ui.worldSettings')}</h3>
            <p class="text-sm text-gray-500">舞台、時代、ルール、雰囲気など</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="settings-worldSetting"
            placeholder="【舞台】
・時代: 中世ファンタジー / 近未来 / 現代
・場所: 王国アルディア / 東京 / 異世界

【世界のルール】
・魔法が存在する
・科学技術のレベル
・政治体制

【雰囲気/トーン】
・明るい冒険活劇
・ダークファンタジー
・日常系コメディ"
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateStoryOutline('worldSetting', this.value)">${storyOutline.worldSetting || ''}</textarea>
          <button onclick="expandTextarea('settings-worldSetting', 'ui.worldSettings')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-yellow-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm" title="${t("ui.expand")}">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `,
    episodes: () => `
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <i class="fas fa-list-ol text-purple-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-purple-500">${t('ui.episodeOutline')}</h3>
            <p class="text-sm text-gray-500">章・話ごとのあらすじ</p>
          </div>
        </div>
        <div class="flex-1 relative">
          <textarea id="settings-episodes"
            placeholder="第1話: プロローグ
- 主人公の日常を描く
- 物語の伏線を張る

第2話: 事件発生
- 異変の始まり
- 主人公が巻き込まれる

第3話: 旅立ち
- 冒険への決意
- 仲間との出会い

第4話: 試練
- 最初の困難
- 成長のきっかけ"
            class="w-full h-full px-4 py-3 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none font-mono"
            oninput="updateStoryOutline('episodes', this.value)">${storyOutline.episodes || ''}</textarea>
          <button onclick="expandTextarea('settings-episodes', 'ui.episodeOutline')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-purple-500 bg-white dark:bg-gray-600 rounded-lg shadow-sm" title="${t("ui.expand")}">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    `
  };
  
  return sections[sectionId] ? sections[sectionId]() : sections.genre();
}

function renderIdeasTab() {
  return `
    <div class="h-full flex gap-4">
      <!-- Main Document Area (expanded) -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
          <!-- Document Header/Toolbar -->
          <div class="flex flex-wrap items-center gap-2 p-3 border-b dark:border-gray-700">
            <h3 class="font-semibold flex items-center gap-2">
              <i class="fas fa-lightbulb text-yellow-500"></i>
              ネタ・プロットメモ
            </h3>
            
            <!-- Style Selector -->
            <div class="relative ml-2">
              <button onclick="toggleIdeasStyleMenu()" id="ideas-style-menu-btn" 
                class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2">
                <i class="fas fa-paragraph text-indigo-500"></i>
                <span id="ideas-current-style">標準</span>
                <i class="fas fa-chevron-down text-xs"></i>
              </button>
              <div id="ideas-style-menu" class="hidden absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-20 w-48 border border-gray-200 dark:border-gray-700">
                <button onclick="applyIdeasStyle('normal')" class="block w-full px-4 py-2 text-sm text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block text-center text-gray-400"><i class="fas fa-font"></i></span>
                  ${t('ui.standardText')}
                </button>
                <button onclick="applyIdeasStyle('title')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block h-5 text-xs font-bold text-indigo-600 bg-indigo-100 rounded text-center">H</span>
                  <span class="text-lg font-bold ml-2">${t('ui.title')}</span>
                </button>
                <button onclick="applyIdeasStyle('h1')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block h-5 text-xs font-bold text-indigo-500 bg-indigo-50 rounded text-center">H1</span>
                  <span class="text-base font-semibold ml-2">${t('ui.heading1')}</span>
                </button>
                <button onclick="applyIdeasStyle('h2')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block h-5 text-xs font-bold text-indigo-400 bg-indigo-50/50 rounded text-center">H2</span>
                  <span class="text-sm font-medium ml-2">${t('ui.heading2')}</span>
                </button>
                <button onclick="applyIdeasStyle('h3')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block h-5 text-xs font-bold text-gray-500 bg-gray-100 rounded text-center">H3</span>
                  <span class="text-sm ml-2">${t('ui.heading3')}</span>
                </button>
              </div>
            </div>
            
            <!-- Outline Toggle -->
            <button onclick="toggleIdeasOutline()" 
              class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
              title="${t("ui.showOutline")}">
              <i class="fas fa-list-ul mr-1"></i>
              ${t('ui.outline')}
            </button>
            
            <!-- Link to Settings Tab -->
            <button onclick="switchTab('settings_materials')" 
              class="px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50" 
              title="${t("ui.editSettings")}">
              <i class="fas fa-cog mr-1"></i>
              ${t('ui.editSettings')}
            </button>
            
            <div class="flex-1"></div>
            <span class="text-xs text-gray-500" id="ideas-doc-chars">
              ${(state.ideasDocument || '').length} ${t('ui.characters')}
            </span>
            <button onclick="saveIdeasDocument()" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
              <i class="fas fa-save mr-1"></i>${t('common.save')}
            </button>
          </div>
          
          <!-- Document Area with Outline -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Ideas Outline Panel -->
            <div id="ideas-outline-panel" class="${state.showIdeasOutline ? '' : 'hidden'} w-56 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50">
              <h4 class="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <i class="fas fa-list-ul"></i>${t('ui.outline')}
              </h4>
              <div id="ideas-outline-content" class="space-y-1 text-sm">
                ${renderIdeasOutline()}
              </div>
            </div>
            
            <!-- Document Editor -->
            <div class="flex-1 relative">
              <textarea id="ideas-document" 
                class="w-full h-full p-4 text-sm resize-none focus:outline-none dark:bg-gray-800 dark:text-gray-100"
                placeholder="ここにネタやプロットのアイデアを自由に書き込んでください...

【使い方のヒント】
・右側のAIチャットで相談しながらアイデアを膨らませましょう
・「設定・資料」タブで世界観やキャラクターを設定すると、AIがより良い提案をします
・プロット・ライティング・分析タブでも設定が反映されます"
                oninput="updateIdeasDocumentCount(this.value); updateIdeasOutline();">${state.ideasDocument || ''}</textarea>
              <button onclick="expandTextarea('ideas-document', 'tab.ideas')" 
                class="absolute bottom-12 right-3 p-2 text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                title="${t("ui.expand")}">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          
          <!-- 採用ボタン -->
          <div class="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button onclick="adoptIdeasDocument()" 
              class="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm flex items-center justify-center gap-2">
              <i class="fas fa-check-circle"></i>
              ${t('ui.adoptIdea')}
            </button>
          </div>
        </div>
        
        <!-- Quick Ideas Section (expanded by default in new layout) -->
        <div class="mt-3">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <button onclick="toggleQuickIdeas()" class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <span class="flex items-center gap-2 font-semibold">
                <i class="fas fa-magic text-purple-500"></i>
                <span>${t('ui.quickIdeas')}</span>
                <span class="text-xs text-gray-500 font-normal">(${state.ideas?.length || 0}件)</span>
              </span>
              <i class="fas fa-chevron-${state.showQuickIdeas ? 'up' : 'down'} text-gray-400"></i>
            </button>
            
            ${state.showQuickIdeas ? `
              <div class="p-4">
                <div class="flex gap-2 mb-3">
                  <input type="text" id="quick-idea-keywords" placeholder="キーワード（任意）"
                    class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                  <select id="quick-idea-count" class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    <option value="3">3件</option>
                    <option value="5" selected>5件</option>
                    <option value="10">10件</option>
                  </select>
                  <button onclick="handleGenerateIdeas()" 
                    class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-sm"
                    ${state.aiGenerating ? 'disabled' : ''}>
                    ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-magic mr-1"></i>生成'}
                  </button>
                </div>
                
                ${state.ideas?.length > 0 ? `
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    ${state.ideas.map(idea => `
                      <div class="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm ${idea.adopted ? 'ring-2 ring-green-500' : ''} group hover:shadow-md transition-shadow">
                        <button onclick="deleteIdea('${idea.id}', '${(idea.title || '').replace(/'/g, "\\'")}')"
                          class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                          <i class="fas fa-times"></i>
                        </button>
                        <div class="font-medium mb-1 pr-6">${idea.title}</div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">${idea.content || ''}</p>
                        <div class="flex justify-between items-center mt-2">
                          <span class="text-xs text-gray-500">${idea.genre || ''}</span>
                          ${idea.adopted ? 
                            `<button onclick="unadoptIdea('${idea.id}')" class="text-xs text-red-500 hover:underline">取消</button>` :
                            `<button onclick="adoptIdea('${idea.id}')" class="text-xs text-indigo-600 hover:underline">採用</button>`
                          }
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <p class="text-center text-gray-500 text-sm py-6">
                    <i class="fas fa-lightbulb text-2xl mb-2 text-yellow-400"></i><br>
                    ${t('ui.generateIdeas')}
                  </p>
                `}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Right: AI Chat Panel -->
      <div class="w-80 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-3 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h3 class="font-semibold flex items-center gap-2">
            <i class="fas fa-robot"></i>
            ネタ考案AIアシスタント
          </h3>
          <p class="text-xs text-indigo-100 mt-1">アイデアについて相談できます</p>
        </div>
        
        <!-- Chat Messages -->
        <div id="ideas-chat-messages" class="flex-1 overflow-y-auto p-3 space-y-3">
          ${(state.ideasChatMessages || []).length > 0 ? 
            state.ideasChatMessages.map(msg => `
              <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[85%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }">
                  ${msg.content.replace(/\n/g, '<br>')}
                </div>
              </div>
            `).join('') : `
              <div class="text-center text-gray-500 text-sm py-8">
                <i class="fas fa-comments text-3xl mb-3 text-indigo-300"></i>
                <p class="font-medium">AIに質問してみましょう！</p>
                <p class="text-xs mt-2 text-gray-400">例: 「ファンタジー世界の魔法システムを考えて」</p>
              </div>
            `
          }
        </div>
        
        <!-- Chat Input -->
        <div class="p-3 border-t dark:border-gray-700">
          <div class="flex gap-2">
            <input type="text" id="ideas-chat-input" 
              placeholder="アイデアについて相談..."
              class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
              onkeypress="if(event.key === 'Enter') sendIdeasChat()">
            <button onclick="sendIdeasChat()" 
              class="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-paper-plane"></i>'}
            </button>
          </div>
          
          <!-- Quick prompts -->
          <div class="flex flex-wrap gap-1 mt-2">
            <button onclick="sendIdeasChatQuick('キャラクターのアイデアをください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              キャラ案
            </button>
            <button onclick="sendIdeasChatQuick('世界観の設定を提案してください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              世界観
            </button>
            <button onclick="sendIdeasChatQuick('プロットの展開を考えてください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              展開
            </button>
            <button onclick="sendIdeasChatQuick('この物語の山場を提案してください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              山場
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// 構想タブ（ネタ考案 + プロット統合）
// ============================================
function renderConceptionTab() {
  let structure = {};
  try { structure = JSON.parse(state.plot?.structure || '{}'); } catch (e) {}
  const template = state.plot?.template || 'kishotenketsu';
  const adoptedIdeas = (state.ideas || []).filter(idea => idea.adopted);
  
  // サブタブの状態管理
  const conceptionSubTab = state.conceptionSubTab || 'ideas';
  
  return `
    <div class="h-full flex flex-col">
      <!-- サブタブ切り替え -->
      <div class="flex gap-2 mb-4 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
        <button onclick="switchConceptionSubTab('ideas')" 
          class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${conceptionSubTab === 'ideas' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
          <i class="fas fa-lightbulb mr-2"></i>ネタ・メモ
        </button>
        <button onclick="switchConceptionSubTab('plot')" 
          class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${conceptionSubTab === 'plot' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
          <i class="fas fa-sitemap mr-2"></i>プロット構成
        </button>
      </div>
      
      <!-- サブタブコンテンツ -->
      <div class="flex-1 overflow-hidden">
        ${conceptionSubTab === 'ideas' ? renderConceptionIdeasContent() : renderConceptionPlotContent(template, structure, adoptedIdeas)}
      </div>
    </div>
  `;
}

// 構想タブ - ネタ・メモセクション
function renderConceptionIdeasContent() {
  return `
    <div class="h-full flex gap-4">
      <!-- メインドキュメントエリア -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
          <!-- ツールバー -->
          <div class="flex flex-wrap items-center gap-2 p-3 border-b dark:border-gray-700">
            <h3 class="font-semibold flex items-center gap-2">
              <i class="fas fa-lightbulb text-yellow-500"></i>
              ネタ・プロットメモ
            </h3>
            
            <!-- スタイルセレクター -->
            <div class="relative ml-2">
              <button onclick="toggleIdeasStyleMenu()" id="ideas-style-menu-btn" 
                class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2">
                <i class="fas fa-paragraph text-indigo-500"></i>
                <span id="ideas-current-style">標準</span>
                <i class="fas fa-chevron-down text-xs"></i>
              </button>
              <div id="ideas-style-menu" class="hidden absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-20 w-48 border border-gray-200 dark:border-gray-700">
                <button onclick="applyIdeasStyle('normal')" class="block w-full px-4 py-2 text-sm text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block text-center text-gray-400"><i class="fas fa-font"></i></span>
                  ${t('ui.standardText')}
                </button>
                <button onclick="applyIdeasStyle('title')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block h-5 text-xs font-bold text-indigo-600 bg-indigo-100 rounded text-center">H</span>
                  <span class="text-lg font-bold ml-2">${t('ui.title')}</span>
                </button>
                <button onclick="applyIdeasStyle('h1')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span class="w-6 inline-block h-5 text-xs font-bold text-indigo-500 bg-indigo-50 rounded text-center">H1</span>
                  <span class="text-base font-semibold ml-2">${t('ui.heading1')}</span>
                </button>
              </div>
            </div>
            
            <!-- アウトラインボタン -->
            <button onclick="toggleIdeasOutline()" 
              class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
              title="${t("ui.showOutline")}">
              <i class="fas fa-list-ul mr-1"></i>
              ${t('ui.outline')}
            </button>
            
            <div class="flex-1"></div>
            <span class="text-xs text-gray-500" id="ideas-doc-chars">
              ${(state.ideasDocument || '').length} ${t('ui.characters')}
            </span>
            <button onclick="saveIdeasDocument()" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
              <i class="fas fa-save mr-1"></i>${t('common.save')}
            </button>
          </div>
          
          <!-- ドキュメントエリア -->
          <div class="flex-1 flex overflow-hidden">
            <!-- アウトラインパネル -->
            <div id="ideas-outline-panel" class="${state.showIdeasOutline ? '' : 'hidden'} w-56 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900/50">
              <h4 class="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <i class="fas fa-list-ul"></i>${t('ui.outline')}
              </h4>
              <div id="ideas-outline-content" class="space-y-1 text-sm">
                ${renderIdeasOutline()}
              </div>
            </div>
            
            <!-- エディタ -->
            <div class="flex-1 relative">
              <textarea id="ideas-document" 
                class="w-full h-full p-4 text-sm resize-none focus:outline-none dark:bg-gray-800 dark:text-gray-100"
                placeholder="ここにネタやプロットのアイデアを自由に書き込んでください...

【使い方のヒント】
・右側のAIチャットで相談しながらアイデアを膨らませましょう
・「設定」タブで世界観やキャラクターを設定すると、AIがより良い提案をします
・「プロット構成」サブタブで物語の骨格を組み立てましょう"
                oninput="updateIdeasDocumentCount(this.value); updateIdeasOutline();">${state.ideasDocument || ''}</textarea>
              <button onclick="expandTextarea('ideas-document', 'tab.ideas')" 
                class="absolute bottom-12 right-3 p-2 text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                title="${t("ui.expand")}">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          
          <!-- プロット構成へ移動ボタン -->
          <div class="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button onclick="switchConceptionSubTab('plot')" 
              class="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 text-sm flex items-center justify-center gap-2">
              <i class="fas fa-arrow-right"></i>
              プロット構成へ進む
            </button>
          </div>
        </div>
        
        <!-- クイックアイデア生成 -->
        <div class="mt-3">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <button onclick="toggleQuickIdeas()" class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <span class="flex items-center gap-2 font-semibold">
                <i class="fas fa-magic text-purple-500"></i>
                <span>${t('ui.quickIdeas')}</span>
                <span class="text-xs text-gray-500 font-normal">(${state.ideas?.length || 0}件)</span>
              </span>
              <i class="fas fa-chevron-${state.showQuickIdeas ? 'up' : 'down'} text-gray-400"></i>
            </button>
            
            ${state.showQuickIdeas ? `
              <div class="p-4">
                <div class="flex gap-2 mb-3">
                  <input type="text" id="quick-idea-keywords" placeholder="キーワード（任意）"
                    class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                  <select id="quick-idea-count" class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    <option value="3">3件</option>
                    <option value="5" selected>5件</option>
                    <option value="10">10件</option>
                  </select>
                  <button onclick="handleGenerateIdeas()" 
                    class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-sm"
                    ${state.aiGenerating ? 'disabled' : ''}>
                    ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-magic mr-1"></i>生成'}
                  </button>
                </div>
                
                ${state.ideas?.length > 0 ? `
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    ${state.ideas.map(idea => `
                      <div class="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm ${idea.adopted ? 'ring-2 ring-green-500' : ''} group hover:shadow-md transition-shadow">
                        <div class="font-medium mb-1 pr-6">${idea.title}</div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">${idea.content || ''}</p>
                        <div class="flex justify-between items-center mt-2">
                          <span class="text-xs text-gray-500">${idea.genre || ''}</span>
                          ${idea.adopted ? 
                            `<span class="text-xs text-green-500"><i class="fas fa-check mr-1"></i>採用済</span>` :
                            `<button onclick="adoptIdea('${idea.id}')" class="text-xs text-indigo-600 hover:underline">採用</button>`
                          }
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <p class="text-center text-gray-500 text-sm py-4">
                    <i class="fas fa-lightbulb text-2xl mb-2 text-yellow-400"></i><br>
                    ${t('ui.generateIdeas')}
                  </p>
                `}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- AIチャットパネル -->
      <div class="w-72 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-3 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h3 class="font-semibold flex items-center gap-2">
            <i class="fas fa-robot"></i>
            構想AIアシスタント
          </h3>
          <p class="text-xs text-indigo-100 mt-1">アイデアについて相談できます</p>
        </div>
        
        <!-- チャットメッセージ -->
        <div id="ideas-chat-messages" class="flex-1 overflow-y-auto p-3 space-y-3 max-h-[400px]">
          ${(state.ideasChatMessages || []).length > 0 ? 
            state.ideasChatMessages.map(msg => `
              <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[85%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }">
                  ${msg.content.replace(/\\n/g, '<br>')}
                </div>
              </div>
            `).join('') : `
              <div class="text-center text-gray-500 text-sm py-6">
                <i class="fas fa-comments text-2xl mb-2 text-indigo-300"></i>
                <p class="font-medium">AIに質問してみましょう！</p>
                <p class="text-xs mt-1 text-gray-400">例: 「ファンタジー世界の魔法システムを考えて」</p>
              </div>
            `
          }
        </div>
        
        <!-- チャット入力 -->
        <div class="p-3 border-t dark:border-gray-700">
          <div class="flex gap-2">
            <input type="text" id="ideas-chat-input" 
              placeholder="アイデアについて相談..."
              class="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
              onkeypress="if(event.key === 'Enter') sendIdeasChat()">
            <button onclick="sendIdeasChat()" 
              class="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-paper-plane"></i>'}
            </button>
          </div>
          
          <!-- クイックプロンプト -->
          <div class="flex flex-wrap gap-1 mt-2">
            <button onclick="sendIdeasChatQuick('キャラクターのアイデアをください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              キャラ案
            </button>
            <button onclick="sendIdeasChatQuick('プロットの展開を考えてください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              展開
            </button>
            <button onclick="sendIdeasChatQuick('この物語の山場を提案してください')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              山場
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 構想タブ - プロット構成セクション
function renderConceptionPlotContent(template, structure, adoptedIdeas) {
  return `
    <div class="h-full flex gap-4">
      <!-- メインプロットエリア -->
      <div class="flex-1 overflow-y-auto space-y-4">
        <!-- 採用アイデア表示 -->
        ${adoptedIdeas.length > 0 ? `
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm border border-green-200 dark:border-green-800 overflow-hidden">
            <div class="flex items-center justify-between p-3 border-b border-green-200 dark:border-green-700 bg-white/50 dark:bg-gray-800/50">
              <h3 class="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                <i class="fas fa-lightbulb"></i>${t('ui.adoptedIdeas')}
                <span class="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                  ${adoptedIdeas.length}件
                </span>
              </h3>
              <button onclick="switchConceptionSubTab('ideas')" 
                class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                <i class="fas fa-edit"></i>編集
              </button>
            </div>
            <div class="p-3 max-h-32 overflow-y-auto">
              <div class="flex flex-wrap gap-2">
                ${adoptedIdeas.map(idea => `
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm border border-green-200 dark:border-green-700">
                    <i class="fas fa-check-circle text-green-500 text-xs"></i>
                    ${idea.title}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        ` : `
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
            <p class="text-gray-500 text-sm">
              <i class="fas fa-lightbulb mr-1"></i>
              「ネタ・メモ」でアイデアを採用すると、ここに表示されます
            </p>
            <button onclick="switchConceptionSubTab('ideas')" 
              class="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              ネタ・メモへ
            </button>
          </div>
        `}
        
        <!-- テンプレート選択 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-th-large text-indigo-500"></i>
            プロットテンプレート
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            ${[
              { id: 'kishotenketsu', name: '起承転結', icon: 'fa-stream' },
              { id: 'three_act', name: '三幕構成', icon: 'fa-theater-masks' },
              { id: 'blake_snyder', name: 'ブレイク・スナイダー', icon: 'fa-film' },
              { id: 'free', name: 'フリー', icon: 'fa-edit' }
            ].map(t => `
              <button onclick="setPlotTemplate('${t.id}')" 
                class="p-3 rounded-lg border-2 transition ${template === t.id 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}">
                <i class="fas ${t.icon} text-lg ${template === t.id ? 'text-indigo-600' : 'text-gray-400'}"></i>
                <p class="text-sm mt-1 ${template === t.id ? 'font-medium text-indigo-600' : ''}">${t.name}</p>
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- プロット構造エディタ -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold flex items-center gap-2">
              <i class="fas fa-sitemap text-purple-500"></i>
              プロット構成
            </h3>
            <button onclick="savePlot()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
              <i class="fas fa-save mr-1"></i>${t('common.save')}
            </button>
          </div>
          ${renderPlotStructure(template, structure)}
        </div>
        
        <!-- AI生成ボタン -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
          <button onclick="handleGeneratePlot()" 
            class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
            ${state.aiGenerating ? 'disabled' : ''}>
            ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-magic mr-2"></i>'}
            AIでプロットを生成
          </button>
          <p class="text-xs text-center text-gray-500 mt-2">
            設定やネタを基にAIがプロット案を提案します
          </p>
        </div>
      </div>
      
      <!-- 執筆へ進むパネル -->
      <div class="w-64 flex flex-col">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex-1">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-pen-fancy text-indigo-500"></i>
            次のステップ
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            プロットの準備ができたら、執筆を始めましょう。
          </p>
          <button onclick="switchTab('writing')" 
            class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center justify-center gap-2">
            <i class="fas fa-arrow-right"></i>
            執筆タブへ
          </button>
        </div>
        
        <!-- 進捗サマリー -->
        <div class="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h4 class="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">構想の進捗</h4>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <i class="fas ${state.ideasDocument ? 'fa-check-circle text-green-500' : 'fa-circle text-gray-300'}"></i>
              <span class="text-sm">ネタ・メモ</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas ${adoptedIdeas.length > 0 ? 'fa-check-circle text-green-500' : 'fa-circle text-gray-300'}"></i>
              <span class="text-sm">アイデア採用 (${adoptedIdeas.length}件)</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas ${Object.values(structure).some(v => v) ? 'fa-check-circle text-green-500' : 'fa-circle text-gray-300'}"></i>
              <span class="text-sm">プロット構成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// サブタブ切り替え関数
window.switchConceptionSubTab = (subTab) => {
  state.conceptionSubTab = subTab;
  render();
};

function renderPlotTab() {
  let structure = {};
  try { structure = JSON.parse(state.plot?.structure || '{}'); } catch (e) {}
  const template = state.plot?.template || 'kishotenketsu';
  
  // Get adopted ideas and convert to text if not already done
  const adoptedIdeas = (state.ideas || []).filter(idea => idea.adopted);
  
  // Initialize adoptedIdeasText if empty and there are adopted ideas
  if (!state.adoptedIdeasText && adoptedIdeas.length > 0) {
    state.adoptedIdeasText = adoptedIdeas.map(idea => 
      `【${idea.title}】\n${idea.content || ''}`
    ).join('\n\n');
  }
  
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Adopted Ideas Section - READ ONLY Preview -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm border border-green-200 dark:border-green-800 overflow-hidden">
        <div class="flex items-center justify-between p-3 border-b border-green-200 dark:border-green-700 bg-white/50 dark:bg-gray-800/50">
          <h3 class="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
            <i class="fas fa-lightbulb"></i>${t('ui.adoptedIdeas')}
            <span class="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
              ${t('ui.viewOnly')}
            </span>
          </h3>
          <button onclick="switchTab('ideas')" 
            class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1">
            <i class="fas fa-edit"></i>${t('ui.editInIdeasTab')}
          </button>
        </div>
        
        ${adoptedIdeas.length > 0 || state.adoptedIdeasText ? `
          <div class="p-4 max-h-[300px] overflow-y-auto">
            ${state.adoptedIdeasText ? `
              <div class="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                ${state.adoptedIdeasText}
              </div>
            ` : `
              <div class="space-y-2">
                ${adoptedIdeas.map(idea => `
                  <div class="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                    <div>
                      <span class="font-medium">${idea.title}</span>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${idea.content || ''}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        ` : `
          <div class="p-6 text-center text-gray-500">
            <i class="fas fa-lightbulb text-4xl mb-2 opacity-30"></i>
            <p>まだアイディアが採用されていません</p>
            <p class="text-sm mt-1">「ネタ考案」タブでアイディアを生成・採用してください</p>
          </div>
        `}
      </div>
      
      <!-- Template Selector (read-only display) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">プロット構成テンプレート</span>
          <span class="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm">
            ${template === 'kishotenketsu' ? '起承転結' : template === 'three_act' ? '三幕構成' : 'ブレイク・スナイダー'}
          </span>
        </div>
        <p class="text-xs text-gray-500">
          <i class="fas fa-info-circle mr-1"></i>
          テンプレートの変更や構成の編集は「ネタ考案」タブで行えます
        </p>
      </div>
      
      <!-- Plot Structure (READ ONLY) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <i class="fas fa-sitemap text-indigo-500"></i>
            プロット構成
            <span class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
              参照のみ
            </span>
          </h3>
          <button onclick="switchTab('ideas')" 
            class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1">
            <i class="fas fa-edit"></i>${t('ui.editInIdeasTab')}
          </button>
        </div>
        ${renderPlotStructureReadOnly(template, structure)}
      </div>
    </div>
  `;
}

function renderPlotStructure(template, structure) {
  if (template === 'kishotenketsu') {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${['ki', 'sho', 'ten', 'ketsu'].map(part => `
          <div class="space-y-2 relative">
            <label class="block font-medium text-indigo-600">${t(`plot.${part}`)}</label>
            <textarea id="plot-${part}" rows="4" 
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
              placeholder="${getPlotPlaceholder(part)}">${structure[part] || ''}</textarea>
            <button onclick="expandTextarea('plot-${part}', 'plot.${part}')" 
              class="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-700 rounded"
              title="${t("ui.expand")}">
              <i class="fas fa-expand text-sm"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (template === 'three_act') {
    return `
      <div class="space-y-4">
        ${['act1', 'act2', 'act3'].map(part => `
          <div class="space-y-2 relative">
            <label class="block font-medium text-indigo-600">${t(`plot.${part}`)}</label>
            <textarea id="plot-${part}" rows="3"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none">${structure[part] || ''}</textarea>
            <button onclick="expandTextarea('plot-${part}', 'plot.${part}')" 
              class="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-700 rounded"
              title="${t("ui.expand")}">
              <i class="fas fa-expand text-sm"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }
  return '<p class="text-gray-500">テンプレートを選択してください</p>';
}

// Read-only version of plot structure for Plot tab
function renderPlotStructureReadOnly(template, structure) {
  const hasContent = Object.values(structure).some(v => v && v.trim());
  
  if (!hasContent) {
    return `
      <div class="text-center py-8 text-gray-500">
        <i class="fas fa-sitemap text-4xl mb-3 opacity-30"></i>
        <p>${t('ui.noPlot')}</p>
        <p class="text-sm mt-1">${t('ui.createPlotHint')}</p>
      </div>
    `;
  }
  
  if (template === 'kishotenketsu') {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${['ki', 'sho', 'ten', 'ketsu'].map(part => `
          <div class="space-y-2">
            <label class="block font-medium text-indigo-600">${t(`plot.${part}`)}</label>
            <div class="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 min-h-[100px] text-sm whitespace-pre-wrap">
              ${structure[part] || '<span class="text-gray-400 italic">未入力</span>'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (template === 'three_act') {
    return `
      <div class="space-y-4">
        ${['act1', 'act2', 'act3'].map(part => `
          <div class="space-y-2">
            <label class="block font-medium text-indigo-600">${t(`plot.${part}`)}</label>
            <div class="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 min-h-[80px] text-sm whitespace-pre-wrap">
              ${structure[part] || '<span class="text-gray-400 italic">未入力</span>'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  return '<p class="text-gray-500">テンプレートを選択してください</p>';
}

function getPlotPlaceholder(part) {
  const placeholders = {
    ki: '物語の始まり、登場人物や世界観の紹介...',
    sho: '物語の展開、問題や課題の発生...',
    ten: 'クライマックス、予想外の展開...',
    ketsu: '結末、物語の収束...'
  };
  return placeholders[part] || '';
}

// ============================================
// Illustration Tab - AI Image Generation
// ============================================
function renderIllustrationTab() {
  // Auto-detect characters from project writings and outline
  const detectedCharacters = detectCharactersFromProject();
  const generatedImages = state.generatedImages || [];
  const referenceFiles = state.illustrationFiles || [];
  
  return `
    <div class="h-full flex flex-col lg:flex-row gap-4">
      <!-- Left Panel: Generation Controls -->
      <div class="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
        <!-- Project Context -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-book-open text-blue-500"></i>
            ${t('ui.projectRef')}
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <i class="fas fa-check-circle text-green-500"></i>
              <span>執筆内容からキャラクターを自動認識</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <i class="fas fa-check-circle text-green-500"></i>
              <span>世界観・設定を自動反映</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              ${t('ui.illustrationHint')}
            </p>
          </div>
        </div>
        
        <!-- Character Selection (Auto-detected) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-users text-purple-500"></i>
            登場キャラクター
            <span class="text-xs text-gray-500">(自動認識)</span>
          </h3>
          <div class="space-y-3">
            <select id="illustration-character" 
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
              onchange="updateCharacterPrompt()">
              <option value="">キャラクターを選択（任意）</option>
              ${detectedCharacters.map(c => `
                <option value="${c.name}" data-description="${(c.description || '').replace(/"/g, '&quot;')}">${c.name}</option>
              `).join('')}
            </select>
            ${detectedCharacters.length === 0 ? `
              <p class="text-xs text-yellow-600 dark:text-yellow-400">
                <i class="fas fa-info-circle mr-1"></i>
                ネタ考案タブでキャラクターを設定すると、ここに表示されます
              </p>
            ` : `
              <p class="text-xs text-gray-500">
                ${detectedCharacters.length}人のキャラクターを認識しました
              </p>
            `}
          </div>
        </div>
        
        <!-- Reference Files -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-folder-open text-yellow-500"></i>
            参照ファイル
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">参照画像をアップロード</label>
              <input type="file" id="reference-files" accept="image/*" multiple
                onchange="handleReferenceFiles(event)"
                class="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
              <p class="text-xs text-gray-500 mt-1">キャラや背景の参照画像（複数可）</p>
            </div>
            
            ${referenceFiles.length > 0 ? `
              <div class="flex flex-wrap gap-2">
                ${referenceFiles.map((file, idx) => `
                  <div class="relative">
                    <img src="${file.data}" alt="${file.name}" 
                      class="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:ring-2 ring-indigo-500"
                      onclick="selectReferenceFile(${idx})"
                      title="${file.name}${state.selectedReferenceIdx === idx ? ' (選択中)' : ''}">
                    ${state.selectedReferenceIdx === idx ? `
                      <div class="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-check text-white text-xs"></i>
                      </div>
                    ` : ''}
                    <button onclick="removeReferenceFile(${idx})" 
                      class="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Image Generation Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-sliders-h text-blue-500"></i>
            ${t('ui.genSettings')}
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">画像サイズ</label>
              <select id="illustration-size" 
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                <option value="512x768">512×768（縦長・推奨）</option>
                <option value="768x512">768×512（横長）</option>
                <option value="640x640">640×640（正方形）</option>
                <option value="832x1216">832×1216（高解像度縦）</option>
                <option value="1216x832">1216×832（高解像度横）</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">スタイル</label>
              <select id="illustration-style" 
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                <option value="anime">アニメ・マンガ風</option>
                <option value="realistic">リアル・写実的</option>
                <option value="watercolor">水彩画風</option>
                <option value="oil">油絵風</option>
                <option value="sketch">スケッチ風</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">品質（ステップ数）</label>
              <input type="range" id="illustration-steps" min="20" max="50" value="28" 
                class="w-full" oninput="document.getElementById('steps-value').textContent = this.value">
              <div class="flex justify-between text-xs text-gray-500">
                <span>速い(20)</span>
                <span id="steps-value">28</span>
                <span>高品質(50)</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Prompt Input -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex-1">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="fas fa-magic text-pink-500"></i>
            プロンプト
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">シーン説明</label>
              <textarea id="illustration-prompt" rows="4" 
                placeholder="例: 夕暮れの草原で剣を構える少女、風になびく金髪、決意に満ちた瞳"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm resize-none"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">ネガティブプロンプト</label>
              <textarea id="illustration-negative" rows="2" 
                placeholder="除外したい要素（例: low quality, blurry, bad anatomy）"
                class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm resize-none">low quality, bad anatomy, worst quality, blurry, watermark</textarea>
            </div>
            
            <!-- Coming Soon Notice -->
            <div class="relative">
              <button disabled
                class="w-full px-4 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2 opacity-75">
                <i class="fas fa-wand-magic-sparkles"></i>
                <span>${t('ui.generateIllustration')}</span>
              </button>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                  ✨ Coming Soon ✨
                </span>
              </div>
            </div>
            <p class="text-xs text-center text-gray-500 mt-2">
              <i class="fas fa-info-circle mr-1"></i>
              ${t('ui.illustrationDevNote')}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Right Panel: Generated Images Gallery -->
      <div class="flex-1 flex flex-col">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex-1 overflow-y-auto">
          <h3 class="font-semibold mb-4 flex items-center gap-2">
            <i class="fas fa-images text-green-500"></i>
            ${t('ui.generatedIllustrations')}
            <span class="text-sm text-gray-500">(${generatedImages.length}枚)</span>
          </h3>
          
          ${generatedImages.length > 0 ? `
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
              ${generatedImages.map((img, idx) => `
                <div class="relative group rounded-lg overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <img src="${img.url}" alt="Generated illustration ${idx + 1}" 
                    class="w-full aspect-[3/4] object-cover cursor-pointer hover:opacity-90 transition"
                    onclick="openImageModal('${img.url}', '${(img.prompt || '').replace(/'/g, "\\'")}')">
                  
                  <!-- Overlay with actions -->
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button onclick="copyImageToClipboard('${img.url}')" 
                      class="p-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100" title="コピー">
                      <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="downloadImage('${img.url}', 'illustration_${idx + 1}.png')" 
                      class="p-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100" title="ダウンロード">
                      <i class="fas fa-download"></i>
                    </button>
                    <button onclick="deleteGeneratedImage(${idx})" 
                      class="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600" title="削除">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <!-- Character tag if used -->
                  ${img.character ? `
                    <div class="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                      <i class="fas fa-user mr-1"></i>${img.character}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="flex flex-col items-center justify-center h-64 text-gray-500">
              <i class="fas fa-image text-4xl mb-4"></i>
              <p>まだ挿絵がありません</p>
              <p class="text-sm mt-2">左のパネルでプロンプトを入力して生成してください</p>
            </div>
          `}
        </div>
      </div>
    </div>
    
    <!-- Image Preview Modal -->
    <div id="image-modal" class="hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onclick="closeImageModal(event)">
      <div class="relative max-w-4xl max-h-full" onclick="event.stopPropagation()">
        <img id="modal-image" src="" alt="Preview" class="max-w-full max-h-[80vh] object-contain rounded-lg">
        <div class="absolute top-2 right-2 flex gap-2">
          <button onclick="copyImageToClipboard(document.getElementById('modal-image').src)" 
            class="p-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100" title="コピー">
            <i class="fas fa-copy"></i>
          </button>
          <button onclick="downloadImage(document.getElementById('modal-image').src, 'illustration_' + Date.now() + '.png')" 
            class="p-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100" title="ダウンロード">
            <i class="fas fa-download"></i>
          </button>
          <button onclick="closeImageModal()" 
            class="p-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p id="modal-prompt" class="mt-4 text-white text-sm bg-black/50 p-3 rounded-lg"></p>
      </div>
    </div>
  `;
}

function renderWritingTab() {
  const writing = state.currentWriting;
  const isVertical = writing?.writing_direction === 'vertical';
  const isMobile = window.innerWidth < 768;
  
  return `
    <div class="h-full flex flex-col ${isMobile ? 'mobile-writing-container' : ''}">
      <!-- Pinned Plot (if exists) - hidden on mobile by default -->
      ${state.currentProject?.pinned_plot ? `
        <div class="${isMobile ? 'hidden' : ''} bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div class="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <i class="fas fa-thumbtack"></i>
            <span class="font-medium">プロット参照:</span>
          </div>
          <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">${state.currentProject.pinned_plot}</p>
        </div>
      ` : ''}
      
      <!-- Toolbar - Compact on mobile -->
      <div id="writing-toolbar" class="writing-toolbar flex flex-wrap items-center gap-2 ${isMobile ? 'mb-2 p-1.5' : 'mb-4 p-2'} bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300">
        ${isMobile ? `
        <!-- Mobile: Compact toolbar -->
        <button onclick="toggleMobileWritingToolbar()" class="px-2 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded" title="ツールバー">
          <i class="fas fa-ellipsis-h"></i>
        </button>
        <div id="mobile-toolbar-expanded" class="hidden flex-wrap items-center gap-2 w-full mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        ` : ''}
        
        ${['ja', 'zh', 'ko'].includes(state.language) ? `
        <button onclick="toggleWritingDirection()" class="px-2 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="${isVertical ? t('writing.switchToHorizontal') : t('writing.switchToVertical')}">
          <i class="fas ${isVertical ? 'fa-grip-lines' : 'fa-grip-lines-vertical'}"></i>
        </button>
        ` : ''}
        
        ${isVertical ? `
        <button onclick="toggleVerticalTextMode()" class="px-2 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="${t("writing.textModeTitle")}">
          <i class="fas fa-font mr-1"></i>
          <span class="${isMobile ? 'hidden' : ''}">${state.verticalTextMode === 'upright' ? t('writing.textUpright') : t('writing.textSideways')}</span>
        </button>
        ` : ''}
        
        <select id="font-select" onchange="changeFont(this.value)" class="px-2 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded ${isMobile ? 'max-w-24' : ''}">
          <optgroup label="日本語フォント">
            <option value="Noto Sans JP">Noto Sans JP</option>
            <option value="Noto Serif JP">Noto Serif JP</option>
            <option value="Shippori Mincho">しっぽり明朝</option>
            <option value="BIZ UDMincho">BIZ UD明朝</option>
          </optgroup>
          <optgroup label="英語フォント">
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Roboto">Roboto</option>
          </optgroup>
          <optgroup label="中国語フォント (簡体字)">
            <option value="Noto Sans SC">Noto Sans SC (简体)</option>
            <option value="Noto Serif SC">Noto Serif SC (简体)</option>
          </optgroup>
          <optgroup label="中国語フォント (繁体字)">
            <option value="Noto Sans TC">Noto Sans TC (繁體)</option>
            <option value="Noto Serif TC">Noto Serif TC (繁體)</option>
          </optgroup>
          <optgroup label="韓国語フォント">
            <option value="Noto Sans KR">Noto Sans KR (한국어)</option>
            <option value="Noto Serif KR">Noto Serif KR (한국어)</option>
          </optgroup>
        </select>
        
        <!-- Text Style Selector (Google Docs style) -->
        <div class="relative ${isMobile ? 'hidden' : ''}">
          <button onclick="toggleStyleMenu()" id="style-menu-btn" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2 min-w-28">
            <i class="fas fa-paragraph text-indigo-500"></i>
            <span id="current-style-label">${t('ui.standardText')}</span>
            <i class="fas fa-chevron-down text-xs ml-auto"></i>
          </button>
          <div id="style-menu" class="hidden absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-20 w-48 border border-gray-200 dark:border-gray-700">
            <button onclick="applyTextStyle('normal')" class="block w-full px-4 py-2 text-sm text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2">
              <span class="w-6 text-center text-gray-400"><i class="fas fa-font"></i></span>
              <span>${t('ui.standardText')}</span>
            </button>
            <button onclick="applyTextStyle('title')" class="block w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2">
              <span class="w-6 h-5 flex items-center justify-center text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 rounded">H</span>
              <span class="text-xl font-bold">${t('ui.title')}</span>
            </button>
            <button onclick="applyTextStyle('h1')" class="block w-full px-4 py-2.5 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2">
              <span class="w-6 h-5 flex items-center justify-center text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded">H1</span>
              <span class="text-lg font-semibold">${t('ui.heading1')}</span>
            </button>
            <button onclick="applyTextStyle('h2')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2">
              <span class="w-6 h-5 flex items-center justify-center text-xs font-bold text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded">H2</span>
              <span class="text-base font-medium">${t('ui.heading2')}</span>
            </button>
            <button onclick="applyTextStyle('h3')" class="block w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2">
              <span class="w-6 h-5 flex items-center justify-center text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">H3</span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${t('ui.heading3')}</span>
            </button>
          </div>
        </div>
        
        <!-- Outline Toggle Button -->
        <button onclick="toggleOutline()" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="${t("ui.showOutline")}">
          <i class="fas fa-list-ul mr-1"></i>
          ${t('ui.outline')}
        </button>
        
        <div class="flex-1"></div>
        
        <!-- Save indicator and button -->
        <span id="save-indicator" class="text-sm text-green-600 dark:text-green-400 flex items-center">
          <i class="fas fa-check mr-1"></i><span class="${isMobile ? 'hidden' : ''}">${t('ui.saved')}</span>
        </span>
        
        <button onclick="manualSave()" class="px-2 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1">
          <i class="fas fa-save"></i>
          <span class="hidden sm:inline">${t('common.save')}</span>
        </button>
        
        <span id="word-count" class="text-sm text-gray-500 ${isMobile ? 'text-xs' : ''}">${writing?.word_count || 0} ${getCountLabel()}</span>
        
        <button onclick="readAloud()" class="${isMobile ? 'hidden' : ''} px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
          <i class="fas fa-volume-up mr-1"></i>${t('writing.readAloud')}
        </button>
        
        <div class="relative ${isMobile ? 'hidden' : ''}">
          <button onclick="toggleExportMenu()" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            <i class="fas fa-download mr-1"></i>${t('writing.export')}
          </button>
          <div id="export-menu" class="hidden absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-10 w-56 border border-gray-200 dark:border-gray-700">
            <div class="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-100 dark:border-gray-700">ドキュメント形式</div>
            <button onclick="exportAs('docx')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-file-word text-blue-600 w-4"></i>
              <span>Microsoft Word (.docx)</span>
            </button>
            <button onclick="exportAs('pdf')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-file-pdf text-red-600 w-4"></i>
              <span>PDF ドキュメント (.pdf)</span>
            </button>
            <button onclick="exportAs('odt')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-file-alt text-orange-500 w-4"></i>
              <span>OpenDocument (.odt)</span>
            </button>
            <button onclick="exportAs('rtf')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-file-lines text-gray-600 w-4"></i>
              <span>リッチテキスト (.rtf)</span>
            </button>
            <div class="px-3 py-1.5 text-xs text-gray-500 border-t border-b border-gray-100 dark:border-gray-700 mt-1">ウェブ・電子書籍</div>
            <button onclick="exportAs('html')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-code text-orange-600 w-4"></i>
              <span>ウェブページ (.html)</span>
            </button>
            <button onclick="exportAs('html-zip')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-file-zipper text-yellow-600 w-4"></i>
              <span>ウェブページ (.html, zip)</span>
            </button>
            <button onclick="exportAs('epub')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-book text-green-600 w-4"></i>
              <span>EPUB Publication (.epub)</span>
            </button>
            <div class="px-3 py-1.5 text-xs text-gray-500 border-t border-b border-gray-100 dark:border-gray-700 mt-1">プレーンテキスト</div>
            <button onclick="exportAs('md')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fab fa-markdown text-gray-700 dark:text-gray-300 w-4"></i>
              <span>マークダウン (.md)</span>
            </button>
            <button onclick="exportAs('txt')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <i class="fas fa-file-lines text-gray-500 w-4"></i>
              <span>プレーンテキスト (.txt)</span>
            </button>
          </div>
        </div>
        
        ${isMobile ? '</div>' : ''}
      </div>
      
      <!-- Editor with Outline Panel -->
      <div class="flex-1 flex gap-4 overflow-hidden ${isMobile ? 'mobile-editor-container' : ''}">
        <!-- Outline Panel - hidden on mobile -->
        <div id="outline-panel" class="${state.showOutline && !isMobile ? '' : 'hidden'} w-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
          <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h4 class="font-medium text-sm flex items-center gap-2">
              <i class="fas fa-list-ul text-indigo-500"></i>
              ${t('ui.outline')}
            </h4>
            <button onclick="toggleOutline()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="outline-content" class="p-2 overflow-y-auto" style="max-height: calc(100% - 48px);">
            ${renderOutlineItems()}
          </div>
        </div>
        
        <!-- Editor - Full width on mobile -->
        <div class="flex-1 bg-white dark:bg-gray-800 ${isMobile ? 'rounded-lg' : 'rounded-xl'} shadow-sm overflow-hidden relative">
          <textarea id="editor" 
            class="w-full h-full ${isMobile ? 'p-3 pb-16' : 'p-6'} resize-none focus:outline-none dark:bg-gray-800 ${isVertical ? (state.verticalTextMode === 'upright' ? 'writing-vertical-upright' : 'writing-vertical') : ''}"
            style="font-family: '${writing?.font_family || 'Noto Sans JP'}', sans-serif; font-size: ${isMobile ? '15px' : '16px'}; line-height: ${isMobile ? '1.8' : '2'}; ${isVertical ? `writing-mode: vertical-rl; text-orientation: ${state.verticalTextMode === 'upright' ? 'upright' : 'mixed'}; overflow-x: auto; overflow-y: hidden;` : ''}"
            placeholder="ここに物語を紡いでください...

【見出しの書き方】
# タイトル
## 見出し1
### 見出し2

見出しを入力すると、左のアウトラインに自動で表示されます。"
            oninput="autoSave(this.value); updateOutline();"
            onclick="detectAndUpdateStyleLabel()"
            onkeyup="detectAndUpdateStyleLabel()">${writing?.content || ''}</textarea>
          <!-- Expand Button (bottom-right) -->
          <button onclick="expandTextarea('editor', 'tab.writing')" 
            class="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
            title="${t("ui.expand")}">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Outline Functions
function renderOutlineItems() {
  const content = state.currentWriting?.content || '';
  const headings = parseHeadings(content);
  
  if (headings.length === 0) {
    return `
      <p class="text-sm text-gray-500 p-2">
        見出しがありません<br>
        <span class="text-xs text-gray-400 mt-1 block">
          # タイトル<br>
          ## 見出し1<br>
          ### 見出し2
        </span>
      </p>
    `;
  }
  
  return headings.map((h, index) => `
    <button onclick="jumpToHeading(${h.lineIndex})"
      class="w-full text-left px-2 py-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm transition-colors"
      style="padding-left: ${(h.level - 1) * 12 + 8}px;">
      <span class="flex items-center gap-2">
        ${getOutlineIcon(h.level)}
        <span class="truncate ${h.level === 1 ? 'font-medium' : ''}">${h.text}</span>
      </span>
    </button>
  `).join('');
}

function getOutlineIcon(level) {
  // level 1 = # (タイトル) → H
  // level 2 = ## (見出し1) → H1  
  // level 3 = ### (見出し2) → H2
  // level 4 = 【】(見出し3) → H3
  switch (level) {
    case 1:
      return '<span class="w-5 h-5 flex items-center justify-center text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 rounded">H</span>';
    case 2:
      return '<span class="w-5 h-5 flex items-center justify-center text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded">H1</span>';
    case 3:
      return '<span class="w-5 h-5 flex items-center justify-center text-xs font-bold text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded">H2</span>';
    case 4:
      return '<span class="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">H3</span>';
    default:
      return '<span class="w-5 h-5 flex items-center justify-center text-xs text-gray-400"><i class="fas fa-minus"></i></span>';
  }
}

function parseHeadings(content) {
  const lines = content.split('\n');
  const headings = [];
  
  lines.forEach((line, index) => {
    // Markdown style headings: #, ##, ###
    const mdMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (mdMatch) {
      headings.push({
        level: mdMatch[1].length,
        text: mdMatch[2].trim(),
        lineIndex: index
      });
      return;
    }
    
    // Japanese style headings: 第X章、第X節 etc.
    const jpChapterMatch = line.match(/^(第[一二三四五六七八九十百千万〇０-９0-9]+[章部編])\s*(.*)$/);
    if (jpChapterMatch) {
      headings.push({
        level: 1,
        text: jpChapterMatch[1] + (jpChapterMatch[2] ? ' ' + jpChapterMatch[2] : ''),
        lineIndex: index
      });
      return;
    }
    
    const jpSectionMatch = line.match(/^(第[一二三四五六七八九十百千万〇０-９0-9]+[節項])\s*(.*)$/);
    if (jpSectionMatch) {
      headings.push({
        level: 2,
        text: jpSectionMatch[1] + (jpSectionMatch[2] ? ' ' + jpSectionMatch[2] : ''),
        lineIndex: index
      });
      return;
    }
    
    // Numbered headings: 1., 1.1, etc.
    const numMatch = line.match(/^(\d+\.)\s+(.+)$/);
    if (numMatch) {
      headings.push({
        level: 1,
        text: numMatch[2].trim(),
        lineIndex: index
      });
      return;
    }
    
    const subNumMatch = line.match(/^(\d+\.\d+\.?)\s+(.+)$/);
    if (subNumMatch) {
      headings.push({
        level: 2,
        text: subNumMatch[2].trim(),
        lineIndex: index
      });
      return;
    }
    
    // 【】brackets style headings → 見出し3 (H3)
    const bracketMatch = line.match(/^【(.+)】$/);
    if (bracketMatch) {
      headings.push({
        level: 4,
        text: bracketMatch[1].trim(),
        lineIndex: index
      });
      return;
    }
    
    // ■□●○ marker style headings
    const markerMatch = line.match(/^[■□●○▼▽◆◇★☆]\s*(.+)$/);
    if (markerMatch) {
      headings.push({
        level: 3,
        text: markerMatch[1].trim(),
        lineIndex: index
      });
    }
  });
  
  return headings;
}

// ============================================
// 分析・相談タブ（統合版）
// ============================================
function renderAnalysisChatTab() {
  const analysisSubTab = state.analysisSubTab || 'analysis';
  
  return `
    <div class="h-full flex flex-col">
      <!-- サブタブ切り替え -->
      <div class="flex gap-2 mb-4 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
        <button onclick="switchAnalysisSubTab('analysis')" 
          class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${analysisSubTab === 'analysis' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
          <i class="fas fa-chart-line mr-2"></i>分析・批評
        </button>
        <button onclick="switchAnalysisSubTab('consultation')" 
          class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${analysisSubTab === 'consultation' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
          <i class="fas fa-comments mr-2"></i>相談AI
        </button>
      </div>
      
      <!-- サブタブコンテンツ -->
      <div class="flex-1 overflow-hidden">
        ${analysisSubTab === 'analysis' ? renderAnalysisSubContent() : renderConsultationSubContent()}
      </div>
    </div>
  `;
}

// 分析サブタブ
function renderAnalysisSubContent() {
  const personas = [
    { id: 'neutral', name: '客観的な批評家', icon: 'fa-user-tie', desc: '冷静で客観的な分析' },
    { id: 'encouraging', name: '応援する編集者', icon: 'fa-heart', desc: '励ましながらアドバイス' },
    { id: 'strict', name: '厳格な文芸評論家', icon: 'fa-gavel', desc: '厳しくも的確な指摘' },
    { id: 'reader', name: '熱心な読者', icon: 'fa-book-reader', desc: '読者目線での感想' },
    { id: 'mentor', name: '経験豊富な作家', icon: 'fa-feather-alt', desc: '先輩作家としてのアドバイス' }
  ];
  
  const currentPersona = state.analysisPersona || 'neutral';
  const selectedPersona = personas.find(p => p.id === currentPersona);
  
  return `
    <div class="h-full flex flex-col">
      <!-- チャットエリア -->
      <div class="flex-1 flex gap-4 min-h-0">
        <!-- ペルソナ設定（デスクトップ） -->
        <div class="w-48 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hidden lg:flex flex-col">
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-sm flex items-center gap-2">
              <i class="fas fa-masks-theater text-purple-500"></i>
              ペルソナ
            </h3>
          </div>
          <div class="overflow-y-auto flex-1 p-2 space-y-1">
            ${personas.map(p => `
              <button onclick="setAnalysisPersona('${p.id}')"
                class="w-full text-left p-2 rounded-lg text-xs transition ${currentPersona === p.id 
                  ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
                <div class="flex items-center gap-2">
                  <i class="fas ${p.icon} ${currentPersona === p.id ? 'text-purple-600' : 'text-gray-400'}"></i>
                  <span class="${currentPersona === p.id ? 'text-purple-700 dark:text-purple-300 font-medium' : ''}">${p.name}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- チャット -->
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas ${selectedPersona.icon} text-purple-500"></i>
              <span class="font-medium text-sm">${selectedPersona.name}</span>
            </div>
            <button onclick="handleAnalyze()" 
              class="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner w-4 h-4"></div>' : '<i class="fas fa-magic"></i>'}
              自動分析
            </button>
          </div>
          
          <div id="analysis-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
            ${renderAnalysisChatMessages()}
          </div>
          
          <div class="p-3 border-t border-gray-200 dark:border-gray-700">
            <form id="analysis-chat-form" class="flex gap-2">
              <input type="text" id="analysis-chat-input" 
                placeholder="作品について質問・相談..."
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700">
              <button type="submit" 
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                ${state.aiGenerating ? 'disabled' : ''}>
                ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-paper-plane"></i>'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 分析チャート（折りたたみ） -->
      <div class="mt-4">
        <button onclick="toggleAnalysisCharts()" 
          class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <span class="font-medium flex items-center gap-2">
            <i class="fas fa-chart-bar text-indigo-500"></i>
            分析チャート
          </span>
          <i class="fas ${state.analysisChartsOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400"></i>
        </button>
        
        ${state.analysisChartsOpen ? `
          <div class="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <h3 class="text-sm font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-chart-line text-indigo-500"></i>${t('analysis.emotionCurve')}
              </h3>
              <div class="h-40">
                <canvas id="emotion-chart"></canvas>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <h3 class="text-sm font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-chart-pie text-indigo-500"></i>${t('analysis.radar')}
              </h3>
              <div class="h-40">
                <canvas id="radar-chart"></canvas>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 相談AIサブタブ
function renderConsultationSubContent() {
  return `
    <div class="h-full flex gap-4">
      <!-- スレッドリスト -->
      <div class="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hidden md:flex flex-col">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 class="font-semibold text-sm">相談履歴</h3>
          <button onclick="createNewThread()" class="px-2 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          ${(state.chatThreads || []).length > 0 ? state.chatThreads.map(thread => `
            <button onclick="selectThread('${thread.id}')"
              class="w-full text-left p-2 rounded-lg text-sm transition ${state.currentThread === thread.id 
                ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
              <p class="truncate font-medium">${thread.title || '新しい相談'}</p>
              <p class="text-xs text-gray-500 truncate">${thread.lastMessage || ''}</p>
            </button>
          `).join('') : `
            <p class="text-center text-gray-500 text-sm py-4">
              まだ相談履歴がありません
            </p>
          `}
        </div>
      </div>
      
      <!-- チャットエリア -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h3 class="font-semibold flex items-center gap-2">
            <i class="fas fa-robot"></i>
            相談AI
          </h3>
          <p class="text-xs text-indigo-100 mt-1">プロット、キャラクター、文章の悩みなど何でも相談できます</p>
        </div>
        
        <div id="consultation-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
          ${renderConsultationMessages()}
        </div>
        
        <div class="p-3 border-t border-gray-200 dark:border-gray-700">
          <form onsubmit="sendConsultationMessage(event)" class="flex gap-2">
            <input type="text" id="consultation-input" 
              placeholder="${t('chat.placeholder')}"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700">
            <button type="submit" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-paper-plane"></i>'}
            </button>
          </form>
          
          <!-- クイックプロンプト -->
          <div class="flex flex-wrap gap-1 mt-2">
            <button onclick="sendQuickConsultation('この章の展開に迷っています')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200">
              展開の相談
            </button>
            <button onclick="sendQuickConsultation('キャラクターの動機付けを深めたい')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200">
              キャラ相談
            </button>
            <button onclick="sendQuickConsultation('文章のリズムを改善したい')" 
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200">
              文章相談
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 相談メッセージのレンダリング
function renderConsultationMessages() {
  if (!state.chatMessages || state.chatMessages.length === 0) {
    return `
      <div class="text-center text-gray-500 py-8">
        <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
        <p class="font-medium">${t('chat.empty')}</p>
        <p class="text-sm mt-2">${t('chat.hint')}</p>
      </div>
    `;
  }
  
  return state.chatMessages.map(msg => {
    if (msg.role === 'user') {
      return `
        <div class="flex justify-end">
          <div class="max-w-[80%] bg-indigo-600 text-white rounded-2xl px-4 py-2">
            <p class="whitespace-pre-wrap">${msg.content}</p>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flex justify-start gap-2">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <i class="fas fa-robot text-white text-sm"></i>
          </div>
          <div class="max-w-[80%] bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
            <p class="whitespace-pre-wrap">${msg.content}</p>
          </div>
        </div>
      `;
    }
  }).join('');
}

// サブタブ切り替え
window.switchAnalysisSubTab = (subTab) => {
  state.analysisSubTab = subTab;
  render();
};

// 相談AI関連の関数
window.sendConsultationMessage = async (event) => {
  event.preventDefault();
  const input = document.getElementById('consultation-input');
  const message = input.value.trim();
  if (!message || state.aiGenerating) return;
  
  input.value = '';
  state.chatMessages = state.chatMessages || [];
  state.chatMessages.push({ role: 'user', content: message });
  render();
  
  state.aiGenerating = true;
  render();
  
  try {
    const response = await callGeminiAPI('consultation', message);
    state.chatMessages.push({ role: 'assistant', content: response });
  } catch (error) {
    state.chatMessages.push({ role: 'assistant', content: 'エラーが発生しました。もう一度お試しください。' });
  } finally {
    state.aiGenerating = false;
    render();
  }
};

window.sendQuickConsultation = (message) => {
  const input = document.getElementById('consultation-input');
  if (input) {
    input.value = message;
    input.focus();
  }
};

// 実績モーダル（タブから移動）
function renderAchievementsModal() {
  return `
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div class="text-center mb-6">
        <i class="fas fa-trophy text-5xl text-yellow-400"></i>
        <h2 class="text-xl font-bold mt-2">${t('achievement.title')}</h2>
        <p class="text-gray-500 text-sm mt-1">実績機能は左サイドバーのトロフィーアイコンから確認できます</p>
      </div>
      <button onclick="openAchievementModal()" 
        class="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium">
        <i class="fas fa-trophy mr-2"></i>実績を確認する
      </button>
    </div>
  `;
}

function renderAnalysisTab() {
  // ペルソナ選択オプション
  const personas = [
    { id: 'neutral', name: '客観的な批評家', icon: 'fa-user-tie', desc: '冷静で客観的な分析' },
    { id: 'encouraging', name: '応援する編集者', icon: 'fa-heart', desc: '励ましながらアドバイス' },
    { id: 'strict', name: '厳格な文芸評論家', icon: 'fa-gavel', desc: '厳しくも的確な指摘' },
    { id: 'reader', name: '熱心な読者', icon: 'fa-book-reader', desc: '読者目線での感想' },
    { id: 'mentor', name: '経験豊富な作家', icon: 'fa-feather-alt', desc: '先輩作家としてのアドバイス' }
  ];
  
  const currentPersona = state.analysisPersona || 'neutral';
  const selectedPersona = personas.find(p => p.id === currentPersona);
  
  return `
    <div class="h-full flex flex-col">
      <!-- メイン: チャットエリア -->
      <div class="flex-1 flex gap-4 min-h-0">
        <!-- ペルソナ設定サイドバー（デスクトップのみ） -->
        <div class="w-56 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hidden lg:flex flex-col">
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-sm flex items-center gap-2">
              <i class="fas fa-masks-theater text-purple-500"></i>
              批評家ペルソナ
            </h3>
          </div>
          <div class="overflow-y-auto flex-1 p-2 space-y-1">
            ${personas.map(p => `
              <button onclick="setAnalysisPersona('${p.id}')"
                class="w-full text-left p-2 rounded-lg text-sm transition ${currentPersona === p.id ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
                <div class="flex items-center gap-2">
                  <i class="fas ${p.icon} ${currentPersona === p.id ? 'text-purple-600' : 'text-gray-400'}"></i>
                  <span class="${currentPersona === p.id ? 'text-purple-700 dark:text-purple-300 font-medium' : ''}">${p.name}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1 ml-6">${p.desc}</p>
              </button>
            `).join('')}
          </div>
          <div class="p-3 border-t border-gray-200 dark:border-gray-700">
            <button onclick="clearAnalysisChat()" 
              class="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <i class="fas fa-trash-alt mr-1"></i>履歴をクリア
            </button>
          </div>
        </div>
        
        <!-- チャットエリア -->
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <!-- ヘッダー：モバイルペルソナ選択 + 情報 -->
          <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas ${selectedPersona.icon} text-purple-500"></i>
              <span class="font-medium text-sm">${selectedPersona.name}</span>
            </div>
            <!-- モバイル用ペルソナ切り替え -->
            <div class="lg:hidden">
              <select onchange="setAnalysisPersona(this.value)" 
                class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 dark:bg-gray-700">
                ${personas.map(p => `<option value="${p.id}" ${currentPersona === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
              </select>
            </div>
            <button onclick="handleAnalyze()" 
              class="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner w-4 h-4"></div>' : '<i class="fas fa-magic"></i>'}
              自動分析
            </button>
          </div>
          
          <!-- チャットメッセージ -->
          <div id="analysis-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
            ${renderAnalysisChatMessages()}
          </div>
          
          <!-- 入力エリア -->
          <div class="p-3 border-t border-gray-200 dark:border-gray-700">
            <form id="analysis-chat-form" class="flex gap-2">
              <input type="text" id="analysis-chat-input" 
                placeholder="作品について質問・相談..."
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-sm">
              <button type="submit" 
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                ${state.aiGenerating ? 'disabled' : ''}>
                ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-paper-plane"></i>'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 下部: 分析チャート（折りたたみ式） -->
      <div class="mt-4">
        <button onclick="toggleAnalysisCharts()" 
          class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
          <span class="font-medium flex items-center gap-2">
            <i class="fas fa-chart-bar text-indigo-500"></i>
            分析チャート
          </span>
          <i class="fas ${state.analysisChartsOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400"></i>
        </button>
        
        ${state.analysisChartsOpen ? `
          <div class="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- 感情曲線 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 relative">
              <button onclick="toggleExpandPanel('emotion-chart-panel')" 
                class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i class="fas fa-expand"></i>
              </button>
              <h3 class="text-sm font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-chart-line text-indigo-500"></i>${t('analysis.emotionCurve')}
              </h3>
              <div class="h-48">
                <canvas id="emotion-chart"></canvas>
              </div>
            </div>
            
            <!-- 作品成分チャート -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 relative">
              <button onclick="toggleExpandPanel('radar-chart-panel')" 
                class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i class="fas fa-expand"></i>
              </button>
              <h3 class="text-sm font-semibold mb-2 flex items-center gap-2">
                <i class="fas fa-chart-pie text-indigo-500"></i>${t('analysis.radar')}
              </h3>
              <div class="h-48">
                <canvas id="radar-chart"></canvas>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 分析チャットメッセージのレンダリング
function renderAnalysisChatMessages() {
  if (!state.analysisChatMessages || state.analysisChatMessages.length === 0) {
    return `
      <div class="text-center text-gray-500 py-8">
        <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
        <p class="font-medium">作品を分析・批評します</p>
        <p class="text-sm mt-2">「自動分析」で全体分析、または質問を入力してください</p>
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <button onclick="askAnalysisQuestion('この作品の強みは何ですか？')" 
            class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200">
            強みを教えて
          </button>
          <button onclick="askAnalysisQuestion('改善点を具体的に教えてください')" 
            class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200">
            改善点は？
          </button>
          <button onclick="askAnalysisQuestion('読者がこの作品に惹かれるポイントは？')" 
            class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200">
            読者視点で
          </button>
        </div>
      </div>
    `;
  }
  
  const personas = {
    neutral: { name: '批評家', icon: 'fa-user-tie', color: 'text-gray-600' },
    encouraging: { name: '編集者', icon: 'fa-heart', color: 'text-pink-500' },
    strict: { name: '評論家', icon: 'fa-gavel', color: 'text-red-600' },
    reader: { name: '読者', icon: 'fa-book-reader', color: 'text-blue-500' },
    mentor: { name: '先輩作家', icon: 'fa-feather-alt', color: 'text-green-600' }
  };
  
  return state.analysisChatMessages.map(msg => {
    if (msg.role === 'user') {
      return `
        <div class="flex justify-end">
          <div class="max-w-[80%] bg-purple-600 text-white rounded-2xl px-4 py-2">
            <p class="whitespace-pre-wrap">${msg.content}</p>
          </div>
        </div>
      `;
    } else {
      const persona = personas[msg.persona || 'neutral'];
      return `
        <div class="flex justify-start gap-2">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <i class="fas ${persona.icon} ${persona.color} text-sm"></i>
          </div>
          <div class="max-w-[80%] bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
            <p class="text-xs ${persona.color} mb-1">${persona.name}</p>
            <p class="whitespace-pre-wrap">${msg.content}</p>
          </div>
        </div>
      `;
    }
  }).join('');
}

function renderConsultationTab() {
  return `
    <div class="h-full flex gap-4">
      <!-- Thread List -->
      <div class="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hidden md:block">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700">
          <button onclick="startNewThread()" class="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            <i class="fas fa-plus mr-1"></i>新しい相談
          </button>
        </div>
        <!-- Thread Usage Hint -->
        <div class="p-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
          <p class="text-xs text-blue-700 dark:text-blue-300">
            <i class="fas fa-info-circle mr-1"></i>
            トピックごとに相談を分けると、AIがより的確に回答できます
          </p>
        </div>
        <div class="overflow-y-auto h-[calc(100%-120px)]">
          ${state.chatThreads.length === 0 ? `
            <div class="p-4 text-center text-gray-500 text-sm">
              <p>まだ相談がありません</p>
              <p class="mt-1 text-xs">「新しい相談」で始めましょう</p>
            </div>
          ` : state.chatThreads.map(thread => `
            <div onclick="loadChatMessages('${thread.thread_id}')"
              class="p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${state.currentThread === thread.thread_id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}">
              <p class="text-sm truncate">${thread.first_message || '新しい相談'}</p>
              <p class="text-xs text-gray-500 mt-1">${formatDate(thread.started_at)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Chat Area -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
          ${renderChatMessages()}
        </div>
        
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <form id="chat-form" class="flex gap-2">
            <input type="text" id="chat-input" placeholder="相談したいことを入力..."
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-paper-plane"></i>'}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderChatMessages() {
  if (state.chatMessages.length === 0) {
    return `
      <div class="text-center text-gray-500 py-8">
        <i class="fas fa-robot text-5xl mb-4 text-indigo-400 opacity-70"></i>
        <p class="text-lg font-medium">創作AIアシスタント</p>
        <p class="text-sm mt-2">プロット、キャラクター、文章の悩みなど何でも相談できます</p>
        
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left">
          <button onclick="setQuickPrompt('主人公のキャラクター設定について相談したいです')" 
            class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition">
            <i class="fas fa-user text-purple-500 mr-2"></i>キャラクター相談
          </button>
          <button onclick="setQuickPrompt('物語の展開に悩んでいます。アドバイスをください')" 
            class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition">
            <i class="fas fa-route text-blue-500 mr-2"></i>プロット相談
          </button>
          <button onclick="setQuickPrompt('この文章を推敲してほしいです')" 
            class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition">
            <i class="fas fa-pen-fancy text-green-500 mr-2"></i>文章添削
          </button>
          <button onclick="setQuickPrompt('創作のモチベーションを上げる方法を教えてください')" 
            class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition">
            <i class="fas fa-heart text-pink-500 mr-2"></i>モチベーション
          </button>
        </div>
      </div>
    `;
  }
  
  return state.chatMessages.map(msg => `
    <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700'} rounded-2xl px-4 py-2">
        <p class="whitespace-pre-wrap">${msg.content}</p>
      </div>
    </div>
  `).join('');
}
  
// Quick prompt helper for consultation
window.setQuickPrompt = (text) => {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    input.focus();
  }
};

// ============================================
// Achievements Tab
// ============================================
function renderAchievementsTab() {
  const currentMonth = new Date().toLocaleString(state.language === 'ja' ? 'ja-JP' : 'en-US', { month: 'long', year: 'numeric' });
  const currentDay = new Date().getDate();
  
  // Get activity-based achievements (auto-tracked)
  const activityLog = getActivityLog();
  const monthlyGoals = generateAutoAchievements(activityLog);
  const completedCount = monthlyGoals.filter(g => g.completed).length;
  const totalCount = monthlyGoals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Determine badge tier
  const badgeTier = getBadgeTier(progressPercent);
  
  // Check if it's time to update achievements (25th of month)
  const shouldAutoReset = currentDay >= 25 && shouldResetMonthlyAchievements();
  
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header with Trophy Animation -->
      <div class="text-center py-6">
        <div class="inline-block">
          <i class="fas fa-trophy text-7xl ${badgeTier.color} drop-shadow-lg"></i>
        </div>
        <h2 class="text-2xl font-bold mt-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          ${t('achievement.title')}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">${currentMonth}</p>
        ${shouldAutoReset ? `
          <p class="text-sm text-orange-500 mt-1">
            <i class="fas fa-info-circle mr-1"></i>月末（25日）に実績がリセットされます
          </p>
        ` : ''}
      </div>
      
      <!-- Monthly Progress Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-yellow-400">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <i class="fas fa-calendar-check text-yellow-500"></i>
            ${t('achievement.monthly')}
          </h3>
          <span class="text-sm text-gray-500">
            <i class="fas fa-sync-alt mr-1"></i>自動更新
          </span>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400">${t('achievement.progress')}</span>
            <span class="font-bold text-${badgeTier.textColor}">${completedCount}/${totalCount} (${progressPercent}%)</span>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-500 rounded-full"
              style="width: ${progressPercent}%"></div>
          </div>
        </div>
        
        <!-- Badge Display -->
        <div class="grid grid-cols-5 gap-2 mb-6">
          ${renderBadgeTiers(progressPercent)}
        </div>
        
        <!-- Monthly Goals List (Auto-tracked, read-only) -->
        <div class="space-y-3">
          ${monthlyGoals.map(goal => `
            <div class="flex items-center gap-3 p-3 rounded-lg ${goal.completed ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700'}">
              <div class="w-8 h-8 flex items-center justify-center rounded-full ${goal.completed ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}">
                <i class="fas ${goal.completed ? 'fa-check' : 'fa-circle'}"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium ${goal.completed ? 'text-green-700 dark:text-green-300' : ''}">${goal.title}</p>
                <p class="text-sm text-gray-500">${goal.description}</p>
                <p class="text-xs text-gray-400 mt-1">進捗: ${goal.progress}</p>
              </div>
              <span class="text-2xl">${goal.emoji}</span>
            </div>
          `).join('')}
        </div>
        
        <p class="text-xs text-gray-500 text-center mt-4">
          <i class="fas fa-info-circle mr-1"></i>
          実績は執筆活動に基づいて自動的に更新されます
        </p>
      </div>
      
      <!-- Badge History Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold flex items-center gap-2 mb-4">
          <i class="fas fa-history text-purple-500"></i>
          これまでの獲得バッジ数
        </h3>
        ${renderBadgeHistory()}
      </div>
    </div>
  `;
}

// Generate achievements based on actual user activity
function generateAutoAchievements(activityLog) {
  // Use activity log data primarily, fall back to current state for real-time updates
  const writings = state.writings || [];
  const currentWordCount = writings.reduce((sum, w) => sum + (w.word_count || 0), 0);
  // Use the larger of activity log total or current state (handles page refresh)
  const totalWords = Math.max(activityLog.totalWordsThisMonth || 0, currentWordCount);
  
  const adoptedIdeas = Math.max(
    activityLog.ideasAdopted || 0,
    (state.ideas || []).filter(i => i.adopted).length
  );
  
  const chaptersCount = Math.max(
    activityLog.chaptersWritten || 0,
    writings.filter(w => (w.word_count || 0) > 500).length // chapters with content
  );
  
  return [
    {
      id: 1,
      title: '今月の執筆目標',
      description: '5,000文字以上執筆する',
      emoji: '✍️',
      completed: totalWords >= 5000,
      progress: `${totalWords.toLocaleString()} / 5,000 文字`
    },
    {
      id: 2,
      title: 'ログイン習慣',
      description: '週5日以上ログインする',
      emoji: '📅',
      completed: (activityLog.loginDaysThisWeek?.length || 0) >= 5,
      progress: `${activityLog.loginDaysThisWeek?.length || 0} / 5 日`
    },
    {
      id: 3,
      title: 'AIパートナー活用',
      description: 'AIと10回以上相談する',
      emoji: '🤖',
      completed: (activityLog.aiConsultations || 0) >= 10,
      progress: `${activityLog.aiConsultations || 0} / 10 回`
    },
    {
      id: 4,
      title: 'アイデアコレクター',
      description: '3つ以上のアイデアを採用する',
      emoji: '💡',
      completed: adoptedIdeas >= 3,
      progress: `${adoptedIdeas} / 3 個`
    },
    {
      id: 5,
      title: '章の完成',
      description: '3章以上を執筆する',
      emoji: '📝',
      completed: chaptersCount >= 3,
      progress: `${chaptersCount} / 3 章`
    },
    {
      id: 6,
      title: '作品分析',
      description: '作品を1回以上分析する',
      emoji: '📊',
      completed: (activityLog.analysisPerformed || 0) >= 1,
      progress: `${activityLog.analysisPerformed || 0} / 1 回`
    }
  ];
}

function shouldResetMonthlyAchievements() {
  const lastReset = localStorage.getItem('lastAchievementReset');
  const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
  return lastReset !== currentMonth;
}

// Badge history stored in localStorage (per user)
function getBadgeHistoryKey() {
  const userId = state.user?.id || 'anonymous';
  return `badgeHistory_${userId}`;
}

function getBadgeHistory() {
  try {
    const saved = localStorage.getItem(getBadgeHistoryKey());
    return saved ? JSON.parse(saved) : { platinum: 0, gold: 0, silver: 0, bronze: 0, encouragement: 0 };
  } catch (e) {
    return { platinum: 0, gold: 0, silver: 0, bronze: 0, encouragement: 0 };
  }
}

function saveBadgeHistory(history) {
  localStorage.setItem(getBadgeHistoryKey(), JSON.stringify(history));
}

function renderBadgeHistory() {
  const history = getBadgeHistory();
  
  const badges = [
    { key: 'platinum', name: 'プラチナ', icon: 'fa-gem', color: 'text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30', count: history.platinum },
    { key: 'gold', name: 'ゴールド', icon: 'fa-crown', color: 'text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', count: history.gold },
    { key: 'silver', name: 'シルバー', icon: 'fa-star', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700', count: history.silver },
    { key: 'bronze', name: 'ブロンズ', icon: 'fa-medal', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', count: history.bronze },
    { key: 'encouragement', name: '頑張ってね', icon: 'fa-heart', color: 'text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30', count: history.encouragement },
  ];
  
  return `
    <div class="grid grid-cols-5 gap-3">
      ${badges.map(badge => `
        <div class="text-center p-3 rounded-xl ${badge.bg}">
          <i class="fas ${badge.icon} text-3xl ${badge.color} mb-2"></i>
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400">${badge.name}</p>
          <p class="text-2xl font-bold ${badge.color}">${badge.count}</p>
        </div>
      `).join('')}
    </div>
    <p class="text-center text-sm text-gray-500 mt-4">
      月末に実績を達成するとバッジが記録されます
    </p>
  `;
}

function getDefaultMonthlyGoals() {
  return [
    { id: 1, title: '1日1000文字執筆', description: '毎日コツコツ書き続けよう', emoji: '✍️', completed: false },
    { id: 2, title: '週5日ログイン', description: '習慣化が成功の鍵', emoji: '📅', completed: false },
    { id: 3, title: 'AIと10回相談', description: 'AIをパートナーとして活用', emoji: '🤖', completed: false },
    { id: 4, title: 'プロット完成', description: '物語の骨格を作ろう', emoji: '📝', completed: false },
    { id: 5, title: '5つのアイデア採用', description: '創作の種を育てる', emoji: '💡', completed: false },
    { id: 6, title: '作品を1回分析', description: '客観的な視点を得る', emoji: '📊', completed: false },
  ];
}

function getBadgeTier(percent) {
  if (percent >= 100) return { name: t('achievement.platinum'), color: 'text-cyan-400', bgColor: 'cyan-500', textColor: 'cyan-500', icon: 'fa-gem' };
  if (percent >= 80) return { name: t('achievement.gold'), color: 'text-yellow-400', bgColor: 'yellow-500', textColor: 'yellow-500', icon: 'fa-crown' };
  if (percent >= 60) return { name: t('achievement.silver'), color: 'text-gray-400', bgColor: 'gray-400', textColor: 'gray-400', icon: 'fa-star' };
  if (percent >= 40) return { name: t('achievement.bronze'), color: 'text-orange-600', bgColor: 'orange-600', textColor: 'orange-600', icon: 'fa-medal' };
  return { name: t('achievement.encouragement'), color: 'text-pink-400', bgColor: 'pink-400', textColor: 'pink-400', icon: 'fa-heart' };
}

function renderBadgeTiers(currentPercent) {
  const tiers = [
    { name: t('achievement.encouragement'), minPercent: 0, color: 'pink-400', icon: 'fa-heart' },
    { name: t('achievement.bronze'), minPercent: 40, color: 'orange-600', icon: 'fa-medal' },
    { name: t('achievement.silver'), minPercent: 60, color: 'gray-400', icon: 'fa-star' },
    { name: t('achievement.gold'), minPercent: 80, color: 'yellow-400', icon: 'fa-crown' },
    { name: t('achievement.platinum'), minPercent: 100, color: 'cyan-400', icon: 'fa-gem' },
  ];
  
  return tiers.map(tier => {
    const isUnlocked = currentPercent >= tier.minPercent;
    return `
      <div class="text-center p-2 rounded-lg ${isUnlocked ? 'bg-gradient-to-b from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow' : 'opacity-40'}">
        <i class="fas ${tier.icon} text-2xl text-${tier.color} ${isUnlocked ? 'animate-bounce' : ''}"></i>
        <p class="text-xs mt-1 font-medium">${tier.name}</p>
        <p class="text-xs text-gray-500">${tier.minPercent}%</p>
      </div>
    `;
  }).join('');
}

function renderAllTimeBadges() {
  const badges = state.achievements || [];
  
  if (badges.length === 0) {
    // Show some example/locked badges
    const exampleBadges = [
      { title: '初めての執筆', icon: 'fa-feather', color: 'blue' },
      { title: 'AI活用マスター', icon: 'fa-robot', color: 'purple' },
      { title: '連続7日ログイン', icon: 'fa-fire', color: 'red' },
      { title: '10000文字達成', icon: 'fa-scroll', color: 'green' },
    ];
    
    return exampleBadges.map(badge => `
      <div class="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-xl opacity-50">
        <div class="w-12 h-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <i class="fas ${badge.icon} text-xl text-gray-400"></i>
        </div>
        <p class="text-sm mt-2 font-medium text-gray-500">${badge.title}</p>
        <p class="text-xs text-gray-400">${t('achievement.locked')}</p>
      </div>
    `).join('');
  }
  
  return badges.map(badge => `
    <div class="text-center p-4 bg-gradient-to-b from-${badge.color}-50 to-${badge.color}-100 dark:from-${badge.color}-900/20 dark:to-${badge.color}-800/20 rounded-xl border border-${badge.color}-200 dark:border-${badge.color}-800">
      <div class="w-12 h-12 mx-auto bg-${badge.color}-500 rounded-full flex items-center justify-center shadow-lg">
        <i class="fas ${badge.icon} text-xl text-white"></i>
      </div>
      <p class="text-sm mt-2 font-medium">${badge.title}</p>
      <p class="text-xs text-gray-500">${badge.earnedAt ? formatDate(badge.earnedAt) : ''}</p>
    </div>
  `).join('');
}

window.toggleAchievement = (index) => {
  if (!state.monthlyAchievements) {
    state.monthlyAchievements = getDefaultMonthlyGoals();
  }
  state.monthlyAchievements[index].completed = !state.monthlyAchievements[index].completed;
  
  // Save to localStorage for persistence
  localStorage.setItem('monthlyAchievements', JSON.stringify(state.monthlyAchievements));
  localStorage.setItem('achievementMonth', new Date().getMonth().toString());
  
  // Check if all achievements completed and update badge history
  checkAndUpdateBadgeHistory();
  
  render();
};

// Activity log for automatic achievement tracking
// Uses user ID as key to separate data per user
function getActivityLogKey() {
  const userId = state.user?.id || 'anonymous';
  return `activityLog_${userId}`;
}

function getActivityLog() {
  try {
    const saved = localStorage.getItem(getActivityLogKey());
    const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
    
    if (saved) {
      const log = JSON.parse(saved);
      // Auto reset if month changed
      if (log.currentMonth !== currentMonth) {
        console.log('New month detected, resetting activity log');
        return createNewActivityLog();
      }
      return log;
    }
    return createNewActivityLog();
  } catch (e) {
    console.error('Error loading activity log:', e);
    return createNewActivityLog();
  }
}

function createNewActivityLog() {
  const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
  return {
    totalWordsThisMonth: 0,
    wordsWrittenToday: 0,
    loginDaysThisWeek: [],
    loginDaysThisMonth: [],
    aiConsultations: 0,
    ideasAdopted: 0,
    analysisPerformed: 0,
    chaptersWritten: 0,
    currentMonth: currentMonth,
    lastUpdated: new Date().toDateString()
  };
}

function saveActivityLog(log) {
  log.lastUpdated = new Date().toDateString();
  localStorage.setItem(getActivityLogKey(), JSON.stringify(log));
}

// Track activity and auto-unlock achievements
function trackActivity(activityType, value = 1) {
  if (!state.user) return; // Don't track for unauthenticated users
  
  const log = getActivityLog();
  const today = new Date().toDateString();
  
  // Reset daily counters if new day
  if (log.lastUpdated !== today) {
    log.wordsWrittenToday = 0;
    log.lastUpdated = today;
  }
  
  switch(activityType) {
    case 'words':
      log.wordsWrittenToday += value;
      log.totalWordsThisMonth = (log.totalWordsThisMonth || 0) + value;
      break;
    case 'login':
      // Track weekly logins
      if (!log.loginDaysThisWeek.includes(today)) {
        log.loginDaysThisWeek.push(today);
        // Keep only last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        log.loginDaysThisWeek = log.loginDaysThisWeek.filter(d => new Date(d) >= weekAgo);
      }
      // Track monthly logins
      if (!log.loginDaysThisMonth) log.loginDaysThisMonth = [];
      if (!log.loginDaysThisMonth.includes(today)) {
        log.loginDaysThisMonth.push(today);
      }
      break;
    case 'aiConsultation':
      log.aiConsultations = (log.aiConsultations || 0) + value;
      break;
    case 'ideaAdopt':
      log.ideasAdopted = (log.ideasAdopted || 0) + value;
      break;
    case 'analysis':
      log.analysisPerformed = (log.analysisPerformed || 0) + value;
      break;
    case 'chapterComplete':
      log.chaptersWritten = (log.chaptersWritten || 0) + value;
      break;
  }
  
  saveActivityLog(log);
  
  // Optionally show achievement unlock notification
  // (removed auto-alert to reduce interruptions)
}

// This function is no longer used - achievements are calculated real-time in generateAutoAchievements
function checkAchievementsFromLog(log) {
  // Deprecated - achievements are now calculated dynamically
  return [];
}

// Check completion and update badge history (auto-tracked version)
function checkAndUpdateBadgeHistory() {
  const activityLog = getActivityLog();
  const monthlyGoals = generateAutoAchievements(activityLog);
  const completedCount = monthlyGoals.filter(g => g.completed).length;
  const totalCount = monthlyGoals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const history = getBadgeHistory();
  const currentMonth = new Date().getMonth().toString() + '-' + new Date().getFullYear().toString();
  const currentDay = new Date().getDate();
  const userId = state.user?.id || 'anonymous';
  const lastBadgeMonth = localStorage.getItem(`lastBadgeMonth_${userId}`);
  const lastBadgeTier = localStorage.getItem(`lastBadgeTier_${userId}`) || '';
  
  // Check if it's the 25th or later and we should finalize this month
  const shouldFinalize = currentDay >= 25;
  
  // Determine current tier
  let currentTier = '';
  if (progressPercent >= 100) currentTier = 'platinum';
  else if (progressPercent >= 80) currentTier = 'gold';
  else if (progressPercent >= 60) currentTier = 'silver';
  else if (progressPercent >= 40) currentTier = 'bronze';
  else if (progressPercent > 0) currentTier = 'encouragement';
  
  // Award badge on the 25th if not already awarded this month
  const isNewMonth = lastBadgeMonth !== currentMonth;
  const isHigherTier = currentTier && getTierRank(currentTier) > getTierRank(lastBadgeTier);
  
  if (shouldFinalize && currentTier && (isNewMonth || isHigherTier)) {
    // If same month but higher tier, remove old tier badge first
    if (!isNewMonth && isHigherTier && lastBadgeTier) {
      history[lastBadgeTier] = Math.max(0, (history[lastBadgeTier] || 0) - 1);
    }
    
    // Add new tier badge
    history[currentTier]++;
    localStorage.setItem(`lastBadgeMonth_${userId}`, currentMonth);
    localStorage.setItem(`lastBadgeTier_${userId}`, currentTier);
    localStorage.setItem(`lastAchievementReset_${userId}`, currentMonth);
    saveBadgeHistory(history);
    
    // Show congratulation message
    const tierNames = { platinum: 'プラチナ', gold: 'ゴールド', silver: 'シルバー', bronze: 'ブロンズ', encouragement: '頑張ってね' };
    alert(`🎉 今月の実績確定！「${tierNames[currentTier]}」バッジを獲得しました！`);
    
    // Reset activity log for next month
    resetActivityLogForNewMonth();
  }
}

function resetActivityLogForNewMonth() {
  const newLog = createNewActivityLog();
  localStorage.setItem(getActivityLogKey(), JSON.stringify(newLog));
}

function getTierRank(tier) {
  const ranks = { '': 0, encouragement: 1, bronze: 2, silver: 3, gold: 4, platinum: 5 };
  return ranks[tier] || 0;
}

window.generateMonthlyAchievements = async () => {
  if (!state.user) return;
  
  state.aiGenerating = true;
  render();
  
  try {
    // Get writing stats
    const stats = {
      totalWords: state.currentWriting?.content?.length || 0,
      projectCount: state.projects?.length || 0,
      ideasCount: state.ideas?.length || 0,
      plotCompleted: state.plot?.structure ? true : false,
    };
    
    const res = await api.post('/ai/generate', {
      action: 'achievement',
      content: JSON.stringify(stats),
      projectId: state.currentProject?.id,
      userId: state.user.id,
    });
    
    // Parse AI response to create personalized achievements
    const aiResponse = res.data.result;
    console.log('AI Achievement Response:', aiResponse);
    
    // Try to extract JSON from response
    const jsonMatch = aiResponse.match(/\\[.*\\]/s);
    if (jsonMatch) {
      try {
        const newAchievements = JSON.parse(jsonMatch[0]);
        state.monthlyAchievements = newAchievements.map((a, i) => ({
          id: i + 1,
          title: a.badge_title || a.title,
          description: a.badge_description || a.description,
          emoji: getEmojiForAchievement(a.badge_type || a.type),
          completed: false,
        }));
        localStorage.setItem('monthlyAchievements', JSON.stringify(state.monthlyAchievements));
        localStorage.setItem('achievementMonth', new Date().getMonth().toString());
      } catch (e) {
        console.error('Failed to parse AI achievements:', e);
        // Use default goals on parse failure
        state.monthlyAchievements = getDefaultMonthlyGoals();
      }
    } else {
      state.monthlyAchievements = getDefaultMonthlyGoals();
    }
  } catch (error) {
    console.error('Achievement generation error:', error);
    state.monthlyAchievements = getDefaultMonthlyGoals();
  }
  
  state.aiGenerating = false;
  render();
};

function getEmojiForAchievement(type) {
  const emojiMap = {
    'writing': '✍️', 'words': '📝', 'login': '📅', 'ai': '🤖', 
    'plot': '📖', 'idea': '💡', 'analysis': '📊', 'streak': '🔥',
    'milestone': '🏆', 'creative': '🎨', 'completion': '✅', 'challenge': '💪'
  };
  return emojiMap[type] || '⭐';
}

// Load achievements from localStorage on init
function loadAchievements() {
  const savedMonth = localStorage.getItem('achievementMonth');
  const currentMonth = new Date().getMonth().toString();
  
  if (savedMonth === currentMonth) {
    const saved = localStorage.getItem('monthlyAchievements');
    if (saved) {
      state.monthlyAchievements = JSON.parse(saved);
    }
  } else {
    // New month, reset achievements
    state.monthlyAchievements = getDefaultMonthlyGoals();
    localStorage.setItem('monthlyAchievements', JSON.stringify(state.monthlyAchievements));
    localStorage.setItem('achievementMonth', currentMonth);
  }
}

function renderChat() {
  const container = $('#chat-messages');
  if (container) {
    container.innerHTML = renderChatMessages();
    container.scrollTop = container.scrollHeight;
  }
}

function renderRightSidebar() {
  // 執筆タブ以外では表示しない
  if (state.currentTab !== 'writing') return '';
  
  // 折りたたみ状態の場合はフローティングボタンのみ表示
  if (state.rightSidebarCollapsed) {
    return `
      <button onclick="toggleRightSidebar()" 
        class="fixed right-4 bottom-20 md:bottom-24 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:from-indigo-700 hover:to-purple-700 transition group"
        title="AIパートナーを開く">
        <i class="fas fa-robot text-xl group-hover:scale-110 transition"></i>
      </button>
    `;
  }
  
  // 展開状態
  return `
    <aside class="sidebar-right fixed right-0 top-14 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-30 shadow-xl animate-slide-in-right">
      <div class="p-4 space-y-4">
        <!-- ヘッダー（折りたたみボタン付き） -->
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            <i class="fas fa-robot mr-1"></i>${t('ui.aiPartner')}
          </h3>
          <button onclick="toggleRightSidebar()" 
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            title="閉じる">
            <i class="fas fa-times text-gray-400"></i>
          </button>
        </div>
        
        <!-- AI Generating Status / Cancel -->
        ${state.aiGenerating ? `
        <div class="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4 space-y-2">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-indigo-700 dark:text-indigo-300 text-sm font-medium">${t('common.loading')}</span>
          </div>
          <button onclick="cancelAIGeneration()"
            class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition flex items-center justify-center gap-2">
            <i class="fas fa-times-circle"></i>
            ${t('common.cancel')}
          </button>
        </div>
        ` : ''}
        
        <!-- Quick Actions -->
        <div class="space-y-2 ${state.aiGenerating ? 'opacity-50 pointer-events-none' : ''}">
          <p class="text-xs text-gray-500">${t('ui.quickActions')}</p>
          <div class="grid grid-cols-2 gap-2">
            ${[
              { action: 'continue', icon: 'fa-forward', label: t('ai.continue') },
              { action: 'rewrite', icon: 'fa-sync', label: t('ai.rewrite') },
              { action: 'expand', icon: 'fa-expand-alt', label: t('ai.expand') },
              { action: 'proofread', icon: 'fa-spell-check', label: t('ai.proofread') },
              { action: 'summarize', icon: 'fa-compress-alt', label: t('ai.summarize') },
              { action: 'translate', icon: 'fa-language', label: t('ai.translate') },
              { action: 'title', icon: 'fa-heading', label: t('ai.titleSuggestion') },
            ].map(btn => `
              <button onclick="handleQuickAction('${btn.action}')"
                class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                ${state.aiGenerating ? 'disabled' : ''}>
                <i class="fas ${btn.icon} text-indigo-500"></i>
                <span>${btn.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- Style Conversion -->
        <div class="space-y-2">
          <p class="text-xs text-gray-500">文体変換</p>
          <div class="flex gap-2">
            ${['formal', 'casual', 'literary'].map(style => `
              <button onclick="handleStyleConvert('${style}')"
                class="flex-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                ${state.aiGenerating ? 'disabled' : ''}>
                ${t(`ai.${style}`)}
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- Custom Prompt -->
        <div class="space-y-2">
          <p class="text-xs text-gray-500">${t('ai.customPrompt')}</p>
          <textarea id="custom-prompt" rows="3" 
            class="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 resize-none"
            placeholder="${t('ui.enterCustomPrompt')}"></textarea>
          <div class="flex gap-2">
            <input type="number" id="target-words" placeholder="${t('ai.targetWords')}"
              class="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <button onclick="handleCustomAction()"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              ${state.aiGenerating ? 'disabled' : ''}>
              ${state.aiGenerating ? '<div class="spinner"></div>' : t('ai.generate')}
            </button>
          </div>
        </div>
        
        <!-- AI Response History -->
        <div class="space-y-2">
          <p class="text-xs text-gray-500">${t('ui.aiResponseHistory')}</p>
          <div id="ai-history" class="max-h-48 overflow-y-auto space-y-2">
            <p class="text-sm text-gray-400 italic">${t('ui.historyEmptyHint')}</p>
          </div>
        </div>
      </div>
    </aside>
  `;
}

// 右サイドバーの切り替え
window.toggleRightSidebar = () => {
  state.rightSidebarCollapsed = !state.rightSidebarCollapsed;
  render();
};

function renderAISidebar() {
  const sidebar = $('.sidebar-right');
  if (sidebar) {
    sidebar.innerHTML = renderRightSidebar().replace(/<aside[^>]*>|<\/aside>/g, '');
  }
}

function renderMobileNav() {
  // 没入モード時はナビを非表示
  const hideClass = state.mobileImmersiveMode ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100';
  return `
    <nav id="mobile-nav" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 z-50 md:hidden transition-all duration-300 ${hideClass}">
      ${['home', 'write', 'manage', 'settings'].map(nav => `
        <button onclick="handleMobileNav('${nav}')" class="flex flex-col items-center p-2 ${state.currentTab === (nav === 'home' ? 'settings_materials' : nav === 'write' ? 'writing' : nav === 'manage' ? 'settings_materials' : 'settings_materials') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}">
          <i class="fas ${nav === 'home' ? 'fa-home' : nav === 'write' ? 'fa-pen' : nav === 'manage' ? 'fa-folder' : 'fa-cog'}"></i>
          <span class="text-xs mt-1">${t(`nav.${nav}`)}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function renderMobileFAB() {
  // 没入モード時またはキーボード表示時はFABを非表示
  const hideClass = (state.mobileImmersiveMode || state.mobileKeyboardVisible) ? 'scale-0 opacity-0' : 'scale-100 opacity-100';
  return `
    <button id="mobile-fab" onclick="openMobileAI()" 
      class="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 md:hidden transition-all duration-300 ${hideClass}">
      <i class="fas fa-robot text-xl"></i>
    </button>
  `;
}

// ============================================
// Mobile Immersive Mode Functions
// ============================================

// 没入モード切り替え
function toggleMobileImmersiveMode(enable) {
  if (window.innerWidth >= 768) return; // PC時は無効
  
  state.mobileImmersiveMode = enable;
  
  const nav = document.getElementById('mobile-nav');
  const fab = document.getElementById('mobile-fab');
  const tabs = document.querySelector('.mobile-tabs-header');
  
  if (nav) {
    nav.classList.toggle('translate-y-full', enable);
    nav.classList.toggle('opacity-0', enable);
  }
  
  if (fab) {
    fab.classList.toggle('scale-0', enable);
    fab.classList.toggle('opacity-0', enable);
  }
  
  if (tabs) {
    tabs.classList.toggle('-translate-y-full', enable);
    tabs.classList.toggle('opacity-0', enable);
  }
}

// キーボード表示検知
function setupMobileKeyboardDetection() {
  if (window.innerWidth >= 768) return;
  
  // visualViewport APIを使用してキーボード検知
  if (window.visualViewport) {
    let initialHeight = window.visualViewport.height;
    
    window.visualViewport.addEventListener('resize', () => {
      const currentHeight = window.visualViewport.height;
      const heightDiff = initialHeight - currentHeight;
      
      // 高さが150px以上減少したらキーボード表示と判定
      if (heightDiff > 150) {
        state.mobileKeyboardVisible = true;
        toggleMobileImmersiveMode(true);
        updateMobileFABVisibility();
      } else if (heightDiff < 50) {
        state.mobileKeyboardVisible = false;
        // キーボードが閉じたら少し遅延して没入モード解除
        setTimeout(() => {
          if (!state.mobileKeyboardVisible) {
            toggleMobileImmersiveMode(false);
            updateMobileFABVisibility();
          }
        }, 100);
      }
    });
  }
  
  // フォールバック: focus/blurイベント
  document.addEventListener('focusin', (e) => {
    if (window.innerWidth >= 768) return;
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.contentEditable === 'true') {
      state.mobileKeyboardVisible = true;
      toggleMobileImmersiveMode(true);
      updateMobileFABVisibility();
    }
  });
  
  document.addEventListener('focusout', (e) => {
    if (window.innerWidth >= 768) return;
    setTimeout(() => {
      const activeEl = document.activeElement;
      if (activeEl.tagName !== 'TEXTAREA' && activeEl.tagName !== 'INPUT' && activeEl.contentEditable !== 'true') {
        state.mobileKeyboardVisible = false;
        toggleMobileImmersiveMode(false);
        updateMobileFABVisibility();
      }
    }, 100);
  });
}

// FABの表示状態を更新
function updateMobileFABVisibility() {
  const fab = document.getElementById('mobile-fab');
  if (!fab) return;
  
  const shouldHide = state.mobileImmersiveMode || state.mobileKeyboardVisible;
  fab.classList.toggle('scale-0', shouldHide);
  fab.classList.toggle('opacity-0', shouldHide);
}

// スクロール時の没入モード制御
function setupMobileScrollImmersion() {
  let lastScrollY = 0;
  let scrollTimeout;
  
  document.addEventListener('scroll', (e) => {
    if (window.innerWidth >= 768) return;
    if (state.mobileKeyboardVisible) return; // キーボード表示中は無視
    
    const target = e.target;
    if (!target.closest || !target.closest('#editor, .settings-content, .mobile-accordion')) return;
    
    const currentScrollY = target.scrollTop || 0;
    const scrollDiff = currentScrollY - lastScrollY;
    
    // 下スクロール時は没入モード
    if (scrollDiff > 10) {
      toggleMobileImmersiveMode(true);
    }
    
    // 上スクロール時は解除（少し遅延）
    if (scrollDiff < -10) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!state.mobileKeyboardVisible) {
          toggleMobileImmersiveMode(false);
        }
      }, 150);
    }
    
    lastScrollY = currentScrollY;
  }, true);
}

// アコーディオンセクションの切り替え
function toggleMobileAccordion(sectionId) {
  state.mobileAccordionSections[sectionId] = !state.mobileAccordionSections[sectionId];
  
  const content = document.getElementById(`accordion-content-${sectionId}`);
  const icon = document.getElementById(`accordion-icon-${sectionId}`);
  
  if (content) {
    content.classList.toggle('hidden', !state.mobileAccordionSections[sectionId]);
    content.classList.toggle('accordion-open', state.mobileAccordionSections[sectionId]);
  }
  
  if (icon) {
    icon.style.transform = state.mobileAccordionSections[sectionId] ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

function renderModals() {
  return `
    <!-- New Project Modal -->
    <div id="modal-newProject" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'newProject')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('newProject')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4">${t('sidebar.newProject')}</h3>
        <form id="new-project-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">タイトル</label>
            <input type="text" id="new-project-title" required
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">ジャンル（複数選択可）</label>
            <div class="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto p-2 border rounded-lg dark:border-gray-600 text-sm">
              ${getGenreOptions().map(g => `
                <label class="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                  <input type="checkbox" name="new-project-genre" value="${g.value}" class="rounded">
                  <span class="truncate">${g.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal('newProject')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              ${t('common.cancel')}
            </button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Settings Modal -->
    <div id="modal-settings" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'settings')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('settings')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-cog mr-2"></i>${t('nav.settings')}</h3>
        <div class="space-y-4">
          <!-- Theme -->
          <div>
            <label class="block text-sm font-medium mb-2">${t('settings.theme')}</label>
            <div class="flex gap-2">
              <button type="button" onclick="setTheme('light')" class="flex-1 px-4 py-2 rounded-lg ${state.theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}">
                <i class="fas fa-sun mr-1"></i>${t('settings.lightMode')}
              </button>
              <button type="button" onclick="setTheme('dark')" class="flex-1 px-4 py-2 rounded-lg ${state.theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}">
                <i class="fas fa-moon mr-1"></i>${t('settings.darkMode')}
              </button>
            </div>
          </div>
          
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p class="text-sm text-green-700 dark:text-green-300">
              <i class="fas fa-gift mr-1"></i>${t('settings.betaNote')}
            </p>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700">
          
          <!-- Account Section -->
          <div>
            <h4 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              <i class="fas fa-user-cog mr-1"></i>${t('settings.account')}
            </h4>
            
            <!-- Change Password -->
            <button type="button" onclick="openModal('changePassword')" class="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
              <i class="fas fa-key w-5"></i>
              <span>${t('settings.changePassword')}</span>
              <i class="fas fa-chevron-right ml-auto text-gray-400"></i>
            </button>
            
            <!-- Terms & Privacy -->
            <button type="button" onclick="openModal('legal')" class="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
              <i class="fas fa-file-contract w-5"></i>
              <span>${t('settings.termsPrivacy')}</span>
              <i class="fas fa-chevron-right ml-auto text-gray-400"></i>
            </button>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-700">
          
          <button type="button" onclick="logout()" class="w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <i class="fas fa-sign-out-alt mr-1"></i>${t('settings.logout')}
          </button>
          
          <!-- Delete Account -->
          <button type="button" onclick="openModal('deleteAccount')" class="w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm">
            <i class="fas fa-trash-alt mr-1"></i>${t('settings.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Change Password Modal -->
    <div id="modal-changePassword" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'changePassword')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('changePassword')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-key mr-2"></i>${t('settings.changePassword')}</h3>
        <form onsubmit="handleChangePassword(event)" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('settings.currentPassword')}</label>
            <input type="password" id="current-password" required
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="••••••••">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('settings.newPassword')}</label>
            <input type="password" id="new-password" required minlength="6"
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="••••••••">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('settings.confirmNewPassword')}</label>
            <input type="password" id="confirm-new-password" required minlength="6"
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="••••••••">
          </div>
          <div id="password-error" class="hidden text-red-500 text-sm"></div>
          <button type="submit" class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ${t('settings.changePassword')}
          </button>
        </form>
      </div>
    </div>
    
    <!-- Delete Account Modal -->
    <div id="modal-deleteAccount" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'deleteAccount')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('deleteAccount')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-center mb-4">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-red-600">${t('settings.deleteAccount')}</h3>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
          <p class="text-sm text-red-700 dark:text-red-300">
            <strong>${t('settings.deleteWarning')}</strong><br>
            ${t('settings.deleteWarningDetail')}
          </p>
        </div>
        <form onsubmit="handleDeleteAccount(event)" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('settings.confirmEmail')}</label>
            <input type="email" id="delete-confirm-email" required
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="${state.user?.email || ''}">
            <p class="text-xs text-gray-500 mt-1">${t('settings.confirmEmailHint')}</p>
          </div>
          <div id="delete-error" class="hidden text-red-500 text-sm"></div>
          <div class="flex gap-3">
            <button type="button" onclick="closeModal('deleteAccount')" class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              ${t('common.cancel')}
            </button>
            <button type="submit" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
              ${t('settings.deleteAccountConfirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Legal (Terms & Privacy) Modal -->
    <div id="modal-legal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'legal')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl m-4 animate-fade-in relative max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('legal')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-file-contract mr-2"></i>${t('settings.termsPrivacy')}</h3>
        
        <!-- Tab buttons -->
        <div class="flex gap-2 mb-4 border-b dark:border-gray-700 pb-2">
          <button type="button" onclick="switchLegalTab('terms')" id="legal-tab-terms" class="px-4 py-2 rounded-t-lg font-medium text-indigo-600 border-b-2 border-indigo-600">
            ${t('legal.terms')}
          </button>
          <button type="button" onclick="switchLegalTab('privacy')" id="legal-tab-privacy" class="px-4 py-2 rounded-t-lg font-medium text-gray-500 hover:text-gray-700">
            ${t('legal.privacy')}
          </button>
        </div>
        
        <!-- Terms Content -->
        <div id="legal-content-terms" class="prose dark:prose-invert max-w-none text-sm">
          <h4>${t('legal.termsTitle')}</h4>
          <p class="text-gray-500 text-xs mb-4">${t('legal.lastUpdated')}: 2024年2月19日</p>
          
          <h5>1. ${t('legal.termsAcceptance')}</h5>
          <p>${t('legal.termsAcceptanceText')}</p>
          
          <h5>2. ${t('legal.termsService')}</h5>
          <p>${t('legal.termsServiceText')}</p>
          
          <h5>3. ${t('legal.termsUserContent')}</h5>
          <p>${t('legal.termsUserContentText')}</p>
          
          <h5>4. ${t('legal.termsAI')}</h5>
          <p>${t('legal.termsAIText')}</p>
          
          <h5>5. ${t('legal.termsProhibited')}</h5>
          <p>${t('legal.termsProhibitedText')}</p>
          
          <h5>6. ${t('legal.termsTermination')}</h5>
          <p>${t('legal.termsTerminationText')}</p>
        </div>
        
        <!-- Privacy Content -->
        <div id="legal-content-privacy" class="prose dark:prose-invert max-w-none text-sm hidden">
          <h4>${t('legal.privacyTitle')}</h4>
          <p class="text-gray-500 text-xs mb-4">${t('legal.lastUpdated')}: 2024年2月19日</p>
          
          <h5>1. ${t('legal.privacyCollect')}</h5>
          <p>${t('legal.privacyCollectText')}</p>
          
          <h5>2. ${t('legal.privacyUse')}</h5>
          <p>${t('legal.privacyUseText')}</p>
          
          <h5>3. ${t('legal.privacyAI')}</h5>
          <p>${t('legal.privacyAIText')}</p>
          
          <h5>4. ${t('legal.privacyShare')}</h5>
          <p>${t('legal.privacyShareText')}</p>
          
          <h5>5. ${t('legal.privacySecurity')}</h5>
          <p>${t('legal.privacySecurityText')}</p>
          
          <h5>6. ${t('legal.privacyRights')}</h5>
          <p>${t('legal.privacyRightsText')}</p>
          
          <h5>7. ${t('legal.privacyContact')}</h5>
          <p>${t('legal.privacyContactText')}</p>
        </div>
      </div>
    </div>
    
    <!-- Calendar Modal -->
    <div id="modal-calendar" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'calendar')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl m-4 animate-fade-in max-h-[90vh] overflow-y-auto relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('calendar')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition z-10">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-calendar-alt mr-2"></i>${t('sidebar.calendar')}</h3>
        <div id="calendar-container"></div>
      </div>
    </div>
    
    <!-- AI Result Modal -->
    <div id="modal-aiResult" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'aiResult')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl m-4 animate-fade-in max-h-[80vh] overflow-y-auto relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('aiResult')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-magic mr-2 text-indigo-500"></i>AI生成結果</h3>
        <div id="ai-result-content" class="prose dark:prose-invert max-w-none mb-4"></div>
        
        <!-- Copy button -->
        <div class="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
          <button type="button" onclick="copyAIResult()" class="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
            <i class="fas fa-copy"></i> コピー
          </button>
          <span id="copy-feedback" class="text-sm text-green-600 hidden">コピーしました！</span>
        </div>
        
        <!-- Apply options -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <i class="fas fa-exclamation-triangle text-yellow-500 mr-1"></i>
            適用方法を選択してください（既存の文章に影響します）
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <button type="button" onclick="applyAIResult('append')" class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-plus-circle"></i>
              <span class="text-sm">末尾に追加</span>
            </button>
            <button type="button" onclick="applyAIResult('prepend')" class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <i class="fas fa-arrow-up"></i>
              <span class="text-sm">先頭に追加</span>
            </button>
            <button type="button" onclick="applyAIResult('cursor')" class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <i class="fas fa-i-cursor"></i>
              <span class="text-sm">カーソル位置に挿入</span>
            </button>
            <button type="button" onclick="applyAIResult('replace')" class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              <i class="fas fa-exchange-alt"></i>
              <span class="text-sm">全て置換（注意）</span>
            </button>
          </div>
          <button type="button" onclick="closeModal('aiResult')" class="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            キャンセル
          </button>
        </div>
      </div>
    </div>
    
    <!-- Calendar Event Edit Modal -->
    <div id="modal-calendarEvent" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-[60] modal-backdrop" onclick="handleModalBackdropClick(event, 'calendarEvent')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('calendarEvent')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-edit mr-2"></i>イベント編集</h3>
        <div id="calendar-event-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">日付</label>
            <input type="date" id="event-date" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" readonly>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">タイトル</label>
            <input type="text" id="event-title" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="イベント名">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">説明</label>
            <textarea id="event-description" rows="3" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none" placeholder="メモ（任意）"></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="event-is-deadline" class="w-4 h-4 text-indigo-600 rounded">
            <label for="event-is-deadline" class="text-sm">締め切りとして設定</label>
          </div>
          <div class="flex justify-between gap-2 pt-2">
            <button type="button" id="event-delete-btn" onclick="deleteCalendarEvent()" class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg hidden">
              <i class="fas fa-trash mr-1"></i>削除
            </button>
            <div class="flex gap-2 ml-auto">
              <button type="button" onclick="closeModal('calendarEvent')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                キャンセル
              </button>
              <button type="button" onclick="saveCalendarEvent()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Library (Series) Modal -->
    <div id="modal-newLibrary" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'newLibrary')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('newLibrary')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4">
          <i class="fas fa-layer-group mr-2 text-purple-500"></i>${t('ui.createNewSeries')}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          ${t('ui.seriesCreateHint')}
        </p>
        <form id="new-library-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('ui.seriesName')}</label>
            <input type="text" id="new-library-title" required placeholder="例: 異世界冒険譚シリーズ"
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('ui.seriesDescOptional')}</label>
            <textarea id="new-library-description" rows="2" placeholder="シリーズの概要を入力..."
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">ジャンル（複数選択可）</label>
            <div class="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto p-2 border rounded-lg dark:border-gray-600 text-sm">
              ${getGenreOptions().map(g => `
                <label class="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                  <input type="checkbox" name="new-library-genre" value="${g.value}" class="rounded">
                  <span class="truncate text-xs">${g.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="closeModal('newLibrary')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              ${t('common.cancel')}
            </button>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <i class="fas fa-plus mr-1"></i>シリーズを作成
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Add Child Project to Library Modal -->
    <div id="modal-addChildProject" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'addChildProject')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg m-4 animate-fade-in relative max-h-[80vh] overflow-y-auto" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('addChildProject')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4">
          <i class="fas fa-plus-circle mr-2 text-green-500"></i>${t('ui.addEpisode')}
        </h3>
        <div id="add-child-project-content"></div>
      </div>
    </div>
    
    <!-- Edit Library Settings Modal -->
    <div id="modal-librarySettings" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'librarySettings')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-4xl m-4 animate-fade-in relative max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('librarySettings')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition z-10">
          <i class="fas fa-times"></i>
        </button>
        <div id="library-settings-content"></div>
      </div>
    </div>
  `;
}

// ============================================
// Event Handlers
// ============================================
function attachEventListeners() {
  // Mobile UI Initialization
  if (window.innerWidth < 768) {
    setupMobileKeyboardDetection();
    setupMobileScrollImmersion();
  }
  
  // Login form
  const loginForm = $('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#login-email').value;
      const password = $('#login-password').value;
      login(email, password);
    });
  }
  
  // Auth tab buttons (login/signup switcher)
  const loginTabBtn = $('#login-tab-btn');
  if (loginTabBtn) {
    loginTabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Login tab clicked');
      state.authMode = 'login';
      render();
    });
  }
  
  const signupTabBtn = $('#signup-tab-btn');
  if (signupTabBtn) {
    signupTabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Signup tab clicked');
      state.authMode = 'signup';
      render();
    });
  }
  
  // Signup form
  const signupForm = $('#signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#signup-name').value;
      const email = $('#signup-email').value;
      const password = $('#signup-password').value;
      const passwordConfirm = $('#signup-password-confirm').value;
      
      if (password !== passwordConfirm) {
        alert('パスワードが一致しません');
        return;
      }
      
      if (password.length < 6) {
        alert('パスワードは6文字以上で入力してください');
        return;
      }
      
      signup(name, email, password);
    });
  }
  
  // New project form
  const newProjectForm = $('#new-project-form');
  if (newProjectForm) {
    newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = $('#new-project-title').value;
      // Get selected genres (multiple)
      const genreCheckboxes = document.querySelectorAll('input[name="new-project-genre"]:checked');
      const genres = Array.from(genreCheckboxes).map(cb => cb.value);
      const genre = genres.length > 0 ? genres.join(', ') : 'fantasy';
      createProject(title, genre);
      closeModal('newProject');
    });
  }
  
  // New library (series) form
  const newLibraryForm = $('#new-library-form');
  if (newLibraryForm) {
    newLibraryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = $('#new-library-title').value.trim();
      const description = $('#new-library-description')?.value?.trim() || '';
      const genreCheckboxes = document.querySelectorAll('input[name="new-library-genre"]:checked');
      const genres = Array.from(genreCheckboxes).map(cb => cb.value);
      const genre = genres.length > 0 ? genres.join(', ') : '';
      createLibrary(title, description, genre);
      closeModal('newLibrary');
    });
  }
  
  // Chat form
  const chatForm = $('#chat-form');
  if (chatForm) {
    // Remove any existing listener to prevent duplicates
    const newChatForm = chatForm.cloneNode(true);
    chatForm.parentNode.replaceChild(newChatForm, chatForm);
    
    newChatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Chat form submitted');
      // Get input from the new cloned form, not the old one
      const input = newChatForm.querySelector('#chat-input');
      if (input && input.value.trim()) {
        console.log('Sending message:', input.value);
        const message = input.value;
        input.value = '';
        try {
          await sendChatMessage(message, 'consultation');
        } catch (error) {
          console.error('Chat error:', error);
        }
      }
    });
  }
  
  // Analysis chat form
  const analysisChatForm = $('#analysis-chat-form');
  if (analysisChatForm) {
    const newAnalysisForm = analysisChatForm.cloneNode(true);
    analysisChatForm.parentNode.replaceChild(newAnalysisForm, analysisChatForm);
    
    newAnalysisForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = newAnalysisForm.querySelector('#analysis-chat-input');
      if (input && input.value.trim()) {
        const message = input.value;
        input.value = '';
        await sendAnalysisChatMessage(message);
      }
    });
  }
  
  // Global search
  const searchInput = $('#global-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
      const query = e.target.value;
      if (query.length >= 2) {
        const res = await api.get(`/search?userId=${state.user.id}&q=${encodeURIComponent(query)}`);
        state.searchResults = res.data.results || [];
        // TODO: Show search results dropdown
      }
    }, 300));
  }
}

// Global functions
window.toggleSidebar = (side) => {
  state.sidebarOpen[side] = !state.sidebarOpen[side];
  render();
};

window.toggleZenMode = () => {
  state.zenMode = !state.zenMode;
  render();
};

// Exit ZEN mode with ESC key or clicking outside editor
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.zenMode) {
    state.zenMode = false;
    render();
  }
});

document.addEventListener('click', (e) => {
  if (state.zenMode) {
    const editor = document.getElementById('editor');
    const toolbar = e.target.closest('.flex.items-center.gap-2.p-2');
    // If clicked outside editor and toolbar, exit ZEN mode
    if (!editor?.contains(e.target) && !toolbar && !e.target.closest('button')) {
      state.zenMode = false;
      render();
    }
  }
});

// Save editor content before switching tabs or performing other actions
function saveEditorContent() {
  const editor = $('#editor');
  if (editor && state.currentWriting) {
    const currentContent = editor.value;
    if (currentContent !== state.currentWriting.content) {
      state.currentWriting.content = currentContent;
      // Trigger auto-save
      autoSaveDebounced(currentContent);
    }
  }
}

window.switchTab = (tab) => {
  // Save current editor content before switching
  saveEditorContent();
  
  state.currentTab = tab;
  render();
  
  // Initialize charts for analysis tab
  if (tab === 'analysis') {
    setTimeout(() => initCharts(), 100);
  }
};

window.selectProject = async (projectId) => {
  // Save current editor content before switching projects
  saveEditorContent();
  
  await loadProjectData(projectId);
  render();
};

// Project Menu Functions
window.toggleProjectMenu = (projectId) => {
  // Close all other menus first
  document.querySelectorAll('[id^="project-menu-"]').forEach(menu => {
    if (menu.id !== `project-menu-${projectId}`) {
      menu.classList.add('hidden');
    }
  });
  
  const menu = $(`#project-menu-${projectId}`);
  if (menu) {
    menu.classList.toggle('hidden');
  }
};

window.renameProject = async (projectId, currentTitle) => {
  // Close menu
  const menu = $(`#project-menu-${projectId}`);
  if (menu) menu.classList.add('hidden');
  
  const newTitle = prompt('新しいプロジェクト名を入力してください:', currentTitle);
  if (!newTitle || newTitle.trim() === '' || newTitle === currentTitle) {
    return;
  }
  
  try {
    await api.put(`/projects/${projectId}`, { title: newTitle.trim() });
    
    // Update local state
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      project.title = newTitle.trim();
    }
    if (state.currentProject?.id === projectId) {
      state.currentProject.title = newTitle.trim();
    }
    
    render();
    alert('プロジェクト名を変更しました');
  } catch (e) {
    console.error('Rename project error:', e);
    alert('名前の変更に失敗しました: ' + e.message);
  }
};

// Close project menus when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('[id^="project-menu-"]') && !e.target.closest('button[onclick*="toggleProjectMenu"]')) {
    document.querySelectorAll('[id^="project-menu-"]').forEach(menu => {
      menu.classList.add('hidden');
    });
  }
});

window.deleteProject = async (projectId, projectTitle) => {
  if (!confirm(`「${projectTitle}」を削除しますか？\n\nこの操作は取り消せません。プロジェクト内のすべてのデータ（執筆内容、プロット、アイデア等）が完全に削除されます。`)) {
    return;
  }
  
  try {
    await api.delete(`/projects/${projectId}`);
    
    // Remove from local state
    state.projects = state.projects.filter(p => p.id !== projectId);
    
    // If deleted project was current, clear selection
    if (state.currentProject?.id === projectId) {
      state.currentProject = null;
      state.writings = [];
      state.currentWriting = null;
      state.plot = null;
      state.ideas = [];
      state.characters = [];
      state.worldSettings = [];
    }
    
    render();
    alert('プロジェクトを削除しました');
  } catch (e) {
    console.error('Delete project error:', e);
    alert('削除に失敗しました: ' + e.message);
  }
};

// ============================================
// Library (Series/Parent-Child Project) Functions
// ============================================

// Create a new library (parent project for series)
window.createLibrary = async (title, description = '', genre = '') => {
  if (!state.user) {
    alert('ログインが必要です');
    return;
  }
  try {
    // Create a project with is_library flag
    const res = await api.post('/projects', {
      user_id: state.user.id,
      title,
      genre,
      is_library: true,
      library_settings: {
        description,
        shared_characters: '',
        shared_world_setting: '',
        shared_terminology: ''
      }
    });
    
    state.projects.unshift(res.data.project);
    state.currentProject = res.data.project;
    
    // Initialize expanded state
    if (!state.expandedLibraries) state.expandedLibraries = {};
    state.expandedLibraries[res.data.project.id] = true;
    
    render();
    alert(`シリーズ「${title}」を作成しました`);
  } catch (e) {
    console.error('Create library error:', e);
    alert('シリーズの作成に失敗しました: ' + e.message);
  }
};

// Toggle library expand/collapse
window.toggleLibraryExpand = (libraryId) => {
  if (!state.expandedLibraries) state.expandedLibraries = {};
  state.expandedLibraries[libraryId] = !state.expandedLibraries[libraryId];
  render();
};

// Toggle library menu visibility
window.toggleLibraryMenu = (libraryId) => {
  // Close all other menus
  document.querySelectorAll('[id^="library-menu-"]').forEach(menu => {
    if (menu.id !== `library-menu-${libraryId}`) {
      menu.classList.add('hidden');
    }
  });
  document.querySelectorAll('[id^="project-menu-"]').forEach(menu => menu.classList.add('hidden'));
  
  const menu = $(`#library-menu-${libraryId}`);
  if (menu) {
    menu.classList.toggle('hidden');
  }
};

// Open modal to add child project to library
window.openAddChildProjectModal = (libraryId) => {
  // Close any open menus
  document.querySelectorAll('[id^="library-menu-"]').forEach(menu => menu.classList.add('hidden'));
  
  const library = state.projects.find(p => p.id === libraryId);
  if (!library) return;
  
  // Get existing projects that could be added (not in any library and not libraries themselves)
  const availableProjects = state.projects.filter(p => !p.library_id && !p.is_library && p.id !== libraryId);
  
  const content = `
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      「${library.title}」に新しい話を追加します。
    </p>
    
    <!-- Create New -->
    <div class="mb-6">
      <h4 class="font-medium mb-3"><i class="fas fa-plus text-green-500 mr-2"></i>新しい話を作成</h4>
      <form id="create-child-project-form" class="space-y-3">
        <input type="hidden" id="child-project-library-id" value="${libraryId}">
        <div>
          <label class="block text-sm font-medium mb-1">タイトル</label>
          <input type="text" id="child-project-title" required placeholder="例: 第1話 冒険の始まり"
            class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="inherit-settings" checked class="rounded">
          <label for="inherit-settings" class="text-sm">シリーズの共通設定を継承する</label>
        </div>
        <button type="submit" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <i class="fas fa-plus mr-1"></i>作成して追加
        </button>
      </form>
    </div>
    
    ${availableProjects.length > 0 ? `
      <hr class="border-gray-200 dark:border-gray-700 my-4">
      
      <!-- Add Existing -->
      <div>
        <h4 class="font-medium mb-3"><i class="fas fa-link text-blue-500 mr-2"></i>既存のプロジェクトを追加</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          ${availableProjects.map(p => `
            <div class="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              onclick="addExistingProjectToLibrary('${libraryId}', '${p.id}')">
              <i class="fas fa-file-alt text-gray-400"></i>
              <span class="flex-1 truncate">${p.title}</span>
              <i class="fas fa-plus text-green-500"></i>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
  
  $('#add-child-project-content').innerHTML = content;
  
  // Attach form handler
  setTimeout(() => {
    const form = $('#create-child-project-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = $('#child-project-title').value.trim();
        const libraryId = $('#child-project-library-id').value;
        const inheritSettings = $('#inherit-settings').checked;
        createChildProject(libraryId, title, inheritSettings);
        closeModal('addChildProject');
      });
    }
  }, 100);
  
  openModal('addChildProject');
};

// Create a child project within a library
window.createChildProject = async (libraryId, title, inheritSettings = true) => {
  if (!state.user) {
    alert('ログインが必要です');
    return;
  }
  try {
    const library = state.projects.find(p => p.id === libraryId);
    if (!library) throw new Error('ライブラリが見つかりません');
    
    // Create child project linked to library
    const res = await api.post('/projects', {
      user_id: state.user.id,
      title,
      genre: library.genre || '',
      library_id: libraryId,
      inherit_settings: inheritSettings
    });
    
    // If inheriting settings, copy shared settings from library
    if (inheritSettings && library.library_settings) {
      const settings = library.library_settings;
      // Save shared settings to the new project's world settings
      if (settings.shared_characters) {
        await api.post(`/projects/${res.data.project.id}/world-settings`, {
          category: 'characters',
          title: 'キャラクター設定（シリーズ共通）',
          content: settings.shared_characters
        });
      }
      if (settings.shared_world_setting) {
        await api.post(`/projects/${res.data.project.id}/world-settings`, {
          category: 'world_building',
          title: '世界観設定（シリーズ共通）',
          content: settings.shared_world_setting
        });
      }
      if (settings.shared_terminology) {
        await api.post(`/projects/${res.data.project.id}/world-settings`, {
          category: 'terminology',
          title: '専門用語（シリーズ共通）',
          content: settings.shared_terminology
        });
      }
    }
    
    state.projects.unshift(res.data.project);
    state.currentProject = res.data.project;
    
    // Ensure library is expanded
    if (!state.expandedLibraries) state.expandedLibraries = {};
    state.expandedLibraries[libraryId] = true;
    
    render();
    alert(`「${title}」を作成し、シリーズに追加しました`);
  } catch (e) {
    console.error('Create child project error:', e);
    alert('作成に失敗しました: ' + e.message);
  }
};

// Add existing project to library
window.addExistingProjectToLibrary = async (libraryId, projectId) => {
  try {
    await api.put(`/projects/${projectId}`, { library_id: libraryId });
    
    // Update local state
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      project.library_id = libraryId;
    }
    
    closeModal('addChildProject');
    render();
    alert('プロジェクトをシリーズに追加しました');
  } catch (e) {
    console.error('Add to library error:', e);
    alert('追加に失敗しました: ' + e.message);
  }
};

// Remove project from library
window.removeFromLibrary = async (projectId) => {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  
  if (!confirm(`「${project.title}」をシリーズから外しますか？\n\nプロジェクト自体は削除されません。`)) {
    return;
  }
  
  try {
    await api.put(`/projects/${projectId}`, { library_id: null });
    
    // Update local state
    project.library_id = null;
    
    render();
    alert('シリーズから外しました');
  } catch (e) {
    console.error('Remove from library error:', e);
    alert('操作に失敗しました: ' + e.message);
  }
};

// Edit library shared settings
window.editLibrarySettings = async (libraryId) => {
  // Close menu
  document.querySelectorAll('[id^="library-menu-"]').forEach(menu => menu.classList.add('hidden'));
  
  const library = state.projects.find(p => p.id === libraryId);
  if (!library) return;
  
  const settings = library.library_settings || {};
  const childProjects = state.projects.filter(p => p.library_id === libraryId);
  
  const content = `
    <h3 class="text-lg font-semibold mb-4">
      <i class="fas fa-layer-group mr-2 text-purple-500"></i>
      「${library.title}」の共通設定
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      ここで設定した内容は、このシリーズに属するすべての話で共有されます。
    </p>
    
    <form id="library-settings-form" class="space-y-4">
      <input type="hidden" id="edit-library-id" value="${libraryId}">
      
      <!-- Series Description -->
      <div>
        <label class="block text-sm font-medium mb-1">
          <i class="fas fa-info-circle mr-1 text-blue-500"></i>シリーズの説明
        </label>
        <textarea id="library-description" rows="2" 
          class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          placeholder="シリーズの概要...">${settings.description || ''}</textarea>
      </div>
      
      <!-- Shared Characters -->
      <div>
        <label class="block text-sm font-medium mb-1">
          <i class="fas fa-users mr-1 text-green-500"></i>共通キャラクター設定
        </label>
        <textarea id="library-shared-characters" rows="6" 
          class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="シリーズ全体で登場するキャラクターの設定を記述...">${settings.shared_characters || ''}</textarea>
      </div>
      
      <!-- Shared World Setting -->
      <div>
        <label class="block text-sm font-medium mb-1">
          <i class="fas fa-globe mr-1 text-purple-500"></i>共通世界観設定
        </label>
        <textarea id="library-shared-world" rows="6" 
          class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="シリーズ全体の世界観、舞台設定を記述...">${settings.shared_world_setting || ''}</textarea>
      </div>
      
      <!-- Shared Terminology -->
      <div>
        <label class="block text-sm font-medium mb-1">
          <i class="fas fa-book mr-1 text-orange-500"></i>共通専門用語集
        </label>
        <textarea id="library-shared-terminology" rows="4" 
          class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="シリーズ固有の用語、ルールなどを記述...">${settings.shared_terminology || ''}</textarea>
      </div>
      
      <!-- Child Projects List -->
      ${childProjects.length > 0 ? `
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 class="font-medium mb-2">
            <i class="fas fa-list mr-1 text-indigo-500"></i>このシリーズの話 (${childProjects.length}話)
          </h4>
          <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            ${childProjects.map((p, i) => `
              <div class="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                <span class="text-gray-400">${i + 1}.</span>
                <span class="truncate">${p.title}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Sync Settings Button -->
      ${childProjects.length > 0 ? `
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <p class="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
            <i class="fas fa-sync mr-1"></i>
            保存後、共通設定を各話に反映しますか？
          </p>
          <label class="flex items-center gap-2">
            <input type="checkbox" id="sync-to-children" class="rounded" checked>
            <span class="text-sm">各話の設定を更新する</span>
          </label>
        </div>
      ` : ''}
      
      <div class="flex justify-end gap-2 pt-4">
        <button type="button" onclick="closeModal('librarySettings')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          キャンセル
        </button>
        <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <i class="fas fa-save mr-1"></i>${t('common.save')}
        </button>
      </div>
    </form>
  `;
  
  $('#library-settings-content').innerHTML = content;
  
  // Attach form handler
  setTimeout(() => {
    const form = $('#library-settings-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveLibrarySettings();
      });
    }
  }, 100);
  
  openModal('librarySettings');
};

// Save library settings
window.saveLibrarySettings = async () => {
  const libraryId = $('#edit-library-id').value;
  const description = $('#library-description')?.value?.trim() || '';
  const sharedCharacters = $('#library-shared-characters')?.value || '';
  const sharedWorld = $('#library-shared-world')?.value || '';
  const sharedTerminology = $('#library-shared-terminology')?.value || '';
  const syncToChildren = $('#sync-to-children')?.checked || false;
  
  try {
    // Update library settings
    await api.put(`/projects/${libraryId}`, {
      library_settings: {
        description,
        shared_characters: sharedCharacters,
        shared_world_setting: sharedWorld,
        shared_terminology: sharedTerminology
      }
    });
    
    // Update local state
    const library = state.projects.find(p => p.id === libraryId);
    if (library) {
      library.library_settings = {
        description,
        shared_characters: sharedCharacters,
        shared_world_setting: sharedWorld,
        shared_terminology: sharedTerminology
      };
    }
    
    // Sync to child projects if requested
    if (syncToChildren) {
      const childProjects = state.projects.filter(p => p.library_id === libraryId);
      for (const child of childProjects) {
        // Update world settings for each child
        if (sharedCharacters) {
          await api.post(`/projects/${child.id}/world-settings`, {
            category: 'characters',
            title: 'キャラクター設定（シリーズ共通）',
            content: sharedCharacters
          });
        }
        if (sharedWorld) {
          await api.post(`/projects/${child.id}/world-settings`, {
            category: 'world_building',
            title: '世界観設定（シリーズ共通）',
            content: sharedWorld
          });
        }
        if (sharedTerminology) {
          await api.post(`/projects/${child.id}/world-settings`, {
            category: 'terminology',
            title: '専門用語（シリーズ共通）',
            content: sharedTerminology
          });
        }
      }
      alert(`共通設定を保存し、${childProjects.length}話に反映しました`);
    } else {
      alert('共通設定を保存しました');
    }
    
    closeModal('librarySettings');
    render();
  } catch (e) {
    console.error('Save library settings error:', e);
    alert('保存に失敗しました: ' + e.message);
  }
};

window.openModal = async (name) => {
  // Save editor content before opening modal
  saveEditorContent();
  
  if (name === 'trash') await loadTrash();
  if (name === 'calendar') {
    const now = new Date();
    await loadCalendarEvents(now.getFullYear(), now.getMonth() + 1);
    setTimeout(() => renderCalendar(), 100);
  }
  $(`#modal-${name}`)?.classList.remove('hidden');
};

window.closeModal = (name) => {
  console.log('closeModal called:', name);
  $(`#modal-${name}`)?.classList.add('hidden');
};

// 実績モーダルを開く
window.openAchievementModal = () => {
  // モーダルが存在しなければ作成
  let modal = $('#modal-achievements');
  if (!modal) {
    const modalHtml = `
      <div id="modal-achievements" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick="if(event.target===this)closeModal('achievements')">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-hidden animate-fade-in" onclick="event.stopPropagation()">
          <div id="achievements-modal-content">
            ${renderAchievementsContent()}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  } else {
    // 内容を更新
    $('#achievements-modal-content').innerHTML = renderAchievementsContent();
  }
  $('#modal-achievements')?.classList.remove('hidden');
};

// 実績コンテンツのレンダリング
function renderAchievementsContent() {
  const currentMonth = new Date().toLocaleString(state.language === 'ja' ? 'ja-JP' : 'en-US', { month: 'long', year: 'numeric' });
  const activityLog = getActivityLog();
  const monthlyGoals = generateAutoAchievements(activityLog);
  const completedCount = monthlyGoals.filter(g => g.completed).length;
  const totalCount = monthlyGoals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const badgeTier = getBadgeTier(progressPercent);
  
  return `
    <div class="p-6">
      <!-- ヘッダー -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <i class="fas fa-trophy text-4xl ${badgeTier.color}"></i>
          <div>
            <h2 class="text-xl font-bold">${t('achievement.title')}</h2>
            <p class="text-sm text-gray-500">${currentMonth}</p>
          </div>
        </div>
        <button onclick="closeModal('achievements')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <i class="fas fa-times text-gray-500"></i>
        </button>
      </div>
      
      <!-- 進捗バー -->
      <div class="mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 dark:text-gray-400">${t('achievement.progress')}</span>
          <span class="font-bold">${completedCount}/${totalCount} (${progressPercent}%)</span>
        </div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-500 rounded-full" style="width: ${progressPercent}%"></div>
        </div>
      </div>
      
      <!-- バッジ表示 -->
      <div class="grid grid-cols-5 gap-2 mb-6">
        ${renderBadgeTiers(progressPercent)}
      </div>
      
      <!-- 目標リスト -->
      <div class="space-y-2 max-h-64 overflow-y-auto">
        ${monthlyGoals.map(goal => `
          <div class="flex items-center gap-3 p-3 rounded-lg ${goal.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'}">
            <div class="w-8 h-8 flex items-center justify-center rounded-full ${goal.completed ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}">
              <i class="fas ${goal.completed ? 'fa-check' : 'fa-circle'}"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium ${goal.completed ? 'text-green-700 dark:text-green-300' : ''}">${goal.title}</p>
              <p class="text-sm text-gray-500">${goal.progress}</p>
            </div>
            <span class="text-xl">${goal.emoji}</span>
          </div>
        `).join('')}
      </div>
      
      <p class="text-xs text-gray-500 text-center mt-4">
        <i class="fas fa-info-circle mr-1"></i>
        実績は執筆活動に基づいて自動的に更新されます
      </p>
    </div>
  `;
}

// Handle backdrop click to close modal
window.handleModalBackdropClick = (event, name) => {
  // Only close if clicking directly on the backdrop (not on the modal content)
  if (event.target === event.currentTarget) {
    console.log('Backdrop clicked, closing modal:', name);
    closeModal(name);
  }
};

// ============================================
// Calendar Event Functions
// ============================================
let currentEditingEvent = null;

window.openCalendarDay = async (dateStr) => {
  // Check if there's an existing event for this date
  const existingEvent = state.calendarEvents.find(e => e.event_date === dateStr);
  
  if (existingEvent) {
    // Edit existing event
    currentEditingEvent = existingEvent;
    $('#event-date').value = dateStr;
    $('#event-title').value = existingEvent.title || '';
    $('#event-description').value = existingEvent.description || '';
    $('#event-is-deadline').checked = existingEvent.is_deadline || false;
    $('#event-delete-btn')?.classList.remove('hidden');
  } else {
    // Create new event
    currentEditingEvent = null;
    $('#event-date').value = dateStr;
    $('#event-title').value = '';
    $('#event-description').value = '';
    $('#event-is-deadline').checked = false;
    $('#event-delete-btn')?.classList.add('hidden');
  }
  
  $(`#modal-calendarEvent`)?.classList.remove('hidden');
};

window.saveCalendarEvent = async () => {
  const dateStr = $('#event-date').value;
  const title = $('#event-title').value.trim();
  const description = $('#event-description').value.trim();
  const isDeadline = $('#event-is-deadline').checked;
  
  if (!title) {
    alert('タイトルを入力してください');
    return;
  }
  
  try {
    if (currentEditingEvent) {
      // Update existing event
      await api.put(`/calendar/${currentEditingEvent.id}`, {
        title,
        description,
        is_deadline: isDeadline
      });
    } else {
      // Create new event
      await api.post('/calendar', {
        user_id: state.user.id,
        project_id: state.currentProject?.id,
        event_date: dateStr,
        title,
        description,
        is_deadline: isDeadline
      });
    }
    
    // Reload calendar events
    const date = new Date(dateStr);
    await loadCalendarEvents(date.getFullYear(), date.getMonth() + 1);
    renderCalendar();
    closeModal('calendarEvent');
  } catch (error) {
    console.error('Failed to save calendar event:', error);
    alert('イベントの保存に失敗しました');
  }
};

window.deleteCalendarEvent = async () => {
  if (!currentEditingEvent) return;
  
  if (!confirm('このイベントを削除しますか？')) return;
  
  try {
    await api.delete(`/calendar/${currentEditingEvent.id}`);
    
    // Reload calendar events
    const date = new Date(currentEditingEvent.event_date);
    await loadCalendarEvents(date.getFullYear(), date.getMonth() + 1);
    renderCalendar();
    closeModal('calendarEvent');
    currentEditingEvent = null;
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
    alert('イベントの削除に失敗しました');
  }
};

window.handleGenerateIdeas = async () => {
  // Get selected genres (multiple)
  const genreCheckboxes = document.querySelectorAll('input[name="idea-genre"]:checked');
  const genres = Array.from(genreCheckboxes).map(cb => cb.value);
  const genre = genres.length > 0 ? genres.join(', ') : 'fantasy';
  
  const keywords = $('#idea-keywords')?.value || '';
  const count = parseInt($('#idea-count')?.value) || 5;
  
  const ideas = await generateIdeas(genre, keywords, count);
  
  // Save ideas to database
  for (const idea of ideas) {
    if (state.currentProject) {
      await api.post(`/projects/${state.currentProject.id}/ideas`, idea);
    }
  }
  
  // Reload ideas
  if (state.currentProject) {
    const res = await api.get(`/projects/${state.currentProject.id}/ideas`);
    state.ideas = res.data.ideas || [];
  }
  
  render();
};

window.adoptIdea = async (ideaId) => {
  try {
    await api.put(`/ideas/${ideaId}/adopt`);
    const idea = state.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.adopted = true;
      
      // Track idea adoption for achievements
      if (typeof trackActivity === 'function') {
        trackActivity('ideaAdopt', 1);
      }
      
      alert(`「${idea.title}」を採用しました！\nプロットタブの「採用したアイディア」セクションで確認できます。`);
    }
    render();
  } catch (e) {
    console.error('Adopt idea error:', e);
    alert('アイデアの採用に失敗しました');
  }
};

window.copyAdoptedIdea = async (ideaId, title, content) => {
  try {
    const text = `【${title}】\n${content}`;
    await navigator.clipboard.writeText(text);
    alert('アイディアをコピーしました！');
  } catch (e) {
    console.error('Copy error:', e);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = `【${title}】\n${content}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('アイディアをコピーしました！');
  }
};

// Adopted Ideas Word Processor Functions
window.updateAdoptedIdeasCount = (value) => {
  state.adoptedIdeasText = value;
  const counter = $('#adopted-ideas-chars');
  if (counter) {
    counter.textContent = `${value.length} 文字`;
  }
};

window.saveAdoptedIdeasText = async () => {
  // プロジェクトがない場合は新規作成
  if (!state.currentProject) {
    const createNew = confirm('プロジェクトがありません。新規プロジェクトを作成しますか？');
    if (createNew) {
      await createNewProjectAndSave('adopted');
    }
    return;
  }
  
  try {
    await fetch(`/api/projects/${state.currentProject.id}/world-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'adopted_ideas_text',
        title: '採用アイディア',
        content: state.adoptedIdeasText
      })
    });
    
    alert('採用アイディアを保存しました');
  } catch (e) {
    console.error('Save adopted ideas error:', e);
    alert('保存に失敗しました');
  }
};

window.importAdoptedIdeasToText = () => {
  const adoptedIdeas = (state.ideas || []).filter(idea => idea.adopted);
  if (adoptedIdeas.length === 0) {
    alert('採用済みのアイディアがありません');
    return;
  }
  
  const newText = adoptedIdeas.map(idea => 
    `【${idea.title}】\n${idea.content || ''}`
  ).join('\n\n');
  
  const currentText = state.adoptedIdeasText || '';
  const separator = currentText ? '\n\n---\n\n' : '';
  
  state.adoptedIdeasText = currentText + separator + newText;
  
  const editor = $('#adopted-ideas-editor');
  if (editor) {
    editor.value = state.adoptedIdeasText;
  }
  
  updateAdoptedIdeasCount(state.adoptedIdeasText);
  render();
};

window.toggleAdoptedIdeasPreview = () => {
  state.showAdoptedIdeasPreview = !state.showAdoptedIdeasPreview;
  render();
};

window.unadoptIdea = async (ideaId) => {
  if (!confirm('このアイデアの採用を取り消しますか？\n（プロットからは手動で削除してください）')) return;
  
  try {
    await api.put(`/ideas/${ideaId}/unadopt`);
    const idea = state.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.adopted = false;
    }
    render();
  } catch (e) {
    console.error('Unadopt idea error:', e);
    alert('採用取り消しに失敗しました');
  }
};

window.deleteIdea = async (ideaId, ideaTitle) => {
  // First confirmation
  if (!confirm(`「${ideaTitle || 'このアイデア'}」を削除しますか？`)) return;
  
  // Second confirmation
  if (!confirm('本当に削除しますか？\nこの操作は元に戻せません。\n\n「OK」で削除、「キャンセル」で中止')) return;
  
  try {
    await axios.delete(`/ideas/${ideaId}`);
    state.ideas = state.ideas.filter(i => i.id !== ideaId);
    alert('アイデアを削除しました');
    render();
  } catch (e) {
    console.error('Delete idea error:', e);
    alert('アイデアの削除に失敗しました');
  }
};

window.changePlotTemplate = (template) => {
  if (state.plot) {
    state.plot.template = template;
    render();
  }
};

window.savePlot = async () => {
  if (!state.plot) return;
  
  const template = state.plot.template;
  let structure = {};
  
  if (template === 'kishotenketsu') {
    structure = {
      ki: $('#plot-ki')?.value || '',
      sho: $('#plot-sho')?.value || '',
      ten: $('#plot-ten')?.value || '',
      ketsu: $('#plot-ketsu')?.value || '',
    };
  } else if (template === 'three_act') {
    structure = {
      act1: $('#plot-act1')?.value || '',
      act2: $('#plot-act2')?.value || '',
      act3: $('#plot-act3')?.value || '',
    };
  } else if (template === 'blake_snyder') {
    const fields = ['opening', 'theme', 'setup', 'catalyst', 'debate', 'break_into_two', 'b_story', 'fun_and_games', 'midpoint', 'bad_guys', 'all_is_lost', 'dark_night', 'break_into_three', 'finale', 'final_image'];
    fields.forEach(f => structure[f] = $(`#plot-${f}`)?.value || '');
  } else if (template === 'heros_journey') {
    const fields = ['ordinary_world', 'call_to_adventure', 'refusal_of_call', 'meeting_mentor', 'crossing_threshold', 'tests_allies_enemies', 'approach', 'ordeal', 'reward', 'road_back', 'resurrection', 'return_with_elixir'];
    fields.forEach(f => structure[f] = $(`#plot-${f}`)?.value || '');
  }
  
  await api.put(`/plots/${state.plot.id}`, {
    template,
    structure: JSON.stringify(structure),
  });
  
  state.plot.structure = JSON.stringify(structure);
  alert('プロットを保存しました');
};

// Generate plot structure from adopted ideas
window.generatePlotFromIdeas = async () => {
  const adoptedIdeas = (state.ideas || []).filter(i => i.adopted);
  const template = state.plot?.template || 'kishotenketsu';
  const projectGenre = state.currentProject?.genre || 'ファンタジー';
  
  if (adoptedIdeas.length === 0) {
    alert('採用したアイディアがありません。\nアイディアタブでアイディアを生成し、採用してからご利用ください。');
    return;
  }
  
  // Build prompt with template and ideas
  const ideasText = adoptedIdeas.map((idea, i) => `${i + 1}. ${idea.title}: ${idea.content || ''}`).join('\n');
  
  let templatePrompt = '';
  if (template === 'kishotenketsu') {
    templatePrompt = `以下のアイディアを元に、「起承転結」形式のプロット構成を生成してください。

【起】物語の始まり、登場人物や世界観の紹介
【承】物語の展開、問題や課題の発生
【転】クライマックス、予想外の展開
【結】結末、問題の解決

JSON形式で出力してください:
{"ki": "起の内容", "sho": "承の内容", "ten": "転の内容", "ketsu": "結の内容"}`;
  } else if (template === 'three_act') {
    templatePrompt = `以下のアイディアを元に、「三幕構成」形式のプロット構成を生成してください。

【第一幕】設定とセットアップ、主人公の紹介、事件の発生
【第二幕】対立と発展、主人公の試練、ミッドポイント
【第三幕】クライマックスと解決

JSON形式で出力してください:
{"act1": "第一幕の内容", "act2": "第二幕の内容", "act3": "第三幕の内容"}`;
  } else if (template === 'blake_snyder') {
    templatePrompt = `以下のアイディアを元に、「ブレイク・スナイダー」（Save the Cat）形式のプロット構成を生成してください。

【オープニングイメージ】物語の最初のシーン
【テーマの提示】物語のテーマが示される
【セットアップ】主人公と世界の紹介
【きっかけ】物語を動かす出来事
【悩みのとき】主人公が決断を迷う
【第一ターニングポイント】新しい世界への突入
【サブプロット】B ストーリーの開始
【お楽しみ】約束された面白さ
【ミッドポイント】偽りの勝利または敗北
【迫り来る悪い奴ら】問題が深刻化
【すべてを失って】最悪の瞬間
【心の暗闘】最低点
【第二ターニングポイント】解決策の発見
【フィナーレ】最終対決と解決
【ファイナルイメージ】変化した主人公

JSON形式で出力してください:
{"opening": "内容", "theme": "内容", "setup": "内容", "catalyst": "内容", "debate": "内容", "break_into_two": "内容", "b_story": "内容", "fun_and_games": "内容", "midpoint": "内容", "bad_guys": "内容", "all_is_lost": "内容", "dark_night": "内容", "break_into_three": "内容", "finale": "内容", "final_image": "内容"}`;
  } else if (template === 'heros_journey') {
    templatePrompt = `以下のアイディアを元に、「英雄の旅（Hero's Journey）」形式のプロット構成を生成してください。

【日常世界】主人公の普通の生活
【冒険への誘い】変化のきっかけ
【冒険の拒絶】最初の躊躇
【賢者との出会い】メンターの登場
【第一関門突破】非日常世界への突入
【試練・仲間・敵】冒険の中での成長
【最深部への接近】最大の試練への準備
【最大の試練】クライマックスの戦い
【報酬】勝利の果実
【帰路】元の世界への帰還
【復活】最終的な変容
【宝を持っての帰還】成長した姿での帰還

JSON形式で出力してください:
{"ordinary_world": "内容", "call_to_adventure": "内容", "refusal_of_call": "内容", "meeting_mentor": "内容", "crossing_threshold": "内容", "tests_allies_enemies": "内容", "approach": "内容", "ordeal": "内容", "reward": "内容", "road_back": "内容", "resurrection": "内容", "return_with_elixir": "内容"}`;
  }

  const fullPrompt = `ジャンル: ${projectGenre}

採用したアイディア:
${ideasText}

${templatePrompt}

各セクションは具体的で、物語として一貫性のある内容にしてください。`;

  state.aiGenerating = true;
  render();
  
  try {
    const result = await callAI('custom', fullPrompt, { customPrompt: 'プロット構成を生成してください。' });
    
    if (result) {
      // Try to parse JSON from result
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const plotData = JSON.parse(jsonMatch[0]);
          
          // Fill in the form fields
          if (template === 'kishotenketsu') {
            if ($('#plot-ki')) $('#plot-ki').value = plotData.ki || '';
            if ($('#plot-sho')) $('#plot-sho').value = plotData.sho || '';
            if ($('#plot-ten')) $('#plot-ten').value = plotData.ten || '';
            if ($('#plot-ketsu')) $('#plot-ketsu').value = plotData.ketsu || '';
          } else if (template === 'three_act') {
            if ($('#plot-act1')) $('#plot-act1').value = plotData.act1 || '';
            if ($('#plot-act2')) $('#plot-act2').value = plotData.act2 || '';
            if ($('#plot-act3')) $('#plot-act3').value = plotData.act3 || '';
          }
          
          alert('構成を生成しました！\n内容を確認し、必要に応じて編集してから保存してください。');
        } catch (e) {
          // If JSON parsing fails, show result as text
          showAIResult(result);
        }
      } else {
        showAIResult(result);
      }
    }
  } catch (e) {
    console.error('Generate plot error:', e);
    alert('構成の生成に失敗しました');
  }
  
  state.aiGenerating = false;
  renderAISidebar();
};

window.toggleWritingDirection = async () => {
  if (!state.currentWriting) return;
  const newDirection = state.currentWriting.writing_direction === 'vertical' ? 'horizontal' : 'vertical';
  state.currentWriting.writing_direction = newDirection;
  
  // 縦書きに切り替えた時、モード選択ダイアログを表示
  if (newDirection === 'vertical') {
    showVerticalModeDialog();
  }
  
  // autoSaveを呼び出して設定を保存（1秒後にサーバーに保存される）
  autoSave(state.currentWriting.content || '');
  
  render();
};

// 縦書きモード選択ダイアログ
window.showVerticalModeDialog = () => {
  const existing = document.getElementById('vertical-mode-dialog');
  if (existing) existing.remove();
  
  const dialog = document.createElement('div');
  dialog.id = 'vertical-mode-dialog';
  dialog.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
  dialog.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-fade-in">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
        <i class="fas fa-text-height text-indigo-500"></i>
        縦書き表示モード
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        英数字の表示方法を選択してください
      </p>
      
      <div class="space-y-3">
        <button onclick="selectVerticalMode('mixed')" 
          class="w-full p-4 border-2 rounded-xl text-left hover:border-indigo-500 transition ${state.verticalTextMode === 'mixed' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}">
          <div class="flex items-center gap-3">
            <div class="text-3xl writing-mode-vertical" style="writing-mode: vertical-rl; text-orientation: mixed;">A1あ</div>
            <div>
              <p class="font-medium">横倒し（伝統的）</p>
              <p class="text-xs text-gray-500">英数字が横に倒れて表示されます</p>
            </div>
          </div>
        </button>
        
        <button onclick="selectVerticalMode('upright')" 
          class="w-full p-4 border-2 rounded-xl text-left hover:border-indigo-500 transition ${state.verticalTextMode === 'upright' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}">
          <div class="flex items-center gap-3">
            <div class="text-3xl" style="writing-mode: vertical-rl; text-orientation: upright;">A1あ</div>
            <div>
              <p class="font-medium">正立（読みやすい）</p>
              <p class="text-xs text-gray-500">英数字も正立で表示されます</p>
            </div>
          </div>
        </button>
      </div>
      
      <div class="mt-4 text-center">
        <button onclick="closeVerticalModeDialog()" 
          class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          後で設定する
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeVerticalModeDialog();
  });
};

window.selectVerticalMode = (mode) => {
  state.verticalTextMode = mode;
  localStorage.setItem('verticalTextMode', mode);
  closeVerticalModeDialog();
  render();
};

window.closeVerticalModeDialog = () => {
  const dialog = document.getElementById('vertical-mode-dialog');
  if (dialog) dialog.remove();
};

window.toggleVerticalTextMode = () => {
  // 縦書き時の英数字表示モードを切り替え
  // 'mixed': 英数字は横倒し（伝統的な日本語組版）
  // 'upright': 英数字も正立表示（読みやすいが長い英単語は縦に並ぶ）
  state.verticalTextMode = state.verticalTextMode === 'upright' ? 'mixed' : 'upright';
  localStorage.setItem('verticalTextMode', state.verticalTextMode);
  render();
};

window.changeFont = (font) => {
  if (!state.currentWriting) return;
  state.currentWriting.font_family = font;
  const editor = $('#editor');
  if (editor) editor.style.fontFamily = `'${font}', sans-serif`;
  
  // autoSaveを呼び出して設定を保存（1秒後にサーバーに保存される）
  autoSave(state.currentWriting.content || '');
};

window.toggleExportMenu = () => {
  $('#export-menu')?.classList.toggle('hidden');
};

// Mobile Writing Toolbar Toggle
window.toggleMobileWritingToolbar = () => {
  const expandedToolbar = $('#mobile-toolbar-expanded');
  if (expandedToolbar) {
    expandedToolbar.classList.toggle('hidden');
    expandedToolbar.classList.toggle('flex');
  }
};

// ============================================
// Illustration Functions (Project-based)
// ============================================

// Detect characters from project outline, writings, and memos
function detectCharactersFromProject() {
  const characters = [];
  const addedNames = new Set(); // Track added names to avoid duplicates
  
  const addCharacter = (name, description = '') => {
    const trimmedName = name.trim();
    if (trimmedName && trimmedName.length > 1 && trimmedName.length < 20 && !addedNames.has(trimmedName)) {
      addedNames.add(trimmedName);
      characters.push({ name: trimmedName, description: description.trim() });
    }
  };
  
  // 1. From story outline (キャラクター設定)
  if (state.storyOutline?.characters) {
    const charText = state.storyOutline.characters;
    const lines = charText.split(/[\n,、]/);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && trimmed.length > 0) {
        const match = trimmed.match(/^([^:：（(]+)[:：（(]?(.*)$/);
        if (match) {
          addCharacter(match[1], match[2] ? match[2].replace(/[）)]$/, '') : '');
        } else if (trimmed.length < 20) {
          addCharacter(trimmed);
        }
      }
    });
  }
  
  // 2. From registered characters in state
  if (state.characters && state.characters.length > 0) {
    state.characters.forEach(c => {
      addCharacter(c.name, c.description || '');
    });
  }
  
  // 3. From ideas document (ネタ・プロットメモ)
  if (state.ideasDocument) {
    // Look for 「」 quoted names
    const quoteMatches = state.ideasDocument.match(/「([^」]{1,10})」/g) || [];
    quoteMatches.forEach(match => {
      const name = match.replace(/[「」]/g, '');
      addCharacter(name);
    });
    
    // Look for character-like patterns: "名前（説明）" or "名前:説明"
    const charPatterns = state.ideasDocument.match(/^([^:：（(\n]{2,10})[:：（(]([^）)\n]{5,50})[）)]?$/gm) || [];
    charPatterns.forEach(pattern => {
      const match = pattern.match(/^([^:：（(]+)[:：（(](.+)/);
      if (match) {
        addCharacter(match[1], match[2].replace(/[）)]$/, ''));
      }
    });
    
    // Look for 【キャラ名】 patterns
    const bracketMatches = state.ideasDocument.match(/【([^】]{1,10})】/g) || [];
    bracketMatches.forEach(match => {
      const name = match.replace(/[【】]/g, '');
      if (!name.includes('設定') && !name.includes('世界') && !name.includes('目的')) {
        addCharacter(name);
      }
    });
  }
  
  // 4. From adopted ideas text
  if (state.adoptedIdeasText) {
    // Look for 「」 quoted names
    const quoteMatches = state.adoptedIdeasText.match(/「([^」]{1,10})」/g) || [];
    quoteMatches.forEach(match => {
      const name = match.replace(/[「」]/g, '');
      addCharacter(name);
    });
    
    // Look for 【】 patterns (excluding common section headers)
    const bracketMatches = state.adoptedIdeasText.match(/【([^】]{1,10})】/g) || [];
    bracketMatches.forEach(match => {
      const name = match.replace(/[【】]/g, '');
      if (!name.includes('設定') && !name.includes('世界') && !name.includes('目的') && 
          !name.includes('テーマ') && !name.includes('あらすじ')) {
        addCharacter(name);
      }
    });
  }
  
  // 5. From current writing content
  if (state.currentWriting?.content) {
    const content = state.currentWriting.content.slice(0, 5000); // Limit for performance
    
    // Look for dialogue patterns: "「〜」と○○が言った" or "○○は「〜」"
    const dialoguePatterns = content.match(/([^「」\s]{1,8})(?:は|が|の)「/g) || [];
    dialoguePatterns.forEach(pattern => {
      const name = pattern.replace(/(?:は|が|の)「$/, '');
      addCharacter(name);
    });
    
    // Look for action patterns: "○○は〜した"
    const actionPatterns = content.match(/「[^」]+」と([^「」\s]{1,8})(?:が|は)/g) || [];
    actionPatterns.forEach(pattern => {
      const match = pattern.match(/と([^「」\s]{1,8})(?:が|は)$/);
      if (match) {
        addCharacter(match[1]);
      }
    });
  }
  
  return characters.slice(0, 30); // Limit to 30 characters
}

window.handleReferenceFiles = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  if (!state.illustrationFiles) state.illustrationFiles = [];
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.illustrationFiles.push({
        name: file.name,
        data: e.target.result,
        type: file.type
      });
      render();
    };
    reader.readAsDataURL(file);
  });
};

window.selectReferenceFile = (idx) => {
  state.selectedReferenceIdx = state.selectedReferenceIdx === idx ? null : idx;
  render();
};

window.removeReferenceFile = (idx) => {
  state.illustrationFiles.splice(idx, 1);
  if (state.selectedReferenceIdx === idx) {
    state.selectedReferenceIdx = null;
  } else if (state.selectedReferenceIdx > idx) {
    state.selectedReferenceIdx--;
  }
  render();
};

window.updateCharacterPrompt = () => {
  const select = $('#illustration-character');
  const promptArea = $('#illustration-prompt');
  if (!select || !promptArea) return;
  
  const selectedOption = select.options[select.selectedIndex];
  const description = selectedOption?.getAttribute('data-description');
  
  if (description && promptArea.value.trim() === '') {
    promptArea.value = description;
  }
};

window.generateIllustration = async () => {
  const prompt = $('#illustration-prompt')?.value;
  if (!prompt) {
    alert('プロンプトを入力してください');
    return;
  }
  
  const negative = $('#illustration-negative')?.value || '';
  const size = $('#illustration-size')?.value || '512x768';
  const style = $('#illustration-style')?.value || 'anime';
  const steps = parseInt($('#illustration-steps')?.value || '28');
  
  const [width, height] = size.split('x').map(Number);
  
  // Build context from project
  const projectContext = {
    storyOutline: state.storyOutline,
    ideasDocument: state.ideasDocument,
    worldSettings: state.worldSettings,
    plot: state.plot,
    currentWriting: state.currentWriting?.content?.slice(0, 2000)
  };
  
  // Build style prefix based on selection
  const stylePrompts = {
    anime: 'masterpiece, best quality, anime style, detailed illustration, ',
    realistic: 'masterpiece, best quality, photorealistic, detailed, ',
    watercolor: 'masterpiece, best quality, watercolor painting, artistic, ',
    oil: 'masterpiece, best quality, oil painting, classical art, ',
    sketch: 'masterpiece, sketch, pencil drawing, artistic, '
  };
  
  const fullPrompt = stylePrompts[style] + prompt;
  
  // Get selected character name for tagging
  const characterSelect = $('#illustration-character');
  const characterName = characterSelect?.options[characterSelect.selectedIndex]?.text;
  const hasCharacter = characterSelect?.value !== '';
  
  // Get selected reference image
  const referenceImage = state.selectedReferenceIdx !== null 
    ? state.illustrationFiles[state.selectedReferenceIdx]?.data 
    : null;
  
  state.aiGenerating = true;
  render();
  
  try {
    const response = await fetch('/api/illustration/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: fullPrompt,
        negative_prompt: negative,
        width,
        height,
        steps,
        reference_image: referenceImage,
        projectContext,
        sessionId: state.sessionId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '画像生成に失敗しました');
    }
    
    const result = await response.json();
    
    // Add to generated images
    state.generatedImages.unshift({
      url: result.imageUrl,
      prompt: prompt,
      character: hasCharacter ? characterName : null,
      createdAt: new Date().toISOString()
    });
    
    // Keep only last 50 images in state
    if (state.generatedImages.length > 50) {
      state.generatedImages = state.generatedImages.slice(0, 50);
    }
    
    alert('挿絵を生成しました！');
  } catch (e) {
    console.error('Illustration generation error:', e);
    alert(`挿絵生成エラー: ${e.message}`);
  }
  
  state.aiGenerating = false;
  render();
};

window.openImageModal = (url, prompt) => {
  const modal = $('#image-modal');
  const img = $('#modal-image');
  const promptEl = $('#modal-prompt');
  
  if (modal && img) {
    img.src = url;
    if (promptEl) promptEl.textContent = prompt || '';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

window.closeImageModal = (event) => {
  if (event && event.target !== event.currentTarget) return;
  const modal = $('#image-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.copyImageToClipboard = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    
    alert('画像をクリップボードにコピーしました！');
  } catch (e) {
    console.error('Copy error:', e);
    // Fallback: copy URL
    try {
      await navigator.clipboard.writeText(url);
      alert('画像URLをコピーしました（画像の直接コピーは非対応のブラウザです）');
    } catch (e2) {
      alert('コピーに失敗しました');
    }
  }
};

window.downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error('Download error:', e);
    alert('ダウンロードに失敗しました');
  }
};

window.deleteGeneratedImage = (index) => {
  if (confirm('この挿絵を削除しますか？')) {
    state.generatedImages.splice(index, 1);
    render();
  }
};

// ============================================
// Analysis Chat Functions (LLM-style)
// ============================================

window.setAnalysisPersona = (personaId) => {
  state.analysisPersona = personaId;
  render();
};

window.toggleAnalysisCharts = () => {
  state.analysisChartsOpen = !state.analysisChartsOpen;
  render();
  // Re-initialize charts if opened
  if (state.analysisChartsOpen) {
    setTimeout(() => initializeCharts(), 100);
  }
};

window.clearAnalysisChat = () => {
  if (confirm('分析チャットの履歴をクリアしますか？')) {
    state.analysisChatMessages = [];
    render();
  }
};

window.askAnalysisQuestion = (question) => {
  const input = document.getElementById('analysis-chat-input');
  if (input) {
    input.value = question;
    // Trigger form submit
    const form = document.getElementById('analysis-chat-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }
};

window.toggleExpandPanel = (panelId) => {
  if (state.expandedPanel === panelId) {
    state.expandedPanel = null;
  } else {
    state.expandedPanel = panelId;
  }
  render();
  // Show modal for expanded panel
  if (state.expandedPanel) {
    showExpandedPanelModal(panelId);
  }
};

function showExpandedPanelModal(panelId) {
  // Create modal overlay for expanded chart
  const existingModal = document.getElementById('expanded-panel-modal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.id = 'expanded-panel-modal';
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
      state.expandedPanel = null;
    }
  };
  
  let content = '';
  if (panelId === 'emotion-chart-panel') {
    content = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold"><i class="fas fa-chart-line mr-2 text-indigo-500"></i>${t('analysis.emotionCurve')}</h3>
          <button onclick="document.getElementById('expanded-panel-modal').remove(); state.expandedPanel=null;" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="h-96">
          <canvas id="emotion-chart-expanded"></canvas>
        </div>
      </div>
    `;
  } else if (panelId === 'radar-chart-panel') {
    content = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold"><i class="fas fa-chart-pie mr-2 text-indigo-500"></i>${t('analysis.radar')}</h3>
          <button onclick="document.getElementById('expanded-panel-modal').remove(); state.expandedPanel=null;" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="h-96">
          <canvas id="radar-chart-expanded"></canvas>
        </div>
      </div>
    `;
  } else if (panelId === 'reviews-panel') {
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewsContent = reviewsContainer ? reviewsContainer.innerHTML : '';
    content = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold"><i class="fas fa-users mr-2 text-indigo-500"></i>${t('analysis.reviews')}</h3>
          <button onclick="document.getElementById('expanded-panel-modal').remove(); state.expandedPanel=null;" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-3">${reviewsContent}</div>
      </div>
    `;
  }
  
  modal.innerHTML = content;
  document.body.appendChild(modal);
  
  // Re-initialize expanded chart
  setTimeout(() => {
    if (panelId === 'emotion-chart-panel') {
      const ctx = document.getElementById('emotion-chart-expanded');
      if (ctx && window.emotionChartData) {
        new Chart(ctx, window.emotionChartData);
      }
    } else if (panelId === 'radar-chart-panel') {
      const ctx = document.getElementById('radar-chart-expanded');
      if (ctx && window.radarChartData) {
        new Chart(ctx, window.radarChartData);
      }
    }
  }, 100);
}

async function sendAnalysisChatMessage(message) {
  if (!message.trim() || state.aiGenerating) return;
  
  // Add user message
  state.analysisChatMessages.push({
    role: 'user',
    content: message
  });
  render();
  
  // Scroll to bottom
  const chatContainer = document.getElementById('analysis-chat-messages');
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  
  state.aiGenerating = true;
  render();
  
  try {
    // Get ALL project content for context
    const writingContent = state.currentWriting?.content || '';
    const plotContent = state.plot?.structure ? JSON.stringify(state.plot.structure) : '';
    
    // Get story outline (characters, world, etc.)
    const storyOutline = state.storyOutline || {};
    const ideasDocument = state.ideasDocument || '';
    const adoptedIdeasText = state.adoptedIdeasText || '';
    
    // Build comprehensive project context
    let projectContext = '';
    if (storyOutline.characters) projectContext += `【キャラクター設定】\n${storyOutline.characters}\n\n`;
    if (storyOutline.worldSetting) projectContext += `【世界観】\n${storyOutline.worldSetting}\n\n`;
    if (storyOutline.storyGoal) projectContext += `【物語の目標】\n${storyOutline.storyGoal}\n\n`;
    if (storyOutline.episodes) projectContext += `【各話アウトライン】\n${storyOutline.episodes}\n\n`;
    if (adoptedIdeasText) projectContext += `【採用したアイディア】\n${adoptedIdeasText.substring(0, 1000)}\n\n`;
    if (ideasDocument) projectContext += `【ネタ・プロットメモ】\n${ideasDocument.substring(0, 1000)}\n\n`;
    
    // Build persona instruction
    const personaInstructions = {
      neutral: 'あなたは客観的で冷静な文芸批評家です。感情を排し、論理的に作品を分析してください。',
      encouraging: 'あなたは作家を応援する熱心な編集者です。良い点を積極的に褒め、改善点も前向きに伝えてください。励ましの言葉を忘れずに。',
      strict: 'あなたは厳格な文芸評論家です。作品の問題点を鋭く指摘し、プロの水準を求めてください。ただし建設的な批評を心がけてください。',
      reader: 'あなたは作品を楽しみに待っている熱心な読者です。読者目線での感想や期待を素直に伝えてください。',
      mentor: 'あなたは経験豊富なベテラン作家です。後輩作家に対して、実践的なアドバイスと経験談を交えて指導してください。'
    };
    
    const persona = state.analysisPersona || 'neutral';
    
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analysis_chat',
        message: message,
        context: {
          writing: writingContent.substring(0, 8000),
          plot: plotContent.substring(0, 2000),
          projectContext: projectContext,
          persona: personaInstructions[persona],
          chatHistory: state.analysisChatMessages.slice(-6)
        }
      })
    });
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    
    // Add AI response
    state.analysisChatMessages.push({
      role: 'assistant',
      content: data.response || data.result || 'すみません、回答を生成できませんでした。',
      persona: persona
    });
    
    // 初回チャット時にチャートも生成（まだ分析結果がない場合）
    if (!state.lastAnalysisResult && state.currentWriting?.content) {
      try {
        const analysisRes = await api.post('/ai/analyze', { content: state.currentWriting.content });
        if (analysisRes.data.analysis) {
          state.lastAnalysisResult = analysisRes.data.analysis;
          state.analysisChartsOpen = true;
          // チャート描画は後で行う
        }
      } catch (e) {
        console.error('Auto analysis error:', e);
      }
    }
    
  } catch (error) {
    console.error('Analysis chat error:', error);
    state.analysisChatMessages.push({
      role: 'assistant',
      content: 'エラーが発生しました。もう一度お試しください。',
      persona: state.analysisPersona
    });
  } finally {
    state.aiGenerating = false;
    render();
    
    // Scroll to bottom
    const chatContainer = document.getElementById('analysis-chat-messages');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // チャートを描画（分析結果がある場合）
    if (state.lastAnalysisResult) {
      setTimeout(() => {
        renderAnalysisResults(state.lastAnalysisResult);
      }, 200);
    }
  }
}

// ============================================
// Expand/Fullscreen Panel Functions
// ============================================

window.expandTextarea = (textareaId, titleOrKey) => {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;
  
  // If titleOrKey starts with 'ui.', 'plot.', or 'tab.', treat it as a translation key
  const title = (titleOrKey && (titleOrKey.startsWith('ui.') || titleOrKey.startsWith('plot.') || titleOrKey.startsWith('tab.'))) 
    ? t(titleOrKey) 
    : (titleOrKey || t('ui.editSettings'));
  
  const existingModal = document.getElementById('expand-textarea-modal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.id = 'expand-textarea-modal';
  modal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <i class="fas fa-expand text-indigo-500"></i>
          ${title}
        </h3>
        <button onclick="closeExpandModal('${textareaId}')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="flex-1 p-4 overflow-hidden">
        <textarea id="expanded-textarea" 
          class="w-full h-full min-h-[60vh] px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none focus:ring-2 focus:ring-indigo-500 text-base"
          placeholder="...">${textarea.value || ''}</textarea>
      </div>
      <div class="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-500">
          <span id="expanded-char-count">${(textarea.value || '').length}</span> 文字
        </span>
        <div class="flex gap-2">
          <button onclick="document.getElementById('expand-textarea-modal').remove()" 
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            キャンセル
          </button>
          <button onclick="closeExpandModal('${textareaId}')" 
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <i class="fas fa-check mr-1"></i>適用
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Focus and add char count listener
  const expandedTextarea = document.getElementById('expanded-textarea');
  if (expandedTextarea) {
    expandedTextarea.focus();
    expandedTextarea.addEventListener('input', () => {
      const countEl = document.getElementById('expanded-char-count');
      if (countEl) countEl.textContent = expandedTextarea.value.length;
    });
  }
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeExpandModal(textareaId);
    }
  });
};

window.closeExpandModal = (textareaId) => {
  const expandedTextarea = document.getElementById('expanded-textarea');
  const originalTextarea = document.getElementById(textareaId);
  
  if (expandedTextarea && originalTextarea) {
    originalTextarea.value = expandedTextarea.value;
    // Trigger input event to update any listeners
    originalTextarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  const modal = document.getElementById('expand-textarea-modal');
  if (modal) modal.remove();
};

// ============================================
// Ideas Tab Functions (Word Processor Style)
// ============================================

window.toggleStoryOutline = () => {
  state.showStoryOutline = !state.showStoryOutline;
  render();
};

window.toggleQuickIdeas = () => {
  state.showQuickIdeas = !state.showQuickIdeas;
  render();
};

window.toggleIdeasOutline = () => {
  state.showIdeasOutline = !state.showIdeasOutline;
  render();
};

window.toggleIdeasStyleMenu = () => {
  const menu = document.getElementById('ideas-style-menu');
  if (menu) {
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
      // Close when clicking outside
      setTimeout(() => {
        document.addEventListener('click', closeIdeasStyleMenuOnClickOutside, { once: true });
      }, 10);
    }
  }
};

function closeIdeasStyleMenuOnClickOutside(e) {
  const menu = document.getElementById('ideas-style-menu');
  const btn = document.getElementById('ideas-style-menu-btn');
  if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
    menu.classList.add('hidden');
  }
}

window.applyIdeasStyle = (style) => {
  const textarea = document.getElementById('ideas-document');
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  
  if (!selectedText.trim()) {
    alert('スタイルを適用するテキストを選択してください');
    return;
  }
  
  let prefix = '';
  switch (style) {
    case 'title': prefix = '# '; break;
    case 'h1': prefix = '## '; break;
    case 'h2': prefix = '### '; break;
    case 'h3': prefix = '#### '; break;
    default: prefix = ''; break;
  }
  
  // Find the start of the line
  let lineStart = start;
  while (lineStart > 0 && textarea.value[lineStart - 1] !== '\n') {
    lineStart--;
  }
  
  // Check if line already has a heading prefix
  const currentLine = textarea.value.substring(lineStart, end);
  const headingMatch = currentLine.match(/^(#{1,4}\s*)/);
  
  let newText;
  if (headingMatch) {
    // Replace existing prefix
    newText = textarea.value.substring(0, lineStart) + prefix + currentLine.substring(headingMatch[1].length) + textarea.value.substring(end);
  } else {
    // Add prefix at line start
    newText = textarea.value.substring(0, lineStart) + prefix + textarea.value.substring(lineStart);
  }
  
  textarea.value = newText;
  state.ideasDocument = newText;
  
  // Update style label
  const styleLabels = { normal: '標準', title: 'タイトル', h1: '見出し1', h2: '見出し2', h3: '見出し3' };
  const label = document.getElementById('ideas-current-style');
  if (label) label.textContent = styleLabels[style] || '標準';
  
  // Close menu
  const menu = document.getElementById('ideas-style-menu');
  if (menu) menu.classList.add('hidden');
  
  // Update outline
  updateIdeasOutline();
};

function renderIdeasOutline() {
  const content = state.ideasDocument || '';
  const lines = content.split('\n');
  const headings = [];
  
  lines.forEach((line, idx) => {
    const match = line.match(/^(#{1,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ level, text, line: idx });
    }
  });
  
  if (headings.length === 0) {
    return `
      <p class="text-xs text-gray-500 p-2">
        見出しがありません<br>
        <span class="text-gray-400 mt-1 block">
          # タイトル<br>
          ## 見出し1<br>
          ### 見出し2
        </span>
      </p>
    `;
  }
  
  return headings.map(h => {
    const indent = (h.level - 1) * 12;
    const fontSize = h.level === 1 ? 'text-sm font-bold' : h.level === 2 ? 'text-sm font-medium' : 'text-xs';
    return `
      <div onclick="jumpToIdeasLine(${h.line})" 
        class="cursor-pointer p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 ${fontSize} truncate"
        style="padding-left: ${indent}px;"
        title="${h.text}">
        ${h.text}
      </div>
    `;
  }).join('');
}

window.updateIdeasOutline = () => {
  const container = document.getElementById('ideas-outline-content');
  if (container) {
    container.innerHTML = renderIdeasOutline();
  }
};

window.jumpToIdeasLine = (lineNum) => {
  const textarea = document.getElementById('ideas-document');
  if (!textarea) return;
  
  const lines = textarea.value.split('\n');
  let pos = 0;
  for (let i = 0; i < lineNum && i < lines.length; i++) {
    pos += lines[i].length + 1;
  }
  
  textarea.focus();
  textarea.setSelectionRange(pos, pos);
  
  // Scroll to position
  const lineHeight = 20;
  textarea.scrollTop = lineNum * lineHeight - textarea.clientHeight / 2;
};

window.updateStoryOutline = (field, value) => {
  if (!state.storyOutline) {
    state.storyOutline = { characters: '', terminology: '', worldSetting: '', storyGoal: '', episodes: '' };
  }
  state.storyOutline[field] = value;
};

window.saveStoryOutline = async () => {
  // プロジェクトがない場合は新規作成
  if (!state.currentProject) {
    const createNew = confirm('プロジェクトがありません。新規プロジェクトを作成しますか？');
    if (createNew) {
      await createNewProjectAndSave('outline');
    }
    return;
  }
  
  try {
    // Save story outline to project's world settings
    const outlineData = state.storyOutline || {};
    
    // Save each section as a world setting
    const sections = [
      { category: 'characters', title: 'キャラクター設定', content: outlineData.characters },
      { category: 'terminology', title: '専門用語', content: outlineData.terminology },
      { category: 'world', title: '世界観設定', content: outlineData.worldSetting },
      { category: 'story_goal', title: '描きたい物語', content: outlineData.storyGoal },
      { category: 'episodes', title: '各話アウトライン', content: outlineData.episodes }
    ];
    
    for (const section of sections) {
      if (section.content) {
        await fetch(`/api/projects/${state.currentProject.id}/world-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(section)
        });
      }
    }
    
    alert('アウトラインを保存しました');
  } catch (e) {
    console.error('Save outline error:', e);
    alert('保存に失敗しました');
  }
};

// ============================================
// Library Settings Functions (for Settings Tab)
// ============================================

// Update library settings in memory (called on input)
window.updateLibrarySettings = (field, value) => {
  if (!state.currentProject?.is_library) return;
  
  if (!state.currentProject.library_settings) {
    state.currentProject.library_settings = {
      description: '',
      shared_characters: '',
      shared_world_setting: '',
      shared_terminology: ''
    };
  }
  state.currentProject.library_settings[field] = value;
};

// Save library settings from the Settings tab
window.saveLibrarySettingsFromTab = async () => {
  if (!state.currentProject?.is_library) {
    alert('シリーズが選択されていません');
    return;
  }
  
  const libraryId = state.currentProject.id;
  const settings = state.currentProject.library_settings || {};
  const syncToChildren = document.getElementById('sync-settings-to-children')?.checked || false;
  
  try {
    // Update library settings via API
    await api.put(`/projects/${libraryId}`, {
      library_settings: settings
    });
    
    // Sync to child projects if requested
    if (syncToChildren) {
      const childProjects = state.projects.filter(p => p.library_id === libraryId);
      
      for (const child of childProjects) {
        // Update world settings for each child
        if (settings.shared_characters) {
          await api.post(`/projects/${child.id}/world-settings`, {
            category: 'characters_shared',
            title: 'キャラクター設定（シリーズ共通）',
            content: settings.shared_characters
          });
        }
        if (settings.shared_world_setting) {
          await api.post(`/projects/${child.id}/world-settings`, {
            category: 'world_shared',
            title: '世界観設定（シリーズ共通）',
            content: settings.shared_world_setting
          });
        }
        if (settings.shared_terminology) {
          await api.post(`/projects/${child.id}/world-settings`, {
            category: 'terminology_shared',
            title: '専門用語（シリーズ共通）',
            content: settings.shared_terminology
          });
        }
      }
      
      alert(`シリーズ設定を保存し、${childProjects.length}話に反映しました`);
    } else {
      alert('シリーズ設定を保存しました');
    }
    
    render();
  } catch (e) {
    console.error('Save library settings error:', e);
    alert('保存に失敗しました: ' + e.message);
  }
};

// Toggle parent settings preview panel for child projects
window.toggleParentSettingsPreview = () => {
  const preview = document.getElementById('parent-settings-preview');
  const chevron = document.getElementById('parent-settings-chevron');
  
  if (preview && chevron) {
    preview.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
  }
};

// 新規プロジェクト作成して保存
async function createNewProjectAndSave(saveType) {
  const projectName = prompt('新規プロジェクト名を入力してください:', '新しいプロジェクト');
  if (!projectName) return;
  
  try {
    // Ensure user exists
    if (!state.user) {
      // Create anonymous user or prompt login
      const anonRes = await api.post('/auth/signup', {
        email: `anon_${Date.now()}@temp.local`,
        password: 'temp_password_' + Math.random(),
        name: 'ゲストユーザー'
      });
      state.user = anonRes.data.user;
      state.sessionId = anonRes.data.sessionId;
      localStorage.setItem('sessionId', state.sessionId);
    }
    
    // Create project
    const res = await api.post('/projects', {
      user_id: state.user.id,
      title: projectName,
      genre: ''
    });
    
    state.currentProject = res.data.project;
    state.projects.push(res.data.project);
    
    alert(`プロジェクト「${projectName}」を作成しました。保存を続行します...`);
    
    // Now save based on type
    if (saveType === 'outline') {
      await window.saveStoryOutline();
    } else if (saveType === 'ideas') {
      await window.saveIdeasDocument();
    } else if (saveType === 'writing') {
      await manualSave();
    }
    
    render();
  } catch (e) {
    console.error('Create project error:', e);
    alert('プロジェクト作成に失敗しました: ' + e.message);
  }
}

window.updateProjectGenre = async () => {
  const checkboxes = document.querySelectorAll('input[name="project-genre"]:checked');
  const genres = Array.from(checkboxes).map(cb => cb.value).join(',');
  
  // プロジェクトがない場合はローカルstateのみ更新
  if (!state.currentProject) {
    state.tempGenres = genres;
    return;
  }
  
  try {
    await fetch(`/api/projects/${state.currentProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genre: genres })
    });
    
    state.currentProject.genre = genres;
  } catch (e) {
    console.error('Update genre error:', e);
  }
};

window.updateIdeasDocumentCount = (value) => {
  state.ideasDocument = value;
  const counter = $('#ideas-doc-chars');
  if (counter) {
    counter.textContent = `${value.length} 文字`;
  }
};

window.saveIdeasDocument = async () => {
  // プロジェクトがない場合は新規作成
  if (!state.currentProject) {
    const createNew = confirm('プロジェクトがありません。新規プロジェクトを作成しますか？');
    if (createNew) {
      await createNewProjectAndSave('ideas');
    }
    return;
  }
  
  // 最新の内容を取得
  const currentContent = document.getElementById('ideas-document')?.value || state.ideasDocument || '';
  state.ideasDocument = currentContent;
  
  try {
    await fetch(`/api/projects/${state.currentProject.id}/world-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'ideas_document',
        title: 'ネタ・プロットメモ',
        content: currentContent
      })
    });
    
    alert('メモを保存しました');
  } catch (e) {
    console.error('Save ideas document error:', e);
    alert('保存に失敗しました');
  }
};

window.adoptIdeasDocument = () => {
  const ideasDocument = document.getElementById('ideas-document')?.value || state.ideasDocument || '';
  
  if (!ideasDocument.trim()) {
    alert('採用するメモの内容がありません');
    return;
  }
  
  // 既存の採用アイディアに追加
  const currentAdopted = state.adoptedIdeasText || '';
  const separator = currentAdopted ? '\n\n---\n\n' : '';
  const timestamp = new Date().toLocaleString('ja-JP');
  
  state.adoptedIdeasText = currentAdopted + separator + `【${timestamp} に追加】\n${ideasDocument}`;
  
  alert('ネタ・プロットメモを「採用したアイディア」に追加しました！\nプロットタブで確認できます。');
  render();
};

window.sendIdeasChat = async () => {
  const input = $('#ideas-chat-input');
  if (!input || !input.value.trim()) return;
  
  const message = input.value.trim();
  input.value = '';
  
  await sendIdeasChatMessage(message);
};

window.sendIdeasChatQuick = async (prompt) => {
  await sendIdeasChatMessage(prompt);
};

async function sendIdeasChatMessage(message) {
  if (!state.ideasChatMessages) {
    state.ideasChatMessages = [];
  }
  
  // Add user message
  state.ideasChatMessages.push({ role: 'user', content: message });
  render();
  
  // Scroll to bottom
  setTimeout(() => {
    const container = $('#ideas-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);
  
  state.aiGenerating = true;
  render();
  
  try {
    // Build context from story outline
    const outline = state.storyOutline || {};
    const context = {
      characters: state.characters || [],
      worldSettings: state.worldSettings || [],
      plot: state.plot,
      storyOutline: outline,
      ideasDocument: state.ideasDocument,
      projectGenres: state.currentProject?.genre
    };
    
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ideas_chat',
        content: message,
        context,
        sessionId: state.sessionId
      })
    });
    
    if (!response.ok) throw new Error('Chat failed');
    
    const result = await response.json();
    
    // Add AI response
    state.ideasChatMessages.push({ role: 'assistant', content: result.response });
    
  } catch (e) {
    console.error('Ideas chat error:', e);
    state.ideasChatMessages.push({ 
      role: 'assistant', 
      content: 'すみません、エラーが発生しました。もう一度お試しください。' 
    });
  }
  
  state.aiGenerating = false;
  render();
  
  // Scroll to bottom again
  setTimeout(() => {
    const container = $('#ideas-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);
}

// Settings AI Chat Functions
window.sendSettingsChat = async () => {
  const input = $('#settings-chat-input');
  if (!input || !input.value.trim()) return;
  
  const message = input.value.trim();
  input.value = '';
  
  await sendSettingsChatMessage(message);
};

window.sendSettingsChatQuick = async (prompt) => {
  await sendSettingsChatMessage(prompt);
};

// Toggle between Creative (Gemini) and Research (Grok) modes
window.toggleSettingsAIMode = () => {
  state.settingsAIMode = state.settingsAIMode === 'research' ? 'creative' : 'research';
  render();
};

async function sendSettingsChatMessage(message) {
  if (!state.settingsChatMessages) {
    state.settingsChatMessages = [];
  }
  
  const isResearchMode = state.settingsAIMode === 'research';
  
  // Add user message
  state.settingsChatMessages.push({ role: 'user', content: message });
  render();
  
  // Scroll to bottom
  setTimeout(() => {
    const container = $('#settings-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);
  
  state.aiGenerating = true;
  render();
  
  try {
    // Build context from current project settings
    const currentProject = state.currentProject || {};
    const isLibrary = currentProject.is_library;
    const parentLibrary = currentProject.library_id ? 
      state.libraries.find(l => l.id === currentProject.library_id) : null;
    
    const context = {
      projectTitle: currentProject.title,
      projectGenres: currentProject.genre,
      isLibrary,
      parentLibrary: parentLibrary?.title,
      characters: state.characters || [],
      worldSettings: state.worldSettings || [],
      storyOutline: state.storyOutline,
      plot: state.plot,
      worldSetting: state.storyOutline?.worldSetting,
      currentTopic: state.storyOutline?.storyGoal
    };
    
    let result;
    
    if (isResearchMode) {
      // Use Grok for research
      const response = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          type: 'research',
          context: {
            projectGenres: currentProject.genre,
            characters: state.storyOutline?.characters,
            worldSetting: state.storyOutline?.worldSetting,
            currentTopic: state.storyOutline?.storyGoal
          }
        })
      });
      
      if (!response.ok) throw new Error('Research failed');
      result = await response.json();
      
      // Add AI response with research flag
      state.settingsChatMessages.push({ 
        role: 'assistant', 
        content: result.response,
        isResearch: true
      });
    } else {
      // Use Gemini for creative assistance
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'settings_chat',
          content: message,
          context,
          sessionId: state.sessionId
        })
      });
      
      if (!response.ok) throw new Error('Chat failed');
      result = await response.json();
      
      // Add AI response
      state.settingsChatMessages.push({ role: 'assistant', content: result.response });
    }
    
  } catch (e) {
    console.error('Settings chat error:', e);
    state.settingsChatMessages.push({ 
      role: 'assistant', 
      content: t('common.error') + ' ' + e.message,
      isResearch: isResearchMode
    });
  }
  
  state.aiGenerating = false;
  render();
  
  // Scroll to bottom again
  setTimeout(() => {
    const container = $('#settings-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);
}

// Text Style Functions (Google Docs style)
window.toggleStyleMenu = () => {
  const menu = $('#style-menu');
  if (menu) {
    menu.classList.toggle('hidden');
    // Close when clicking outside
    if (!menu.classList.contains('hidden')) {
      setTimeout(() => {
        document.addEventListener('click', closeStyleMenuOnClickOutside, { once: true });
      }, 0);
    }
  }
};

function closeStyleMenuOnClickOutside(e) {
  const menu = $('#style-menu');
  const btn = $('#style-menu-btn');
  if (menu && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add('hidden');
  }
}

window.applyTextStyle = (style) => {
  const editor = $('#editor');
  if (!editor) return;
  
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const content = editor.value;
  
  // Find the start and end of the current line(s)
  let lineStart = content.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = content.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = content.length;
  
  // Get the selected lines
  const selectedLines = content.substring(lineStart, lineEnd);
  const lines = selectedLines.split('\n');
  
  // Apply style prefix to each line
  const styledLines = lines.map(line => {
    // Remove existing style prefix
    const cleanLine = line.replace(/^(#{1,3}\s*|【|】)/, '').replace(/】$/, '');
    
    switch (style) {
      case 'title':
        return '# ' + cleanLine;
      case 'h1':
        return '## ' + cleanLine;
      case 'h2':
        return '### ' + cleanLine;
      case 'h3':
        return '【' + cleanLine + '】';
      case 'normal':
      default:
        return cleanLine;
    }
  });
  
  const newContent = content.substring(0, lineStart) + styledLines.join('\n') + content.substring(lineEnd);
  
  // Update editor
  editor.value = newContent;
  
  // Update state and trigger autosave
  if (state.currentWriting) {
    state.currentWriting.content = newContent;
  }
  autoSave(newContent);
  
  // Update outline
  updateOutline();
  
  // Update style label
  updateStyleLabel(style);
  
  // Close menu
  $('#style-menu')?.classList.add('hidden');
  
  // Restore focus and selection
  editor.focus();
  const newEnd = lineStart + styledLines.join('\n').length;
  editor.setSelectionRange(lineStart, newEnd);
};

function updateStyleLabel(style) {
  const label = $('#current-style-label');
  if (!label) return;
  
  const labels = {
    normal: t('ui.standardText'),
    title: t('ui.title'),
    h1: t('ui.heading1'),
    h2: t('ui.heading2'),
    h3: t('ui.heading3')
  };
  
  label.textContent = labels[style] || t('ui.standardText');
}

// Detect current line style and update label
window.detectAndUpdateStyleLabel = () => {
  const editor = $('#editor');
  if (!editor) return;
  
  const content = editor.value;
  const cursorPos = editor.selectionStart;
  
  // Find current line
  let lineStart = content.lastIndexOf('\n', cursorPos - 1) + 1;
  let lineEnd = content.indexOf('\n', cursorPos);
  if (lineEnd === -1) lineEnd = content.length;
  
  const currentLine = content.substring(lineStart, lineEnd);
  
  // Detect style
  let style = 'normal';
  if (currentLine.match(/^#\s+/)) style = 'title';
  else if (currentLine.match(/^##\s+/)) style = 'h1';
  else if (currentLine.match(/^###\s+/)) style = 'h2';
  else if (currentLine.match(/^【.*】$/)) style = 'h3';
  
  updateStyleLabel(style);
};

// Outline Functions
window.toggleOutline = () => {
  state.showOutline = !state.showOutline;
  const panel = $('#outline-panel');
  if (panel) {
    panel.classList.toggle('hidden', !state.showOutline);
  }
};

window.updateOutline = () => {
  const outlineContent = $('#outline-content');
  if (outlineContent && state.showOutline) {
    outlineContent.innerHTML = renderOutlineItems();
  }
};

window.jumpToHeading = (lineIndex) => {
  const editor = $('#editor');
  if (!editor) return;
  
  const content = editor.value;
  const lines = content.split('\n');
  
  // Calculate character position of the target line
  let charPosition = 0;
  for (let i = 0; i < lineIndex; i++) {
    charPosition += lines[i].length + 1; // +1 for newline
  }
  
  // Set cursor position and scroll
  editor.focus();
  editor.setSelectionRange(charPosition, charPosition + lines[lineIndex].length);
  
  // Scroll to make the cursor visible
  const lineHeight = parseInt(getComputedStyle(editor).lineHeight) || 32;
  const scrollTop = lineIndex * lineHeight - editor.clientHeight / 3;
  editor.scrollTop = Math.max(0, scrollTop);
};

window.handleQuickAction = async (action) => {
  const content = state.currentWriting?.content || '';
  if (!content && action !== 'title') {
    alert('テキストを入力してください');
    return;
  }
  
  // For translate action, show language selection dialog
  if (action === 'translate') {
    showTranslationDialog(content);
    return;
  }
  
  const result = await callAI(action, content);
  if (result) {
    showAIResult(result);
    addToAIHistory(action, result);
  }
};

// Translation dialog for selecting target language
window.showTranslationDialog = (content) => {
  const existing = document.getElementById('translation-dialog');
  if (existing) existing.remove();
  
  const dialog = document.createElement('div');
  dialog.id = 'translation-dialog';
  dialog.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
  dialog.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-fade-in">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
        <i class="fas fa-language text-indigo-500"></i>
        翻訳先を選択
      </h3>
      
      <div class="space-y-3 mb-4">
        <button onclick="executeTranslation('ja', '${escapeForOnclick(content)}')" 
          class="w-full p-3 border-2 rounded-xl text-left hover:border-indigo-500 transition border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🇯🇵</span>
            <div>
              <p class="font-medium">日本語</p>
              <p class="text-xs text-gray-500">Translate to Japanese</p>
            </div>
          </div>
        </button>
        
        <button onclick="executeTranslation('en', '${escapeForOnclick(content)}')" 
          class="w-full p-3 border-2 rounded-xl text-left hover:border-indigo-500 transition border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🇺🇸</span>
            <div>
              <p class="font-medium">English</p>
              <p class="text-xs text-gray-500">英語に翻訳</p>
            </div>
          </div>
        </button>
        
        <button onclick="executeTranslation('zh', '${escapeForOnclick(content)}')" 
          class="w-full p-3 border-2 rounded-xl text-left hover:border-indigo-500 transition border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🇨🇳</span>
            <div>
              <p class="font-medium">中文（简体）</p>
              <p class="text-xs text-gray-500">中国語に翻訳</p>
            </div>
          </div>
        </button>
        
        <button onclick="executeTranslation('ko', '${escapeForOnclick(content)}')" 
          class="w-full p-3 border-2 rounded-xl text-left hover:border-indigo-500 transition border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🇰🇷</span>
            <div>
              <p class="font-medium">한국어</p>
              <p class="text-xs text-gray-500">韓国語に翻訳</p>
            </div>
          </div>
        </button>
      </div>
      
      <div class="text-center">
        <button onclick="closeTranslationDialog()" 
          class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          キャンセル
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeTranslationDialog();
  });
};

// Escape function for onclick content
function escapeForOnclick(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').substring(0, 500);
}

window.executeTranslation = async (targetLang, content) => {
  closeTranslationDialog();
  
  const langNames = { ja: '日本語', en: 'English', zh: '中文', ko: '한국어' };
  const result = await callAI('translate', state.currentWriting?.content || content, { targetLanguage: targetLang });
  
  if (result) {
    showAIResult(result);
    addToAIHistory(`translate_${targetLang}`, result);
  }
};

window.closeTranslationDialog = () => {
  const dialog = document.getElementById('translation-dialog');
  if (dialog) dialog.remove();
};

window.handleStyleConvert = async (style) => {
  const content = state.currentWriting?.content || '';
  if (!content) {
    alert('テキストを入力してください');
    return;
  }
  
  const result = await callAI(`style_${style}`, content);
  if (result) {
    showAIResult(result);
    addToAIHistory(`style_${style}`, result);
  }
};

window.handleCustomAction = async () => {
  const content = state.currentWriting?.content || '';
  const customPrompt = $('#custom-prompt')?.value || '';
  const targetWords = parseInt($('#target-words')?.value) || 0;
  
  if (!customPrompt) {
    alert(t('ui.pleaseEnterCustomPrompt'));
    return;
  }
  
  const result = await callAI('custom', content, { customPrompt, targetWordCount: targetWords });
  if (result) {
    showAIResult(result);
    addToAIHistory('custom', result);
  }
};

window.handleAnalyze = async () => {
  console.log('handleAnalyze called, currentWriting:', state.currentWriting);
  
  if (!state.currentWriting?.content) {
    alert(t('analysis.noContent'));
    return;
  }
  
  console.log('Analyzing content of length:', state.currentWriting.content.length);
  
  state.aiGenerating = true;
  render();
  
  try {
    const analysis = await analyzeWriting();
    console.log('Analysis result:', analysis);
    
    if (analysis) {
      // Ensure charts section is open
      state.analysisChartsOpen = true;
      render();
      
      // Wait for DOM to update, then render charts
      setTimeout(() => {
        renderAnalysisResults(analysis);
      }, 100);
      
      // Track analysis for achievements
      if (typeof trackActivity === 'function') {
        trackActivity('analysis', 1);
      }
    } else {
      alert('分析に失敗しました。もう一度お試しください。');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    alert('分析エラー: ' + error.message);
  } finally {
    state.aiGenerating = false;
    render();
    // Re-render charts after state update
    setTimeout(() => {
      if (state.lastAnalysisResult) {
        renderAnalysisResults(state.lastAnalysisResult);
      }
    }, 100);
  }
};

window.startNewThread = async () => {
  // Reload chat threads to include the previous conversation
  if (state.currentProject) {
    try {
      const res = await api.get(`/projects/${state.currentProject.id}/chat/threads`);
      state.chatThreads = res.data.threads || [];
    } catch (e) {
      console.error('Failed to reload chat threads:', e);
    }
  }
  
  // Start fresh conversation
  state.currentThread = null;
  state.chatMessages = [];
  render();
};

window.loadChatMessages = async (threadId) => {
  console.log('Loading chat messages for thread:', threadId);
  if (!state.currentProject || !threadId) {
    console.error('Cannot load chat: no project or threadId');
    return;
  }
  
  try {
    const res = await api.get(`/projects/${state.currentProject.id}/chat?threadId=${threadId}`);
    console.log('Chat messages loaded:', res.data);
    state.chatMessages = res.data.messages || [];
    state.currentThread = threadId;
    render();
  } catch (e) {
    console.error('Load chat error:', e);
    alert('チャット履歴の読み込みに失敗しました');
  }
};

window.handleMobileNav = (nav) => {
  if (nav === 'write') {
    state.currentTab = 'writing';
  } else if (nav === 'manage') {
    openModal('newProject');
  } else if (nav === 'settings') {
    openModal('settings');
  }
  render();
};

window.openMobileAI = () => {
  // Open AI sidebar as modal on mobile
  alert('AI機能: クイックアクション、文体変換、カスタム指示が使えます');
};

let lastAIResult = '';
let editorCursorPosition = 0;

function showAIResult(result) {
  lastAIResult = result;
  // Save cursor position before showing modal
  const editor = $('#editor');
  if (editor) {
    editorCursorPosition = editor.selectionStart || 0;
  }
  const content = $('#ai-result-content');
  if (content) {
    content.innerHTML = marked.parse(result);
  }
  openModal('aiResult');
}

window.copyAIResult = () => {
  navigator.clipboard.writeText(lastAIResult).then(() => {
    const feedback = $('#copy-feedback');
    if (feedback) {
      feedback.classList.remove('hidden');
      setTimeout(() => feedback.classList.add('hidden'), 2000);
    }
  });
};

window.applyAIResult = (mode = 'append') => {
  if (!lastAIResult) {
    closeModal('aiResult');
    return;
  }
  
  const editor = $('#editor');
  if (!editor) {
    closeModal('aiResult');
    return;
  }
  
  const currentContent = editor.value || '';
  let newContent = '';
  
  switch (mode) {
    case 'append':
      // Add to end with line break
      newContent = currentContent + (currentContent ? '\n\n' : '') + lastAIResult;
      break;
    case 'prepend':
      // Add to beginning with line break
      newContent = lastAIResult + (currentContent ? '\n\n' : '') + currentContent;
      break;
    case 'cursor':
      // Insert at cursor position
      const before = currentContent.substring(0, editorCursorPosition);
      const after = currentContent.substring(editorCursorPosition);
      newContent = before + lastAIResult + after;
      break;
    case 'replace':
      // Full replacement - confirm first
      if (!confirm('現在の文章をすべて置き換えます。この操作は取り消せません。よろしいですか？')) {
        return;
      }
      newContent = lastAIResult;
      break;
    default:
      newContent = currentContent + '\n\n' + lastAIResult;
  }
  
  editor.value = newContent;
  
  // Update state and save
  if (state.currentWriting) {
    state.currentWriting.content = newContent;
    autoSave(newContent);
  }
  
  closeModal('aiResult');
  
  // Show success message
  const modeLabels = {
    append: '末尾に追加しました',
    prepend: '先頭に追加しました',
    cursor: 'カーソル位置に挿入しました',
    replace: '置き換えました'
  };
  console.log('AI result applied:', modeLabels[mode]);
};

function addToAIHistory(action, result) {
  const historyEl = $('#ai-history');
  if (historyEl) {
    const item = document.createElement('div');
    item.className = 'p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm';
    item.innerHTML = `<p class="font-medium text-indigo-600">${action}</p><p class="truncate text-gray-600 dark:text-gray-400">${result.substring(0, 100)}...</p>`;
    historyEl.prepend(item);
  }
}

function initCharts() {
  // Emotion curve chart
  const emotionCtx = document.getElementById('emotion-chart')?.getContext('2d');
  if (emotionCtx) {
    new Chart(emotionCtx, {
      type: 'line',
      data: {
        labels: ['始', '25%', '50%', '75%', '終'],
        datasets: [{
          label: '感情値',
          data: [0, 30, -20, 80, 50],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: -100, max: 100 }
        }
      }
    });
  }
  
  // Radar chart
  const radarCtx = document.getElementById('radar-chart')?.getContext('2d');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['アクション', 'ロマンス', 'ミステリー', 'コメディ', 'ドラマ', 'ファンタジー'],
        datasets: [{
          label: '作品成分',
          data: [50, 30, 60, 20, 70, 80],
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: '#8b5cf6',
          pointBackgroundColor: '#8b5cf6',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: { min: 0, max: 100 }
        }
      }
    });
  }
}

function renderAnalysisResults(analysis) {
  // Update emotion chart
  const emotionCtx = document.getElementById('emotion-chart')?.getContext('2d');
  if (emotionCtx && analysis.emotionCurve) {
    Chart.getChart(emotionCtx)?.destroy();
    new Chart(emotionCtx, {
      type: 'line',
      data: {
        labels: analysis.emotionCurve.map(p => p.label || `${p.point}%`),
        datasets: [{
          label: '感情値',
          data: analysis.emotionCurve.map(p => p.emotion),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: -100, max: 100 } }
      }
    });
  }
  
  // Update radar chart
  const radarCtx = document.getElementById('radar-chart')?.getContext('2d');
  if (radarCtx && analysis.radarChart) {
    Chart.getChart(radarCtx)?.destroy();
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: analysis.radarChart.map(p => p.axis),
        datasets: [{
          label: '作品成分',
          data: analysis.radarChart.map(p => p.value),
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: '#8b5cf6',
          pointBackgroundColor: '#8b5cf6',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { min: 0, max: 100 } }
      }
    });
    
    // Store chart data for expanded view
    window.radarChartData = {
      type: 'radar',
      data: {
        labels: analysis.radarChart.map(p => p.axis),
        datasets: [{
          label: '作品成分',
          data: analysis.radarChart.map(p => p.value),
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: '#8b5cf6',
          pointBackgroundColor: '#8b5cf6',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { min: 0, max: 100 } }
      }
    };
  }
  
  // Store emotion chart data for expanded view
  if (analysis.emotionCurve) {
    window.emotionChartData = {
      type: 'line',
      data: {
        labels: analysis.emotionCurve.map(p => p.label || `${p.point}%`),
        datasets: [{
          label: '感情値',
          data: analysis.emotionCurve.map(p => p.emotion),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: -100, max: 100 } }
      }
    };
  }
}

function renderCalendar() {
  const container = $('#calendar-container');
  if (!container) return;
  
  const date = state.calendarDate;
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  
  let html = `
    <div class="flex items-center justify-between mb-4">
      <button onclick="changeCalendarMonth(-1)" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><i class="fas fa-chevron-left"></i></button>
      <h4 class="text-lg font-semibold">${year}年 ${monthNames[month]}</h4>
      <button onclick="changeCalendarMonth(1)" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-sm mb-2">
      ${dayNames.map(d => `<div class="font-medium text-gray-500">${d}</div>`).join('')}
    </div>
    <div class="grid grid-cols-7 gap-1">
  `;
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="h-20"></div>';
  }
  
  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const events = state.calendarEvents.filter(e => e.event_date === dateStr);
    const hasDeadline = events.some(e => e.is_deadline);
    const hasMemo = events.some(e => !e.is_deadline);
    
    html += `
      <div onclick="openCalendarDay('${dateStr}')" 
        class="h-20 p-1 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${hasDeadline ? 'calendar-deadline' : hasMemo ? 'calendar-memo' : ''}">
        <div class="font-medium text-sm">${day}</div>
        ${events.slice(0, 2).map(e => `<div class="text-xs truncate ${e.is_deadline ? 'text-red-700' : 'text-yellow-800'}">${e.title}</div>`).join('')}
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

window.changeCalendarMonth = async (delta) => {
  state.calendarDate.setMonth(state.calendarDate.getMonth() + delta);
  await loadCalendarEvents(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1);
  renderCalendar();
};

// Old openCalendarDay removed - using new modal-based version defined earlier

// ============================================
// Initialize
// ============================================
async function init() {
  setTheme(state.theme);
  await checkSession();
  
  // Track login for achievements
  if (state.user && typeof trackActivity === 'function') {
    trackActivity('login');
  }
  
  render();
}

init();
