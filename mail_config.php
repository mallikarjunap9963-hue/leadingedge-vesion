<?php
/**
 * SMTP and Mail Configuration File
 * Leading Edge Vision / RAJ Group Contact System
 *
 * NOTE: For Gmail SMTP with 2-Factor Authentication, you MUST use a 16-character
 * Google "App Password", NOT your personal Google account password.
 * To generate one:
 *   1. Go to https://myaccount.google.com/security
 *   2. Ensure 2-Step Verification is turned ON
 *   3. Under "2-Step Verification", click on "App passwords"
 *   4. Select App name (e.g. "Leading Edge Website") and click "Create"
 *   5. Paste the 16-character generated password below in SMTP_PASS.
 */

// SMTP Server Settings (Gmail Port 465 SSL)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 465);
define('SMTP_ENCRYPTION', 'ssl'); // 'ssl' for port 465, 'tls' for port 587
define('SMTP_AUTH', true);

// Gmail Account Credentials
define('SMTP_USER', 'hdudekulahussaini@gmail.com');
define('SMTP_PASS', 'mcmfxtaywbznkhbu');

// Sender & Admin Notification Settings
define('ADMIN_EMAIL', 'hdudekulahussaini@gmail.com'); // Admin email to receive all enquiries
define('ADMIN_NAME', 'Leading Edge Vision Admin');
define('SENDER_NAME', 'Leading Edge Vision');         // Display name for outbound emails

// Optional Secondary Notification (Leave empty if not needed)
define('ADMIN_CC_EMAIL', ''); // e.g. 'ajay@stemtourjapan.com'
