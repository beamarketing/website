import { config } from '../../config.js';
import * as smtp from './providers/smtp.js';
import * as resend from './providers/resend.js';
import * as sendgrid from './providers/sendgrid.js';
import * as consoleProvider from './providers/console.js';

const PROVIDERS = { smtp, resend, sendgrid, console: consoleProvider };

export function provider(name = config.email.provider) {
  const impl = PROVIDERS[String(name).toLowerCase()];
  if (!impl) throw new Error(`Unknown email provider "${name}" (expected: ${Object.keys(PROVIDERS).join(', ')})`);
  return impl;
}

export const providerNames = () => Object.keys(PROVIDERS);
export const sendMessage = (message, name) => provider(name).send(message);
export const verifyProvider = (name) => provider(name).verify();
