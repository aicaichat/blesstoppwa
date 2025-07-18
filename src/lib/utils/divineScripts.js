/**
 * 神仙语音文案生成器
 * 根据用户状态、时长、情绪生成个性化的禅意语音
 */

// 观音菩萨慈悲语音文案
const guanyinScripts = {
	// 开场引导
	opening: [
		"阿弥陀佛，施主。我是观音菩萨，愿以慈悲之心护佑于你。",
		"善哉善哉，我感受到你内心的波动。让我为你带来宁静与平和。",
		"慈悲喜舍，四无量心。愿我的声音如甘露般滋润你的心灵。"
	],
	
	// 呼吸引导
	breathing: [
		"深呼吸，感受慈悲之光充满全身。",
		"吸气时，接纳一切；呼气时，放下执着。",
		"呼吸之间，万法皆空。让心灵回归本真。",
		"每一次呼吸，都是与宇宙的对话。",
		"吸气如莲花绽放，呼气如清风徐来。"
	],
	
	// 情绪安抚
	calming: [
		"心如止水，方能照见真相。",
		"一切皆是无常，包括你的烦恼。",
		"执着生苦，放下即得自在。",
		"慈悲是治愈一切痛苦的良药。",
		"让慈悲之光净化你的心灵。"
	],
	
	// 智慧开示
	wisdom: [
		"金刚般若，智慧现前。",
		"心净则国土净，心安则众生安。",
		"万法归一，一归何处？",
		"菩提本无树，明镜亦非台。",
		"本来无一物，何处惹尘埃。"
	],
	
	// 结束祝福
	closing: [
		"愿你得观音护佑，内心常驻慈悲。",
		"功德圆满，回向众生。愿你平安喜乐。",
		"慈悲为怀，智慧如海。愿你前程似锦。"
	]
};

// 佛陀智慧语音文案
const buddhaScripts = {
	opening: [
		"南无阿弥陀佛。我是佛陀，愿以智慧之光指引你。",
		"善男子，善女人。我感受到你寻求解脱的心。",
		"佛法无边，智慧如海。让我为你开启智慧之门。"
	],
	
	breathing: [
		"观呼吸，知无常。每一次呼吸都是修行的机会。",
		"专注呼吸，心无旁骛。这是通往解脱的路径。",
		"呼吸如流水，心念如浮云。让它们自然来去。",
		"观想呼吸，觉知当下。这是正念的开始。"
	],
	
	calming: [
		"诸法因缘生，诸法因缘灭。",
		"苦海无边，回头是岸。",
		"放下屠刀，立地成佛。",
		"心若清净，世界清净。",
		"烦恼即菩提，生死即涅槃。"
	],
	
	wisdom: [
		"色即是空，空即是色。",
		"一切有为法，如梦幻泡影。",
		"应无所住而生其心。",
		"菩提本无树，明镜亦非台。",
		"万法皆空，因果不空。"
	],
	
	closing: [
		"愿你得佛陀智慧，解脱自在。",
		"法喜充满，智慧如海。愿你觉悟人生。",
		"南无阿弥陀佛，愿你离苦得乐。"
	]
};

// 神仙飘逸语音文案
const immortalScripts = {
	opening: [
		"道友，我是千年神仙，愿与你分享长生之道。",
		"仙缘难得，今日相遇便是缘分。让我为你开启仙途。",
		"天地玄黄，宇宙洪荒。我是神仙，愿护佑于你。"
	],
	
	breathing: [
		"吐纳天地之气，感受仙道玄机。",
		"呼吸如龙，心念如凤。让仙气充盈全身。",
		"一呼一吸，皆是修行。仙道就在呼吸之间。",
		"吸气纳天地精华，呼气散心中杂念。"
	],
	
	calming: [
		"心如止水，神如明镜。",
		"仙道无涯，心净则仙。",
		"放下尘缘，回归本真。",
		"仙气护体，百毒不侵。",
		"心若清净，便是神仙。"
	],
	
	wisdom: [
		"道法自然，无为而治。",
		"仙道贵生，慈悲济世。",
		"天地不仁，以万物为刍狗。",
		"大道至简，返璞归真。",
		"仙道无涯，学海无涯。"
	],
	
	closing: [
		"愿你得神仙护佑，长生不老。",
		"仙缘已结，愿你前程似锦。",
		"仙道无涯，愿你早日成仙。"
	]
};

/**
 * 根据用户状态生成个性化语音文案
 */
export function generateDivineScript(userState = {}) {
	const {
		duration = 60,
		calmScore = 70,
		stressLevel = 'medium',
		userType = 'general'
	} = userState;
	
	// 根据时长选择神仙类型
	let divineType = 'guanyin';
	let scripts = guanyinScripts;
	
	if (duration >= 90) {
		divineType = 'buddha';
		scripts = buddhaScripts;
	} else if (duration >= 60) {
		divineType = 'immortal';
		scripts = immortalScripts;
	}
	
	// 根据压力水平调整文案
	let scriptCategory = 'breathing';
	if (calmScore < 50) {
		scriptCategory = 'calming';
	} else if (calmScore > 80) {
		scriptCategory = 'wisdom';
	}
	
	// 根据用户类型个性化
	let personalizedScripts = scripts[scriptCategory];
	
	switch (userType) {
		case 'anxious':
			personalizedScripts = [
				...scripts.calming,
				...scripts.breathing
			];
			break;
		case 'seeking':
			personalizedScripts = [
				...scripts.wisdom,
				...scripts.opening
			];
			break;
		case 'meditation':
			personalizedScripts = [
				...scripts.breathing,
				...scripts.wisdom
			];
			break;
	}
	
	return {
		type: divineType,
		scripts: personalizedScripts,
		opening: scripts.opening,
		closing: scripts.closing
	};
}

