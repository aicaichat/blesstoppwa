<?php
/**
 * NFC安全认证处理器
 * 处理NFC标签访问，确保安全性
 */

// 防止直接访问
if (!defined('ABSPATH')) {
    // 如果不在WordPress环境中，加载WordPress
    require_once('../../../wp-load.php');
}

/**
 * 主要的NFC认证处理函数
 */
function handle_nfc_access() {
    // 获取参数
    $braceletId = sanitize_text_field($_GET['id'] ?? '');
    $nfcToken = sanitize_text_field($_GET['token'] ?? '');
    $authType = sanitize_text_field($_GET['type'] ?? 'standard');
    
    // 基本验证
    if (empty($braceletId)) {
        nfc_error_response('缺少手串ID');
        return;
    }
    
    // 检查是否被锁定
    if (is_bracelet_locked($braceletId)) {
        nfc_error_response('此手串因异常访问已被临时锁定，请稍后再试');
        return;
    }
    
    // 记录访问尝试
    log_nfc_access_attempt($braceletId, $nfcToken, $_SERVER['REMOTE_ADDR']);
    
    // 检测可疑活动
    if (!detect_suspicious_activity($braceletId)) {
        nfc_error_response('检测到异常访问，已临时锁定');
        return;
    }
    
    // 根据认证类型处理
    switch ($authType) {
        case 'secure':
            handle_secure_nfc_access($braceletId, $nfcToken);
            break;
        case 'dynamic':
            handle_dynamic_nfc_access($braceletId);
            break;
        case 'twofactor':
            handle_two_factor_nfc_access($braceletId);
            break;
        default:
            handle_standard_nfc_access($braceletId, $nfcToken);
            break;
    }
}

/**
 * 安全NFC访问（高级令牌验证）
 */
function handle_secure_nfc_access($braceletId, $nfcToken) {
    if (empty($nfcToken)) {
        // 如果没有令牌，重定向到公开页面
        redirect_to_public_page($braceletId);
        return;
    }
    
    // 验证NFC令牌
    if (validate_nfc_token($braceletId, $nfcToken)) {
        // 生成高级临时访问令牌
        $tempToken = generate_temp_access_token($braceletId, 'secure_verified', 600); // 10分钟有效期
        
        // 记录成功访问
        log_nfc_access($braceletId, $nfcToken, true);
        
        // 重定向到安全页面
        redirect_to_secure_page($braceletId, $tempToken);
    } else {
        log_nfc_access($braceletId, $nfcToken, false);
        nfc_error_response('安全令牌无效或已过期');
    }
}

/**
 * 标准NFC访问（带令牌验证）
 */
function handle_standard_nfc_access($braceletId, $nfcToken) {
    if (empty($nfcToken)) {
        // 如果没有令牌，重定向到公开页面
        redirect_to_public_page($braceletId);
        return;
    }
    
    // 验证NFC令牌
    if (validate_nfc_token($braceletId, $nfcToken)) {
        // 生成临时访问令牌
        $tempToken = generate_temp_access_token($braceletId, 'nfc_verified');
        
        // 记录成功访问
        log_nfc_access($braceletId, $nfcToken, true);
        
        // 重定向到安全页面
        redirect_to_secure_page($braceletId, $tempToken);
    } else {
        log_nfc_access($braceletId, $nfcToken, false);
        nfc_error_response('NFC令牌无效或已过期');
    }
}

/**
 * 动态密钥NFC访问
 */
function handle_dynamic_nfc_access($braceletId) {
    // 验证手串是否存在
    if (!is_valid_bracelet($braceletId)) {
        nfc_error_response('手串ID无效');
        return;
    }
    
    // 生成动态密钥验证
    $dynamicKey = generate_dynamic_key($braceletId);
    if ($dynamicKey) {
        $tempToken = generate_temp_access_token($braceletId, 'dynamic_verified');
        log_nfc_access($braceletId, 'dynamic', true);
        redirect_to_secure_page($braceletId, $tempToken);
    } else {
        log_nfc_access($braceletId, 'dynamic', false);
        nfc_error_response('动态验证失败');
    }
}

/**
 * 二级认证NFC访问
 */
function handle_two_factor_nfc_access($braceletId) {
    // 验证手串是否存在
    if (!is_valid_bracelet($braceletId)) {
        nfc_error_response('手串ID无效');
        return;
    }
    
    // 生成预认证令牌
    $preAuthToken = generate_temp_access_token($braceletId, 'pre_auth', 600); // 10分钟
    
    // 重定向到二级认证页面
    $authUrl = home_url("/nfc-verify.html?braceletId={$braceletId}&preAuth={$preAuthToken}");
    wp_redirect($authUrl);
    exit;
}

