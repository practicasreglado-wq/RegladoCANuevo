<?php
/**
 * Reglado Consultores — Endpoint de contacto
 * Envía el formulario a info@regladoconsultores.com vía SMTP autenticado (PHPMailer).
 *
 * Configuración: copiar `.env.example` a `.env` (o exportar variables del entorno del servidor)
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO, ALLOWED_ORIGIN
 */

declare(strict_types=1);

// ---------- Cabeceras de seguridad ----------
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

// ---------- Helpers ----------
function env(string $key, ?string $default = null): ?string {
    $val = getenv($key);
    if ($val === false || $val === '') {
        // Cargar desde .env si existe (parser muy simple)
        static $loaded = false;
        static $pairs = [];
        if (!$loaded) {
            $loaded = true;
            $envFile = __DIR__ . '/../.env';
            if (is_readable($envFile)) {
                foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                    if (strpos(trim($line), '#') === 0) continue;
                    if (strpos($line, '=') === false) continue;
                    [$k, $v] = array_map('trim', explode('=', $line, 2));
                    $v = trim($v, "\"' ");
                    $pairs[$k] = $v;
                }
            }
        }
        $val = $pairs[$key] ?? $default;
    }
    return $val;
}

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function clientIp(): string {
    // SEGURIDAD: usamos solo REMOTE_ADDR. Confiar ciegamente en headers como
    // X-Forwarded-For o CF-Connecting-IP permite a un atacante falsificarlos
    // (basta con un header en la petición) y saltarse el rate-limit cambiando
    // el valor para que parezca venir de otra IP.
    //
    // Si en producción el servidor está detrás de un proxy/CDN de confianza
    // (Cloudflare, AWS ALB, Nginx, etc.):
    //   1) Validar que REMOTE_ADDR pertenece al rango del proxy de confianza
    //   2) SOLO entonces leer X-Forwarded-For / CF-Connecting-IP
    return trim((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
}

// ---------- Anti-spam: rate limit por IP (file-based) ----------
function rateLimit(string $ip, int $maxPerWindow = 3, int $windowSec = 600): bool {
    $dir = sys_get_temp_dir() . '/reglado_rl';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $file = $dir . '/' . sha1($ip) . '.json';
    $now = time();
    $hits = [];
    if (is_readable($file)) {
        $data = json_decode((string)file_get_contents($file), true);
        if (is_array($data)) $hits = array_filter($data, fn($t) => ($now - (int)$t) < $windowSec);
    }
    if (count($hits) >= $maxPerWindow) return false;
    $hits[] = $now;
    @file_put_contents($file, json_encode(array_values($hits)), LOCK_EX);
    return true;
}

// ---------- CORS ----------
$allowedOrigin = env('ALLOWED_ORIGIN', '');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($allowedOrigin && $origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

// ---------- Solo POST ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonResponse(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

// ---------- Leer y validar JSON ----------
$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 16000) jsonResponse(['ok' => false, 'error' => 'payload_too_large'], 413);

$data = json_decode($raw, true);
if (!is_array($data)) jsonResponse(['ok' => false, 'error' => 'invalid_json'], 400);

// Honeypot
if (!empty($data['website'])) jsonResponse(['ok' => true]); // fingir éxito

// Time-trap
$elapsed = (int)($data['elapsed'] ?? 0);
if ($elapsed > 0 && $elapsed < 3000) jsonResponse(['ok' => false, 'error' => 'too_fast'], 400);

// Validación de campos
$name    = trim((string)($data['name'] ?? ''));
$role    = trim((string)($data['role'] ?? ''));
$entity  = trim((string)($data['entity'] ?? ''));
$email   = trim((string)($data['email'] ?? ''));
$phone   = trim((string)($data['phone'] ?? ''));
$service = trim((string)($data['service'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$newsletter = !empty($data['newsletter']);

$errors = [];
if ($name === '' || mb_strlen($name) > 120) $errors[] = 'name';
if ($entity === '' || mb_strlen($entity) > 200) $errors[] = 'entity';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 200) $errors[] = 'email';
if ($message === '' || mb_strlen($message) > 6000) $errors[] = 'message';
if (mb_strlen($phone) > 40) $errors[] = 'phone';
if (mb_strlen($service) > 100) $errors[] = 'service';
if (mb_strlen($role) > 100) $errors[] = 'role';

if (!empty($errors)) jsonResponse(['ok' => false, 'error' => 'validation', 'fields' => $errors], 422);

// Rate limit
$ip = clientIp();
if (!rateLimit($ip)) jsonResponse(['ok' => false, 'error' => 'rate_limited'], 429);

// ---------- Cargar PHPMailer ----------
$autoload = __DIR__ . '/../vendor/autoload.php';
if (!is_readable($autoload)) {
    jsonResponse(['ok' => false, 'error' => 'mailer_missing', 'hint' => 'composer install'], 500);
}
require_once $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = env('SMTP_HOST', 'smtp.example.com');
    $mail->SMTPAuth   = true;
    $mail->Username   = (string)env('SMTP_USER', '');
    $mail->Password   = (string)env('SMTP_PASS', '');
    $mail->Port       = (int)env('SMTP_PORT', '587');
    $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet    = 'UTF-8';

    $from = (string)env('SMTP_FROM', 'web@regladoconsultores.com');
    $to   = (string)env('CONTACT_TO', 'info@regladoconsultores.com');

    $mail->setFrom($from, 'Web Reglado');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name); // que info@ pueda responder directamente

    $svcLabel = $service !== '' ? $service : 'Consulta general';
    $mail->Subject = sprintf('[Web Reglado] %s — %s', $svcLabel, $entity);

    $safe = fn($s) => htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $msgHtml = nl2br($safe($message));

    $mail->isHTML(true);
    $mail->Body = "
      <div style=\"font-family: -apple-system, Segoe UI, sans-serif; color:#1a2d4e; line-height:1.6;\">
        <h2 style=\"font-family:Georgia, serif; color:#1a2d4e; border-bottom:2px solid #c9a84c; padding-bottom:.5rem;\">Nuevo contacto desde la web</h2>
        <table style=\"border-collapse:collapse; margin:1rem 0;\">
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Nombre</td><td><strong>{$safe($name)}</strong></td></tr>
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Cargo</td><td>{$safe($role)}</td></tr>
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Organismo</td><td><strong>{$safe($entity)}</strong></td></tr>
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Email</td><td><a href=\"mailto:{$safe($email)}\">{$safe($email)}</a></td></tr>
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Teléfono</td><td>{$safe($phone)}</td></tr>
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Servicio</td><td>{$safe($svcLabel)}</td></tr>
          <tr><td style=\"padding:.4rem 1rem .4rem 0; color:#5a6478;\">Newsletter</td><td>" . ($newsletter ? 'Sí' : 'No') . "</td></tr>
        </table>
        <h3 style=\"color:#1a2d4e;\">Mensaje</h3>
        <div style=\"background:#f5f6f8; padding:1rem 1.2rem; border-left:3px solid #c9a84c;\">{$msgHtml}</div>
        <p style=\"color:#5a6478; font-size:.85rem; margin-top:1.5rem;\">IP: " . $safe($ip) . " · " . date('Y-m-d H:i:s') . "</p>
      </div>
    ";
    $mail->AltBody = "Nuevo contacto desde la web\n\n"
        . "Nombre: $name\nCargo: $role\nOrganismo: $entity\n"
        . "Email: $email\nTeléfono: $phone\nServicio: $svcLabel\n"
        . "Newsletter: " . ($newsletter ? 'Sí' : 'No') . "\n\n"
        . "Mensaje:\n$message\n\n"
        . "IP: $ip · " . date('Y-m-d H:i:s');

    $mail->send();

    // Auto-respuesta al usuario
    try {
        $auto = new PHPMailer(true);
        $auto->isSMTP();
        $auto->Host = $mail->Host;
        $auto->SMTPAuth = true;
        $auto->Username = $mail->Username;
        $auto->Password = $mail->Password;
        $auto->Port = $mail->Port;
        $auto->SMTPSecure = $mail->SMTPSecure;
        $auto->CharSet = 'UTF-8';
        $auto->setFrom($from, 'Reglado Consultores');
        $auto->addAddress($email, $name);
        $auto->Subject = 'Hemos recibido tu consulta — Reglado Consultores';
        $auto->isHTML(true);
        $auto->Body = "
          <div style=\"font-family: -apple-system, Segoe UI, sans-serif; color:#1a2d4e; line-height:1.7;\">
            <h2 style=\"font-family:Georgia, serif; color:#1a2d4e;\">Gracias por contactar con Reglado Consultores</h2>
            <p>Hola {$safe($name)},</p>
            <p>Hemos recibido tu consulta y te responderemos en menos de <strong>24 horas laborables</strong>.</p>
            <p>Si tu consulta es urgente, puedes llamarnos al teléfono indicado en nuestra web.</p>
            <p style=\"margin-top:2rem; padding-top:1rem; border-top:1px solid #e4e6ec; color:#5a6478; font-size:.9rem;\">— Equipo Reglado Consultores</p>
          </div>
        ";
        $auto->AltBody = "Hola $name,\n\nHemos recibido tu consulta y te responderemos en menos de 24 horas laborables.\n\n— Equipo Reglado Consultores";
        $auto->send();
    } catch (\Throwable $e) {
        // ignorar fallos en la auto-respuesta
    }

    jsonResponse(['ok' => true]);
} catch (MailException $e) {
    error_log('[Reglado contact] ' . $e->getMessage());
    jsonResponse(['ok' => false, 'error' => 'mail_failed'], 502);
} catch (\Throwable $e) {
    error_log('[Reglado contact] ' . $e->getMessage());
    jsonResponse(['ok' => false, 'error' => 'unknown'], 500);
}