/**
 * 生成时间序列的语音文案
 */
export function generateTimedScripts(duration, userState = {}) {
	const scriptConfig = generateDivineScript(userState);
	const scripts = scriptConfig.scripts;
	
	// 根据时长分配文案时间点
	const timePoints = [];
	
	if (duration === 30) {
		// 30秒：开场 + 2个引导 + 结束
		timePoints.push(
			{ time: 0, text: scriptConfig.opening[0] },
			{ time: 8, text: scripts[0] },
			{ time: 18, text: scripts[1] },
			{ time: 25, text: scriptConfig.closing[0] }
		);
	} else if (duration === 60) {
		// 60秒：开场 + 4个引导 + 结束
		timePoints.push(
			{ time: 0, text: scriptConfig.opening[0] },
			{ time: 12, text: scripts[0] },
			{ time: 24, text: scripts[1] },
			{ time: 36, text: scripts[2] },
			{ time: 48, text: scripts[3] },
			{ time: 55, text: scriptConfig.closing[0] }
		);
	} else if (duration === 90) {
		// 90秒：开场 + 6个引导 + 结束
		timePoints.push(
			{ time: 0, text: scriptConfig.opening[0] },
			{ time: 15, text: scripts[0] },
			{ time: 30, text: scripts[1] },
			{ time: 45, text: scripts[2] },
			{ time: 60, text: scripts[3] },
			{ time: 75, text: scripts[4] },
			{ time: 85, text: scriptConfig.closing[0] }
		);
	}
	
	return {
		type: scriptConfig.type,
		phrases: timePoints
	};
}

/**
 * 生成情绪急救语音文案
 */
export function generateEmergencyScript(stressLevel = 'high') {
	const emergencyScripts = {
		high: [
			"深呼吸，一切都会过去。",
			"你是安全的，我在这里陪伴你。",
			"让紧张随着呼吸慢慢消散。",
			"感受内心的平静，它一直都在。"
		],
		medium: [
			"放松身心，接纳此刻的感受。",
			"每一次呼吸都是新的开始。",
			"让心灵回归宁静的状态。",
			"感受内在的智慧和力量。"
		],
		low: [
			"享受这份宁静与平和。",
			"让慈悲之光充满全身。",
			"感受与宇宙的连接。",
			"愿这份平静持续下去。"
		]
	};
	
	return emergencyScripts[stressLevel] || emergencyScripts.medium;
}

/**
 * 生成神仙对话回复文案
 */
export function generateDivineResponse(userMessage, context = {}) {
	const responses = {
		greeting: [
			"阿弥陀佛，施主。我感受到你内心的变化。",
			"善哉善哉，你的心灵正在净化。",
			"慈悲为怀，智慧如海。有什么想与我分享的吗？"
		],
		anxiety: [
			"心如止水，方能照见真相。焦虑如云，终将散去。",
			"一切皆是无常，包括你的烦恼。深呼吸，让它随风而逝。",
			"执着生苦，放下即得自在。试着接纳此刻的感受吧。"
		],
		confusion: [
			"答案早已在你心中，静心倾听内在的声音。",
			"山重水复疑无路，柳暗花明又一村。相信自己的智慧。",
			"当下即是道场，每个选择都是修行的机会。"
		],
		gratitude: [
			"无需言谢，助人为乐是我的本分。愿你常怀慈悲喜舍之心。",
			"善缘相聚，皆是因果。愿你在人生路上常有贵人相助。",
			"功德回向，众生安乐。记得将这份平静传递给他人。"
		],
		default: [
			"凡所有相，皆是虚妄。说说你的具体困扰，我来为你指点迷津。",
			"心有千千结，不如一念放下。详细说说吧，施主。",
			"生命如流水，问题如磐石。让我们一起寻找解决之道。"
		]
	};
	
	// 根据用户消息内容选择回复类型
	const message = userMessage.toLowerCase();
	let responseType = 'default';
	
	if (message.includes('你好') || message.includes('您好') || message.includes('问候')) {
		responseType = 'greeting';
	} else if (message.includes('焦虑') || message.includes('担心') || message.includes('害怕')) {
		responseType = 'anxiety';
	} else if (message.includes('困惑') || message.includes('迷茫') || message.includes('不知道')) {
		responseType = 'confusion';
	} else if (message.includes('感谢') || message.includes('谢谢') || message.includes('好的')) {
		responseType = 'gratitude';
	}
	
	const responseList = responses[responseType];
	return responseList[Math.floor(Math.random() * responseList.length)];
}

// 创建 divineScripts 对象用于兼容现有代码
export const divineScripts = {
	getScripts: (divineType, emotion) => {
		// 根据神仙类型和情绪返回对应的脚本
		let scripts;
		switch (divineType) {
			case 'guanyin':
				scripts = guanyinScripts;
				break;
			case 'buddha':
				scripts = buddhaScripts;
				break;
			case 'immortal':
				scripts = immortalScripts;
				break;
			default:
				scripts = guanyinScripts;
		}
		
		// 根据情绪选择合适的脚本类型
		let scriptType = 'breathing';
		if (emotion === 'anxious') {
			scriptType = 'calming';
		} else if (emotion === 'peaceful') {
			scriptType = 'wisdom';
		}
		
		return scripts[scriptType] || scripts.breathing;
	},
	
	generateScript: generateDivineScript,
	generateTimed: generateTimedScripts,
	generateEmergency: generateEmergencyScript,
	generateResponse: generateDivineResponse
};

export default {
	generateDivineScript,
	generateTimedScripts,
	generateEmergencyScript,
	generateDivineResponse,
	divineScripts
}; 