/**
 * 验证NFC令牌
 */
function validate_nfc_token($braceletId, $nfcToken) {
    global $wpdb;
    
    // 查询数据库中的NFC令牌
    $table_name = $wpdb->prefix . 'bracelet_nfc_security';
    
    $stored_data = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$table_name} 
         WHERE bracelet_id = %s AND nfc_token = %s 
         AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())",
        $braceletId,
        hash('sha256', $nfcToken) // 存储哈希值而不是明文
    ));
    
    if ($stored_data) {
        // 更新访问计数和时间
        $wpdb->update(
            $table_name,
            [
                'access_count' => $stored_data->access_count + 1,
                'last_access' => current_time('mysql')
            ],
            ['id' => $stored_data->id]
        );
        
        return true;
    }
    
    return false;
}

/**
 * 生成动态密钥
 */
function generate_dynamic_key($braceletId, $timestamp = null) {
    $timestamp = $timestamp ?: time();
    $timeWindow = floor($timestamp / 300); // 5分钟时间窗口
    
    $masterSecret = get_option('bracelet_master_secret');
    if (!$masterSecret) {
        // 如果没有主密钥，生成一个
        $masterSecret = bin2hex(random_bytes(32));
        update_option('bracelet_master_secret', $masterSecret);
    }
    
    // 允许当前和前一个时间窗口
    for ($i = 0; $i <= 1; $i++) {
        $testTime = $timestamp - ($i * 300);
        $testWindow = floor($testTime / 300);
        $dynamicKey = hash('sha256', $braceletId . $testWindow . $masterSecret);
        
        // 这里可以添加额外验证逻辑
        if (is_valid_bracelet($braceletId)) {
            return $dynamicKey;
        }
    }
    
    return false;
}

/**
 * 生成临时访问令牌
 */
function generate_temp_access_token($braceletId, $level = 'basic', $duration = 300) {
    $token = bin2hex(random_bytes(32));
    $tokenData = [
        'braceletId' => $braceletId,
        'level' => $level,
        'created' => time(),
        'ip' => $_SERVER['REMOTE_ADDR']
    ];
    
    // 存储临时令牌
    set_transient("nfc_temp_token_{$token}", $tokenData, $duration);
    
    return $token;
}

/**
 * 验证临时访问令牌
 */
function validate_temp_access_token($token) {
    $tokenData = get_transient("nfc_temp_token_{$token}");
    if ($tokenData && is_array($tokenData)) {
        // 验证IP（可选）
        if (isset($tokenData['ip']) && $tokenData['ip'] !== $_SERVER['REMOTE_ADDR']) {
            // IP不匹配，可能的安全问题
            error_log("NFC令牌IP不匹配: {$tokenData['ip']} vs {$_SERVER['REMOTE_ADDR']}");
        }
        
        return $tokenData;
    }
    return false;
}

/**
 * 检查手串是否被锁定
 */
function is_bracelet_locked($braceletId) {
    return get_transient("bracelet_locked_{$braceletId}") === true;
}

/**
 * 检测可疑活动
 */
function detect_suspicious_activity($braceletId) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'bracelet_access_log';
    
    // 检查1小时内访问次数
    $recent_access = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$table_name} 
         WHERE bracelet_id = %s AND access_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)",
        $braceletId
    ));
    
    if ($recent_access > 10) { // 1小时超过10次访问
        // 临时锁定
        set_transient("bracelet_locked_{$braceletId}", true, 3600);
        
        // 发送警报邮件
        wp_mail(
            get_option('admin_email'),
            'NFC异常访问警报',
            "手串 {$braceletId} 在1小时内被访问{$recent_access}次，已临时锁定。\n\n" .
            "时间: " . current_time('mysql') . "\n" .
            "IP: " . $_SERVER['REMOTE_ADDR'] . "\n" .
            "User Agent: " . $_SERVER['HTTP_USER_AGENT']
        );
        
        return false;
    }
    
    return true;
}

/**
 * 记录NFC访问日志
 */
