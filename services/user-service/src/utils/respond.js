const ok = (res, data = null, message = "OK") =>
  res.status(200).json({ success: true, message, data });

const created = (res, data = null, message = "Created") =>
  res.status(201).json({ success: true, message, data });

const fail = (res, status = 400, message = "Bad Request", errors = null) =>
  res.status(status).json({ success: false, message, errors });

module.exports = { ok, created, fail };
