import { post } from '@/request/request';

export const generatePrompt = () => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module: 'COLUMN_ENRICHMENT_PROMPT',
      params: {
        useInput: "help me to find user's email and phone number",
        columns:
          'First Name,Last Name,Full Name,Job Title, Location,Company Name,LinkedIn Profile,University',
      },
    }),
  });
};
