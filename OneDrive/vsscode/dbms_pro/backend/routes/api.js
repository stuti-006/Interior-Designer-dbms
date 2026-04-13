const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Supabase init
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseKey ? "Loaded" : "Missing");

// Helper
const handleResponse = (res, result) => {
  if (result.error) {
    return res.status(400).json({ error: result.error.message });
  }
  return res.json(result.data);
};

//
// ================= CLIENT =================
//
router.get('/clients', async (req, res) => {
  const result = await supabase.from('client').select('*');
  handleResponse(res, result);
});

router.post('/clients', async (req, res) => {
  const result = await supabase.from('client').insert(req.body).select();
  handleResponse(res, result);
});

router.put('/clients/:id', async (req, res) => {
  const result = await supabase
    .from('client')
    .update(req.body)
    .eq('client_id', req.params.id)
    .select();
  handleResponse(res, result);
});

router.delete('/clients/:id', async (req, res) => {
  const result = await supabase
    .from('client')
    .delete()
    .eq('client_id', req.params.id)
    .select();
  handleResponse(res, result);
});

//
// ================= EMPLOYEE =================
//
router.get('/employees', async (req, res) => {
  const result = await supabase.from('employee').select('*');
  handleResponse(res, result);
});

router.post('/employees', async (req, res) => {
  const result = await supabase.from('employee').insert(req.body).select();
  handleResponse(res, result);
});

router.put('/employees/:id', async (req, res) => {
  const result = await supabase
    .from('employee')
    .update(req.body)
    .eq('employee_id', req.params.id)
    .select();
  handleResponse(res, result);
});

router.delete('/employees/:id', async (req, res) => {
  const result = await supabase
    .from('employee')
    .delete()
    .eq('employee_id', req.params.id)
    .select();
  handleResponse(res, result);
});

//
// ================= PROJECT =================
//
router.get('/projects', async (req, res) => {
  const result = await supabase.from('project').select('*');
  handleResponse(res, result);
});

router.post('/projects', async (req, res) => {
  const result = await supabase.from('project').insert(req.body).select();
  handleResponse(res, result);
});

router.put('/projects/:id', async (req, res) => {
  const result = await supabase
    .from('project')
    .update(req.body)
    .eq('project_id', req.params.id)
    .select();
  handleResponse(res, result);
});

router.delete('/projects/:id', async (req, res) => {
  const result = await supabase
    .from('project')
    .delete()
    .eq('project_id', req.params.id)
    .select();
  handleResponse(res, result);
});

//
// ================= MATERIAL =================
//
router.get('/materials', async (req, res) => {
  const result = await supabase.from('material').select('*');
  handleResponse(res, result);
});

router.post('/materials', async (req, res) => {
  const result = await supabase.from('material').insert(req.body).select();
  handleResponse(res, result);
});

//
// ================= PROJECT_EMPLOYEE =================
//
router.get('/project-employees', async (req, res) => {
  const result = await supabase.from('project_employee').select('*');
  handleResponse(res, result);
});

//
// ================= PROJECT_MATERIAL =================
//
router.get('/project-materials', async (req, res) => {
  const result = await supabase.from('project_material').select('*');
  handleResponse(res, result);
});

//
// ================= DESIGNERS (using employee table) =================
//
router.get('/designers', async (req, res) => {
  const result = await supabase.from('employee').select('*');
  handleResponse(res, result);
});

router.post('/designers', async (req, res) => {
  const result = await supabase.from('employee').insert(req.body).select();
  handleResponse(res, result);
});

router.put('/designers/:id', async (req, res) => {
  const result = await supabase
    .from('employee')
    .update(req.body)
    .eq('employee_id', req.params.id)
    .select();
  handleResponse(res, result);
});

router.delete('/designers/:id', async (req, res) => {
  const result = await supabase
    .from('employee')
    .delete()
    .eq('employee_id', req.params.id)
    .select();
  handleResponse(res, result);
});

//
// ================= PAYMENTS =================
//
router.get('/payments', async (req, res) => {
  const result = await supabase.from('payment').select('*');
  handleResponse(res, result);
});

router.post('/payments', async (req, res) => {
  const result = await supabase.from('payment').insert(req.body).select();
  handleResponse(res, result);
});

router.put('/payments/:id', async (req, res) => {
  const result = await supabase
    .from('payment')
    .update(req.body)
    .eq('payment_id', req.params.id)
    .select();
  handleResponse(res, result);
});

router.delete('/payments/:id', async (req, res) => {
  const result = await supabase
    .from('payment')
    .delete()
    .eq('payment_id', req.params.id)
    .select();
  handleResponse(res, result);
});

module.exports = router;

