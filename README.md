# HackHack

[![Product name](https://github.com/jphacks/KB_1701/blob/readme/Server/public/stylesheets/img/img_2.png)](https://www.youtube.com/channel/UC4PtjOfZTbVp9DwtJv82Lzg)

## 製品概要
### 'X Tech' × Tech

### 背景
- 近年，オープンイノベーションを狙ったハッカソンが増加している．
  ハッカソンは多様な背景をもった人が集まることで
  様々なアイデアが生まれることを期待して開催される．
  しかし，開発期間中はチーム内の交流は増えても，
  チーム間の交流は乏しい．

- ハッカソン中のコミュニケーションツールは，
  slackを利用することが多い．
  しかし，ハッカソン中におけるslackは，
  単に運営側からの連絡ツールになっていることが多く，
  チームを超えた交流を図るツールとして活用しきれていない．

- ハッカソン開催にあたり，事前にslack上で自己紹介を行う．
  しかし，自己紹介による個人情報を
  参加者間のコミュニケーションに役立てていない．

- 本プロダクトは，slack上で行われる自己紹介情報および
  各チームのgithubアカウントを基に，
  ハッカソン中における参加者間の交流促進を図る．

### 製品説明
本プロダクトは，slack上で行われる自己紹介情報をデータベース化することで，  
ハッカソン中の参加者間の交流促進を図ることを目的としている．

運営側が常に会場前方に表示しているスクリーンに本プロダクトを表示することで，  
自己紹介時に登録したgithubアカウントから各チームの開発状況を可視化する．

また，参加者自身もハッカソンを盛り上げる行為を簡単に行えるように，  
slack上の専用チャンネルを用意し，投稿した情報をスクリーン上に反映する．

### 特長
本プロダクトは，以下のことが可能となる．

#### 1. 自己紹介情報のフォーマット自動生成
##### 運営側はハッカソン開催前に行う自己紹介のフォーマットを容易に形式化でき，slack上で参加者が行う自己紹介情報を簡単にデータベース化できる．

#### 2. 参加者によるYouTube投稿
##### 参加者がslack上の専用チャンネルにYouTubeのリンクを貼ると，スクリーン上に投稿されたYouTubeが流れる．

#### 3. 中間報告やプレゼンで役立つ動画&コメント機能
##### PCのカメラから取得した映像がスクリーン上に常時流れるとともに，参加者はその映像に関するコメントをスクリーン上に映すことができる．

#### 4. チーム間のGitコミットレース
##### 各チームのgithubアカウントからコミットログを抽出し，各チームを色分けして一画面上に表示することで，全チームの開発状況が分かる．

### 解決出来ること
本プロダクトを活用することで，オープンイノベーションに必須となる
参加者間のコミュニケーションを促進できる．

### 今後の展望
今回は実現できなかったが、今後改善すること、どのように展開していくことが可能かについて記載をしてください。


## 開発内容・開発技術
### 活用した技術
#### API
* Slack
* Github
* SkyWay
* YouTube

#### フレームワーク・ライブラリ・モジュール
* node.js
* express
* mongoose
* jQuery

### 研究内容・事前開発プロダクト（任意）
ご自身やチームの研究内容や、事前に持ち込みをしたプロダクトがある場合は、こちらに実績なども含め記載をして下さい。

* 
* 


### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
- Slack上で行う自己紹介テンプレートによるDBスキーマ生成
- Slack上で行われた自己紹介情報をJSONに変換し，DBに登録する機能

* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください（任意）
