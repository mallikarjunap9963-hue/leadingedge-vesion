<?php
/**
 * Leading Edge Vision - Contact Form Mailer Backend
 * Uses PHPMailer with Gmail SMTP (Port 465, SSL, SMTPAuth).
 * Handles sanitization, Admin notification with reply-to,
 * Visitor HTML acknowledgement receipt, and JSON responses.
 */

// Disable PHP error display in output to ensure clean JSON responses
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');

// Ensure request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST requests are allowed.'
    ]);
    exit;
}

// Load Composer Autoloader
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'PHPMailer dependency not found. Please run "composer install".'
    ]);
    exit;
}
require_once $autoloadPath;

// Load Configuration File if present
$configPath = __DIR__ . '/mail_config.php';
if (file_exists($configPath)) {
    require_once $configPath;
}

// Fallback configuration defaults
defined('SMTP_HOST')       || define('SMTP_HOST', 'smtp.gmail.com');
defined('SMTP_PORT')       || define('SMTP_PORT', 465);
defined('SMTP_ENCRYPTION') || define('SMTP_ENCRYPTION', 'ssl');
defined('SMTP_AUTH')       || define('SMTP_AUTH', true);
defined('SMTP_USER')       || define('SMTP_USER', 'hdudekulahussaini@gmail.com');
defined('SMTP_PASS')       || define('SMTP_PASS', 'mcmfxtaywbznkhbu');
defined('ADMIN_EMAIL')     || define('ADMIN_EMAIL', 'hdudekulahussaini@gmail.com');
defined('ADMIN_NAME')      || define('ADMIN_NAME', 'Leading Edge Vision Admin');
defined('SENDER_NAME')     || define('SENDER_NAME', 'Leading Edge Vision');
defined('ADMIN_CC_EMAIL')  || define('ADMIN_CC_EMAIL', '');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Robust sanitization helper to prevent XSS and injection
 */
function sanitize_text(?string $data, int $maxLength = 500): string {
    if ($data === null) {
        return '';
    }
    $clean = trim($data);
    $clean = strip_tags($clean);
    $clean = htmlspecialchars($clean, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    if (mb_strlen($clean) > $maxLength) {
        $clean = mb_substr($clean, 0, $maxLength);
    }
    return $clean;
}

// Support both standard POST FormData and JSON payload
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

$nameInput        = $_POST['name']        ?? $jsonData['name']        ?? '';
$phoneInput       = $_POST['phone']       ?? $jsonData['phone']       ?? '';
$emailInput       = $_POST['email']       ?? $jsonData['email']       ?? '';
$companyInput     = $_POST['company']     ?? $jsonData['company']     ?? '';
$messageInput     = $_POST['message']     ?? $jsonData['message']     ?? '';
$pageSourceInput  = $_POST['page_source'] ?? $jsonData['page_source'] ?? '';

// Sanitize inputs
$name        = sanitize_text($nameInput, 120);
$phone       = sanitize_text($phoneInput, 40);
$emailRaw    = trim($emailInput);
$company     = sanitize_text($companyInput, 150);
$message     = sanitize_text($messageInput, 3000);
$page_source = sanitize_text($pageSourceInput, 200);

if (empty($page_source)) {
    $page_source = 'Leading Edge Vision Website';
}

// Input Validation
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Please enter your full name (minimum 2 characters).';
}

if (empty($emailRaw) || !filter_var($emailRaw, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
} else {
    $email = filter_var($emailRaw, FILTER_SANITIZE_EMAIL);
}

if (empty($phone) || mb_strlen($phone) < 6) {
    $errors[] = 'Please provide a valid phone number.';
}

if (empty($company)) {
    $company = 'Not Specified';
}

if (empty($message) || mb_strlen($message) < 5) {
    $errors[] = 'Please enter your message or enquiry details (minimum 5 characters).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors),
        'errors'  => $errors
    ]);
    exit;
}

$submissionTime = date('d M Y, h:i A (T)');

/**
 * Configure PHPMailer instance with Gmail SMTP settings
 */
function createMailer(): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = SMTP_AUTH;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = (strtolower(SMTP_ENCRYPTION) === 'tls') 
        ? PHPMailer::ENCRYPTION_STARTTLS 
        : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = (int) SMTP_PORT;
    $mail->CharSet    = 'UTF-8';
    $mail->Timeout    = 15;
    return $mail;
}

