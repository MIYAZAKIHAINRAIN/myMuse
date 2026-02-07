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
  currentTab: 'writing',
  language: localStorage.getItem('language') || 'ja',
  theme: localStorage.getItem('theme') || 'light',
  zenMode: false,
  sidebarOpen: { left: true, right: true },
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
  searchResults: [],
  trash: [],
  isLoading: false,
  aiGenerating: false,
  authMode: 'login', // 'login' or 'signup'
  // Achievement System
  achievements: [],
  monthlyAchievements: [],
  currentMonthProgress: null,
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
    'tab.ideas': 'ネタ考案', 'tab.plot': 'プロット', 'tab.writing': 'ライティング', 'tab.chapters': '章',
    'tab.analysis': '分析・批評', 'tab.consultation': '相談AI', 'tab.achievements': '実績',
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
    'writing.export': 'エクスポート', 'writing.readAloud': '音声読み上げ', 'writing.characters': '文字数',
    'analysis.emotionCurve': '感情曲線', 'analysis.radar': '作品成分チャート', 'analysis.reviews': 'ペルソナ評価',
    'analysis.analyze': '作品を分析する', 'analysis.noContent': '分析するコンテンツがありません',
    'calendar.memo': 'メモ', 'calendar.deadline': '締め切り', 'calendar.daysLeft': '残り日数',
    'settings.profile': 'プロフィール', 'settings.theme': 'テーマ', 'settings.lightMode': 'ライトモード',
    'settings.darkMode': 'ダークモード', 'settings.plan': 'プラン管理', 'settings.betaNote': 'ベータ版につき全機能無料',
    'settings.logout': 'ログアウト', 'settings.deleteAccount': 'アカウント削除',
    'auth.login': 'ログイン', 'auth.signup': '新規登録', 'auth.email': 'メールアドレス',
    'auth.password': 'パスワード', 'auth.passwordConfirm': 'パスワード（確認）', 'auth.name': '名前',
    'common.save': '保存', 'common.cancel': 'キャンセル', 'common.delete': '削除',
    'common.restore': '復元', 'common.adopt': '採用', 'common.loading': '読み込み中...', 'common.error': 'エラーが発生しました',
    'common.generate': '生成', 'common.close': '閉じる', 'common.apply': '適用する',
    'plot.kishotenketsu': '起承転結', 'plot.threeAct': '三幕構成', 'plot.blakeSnyder': 'ブレイク・スナイダー',
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
    'idea.generate': 'アイデアを生成', 'idea.count': '生成数', 'idea.keywords': 'キーワード', 'idea.genre': 'ジャンル',
    'chat.placeholder': '相談したいことを入力...', 'chat.empty': 'AIに相談してみましょう', 'chat.hint': 'プロット、キャラクター、文章の悩みなど何でも相談できます',
  },
  en: {
    'app.title': 'myMuse', 'app.tagline': 'Your all-knowing writing companion',
    'nav.home': 'Home', 'nav.write': 'Write', 'nav.manage': 'Manage', 'nav.settings': 'Settings',
    'sidebar.projects': 'Projects', 'sidebar.newProject': 'New Project', 'sidebar.newFolder': 'New Folder',
    'sidebar.trash': 'Trash', 'sidebar.search': 'Search', 'sidebar.calendar': 'Calendar',
    'sidebar.language': 'Language', 'sidebar.aiCredits': 'AI Credits',
    'tab.ideas': 'Ideas', 'tab.plot': 'Plot', 'tab.writing': 'Writing', 'tab.chapters': 'Chapters',
    'tab.analysis': 'Analysis', 'tab.consultation': 'AI Chat', 'tab.achievements': 'Achievements',
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
    'writing.export': 'Export', 'writing.readAloud': 'Read Aloud', 'writing.characters': 'Characters',
    'analysis.emotionCurve': 'Emotion Curve', 'analysis.radar': 'Genre Chart', 'analysis.reviews': 'Reviews',
    'analysis.analyze': 'Analyze Work', 'analysis.noContent': 'No content to analyze',
    'calendar.memo': 'Memo', 'calendar.deadline': 'Deadline', 'calendar.daysLeft': 'Days Left',
    'settings.profile': 'Profile', 'settings.theme': 'Theme', 'settings.lightMode': 'Light Mode',
    'settings.darkMode': 'Dark Mode', 'settings.plan': 'Plan', 'settings.betaNote': 'All features free during beta',
    'settings.logout': 'Logout', 'settings.deleteAccount': 'Delete Account',
    'auth.login': 'Login', 'auth.signup': 'Sign Up', 'auth.email': 'Email',
    'auth.password': 'Password', 'auth.passwordConfirm': 'Confirm Password', 'auth.name': 'Name',
    'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
    'common.restore': 'Restore', 'common.adopt': 'Adopt', 'common.loading': 'Loading...', 'common.error': 'An error occurred',
    'common.generate': 'Generate', 'common.close': 'Close', 'common.apply': 'Apply',
    'plot.kishotenketsu': 'Ki-Sho-Ten-Ketsu', 'plot.threeAct': 'Three Act', 'plot.blakeSnyder': 'Blake Snyder',
    'plot.ki': 'Setup', 'plot.sho': 'Development', 'plot.ten': 'Twist', 'plot.ketsu': 'Conclusion',
    'plot.act1': 'Act 1', 'plot.act2': 'Act 2', 'plot.act3': 'Act 3',
    'genre.literary': 'Literary Fiction', 'genre.contemporary': 'Contemporary', 'genre.fantasy': 'Fantasy',
    'genre.scifi': 'Sci-Fi', 'genre.mystery': 'Mystery', 'genre.suspense': 'Suspense',
    'genre.horror': 'Horror', 'genre.romance': 'Romance', 'genre.historical': 'Historical',
    'genre.adventure': 'Adventure/Action', 'genre.lightnovel': 'Light Novel', 'genre.children': 'Children\'s',
    'genre.essay': 'Essay', 'genre.critique': 'Critique', 'genre.business': 'Business',
    'genre.selfhelp': 'Self-Help', 'genre.philosophy': 'Philosophy', 'genre.sociology': 'Sociology',
    'genre.historyNF': 'History (NF)', 'genre.science': 'Science', 'genre.journalism': 'Journalism',
    'genre.biography': 'Biography',
    'idea.generate': 'Generate Ideas', 'idea.count': 'Count', 'idea.keywords': 'Keywords', 'idea.genre': 'Genre',
    'chat.placeholder': 'Ask your writing assistant...', 'chat.empty': 'Chat with AI', 'chat.hint': 'Ask about plot, characters, writing style, and more',
  },
  zh: {
    'app.title': 'myMuse', 'app.tagline': '全知全能的写作伙伴',
    'nav.home': '首页', 'nav.write': '写作', 'nav.manage': '管理', 'nav.settings': '设置',
    'sidebar.projects': '项目', 'sidebar.newProject': '新建项目', 'sidebar.newFolder': '新建文件夹',
    'sidebar.trash': '回收站', 'sidebar.search': '搜索', 'sidebar.calendar': '日历',
    'sidebar.language': '语言', 'sidebar.aiCredits': 'AI额度',
    'tab.ideas': '创意', 'tab.plot': '情节', 'tab.writing': '写作', 'tab.analysis': '分析', 'tab.consultation': 'AI咨询',
    'ai.continue': '续写', 'ai.rewrite': '重写', 'ai.expand': '扩展', 'ai.proofread': '校对',
    'ai.summarize': '总结', 'ai.translate': '翻译', 'ai.titleSuggestion': '标题建议',
    'ai.formal': '正式', 'ai.casual': '随意', 'ai.literary': '文学',
    'ai.customPrompt': '自定义指令', 'ai.targetWords': '目标字数', 'ai.generate': '生成',
    'writing.zenMode': 'ZEN模式', 'writing.vertical': '竖排', 'writing.horizontal': '横排',
    'writing.export': '导出', 'writing.readAloud': '朗读', 'writing.characters': '字数',
    'analysis.emotionCurve': '情感曲线', 'analysis.radar': '类型图', 'analysis.reviews': '评价',
    'analysis.analyze': '分析作品', 'analysis.noContent': '没有可分析的内容',
    'settings.profile': '个人资料', 'settings.theme': '主题', 'settings.lightMode': '浅色模式',
    'settings.darkMode': '深色模式', 'settings.logout': '登出', 'settings.betaNote': '测试期间所有功能免费',
    'auth.login': '登录', 'auth.signup': '注册', 'auth.email': '邮箱', 'auth.password': '密码', 'auth.name': '姓名',
    'common.save': '保存', 'common.cancel': '取消', 'common.delete': '删除', 'common.restore': '恢复',
    'common.loading': '加载中...', 'common.error': '发生错误', 'common.generate': '生成', 'common.close': '关闭',
    'chat.placeholder': '输入您的问题...', 'chat.empty': '与AI对话', 'chat.hint': '询问情节、人物、写作风格等',
  },
  ko: {
    'app.title': 'myMuse', 'app.tagline': '모든 것을 아는 글쓰기 동반자',
    'nav.home': '홈', 'nav.write': '집필', 'nav.manage': '관리', 'nav.settings': '설정',
    'sidebar.projects': '프로젝트', 'sidebar.newProject': '새 프로젝트', 'sidebar.newFolder': '새 폴더',
    'sidebar.trash': '휴지통', 'sidebar.search': '검색', 'sidebar.calendar': '캘린더',
    'sidebar.language': '언어', 'sidebar.aiCredits': 'AI 크레딧',
    'tab.ideas': '아이디어', 'tab.plot': '플롯', 'tab.writing': '집필', 'tab.analysis': '분석', 'tab.consultation': 'AI 상담',
    'ai.continue': '계속 쓰기', 'ai.rewrite': '다시 쓰기', 'ai.expand': '확장', 'ai.proofread': '교정',
    'ai.summarize': '요약', 'ai.translate': '번역', 'ai.titleSuggestion': '제목 제안',
    'ai.formal': '격식체', 'ai.casual': '비격식체', 'ai.literary': '문학적',
    'ai.customPrompt': '사용자 정의', 'ai.targetWords': '목표 글자 수', 'ai.generate': '생성',
    'writing.zenMode': 'ZEN 모드', 'writing.export': '내보내기', 'writing.readAloud': '읽어주기', 'writing.characters': '글자 수',
    'analysis.analyze': '작품 분석', 'analysis.noContent': '분석할 내용이 없습니다',
    'settings.lightMode': '라이트 모드', 'settings.darkMode': '다크 모드', 'settings.logout': '로그아웃', 'settings.betaNote': '베타 기간 모든 기능 무료',
    'auth.login': '로그인', 'auth.signup': '회원가입', 'auth.email': '이메일', 'auth.password': '비밀번호', 'auth.name': '이름',
    'common.save': '저장', 'common.cancel': '취소', 'common.delete': '삭제', 'common.loading': '로딩 중...', 'common.error': '오류가 발생했습니다',
    'chat.placeholder': '질문을 입력하세요...', 'chat.empty': 'AI와 대화하기',
  },
  es: {
    'app.title': 'myMuse', 'app.tagline': 'Tu compañero de escritura omnisciente',
    'nav.home': 'Inicio', 'nav.write': 'Escribir', 'nav.manage': 'Gestionar', 'nav.settings': 'Ajustes',
    'sidebar.projects': 'Proyectos', 'sidebar.newProject': 'Nuevo proyecto', 'sidebar.trash': 'Papelera',
    'sidebar.search': 'Buscar', 'sidebar.calendar': 'Calendario', 'sidebar.language': 'Idioma',
    'tab.ideas': 'Ideas', 'tab.plot': 'Trama', 'tab.writing': 'Escritura', 'tab.analysis': 'Análisis', 'tab.consultation': 'Chat AI',
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
    'tab.ideas': 'Idées', 'tab.plot': 'Intrigue', 'tab.writing': 'Écriture', 'tab.analysis': 'Analyse', 'tab.consultation': 'Chat AI',
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
    'tab.ideas': 'Ideen', 'tab.plot': 'Handlung', 'tab.writing': 'Schreiben', 'tab.analysis': 'Analyse', 'tab.consultation': 'AI-Chat',
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
    'tab.ideas': 'Ideias', 'tab.plot': 'Enredo', 'tab.writing': 'Escrita', 'tab.analysis': 'Análise', 'tab.consultation': 'Chat AI',
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
    'tab.ideas': 'Идеи', 'tab.plot': 'Сюжет', 'tab.writing': 'Написание', 'tab.analysis': 'Анализ', 'tab.consultation': 'Чат AI',
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
    'tab.ideas': 'أفكار', 'tab.plot': 'الحبكة', 'tab.writing': 'الكتابة', 'tab.analysis': 'تحليل', 'tab.consultation': 'دردشة AI',
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
    'tab.ideas': 'विचार', 'tab.plot': 'कथानक', 'tab.writing': 'लेखन', 'tab.analysis': 'विश्लेषण', 'tab.consultation': 'AI चैट',
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
    'tab.ideas': 'ไอเดีย', 'tab.plot': 'พล็อต', 'tab.writing': 'การเขียน', 'tab.analysis': 'วิเคราะห์', 'tab.consultation': 'แชท AI',
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

function countWords(text) {
  if (!text) return 0;
  return text.replace(/\s/g, '').length;
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
    const [projectsRes, foldersRes] = await Promise.all([
      api.get(`/projects?userId=${state.user.id}`),
      api.get(`/folders?userId=${state.user.id}`)
    ]);
    state.projects = projectsRes.data.projects || [];
    state.folders = foldersRes.data.folders || [];
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
    alert(t('common.error'));
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
      indicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>保存中...';
      indicator.className = 'text-sm text-yellow-600 dark:text-yellow-400 flex items-center';
      break;
    case 'saved':
      indicator.innerHTML = '<i class="fas fa-check mr-1"></i>保存済み';
      indicator.className = 'text-sm text-green-600 dark:text-green-400 flex items-center';
      break;
    case 'unsaved':
      indicator.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i>未保存';
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
    el.textContent = `${state.currentWriting.word_count || 0} 文字`;
  }
}

