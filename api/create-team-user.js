// Minimal example serverless endpoint (Node) to create a team user using SUPABASE_SERVICE_ROLE_KEY
// Deploy this as a serverless function (Vercel/Netlify/Azure Functions) and set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase service credentials' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { fullName, email, role } = req.body;
    if (!fullName || !email || !role) return res.status(400).json({ error: 'Missing fields' });

    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

    const { data, error } = await supabase.from('team_users').insert([{
      full_name: fullName,
      email: email.toLowerCase(),
      role,
      temp_password: tempPassword,
      disabled: false,
    }]).select().single();

    if (error) throw error;

    // Optionally insert an audit log entry
    await supabase.from('team_audit_logs').insert([{ actor_id: null, action: 'create_team_user', details: { email, role } }]);

    return res.status(200).json({ user: data, tempPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Failed to create team user' });
  }
};