try {
    // =========================================================================
    // 1. EMAIL 1: NOTIFICATION TO ADMIN
    // =========================================================================
    $adminMail = createMailer();
    $adminMail->setFrom(SMTP_USER, SENDER_NAME);
    $adminMail->addAddress(ADMIN_EMAIL, ADMIN_NAME);
    
    // Add CC if configured
    if (!empty(ADMIN_CC_EMAIL) && filter_var(ADMIN_CC_EMAIL, FILTER_VALIDATE_EMAIL)) {
        $adminMail->addCC(ADMIN_CC_EMAIL);
    }

    // Set Reply-To to visitor's email and name
    $adminMail->addReplyTo($email, $name);

    $adminMail->isHTML(true);
    $adminMail->Subject = "New Enquiry from {$name} - Leading Edge Vision";

    $adminHtml = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        .wrapper { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: #002d5b; padding: 28px 32px; text-align: left; }
        .header h1 { margin: 0; font-size: 22px; color: #ffffff; font-weight: 800; letter-spacing: -0.3px; }
        .header p { margin: 6px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 500; }
        .accent-bar { height: 4px; background: linear-gradient(90deg, #ffe500 0%, #0077c5 100%); }
        .content { padding: 32px; }
        .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 18px; }
        .lead-text { font-size: 15px; line-height: 1.5; color: #334155; margin-bottom: 22px; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .details-table td { padding: 11px 14px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .details-table td.label { width: 34%; font-weight: 700; color: #475569; background-color: #f8fafc; }
        .details-table td.value { color: #0f172a; font-weight: 500; }
        .message-box { background: #f8fafc; border-left: 4px solid #002d5b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 10px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; }
        .cta-btn { display: inline-block; background: #002d5b; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; margin-top: 24px; }
        .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>LEADING EDGE VISION</h1>
          <p>India–Japan STEM & Educational Tours Portal</p>
        </div>
        <div class="accent-bar"></div>
        <div class="content">
          <span class="badge">Website Contact Submission</span>
          <p class="lead-text">You have received a new tour & enquiry request through your website. Details are provided below:</p>

          <table class="details-table">
            <tr>
              <td class="label">Full Name</td>
              <td class="value"><strong>' . $name . '</strong></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value"><a href="mailto:' . $email . '" style="color:#0077c5; text-decoration:none;">' . $email . '</a></td>
            </tr>
            <tr>
              <td class="label">Phone Number</td>
              <td class="value"><a href="tel:' . $phone . '" style="color:#0077c5; text-decoration:none;">' . $phone . '</a></td>
            </tr>
            <tr>
              <td class="label">School / Institution</td>
              <td class="value">' . $company . '</td>
            </tr>
            <tr>
              <td class="label">Submitted At</td>
              <td class="value">' . $submissionTime . '</td>
            </tr>
          </table>

          <div style="font-weight:700; font-size:13px; color:#475569; text-transform:uppercase; letter-spacing:0.5px; margin-top:20px;">Enquiry Message:</div>
          <div class="message-box">' . nl2br($message) . '</div>

          <a href="mailto:' . $email . '?subject=Re:%20Your%20Tour%20Enquiry%20with%20Leading%20Edge%20Vision" class="cta-btn">Reply to ' . $name . '</a>
        </div>
        <div class="footer">
          This enquiry was securely processed via PHPMailer on ' . $submissionTime . '.<br>
          Replying directly to this email will send your response to <strong>' . $email . '</strong>.
        </div>
      </div>
    </body>
    </html>';

    $adminMail->Body = $adminHtml;
    $adminMail->AltBody = "NEW WEBSITE ENQUIRY\n\n"
        . "Name: {$name}\n"
        . "Email: {$email}\n"
        . "Phone: {$phone}\n"
        . "School/Company: {$company}\n"
        . "Time: {$submissionTime}\n\n"
        . "Message:\n{$message}\n";

    $adminMail->send();

    // =========================================================================
    // 2. EMAIL 2: ACKNOWLEDGEMENT RECEIPT TO VISITOR
    // =========================================================================
    $visitorMail = createMailer();
    $visitorMail->setFrom(SMTP_USER, SENDER_NAME);
    $visitorMail->addAddress($email, $name);
    $visitorMail->addReplyTo(ADMIN_EMAIL, SENDER_NAME);

    $visitorMail->isHTML(true);
    $visitorMail->Subject = "Enquiry Received: Thank you for contacting Leading Edge Vision";

    $visitorHtml = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        .wrapper { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: #002d5b; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #ffffff; font-weight: 900; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0 0; color: #ffe500; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .accent-bar { height: 4px; background: linear-gradient(90deg, #ffe500 0%, #0077c5 100%); }
        .content { padding: 32px; }
        .greeting { font-size: 18px; font-weight: 700; color: #002d5b; margin-bottom: 12px; }
        .body-text { font-size: 14.5px; line-height: 1.6; color: #334155; margin-bottom: 20px; }
        .summary-card { background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 18px 20px; margin: 20px 0; }
        .summary-card h3 { margin: 0 0 12px 0; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.6px; color: #002d5b; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        .summary-item { font-size: 13.5px; margin-bottom: 6px; color: #475569; }
        .summary-item strong { color: #0f172a; }
        .contact-info-grid { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 13px; color: #475569; }
        .contact-info-grid p { margin: 4px 0; }
        .footer { background: #f8fafc; padding: 22px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.5; }
        .footer a { color: #0077c5; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>LEADING EDGE VISION</h1>
          <p>In Association with RAJ Group</p>
        </div>
        <div class="accent-bar"></div>
        <div class="content">
          <div class="greeting">Dear ' . $name . ',</div>
          <p class="body-text">
            Thank you for reaching out to us regarding our <strong>STEM & Educational Tours to Japan</strong>. We are delighted to confirm that your enquiry has been received successfully!
          </p>

          <div class="summary-card">
            <h3>Summary of Your Enquiry</h3>
            <div class="summary-item"><strong>School / Institution:</strong> ' . $company . '</div>
            <div class="summary-item"><strong>Contact Phone:</strong> ' . $phone . '</div>
            <div class="summary-item" style="margin-top:10px;"><strong>Your Note:</strong></div>
            <div style="font-size:13px; color:#334155; font-style:italic; background:#ffffff; padding:10px 14px; border-radius:6px; border:1px solid #e2e8f0; margin-top:4px;">
              "' . nl2br($message) . '"
            </div>
          </div>

          <div class="contact-info-grid">
            <strong style="color:#002d5b; font-size:13.5px; display:block; margin-bottom:6px;">Need Urgent Assistance?</strong>
            <p><strong>India Office:</strong> +91 9849278500 | <a href="mailto:ajay@stemtourjapan.com" style="color:#0077c5;">ajay@stemtourjapan.com</a></p>
            <p><strong>Japan Office:</strong> +81-90-8308-5085 | <a href="mailto:anilraj@rajgroupglobal.com" style="color:#0077c5;">anilraj@rajgroupglobal.com</a></p>
          </div>

          <p class="body-text" style="margin-top:24px; margin-bottom:0;">
            Warm regards,<br>
            <strong>Admissions & Tour Relations Team</strong><br>
            Leading Edge Vision Private Limited
          </p>
        </div>
        <div class="footer">
          © ' . date('Y') . ' Leading Edge Vision Pvt. Ltd. All Rights Reserved.<br>
          Visit us online at <a href="https://leadingedgevision.com">www.leadingedgevision.com</a>
        </div>
      </div>
    </body>
    </html>';

    $visitorMail->Body = $visitorHtml;
    $visitorMail->AltBody = "Dear {$name},\n\n"
        . "Thank you for contacting Leading Edge Vision regarding our STEM Tours to Japan.\n"
        . "We have received your enquiry and our tour team will contact you within 24-48 business hours.\n\n"
        . "Summary of Details Received:\n"
        . "- Name: {$name}\n"
        . "- Phone: {$phone}\n"
        . "- School / Institution: {$company}\n\n"
        . "If you need immediate assistance, call us at +91 9849278500 or email ajay@stemtourjapan.com.\n\n"
        . "Best regards,\nLeading Edge Vision Team";

    $visitorMail->send();

    // =========================================================================
    // 3. CLEAN JSON RESPONSE ON SUCCESS
    // =========================================================================
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for reaching out! We will contact you soon.'
    ]);
    exit;

} catch (Exception $e) {
    // Log internal error safely for debugging
    error_log('PHPMailer Error: ' . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not send your message due to a mail server error. Please try again later or reach out to us directly at ' . ADMIN_EMAIL . '.'
    ]);
    exit;
} catch (\Throwable $t) {
    error_log('Unexpected Error: ' . $t->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred while processing your request. Please try again later.'
    ]);
    exit;
}
