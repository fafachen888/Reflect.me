/**

前端匹配算法（余弦相似度 + 维度权重）

权重配置：
value(价值观)=18%  communicate(沟通)=16%  personality(人格)=16%
love(恋爱)=14%  family(家庭)=12%  expect(期望)=10%
basic(基础)=8%  habit(习惯)=4%  interest(兴趣)=2%
*/

const DIM_WEIGHTS: Record<string, number> = {
  value: 0.18, communicate: 0.16, personality: 0.16,
  love: 0.14, family: 0.12, expect: 0.10,
  basic: 0.08, habit: 0.04, interest: 0.02,
};

const DIM_ORDER = ['basic', 'family', 'personality', 'love', 'value', 'communicate', 'interest', 'expect', 'habit'];

export function cosineSim(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; magA += a[i] * a[i]; magB += b[i] * b[i]; }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function parseVector(scores: Record<string, number>): number[] {
  return DIM_ORDER.map(d => Math.min(100, Math.max(0, scores?.[d] || 50)));
}

export function computeMatch(
  userScores: Record<string, number>,
  targetScores: Record<string, number>,
  userAge = 26,
  targetAge = 26
): number {
  const vecA = parseVector(userScores);
  const vecB = parseVector(targetScores);
  const cosine = cosineSim(vecA, vecB);
  let weightedDiff = 0;
  for (const dim of DIM_ORDER) {
    const idx = DIM_ORDER.indexOf(dim);
    const w = DIM_WEIGHTS[dim] || 0.1;
    weightedDiff += w * Math.abs(vecA[idx] - vecB[idx]) / 100;
  }
  let score = Math.round(cosine * 60 + (1 - weightedDiff) * 40);
  const ageDiff = Math.abs(userAge - targetAge);
  if (ageDiff > 5) score -= (ageDiff - 5) * 1;
  return Math.min(98, Math.max(38, score));
}

export function computeMatchLevel(score: number): string {
  if (score >= 82) return '灵魂伴侣';
  if (score >= 68) return '较好匹配';
  if (score >= 55) return '需要磨合';
  return '差异较大';
}
