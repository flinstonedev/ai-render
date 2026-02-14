const PRIVATE_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^\[::1\]$/,
  /^\[::\]$/,
  /^\[::ffff:127\./i,
  /^\[::ffff:10\./i,
  /^\[::ffff:172\.(1[6-9]|2\d|3[01])\./i,
  /^\[::ffff:192\.168\./i,
  /^\[::ffff:169\.254\./i,
  /^\[::ffff:0\.0\.0\.0\]/i,
  /^\[fe80:/i,
  /^\[fc00:/i,
  /^\[fd/i,
];

export function isPrivateHostname(hostname: string): boolean {
  return PRIVATE_HOSTNAME_PATTERNS.some((pattern) => pattern.test(hostname));
}
