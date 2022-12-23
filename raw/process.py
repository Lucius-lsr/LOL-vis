import json

def colorMap(area):
    fill, stroke = '#111111', '#FFFFFF'
    if area == "以绪塔尔":
        fill, stroke = '#FF00FF', '#FFFF00'  # Red # Yellow
    elif area == "巨神峰":
        fill, stroke = '#FFA500', '#800080'
    elif area == "弗雷尔卓德":
        fill, stroke = '#FFFF00', '#008000'
    elif area == "德玛西亚":
        fill, stroke = '#008000', '#0000FF'
    elif area == "恕瑞玛":
        fill, stroke = '#FF0000', '#FFC0CB'
    elif area == "暗影岛":
        fill, stroke = '#A040A0', '#FF0000'
    elif area == "比尔吉沃特":
        fill, stroke = '#FFC0CB', '#FFA500'
    elif area == "班德尔城":
        fill, stroke = '#FF00FF', '#FFFF00'
    elif area == "皮尔特沃夫":
        fill, stroke = '#008080', '#008000'
    elif area == "祖安":
        fill, stroke = '#40E0D0', '#0000FF'
    elif area == "艾欧尼亚":
        fill, stroke = '#C6C6FA', '#800080'
    elif area == "虚空之地":
        fill, stroke = '#FF7F50', '#FF0000'
    elif area == "诺克萨斯":
        fill, stroke = '#ADD8E6', '#006400'
    return {'fill': fill, 'stroke':'#FFFFFF'}

# Open the JSON file
with open('hero_meta.json', 'r') as f:
  # Load the contents of the file into a variable
  data = json.load(f)

res = {'nodes':[], 'edges':[]}
for hero in data:
    res['nodes'].append({
    'id':hero['zh_name'],
    'label':hero['zh_name'],
    'details':hero,
    'style': colorMap(hero['相关地区']),
    'labelCfg': {
          'style': {
            'fontSize': 8,
            'fill': 'white',
          }
    },

      })
for hero in data:
    for rela in hero['relative_heros']:
        res['edges'].append({'source':hero['zh_name'], 'target':rela['zh_name']})

with open('../public/relations.json', 'w') as outfile:
  # Write the dictionary to the file in JSON format
  json.dump(res, outfile)
