---
title: m1 맥에서 konlpy 쓰기
date: 2021-11-03 11:33:00 +09:00
categories:
  - Notes
tags:
  - nlp
math: true
toc: true
comments: true
---
에러:
```other
OSError: [Errno 0] JVM DLL not found: /Library/Java/JavaVirtualMachines/jdk-15.0.2.jdk/Contents/Home/lib/libjli.dylib
```

[https://github.com/konlpy/konlpy/issues/353](https://github.com/konlpy/konlpy/issues/353)

- zulu open jdk arm64용 15버전 써야 함
- 명시적으로 path를 지정

```python
JVM_PATH = '/Library/Java/JavaVirtualMachines/zulu-15.jdk/Contents/Home/bin/java'
```

- 근데 dmg로 설치할 경우 Library에 경로가 아예 안생김 🤯
   - tar 로 받아서 그냥 파일 자체를 저 경로에 넣어주고 지정하니 성공

