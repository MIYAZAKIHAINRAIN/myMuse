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
};

// ============================================
// Translations - 12 Languages Support
// ============================================
const i18n = {
  ja: {
    'app.title': 'myMuse', 'app.tagline': '執筆のすべてを把握し、寄り添う全知の相棒',
    'nav.home': 'ホーム', 'nav.write': '執筆', 'nav.manage': '管理', 'nav.settings': '設定',
    'sidebar.projects': 'プロジェクト', 'sidebar.newProject': '新規プロジェクト', 'sidebar.newFolder': '新規フォルダ',
    'sidebar.trash': 'ゴミ箱', 'sidebar.search': '全文検索', 'sidebar.calendar': '創作カレンダー',
    'sidebar.language': '言語', 'sidebar.aiCredits': 'AI利用量',
    'tab.ideas': 'ネタ考案', 'tab.plot': 'プロット', 'tab.writing': 'ライティング',
    'tab.analysis': '分析・批評', 'tab.consultation': '相談AI',
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
    'genre.fantasy': 'ファンタジー', 'genre.romance': '恋愛', 'genre.mystery': 'ミステリー',
    'genre.scifi': 'SF', 'genre.horror': 'ホラー', 'genre.literary': '純文学',
    'idea.generate': 'アイデアを生成', 'idea.count': '生成数', 'idea.keywords': 'キーワード', 'idea.genre': 'ジャンル',
    'chat.placeholder': '相談したいことを入力...', 'chat.empty': 'AIに相談してみましょう', 'chat.hint': 'プロット、キャラクター、文章の悩みなど何でも相談できます',
  },
  en: {
    'app.title': 'myMuse', 'app.tagline': 'Your all-knowing writing companion',
    'nav.home': 'Home', 'nav.write': 'Write', 'nav.manage': 'Manage', 'nav.settings': 'Settings',
    'sidebar.projects': 'Projects', 'sidebar.newProject': 'New Project', 'sidebar.newFolder': 'New Folder',
    'sidebar.trash': 'Trash', 'sidebar.search': 'Search', 'sidebar.calendar': 'Calendar',
    'sidebar.language': 'Language', 'sidebar.aiCredits': 'AI Credits',
    'tab.ideas': 'Ideas', 'tab.plot': 'Plot', 'tab.writing': 'Writing',
    'tab.analysis': 'Analysis', 'tab.consultation': 'AI Chat',
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
    'genre.fantasy': 'Fantasy', 'genre.romance': 'Romance', 'genre.mystery': 'Mystery',
    'genre.scifi': 'Sci-Fi', 'genre.horror': 'Horror', 'genre.literary': 'Literary',
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
const autoSave = debounce(async (content) => {
  if (!state.currentWriting) return;
  try {
    await api.put(`/writings/${state.currentWriting.id}`, {
      content,
      chapter_title: state.currentWriting.chapter_title,
      writing_direction: state.currentWriting.writing_direction,
      font_family: state.currentWriting.font_family,
    });
    state.currentWriting.content = content;
    state.currentWriting.word_count = countWords(content);
    updateWordCount();
  } catch (e) { console.error('Auto-save error:', e); }
}, 1000);

function updateWordCount() {
  const el = $('#word-count');
  if (el && state.currentWriting) {
    el.textContent = `${state.currentWriting.word_count || 0} 文字`;
  }
}

// ============================================
// AI Functions
// ============================================
async function callAI(action, content, options = {}) {
  if (!state.currentProject) return null;
  state.aiGenerating = true;
  renderAISidebar();
  
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
    return res.data.result;
  } catch (e) {
    state.aiGenerating = false;
    console.error('AI error:', e);
    return null;
  }
}

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

function readAloud() {
  if (!state.currentWriting?.content) return;
  
  if (currentUtterance) {
    speechSynthesis.cancel();
    currentUtterance = null;
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(state.currentWriting.content);
  utterance.lang = state.language === 'ja' ? 'ja-JP' : 'en-US';
  utterance.rate = 0.9;
  
  currentUtterance = utterance;
  utterance.onend = () => { currentUtterance = null; };
  
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
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-2">
            <i class="fas fa-feather-alt mr-2"></i>myMuse
          </h1>
          <p class="text-gray-600 dark:text-gray-400">${t('app.tagline')}</p>
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
        
        <!-- Trash -->
        <button onclick="openModal('trash')" class="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <i class="fas fa-trash"></i>
          <span>${t('sidebar.trash')}</span>
        </button>
        
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
    <div onclick="selectProject('${project.id}')" 
      class="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition
        ${isActive ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">
      <i class="fas fa-book-open text-sm"></i>
      <span class="flex-1 truncate text-sm">${project.title}</span>
      ${project.deadline ? '<i class="fas fa-clock text-xs text-orange-500"></i>' : ''}
    </div>
  `;
}

function renderMainContent() {
  return `
    <div class="h-full flex flex-col">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4">
        ${['ideas', 'plot', 'writing', 'analysis', 'consultation'].map(tab => `
          <button onclick="switchTab('${tab}')" 
            class="px-4 py-3 text-sm font-medium transition ${state.currentTab === tab ? 'tab-active' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
            <i class="fas ${getTabIcon(tab)} mr-1"></i>
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
  const icons = { ideas: 'fa-lightbulb', plot: 'fa-sitemap', writing: 'fa-pen-fancy', analysis: 'fa-chart-pie', consultation: 'fa-comments' };
  return icons[tab] || 'fa-circle';
}

function renderTabContent() {
  switch (state.currentTab) {
    case 'ideas': return renderIdeasTab();
    case 'plot': return renderPlotTab();
    case 'writing': return renderWritingTab();
    case 'analysis': return renderAnalysisTab();
    case 'consultation': return renderConsultationTab();
    default: return renderWritingTab();
  }
}

function renderIdeasTab() {
  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Idea Generator -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-magic mr-2 text-indigo-500"></i>${t('idea.generate')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">ジャンル</label>
            <select id="idea-genre" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="fantasy">${t('genre.fantasy')}</option>
              <option value="romance">${t('genre.romance')}</option>
              <option value="mystery">${t('genre.mystery')}</option>
              <option value="scifi">${t('genre.scifi')}</option>
              <option value="horror">${t('genre.horror')}</option>
              <option value="literary">${t('genre.literary')}</option>
            </select>
          </div>
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
              ${!idea.adopted ? `
                <button onclick="adoptIdea('${idea.id}')" class="text-sm text-indigo-600 hover:underline">
                  <i class="fas fa-arrow-right mr-1"></i>${t('common.adopt')}
                </button>
              ` : ''}
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
  
  return `
    <div class="max-w-4xl mx-auto space-y-6">
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
        <span>作品を分析する</span>
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

function renderChat() {
  const container = $('#chat-messages');
  if (container) {
    container.innerHTML = renderChatMessages();
    container.scrollTop = container.scrollHeight;
  }
}

function renderRightSidebar() {
  if (!state.sidebarOpen.right) return '';
  
  return `
    <aside class="sidebar-right fixed right-0 top-14 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-30">
      <div class="p-4 space-y-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          <i class="fas fa-robot mr-1"></i>AIパートナー
        </h3>
        
        <!-- Quick Actions -->
        <div class="space-y-2">
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
            <label class="block text-sm font-medium mb-1">ジャンル</label>
            <select id="new-project-genre" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="fantasy">${t('genre.fantasy')}</option>
              <option value="romance">${t('genre.romance')}</option>
              <option value="mystery">${t('genre.mystery')}</option>
              <option value="scifi">${t('genre.scifi')}</option>
              <option value="literary">${t('genre.literary')}</option>
            </select>
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
    
    <!-- Trash Modal -->
    <div id="modal-trash" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'trash')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4 animate-fade-in relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('trash')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-trash mr-2"></i>${t('sidebar.trash')}</h3>
        <div id="trash-container" class="space-y-2 max-h-64 overflow-y-auto">
          ${state.trash.length === 0 ? '<p class="text-gray-500 text-sm">ゴミ箱は空です</p>' : state.trash.map(p => `
            <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span class="text-sm">${p.title}</span>
              <div class="flex gap-2">
                <button type="button" onclick="restoreProject('${p.id}')" class="text-sm text-indigo-600 hover:underline">${t('common.restore')}</button>
                <button type="button" onclick="deleteProject('${p.id}', true)" class="text-sm text-red-600 hover:underline">${t('common.delete')}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <!-- AI Result Modal -->
    <div id="modal-aiResult" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-backdrop" onclick="handleModalBackdropClick(event, 'aiResult')">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl m-4 animate-fade-in max-h-[80vh] overflow-y-auto relative" onclick="event.stopPropagation()">
        <button type="button" onclick="closeModal('aiResult')" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-lg font-semibold mb-4"><i class="fas fa-magic mr-2 text-indigo-500"></i>AI生成結果</h3>
        <div id="ai-result-content" class="prose dark:prose-invert max-w-none"></div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" onclick="closeModal('aiResult')" class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            閉じる
          </button>
          <button type="button" onclick="applyAIResult()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            適用する
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
      const genre = $('#new-project-genre').value;
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
      const input = $('#chat-input');
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

window.switchTab = (tab) => {
  state.currentTab = tab;
  render();
  
  // Initialize charts for analysis tab
  if (tab === 'analysis') {
    setTimeout(() => initCharts(), 100);
  }
};

window.selectProject = async (projectId) => {
  await loadProjectData(projectId);
  render();
};

window.openModal = async (name) => {
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
  const genre = $('#idea-genre')?.value || 'fantasy';
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
  await api.put(`/ideas/${ideaId}/adopt`);
  const idea = state.ideas.find(i => i.id === ideaId);
  if (idea) idea.adopted = true;
  render();
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
    } else {
      alert('分析に失敗しました。もう一度お試しください。');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    alert('分析エラー: ' + error.message);
  }
};

window.startNewThread = () => {
  state.currentThread = null;
  state.chatMessages = [];
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
function showAIResult(result) {
  lastAIResult = result;
  const content = $('#ai-result-content');
  if (content) {
    content.innerHTML = marked.parse(result);
  }
  openModal('aiResult');
}

window.applyAIResult = () => {
  if (lastAIResult && state.currentWriting) {
    const editor = $('#editor');
    if (editor) {
      editor.value = lastAIResult;
      autoSave(lastAIResult);
    }
  }
  closeModal('aiResult');
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
  render();
}

init();
