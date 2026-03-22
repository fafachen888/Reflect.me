import { UserProfile, MatchSession, RelationEdge, SimulationScene } from '../types';

// ============================================================
// 行业与职业分类数据（参照招聘网站）
// ============================================================
export const industryCategories = [
  { value: '互联网/IT', label: '互联网/IT', jobs: ['前端开发', '后端开发', '产品经理', 'UI/UX设计', '测试/QA', '运维/DevOps', '数据分析师', '算法工程师', '项目经理', '运营/市场'] },
  { value: '金融/银行', label: '金融/银行', jobs: ['投资顾问', '风险管理', '审计', '银行柜员', '客户经理', '分析师', '精算师', '合规专员', '资产管理', '保险代理'] },
  { value: '教育培训', label: '教育培训', jobs: ['教师/讲师', '课程设计', '教务管理', '留学顾问', '培训师', '教研员', '幼教老师', '班主任', '教学主管', '课程顾问'] },
  { value: '医疗健康', label: '医疗健康', jobs: ['医生', '护士', '药剂师', '健康管理', '医疗器械', '医疗销售', '医学编辑', '心理咨询师', '康复治疗', '医疗管理'] },
  { value: '传媒/文化', label: '传媒/文化', jobs: ['编辑/记者', '内容运营', '摄影/摄像', '编剧/文案', '导演/制片', '主持人', '平面设计', '媒介策划', '品牌公关', '影视后期'] },
  { value: '房地产/建筑', label: '房地产/建筑', jobs: ['建筑师', '室内设计', '工程管理', '置业顾问', '造价工程师', '市场营销', '物业管理', '城市规划', '景观设计', '房产经纪'] },
  { value: '法律/咨询', label: '法律/咨询', jobs: ['律师', '法务', '咨询顾问', '猎头顾问', '审计', '税务顾问', '合规管理', '知识产权', '企业管理咨询', '心理咨询'] },
  { value: '制造/工程', label: '制造/工程', jobs: ['机械工程师', '电气工程师', '工艺工程师', '质量管理', '生产管理', '采购', '供应链', '工厂管理', '设备维护', '工艺设计'] },
  { value: '消费零售', label: '消费零售', jobs: ['店员/导购', '店长', '商品管理', '陈列设计', '采购', '销售代表', '连锁运营', '电商运营', '客户管理', '市场推广'] },
  { value: '政府/非盈利', label: '政府/非盈利', jobs: ['公务员', '事业单位', 'NGO', '社会组织', '公共管理', '政策研究', '公益项目', '志愿服务', '国际合作', '基金运营'] },
  { value: '科研/学术', label: '科研/学术', jobs: ['研究员', '博士后', '博士在读', '实验技术', '学术编辑', '专利代理', '高校教师', '科研管理', '技术转移', '院士/专家'] },
  { value: '自由职业', label: '自由职业', jobs: ['自媒体博主', '独立设计师', 'Freelancer', '独立摄影师', '自由撰稿人', '独立音乐人', '个人培训师', '代购/买手', '博主/Vlogger', '网红/KOL'] },
  { value: '学生', label: '学生', jobs: ['本科生', '硕士生', '博士生', 'MBA在读', '实习生', '交换学生', 'gap year', '准留学生', '艺考生', '体考生'] },
  { value: '其他', label: '其他行业', jobs: ['其他职业'] },
];

// ============================================================
// 40道题测评题库（9个维度，优化版）
// ============================================================
export interface Question {
  id: string;
  dimension: string;
  dimensionLabel: string;
  text: string;
  type: 'single' | 'multi' | 'date' | 'slider';
  options?: { text: string; score: number }[];
  placeholder?: string;
  allowOther?: boolean;
}

export interface AssessmentData {
  [questionId: string]: number | string;
}

