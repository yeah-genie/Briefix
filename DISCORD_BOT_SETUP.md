# Discord Bot 설정 가이드

## 1. Discord Developer Portal

1. https://discord.com/developers/applications 접속
2. **New Application** 클릭
3. 이름: `Cryo` 입력

## 2. Bot 설정

1. 왼쪽 메뉴 → **Bot**
2. **Reset Token** → 토큰 복사 (DISCORD_BOT_TOKEN)
3. **Privileged Gateway Intents** 활성화:
   - MESSAGE CONTENT INTENT ✅
   - SERVER MEMBERS INTENT ✅

## 3. OAuth2 설정

1. 왼쪽 메뉴 → **OAuth2** → **URL Generator**
2. Scopes: `bot`, `applications.commands`
3. Bot Permissions:
   - Read Messages/View Channels
   - Send Messages
   - Add Reactions
   - Read Message History
4. 생성된 URL로 서버에 봇 초대

## 4. Interactions Endpoint

1. 왼쪽 메뉴 → **General Information**
2. **PUBLIC KEY** 복사 (DISCORD_PUBLIC_KEY)
3. **Interactions Endpoint URL** 설정:
   ```
   https://[YOUR_SUPABASE_PROJECT].supabase.co/functions/v1/discord-freeze
   ```

## 5. Supabase 환경변수

```bash
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_PUBLIC_KEY=your_public_key
```

## 6. 사용법

| 이모지 | 기능 |
|--------|------|
| ❄️ | 아이디어 저장 |
| 🔥 | 해동 |
| 👍 | 투표 |

메시지에 이모지만 추가하면 자동으로 작동합니다!
