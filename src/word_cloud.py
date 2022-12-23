import wordcloud
import jieba
import json


if __name__ == "__main__":
    # load stopwords
    with open("../raw/stopwords-zh.txt",'r',encoding='utf-8') as f:
        lines = f.readlines()
        stop_words = [line.strip() for line in lines]
    # load hero stories
    with open("../raw/hero_story.json",'r',encoding='utf-8') as f:
        hero_stories = json.load(f)
    # build wordclound generator
    wc = wordcloud.WordCloud(font_path="msyh.ttc",
                            width = 1000,
                            height = 700,
                            background_color='white',
                            max_words=50)
    # add hero names and regions to word vocabulary
    with open("../raw/hero_meta.json",'r',encoding='utf-8') as f:
        hero_meta = json.load(f)
        for hero in hero_meta:
            jieba.add_word(hero['zh_name'])
            jieba.add_word(hero["称号"])
            jieba.add_word(hero["相关地区"])
    
    # tokenize and generate wordcloud
    for hero in hero_stories:
        zh_name = hero['zh_name']
        en_name = hero['en_name']
        story = hero['story']
        if hero["color_story"] != "":
            story += hero['color_story']
        word_list = jieba.lcut(story)
        word_list = filter(lambda x: x not in stop_words and len(x) > 1 and x!=zh_name,word_list) 
        text = ' '.join(word_list)
        wc.generate(text)
        wc.to_file("../public/imgs/%s_%s.png" %(en_name,zh_name)) 