export const assessmentQuestions: Question[] = [
  // ================== 维度1：基础信息（5题）====================
  { id: 'basic_birthday', dimension: 'basic', dimensionLabel: '基础信息', text: '你的出生日期是？', type: 'date', placeholder: '请选择年月日' },
  { id: 'basic_gender', dimension: 'basic', dimensionLabel: '基础信息', text: '你的性别是？', type: 'single', options: [{ text: '男', score: 1 }, { text: '女', score: 2 }, { text: '其他', score: 3 }] },
  { id: 'basic_education', dimension: 'basic', dimensionLabel: '基础信息', text: '你的最高学历是？', type: 'single', options: [{ text: '初中及以下', score: 1 }, { text: '高中/中专', score: 2 }, { text: '大专', score: 3 }, { text: '本科', score: 4 }, { text: '硕士', score: 5 }, { text: '博士及以上', score: 6 }], allowOther: true },
  { id: 'basic_income', dimension: 'basic', dimensionLabel: '基础信息', text: '你的年收入范围（含工资+副业+投资）？', type: 'single', options: [{ text: '8万以下', score: 1 }, { text: '8-15万', score: 2 }, { text: '15-25万', score: 3 }, { text: '25-40万', score: 4 }, { text: '40-70万', score: 5 }, { text: '70万以上', score: 6 }] },
  { id: 'basic_city', dimension: 'basic', dimensionLabel: '基础信息', text: '你目前生活的城市属于？', type: 'single', options: [{ text: '县城/乡镇', score: 1 }, { text: '三线/四线城市', score: 2 }, { text: '二线城市（如南京、杭州）', score: 3 }, { text: '新一线城市（如成都、武汉）', score: 4 }, { text: '一线城市（北上广深）', score: 5 }] },

  // ================== 维度2：家庭情况（4题）====================
  { id: 'family_structure', dimension: 'family', dimensionLabel: '家庭情况', text: '你的家庭结构是？', type: 'single', options: [{ text: '独生子女', score: 1 }, { text: '有哥哥/姐姐', score: 2 }, { text: '有弟弟/妹妹', score: 3 }, { text: '多子女家庭（3个及以上）', score: 4 }, { text: '其他', score: 5 }] },
  { id: 'family_relation', dimension: 'family', dimensionLabel: '家庭情况', text: '你与父母的关系总体是？', type: 'single', options: [{ text: '非常亲密，经常沟通', score: 5 }, { text: '关系不错，保持适度联系', score: 4 }, { text: '关系一般，较少交流', score: 3 }, { text: '关系一般，较为疏离', score: 2 }, { text: '关系紧张或有较大矛盾', score: 1 }] },
  { id: 'family_marriage', dimension: 'family', dimensionLabel: '家庭情况', text: '父母对你的婚恋态度是？', type: 'single', options: [{ text: '非常支持，不催婚，给足够空间', score: 5 }, { text: '支持但偶尔催促', score: 4 }, { text: '比较着急，经常安排相亲', score: 2 }, { text: '不闻不问，随我自己', score: 3 }, { text: '反对或不理解', score: 1 }] },
  { id: 'family_finance', dimension: 'family', dimensionLabel: '家庭情况', text: '你的家庭经济状况属于？', type: 'single', options: [{ text: '比较困难，需要共同努力', score: 1 }, { text: '普通工薪阶层', score: 2 }, { text: '中产，略有积蓄', score: 3 }, { text: '中上，比较富裕', score: 4 }, { text: '富裕，有充足保障', score: 5 }] },

  // ================== 维度3：人格特征（8题）====================
  { id: 'personality_social', dimension: 'personality', dimensionLabel: '人格特征', text: '在社交场合中，你通常表现为？', type: 'single', options: [{ text: '主动搭话，自然聊天，社交达人', score: 5 }, { text: '适度参与，不主动也不被动', score: 4 }, { text: '安静观察，等别人主动接近', score: 3 }, { text: '能不说话就不说话，有些社恐', score: 2 }, { text: '完全不想社交，独来独往', score: 1 }] },
  { id: 'personality_difficulty', dimension: 'personality', dimensionLabel: '人格特征', text: '当你遇到困难时，你的第一反应是？', type: 'single', options: [{ text: '自己想办法解决，不想麻烦别人', score: 4 }, { text: '先尝试自己，不行再求助', score: 3 }, { text: '第一时间找朋友或家人帮忙', score: 2 }, { text: '陷入焦虑，等待别人发现并主动帮忙', score: 1 }] },
  { id: 'personality_emotion', dimension: 'personality', dimensionLabel: '人格特征', text: '你对自己情绪的控制能力如何？', type: 'single', options: [{ text: '非常稳定，很少失控或大起大落', score: 5 }, { text: '基本稳定，偶尔有小的情绪波动', score: 4 }, { text: '有时不稳定，容易受外界影响', score: 3 }, { text: '经常情绪波动，需要时间平复', score: 2 }, { text: '情绪起伏较大，难以自控', score: 1 }] },
  { id: 'personality_decision', dimension: 'personality', dimensionLabel: '人格特征', text: '你做决定时的风格是？', type: 'single', options: [{ text: '深思熟虑，全面分析利弊后才决定', score: 5 }, { text: '权衡利弊后快速决定，不纠结', score: 4 }, { text: '凭直觉，感觉对了就决定', score: 3 }, { text: '犹豫不决，总是想太多', score: 2 }, { text: '经常冲动决定，事后后悔', score: 1 }] },
  { id: 'personality_openness', dimension: 'personality', dimensionLabel: '人格特征', text: '你对新事物的接受程度是？', type: 'single', options: [{ text: '非常开放，喜欢尝鲜，乐于接受变化', score: 5 }, { text: '愿意尝试，但会谨慎评估风险', score: 4 }, { text: '偏向熟悉和稳定，不喜欢太大变化', score: 3 }, { text: '排斥变化，坚守自己的习惯和圈子', score: 2 }, { text: '非常抗拒变化，抗拒一切新事物', score: 1 }] },
  { id: 'personality_team', dimension: 'personality', dimensionLabel: '人格特征', text: '在团队合作中，你通常扮演什么角色？', type: 'single', options: [{ text: '领导者，推动事情进展和决策', score: 5 }, { text: '协调者，平衡各方意见和资源', score: 4 }, { text: '核心执行者，高效完成分配任务', score: 3 }, { text: '默默配合，支持团队不突出自己', score: 2 }, { text: '旁观者，不喜欢参与团队协作', score: 1 }] },
  { id: 'personality_discipline', dimension: 'personality', dimensionLabel: '人格特征', text: '你的自律程度如何？', type: 'single', options: [{ text: '非常自律，有清晰的计划并严格执行', score: 5 }, { text: '比较自律，能坚持大多数习惯', score: 4 }, { text: '有时自律，有时拖延，因事而异', score: 3 }, { text: '比较随性，缺乏自律性', score: 2 }, { text: '完全随心情，没有任何自律可言', score: 1 }] },
  { id: 'personality_reflect', dimension: 'personality', dimensionLabel: '人格特征', text: '你对自己的认知和反思能力如何？', type: 'single', options: [{ text: '经常反思，能清晰认识自己的优缺点', score: 5 }, { text: '偶尔反思，对自己有较清晰的认知', score: 4 }, { text: '很少反思，不太了解自己', score: 3 }, { text: '几乎不反思，走一步看一步', score: 2 }, { text: '从未反思，觉得自己很好', score: 1 }] },

  // ================== 维度4：恋爱风格（5题）====================
  { id: 'love_value', dimension: 'love', dimensionLabel: '恋爱风格', text: '在一段关系中，你最看重什么？', type: 'single', options: [{ text: '相互尊重和独立空间', score: 5 }, { text: '情感支持和陪伴', score: 4 }, { text: '经济基础和生活保障', score: 3 }, { text: '激情和浪漫体验', score: 4 }, { text: '共同的成长和进步', score: 5 }, { text: '价值观和世界观一致', score: 5 }], allowOther: true },
  { id: 'love_express', dimension: 'love', dimensionLabel: '恋爱风格', text: '你表达爱意的方式更偏向？', type: 'single', options: [{ text: '言语表达（说甜言蜜语、写情书）', score: 5 }, { text: '行动表达（做事、陪伴、照顾）', score: 4 }, { text: '礼物表达', score: 3 }, { text: '默默付出，不善于表达', score: 2 }, { text: '身体语言（拥抱、牵手等）', score: 4 }] },
  { id: 'love_receive', dimension: 'love', dimensionLabel: '恋爱风格', text: '你希望对方用什么方式表达爱意？', type: 'single', options: [{ text: '言语表达（说甜言蜜语）', score: 5 }, { text: '行动表达（做事、照顾）', score: 4 }, { text: '送礼物', score: 3 }, { text: '高质量的陪伴', score: 4 }, { text: '身体语言（拥抱等）', score: 4 }] },
  { id: 'love_commit', dimension: 'love', dimensionLabel: '恋爱风格', text: '你对关系的承诺程度是？', type: 'single', options: [{ text: '一旦确定关系，就全力以赴', score: 5 }, { text: '认真对待，但也保持理性', score: 4 }, { text: '享受当下，不急着承诺', score: 3 }, { text: '保持开放，不确定自己想要什么', score: 2 }, { text: '觉得承诺是负担，不想被束缚', score: 1 }] },
  { id: 'love_ritual', dimension: 'love', dimensionLabel: '恋爱风格', text: '你对「仪式感」的看法是？', type: 'single', options: [{ text: '非常重要，特殊日子必须有仪式感', score: 5 }, { text: '适度有即可，不需要过度', score: 4 }, { text: '不太在意，日常陪伴更重要', score: 3 }, { text: '觉得浪费钱，没必要', score: 2 }, { text: '看对方态度，对方想要就有', score: 4 }] },

  // ================== 维度5：价值观（6题）====================
  { id: 'value_marriage', dimension: 'value', dimensionLabel: '价值观', text: '你对婚姻的态度是？', type: 'single', options: [{ text: '一定要结婚，是人生必经之路', score: 5 }, { text: '如果遇到合适的人，愿意结婚', score: 4 }, { text: '不排斥，但觉得不是必需品', score: 3 }, { text: '正在考虑中，不确定', score: 2 }, { text: '决定不婚', score: 1 }] },
  { id: 'value_child', dimension: 'value', dimensionLabel: '价值观', text: '你对生育的态度是？', type: 'single', options: [{ text: '希望有孩子（2个或以上）', score: 5 }, { text: '希望有孩子（1个）', score: 4 }, { text: '顺其自然，不强求', score: 3 }, { text: '不太想要孩子', score: 2 }, { text: '明确不要孩子', score: 1 }] },
  { id: 'value_gender_role', dimension: 'value', dimensionLabel: '价值观', text: '你对家庭分工的看法是？', type: 'single', options: [{ text: '传统分工，男主外女主内', score: 1 }, { text: '平权分工，家务共同承担', score: 5 }, { text: '灵活分工，根据情况协商调整', score: 4 }, { text: '谁收入高谁少做，另一方多承担', score: 3 }, { text: '请家政分担，不亲自动手', score: 4 }] },
  { id: 'value_finance', dimension: 'value', dimensionLabel: '价值观', text: '你对经济「共同财产」的态度是？', type: 'single', options: [{ text: '结婚后完全共享，一起规划管理', score: 5 }, { text: '大件共同，小件各自管理', score: 4 }, { text: '各自管理，有需要再商量', score: 3 }, { text: '完全AA，互不干涉', score: 2 }, { text: '看情况商量', score: 4 }] },
  { id: 'value_city', dimension: 'value', dimensionLabel: '价值观', text: '你对「定居城市」的期望是？', type: 'single', options: [{ text: '一定要在某个特定城市稳定下来', score: 5 }, { text: '可以协商，但需要稳定性', score: 4 }, { text: '愿意为了对方适度漂泊/异地', score: 3 }, { text: '无所谓，到处都可以生活', score: 2 }] },
  { id: 'value_work_family', dimension: 'value', dimensionLabel: '价值观', text: '你认为事业和家庭哪个更重要？', type: 'single', options: [{ text: '家庭永远第一', score: 5 }, { text: '家庭重要，但事业也不能放弃', score: 4 }, { text: '事业重要，家庭需要配合事业', score: 2 }, { text: '现阶段专注事业，家庭以后再说', score: 1 }, { text: '两者同等重要，缺一不可', score: 5 }] },

  // ================== 维度6：沟通偏好（5题）====================
  { id: 'comm_conflict', dimension: 'communicate', dimensionLabel: '沟通偏好', text: '发生争吵时，你通常会？', type: 'single', options: [{ text: '冷静下来再沟通，不说伤人的话', score: 5 }, { text: '当时很想吵，但会克制自己', score: 4 }, { text: '直接吵出来，吵完就翻篇', score: 3 }, { text: '冷战，等对方先道歉', score: 1 }, { text: '摔东西/攻击性行为（非常不好）', score: 0 }] },
  { id: 'comm_frequency', dimension: 'communicate', dimensionLabel: '沟通偏好', text: '你更偏好什么样的沟通频率？', type: 'single', options: [{ text: '每天都要有深度交流', score: 5 }, { text: '每天简单问候，有事再详聊', score: 4 }, { text: '不需要每天联系，有事联系即可', score: 3 }, { text: '联系频率不重要，有默契就行', score: 4 }] },
  { id: 'comm_unhappy', dimension: 'communicate', dimensionLabel: '沟通偏好', text: '当你不开心时，你希望对方怎么做？', type: 'single', options: [{ text: '主动关心，倾听并安慰我', score: 5 }, { text: '给我空间和时间，我自己调整', score: 3 }, { text: '转移注意力，带我去做开心的事', score: 4 }, { text: '陪我沉默，不需要说太多', score: 3 }, { text: '帮我分析问题，提供解决方案', score: 4 }] },
  { id: 'comm_style', dimension: 'communicate', dimensionLabel: '沟通偏好', text: '你更擅长/喜欢哪种沟通方式？', type: 'single', options: [{ text: '当面沟通，能看到表情', score: 5 }, { text: '语音消息，效率高又有温度', score: 4 }, { text: '文字消息，可以思考后回复', score: 3 }, { text: '都行，看情况', score: 4 }] },
  { id: 'comm_listen', dimension: 'communicate', dimensionLabel: '沟通偏好', text: '当对方在倾诉时，你的习惯是？', type: 'single', options: [{ text: '认真倾听，不打断，然后给建议', score: 5 }, { text: '倾听共情，优先安抚情绪', score: 4 }, { text: '倾听，但忍不住想给建议', score: 3 }, { text: '容易走神，或者想尽快结束话题', score: 1 }] },

  // ================== 维度7：兴趣爱好（3题）====================
  { id: 'interest_weekend', dimension: 'interest', dimensionLabel: '兴趣爱好', text: '你周末通常怎么度过？', type: 'single', options: [{ text: '户外活动（运动、旅行、露营、徒步）', score: 5 }, { text: '社交聚会（朋友约饭、活动、派对）', score: 4 }, { text: '宅家休息（追剧、游戏、阅读）', score: 2 }, { text: '自我提升（学习、兼职、加班）', score: 3 }, { text: '做兼职/自由职业赚钱', score: 3 }, { text: '照顾家庭/陪伴父母', score: 3 }] },
  { id: 'interest_count', dimension: 'interest', dimensionLabel: '兴趣爱好', text: '你平时的娱乐爱好数量是？', type: 'single', options: [{ text: '5种以上，广泛涉猎各种活动', score: 5 }, { text: '3-4种，有固定的深度爱好', score: 4 }, { text: '1-2种，深度爱好者', score: 3 }, { text: '没什么特别的爱好', score: 1 }] },
  { id: 'interest_cook', dimension: 'interest', dimensionLabel: '兴趣爱好', text: '你对「一起做饭」这件事的看法是？', type: 'single', options: [{ text: '很期待，这是生活情趣的一部分', score: 5 }, { text: '偶尔可以，但不需要太频繁', score: 4 }, { text: '一个人做效率更高，不想一起', score: 2 }, { text: '不太会做饭，不感兴趣', score: 1 }] },

  // ================== 维度8：关系期望（4题）====================
  { id: 'expect_relation', dimension: 'expect', dimensionLabel: '关系期望', text: '你期望多久确定正式恋爱关系？', type: 'single', options: [{ text: '认识1个月内', score: 5 }, { text: '认识1-3个月', score: 4 }, { text: '认识3-6个月', score: 3 }, { text: '需要更长时间观察', score: 2 }, { text: '不确定，看感觉', score: 4 }] },
  { id: 'expect_distance', dimension: 'expect', dimensionLabel: '关系期望', text: '你对异地恋的态度是？', type: 'single', options: [{ text: '完全不接受，必须同城', score: 5 }, { text: '短期可以（6个月内），长期不行', score: 4 }, { text: '可以接受，看感情基础', score: 3 }, { text: '无所谓，距离不是问题', score: 2 }, { text: '可以接受异地，但最终要同城', score: 4 }] },
  { id: 'expect_meet', dimension: 'expect', dimensionLabel: '关系期望', text: '关系稳定后，你希望多久见一次面？', type: 'single', options: [{ text: '每天都见', score: 5 }, { text: '每周2-3次', score: 4 }, { text: '每周1次', score: 3 }, { text: '每两周一次也可以接受', score: 2 }, { text: '见面频率不重要，有默契就行', score: 3 }] },
  { id: 'expect_marriage_time', dimension: 'expect', dimensionLabel: '关系期望', text: '你对结婚的时间预期是？', type: 'single', options: [{ text: '1年内', score: 5 }, { text: '1-2年', score: 4 }, { text: '2-3年', score: 3 }, { text: '3年以上或不着急', score: 2 }, { text: '还不确定，想先谈着看', score: 3 }] },

  // ================== 维度9：生活习惯（5题）====================
  { id: 'habit_sleep', dimension: 'habit', dimensionLabel: '生活习惯', text: '你的作息习惯是？', type: 'single', options: [{ text: '早睡早起（22:00前睡，6-7点起）', score: 5 }, { text: '正常作息，偶尔晚睡（24:00前）', score: 4 }, { text: '晚睡晚起（00:00-02:00睡，10:00起）', score: 2 }, { text: '不规律，看心情和事情', score: 1 }, { text: '经常熬夜（02:00后睡）', score: 1 }] },
  { id: 'habit_clean', dimension: 'habit', dimensionLabel: '生活习惯', text: '你对居住环境整洁度的要求是？', type: 'single', options: [{ text: '非常高，不能忍受脏乱，有洁癖', score: 5 }, { text: '比较在意，会定期整理打扫', score: 4 }, { text: '差不多就行，不追求完美', score: 3 }, { text: '比较随意，乱一点更舒服自在', score: 2 }, { text: '完全不在意，脏乱无所谓', score: 1 }] },
  { id: 'habit_smoke', dimension: 'habit', dimensionLabel: '生活习惯', text: '你是否有抽烟/饮酒习惯？', type: 'single', options: [{ text: '两者都不沾', score: 5 }, { text: '偶尔社交场合喝酒，不抽烟', score: 4 }, { text: '经常喝酒，不抽烟', score: 2 }, { text: '偶尔抽烟，不喝酒', score: 2 }, { text: '抽烟或经常饮酒', score: 1 }] },
  { id: 'habit_pet', dimension: 'habit', dimensionLabel: '生活习惯', text: '你对宠物/养动物的态度是？', type: 'single', options: [{ text: '非常喜欢，希望家里有猫/狗', score: 5 }, { text: '喜欢，但不想自己养', score: 4 }, { text: '一般，无感', score: 3 }, { text: '不喜欢，受不了', score: 1 }] },
  { id: 'habit_spend', dimension: 'habit', dimensionLabel: '生活习惯', text: '你每月消费占收入的比例大约是？', type: 'single', options: [{ text: '30%以下（储蓄型，存钱为主）', score: 5 }, { text: '30-50%（平衡型，收支平衡）', score: 4 }, { text: '50-70%（消费型，偶尔月光）', score: 3 }, { text: '70-90%（月欠族，经常超支）', score: 2 }, { text: '90%以上（严重超支，靠借贷）', score: 1 }] },
];

