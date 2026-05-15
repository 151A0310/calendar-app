## ◆ タスク管理カレンダーアプリ - My Calendar
React（FullCalendar）× Spring Boot × MySQL / PostgreSQL

このアプリは React（FullCalendar）× Spring Boot × MySQL / PostgreSQL を使用した  
タスク管理カレンダーアプリ- My Calendarです。

終日イベント・時間ありイベントの両方に対応し、  
ドラッグ＆ドロップやリサイズによる日付変更も可能です。

## ◆ デモ（GIF）
### タスク追加
![AddTask](https://github.com/user-attachments/assets/8e0ec631-7992-4519-819e-9c4feda4ab85)

### ドラッグ＆ドロップ
![eventDrop](https://github.com/user-attachments/assets/283a66e5-3a8a-4430-87ed-0096f1e97695)

### 時間変更（リサイズ）
![eventResize](https://github.com/user-attachments/assets/83fa53c3-624d-4d44-bc78-b1bf40a595e6)

---
## ◆ レスポンシブ対応＆PWA対応
- カレンダー画面・タスク追加・タスク編集画面は、PC/スマホの両方で最適に表示されるようにレスポンシブデザインを採用しています。
- iPhone/Androidで「ホーム画面に追加」 することで、ブラウザUIのないアプリの全画面表示が可能
---

## ◆ 主な機能
- タスクの追加、更新、削除
- 終日イベント
- 時間ありイベント
- ドラッグ＆ドロップで日付移動
- リサイズで期間変更
- カラータグ機能

---

## ◆ 技術的に苦労したポイント

### 1.FullCalendarのendが翌日になる問題を完全に解決
FullCalendarは終日イベントのendを翌日として扱うため、
DBのendを当日まで含む日付として保存するのでズレが発生する。

- （例）
- 保存時(DB) start:2026/05/12 end:2026/05/12
- 表示時(FullCalendar) start:2026/05/12 end:2026/05/13（翌日扱い）

- 開発中、このズレが原因で以下の問題が発生した：
- 期間が1日増える
- 期間が1日減る
- リサイズで日数が狂う

これを避けるために以下のロジックを実装：
- 表示時：DBのend+1日→翌日に変換
- 保存時：翌日のend-1日→当日まで含む日付に戻す

これにより、終日イベントのズレが完全に解消された。

---

### 2. AddTask / EditTask / Calendarのロジックを完全統一
開発中、AddTaskとEditTaskのバリデーションがズレて、DBに不正データが入る問題があった。

そこで以下のルールを統一：
- 日付比較はDate型
- 時間比較はnormalizeTime（24時間表記のHH:mmに統一）
- 片方だけ時間入力はエラー
- 終日イベントは時間比較をスキップ

これにより、AddTask / EditTask / Calendar の仕様が完全一致し、DBの整合性が保たれるようになった。

---

### 3. eventDrop / eventResizeが発火しない問題を解決
FullCalendar v5では、ドラッグ＆ドロップやリサイズがデフォルトでは無効になっている。

そのため、以下の設定が不足していると
eventDrop / eventResize が発火しない。
- editable: true
- eventStartEditable: true
- eventDurationEditable: true

これらを正しく設定することで、
ドラッグ＆ドロップ・リサイズの両方が安定して動作するようになった。

さらに、
イベント移動後に即座に PUT リクエストを送信する処理を実装し、
UI と DB の状態が常に同期するように改善した。
---

## ◆ 使用技術

### Frontend
- React18
- FullCalendar（@fullcalendar/core / dayGrid / timeGrid / interaction / react）
- React Router
- CSS Modules
- Create React App（react-scripts）
- PWA 対応

### Backend
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- Java
- JWT
- Lombok
- Maven

### Database
- ローカル環境：MySQL 8.0
- 本番環境：PostgreSQL（Neon）
Spring Bootのapplication-prod.propertiesで
接続先をMySQL→PostgreSQLに切り替える構成。

### Deployment
- Frontend：Vercel
- Backend：Render
- Database：Neon（PostgreSQL）
- URL:https://calendar-app-offk.vercel.app/

### テストユーザー（ログイン情報）

アプリを確認する際は、以下のテストアカウントをご利用ください。

- **メールアドレス**：test@test.com  
- **パスワード**：test
---

## ◆ 今後の改善予定
- 通知機能
- ハンバーガメニューのサブ画面（タスク一覧、テーマ切替、設定）
- 検索・フィルター
- スマホUI最適化
- 週ビューのUI改善
