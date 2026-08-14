# Mood Poem Card

[English](#english) | [日本語](#japanese)

<a id="english"></a>
## English

Type a mood or a theme in one phrase. Amazon Bedrock (Nova Pro) writes a short original poem and picks a matching color palette and motif, which the app renders as a generative art card — no stock images, no image-generation model involved.

### Why this shape

Amazon Nova Canvas (Bedrock's text-to-image model) turned out to be inaccessible on this AWS account (marked legacy / access denied), so the "image" half of the creative output is produced procedurally: the LLM returns a color palette and a motif keyword (flower, wave, mountain, star, leaf, moon, rain, cloud), and an SVG renderer draws a unique card from that. Every card is generated fresh from the model's output — same mechanism as a diffusion model producing pixels, just rendering shapes instead.

### Features

- Poem generation in Japanese or English, switchable in the UI
- Each poem comes with a generated color palette and a motif that visually matches its imagery
- Download the card as a PNG
- A few example prompts to try instantly

### Tech stack

- Next.js 16 (App Router) + TypeScript
- Amazon Bedrock — `amazon.nova-pro-v1:0` via the Converse API, called from a Next.js Route Handler
- Client-side SVG rendering, exported to PNG with `html-to-image`
- Deployed on Vercel

### Running locally

```bash
npm install
# .env.local
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=us-east-1
npm run dev
```

The AWS credentials need `bedrock:InvokeModel` on `amazon.nova-pro-v1:0` in `us-east-1`.

---

<a id="japanese"></a>
## 日本語

気分やお題をひとことで入力すると、Amazon Bedrock(Nova Pro)が短い詩を書き、その詩の世界観に合う色パレットとモチーフを選ぶ。アプリはそれをジェネラティブアートのカードとして描画する。ストック画像も画像生成モデルも使っていない。

### この構成にした理由

Bedrockの画像生成モデルであるAmazon Nova Canvasは、このAWSアカウントではlegacy扱いでアクセスできなかった(access denied)。そのため「画像」側の創造的出力は、LLMが返す色パレットとモチーフキーワード(flower/wave/mountain/star/leaf/moon/rain/cloud)をもとに、SVGで手続き的に描画する方式にした。カードはモデルの出力から毎回生成される点は拡散モデルと同じで、ピクセルの代わりに図形を描いているだけの違い。

### 機能

- 詩の生成は日本語/英語をUIで切り替え可能
- 詩ごとに色パレットとモチーフを生成し、世界観に合わせる
- カードをPNGとしてダウンロード
- すぐ試せるサンプルお題を用意

### 技術スタック

- Next.js 16 (App Router) + TypeScript
- Amazon Bedrock — `amazon.nova-pro-v1:0` をConverse API経由で、Next.jsのRoute Handlerから呼び出し
- クライアント側でSVGを描画し、`html-to-image` でPNGに書き出し
- Vercelにデプロイ

### ローカル実行

```bash
npm install
# .env.local
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=us-east-1
npm run dev
```

AWS認証情報には `us-east-1` の `amazon.nova-pro-v1:0` に対する `bedrock:InvokeModel` 権限が必要。
