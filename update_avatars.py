import random, re

avatars_male = ["https://i.pravatar.cc/300?img=11","https://i.pravatar.cc/300?img=12","https://i.pravatar.cc/300?img=13","https://i.pravatar.cc/300?img=14","https://i.pravatar.cc/300?img=15","https://i.pravatar.cc/300?img=16","https://i.pravatar.cc/300?img=17","https://i.pravatar.cc/300?img=18","https://i.pravatar.cc/300?img=19","https://i.pravatar.cc/300?img=20","https://i.pravatar.cc/300?img=21","https://i.pravatar.cc/300?img=22","https://i.pravatar.cc/300?img=23","https://i.pravatar.cc/300?img=24","https://i.pravatar.cc/300?img=25"]
avatars_female = ["https://i.pravatar.cc/300?img=41","https://i.pravatar.cc/300?img=44","https://i.pravatar.cc/300?img=47","https://i.pravatar.cc/300?img=48","https://i.pravatar.cc/300?img=49","https://i.pravatar.cc/300?img=51","https://i.pravatar.cc/300?img=53","https://i.pravatar.cc/300?img=54","https://i.pravatar.cc/300?img=55","https://i.pravatar.cc/300?img=56","https://i.pravatar.cc/300?img=57","https://i.pravatar.cc/300?img=58","https://i.pravatar.cc/300?img=59","https://i.pravatar.cc/300?img=60","https://i.pravatar.cc/300?img=61"]

def pick_male(): return random.choice(avatars_male)
def pick_female(): return random.choice(avatars_female)

with open('/workspace/cihe-v2/src/data/mockData.ts', 'r') as f:
    content = f.read()

# Replace demoUserA and demoUserB avatars
content = content.replace(
    "avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4'",
    "avatar: 'https://i.pravatar.cc/300?img=47'"
)
content = content.replace(
    "avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=c0aede'",
    "avatar: 'https://i.pravatar.cc/300?img=13'"
)

# Replace waterfall user avatar generation - update the generateWaterfallUser function
old_fn = '''const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=${bgColors[Math.floor(Math.random() * bgColors.length)]}`'''
new_fn = '''const gender = Math.random() > 0.5 ? 'male' : 'female';
  const avatarPool = gender === 'male' ? avatars_male : avatars_female;
  const avatar = avatarPool[Math.floor(Math.random() * avatarPool.length)];'''
content = content.replace(old_fn, new_fn)

# Add avatar pools near top of file (after imports)
old_import = "import { waterfallUsers, WaterfallUser, demoUserAnswers, demoTargetAnswers, demoMatchAnalysis, demoUserA, demoUserB, dimensions, generateMatchAnalysis, generateMatchSession, recommendedUsers } from './mockData';"
new_import = """import { waterfallUsers, WaterfallUser, demoUserAnswers, demoTargetAnswers, demoMatchAnalysis, demoUserA, demoUserB, dimensions, generateMatchAnalysis, generateMatchSession, recommendedUsers } from './mockData';

const avatars_male = ["https://i.pravatar.cc/300?img=11","https://i.pravatar.cc/300?img=12","https://i.pravatar.cc/300?img=13","https://i.pravatar.cc/300?img=14","https://i.pravatar.cc/300?img=15","https://i.pravatar.cc/300?img=16","https://i.pravatar.cc/300?img=17","https://i.pravatar.cc/300?img=18","https://i.pravatar.cc/300?img=19","https://i.pravatar.cc/300?img=20","https://i.pravatar.cc/300?img=21","https://i.pravatar.cc/300?img=22","https://i.pravatar.cc/300?img=23","https://i.pravatar.cc/300?img=24","https://i.pravatar.cc/300?img=25"];
const avatars_female = ["https://i.pravatar.cc/300?img=41","https://i.pravatar.cc/300?img=44","https://i.pravatar.cc/300?img=47","https://i.pravatar.cc/300?img=48","https://i.pravatar.cc/300?img=49","https://i.pravatar.cc/300?img=51","https://i.pravatar.cc/300?img=53","https://i.pravatar.cc/300?img=54","https://i.pravatar.cc/300?img=55","https://i.pravatar.cc/300?img=56","https://i.pravatar.cc/300?img=57","https://i.pravatar.cc/300?img=58","https://i.pravatar.cc/300?img=59","https://i.pravatar.cc/300?img=60","https://i.pravatar.cc/300?img=61"];"""
content = content.replace(old_import, new_import)

with open('/workspace/cihe-v2/src/data/mockData.ts', 'w') as f:
    f.write(content)
print("mockData updated")
