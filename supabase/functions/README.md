# Supabase Edge Functions

## Environment Variables

The `generate-itinerary` function requires one of the following API keys:

### OpenAI (Default)
- `OPENAI_API_KEY` - Your OpenAI API key
  - Get it from: https://platform.openai.com/api-keys
  - Model used: `gpt-3.5-turbo` (most cost-effective option)

### Lovable AI (Fallback)
- `LOVABLE_API_KEY` - Your Lovable AI Gateway API key
  - Model used: `google/gemini-2.5-flash`

## Priority

The function will use **OpenAI by default** if `OPENAI_API_KEY` is set.
If `OPENAI_API_KEY` is not available, it will fallback to **Lovable AI** using `LOVABLE_API_KEY`.

## Setting Environment Variables

### Local Development
Create a `.env` file in the `supabase` directory:
```bash
OPENAI_API_KEY=sk-...
# or
LOVABLE_API_KEY=...
```

### Production (Supabase Dashboard)
1. Go to your Supabase project dashboard
2. Navigate to Edge Functions → Settings
3. Add the environment variable(s) under "Secrets"

## Testing Locally

```bash
supabase functions serve generate-itinerary --env-file ./supabase/.env
```