// 维度信息
export const dimensions = [
  { id: 'basic', label: '基础信息', emoji: '📋', color: '#6366f1', desc: '人口统计基础数据' },
  { id: 'family', label: '家庭情况', emoji: '👨‍👩‍👧', color: '#8b5cf6', desc: '原生家庭的影响' },
  { id: 'personality', label: '人格特征', emoji: '🧠', color: '#ec4899', desc: '大五人格与情商' },
  { id: 'love', label: '恋爱风格', emoji: '💕', color: '#f43f5e', desc: '依恋类型与表达方式' },
  { id: 'value', label: '价值观', emoji: '⚖️', color: '#f97316', desc: '婚姻、经济、生育观念' },
  { id: 'communicate', label: '沟通偏好', emoji: '💬', color: '#14b8a6', desc: '表达与冲突处理' },
  { id: 'interest', label: '兴趣爱好', emoji: '🎨', color: '#06b6d4', desc: '生活方式与业余爱好' },
  { id: 'expect', label: '关系期望', emoji: '🎯', color: '#84cc16', desc: '目的、节奏与承诺' },
  { id: 'habit', label: '生活习惯', emoji: '🌿', color: '#10b981', desc: '作息、消费与日常' },
];

// ============================================================
// 计算维度得分
// ============================================================
function getDimensionScore(answers: AssessmentData, dimensionId: string): number {
  const qs = assessmentQuestions.filter(q => q.dimension === dimensionId);
  if (qs.length === 0) return 50;
  let total = 0, count = 0;
  qs.forEach(q => {
    const score = answers[q.id];
    if (typeof score === 'number' && score > 0) {
      total += score;
      count++;
    }
  });
  return count > 0 ? Math.round((total / count / 5) * 100) : 50;
}

