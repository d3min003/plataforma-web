export function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.code || 'internal_error', message: err.message || 'Internal error' });
}

export function badRequest(msg, code = 'bad_request') {
  const e = new Error(msg); e.status = 400; e.code = code; return e;
}

export function forbidden(msg = 'Forbidden', code = 'forbidden') {
  const e = new Error(msg); e.status = 403; e.code = code; return e;
}