function log_nfc_access($braceletId, $nfcToken, $success, $ip = null) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'bracelet_access_log';
    
    $wpdb->insert(
        $table_name,
        [
            'bracelet_id' => $braceletId,
            'nfc_token' => $nfcToken === 'dynamic' ? 'dynamic' : substr($nfcToken, 0, 8) . '****',
            'access_success' => $success ? 1 : 0,
            'ip_address' => $ip ?: $_SERVER['REMOTE_ADDR'],
            'user_agent' => substr($_SERVER['HTTP_USER_AGENT'], 0, 255),
            'access_time' => current_time('mysql')
        ]
    );
}

/**
 * 记录访问尝试
 */
function log_nfc_access_attempt($braceletId, $nfcToken, $ip) {
    // 可以在这里添加更详细的日志记录
    error_log("NFC访问尝试: {$braceletId} from {$ip}");
}

/**
 * 验证手串是否有效
 */
function is_valid_bracelet($braceletId) {
    // 在这里添加验证逻辑，比如检查数据库中是否存在该手串
    global $wpdb;
    
    $count = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->posts} 
         WHERE post_type = 'bracelet' AND post_name = %s AND post_status = 'publish'",
        $braceletId
    ));
    
    return $count > 0;
}

/**
 * 重定向到公开页面
 */
function redirect_to_public_page($braceletId) {
    $publicUrl = home_url("/blessnow.html?braceletId={$braceletId}&nfc=1&level=public");
    wp_redirect($publicUrl);
    exit;
}

/**
 * 重定向到安全页面
 */
function redirect_to_secure_page($braceletId, $tempToken) {
    $secureUrl = home_url("/blessnow.html?braceletId={$braceletId}&tempToken={$tempToken}&level=secure");
    wp_redirect($secureUrl);
    exit;
}

/**
 * 错误响应
 */
function nfc_error_response($message) {
    $errorUrl = home_url("/nfc-error.html?message=" . urlencode($message));
    wp_redirect($errorUrl);
    exit;
}

/**
 * 创建必要的数据库表
 */
function create_nfc_security_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // NFC安全表
    $nfc_security_table = $wpdb->prefix . 'bracelet_nfc_security';
    $sql1 = "CREATE TABLE $nfc_security_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bracelet_id VARCHAR(50) NOT NULL,
        nfc_token VARCHAR(64) NOT NULL,
        api_key_hash VARCHAR(64) NOT NULL,
        access_count INT DEFAULT 0,
        last_access DATETIME,
        expires_at DATETIME,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_bracelet_token (bracelet_id, nfc_token),
        INDEX idx_expires (expires_at)
    ) $charset_collate;";
    
    // 访问日志表
    $access_log_table = $wpdb->prefix . 'bracelet_access_log';
    $sql2 = "CREATE TABLE $access_log_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bracelet_id VARCHAR(50) NOT NULL,
        nfc_token VARCHAR(20),
        access_success BOOLEAN,
        ip_address VARCHAR(45),
        user_agent VARCHAR(255),
        access_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_bracelet_time (bracelet_id, access_time),
        INDEX idx_access_time (access_time)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql1);
    dbDelta($sql2);
}

// 如果直接访问此文件，执行NFC认证
if (!wp_doing_ajax() && !wp_doing_cron()) {
    // 确保数据库表存在
    create_nfc_security_tables();
    
    // 处理NFC访问
    handle_nfc_access();
}

/**
 * 生成NFC令牌的辅助函数（管理员使用）
 */
function generate_nfc_token_for_bracelet($braceletId, $expiresInDays = 365) {
    global $wpdb;
    
    $nfcToken = bin2hex(random_bytes(16)); // 32字符
    $apiKeyHash = hash('sha256', $braceletId . $nfcToken . 'secret_salt');
    $expiresAt = date('Y-m-d H:i:s', time() + ($expiresInDays * 24 * 3600));
    
    $table_name = $wpdb->prefix . 'bracelet_nfc_security';
    
    $result = $wpdb->insert(
        $table_name,
        [
            'bracelet_id' => $braceletId,
            'nfc_token' => hash('sha256', $nfcToken), // 存储哈希值
            'api_key_hash' => $apiKeyHash,
            'expires_at' => $expiresAt,
            'is_active' => true
        ]
    );
    
    if ($result) {
        return [
            'nfc_token' => $nfcToken, // 返回明文供写入NFC标签
            'nfc_url' => home_url("/wp-content/plugins/bracelet-info-api/nfc-auth.php?id={$braceletId}&token={$nfcToken}&type=secure"),
            'expires_at' => $expiresAt
        ];
    }
    
    return false;
}
?> 