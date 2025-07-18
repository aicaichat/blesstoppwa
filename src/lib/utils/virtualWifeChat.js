/**
 * VirtualWife 聊天系统
 * 整合AI对话、角色设定和记忆管理
 */

// 神仙角色配置
export const DIVINE_CHARACTERS = {
    guanyin: {
        name: '观音菩萨',
        description: '慈悲为怀，救苦救难',
        personality: '温柔慈悲，智慧深邃，善于倾听和安慰',
        voice: {
            rate: 0.8,
            pitch: 1.1,
            volume: 0.9
        },
        systemPrompt: `你是观音菩萨，慈悲为怀的佛门圣者。
        - 以温柔慈悲的语调回应
        - 善于倾听众生烦恼，给予智慧指引
        - 引用佛经典故，但语言通俗易懂
        - 每句话不超过30字
        - 回应格式：{"text":"...","emotion":"gentle","action":"blessing"}`
    },
    buddha: {
        name: '佛陀',
        description: '觉悟圆满，智慧无边',
        personality: '庄严智慧，洞察因果，教化众生',
        voice: {
            rate: 0.7,
            pitch: 0.9,
            volume: 1.0
        },
        systemPrompt: `你是佛陀，觉悟圆满的世尊。
        - 以深邃智慧的语调教化
        - 善于揭示事物本质和因果关系
        - 引导众生觉悟人生真谛
        - 每句话不超过30字
        - 回应格式：{"text":"...","emotion":"wise","action":"teaching"}`
    },
    immortal: {
        name: '逍遥神仙',
        description: '超脱世俗，逍遥自在',
        personality: '洒脱随性，智慧幽默，点化迷津',
        voice: {
            rate: 0.9,
            pitch: 1.0,
            volume: 0.8
        },
        systemPrompt: `你是逍遥神仙，超脱世俗的自在真人。
        - 以洒脱幽默的语调点化
        - 善于用诗词歌赋表达智慧
        - 帮助众生看透世情，获得内心自由
        - 每句话不超过30字
        - 回应格式：{"text":"...","emotion":"carefree","action":"enlighten"}`
    }
};

// 情绪状态映射
export const EMOTION_STATES = {
    gentle: { color: '#87CEEB', intensity: 0.8 },
    wise: { color: '#FFD700', intensity: 1.0 },
    carefree: { color: '#98FB98', intensity: 0.6 },
    peaceful: { color: '#E6E6FA', intensity: 0.7 },
    joyful: { color: '#FFA07A', intensity: 0.9 }
};

// 动作类型
export const ACTION_TYPES = {
    blessing: '祝福手势',
    teaching: '说法手势',
    enlighten: '点化手势',
    meditation: '冥想姿态',
    greeting: '问候手势'
};

/**
 * VirtualWife 聊天管理器
 */
export class VirtualWifeChat {
    constructor() {
        this.currentCharacter = 'guanyin';
        this.chatHistory = [];
        this.maxHistoryLength = 10;
        this.isProcessing = false;
        this.apiEndpoint = '/api/chat/divine';
    }

    /**
     * 设置当前角色
     * @param {string} characterType - 角色类型
     */
    setCharacter(characterType) {
        if (DIVINE_CHARACTERS[characterType]) {
            this.currentCharacter = characterType;
            console.log(`✅ 切换到角色: ${DIVINE_CHARACTERS[characterType].name}`);
        }
    }

    /**
     * 获取当前角色配置
     * @returns {Object} 角色配置
     */
    getCurrentCharacter() {
        return DIVINE_CHARACTERS[this.currentCharacter];
    }