interface DimensionMatch {
  dimensionId: string;
  label: string;
  emoji: string;
  color: string;
  userScore: number;
  targetScore: number;
  diff: number;
  matchLevel: 'high' | 'medium' | 'low';
  analysis: string;
}

// ============================================================
// 模拟用户答案
// ============================================================
export function generateRandomAnswers(seed: number = 42): AssessmentData {
  const answers: AssessmentData = {};
  assessmentQuestions.forEach((q, i) => {
    if (q.type === 'date') {
      answers[q.id] = '1998-06-15';
    } else if (q.options && q.options.length > 0) {
      const idx = Math.floor(((seed * 9301 + i * 49297) % 233280) / 233280 * q.options.length);
      answers[q.id] = q.options[Math.min(idx, q.options.length - 1)].score;
    }
  });
  return answers;
}

export const demoUserAnswers: AssessmentData = generateRandomAnswers(42);
export const demoTargetAnswers: AssessmentData = generateRandomAnswers(88);

// 手动微调让数据更合理
Object.assign(demoUserAnswers, {
  basic_birthday: '1998-03-15',
  basic_gender: 2,
  basic_education: 4,
  basic_income: 3,
  basic_city: 5,
});
Object.assign(demoTargetAnswers, {
  basic_birthday: '1996-08-20',
  basic_gender: 1,
  basic_education: 4,
  basic_income: 4,
  basic_city: 5,
});

