/**
 * 场景数据 - 前端离线版本（与后端 SCENARIOS 保持同步）
 */
export const SCENARIOS = [
  { id: 'first_date', category: '日常相处', name: '第一次约会', emoji: '☕', background: '两人在咖啡馆里第一次见面，这是他们线上聊了几周后的第一次线下见面。都有些紧张，都在揣摩对方在现实中是什么样的人。', tone: '紧张、期待、小心翼翼', focusDimensions: ['communication', 'social', 'lifestyle'], weight: 10 },
  { id: 'daily_greeting', category: '日常相处', name: '早晨问候', emoji: '🌅', background: '两人已经在一起一段时间了。这是某个普通工作日的早晨，各自准备出门上班，发一条简短的早安消息。', tone: '温馨、日常、自然', focusDimensions: ['communication', 'emotion', 'lifestyle'], weight: 8 },
  { id: 'weekend_plan', category: '日常相处', name: '周末安排', emoji: '🗓️', background: '周五晚上，两人在讨论周末想做什么。两个人的兴趣和作息习惯有些不同，需要协商。', tone: '轻松、略带分歧、温馨', focusDimensions: ['lifestyle', 'communication', 'relationship'], weight: 7 },
  { id: 'late_night_chat', category: '日常相处', name: '深夜聊天', emoji: '🌙', background: '某个深夜，两人睡不着，开始聊一些平时不太会聊的话题——过去的感情经历、对未来的想象。', tone: '亲密、脆弱、深度', focusDimensions: ['emotion', 'relationship', 'family'], weight: 9 },
  { id: 'cooking_together', category: '日常相处', name: '一起做饭', emoji: '🍳', background: '周末两人决定一起在家做饭。这是第一次一起下厨，过程中充满了配合和磨合。', tone: '欢乐、混乱、温馨', focusDimensions: ['lifestyle', 'communication', 'family'], weight: 6 },
  { id: 'first_fight', category: '冲突磨合', name: '第一次吵架', emoji: '💥', background: '两人因为一件小事起了争执，这是他们在一起后的第一次正式吵架。沟通风格的差异在冲突中被放大。', tone: '紧张、对抗、情绪化', focusDimensions: ['communication', 'emotion', 'conflict_style'], weight: 10 },
  { id: 'cold_war', category: '冲突磨合', name: '冷战', emoji: '🥶', background: '上次吵架后进入冷战状态。一方向，另一方还在气头上。', tone: '压抑、煎熬、纠结', focusDimensions: ['communication', 'emotion', 'attachment'], weight: 9 },
  { id: 'jealousy', category: '冲突磨合', name: '吃醋了', emoji: '😡', background: '一方发现另一方和其他异性的互动比较频繁，感到嫉妒或不安。', tone: '试探、质问、委屈', focusDimensions: ['emotion', 'relationship', 'communication'], weight: 8 },
  { id: 'different_expectations', category: '冲突磨合', name: '期望落差', emoji: '😔', background: '一方觉得关系发展得太快，另一方觉得进展太慢。节奏的不一致开始显现。', tone: '困惑、委屈、无奈', focusDimensions: ['relationship', 'communication', 'expectation'], weight: 9 },
  { id: 'money_dispute', category: '冲突磨合', name: '消费分歧', emoji: '💰', background: '两人在花钱这件事上有不同的观念。一方觉得该花就花，另一方觉得要存钱。', tone: '理性对抗、无奈、妥协', focusDimensions: ['values', 'lifestyle', 'communication'], weight: 7 },
  { id: 'birthday', category: '关键时刻', name: '生日惊喜', emoji: '🎂', background: '其中一方的生日到了。另一方精心准备了惊喜，但过程中发生了一些小意外。', tone: '期待、惊喜、感动', focusDimensions: ['emotion', 'relationship', 'communication'], weight: 8 },
  { id: 'meeting_parents', category: '关键时刻', name: '见家长', emoji: '👨‍👩‍👧', background: '两人决定正式带对方去见自己的父母。这是一个重要的关系节点，带来了额外的压力。', tone: '紧张、忐忑、重要', focusDimensions: ['family', 'relationship', 'social'], weight: 9 },
  { id: 'long_distance', category: '关键时刻', name: '异地思念', emoji: '✈️', background: '两人因为工作原因开始异地。每天只能通过手机联系。距离开始考验感情。', tone: '思念、不安、坚定', focusDimensions: ['emotion', 'attachment', 'communication'], weight: 9 },
  { id: 'sick_care', category: '关键时刻', name: '生病照顾', emoji: '🤒', background: '一方生病了，另一方来照顾。生病时人的情绪会变得脆弱，依赖感会增强。', tone: '感动、温馨、心疼', focusDimensions: ['emotion', 'family', 'communication'], weight: 7 },
  { id: 'career_change', category: '关键时刻', name: '职业转折', emoji: '💼', background: '一方拿到了一个很好的工作机会，但需要搬到另一个城市。这是对关系的重大考验。', tone: '纠结、现实、深思熟虑', focusDimensions: ['values', 'family', 'relationship', 'communication'], weight: 10 },
  { id: 'talk_about_past', category: '深度探索', name: '谈论过去', emoji: '📖', background: '两人开始聊彼此的过去——前任、失败的经历、内心深处的遗憾。这是一个需要信任才能聊的话题。', tone: '脆弱、信任、深化', focusDimensions: ['emotion', 'family', 'attachment'], weight: 8 },
  { id: 'future_together', category: '深度探索', name: '畅想未来', emoji: '🔮', background: '深夜，两人躺在床上聊"以后"。聊想象中的未来生活、理想中的相处模式、对家庭的期待。', tone: '浪漫、期待、深入', focusDimensions: ['family', 'relationship', 'expectation'], weight: 10 },
  { id: 'friend_gathering', category: '深度探索', name: '朋友聚会', emoji: '🎉', background: '一方邀请另一方参加自己朋友的小聚会。这是对方的社交圈第一次见到"另一半"。', tone: '紧张、展示、自然', focusDimensions: ['social', 'communication', 'lifestyle'], weight: 7 },
  { id: 'video_call', category: '深度探索', name: '视频通话', emoji: '📱', background: '异地期间的一次视频通话。两人都有些疲惫，但仍然想听听对方的声音。', tone: '疲惫、想念、温暖', focusDimensions: ['communication', 'emotion', 'attachment'], weight: 6 },
  { id: 'proposal_mind', category: '深度探索', name: '求婚念头', emoji: '💍', background: '其中一方突然有了一个强烈的念头——是不是该结婚了？但还不敢说出来。', tone: '心跳、纠结、勇气', focusDimensions: ['relationship', 'expectation', 'emotion'], weight: 10 },
];
