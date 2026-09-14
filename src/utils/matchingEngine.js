// 相性計算エンジン - 複数の要素からオタクとしての相性を計算する

/**
 * 2つの配列の一致率を計算する（Jaccard係数）
 */
function jaccardSimilarity(a, b) {
  if (!a?.length && !b?.length) return 1;
  if (!a?.length || !b?.length) return 0;
  const setA = new Set(a.map((x) => x.toLowerCase().trim()));
  const setB = new Set(b.map((x) => x.toLowerCase().trim()));
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * 2つの数値の近さを計算する（0〜1のスケール）
 * @param {number} a
 * @param {number} b
 * @param {number} max - 値の最大値
 */
function numericProximity(a, b, max = 5) {
  const diff = Math.abs((a ?? 3) - (b ?? 3));
  return 1 - diff / max;
}

/**
 * SNS活動スタイルの相性を計算する
 * 「発信側」と「受信側」は相性が良い組み合わせとして特別扱いする
 */
function calcSnsCompatibility(styleA, styleB) {
  if (styleA === styleB) return 1.0;
  // 発信と受信の組み合わせは補完的で相性が良い
  const complementary = [
    ['post', 'read'],
    ['read', 'post'],
  ];
  for (const [x, y] of complementary) {
    if (styleA === x && styleB === y) return 0.85;
  }
  return 0.4;
}

/**
 * メインの相性計算関数
 * @param {object} profileA - ユーザーAのプロフィールデータ
 * @param {object} profileB - ユーザーBのプロフィールデータ
 * @returns {object} - スコアと理由テキストの一覧
 */
export function calculateCompatibility(profileA, profileB) {
  const scores = {};
  const reasons = [];
  const differences = [];

  // 1. ジャンルの一致度
  const genreScore = jaccardSimilarity(profileA.genres, profileB.genres);
  scores.genre = genreScore;
  if (genreScore >= 0.7) {
    reasons.push('好きなジャンルがかなり近い');
  } else if (genreScore >= 0.4) {
    reasons.push('共通するジャンルがある');
  } else if (genreScore < 0.2) {
    differences.push('好きなジャンルはあまり重ならない');
  }

  // 2. 好きな作品の一致度
  const worksScore = jaccardSimilarity(profileA.works, profileB.works);
  scores.works = worksScore;
  if (worksScore >= 0.5) {
    reasons.push('好きな作品がよく一致している');
  } else if (worksScore >= 0.2) {
    reasons.push('共通して好きな作品がある');
  } else if (worksScore === 0) {
    differences.push('好きな作品は異なっている');
  }

  // 3. 推しの一致度
  const oshiScore = jaccardSimilarity(profileA.oshis, profileB.oshis);
  scores.oshi = oshiScore;
  if (oshiScore >= 0.5) {
    reasons.push('推しが一致している');
  } else if (oshiScore > 0) {
    reasons.push('共通の推しがいる');
  } else {
    // 推しは違っても、キャラの好みが似ていれば発見できる
  }

  // 4. オタク価値観の一致度
  const vals = profileA.values ?? {};
  const valsB = profileB.values ?? {};
  let valueTotal = 0;
  let valueCount = 0;

  // 単推し/箱推し傾向
  const tanchoScore = numericProximity(vals.tanchoLevel, valsB.tanchoLevel);
  valueTotal += tanchoScore;
  valueCount++;

  // キャラの内面重視度
  const naimen = numericProximity(vals.naimenLevel, valsB.naimenLevel);
  valueTotal += naimen;
  valueCount++;
  if (naimen >= 0.8) {
    reasons.push(
      vals.naimenLevel >= 3
        ? 'キャラクターの内面を重視する点が共通している'
        : 'ビジュアルを重視する点が近い'
    );
  }

  // 考察・ストーリー楽しみ方
  const kosatsu = numericProximity(vals.kosatsuLevel, valsB.kosatsuLevel);
  valueTotal += kosatsu;
  valueCount++;
  if (kosatsu >= 0.8 && vals.kosatsuLevel >= 4) {
    reasons.push('ストーリーや考察を深く楽しむ姿勢が近い');
  }

  // 二次創作への関心
  const nijisou = numericProximity(vals.nijisouLevel, valsB.nijisouLevel);
  valueTotal += nijisou;
  valueCount++;

  // ネタバレへの耐性
  const netabare = numericProximity(vals.netabareLevel, valsB.netabareLevel);
  valueTotal += netabare;
  valueCount++;
  if (netabare >= 0.8) {
    reasons.push('ネタバレに対するスタンスが近い');
  } else if (netabare < 0.4) {
    differences.push('ネタバレへの感覚に差がある');
  }

  // 同担交流スタンス
  const doudanScore = numericProximity(vals.doudanLevel, valsB.doudanLevel);
  valueTotal += doudanScore;
  valueCount++;
  if (doudanScore >= 0.8 && vals.doudanLevel >= 4) {
    reasons.push('同担との交流を積極的に楽しみたい価値観が近い');
  }

  // SNSでの感想・布教活動
  const snsPost = calcSnsCompatibility(vals.snsStyle, valsB.snsStyle);
  valueTotal += snsPost;
  valueCount++;
  if (vals.snsStyle === valsB.snsStyle && vals.snsStyle === 'post') {
    reasons.push('SNSで感想や布教を発信したいという価値観が近い');
  } else if (snsPost === 0.85) {
    reasons.push(
      'あなたが感想を読む側・相手が書く側（またはその逆）でSNS上では相性が良さそう'
    );
  }

  const valueScore = valueCount > 0 ? valueTotal / valueCount : 0;
  scores.values = valueScore;

  if (valueScore >= 0.75) {
    reasons.push('オタクとしての価値観が全体的によく一致している');
  }

  // 5. キャラの好みタイプ（好きになるキャラ傾向）
  const charTypeScore = jaccardSimilarity(
    profileA.favoriteCharTypes,
    profileB.favoriteCharTypes
  );
  scores.charType = charTypeScore;
  if (charTypeScore >= 0.5) {
    reasons.push('好きになるキャラクターのタイプが似ている');
  }

  // 6. 総合スコア（重み付き平均）
  const weights = {
    genre: 0.2,
    works: 0.15,
    oshi: 0.15,
    values: 0.35,
    charType: 0.15,
  };
  let totalScore = 0;
  for (const [key, weight] of Object.entries(weights)) {
    totalScore += (scores[key] ?? 0) * weight;
  }

  // 推しは違っても価値観が近い場合のコメント
  if (oshiScore === 0 && worksScore === 0 && valueScore >= 0.7) {
    reasons.push(
      '推している作品は異なるが、作品の楽しみ方や価値観がよく似ている'
    );
  }
  if (worksScore >= 0.5 && oshiScore === 0) {
    reasons.push('同じ作品を好きだが、推しは異なる（新しい視点を持てるかも）');
  }

  return {
    totalScore: Math.round(totalScore * 100),
    scores: {
      genre: Math.round(genreScore * 100),
      works: Math.round(worksScore * 100),
      oshi: Math.round(oshiScore * 100),
      values: Math.round(valueScore * 100),
      charType: Math.round(charTypeScore * 100),
    },
    reasons,
    differences,
  };
}
