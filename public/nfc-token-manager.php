<?php
/**
 * NFC令牌管理器
 * 用于生成、管理和监控NFC访问令牌
 */

// 防止直接访问
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

// 检查管理员权限
if (!current_user_can('manage_options')) {
    wp_die('您没有权限访问此页面');
}

// 包含NFC认证处理器
require_once('nfc-auth.php');

?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFC令牌管理器</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .section h2 { color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group select { width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; }
        .btn-primary { background: #007cba; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-success { background: #28a745; color: white; }
        .token-result { padding: 15px; background: #e7f5e7; border: 1px solid #28a745; border-radius: 4px; margin-top: 10px; }
        .error { padding: 15px; background: #f8d7da; border: 1px solid #dc3545; border-radius: 4px; color: #721c24; }
        .success { padding: 15px; background: #d4edda; border: 1px solid #28a745; border-radius: 4px; color: #155724; }
        .token-list { margin-top: 20px; }
        .token-item { padding: 10px; border: 1px solid #ddd; margin-bottom: 10px; border-radius: 4px; }
        .token-item.expired { background: #f8f9fa; opacity: 0.7; }
        .qr-code { text-align: center; margin: 20px 0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-box { padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; }
        .access-log { max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; }
        .log-entry { padding: 5px; border-bottom: 1px solid #eee; font-size: 0.9em; }
        .log-success { color: #28a745; }
        .log-failed { color: #dc3545; }
        .copy-btn { padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 10px; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
</head>
<body>
    <div class="container">
        <h1>🔐 NFC令牌管理器</h1>
        
        <?php
        // 处理表单提交
        $message = '';
        $messageType = '';
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['action'])) {
                switch ($_POST['action']) {
                    case 'generate_token':
                        $braceletId = sanitize_text_field($_POST['bracelet_id']);
                        $expiresInDays = intval($_POST['expires_days']);
                        $tokenType = sanitize_text_field($_POST['token_type']);
                        
                        if ($braceletId) {
                            $result = generate_nfc_token_for_bracelet($braceletId, $expiresInDays);
                            if ($result) {
                                $message = "NFC令牌生成成功！";
                                $messageType = 'success';
                                $generatedToken = $result;
                            } else {
                                $message = "令牌生成失败，请检查手串ID是否正确。";
                                $messageType = 'error';
                            }
                        }
                        break;
                        
                    case 'revoke_token':
                        $tokenId = intval($_POST['token_id']);
                        if (revoke_nfc_token($tokenId)) {
                            $message = "令牌已成功撤销。";
                            $messageType = 'success';
                        } else {
                            $message = "撤销令牌失败。";
                            $messageType = 'error';
                        }
                        break;
                        
                    case 'create_tables':
                        create_nfc_security_tables();
                        $message = "数据库表创建成功。";
                        $messageType = 'success';
                        break;
                }
            }
        }
        
        if ($message) {
            echo "<div class='$messageType'>$message</div>";
        }
        ?>
        
        <!-- 统计信息 -->
        <div class="section">
            <h2>📊 统计概览</h2>
            <div class="stats">
                <?php
                $stats = get_nfc_statistics();
                ?>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $stats['total_tokens']; ?></div>
                    <div>总令牌数</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $stats['active_tokens']; ?></div>
                    <div>活跃令牌</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $stats['today_access']; ?></div>
                    <div>今日访问</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number"><?php echo $stats['success_rate']; ?>%</div>
                    <div>成功率</div>
                </div>
            </div>
        </div>
        
        <!-- 生成新令牌 -->
        <div class="section">
            <h2>🔑 生成新NFC令牌</h2>
            <form method="post">
                <input type="hidden" name="action" value="generate_token">
                
                <div class="form-group">
                    <label>手串ID:</label>
                    <input type="text" name="bracelet_id" required placeholder="例: jss20250110059edfdafaf1112df34">
                </div>
                
                <div class="form-group">
                    <label>令牌类型:</label>
                    <select name="token_type">
                        <option value="secure">安全令牌（推荐）</option>
                        <option value="dynamic">动态令牌</option>
                        <option value="twofactor">二级认证令牌</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>有效期（天）:</label>
                    <select name="expires_days">
                        <option value="30">30天</option>
                        <option value="90">90天</option>
                        <option value="365" selected>1年</option>
                        <option value="1095">3年</option>
                        <option value="0">永不过期</option>
                    </select>
                </div>
                
                <button type="submit" class="btn btn-primary">生成令牌</button>
            </form>
            
            <?php if (isset($generatedToken)): ?>
            <div class="token-result">
                <h3>✅ 令牌生成成功</h3>
                <p><strong>NFC URL:</strong> 
                    <input type="text" value="<?php echo $generatedToken['nfc_url']; ?>" readonly style="width: 600px;">
                    <button class="copy-btn" onclick="copyToClipboard('<?php echo $generatedToken['nfc_url']; ?>')">复制</button>
                </p>
                <p><strong>过期时间:</strong> <?php echo $generatedToken['expires_at']; ?></p>
                
                <div class="qr-code">
                    <canvas id="qrcode"></canvas>
                    <script>
                        QRCode.toCanvas(document.getElementById('qrcode'), '<?php echo $generatedToken['nfc_url']; ?>', {
                            width: 200,
                            margin: 2
                        });
                    </script>
                    <p>扫描二维码或使用NFC写入工具将URL写入NFC标签</p>
                </div>
            </div>
            <?php endif; ?>
        </div>
        
        <!-- 现有令牌管理 -->
        <div class="section">
            <h2>📋 现有令牌管理</h2>
            <div class="token-list">
                <?php
                $tokens = get_all_nfc_tokens();
                if (empty($tokens)): ?>
                    <p>暂无NFC令牌。<a href="#" onclick="location.reload()">刷新页面</a></p>
                <?php else: ?>
                    <?php foreach ($tokens as $token): ?>
                        <div class="token-item <?php echo !$token->is_active ? 'expired' : ''; ?>">
                            <strong>手串:</strong> <?php echo $token->bracelet_id; ?> | 
                            <strong>访问次数:</strong> <?php echo $token->access_count; ?> | 
                            <strong>最后访问:</strong> <?php echo $token->last_access ?: '从未'; ?> | 
                            <strong>过期时间:</strong> <?php echo $token->expires_at ?: '永不过期'; ?> | 
                            <strong>状态:</strong> <?php echo $token->is_active ? '🟢 活跃' : '🔴 已撤销'; ?>
                            
                            <?php if ($token->is_active): ?>
                                <form method="post" style="display: inline; margin-left: 20px;">
                                    <input type="hidden" name="action" value="revoke_token">
                                    <input type="hidden" name="token_id" value="<?php echo $token->id; ?>">
                                    <button type="submit" class="btn btn-danger" onclick="return confirm('确定要撤销此令牌吗？')">撤销</button>
                                </form>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- 访问日志 -->
        <div class="section">
            <h2>📝 最近访问日志</h2>
            <div class="access-log">
                <?php
                $logs = get_recent_access_logs(50);
                if (empty($logs)): ?>
                    <p>暂无访问记录。</p>
                <?php else: ?>
                    <?php foreach ($logs as $log): ?>
                        <div class="log-entry <?php echo $log->access_success ? 'log-success' : 'log-failed'; ?>">
                            [<?php echo $log->access_time; ?>] 
                            手串: <?php echo $log->bracelet_id; ?> | 
                            IP: <?php echo $log->ip_address; ?> | 
                            <?php echo $log->access_success ? '✅ 成功' : '❌ 失败'; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- 系统管理 -->
        <div class="section">
            <h2>⚙️ 系统管理</h2>
            <form method="post" style="display: inline;">
                <input type="hidden" name="action" value="create_tables">
                <button type="submit" class="btn btn-success">创建/更新数据库表</button>
            </form>
            
            <button class="btn btn-primary" onclick="exportLogs()">导出访问日志</button>
            <button class="btn btn-danger" onclick="cleanupExpiredTokens()">清理过期令牌</button>
        </div>
    </div>
    
    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(function() {
                alert('已复制到剪贴板');
            });
        }
        
        function exportLogs() {
            window.open('?export_logs=1', '_blank');
        }
        
        function cleanupExpiredTokens() {
            if (confirm('确定要清理所有过期令牌吗？此操作不可撤销。')) {
                fetch('?cleanup_expired=1', { method: 'POST' })
                    .then(response => response.text())
                    .then(data => {
                        alert('清理完成');
                        location.reload();
                    });
            }
        }
    </script>
</body>
</html>

<?php
/**
 * 获取NFC统计信息
 */
function get_nfc_statistics() {
    global $wpdb;
    
    $security_table = $wpdb->prefix . 'bracelet_nfc_security';
    $log_table = $wpdb->prefix . 'bracelet_access_log';
    
    // 总令牌数
    $total_tokens = $wpdb->get_var("SELECT COUNT(*) FROM $security_table");
    
    // 活跃令牌数
    $active_tokens = $wpdb->get_var("SELECT COUNT(*) FROM $security_table WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())");
    
    // 今日访问次数
    $today_access = $wpdb->get_var("SELECT COUNT(*) FROM $log_table WHERE DATE(access_time) = CURDATE()");
    
    // 成功率（最近100次访问）
    $recent_success = $wpdb->get_var("SELECT COUNT(*) FROM (SELECT * FROM $log_table ORDER BY access_time DESC LIMIT 100) t WHERE access_success = 1");
    $success_rate = $recent_success > 0 ? round(($recent_success / 100) * 100) : 0;
    
    return [
        'total_tokens' => $total_tokens ?: 0,
        'active_tokens' => $active_tokens ?: 0,
        'today_access' => $today_access ?: 0,
        'success_rate' => $success_rate
    ];
}

/**
 * 获取所有NFC令牌
 */
function get_all_nfc_tokens() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'bracelet_nfc_security';
    
    return $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
}

/**
 * 撤销NFC令牌
 */
function revoke_nfc_token($tokenId) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'bracelet_nfc_security';
    
    return $wpdb->update(
        $table_name,
        ['is_active' => 0],
        ['id' => $tokenId]
    );
}

/**
 * 获取最近访问日志
 */
function get_recent_access_logs($limit = 50) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'bracelet_access_log';
    
    return $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name ORDER BY access_time DESC LIMIT %d",
        $limit
    ));
}

// 处理导出日志请求
if (isset($_GET['export_logs'])) {
    $logs = get_recent_access_logs(1000);
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="nfc_access_logs_' . date('Y-m-d') . '.csv"');
    
    $output = fopen('php://output', 'w');
    fputcsv($output, ['时间', '手串ID', 'NFC令牌', '成功', 'IP地址', 'User Agent']);
    
    foreach ($logs as $log) {
        fputcsv($output, [
            $log->access_time,
            $log->bracelet_id,
            $log->nfc_token,
            $log->access_success ? '是' : '否',
            $log->ip_address,
            $log->user_agent
        ]);
    }
    
    fclose($output);
    exit;
}

// 处理清理过期令牌请求
if (isset($_GET['cleanup_expired'])) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'bracelet_nfc_security';
    
    $deleted = $wpdb->query("DELETE FROM $table_name WHERE expires_at IS NOT NULL AND expires_at < NOW()");
    
    echo "清理了 $deleted 个过期令牌";
    exit;
}
?> 