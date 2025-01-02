#/usr/local/bin/python3
import mutagen
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, TDRC, TYER
audio = mutagen.File(r"../localdata/再见深海.mp3")

# 经过尝试，有时候要先删除旧的才能写入新的
# audio.delete()
# 标题
# audio.tags.add(TIT2(encoding=1, text=['消愁']))
# 作者
# audio.tags.add(TPE1(encoding=1, text=['毛不易']))
# 专辑
# audio.tags.add(TALB(encoding=1, text=['《平凡的一天》']))
# 时间
# audio.tags.add(TDRC(encoding=1, text=['2018-05-31']))
# audio.save()
# 这个可以打印出字段的原始编码
print(audio.values())
# print(audio.tags.pprint())
# print(audio.pprint().split('\n'))
# audio.save()