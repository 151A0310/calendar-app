## ◆ タスク管理カレンダーアプリ
React（FullCalendar）× Spring Boot × MySQL

このアプリは React（FullCalendar）× Spring Boot × MySQL を使用した  
タスク管理カレンダーアプリです。

終日イベント・時間ありイベントの両方に対応し、  
ドラッグ＆ドロップやリサイズによる日付変更も可能です。

---

## ◆ 主な機能
- タスクの追加、更新、削除
- 終日イベント
- 時間ありイベント
- ドラッグ＆ドロップで日付移動
- リサイズで期間変更
- カラータグ機能

---

## ◆ 技術的なこだわりポイント

### 1. FullCalendar の「exclusive end」問題を完全に解決
FullCalendar は終日イベントの end を **翌日（exclusive）** として扱うため、  
DB の end（inclusive）とズレが発生する。

開発中、このズレが原因で以下の問題が発生した：
- 期間が 1 日増える  
- 期間が 1 日減る  
- リサイズで日数が狂う  

これを避けるために以下の対称ロジックを実装：
- 表示時：DB end + 1 日 → exclusive に変換  
- 保存時：exclusive end - 1 日 → inclusive に戻す  

これにより、終日イベントのズレが完全に解消された。

---

### 2. AddTask / EditTask / Calendar のロジックを完全統一
開発中、AddTask と EditTask のバリデーションがズレて  
DB に不正データが入る問題があった。

そこで以下のルールを統一：
- 日付比較は Date 型  
- 時間比較は normalizeTime 後  
- 片方だけ時間入力はエラー  
- 終日イベントは時間比較をスキップ  

これにより、AddTask / EditTask / Calendar の仕様が完全一致し、  
DB の整合性が保たれるようになった。

---

## ◆ 使用技術

### Frontend
- React
- FullCalendar（dayGrid / timeGrid / interaction）
- React Router
- CSS Modules

### Backend
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL Connector

### Database
- MySQL 8.0

---

## ◆ 今後の改善予定
- Web Push 通知機能
- カテゴリ（タグ）機能
- 検索・フィルター
- スマホ UI 最適化
- 週ビューの UI 改善
