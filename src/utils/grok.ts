// Grok-2 mini API Integration
// リサーチ担当: 資料収集、トレンド調査、ファクトチェック

export interface GrokRequest {
  query: string;
  context?: {
    projectGenres?: string;
    characters?: string;
    worldSetting?: string;
    currentTopic?: string;
  };
  type: 'research' | 'trend' | 'factcheck' | 'terminology';
}

export interface GrokResponse {
  success: boolean;
  content: string;
  sources?: string[];
  error?: string;
}

function buildResearchPrompt(request: GrokRequest): string {
  let systemPrompt = `あなたは創作支援アプリ「myMuse」のリサーチアシスタントです。
作家の創作活動に必要な情報収集を担当します。

【あなたの役割】
- 時代考証、専門知識の提供
- トレンド調査、市場分析
- ファクトチェック、矛盾の指摘
- 用語解説、専門用語の正確な使い方

【回答のスタイル】
- 簡潔で実用的な情報を提供
- 箇条書きを活用して読みやすく
- 創作に活かせる具体的な提案を含める
- 不確かな情報は「推測」と明記`;

  // コンテキストがあれば追加
  if (request.context) {
    systemPrompt += `\n\n【現在の創作コンテキスト】`;
    if (request.context.projectGenres) {
      systemPrompt += `\nジャンル: ${request.context.projectGenres}`;
    }
    if (request.context.currentTopic) {
      systemPrompt += `\n執筆中のトピック: ${request.context.currentTopic}`;
    }
    if (request.context.worldSetting) {
      systemPrompt += `\n世界観: ${request.context.worldSetting.substring(0, 500)}...`;
    }
  }

  // リクエストタイプに応じた追加指示
  switch (request.type) {
    case 'research':
      systemPrompt += `\n\n【タスク】リサーチ依頼に対して、創作に役立つ情報を提供してください。`;
      break;
    case 'trend':
      systemPrompt += `\n\n【タスク】創作トレンドや市場動向について分析してください。`;
      break;
    case 'factcheck':
      systemPrompt += `\n\n【タスク】事実確認を行い、矛盾や問題点があれば指摘してください。`;
      break;
    case 'terminology':
      systemPrompt += `\n\n【タスク】専門用語の正確な意味と使い方を解説してください。`;
      break;
  }

  return systemPrompt;
}

export async function callGrok(apiKey: string, request: GrokRequest): Promise<GrokResponse> {
  const systemPrompt = buildResearchPrompt(request);

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.query }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      return {
        success: false,
        content: '',
        error: `Grok API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json() as {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    };

    const content = data.choices?.[0]?.message?.content || '';

    return {
      success: true,
      content,
    };
  } catch (error) {
    console.error('Grok API call failed:', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
