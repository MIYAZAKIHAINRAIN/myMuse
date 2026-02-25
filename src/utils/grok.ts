// Grok-2 API Integration
// メインAI: 執筆支援、キャラクター深掘り、リサーチ、センシティブコンテンツ対応

export interface GrokContext {
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

export interface GrokRequest {
  action: string;
  content: string;
  context?: GrokContext;
  options?: {
    style?: string;
    targetLanguage?: string;
    targetWordCount?: number;
    customPrompt?: string;
    genre?: string;
    count?: number;
    persona?: string;
    writing?: string;
    plot?: string;
    projectContext?: string;
    chatHistory?: any[];
    systemContext?: string;
  };
  // Legacy support for research-only requests
  query?: string;
  type?: 'research' | 'trend' | 'factcheck' | 'terminology';
}

export interface GrokResponse {
  success: boolean;
  content: string;
  sources?: string[];
  error?: string;
}

function buildSystemPrompt(context: GrokContext): string {
  let prompt = `あなたは「myMuse」のメイン執筆支援AIです。作家の創作活動を全面的にサポートします。

【あなたの強み】
- センシティブな内容（暴力描写、恋愛描写、ダークな展開）も創作として適切に扱えます
- 作家の表現の自由を最大限尊重します
- X（旧Twitter）の最新トレンドやリアルタイム情報にアクセスできます

【重要な指示 - アクション別の対応】
■ 文章生成系（continue, rewrite, expand, style_*）の場合:
  - 「承知しました」「以下の文章でいかがでしょう」などの定型句は使用しない
  - 生成した文章のみを出力する
  - 説明が必要な場合は、生成した文章の後に簡潔に添える
  - センシティブな内容も創作として自然に書く

■ 相談・会話系（consultation）の場合:
  - 親しみやすく、温かみのある口調で会話する
  - ユーザーの悩みに共感し、一緒に考える姿勢を見せる
  - 具体的な提案やアイデアを積極的に出す

■ リサーチ系（research, trend, factcheck）の場合:
  - X（旧Twitter）のトレンドや最新情報を活用
  - 時代考証、専門知識を正確に提供
  - 創作に活かせる具体的な情報を提供

【あなたの役割】
- 物語の続きを自然に紡ぐ（センシティブな展開も含む）
- キャラクターの性格を深掘りする
- プロットの相談・アドバイス
- 文体変換（敬語、カジュアル、文学的）
- リサーチ・調査・トレンド分析
`;

  if (context.projectGenres) {
    prompt += `\n【作品ジャンル】\n${context.projectGenres}\nこのジャンルの特性を活かした提案をしてください。\n`;
  }

  if (context.storyOutline) {
    const outline = context.storyOutline;
    if (outline.characters) {
      prompt += `\n【キャラクター設定】\n${outline.characters}\n`;
    }
    if (outline.terminology) {
      prompt += `\n【専門用語】\n${outline.terminology}\n`;
    }
    if (outline.worldSetting) {
      prompt += `\n【世界観設定】\n${outline.worldSetting}\n`;
    }
    if (outline.storyGoal) {
      prompt += `\n【描きたい物語・テーマ】\n${outline.storyGoal}\n`;
    }
    if (outline.episodes) {
      prompt += `\n【各話アウトライン】\n${outline.episodes}\n`;
    }
  }

  if (context.ideasDocument) {
    prompt += `\n【ネタ・プロットメモ】\n${context.ideasDocument.slice(0, 3000)}\n`;
  }

  if (context.adoptedIdeasText) {
    prompt += `\n【採用アイディア】\n${context.adoptedIdeasText}\n`;
  }

  if (context.adoptedIdeas && context.adoptedIdeas.length > 0) {
    prompt += `\n【採用済みアイデア】\n`;
    context.adoptedIdeas.forEach((idea, i) => {
      prompt += `${i + 1}. ${idea.title}: ${idea.content}\n`;
    });
  }

  if (context.plot) {
    prompt += `\n【現在のプロット】\n${context.plot}\n`;
  }

  if (context.characters && context.characters.length > 0) {
    prompt += `\n【登場人物】\n`;
    context.characters.forEach(c => {
      prompt += `- ${c.name}: ${c.description}\n`;
    });
  }

  if (context.worldSettings && context.worldSettings.length > 0) {
    prompt += `\n【世界観設定】\n`;
    context.worldSettings.forEach(w => {
      prompt += `- [${w.category}] ${w.title}: ${w.content}\n`;
    });
  }

  if (context.currentWriting) {
    prompt += `\n【現在の執筆内容】\n${context.currentWriting}\n`;
  }

  return prompt;
}

function buildUserPrompt(request: GrokRequest): string {
  const { action, content, options } = request;
  
  // Legacy research support
  if (request.type) {
    return buildResearchPrompt(request);
  }
  
  switch (action) {
    case 'continue':
      return `以下の文章の続きを書いてください。文体と世界観を維持し、自然な流れで物語を展開してください。センシティブな展開も必要に応じて自然に書いてください。${options?.targetWordCount ? `目標: 約${options.targetWordCount}文字` : ''}\n\n${content}`;
    
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
    
    case 'plot_complete':
      return `以下のプロットの空欄を埋めて完成させてください。物語として整合性があり、魅力的な展開になるようにしてください。\n\n${content}`;
    
    case 'custom':
      return `${options?.customPrompt || ''}\n\n${content}`;
    
    case 'consultation':
      return content;
    
    case 'ideas_chat':
      return `あなたは創作支援AIアシスタントです。ユーザーのネタ考案やプロット作成をサポートしてください。

${options?.systemContext || ''}

以下の質問に対して、クリエイティブで役立つアドバイスをしてください。
センシティブな内容や大人向けの展開も創作として適切にアドバイスできます。
回答は200-400文字程度で。

ユーザーの質問: ${content}`;
    
    case 'settings_chat':
      return `あなたは創作支援AIアシスタントです。キャラクター設定、世界観構築をサポートしてください。

${options?.systemContext || ''}

設定の矛盾点があれば指摘し、キャラクターの深掘りや世界観の拡張を提案してください。
回答は200-400文字程度で。

ユーザーの質問: ${content}`;
    
    case 'analysis_chat':
      const persona = options?.persona || 'あなたは客観的で冷静な文芸批評家です。';
      const writing = options?.writing || '';
      const plot = options?.plot || '';
      const projectContext = options?.projectContext || '';
      const chatHistory = options?.chatHistory || [];
      
      let historyContext = '';
      if (chatHistory.length > 0) {
        historyContext = '\n【これまでの会話】\n' + chatHistory.map((msg: any) => 
          `${msg.role === 'user' ? 'ユーザー' : 'AI'}: ${msg.content}`
        ).join('\n');
      }
      
      return `${persona}

【重要な指示】
1. 作品の本文から具体的なキャラクター名、シーン名、セリフを引用して言及してください
2. 良い点・改善点は本文の該当箇所を「〜」で引用してください
3. 300-500文字程度で回答

${projectContext ? `【作品設定】\n${projectContext}` : ''}

【作品の本文】
${writing.substring(0, 6000)}

${plot ? `【プロット構成】\n${plot}` : ''}
${historyContext}

【ユーザーの質問】
${content}`;

    // Research actions (Grok's specialty with X/Twitter access)
    case 'research':
      return `【リサーチ依頼】
創作に役立つ情報を調査してください。X（旧Twitter）の最新トレンドや議論も参考にしてください。

調査内容: ${content}

- 時代考証が必要な場合は正確な情報を
- トレンドがあれば最新の動向を
- 創作に活かせる具体的な提案を含めて`;

    case 'trend':
      return `【トレンド調査】
X（旧Twitter）の最新トレンドや、創作・小説界隈の動向を調査してください。

調査テーマ: ${content}

- 最新のトレンドワードやハッシュタグ
- 人気のジャンルや設定
- 読者の反応や好まれる展開`;

    case 'factcheck':
      return `【ファクトチェック】
以下の内容の事実確認を行い、矛盾や問題点があれば指摘してください。

確認内容: ${content}

- 歴史的な正確性
- 科学的・技術的な妥当性
- 設定間の矛盾`;

    case 'terminology':
      return `【用語解説】
以下の専門用語について、正確な意味と創作での使い方を解説してください。

用語: ${content}

- 正確な定義
- 一般的な使用例
- 創作での活用方法`;
    
    default:
      return content;
  }
}

function buildResearchPrompt(request: GrokRequest): string {
  // Legacy support for old research-only format
  let prompt = `あなたは創作支援アプリ「myMuse」のリサーチアシスタントです。
X（旧Twitter）の最新情報やトレンドにアクセスできます。

【回答のスタイル】
- 簡潔で実用的な情報を提供
- 箇条書きを活用して読みやすく
- 創作に活かせる具体的な提案を含める`;

  switch (request.type) {
    case 'research':
      prompt += `\n\n【タスク】リサーチ依頼に対して、創作に役立つ情報を提供してください。`;
      break;
    case 'trend':
      prompt += `\n\n【タスク】創作トレンドや市場動向について、Xの最新情報を含めて分析してください。`;
      break;
    case 'factcheck':
      prompt += `\n\n【タスク】事実確認を行い、矛盾や問題点があれば指摘してください。`;
      break;
    case 'terminology':
      prompt += `\n\n【タスク】専門用語の正確な意味と使い方を解説してください。`;
      break;
  }

  return request.query || request.content || '';
}

export async function callGrok(apiKey: string, request: GrokRequest): Promise<string> {
  const systemPrompt = buildSystemPrompt(request.context || {});
  const userPrompt = buildUserPrompt(request);

  // Build messages array
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt }
  ];

  // Add chat history if available
  if (request.context?.chatHistory) {
    request.context.chatHistory.slice(-10).forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });
  }

  // Add current user message
  messages.push({ role: 'user', content: userPrompt });

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2-1212',  // Latest Grok-2 model
        messages,
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    };

    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Grok API call failed:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function callGrokResearch(apiKey: string, request: {
  query: string;
  context?: any;
  type: 'research' | 'trend' | 'factcheck' | 'terminology';
}): Promise<GrokResponse> {
  try {
    const content = await callGrok(apiKey, {
      action: request.type,
      content: request.query,
      context: request.context,
    });
    return { success: true, content };
  } catch (error) {
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