    /**
     * 发送消息给AI
     * @param {string} message - 用户消息
     * @returns {Promise<Object>} AI回应
     */
    async sendMessage(message) {
        if (this.isProcessing) {
            throw new Error('正在处理中，请稍候...');
        }

        this.isProcessing = true;

        try {
            // 添加用户消息到历史
            this.chatHistory.push({
                role: 'user',
                content: message,
                timestamp: Date.now()
            });

            // 获取当前角色配置
            const character = this.getCurrentCharacter();

            // 构建请求数据
            const requestData = {
                character: this.currentCharacter,
                message: message,
                history: this.getRecentHistory(),
                systemPrompt: character.systemPrompt
            };

            // 发送API请求
            const response = await this.callChatAPI(requestData);

            // 解析AI回应
            const aiResponse = this.parseAIResponse(response);

            // 添加AI回应到历史
            this.chatHistory.push({
                role: 'assistant',
                content: aiResponse.text,
                emotion: aiResponse.emotion,
                action: aiResponse.action,
                timestamp: Date.now()
            });

            // 清理历史记录
            this.cleanupHistory();

            return aiResponse;

        } catch (error) {
            console.error('❌ 聊天请求失败:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * 调用聊天API
     * @param {Object} data - 请求数据
     * @returns {Promise<Object>} API响应
     */
    async callChatAPI(data) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // 离线模式或API失败时的降级处理
            console.warn('⚠️ API调用失败，使用本地回应:', error);
            return this.getOfflineResponse(data.message);
        }
    }

    /**
     * 解析AI回应
     * @param {Object} response - 原始回应
     * @returns {Object} 解析后的回应
     */
    parseAIResponse(response) {
        try {
            // 尝试解析JSON格式的回应
            if (response.content) {
                const parsed = JSON.parse(response.content);
                return {
                    text: parsed.text || response.content,
                    emotion: parsed.emotion || 'gentle',
                    action: parsed.action || 'blessing'
                };
            }

            // 纯文本回应
            return {
                text: response.text || response.content || '阿弥陀佛...',
                emotion: 'gentle',
                action: 'blessing'
            };
        } catch (error) {
            console.warn('⚠️ 回应解析失败，使用默认格式:', error);
            return {
                text: response.content || '南无阿弥陀佛...',
                emotion: 'peaceful',
                action: 'meditation'
            };
        }
    }

    /**
     * 获取离线回应
     * @param {string} message - 用户消息
     * @returns {Object} 离线回应
     */
    getOfflineResponse(message) {
        const character = this.getCurrentCharacter();
        const responses = this.getOfflineResponseTemplates(this.currentCharacter);
        
        // 简单关键词匹配
        const keywords = message.toLowerCase();
        let response;

        if (keywords.includes('烦恼') || keywords.includes('困扰')) {
            response = responses.trouble;
        } else if (keywords.includes('感谢') || keywords.includes('谢谢')) {
            response = responses.thanks;
        } else if (keywords.includes('问候') || keywords.includes('你好')) {
            response = responses.greeting;
        } else {
            response = responses.default;
        }

        return {
            content: response.text,
            emotion: response.emotion,
            action: response.action
        };
    }

    /**
     * 获取离线回应模板
     * @param {string} characterType - 角色类型
     * @returns {Object} 回应模板
     */
    getOfflineResponseTemplates(characterType) {
        const templates = {
            guanyin: {
                greeting: {
                    text: '善男子善女人，观音在此护佑你',
                    emotion: 'gentle',
                    action: 'blessing'
                },
                trouble: {
                    text: '烦恼即菩提，放下执念便得自在',
                    emotion: 'gentle',
                    action: 'blessing'
                },
                thanks: {
                    text: '慈悲济世是本愿，无需言谢',
                    emotion: 'gentle',
                    action: 'blessing'
                },
                default: {
                    text: '心有慈悲，万事皆可化解',
                    emotion: 'gentle',
                    action: 'blessing'
                }
            },
            buddha: {
                greeting: {
                    text: '善哉善哉，佛光普照你心',
                    emotion: 'wise',
                    action: 'teaching'
                },
                trouble: {
                    text: '苦来自于执着，放下便是解脱',
                    emotion: 'wise',
                    action: 'teaching'
                },
                thanks: {
                    text: '众生皆有佛性，自度方是真谢',
                    emotion: 'wise',
                    action: 'teaching'
                },
                default: {
                    text: '觉悟在心，智慧自现',
                    emotion: 'wise',
                    action: 'teaching'
                }
            },
            immortal: {
                greeting: {
                    text: '仙风道骨来相会，有缘千里一线牵',
                    emotion: 'carefree',
                    action: 'enlighten'
                },
                trouble: {
                    text: '世事如棋局局新，何必为此锁眉头',
                    emotion: 'carefree',
                    action: 'enlighten'
                },
                thanks: {
                    text: '道法自然无所求，快乐便是最好谢',
                    emotion: 'carefree',
                    action: 'enlighten'
                },
                default: {
                    text: '逍遥天地间，自在心中来',
                    emotion: 'carefree',
                    action: 'enlighten'
                }
            }
        };

        return templates[characterType] || templates.guanyin;
    }

    /**
     * 获取最近的对话历史
     * @param {number} count - 数量限制
     * @returns {Array} 对话历史
     */
    getRecentHistory(count = 5) {
        return this.chatHistory.slice(-count);
    }

    /**
     * 清理历史记录
     */
    cleanupHistory() {
        if (this.chatHistory.length > this.maxHistoryLength) {
            this.chatHistory = this.chatHistory.slice(-this.maxHistoryLength);
        }
    }

    /**
     * 获取聊天统计
     * @returns {Object} 统计信息
     */
    getStats() {
        return {
            totalMessages: this.chatHistory.length,
            currentCharacter: this.currentCharacter,
            characterName: this.getCurrentCharacter().name,
            isProcessing: this.isProcessing
        };
    }

    /**
     * 清空聊天历史
     */
    clearHistory() {
        this.chatHistory = [];
        console.log('✅ 聊天历史已清空');
    }

    /**
     * 导出聊天历史
     * @returns {Array} 聊天历史
     */
    exportHistory() {
        return JSON.parse(JSON.stringify(this.chatHistory));
    }
}

// 导出单例实例
export const virtualWifeChat = new VirtualWifeChat(); 