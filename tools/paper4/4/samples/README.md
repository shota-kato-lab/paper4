# Universal β Predictor — sample CSV files (v0.1)

これらは https://aiandfuture.co.jp/tool/4/ で動作確認用の sample CSV です。
各 file を tool browser 上で upload (= drag & drop or ファイル選択) すると、 既知の β_pred 結果が表示されます。

| File | Indicator | Expected β_pred (clean) | β_obs CI | Match label |
|---|---|---|---|---|
| sample_row01_roads.csv | Road network (Tier A, H=3, branch−) | 0.829 | [0.74, 0.92] | MATCH (clean ∈ CI) |
| sample_row17_patents_USPTO_2010.csv | Patents USPTO 2010 (Tier A, H=2, branch+) | 1.311 | [1.198, 1.398] | MATCH (clean ∈ CI) |
| sample_row22_patents_Bettencourt_legacy.csv | Patents Bettencourt 2007 legacy (Tier B mixture, noise) | 1.311 (clean) / 1.226 (contaminated) | [1.250, 1.290] | MATCH(noise) via bracketing |
| sample_row20_disease_AIDS.csv | Disease/AIDS (Tier B mixture) | 1.311 (clean) / 1.231 (contaminated) | [1.180, 1.290] | MATCH(noise) |
| sample_answer_data_N_Y.csv | N–Y answer data (case iii warning) | n/a (β_pred 不可) | β_obs ≈ computed | (warning: β_pred は network 構造データが別途必要) |

これらのデータは V261 §S-PanelOrigins metadata から逆生成した synthetic graph です (= app.js の SAMPLES dict と同一)。
真の USPTO/OSM 等 real data 検証は Phase B 進行中 (= GitHub repo を参照)。

ライセンス: MIT (= 公開向け、 自由再利用可)
著者: Shota Kato (AI & Future Co.) · paper4_13 build 2026-05-20
