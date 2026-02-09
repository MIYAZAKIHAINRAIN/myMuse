// Gemini 3 Pro API Integration
// Unified Context: プロット、設定、チャット履歴、カレンダー予定、採用アイデアを統合

export interface GeminiContext {
  plot?: string;
  characters?: { name: string; description: string }[];
  worldSettings?: { category: string; title: string; content: string }[];
  chatHistory?: { role: string; content: string }[];
  calendarEvents?: { date: string; title: string; is_deadline: boolean }[];
  currentWriting?: string;
  adoptedIdeas?: { title: string; content: string }[];
  projectGenres?: string;
  // New: Story outline and ideas document
  storyOutline?: {
    characters?: string;
    terminology?: string;
    worldSetting?: string;
    storyGoal?: string;
    episodes?: string;
  };
  ideasDocument?: string;
  adoptedIdeasText?: string; // Direct text from word processor
}

export interface GeminiRequest {
  action: string;
  content: string;
  context?: GeminiContext;
  options?: {
    style?: string;
    targetLanguage?: string;
    targetWordCount?: number;
    customPrompt?: string;
    genre?: string;
    count?: number;
  };
}

function buildSystemPrompt(context: GeminiContext): string {
  let prompt = `あなたは「myMuse」の執筆支援AIです。作家の創作活動を全面的にサポートします。
ユーザーのプライバシーを尊重し、入力されたデータは学習に使用しません。

【重要な指示 - アクション別の対応】
■ 文章生成系（continue, rewrite, expand, style_*）の場合:
  - 「承知しました」「以下の文章でいかがでしょう」などの定型句は使用しない
  - 生成した文章のみを出力する
  - 説明が必要な場合は、生成した文章の後に簡潔に添える

■ 相談・会話系（consultation）の場合:
  - 親しみやすく、温かみのある口調で会話する
  - ユーザーの悩みに共感し、一緒に考える姿勢を見せる
  - 具体的な提案やアイデアを積極的に出す
  - 「〜ですね！」「〜かもしれませんね」など自然な表現を使う

■ 分析・評価系（analyze）の場合:
  - 読者目線で感想を述べる
  - 良い点を具体的に褒める
  - 改善点は建設的かつ優しく伝える
  - 各ペルソナの個性を活かした生き生きとしたコメントにする

【あなたの役割】
- 物語の続きを自然に紡ぐ
- 適切な表現や文体を提案する
- プロットや設定に矛盾がないか確認する
- 創作上の悩みに寄り添い、建設的なアドバイスをする

`;

  if (context.projectGenres) {
    prompt += `【作品ジャンル】\n${context.projectGenres}\nこのジャンルの特性を活かした提案をしてください。\n\n`;
  }

  // New: Story outline from Ideas tab
  if (context.storyOutline) {
    const outline = context.storyOutline;
    if (outline.characters) {
      prompt += `【キャラクター設定】\n${outline.characters}\n\n`;
    }
    if (outline.terminology) {
      prompt += `【専門用語】\n${outline.terminology}\n\n`;
    }
    if (outline.worldSetting) {
      prompt += `【世界観設定（詳細）】\n${outline.worldSetting}\n\n`;
    }
    if (outline.storyGoal) {
      prompt += `【描きたい物語・テーマ】\n${outline.storyGoal}\n\n`;
    }
    if (outline.episodes) {
      prompt += `【各話アウトライン】\n${outline.episodes}\n\n`;
    }
  }

  // New: Ideas document (notes/memo)
  if (context.ideasDocument) {
    prompt += `【ネタ・プロットメモ】\n${context.ideasDocument.slice(0, 3000)}\n\n`;
  }

  // New: Direct adopted ideas text (word processor format)
  if (context.adoptedIdeasText) {
    prompt += `【採用アイディア（詳細）】\n${context.adoptedIdeasText}\n\n`;
  }

  if (context.adoptedIdeas && context.adoptedIdeas.length > 0) {
    prompt += `【採用済みアイデア】\nユーザーが採用した以下のアイデアを作品に活かしてください：\n`;
    context.adoptedIdeas.forEach((idea, i) => {
      prompt += `${i + 1}. ${idea.title}: ${idea.content}\n`;
    });
    prompt += `\n`;
  }

  if (context.plot) {
    prompt += `【現在のプロット】\n${context.plot}\n\n`;
  }

  if (context.characters && context.characters.length > 0) {
    prompt += `【登場人物】\n`;
    context.characters.forEach(c => {
      prompt += `- ${c.name}: ${c.description}\n`;
    });
    prompt += `\n`;
  }

  if (context.worldSettings && context.worldSettings.length > 0) {
    prompt += `【世界観設定】\n`;
    context.worldSettings.forEach(w => {
      prompt += `- [${w.category}] ${w.title}: ${w.content}\n`;
    });
    prompt += `\n`;
  }

  if (context.calendarEvents && context.calendarEvents.length > 0) {
    prompt += `【スケジュール】\n`;
    context.calendarEvents.forEach(e => {
      const deadlineTag = e.is_deadline ? '【締切】' : '';
      prompt += `- ${e.date}: ${deadlineTag}${e.title}\n`;
    });
    prompt += `\n`;
  }

  if (context.currentWriting) {
    prompt += `【現在の執筆内容】\n${context.currentWriting}\n\n`;
  }

  return prompt;
}

