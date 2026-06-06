// Vercel Serverless Function: Auth Verification
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const expectedUser = process.env.DEMO_USER || 'admin';
  const expectedPass = process.env.DEMO_PASS || 'packco2026';

  if (username === expectedUser && password === expectedPass) {
    return res.status(200).json({ 
      success: true, 
      token: 'session_token_packco_' + Math.random().toString(36).substr(2) 
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials. Please use admin/packco2026.' 
    });
  }
}