// ============================================
// AI Functions
// ============================================
let aiAbortController = null;

async function callAI(action, content, options = {}) {
  if (!state.currentProject) return null;
  
  // Create new abort controller for this request
  aiAbortController = new AbortController();
  state.aiGenerating = true;
  renderAISidebar(); // Update sidebar to show loading state
  
  try {
    const res = await api.post('/ai/generate', {
      action,
      content,
      projectId: state.currentProject.id,
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
  
  if (!state.currentProject) {
    console.error('No current project selected');
    alert('プロジェクトを選択してください');
    return;
  }
  
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
    // Save user message
    await api.post(`/projects/${state.currentProject.id}/chat`, {
      thread_id: threadId,
      role: 'user',
      content,
      tab_context: tabContext,
    });
    
    console.log('Calling AI...');
    // Get AI response
    const response = await callAI('consultation', content);
    console.log('AI response:', response);
    
    if (response) {
      const aiMsg = { id: crypto.randomUUID(), role: 'assistant', content: response, created_at: new Date().toISOString() };
      state.chatMessages.push(aiMsg);
      
      // Save AI message
      await api.post(`/projects/${state.currentProject.id}/chat`, {
        thread_id: threadId,
        role: 'assistant',
        content: response,
        tab_context: tabContext,
      });
      
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
  if (!state.currentWriting?.content) return;
  
  const content = state.currentWriting.content;
  const title = state.currentProject?.title || 'document';
  
  if (format === 'txt') {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${title}.txt`);
  } else if (format === 'html') {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body><pre>${content}</pre></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, `${title}.html`);
  }
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
        <main class="flex-1 overflow-hidden ${!isMobile && state.sidebarOpen.left ? 'ml-64' : ''} ${!isMobile && state.sidebarOpen.right ? 'mr-80' : ''} transition-all duration-300">
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
        
        <button onclick="toggleZenMode()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="${t('writing.zenMode')}">
          <i class="fas ${state.zenMode ? 'fa-compress' : 'fa-expand'}"></i>
        </button>
        
        <button onclick="openModal('settings')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-cog"></i>
        </button>
        
        <button onclick="toggleSidebar('right')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-robot"></i>
        </button>
      </div>
    </header>
  `;
}

function renderLeftSidebar() {
  if (!state.sidebarOpen.left) return '';
  
  return `
    <aside class="sidebar-left fixed left-0 top-14 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 animate-slide-in">
      <div class="p-4 space-y-4">
        <!-- Search -->
        <div class="relative">
          <input type="text" id="global-search" placeholder="${t('sidebar.search')}"
            class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
          <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
        </div>
        
        <!-- New Project Button -->
        <button onclick="openModal('newProject')" class="w-full flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <i class="fas fa-plus"></i>
          <span>${t('sidebar.newProject')}</span>
        </button>
        
        <!-- Projects List -->
        <div class="space-y-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">${t('sidebar.projects')}</h3>
          ${state.folders.map(folder => `
            <div class="space-y-1">
              <div class="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-folder"></i>
                <span>${folder.name}</span>
              </div>
              ${state.projects.filter(p => p.folder_id === folder.id).map(project => renderProjectItem(project)).join('')}
            </div>
          `).join('')}
          
          <!-- Projects without folder -->
          ${state.projects.filter(p => !p.folder_id).map(project => renderProjectItem(project)).join('')}
        </div>
        
        <!-- Calendar -->
        <button onclick="openModal('calendar')" class="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-calendar-alt"></i>
          <span>${t('sidebar.calendar')}</span>
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
  return `
    <div class="h-full flex flex-col">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4">
        ${['ideas', 'plot', 'writing', 'chapters', 'analysis', 'consultation', 'achievements'].map(tab => `
          <button onclick="switchTab('${tab}')" 
            class="px-4 py-3 text-sm font-medium transition ${state.currentTab === tab ? 'tab-active' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'} ${tab === 'achievements' ? 'ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : ''}">
            <i class="fas ${getTabIcon(tab)} mr-1 ${tab === 'achievements' ? 'text-yellow-500' : ''}"></i>
            ${t(`tab.${tab}`)}
          </button>
        `).join('')}
      </div>
      
      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        ${renderTabContent()}
      </div>
    </div>
  `;
}

function getTabIcon(tab) {
  const icons = { ideas: 'fa-lightbulb', plot: 'fa-sitemap', writing: 'fa-pen-fancy', chapters: 'fa-list-alt', analysis: 'fa-chart-pie', consultation: 'fa-comments', achievements: 'fa-trophy' };
  return icons[tab] || 'fa-circle';
}

function renderTabContent() {
  switch (state.currentTab) {
    case 'ideas': return renderIdeasTab();
    case 'plot': return renderPlotTab();
    case 'writing': return renderWritingTab();
    case 'chapters': return renderChaptersTab();
    case 'analysis': return renderAnalysisTab();
    case 'consultation': return renderConsultationTab();
    case 'achievements': return renderAchievementsTab();
    default: return renderWritingTab();
  }
}

function renderIdeasTab() {
  const allGenres = [
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
  
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Idea Generator -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-magic mr-2 text-indigo-500"></i>${t('idea.generate')}</h3>
        
        <!-- Genre Multi-Select -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">ジャンル（複数選択可）</label>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg dark:border-gray-600">
            ${allGenres.map(g => `
              <label class="flex items-center gap-1 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                <input type="checkbox" name="idea-genre" value="${g.value}" class="genre-checkbox rounded">
                <span class="truncate">${g.label}</span>
              </label>
            `).join('')}
          </div>
          <p class="text-xs text-gray-500 mt-1">選択したジャンルを組み合わせたアイデアを生成します</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">キーワード</label>
            <input type="text" id="idea-keywords" placeholder="例: 魔法、冒険、友情"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('idea.count')}</label>
            <select id="idea-count" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="3">3</option>
              <option value="5" selected>5</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
        <button onclick="handleGenerateIdeas()" 
          class="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          ${state.aiGenerating ? 'disabled' : ''}>
          ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-wand-magic-sparkles"></i>'}
          <span>${t('ai.generate')}</span>
        </button>
      </div>
      
      <!-- Ideas List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${state.ideas.map(idea => `
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 ${idea.adopted ? 'ring-2 ring-green-500' : ''}">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-medium">${idea.title}</h4>
              ${idea.adopted ? '<span class="text-green-500 text-xs"><i class="fas fa-check-circle"></i> 採用済</span>' : ''}
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${idea.content || ''}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">${idea.genre || ''}</span>
              <div class="flex gap-2">
                ${idea.adopted ? `
                  <button onclick="unadoptIdea('${idea.id}')" class="text-sm text-red-600 hover:underline">
                    <i class="fas fa-times mr-1"></i>採用取消
                  </button>
                ` : `
                  <button onclick="adoptIdea('${idea.id}')" class="text-sm text-indigo-600 hover:underline">
                    <i class="fas fa-arrow-right mr-1"></i>${t('common.adopt')}
                  </button>
                `}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPlotTab() {
  let structure = {};
  try { structure = JSON.parse(state.plot?.structure || '{}'); } catch (e) {}
  const template = state.plot?.template || 'kishotenketsu';
  
  // Get adopted ideas
  const adoptedIdeas = (state.ideas || []).filter(idea => idea.adopted);
  
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Adopted Ideas Section -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm p-4 border border-green-200 dark:border-green-800">
        <h3 class="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
          <i class="fas fa-lightbulb"></i>採用したアイディア
        </h3>
        ${adoptedIdeas.length > 0 ? `
          <div class="space-y-2">
            ${adoptedIdeas.map(idea => `
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-300 dark:border-green-700 flex items-start gap-3">
                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                <div class="flex-1">
                  <p class="font-medium text-gray-800 dark:text-gray-200">${idea.title}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${idea.content || ''}</p>
                </div>
                <button onclick="unadoptIdea('${idea.id}')" 
                  class="text-gray-400 hover:text-red-500 p-1" title="採用を取り消す">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="text-gray-500 dark:text-gray-400 text-sm italic">
            <i class="fas fa-info-circle mr-1"></i>
            アイディアタブで生成したアイディアを採用すると、ここに表示されます
          </p>
        `}
      </div>
      
      <!-- Template Selector -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-wrap gap-2">
          ${['kishotenketsu', 'three_act', 'blake_snyder'].map(t => `
            <button onclick="changePlotTemplate('${t}')"
              class="px-4 py-2 rounded-lg transition ${template === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}">
              ${t === 'kishotenketsu' ? '起承転結' : t === 'three_act' ? '三幕構成' : 'ブレイク・スナイダー'}
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- Plot Structure -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        ${renderPlotStructure(template, structure)}
        
        <div class="mt-4 flex gap-2">
          <button onclick="savePlot()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <i class="fas fa-save mr-1"></i>${t('common.save')}
          </button>
          <button onclick="handleAICompletePlot()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            ${state.aiGenerating ? 'disabled' : ''}>
            ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-magic mr-1"></i>'}
            AI補完
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPlotStructure(template, structure) {
  if (template === 'kishotenketsu') {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${['ki', 'sho', 'ten', 'ketsu'].map(part => `
          <div class="space-y-2">
            <label class="block font-medium text-indigo-600">${t(`plot.${part}`)}</label>
            <textarea id="plot-${part}" rows="4" 
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
              placeholder="${getPlotPlaceholder(part)}">${structure[part] || ''}</textarea>
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
            <textarea id="plot-${part}" rows="3"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none">${structure[part] || ''}</textarea>
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

function renderWritingTab() {
  const writing = state.currentWriting;
  const isVertical = writing?.writing_direction === 'vertical';
  
  return `
    <div class="h-full flex flex-col">
      <!-- Pinned Plot (if exists) -->
      ${state.currentProject?.pinned_plot ? `
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div class="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <i class="fas fa-thumbtack"></i>
            <span class="font-medium">プロット参照:</span>
          </div>
          <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">${state.currentProject.pinned_plot}</p>
        </div>
      ` : ''}
      
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-2 mb-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
        <button onclick="toggleWritingDirection()" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
          <i class="fas ${isVertical ? 'fa-grip-lines' : 'fa-grip-lines-vertical'} mr-1"></i>
          ${isVertical ? t('writing.horizontal') : t('writing.vertical')}
        </button>
        
        <select id="font-select" onchange="changeFont(this.value)" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded">
          <option value="Noto Sans JP">Noto Sans JP</option>
          <option value="Noto Serif JP">Noto Serif JP</option>
          <option value="Shippori Mincho">しっぽり明朝</option>
          <option value="BIZ UDMincho">BIZ UD明朝</option>
        </select>
        
        <div class="flex-1"></div>
        
        <!-- Save indicator and button -->
        <span id="save-indicator" class="text-sm text-green-600 dark:text-green-400 flex items-center">
          <i class="fas fa-check mr-1"></i>保存済み
        </span>
        
        <button onclick="manualSave()" class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1">
          <i class="fas fa-save"></i>
          <span class="hidden sm:inline">${t('common.save')}</span>
        </button>
        
        <span id="word-count" class="text-sm text-gray-500">${writing?.word_count || 0} 文字</span>
        
        <button onclick="readAloud()" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
          <i class="fas fa-volume-up mr-1"></i>${t('writing.readAloud')}
        </button>
        
        <div class="relative">
          <button onclick="toggleExportMenu()" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            <i class="fas fa-download mr-1"></i>${t('writing.export')}
          </button>
          <div id="export-menu" class="hidden absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-10">
            <button onclick="exportAs('txt')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">TXT</button>
            <button onclick="exportAs('html')" class="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">HTML</button>
          </div>
        </div>
      </div>
      
      <!-- Editor -->
      <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <textarea id="editor" 
          class="w-full h-full p-6 resize-none focus:outline-none dark:bg-gray-800 ${isVertical ? 'writing-vertical' : ''}"
          style="font-family: '${writing?.font_family || 'Noto Sans JP'}', sans-serif; font-size: 16px; line-height: 2;"
          placeholder="ここに物語を紡いでください..."
          oninput="autoSave(this.value)">${writing?.content || ''}</textarea>
      </div>
    </div>
  `;
}

function renderChaptersTab() {
  const writings = state.writings || [];
  
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Chapter Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-list-alt mr-2 text-indigo-500"></i>章の一覧
          </h3>
          <button onclick="createNewChapter()" 
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
            <i class="fas fa-plus mr-1"></i>新しい章を追加
          </button>
        </div>
        
        ${writings.length > 0 ? `
          <div class="space-y-3">
            ${writings.map((w, index) => `
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div class="flex items-center gap-4">
                  <span class="w-10 h-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold">
                    ${index + 1}
                  </span>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <input type="text" value="${w.chapter_title || `第${index + 1}章`}" 
                        onchange="updateChapterTitle('${w.id}', this.value)"
                        class="font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 -ml-1 flex-1">
                      <button onclick="selectWriting('${w.id}')" 
                        class="text-indigo-600 hover:text-indigo-700 text-sm">
                        <i class="fas fa-edit mr-1"></i>編集
                      </button>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span><i class="fas fa-font mr-1"></i>${w.word_count || 0}文字</span>
                      <span><i class="fas fa-clock mr-1"></i>${formatDate(w.updated_at)}</span>
                    </div>
                  </div>
                  <button onclick="analyzeChapter('${w.id}')"
                    class="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50">
                    <i class="fas fa-magic mr-1"></i>AI分析
                  </button>
                </div>
                ${w.ai_suggestions ? `
                  <div class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p class="text-sm text-yellow-800 dark:text-yellow-200">
                      <i class="fas fa-lightbulb mr-1"></i>改善提案: ${w.ai_suggestions}
                    </p>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-12 text-gray-500">
            <i class="fas fa-book-open text-4xl mb-4 opacity-50"></i>
            <p>まだ章がありません</p>
            <p class="text-sm">「新しい章を追加」ボタンで執筆を始めましょう</p>
          </div>
        `}
      </div>
      
      <!-- Chapter Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-indigo-600">${writings.length}</p>
          <p class="text-sm text-gray-500">総章数</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-green-600">${writings.reduce((sum, w) => sum + (w.word_count || 0), 0).toLocaleString()}</p>
          <p class="text-sm text-gray-500">総文字数</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-purple-600">${writings.length > 0 ? Math.round(writings.reduce((sum, w) => sum + (w.word_count || 0), 0) / writings.length).toLocaleString() : 0}</p>
          <p class="text-sm text-gray-500">平均文字数/章</p>
        </div>
      </div>
    </div>
  `;
}

function renderAnalysisTab() {
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-chart-line mr-2 text-indigo-500"></i>${t('analysis.emotionCurve')}</h3>
        <div class="h-64">
          <canvas id="emotion-chart"></canvas>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4"><i class="fas fa-chart-pie mr-2 text-indigo-500"></i>${t('analysis.radar')}</h3>
          <div class="h-64">
            <canvas id="radar-chart"></canvas>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4"><i class="fas fa-users mr-2 text-indigo-500"></i>${t('analysis.reviews')}</h3>
          <div id="reviews-container" class="space-y-3">
            <p class="text-gray-500 text-sm">分析ボタンを押して評価を生成してください</p>
          </div>
        </div>
      </div>
      
      <button onclick="handleAnalyze()" 
        class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
        ${state.aiGenerating ? 'disabled' : ''}>
        ${state.aiGenerating ? '<div class="spinner"></div>' : '<i class="fas fa-search-plus"></i>'}
        <span>${t('analysis.analyze')}</span>
      </button>
    </div>
  `;
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
        <div class="overflow-y-auto h-full">
          ${state.chatThreads.map(thread => `
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
        <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
        <p>AIに相談してみましょう</p>
        <p class="text-sm mt-2">プロット、キャラクター、文章の悩みなど何でも相談できます</p>
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
  const writings = state.writings || [];
  const totalWords = writings.reduce((sum, w) => sum + (w.word_count || 0), 0);
  const projectCount = state.projects?.length || 0;
  const adoptedIdeas = (state.ideas || []).filter(i => i.adopted).length;
  
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
      completed: writings.length >= 3,
      progress: `${writings.length} / 3 章`
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

// Badge history stored in localStorage
function getBadgeHistory() {
  try {
    const saved = localStorage.getItem('badgeHistory');
    return saved ? JSON.parse(saved) : { platinum: 0, gold: 0, silver: 0, bronze: 0, encouragement: 0 };
  } catch (e) {
    return { platinum: 0, gold: 0, silver: 0, bronze: 0, encouragement: 0 };
  }
}

function saveBadgeHistory(history) {
  localStorage.setItem('badgeHistory', JSON.stringify(history));
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
function getActivityLog() {
  try {
    const saved = localStorage.getItem('activityLog');
    return saved ? JSON.parse(saved) : {
      wordsWrittenToday: 0,
      loginDaysThisWeek: [],
      aiConsultations: 0,
      plotCompleted: false,
      ideasAdopted: 0,
      analysisPerformed: 0,
      lastUpdated: new Date().toDateString()
    };
  } catch (e) {
    return { wordsWrittenToday: 0, loginDaysThisWeek: [], aiConsultations: 0, plotCompleted: false, ideasAdopted: 0, analysisPerformed: 0, lastUpdated: new Date().toDateString() };
  }
}

function saveActivityLog(log) {
  log.lastUpdated = new Date().toDateString();
  localStorage.setItem('activityLog', JSON.stringify(log));
}

// Track activity and auto-unlock achievements
function trackActivity(activityType, value = 1) {
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
      break;
    case 'login':
      if (!log.loginDaysThisWeek.includes(today)) {
        log.loginDaysThisWeek.push(today);
        // Keep only last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        log.loginDaysThisWeek = log.loginDaysThisWeek.filter(d => new Date(d) >= weekAgo);
      }
      break;
    case 'aiConsultation':
      log.aiConsultations += value;
      break;
    case 'plotComplete':
      log.plotCompleted = true;
      break;
    case 'ideaAdopt':
      log.ideasAdopted += value;
      break;
    case 'analysis':
      log.analysisPerformed += value;
      break;
  }
  
  saveActivityLog(log);
  checkAchievementsFromLog(log);
}

// Check achievements based on activity log
function checkAchievementsFromLog(log) {
  if (!state.monthlyAchievements) {
    state.monthlyAchievements = getDefaultMonthlyGoals();
  }
  
  let unlockedAchievements = [];
  
  state.monthlyAchievements.forEach((goal, index) => {
    if (goal.completed) return; // Already completed
    
    let shouldUnlock = false;
    
    // Check conditions based on goal id
    switch(goal.id) {
      case 1: // 1日1000文字
        shouldUnlock = log.wordsWrittenToday >= 1000;
        break;
      case 2: // 週5日ログイン
        shouldUnlock = log.loginDaysThisWeek.length >= 5;
        break;
      case 3: // AIと10回相談
        shouldUnlock = log.aiConsultations >= 10;
        break;
      case 4: // プロット完成
        shouldUnlock = log.plotCompleted;
        break;
      case 5: // 5つのアイデア採用
        shouldUnlock = log.ideasAdopted >= 5;
        break;
      case 6: // 作品を1回分析
        shouldUnlock = log.analysisPerformed >= 1;
        break;
    }
    
    if (shouldUnlock) {
      state.monthlyAchievements[index].completed = true;
      unlockedAchievements.push(goal.title);
    }
  });
  
  // Show notification if achievements were unlocked
  if (unlockedAchievements.length > 0) {
    localStorage.setItem('monthlyAchievements', JSON.stringify(state.monthlyAchievements));
    localStorage.setItem('achievementMonth', new Date().getMonth().toString());
    
    const message = unlockedAchievements.map(t => `実績『${t}』を解除しました！`).join('\n');
    setTimeout(() => alert(message), 100);
    
    // Check if all completed and update badge history
    checkAndUpdateBadgeHistory();
    render();
  }
  
  return unlockedAchievements.length > 0 ? unlockedAchievements : '更新なし';
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
  const lastBadgeMonth = localStorage.getItem('lastBadgeMonth');
  const lastBadgeTier = localStorage.getItem('lastBadgeTier') || '';
  
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
    localStorage.setItem('lastBadgeMonth', currentMonth);
    localStorage.setItem('lastBadgeTier', currentTier);
    localStorage.setItem('lastAchievementReset', currentMonth);
    saveBadgeHistory(history);
    
    // Show congratulation message
    const tierNames = { platinum: 'プラチナ', gold: 'ゴールド', silver: 'シルバー', bronze: 'ブロンズ', encouragement: '頑張ってね' };
    alert(`🎉 今月の実績確定！「${tierNames[currentTier]}」バッジを獲得しました！`);
    
    // Reset activity log for next month
    resetActivityLogForNewMonth();
  }
}

function resetActivityLogForNewMonth() {
  const newLog = {
    wordsWrittenToday: 0,
    loginDaysThisWeek: [],
    aiConsultations: 0,
    plotCompleted: false,
    ideasAdopted: 0,
    analysisPerformed: 0,
    lastUpdated: new Date().toDateString()
  };
  localStorage.setItem('activityLog', JSON.stringify(newLog));
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
  // Only show AI Partner in writing tab
  if (!state.sidebarOpen.right || state.currentTab !== 'writing') return '';
  
  return `
    <aside class="sidebar-right fixed right-0 top-14 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-30">
      <div class="p-4 space-y-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <i class="fas fa-robot mr-1"></i>AIパートナー
        </h3>
        
        <!-- AI Generating Status / Cancel -->
        ${state.aiGenerating ? `
        <div class="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4 space-y-2">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-indigo-700 dark:text-indigo-300 text-sm font-medium">AI生成中...</span>
          </div>
          <button onclick="cancelAIGeneration()"
            class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition flex items-center justify-center gap-2">
            <i class="fas fa-times-circle"></i>
            キャンセル
          </button>
        </div>
        ` : ''}
        
        <!-- Quick Actions -->
        <div class="space-y-2 ${state.aiGenerating ? 'opacity-50 pointer-events-none' : ''}">
          <p class="text-xs text-gray-500">クイックアクション</p>
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
            placeholder="カスタム指示を入力..."></textarea>
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
          <p class="text-xs text-gray-500">AIレスポンス履歴</p>
          <div id="ai-history" class="max-h-64 overflow-y-auto space-y-2">
            <p class="text-sm text-gray-400 italic">アクションを実行するとここに履歴が表示されます</p>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function renderAISidebar() {
  const sidebar = $('.sidebar-right');
  if (sidebar) {
    sidebar.innerHTML = renderRightSidebar().replace(/<aside[^>]*>|<\/aside>/g, '');
  }
}

function renderMobileNav() {
  return `
    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 z-50 md:hidden">
      ${['home', 'write', 'manage', 'settings'].map(nav => `
        <button onclick="handleMobileNav('${nav}')" class="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400">
          <i class="fas ${nav === 'home' ? 'fa-home' : nav === 'write' ? 'fa-pen' : nav === 'manage' ? 'fa-folder' : 'fa-cog'}"></i>
          <span class="text-xs mt-1">${t(`nav.${nav}`)}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function renderMobileFAB() {
  return `
    <button onclick="openMobileAI()" 
      class="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 md:hidden">
      <i class="fas fa-robot text-xl"></i>
    </button>
  `;
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
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('settings')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-cog mr-2"></i>${t('nav.settings')}</h3>
        <div class="space-y-4">
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
          
          <button type="button" onclick="logout()" class="w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <i class="fas fa-sign-out-alt mr-1"></i>${t('settings.logout')}
          </button>
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
  `;
}

// ============================================
// Event Handlers
// ============================================
function attachEventListeners() {
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
  }
  
  await api.put(`/plots/${state.plot.id}`, {
    template,
    structure: JSON.stringify(structure),
  });
  
  state.plot.structure = JSON.stringify(structure);
  alert('プロットを保存しました');
};

window.handleAICompletePlot = async () => {
  const template = state.plot?.template || 'kishotenketsu';
  let currentPlot = '';
  
  if (template === 'kishotenketsu') {
    currentPlot = `起: ${$('#plot-ki')?.value || '(空欄)'}\n承: ${$('#plot-sho')?.value || '(空欄)'}\n転: ${$('#plot-ten')?.value || '(空欄)'}\n結: ${$('#plot-ketsu')?.value || '(空欄)'}`;
  }
  
  const result = await callAI('plot_complete', currentPlot);
  if (result) {
    showAIResult(result);
  }
};

window.toggleWritingDirection = async () => {
  if (!state.currentWriting) return;
  const newDirection = state.currentWriting.writing_direction === 'vertical' ? 'horizontal' : 'vertical';
  state.currentWriting.writing_direction = newDirection;
  render();
};

window.changeFont = (font) => {
  if (!state.currentWriting) return;
  state.currentWriting.font_family = font;
  const editor = $('#editor');
  if (editor) editor.style.fontFamily = `'${font}', sans-serif`;
};

window.toggleExportMenu = () => {
  $('#export-menu')?.classList.toggle('hidden');
};

window.handleQuickAction = async (action) => {
  const content = state.currentWriting?.content || '';
  if (!content && action !== 'title') {
    alert('テキストを入力してください');
    return;
  }
  
  const result = await callAI(action, content);
  if (result) {
    showAIResult(result);
    addToAIHistory(action, result);
  }
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
    alert('カスタム指示を入力してください');
    return;
  }
  
  const result = await callAI('custom', content, { customPrompt, targetWordCount: targetWords });
  if (result) {
    showAIResult(result);
    addToAIHistory('custom', result);
  }
};

// Chapter management functions
window.createNewChapter = async () => {
  if (!state.currentProject) {
    alert('プロジェクトを選択してください');
    return;
  }
  
  const chapterNumber = (state.writings?.length || 0) + 1;
  const title = prompt('章のタイトルを入力してください:', `第${chapterNumber}章`);
  if (!title) return;
  
  try {
    const res = await api.post('/writings', {
      project_id: state.currentProject.id,
      chapter_title: title,
      content: '',
      word_count: 0
    });
    
    state.writings = [...(state.writings || []), res.data];
    state.currentWriting = res.data;
    state.currentTab = 'writing';
    render();
  } catch (e) {
    console.error('Create chapter error:', e);
    alert('章の作成に失敗しました');
  }
};

window.selectWriting = async (writingId) => {
  const writing = state.writings?.find(w => w.id === writingId);
  if (writing) {
    state.currentWriting = writing;
    state.currentTab = 'writing';
    render();
  }
};

window.updateChapterTitle = async (writingId, newTitle) => {
  try {
    await api.put(`/writings/${writingId}`, { chapter_title: newTitle });
    const writing = state.writings?.find(w => w.id === writingId);
    if (writing) {
      writing.chapter_title = newTitle;
    }
    if (state.currentWriting?.id === writingId) {
      state.currentWriting.chapter_title = newTitle;
    }
  } catch (e) {
    console.error('Update chapter title error:', e);
  }
};

window.analyzeChapter = async (writingId) => {
  const writing = state.writings?.find(w => w.id === writingId);
  if (!writing?.content) {
    alert('この章にはまだ内容がありません');
    return;
  }
  
  state.aiGenerating = true;
  render();
  
  try {
    const result = await callAI('proofread', writing.content);
    if (result) {
      writing.ai_suggestions = result.substring(0, 200) + (result.length > 200 ? '...' : '');
      render();
      alert('分析が完了しました。改善提案を確認してください。');
    }
  } catch (e) {
    console.error('Analyze chapter error:', e);
    alert('分析に失敗しました');
  }
  
  state.aiGenerating = false;
  render();
};

window.handleAnalyze = async () => {
  console.log('handleAnalyze called, currentWriting:', state.currentWriting);
  
  if (!state.currentWriting?.content) {
    alert(t('analysis.noContent'));
    return;
  }
  
  console.log('Analyzing content of length:', state.currentWriting.content.length);
  
  try {
    const analysis = await analyzeWriting();
    console.log('Analysis result:', analysis);
    
    if (analysis) {
      renderAnalysisResults(analysis);
      
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
  await loadChatMessages(threadId);
  render();
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
  }
  
  // Update reviews
  const reviewsContainer = $('#reviews-container');
  if (reviewsContainer && analysis.reviews) {
    reviewsContainer.innerHTML = analysis.reviews.map(review => `
      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-sm">${review.name}</span>
          <span class="text-yellow-500">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">${review.comment}</p>
      </div>
    `).join('');
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