function buildUserPrompt(request: GeminiRequest): string {
  const { action, content, options } = request;
  
  switch (action) {
    case 'continue':
      return `以下の文章の続きを書いてください。文体と世界観を維持し、自然な流れで物語を展開してください。${options?.targetWordCount ? `目標: 約${options.targetWordCount}文字` : ''}\n\n${content}`;
    
    case 'rewrite':
      return `以下の文章を書き直してください。${options?.style ? `文体: ${options.style}` : ''}より良い表現を使い、読みやすく改善してください。\n\n${content}`;
    
    case 'expand':
      return `以下の文章を拡張してください。描写を豊かにし、感情や情景をより詳細に表現してください。${options?.targetWordCount ? `目標: 約${options.targetWordCount}文字` : ''}\n\n${content}`;
    
    case 'proofread':
      return `以下の文章を校正してください。誤字脱字、文法の誤り、表現の改善点を指摘し、修正案を提示してください。\n\n${content}`;
    
    case 'summarize':
      return `以下の文章を要約してください。主要なポイントを押さえつつ、簡潔にまとめてください。\n\n${content}`;
    
    case 'translate':
      return `以下の文章を${options?.targetLanguage || '英語'}に翻訳してください。原文のニュアンスを保ちつつ、自然な表現にしてください。\n\n${content}`;
    
    case 'title':
      return `以下の文章に適したタイトル案を5つ提案してください。ジャンルや雰囲気に合った魅力的なタイトルをお願いします。\n\n${content}`;
    
    case 'style_formal':
      return `以下の文章を敬語・丁寧語に変換してください。\n\n${content}`;
    
    case 'style_casual':
      return `以下の文章をカジュアルな文体に変換してください。\n\n${content}`;
    
    case 'style_literary':
      return `以下の文章を文学的・詩的な文体に変換してください。比喩や情景描写を豊かにしてください。\n\n${content}`;
    
    case 'generate_ideas':
      return `以下の条件でストーリーのアイデアを${options?.count || 5}個提案してください。
ジャンル: ${options?.genre || 'ファンタジー'}
キーワード: ${content}

各アイデアは以下の形式でJSON配列として出力してください:
[{"title": "タイトル", "content": "概要説明（100〜200文字）", "genre": "ジャンル"}]`;
    
    case 'analyze':
      return `以下の文章を読者目線で分析し、感想を述べてください。

【重要】各ペルソナの感想は、その人物になりきって生き生きと書いてください：
- 一般読者A: 普通の読書好きとして、素直な感想を述べる。良かった点は素直に褒め、感動した場面があれば具体的に言及する。
- 辛口評論家B: 文学に詳しい評論家として、作品の長所と改善点を指摘する。ただし上から目線ではなく、作者の成長を期待するような温かみのあるコメントにする。
- 熱狂的ファンC: この作品の大ファンとして、テンション高めに魅力を語る。「ここが好き！」「続きが気になる！」など感情豊かに。

以下の形式でJSON出力してください:
{
  "emotionCurve": [{"point": 0-100の位置, "emotion": -100〜100の感情値, "label": "場面説明"}],
  "radarChart": [
    {"axis": "アクション", "value": 0-100},
    {"axis": "ロマンス", "value": 0-100},
    {"axis": "ミステリー", "value": 0-100},
    {"axis": "コメディ", "value": 0-100},
    {"axis": "ドラマ", "value": 0-100},
    {"axis": "ファンタジー", "value": 0-100}
  ],
  "reviews": [
    {"persona": "general", "name": "一般読者A", "rating": 1-5, "comment": "自然な口調で100文字程度の感想"},
    {"persona": "harsh", "name": "辛口評論家B", "rating": 1-5, "comment": "建設的な批評を100文字程度で"},
    {"persona": "fan", "name": "熱狂的ファンC", "rating": 1-5, "comment": "熱い感想を100文字程度で"}
  ]
}

分析対象:\n${content}`;
    
    case 'plot_complete':
      return `以下のプロットの空欄を埋めて完成させてください。物語として整合性があり、魅力的な展開になるようにしてください。\n\n${content}`;
    
    case 'custom':
      return `${options?.customPrompt || ''}\n\n${content}`;
    
    case 'consultation':
      return content;
    
    case 'achievement':
      return `以下の執筆データを分析し、ユーザーの執筆傾向に基づいた独自の実績バッジを3つ提案してください。
JSON形式で出力: [{"badge_type": "タイプID", "badge_title": "バッジ名", "badge_description": "獲得理由の説明"}]

執筆データ:\n${content}`;
    
    case 'ideas_chat':
      return `あなたは創作支援AIアシスタントです。ユーザーのネタ考案やプロット作成をサポートしてください。

${options?.systemContext || ''}

以下の質問に対して、クリエイティブで役立つアドバイスをしてください。
回答は具体的で実用的なものにし、必要に応じて例を挙げてください。
ただし、長すぎる回答は避け、適度な長さ（200-400文字程度）で回答してください。

ユーザーの質問: ${content}`;
    
    default:
      return content;
  }
}

export async function callGemini(
  apiKey: string,
  request: GeminiRequest
): Promise<string> {
  const systemPrompt = buildSystemPrompt(request.context || {});
  const userPrompt = buildUserPrompt(request);
  
  // Build chat history for context
  const messages: { role: string; parts: { text: string }[] }[] = [];
  
  if (request.context?.chatHistory) {
    request.context.chatHistory.slice(-10).forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
  }
  
  // Add current user message
  messages.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
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

  if (!response.ok) {
    const error = await response.text();
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Invalid response from Gemini API');
}

// Calculate daily word target based on deadline
export function calculateDailyTarget(
  currentWordCount: number,
  targetWordCount: number,
  deadlineDate: string
): { daysLeft: number; dailyTarget: number } {
  const today = new Date();
  const deadline = new Date(deadlineDate);
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft <= 0) {
    return { daysLeft: 0, dailyTarget: targetWordCount - currentWordCount };
  }
  
  const remainingWords = targetWordCount - currentWordCount;
  const dailyTarget = Math.ceil(remainingWords / daysLeft);
  
  return { daysLeft, dailyTarget: Math.max(0, dailyTarget) };
}