// ============================================================
// 瀑布流用户数据（带3张照片）
// ============================================================
const photoSeeds = [
  ['Sarah', 'Linda', 'Jasmine'],
  ['Tony', 'Lucas', 'Nathan'],
  ['Emma', 'Olivia', 'Ava'],
  ['Michael', 'James', 'Daniel'],
  ['Sophie', 'Mia', 'Charlotte'],
  ['David', 'Alex', 'Ryan'],
];

const bgColors = ['ffd5dc', 'c0aede', 'b6e3f4', 'd1d4f9', 'ffdfbf', 'c1e1c1'];

function generateUserPhotos(seed: string, gender: number) {
  const photos: string[] = [];
  const seedList = photoSeeds[Math.abs(seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % photoSeeds.length];
  for (let i = 0; i < 3; i++) {
    const color = bgColors[Math.abs(seed.charCodeAt(i % seed.length) * (i + 1)) % bgColors.length];
    photos.push(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seedList[i]}&backgroundColor=${color}`);
  }
  return photos;
}



// 根据大五人格推断维度分数
function _estDim(personality, attachment) {
  const t = {};
  personality.forEach(p => { t[p.name] = p.value || 50; });
  const e = t['外向性']||50, a = t['宜人性']||60, o = t['开放性']||60, n = t['神经质']||40, c = t['尽责性']||60;
  return {
    basic: Math.round((a+50)/2),
    family: Math.round(a*0.9+10),
    personality: Math.round((e+a+(100-n))/3),
    love: Math.round(a*0.8+20),
    value: Math.round(o*0.7+30),
    communicate: Math.round((100-n+a)/2),
    interest: Math.round(o*0.6+30),
    expect: Math.round((100-n+a)/2),
    habit: Math.round(c*0.7+20),
  };
}

export interface WaterfallUser {
  id: string;
  name: string;
  age: number;
  photos: string[];
  occupation: string;
  location: string;
  bio: string;
  matchScore: number;
  tags: string[];
  online: boolean;
  verified: boolean;
  lastActive: string;
  education: string;
}

const occupations = ['前端开发工程师', '产品经理', 'UI设计师', '数据分析师', '品牌策划', '律师', '医生', '教师', '金融分析师', '新媒体运营', '摄影师', '建筑师', '心理咨询师', '营销总监', 'HRBP'];
const bios = [
  '喜欢探索新事物，周末常去市集和艺术展',
  '互联网人，周末喜欢运动和摄影',
  '吃货一枚，爱探店，也爱在家研究美食',
  '旅行博主，去过20多个国家',
  '猫奴+咖啡爱好者，工作之余享受生活',
  '安静看书，偶尔户外徒步',
  '社交达人，周末从不缺活动',
];
const tagPools = ['互联网', '射手座', 'ENFP', '喜欢做饭', '猫奴', '旅行', '摄影', '健身', '阅读', '电影', '咖啡', '音乐', '户外', '艺术'];

export const waterfallUsers: WaterfallUser[] = Array.from({ length: 20 }, (_, i) => {
  const gender = i % 2 === 0 ? 2 : 1;
  const seed = `user${i + 10}`;
  const tagCount = 3 + (i % 3);
  const shuffledTags = [...tagPools].sort(() => Math.random() - 0.5).slice(0, tagCount);
  return {
    id: `waterfall-${i}`,
    name: ['林小晴', '陈思远', '王雨晴', '李浩然', '张诗涵', '刘子轩', '周明远', '吴思琪', '郑雨桐', '孙浩然', '林诗涵', '黄子轩', '徐小雅', '马思远', '朱雨晴', '胡浩然', '林诗琪', '高子轩', '唐小晴', '谢思远'][i],
    age: 22 + (i %14),
    photos: generateUserPhotos(seed, gender),
    occupation: occupations[i % occupations.length],
    location: ['北京', '上海', '深圳', '杭州', '广州', '成都'][i % 6],
    bio: bios[i % bios.length],
    matchScore: 55 + Math.floor(Math.random() * 35),
    tags: shuffledTags,
    online: Math.random() > 0.4,
    verified: Math.random() > 0.5,
    lastActive: ['刚刚', '10分钟前', '30分钟前', '2小时前', '昨天', '3天前'][Math.floor(Math.random() * 5)],
    education: ['本科', '硕士', '博士', '大专'][i % 4],
  };
});

// ============================================================
// 匹配分析（简化版）
// ============================================================
interface MatchAnalysis {
  dimensionMatches: DimensionMatch[];
  overallScore: number;
  matchLevel: string;
}

function buildAnalysis(dimId: string, scoreA: number, scoreB: number): string {
  const diff = Math.abs(scoreA - scoreB);
  const analyses: Record<string, string> = {
    basic: diff < 20 ? '基础条件接近，在生活节奏和人生阶段上较为同步。相处时不会因客观条件产生太大摩擦，是建立在相似背景上的关系。' : diff < 35 ? '基础条件存在一定差异，生活方式可能需要一些磨合。但差异不等于不合适，反而可能带来新鲜感。' : '基础条件差异较明显，可能在生活节奏、职业阶段等方面产生分歧。建议坦诚沟通彼此的现实考量，找到双方都能接受的平衡点。',
    family: diff < 20 ? '家庭观念高度一致，对父母角色、子女教育、家庭与个人边界等问题有相近的看法。在"家庭"这件事上不太会产生根本性冲突。' : diff < 35 ? '对家庭的期待大体一致，但在某些细节上可能有不同侧重——比如和父母的关系距离、节假日分配等，需要提前沟通。' : '家庭观念差异较大，在婚育计划、与长辈关系等问题上可能存在根本分歧。需要认真讨论彼此对"家"的定义。',
    personality: diff < 20 ? '人格特质非常相似，思维模式、情绪反应、对世界的看法都比较接近。沟通成本很低，很多事情不用说就知道。挑战是需要有意识地创造差异带来的新鲜感。' : diff < 35 ? '人格各有特点，能够形成互补。一个偏理性一个偏感性，一个倾向计划一个倾向随性。长期来看是关系的宝贵资产。' : '人格差异明显，处理问题、应对压力、表达情感的方式会有很大不同。需要双方都有较强的包容力和沟通意愿。',
    love: diff < 20 ? '恋爱风格高度匹配，对"亲密关系应该是什么样的"有相同的理解。在表达和接收爱意、处理矛盾等核心议题上是同一种语言，相处会很舒服。' : diff < 35 ? '恋爱风格基本一致，但在某些时刻可能有不同需求——比如一方需要更多陪伴。需要定期做"关系校准"确认期待同步。' : '恋爱风格差异明显，最容易产生"莫名其妙不舒服"感觉的来源。需要主动讨论彼此的边界。',
    value: diff < 20 ? '价值观高度一致，金钱观、消费习惯、生活优先级等核心议题看法相近。重大决定上不太会产生激烈冲突，是关系稳定的基石。' : diff < 35 ? '价值观大体一致，在某些领域可能有分歧——比如一方愿意为体验花钱，另一方更倾向储蓄。需要在大额支出、共同财务规划时提前商量。' : '价值观存在明显分歧，往往不是表面让步能解决的。可能在未来反复爆发，需要找到双方真正认可的"共同价值观"。',
    communicate: diff < 20 ? '沟通风格非常合拍，表达方式、倾听习惯、冲突时的反应模式都很接近。一方开口另一方能准确理解，是关系中非常宝贵的默契。' : diff < 35 ? '沟通风格基本一致，但可能在某些情绪状态下有差异。建议约定一个"暂停信号"，让双方在情绪激动时有一个共同的缓冲机制。' : '沟通风格差异明显，可能是最大的隐患来源。一方习惯直接表达，另一方习惯委婉暗示。最容易产生"我觉得他不在乎我"的误解。',
    interest: diff < 20 ? '兴趣爱好有很多共同点，生活重叠度很高，能够轻松地一起度过空闲时间。是关系的"甜蜜剂"，能在平淡日子里创造共同记忆。' : diff < 35 ? '有一些共同爱好，也有各自独立的兴趣圈。这是理想状态——既能一起享受时光，也有各自独立的空间。' : '兴趣爱好重合度较低，需要更多主动创造共同体验的意愿。建议有意识地培养一个共同爱好。',
    expect: diff < 20 ? '关系期望完全同步，对关系的节奏、目标、里程碑有相同的认知。这是长期关系最重要的基础。' : diff < 35 ? '关系期望基本同步，但在某些节奏上可能有差异。不要假设对方知道你的期待，主动表达、主动确认。' : '关系节奏预期差异较大，如果一方想结婚、另一方还没准备好，差距不会随时间自动消失，只会在等待中积累成怨气。',
    habit: diff < 20 ? '生活习惯高度同步，作息、饮食、生活整洁度等日常细节很合拍。住在一起时不会因为"你为什么不洗碗"这种事产生摩擦。' : diff < 35 ? '生活习惯基本适应，但在某些细节上可能需要磨合。同居初期可能会有"原来你是这样的人"的小震惊，通常可以协调。' : '生活习惯差异明显，可能是同居后最常被抱怨的来源。建议在同居前做一些"生活习惯预演"。',
  };
  return analyses[dimId] || '该维度双方存在一定差异，需要在相处中多沟通了解彼此。';
}

function calculateMatches(answersA: AssessmentData, answersB: AssessmentData): DimensionMatch[] {
  return dimensions.map(dim => {
    const scoreA = getDimensionScore(answersA, dim.id);
    const scoreB = getDimensionScore(answersB, dim.id);
    const diff = Math.abs(scoreA - scoreB);
    const matchLevel = diff < 20 ? 'high' : diff < 35 ? 'medium' : 'low';
    return {
      dimensionId: dim.id,
      label: dim.label,
      emoji: dim.emoji,
      color: dim.color,
      userScore: scoreA,
      targetScore: scoreB,
      diff,
      matchLevel,
      analysis: buildAnalysis(dim.id, scoreA, scoreB),
    };
  });
}

export function generateMatchAnalysis(answersA: AssessmentData, answersB: AssessmentData): MatchAnalysis {
  const matches = calculateMatches(answersA, answersB);
  const avg = matches.reduce((sum, m) => sum + (m.matchLevel === 'high' ? 100 : m.matchLevel === 'medium' ? 65 : 30), 0) / matches.length;
  const overallScore = Math.round(avg);
  const matchLevel = overallScore >= 80 ? '灵魂伴侣' : overallScore >= 65 ? '较好匹配' : overallScore >= 50 ? '需要磨合' : '差异较大';
  return { dimensionMatches: matches, overallScore, matchLevel };
}

export const demoMatchAnalysis = generateMatchAnalysis(demoUserAnswers, demoTargetAnswers);

// ============================================================
// Demo用户
// ============================================================
export const demoUserA: UserProfile = {
  id: 'user-a', name: '林小晴',
  avatar: 'https://i.pravatar.cc/300?img=47',
  gender: 'female', age: 26, occupation: '产品经理', location: '北京',
  bio: '喜欢探索新事物，周末常去市集和展览。理想中的关系是彼此独立又相互支持。',
  personality: [
    { name: '外向性', value: 72, category: 'big5', emoji: '🔵' },
    { name: '宜人性', value: 85, category: 'big5', emoji: '💚' },
    { name: '尽责性', value: 68, category: 'big5', emoji: '🟡' },
    { name: '开放性', value: 90, category: 'big5', emoji: '🟣' },
    { name: '神经质', value: 35, category: 'big5', emoji: '🔴' },
  ],
  attachment: '安全型', communicationStyle: '直接坦诚型', relationshipExpectation: '中长期稳定关系',
  interests: ['旅行', '展览', '摄影'], dealBreakers: ['欺骗', '冷暴力'], createdAt: new Date().toISOString(),
};

export const demoUserB: UserProfile = {
  id: 'user-b', name: '陈思远',
  avatar: 'https://i.pravatar.cc/300?img=13',
  gender: 'male', age: 28, occupation: '独立摄影师', location: '北京',
  bio: '自由职业者，热爱旅行和街头摄影。希望找到能一起看世界的人。',
  personality: [
    { name: '外向性', value: 65, category: 'big5', emoji: '🔵' },
    { name: '宜人性', value: 78, category: 'big5', emoji: '💚' },
    { name: '尽责性', value: 55, category: 'big5', emoji: '🟡' },
    { name: '开放性', value: 95, category: 'big5', emoji: '🟣' },
    { name: '神经质', value: 28, category: 'big5', emoji: '🔴' },
  ],
  attachment: '安全型', communicationStyle: '感性与理性交替型', relationshipExpectation: '认真交往，以结婚为目标',
  interests: ['摄影', '旅行', '咖啡'], dealBreakers: ['没有上进心', '控制欲强'], createdAt: new Date().toISOString(),
};

  // 为每个mock用户附加维度分数（用于瀑布流真实匹配算法）
waterfallUsers.forEach(u => {
  (u as any).dimensionScores = _estDim(u.personality || [], u.attachment || '安全型');
});
// 聊天记录
export interface ChatItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  matchScore: number;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

export const mockChatList: ChatItem[] = [
  { id: 'chat-1', userId: 'waterfall-0', userName: '林小雨', userAvatar: waterfallUsers[0].photos[0], matchScore: 85, lastMessage: '好的，那我们周六见！', lastTime: '今天 14:30', unread: 2, online: true },
  { id: 'chat-2', userId: 'waterfall-2', userName: '王雨晴', userAvatar: waterfallUsers[2].photos[0], matchScore: 78, lastMessage: '那家咖啡店真的很不错', lastTime: '昨天 20:15', unread: 0, online: false },
  { id: 'chat-3', userId: 'waterfall-4', userName: '张诗涵', userAvatar: waterfallUsers[4].photos[0], matchScore: 72, lastMessage: '周末去爬山吗？', lastTime: '昨天 11:30', unread: 1, online: true },
];
