# 关于 mp3 文件信息

## 标签帧
每个标签帧都有一个 10 个字节的帧头和至少一个字节的不固定长度的内容组成。 它们也是顺序存放在文件中,和标签头和其他的标签帧也没有特殊的字符分隔。得到一个完整的帧的内容只有从帧头中的到内容大小后才能读出,读取时要注意大小,不要将其他帧的内容或帧头读入。

```
typedef ID3_FRAME {
    uint8_t frame_id[4];
    uint32_t frame_size;
    uint16_t frame_flags;
} ID3_FRAME_t;
```

各个字段的详细含义如下：
- frame_id[4]。用四个字符标识一个帧,描述其内容,常用的标识有：

　　TIT2 = 标题 表示内容为这首歌的标题,下同
　　TPE1 = 作者
　　TALB = 专集
　　TRCK = 音轨 格式:N/M 其中 N 为专集中的第 N 首,M 为专集中共 M 首,N 和 M 为 ASCII 码表示的数字
　　TYER = 年代 是用 ASCII 码表示的数字
　　TCON = 类型 直接用字符串表示
　　COMM = 备注 格式:"eng/0 备注内容",其中 eng 表示备注所使用的自然语言

## 参考资料
- https://www.cnblogs.com/yongdaimi/p/14990902.html
- https://www.cnblogs.com/MikeZhang/p/mutagen20221024.html
- https://www.cnblogs.com/HelloCodeWrold/p/12967990.html